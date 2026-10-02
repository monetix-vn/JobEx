import { mount, mountRolePicker, type ClientHandle, type UiLocale } from '@je/client-web';
import type { Run } from '@je/kernel';
import {
  FIN_ROLE,
  PROD_ROLE,
  PURCH_ROLE,
  INV_ROLE,
  QC_ROLE,
  SALES_ROLE,
  createGameHost,
  createInProcessHost,
  fastForward,
  listPlayableRoles,
} from './host';

const TURN_INTERVAL_MS = 1500;
const STORAGE_KEY = 'jobex.lang';
/** Short names for ?role= links. */
const ROLE_SHORTCUTS: Record<string, string> = {
  sales: SALES_ROLE,
  qc: QC_ROLE,
  fin: FIN_ROLE,
  prod: PROD_ROLE,
  purch: PURCH_ROLE,
  inv: INV_ROLE,
};

const params = new URLSearchParams(window.location.search);
const seed = params.get('seed') ?? 'demo';
const root = document.getElementById('app') as HTMLElement;

// Bundle the content packs into the page as raw text, keyed like a ContentSourcePort.
const contentFiles = Object.fromEntries(
  Object.entries(
    import.meta.glob('../../../content/**/*.json', {
      query: '?raw',
      import: 'default',
      eager: true,
    }) as Record<string, string>,
  ).map(([path, text]) => [path.replace(/^.*\/content\//, ''), text]),
);

const asLocale = (value: string | null | undefined): UiLocale | undefined =>
  value === 'vi' || value === 'en' ? value : undefined;

function storedLocale(): UiLocale | undefined {
  try {
    return asLocale(window.localStorage.getItem(STORAGE_KEY));
  } catch {
    return undefined; // storage can be blocked (private windows, some file:// setups)
  }
}

function rememberLocale(locale: UiLocale): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, locale);
  } catch {
    // Not remembering is fine.
  }
}

/** A link (?lang=) or the Vietnamese build forces a language; otherwise the last choice, then the browser's. */
function initialLocale(): UiLocale {
  return (
    asLocale(params.get('lang')) ??
    asLocale(window.JOBEX_FORCE_LANG) ??
    storedLocale() ??
    (window.navigator.language.toLowerCase().startsWith('vi') ? 'vi' : 'en')
  );
}

/** The wall clock only paces the demo; simulation time is the run's own turn counter. */
function pace(run: Run, turns: number, ready: () => boolean): () => void {
  const timer = window.setInterval(() => {
    if (run.isEnded) {
      window.clearInterval(timer);
      return;
    }
    if (!ready()) return;
    run.advanceTurn();
    if (run.turn >= turns) {
      window.clearInterval(timer);
      run.end();
    }
  }, TURN_INTERVAL_MS);
  return () => window.clearInterval(timer);
}

interface Session {
  roleId: string;
  handle: ClientHandle;
  run: Run;
  stop: () => void;
}

let session: Session | undefined;
let picker: { dispose(): void } | undefined;

function endSession(): void {
  session?.stop();
  session?.handle.dispose();
  session = undefined;
}

/** The "choose your job" screen. Picking starts a game; the language can be switched here too. */
async function showPicker(locale: UiLocale): Promise<void> {
  endSession();
  picker?.dispose();
  const roles = await listPlayableRoles(contentFiles, locale);
  picker = mountRolePicker(root, roles, {
    locale,
    onPick: (roleId) => {
      picker?.dispose();
      picker = undefined;
      void startGame(roleId, locale);
    },
    onLocaleChange: (next) => {
      rememberLocale(next);
      void showPicker(next);
    },
  });
}

/**
 * Starts the game for a job in a language. When switching language, the previous run's recorded
 * choices are replayed into the new run, so the player keeps their week, stats and history.
 */
async function startGame(roleId: string, locale: UiLocale, carry?: Session): Promise<void> {
  const inputs = carry ? [...carry.run.inputs] : [];
  const turn = carry ? carry.run.turn : 0;
  carry?.stop();
  carry?.handle.dispose();

  const { run, transport, turns } = await createGameHost({
    files: contentFiles,
    seed,
    roleId,
    locale,
  });
  if (carry) {
    fastForward(run, inputs, turn);
    // The same run ends the same way; a run the pacer finished at the last week needs ending here.
    if (carry.run.isEnded && !run.isEnded) run.end();
  }

  const handle = mount(root, transport, {
    locale,
    onLocaleChange: (next) => {
      rememberLocale(next);
      if (session) void startGame(session.roleId, next, session);
    },
    onRestart: () => void showPicker(locale),
  });
  let open = 0;
  run.observe((e) => {
    if (e.type === 'scene.started') open += 1;
    if (e.type === 'scene.ended') open -= 1;
  });
  session = { roleId, handle, run, stop: pace(run, turns, () => open === 0) };
}

async function start(): Promise<void> {
  if (params.get('mode') === 'stubs') {
    const { run, transport } = createInProcessHost(seed);
    mount(root, transport);
    pace(run, 52, () => true);
    return;
  }
  const locale = initialLocale();
  const requested = params.get('role');
  const roleId = requested ? (ROLE_SHORTCUTS[requested] ?? requested) : undefined;
  if (roleId) await startGame(roleId, locale);
  else await showPicker(locale);
}

void start();

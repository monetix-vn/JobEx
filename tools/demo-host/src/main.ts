import { mount, type ClientHandle, type UiLocale } from '@je/client-web';
import type { Run } from '@je/kernel';
import { createInProcessHost, createSalesHost, fastForward } from './host';

const TURN_INTERVAL_MS = 1500;
const STORAGE_KEY = 'jobex.lang';

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
  handle: ClientHandle;
  run: Run;
  stop: () => void;
}

let session: Session | undefined;

/**
 * Starts the game in a language. When switching, the previous run's recorded choices are replayed
 * into the new run, so the player keeps their week, their stats and their history.
 */
async function startSales(locale: UiLocale, carry?: Session): Promise<void> {
  const inputs = carry ? [...carry.run.inputs] : [];
  const turn = carry ? carry.run.turn : 0;
  carry?.stop();
  carry?.handle.dispose();

  const { run, transport, turns } = await createSalesHost({ files: contentFiles, seed, locale });
  if (carry) fastForward(run, inputs, turn);

  const handle = mount(root, transport, {
    locale,
    onLocaleChange: (next) => {
      rememberLocale(next);
      if (session) void startSales(next, session);
    },
  });
  let open = 0;
  run.observe((e) => {
    if (e.type === 'scene.started') open += 1;
    if (e.type === 'scene.ended') open -= 1;
  });
  session = { handle, run, stop: pace(run, turns, () => open === 0) };
}

async function start(): Promise<void> {
  if (params.get('mode') === 'stubs') {
    const { run, transport } = createInProcessHost(seed);
    mount(root, transport);
    pace(run, 52, () => true);
    return;
  }
  await startSales(initialLocale());
}

void start();

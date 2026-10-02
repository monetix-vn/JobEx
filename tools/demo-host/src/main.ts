import {
  mount,
  mountProfileForm,
  mountRolePicker,
  type ClientHandle,
  type Transport,
  type UiLocale,
} from '@je/client-web';
import type { PlayerProfile, WorldSettings } from '@je/contracts';
import { DEFAULT_WORLD_SETTINGS } from '@je/contracts';
import type { Run } from '@je/kernel';
import { profileEffects } from '@je/mod-people';
import {
  FIN_ROLE,
  PROD_ROLE,
  PURCH_ROLE,
  INV_ROLE,
  IT_ROLE,
  MKT_ROLE,
  FPA_ROLE,
  SUP_ROLE,
  HR_ROLE,
  QC_ROLE,
  SALES_ROLE,
  createGameHost,
  createInProcessHost,
  fastForward,
  listPlayableRoles,
} from './host';
import {
  deleteSlot,
  listSlots,
  makeSave,
  parseSave,
  restoreGame,
  saveFileName,
  writeSlot,
  type GameSave,
  type SlotId,
  type SlotStorage,
} from './saves';

const TURN_INTERVAL_MS = 1500;
const STORAGE_KEY = 'jobex.lang';
declare const __BUILD_INFO__: { commit: string; date: string } | undefined;

/** Short names for ?role= links. */
const ROLE_SHORTCUTS: Record<string, string> = {
  sales: SALES_ROLE,
  qc: QC_ROLE,
  fin: FIN_ROLE,
  prod: PROD_ROLE,
  purch: PURCH_ROLE,
  inv: INV_ROLE,
  it: IT_ROLE,
  mkt: MKT_ROLE,
  fpa: FPA_ROLE,
  sup: SUP_ROLE,
  hr: HR_ROLE,
};

const params = new URLSearchParams(window.location.search);
const root = document.getElementById('app') as HTMLElement;

/** A new game gets a new seed (a link with ?seed= pins it, for testing and for sharing a run). */
function newSeed(): string {
  return (
    params.get('seed') ??
    `${Date.now().toString(36)}-${Math.floor(Math.random() * 1_000_000).toString(36)}`
  );
}

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

function browserStorage(): SlotStorage | undefined {
  try {
    const s = window.localStorage;
    s.getItem('jobex.probe');
    return s;
  } catch {
    return undefined; // storage can be blocked (private windows, some file:// setups)
  }
}

function storedLocale(): UiLocale | undefined {
  return asLocale(browserStorage()?.getItem(STORAGE_KEY));
}

function rememberLocale(locale: UiLocale): void {
  try {
    browserStorage()?.setItem(STORAGE_KEY, locale);
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

/* ------------------------------------------------------------------ text of the shell (bar and panels) */

const SHELL = {
  en: {
    pause: 'Pause',
    resume: 'Resume',
    speed: 'Speed',
    nextWeek: 'Next week',
    save: 'Save / Load',
    menu: 'Menu',
    panelTitle: 'Save and load',
    slot: 'Slot',
    auto: 'Autosave',
    empty: 'empty',
    saveHere: 'Save here',
    load: 'Load',
    remove: 'Delete',
    exportFile: 'Export to a file',
    importFile: 'Import from a file',
    close: 'Close',
    saved: 'Saved.',
    loaded: 'Loaded.',
    badFile: 'That file is not a usable save: ',
    noSession: 'Start a game first to save it.',
    leave: 'Back to the menu? Your game is autosaved.',
    week: 'week',
    noStorage: 'This browser cannot keep saves here; use Export to a file.',
    building: 'Building',
  },
  vi: {
    pause: 'Tạm dừng',
    resume: 'Tiếp tục',
    speed: 'Tốc độ',
    nextWeek: 'Tuần sau',
    save: 'Lưu / Tải',
    menu: 'Menu',
    panelTitle: 'Lưu và tải game',
    slot: 'Ô lưu',
    auto: 'Tự động lưu',
    empty: 'trống',
    saveHere: 'Lưu vào đây',
    load: 'Tải',
    remove: 'Xóa',
    exportFile: 'Xuất ra tệp',
    importFile: 'Nhập từ tệp',
    close: 'Đóng',
    saved: 'Đã lưu.',
    loaded: 'Đã tải.',
    badFile: 'Tệp này không phải bản lưu dùng được: ',
    noSession: 'Hãy bắt đầu một game trước khi lưu.',
    leave: 'Về menu? Game của bạn đã được tự động lưu.',
    week: 'tuần',
    noStorage: 'Trình duyệt này không giữ được bản lưu; hãy dùng Xuất ra tệp.',
    building: 'Bản dựng',
  },
} as const;

/* ------------------------------------------------------------------ pacing */

/** The wall clock only paces the game; simulation time is the run's own turn counter. */
interface Pacer {
  stop(): void;
  paused(): boolean;
  setPaused(paused: boolean): void;
  speed(): 1 | 2;
  setSpeed(speed: 1 | 2): void;
  next(): void;
}

function makePacer(
  run: Run,
  turns: number,
  settings: WorldSettings,
  ready: () => boolean,
  onTurn: () => void,
): Pacer {
  let paused = false;
  let speed: 1 | 2 = 1;
  let timer: number | undefined;
  const step = (): void => {
    if (run.isEnded) return;
    if (!ready()) return;
    run.advanceTurn();
    onTurn();
    if (run.turn >= turns) {
      stop();
      run.end();
    }
  };
  const schedule = (): void => {
    if (timer !== undefined) window.clearInterval(timer);
    timer = undefined;
    // "Thoughtful": time moves only when the player asks for the next week.
    if (settings.time_mode === 'thoughtful' || paused) return;
    timer = window.setInterval(step, TURN_INTERVAL_MS / speed);
  };
  const stop = (): void => {
    if (timer !== undefined) window.clearInterval(timer);
    timer = undefined;
  };
  schedule();
  return {
    stop,
    paused: () => paused,
    setPaused: (p) => {
      paused = p;
      schedule();
    },
    speed: () => speed,
    setSpeed: (s) => {
      speed = s;
      schedule();
    },
    next: step,
  };
}

/* ------------------------------------------------------------------ session */

interface Setup {
  seed: string;
  profile?: PlayerProfile;
  settings: WorldSettings;
}

interface Session {
  roleId: string;
  title: string;
  setup: Setup;
  locale: UiLocale;
  handle: ClientHandle;
  run: Run;
  pacer: Pacer;
  stop: () => void;
}

let session: Session | undefined;
let picker: { dispose(): void } | undefined;
let currentLocale: UiLocale = initialLocale();
const BUILD = typeof __BUILD_INFO__ === 'undefined' ? undefined : __BUILD_INFO__;
const buildLabel = (): string => (BUILD ? `${BUILD.commit} ${BUILD.date}` : 'dev');

function endSession(): void {
  session?.stop();
  session?.handle.dispose();
  session = undefined;
}

function saveOf(s: Session): GameSave {
  return makeSave(
    {
      seed: s.setup.seed,
      roleId: s.roleId,
      title: s.title,
      locale: s.locale,
      ...(s.setup.profile ? { profile: s.setup.profile } : {}),
      settings: s.setup.settings,
      run: s.run,
    },
    new Date().toISOString(),
    buildLabel(),
  );
}

function autosave(): void {
  const storage = browserStorage();
  if (!storage || !session || session.run.isEnded) return;
  try {
    writeSlot(storage, 'auto', saveOf(session));
  } catch {
    // A full or blocked storage must never stop the game.
  }
}

async function titleOf(roleId: string, locale: UiLocale): Promise<string> {
  const roles = await listPlayableRoles(contentFiles, locale);
  return roles.find((r) => r.id === roleId)?.title ?? roleId;
}

/** The "choose your job" screen. Picking a job leads to the profile and settings screens. */
async function showPicker(locale: UiLocale): Promise<void> {
  endSession();
  picker?.dispose();
  currentLocale = locale;
  const roles = await listPlayableRoles(contentFiles, locale);
  picker = mountRolePicker(root, roles, {
    locale,
    onPick: (roleId) => {
      picker?.dispose();
      picker = undefined;
      showProfile(roleId, locale, roles.find((r) => r.id === roleId)?.title ?? roleId);
    },
    onLocaleChange: (next) => {
      rememberLocale(next);
      void showPicker(next);
    },
  });
  showBuildLine(roles.length, locale);
  renderBar();
}

/** Who are you, and how should the year run: shown after a job is picked. */
function showProfile(roleId: string, locale: UiLocale, title: string): void {
  currentLocale = locale;
  picker = mountProfileForm(root, {
    locale,
    jobTitle: title,
    random: Math.random,
    describeEffects: (profile) => {
      const e = profileEffects(profile);
      return {
        stress: e.add['player.stress'] ?? 0,
        pressure: Number(e.set['profile.money_pressure'] ?? 0),
        boss: e.add['player.rep.boss'] ?? 0,
      };
    },
    onStart: (profile, settings) => {
      picker?.dispose();
      picker = undefined;
      void startGame(roleId, locale, { seed: newSeed(), profile, settings });
    },
    onBack: () => void showPicker(locale),
    onLocaleChange: (next) => {
      rememberLocale(next);
      picker?.dispose();
      showProfile(roleId, next, title);
    },
  });
  renderBar();
}

/** A small line under the picker: which build this is, how many jobs it has, and what is not there yet. */
function showBuildLine(jobs: number, locale: UiLocale): void {
  const line = document.createElement('p');
  line.style.cssText = 'font:12px monospace;color:#9a9ac0;text-align:center;margin:14px 8px';
  const when = BUILD ? `build ${BUILD.commit}, ${BUILD.date}` : 'development build';
  line.textContent =
    locale === 'vi'
      ? `${when} - ${jobs} công việc - chưa có: lưu vào thư mục, thế giới người chơi, rút gọn năm`
      : `${when} - ${jobs} jobs - not in the game yet: folder saves, the people world, shorter years`;
  root.append(line);
}

/**
 * Starts the game for a job in a language. When switching language, the previous run's recorded
 * choices are replayed into the new run, so the player keeps their week, stats and history.
 */
async function startGame(
  roleId: string,
  locale: UiLocale,
  setup: Setup,
  carry?: Session,
  restored?: { run: Run; turns: number },
): Promise<void> {
  const inputs = carry ? [...carry.run.inputs] : [];
  const turn = carry ? carry.run.turn : 0;
  carry?.stop();
  carry?.handle.dispose();
  currentLocale = locale;

  const title = carry?.title ?? (await titleOf(roleId, locale));
  const host =
    restored ??
    (await createGameHost({
      files: contentFiles,
      seed: setup.seed,
      roleId,
      locale,
      ...(setup.profile ? { profile: setup.profile } : {}),
    }));
  const { run, turns } = host;
  if (carry) {
    fastForward(run, inputs, turn);
    // The same run ends the same way; a run the pacer finished at the last week needs ending here.
    if (carry.run.isEnded && !run.isEnded) run.end();
  }

  const handle = mount(root, transportOf(run), {
    locale,
    onLocaleChange: (next) => {
      rememberLocale(next);
      if (session) void startGame(session.roleId, next, session.setup, session);
    },
    onRestart: () => void showPicker(locale),
  });
  let open = 0;
  run.observe((e) => {
    if (e.type === 'scene.started') open += 1;
    if (e.type === 'scene.ended') open -= 1;
  });
  const pacer = makePacer(
    run,
    turns,
    setup.settings,
    () => open === 0,
    () => {
      if (run.turn % 4 === 0) autosave();
    },
  );
  session = {
    roleId,
    title,
    setup,
    locale,
    handle,
    run,
    pacer,
    stop: pacer.stop,
  };
  autosave();
  renderBar();
}

function transportOf(run: Run): Transport {
  return {
    subscribe: (listener) => run.observe(listener),
    send: (type, payload) => {
      run.submit(type, payload);
    },
  };
}

/** Loads a save: a fresh run replays its inputs and the game continues from the same week. */
async function loadSave(save: GameSave): Promise<void> {
  endSession();
  picker?.dispose();
  picker = undefined;
  const host = await restoreGame(contentFiles, save);
  await startGame(
    save.roleId,
    save.locale,
    {
      seed: save.seed,
      ...(save.profile ? { profile: save.profile } : {}),
      settings: { ...DEFAULT_WORLD_SETTINGS, ...save.settings },
    },
    undefined,
    { run: host.run, turns: host.turns },
  );
}

/* ------------------------------------------------------------------ the control bar and the save panel */

const bar = document.createElement('div');
bar.style.cssText =
  'max-width:560px;margin:0 auto;padding:8px 12px 0;font:13px ui-monospace,Menlo,Consolas,monospace;display:flex;gap:6px;flex-wrap:wrap;align-items:center';
root.before(bar);
const panel = document.createElement('div');
panel.style.cssText =
  'max-width:560px;margin:8px auto 0;padding:0 12px;font:13px ui-monospace,Menlo,Consolas,monospace;color:#eee';
root.before(panel);

function barButton(
  label: string,
  onClick: () => void,
  on = false,
  disabled = false,
): HTMLButtonElement {
  const b = document.createElement('button');
  b.type = 'button';
  b.textContent = label;
  b.disabled = disabled;
  b.style.cssText = `font:inherit;color:${on ? '#111' : '#eee'};background:${on ? '#ffd166' : '#33335a'};border:3px solid #eee;padding:2px 8px;cursor:${disabled ? 'default' : 'pointer'};opacity:${disabled ? 0.5 : 1}`;
  b.addEventListener('click', onClick);
  return b;
}

function renderBar(): void {
  const t = SHELL[currentLocale];
  bar.replaceChildren();
  const s = session;
  if (s && !s.run.isEnded) {
    const thoughtful = s.setup.settings.time_mode === 'thoughtful';
    if (thoughtful) {
      bar.append(
        barButton(t.nextWeek, () => {
          s.pacer.next();
          renderBar();
        }),
      );
    } else {
      bar.append(
        barButton(
          s.pacer.paused() ? t.resume : t.pause,
          () => {
            s.pacer.setPaused(!s.pacer.paused());
            renderBar();
          },
          s.pacer.paused(),
        ),
        barButton(s.pacer.speed() === 2 ? '2x' : '1x', () => {
          s.pacer.setSpeed(s.pacer.speed() === 1 ? 2 : 1);
          renderBar();
        }),
      );
    }
  }
  bar.append(
    barButton(t.save, () => togglePanel()),
    barButton(t.menu, () => {
      if (session) {
        if (!window.confirm(t.leave)) return;
        autosave();
      }
      void showPicker(currentLocale);
    }),
  );
}

let panelOpen = false;
let panelMessage = '';
function togglePanel(): void {
  panelOpen = !panelOpen;
  panelMessage = '';
  renderPanel();
}

function describeSave(save: GameSave, t: (typeof SHELL)[UiLocale]): string {
  const who = save.profile?.name ? `${save.profile.name}, ` : '';
  return `${who}${save.title} - ${t.week} ${save.turn} - ${save.savedAt.slice(0, 16).replace('T', ' ')}`;
}

function renderPanel(): void {
  panel.replaceChildren();
  if (!panelOpen) return;
  const t = SHELL[currentLocale];
  const storage = browserStorage();
  const box = document.createElement('div');
  box.style.cssText = 'border:3px solid #ffd166;background:#13132a;padding:8px';
  const title = document.createElement('b');
  title.textContent = t.panelTitle;
  title.style.color = '#ffd166';
  box.append(title);
  if (!storage) box.append(note(t.noStorage));
  const slots = storage ? listSlots(storage) : [];
  for (const { slot, save } of slots) {
    const row = document.createElement('div');
    row.style.cssText = 'display:flex;gap:6px;flex-wrap:wrap;align-items:center;margin:6px 0';
    const label = document.createElement('span');
    label.style.cssText = 'flex:1 1 220px';
    label.textContent = `${slot === 'auto' ? t.auto : `${t.slot} ${slot}`}: ${save ? describeSave(save, t) : t.empty}`;
    row.append(label);
    if (slot !== 'auto') {
      row.append(
        barButton(t.saveHere, () => {
          if (!session) {
            panelMessage = t.noSession;
            renderPanel();
            return;
          }
          try {
            writeSlot(storage!, slot as SlotId, saveOf(session));
            panelMessage = t.saved;
          } catch {
            panelMessage = t.noStorage;
          }
          renderPanel();
        }),
      );
    }
    row.append(
      barButton(
        t.load,
        () => {
          if (save) {
            panelOpen = false;
            panelMessage = '';
            renderPanel();
            void loadSave(save);
          }
        },
        false,
        !save,
      ),
    );
    if (slot !== 'auto')
      row.append(
        barButton(
          t.remove,
          () => {
            deleteSlot(storage!, slot as SlotId);
            renderPanel();
          },
          false,
          !save,
        ),
      );
    box.append(row);
  }
  const files = document.createElement('div');
  files.style.cssText = 'display:flex;gap:6px;flex-wrap:wrap;margin-top:8px';
  files.append(
    barButton(t.exportFile, () => {
      if (!session) {
        panelMessage = t.noSession;
        renderPanel();
        return;
      }
      const save = saveOf(session);
      const url = URL.createObjectURL(
        new Blob([JSON.stringify(save, null, 2)], { type: 'application/json' }),
      );
      const a = document.createElement('a');
      a.href = url;
      a.download = saveFileName(save);
      a.click();
      URL.revokeObjectURL(url);
    }),
  );
  const picker2 = document.createElement('input');
  picker2.type = 'file';
  picker2.accept = '.json,application/json';
  picker2.style.display = 'none';
  picker2.addEventListener('change', () => {
    const file = picker2.files?.[0];
    if (!file) return;
    void file.text().then((text) => {
      const parsed = parseSave(text);
      if (!parsed.ok) {
        panelMessage = t.badFile + parsed.error;
        renderPanel();
        return;
      }
      panelOpen = false;
      panelMessage = t.loaded;
      renderPanel();
      void loadSave(parsed.save);
    });
  });
  files.append(
    barButton(t.importFile, () => picker2.click()),
    picker2,
    barButton(t.close, () => togglePanel()),
  );
  box.append(files);
  if (panelMessage) box.append(note(panelMessage));
  panel.append(box);
}

function note(text: string): HTMLElement {
  const p = document.createElement('p');
  p.textContent = text;
  p.style.cssText = 'margin:6px 0 0;color:#9ad1ff';
  return p;
}

/* ------------------------------------------------------------------ start */

async function start(): Promise<void> {
  if (params.get('mode') === 'stubs') {
    const { run, transport } = createInProcessHost(newSeed());
    mount(root, transport);
    const timer = window.setInterval(() => {
      if (run.isEnded) {
        window.clearInterval(timer);
        return;
      }
      run.advanceTurn();
      if (run.turn >= 52) {
        window.clearInterval(timer);
        run.end();
      }
    }, TURN_INTERVAL_MS);
    return;
  }
  const locale = initialLocale();
  currentLocale = locale;
  const requested = params.get('role');
  const roleId = requested ? (ROLE_SHORTCUTS[requested] ?? requested) : undefined;
  if (roleId)
    await startGame(roleId, locale, {
      seed: params.get('seed') ?? 'demo',
      settings: { ...DEFAULT_WORLD_SETTINGS },
    });
  else await showPicker(locale);
}

void start();

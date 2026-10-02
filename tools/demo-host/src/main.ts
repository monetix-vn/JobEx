import {
  impressionLine,
  mount,
  mountProfileForm,
  mountRolePicker,
  type ClientHandle,
  type Transport,
  type UiLocale,
  type WorldChoice,
} from '@je/client-web';
import type { PeopleLibrary, PlayerProfile, World, WorldSettings } from '@je/contracts';
import { DEFAULT_WORLD_SETTINGS } from '@je/contracts';
import type { Run } from '@je/kernel';
import {
  advanceWorldYear,
  createWorld,
  ensureRoster,
  nextRunSeed,
  profileEffects,
  retireProtagonist,
} from '@je/mod-people';
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
  type PeopleSource,
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
import {
  SaveHostClient,
  dossierOf,
  impressionsFromSnapshot,
  libraryFromFiles,
  summariseRun,
  worldIdFrom,
} from './world-bridge';

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

// The people library (archetypes, quirks, names, data tables) is bundled too, keyed by file name.
const libraryFiles = Object.fromEntries(
  Object.entries(
    import.meta.glob('../../../library/*.json', {
      query: '?raw',
      import: 'default',
      eager: true,
    }) as Record<string, string>,
  ).map(([path, text]) => [path.replace(/^.*\/library\//, ''), text]),
);
let peopleLibraryCache: PeopleLibrary | undefined;
const peopleLibrary = (): PeopleLibrary => (peopleLibraryCache ??= libraryFromFiles(libraryFiles));
const saveHost = new SaveHostClient();

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
    running: 'RUNNING',
    paused: 'PAUSED',
    stay: 'Stay',
    leaveYes: 'Back to menu',
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
    people: 'People',
    peopleTitle: 'People in this world',
    peopleIntro: 'What you can see of them. Their character you learn over time.',
    noWorld:
      'This game is not in a world. Start the save host (save-host.bat) and choose a world when you start a game.',
    newsTitle: 'Meanwhile in the world',
    newsYear: 'a year passes: year',
    newsLives: 'lives on in the world. Start a new game and choose Continue to meet them.',
    newsSaved: 'The world was saved.',
    newsFailed: 'The world could not be saved: ',
    retired: 'retired',
    noNews: 'Nothing notable happened.',
  },
  vi: {
    pause: 'Tạm dừng',
    resume: 'Tiếp tục',
    running: 'ĐANG CHẠY',
    paused: 'ĐANG DỪNG',
    stay: 'Ở lại',
    leaveYes: 'Về menu',
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
    people: 'Mọi người',
    peopleTitle: 'Những người trong thế giới này',
    peopleIntro: 'Những gì bạn thấy được về họ. Tính cách của họ bạn sẽ dần hiểu theo thời gian.',
    noWorld:
      'Game này không nằm trong thế giới nào. Hãy bật máy chủ lưu game (save-host.bat) và chọn thế giới khi bắt đầu game.',
    newsTitle: 'Trong khi đó ở thế giới',
    newsYear: 'một năm trôi qua: năm',
    newsLives: 'vẫn sống tiếp trong thế giới. Hãy bắt đầu game mới và chọn Tiếp tục để gặp lại.',
    newsSaved: 'Thế giới đã được lưu.',
    newsFailed: 'Không lưu được thế giới: ',
    retired: 'đã nghỉ hưu',
    noNews: 'Không có gì đáng chú ý.',
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
  /** The world this game belongs to (kept by the save host), as it was when the game started. */
  world?: World;
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
      ...(s.setup.world ? { worldId: s.setup.world.id } : {}),
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
      void showProfile(roleId, locale, roles.find((r) => r.id === roleId)?.title ?? roleId);
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
async function showProfile(roleId: string, locale: UiLocale, title: string): Promise<void> {
  currentLocale = locale;
  const hostUp = await saveHost.available();
  const worlds = hostUp ? await saveHost.list().catch(() => []) : undefined;
  picker = mountProfileForm(root, {
    locale,
    jobTitle: title,
    random: Math.random,
    hostAvailable: hostUp,
    ...(worlds ? { worlds } : {}),
    describeEffects: (profile) => {
      const e = profileEffects(profile);
      return {
        stress: e.add['player.stress'] ?? 0,
        pressure: Number(e.set['profile.money_pressure'] ?? 0),
        boss: e.add['player.rep.boss'] ?? 0,
      };
    },
    onStart: (profile, settings, choice) => {
      picker?.dispose();
      picker = undefined;
      void beginGame(roleId, locale, profile, settings, choice);
    },
    onBack: () => void showPicker(locale),
    onLocaleChange: (next) => {
      rememberLocale(next);
      picker?.dispose();
      void showProfile(roleId, next, title);
    },
  });
  renderBar();
}

/** Starts a new game, in a world when the player chose one: a new world, or an old one continued with a new seed. */
async function beginGame(
  roleId: string,
  locale: UiLocale,
  profile: PlayerProfile,
  settings: WorldSettings,
  choice: WorldChoice | undefined,
): Promise<void> {
  let world: World | undefined;
  try {
    if (choice?.kind === 'continue') {
      world = ensureRoster(peopleLibrary(), await saveHost.get(choice.id));
    } else if (choice?.kind === 'new') {
      const existing = (await saveHost.list()).map((w) => w.id);
      world = ensureRoster(
        peopleLibrary(),
        createWorld({
          id: worldIdFrom(choice.name, existing),
          name: choice.name,
          worldSeed: newSeed(),
          settings,
          createdAt: new Date().toISOString(),
        }),
      );
    }
    if (world) await saveHost.put(world);
  } catch {
    world = undefined; // no host or an unreadable world: the game still plays, just not in a world
  }
  await startGame(roleId, locale, {
    seed: world ? nextRunSeed(world) : newSeed(),
    profile,
    settings,
    ...(world ? { world } : {}),
  });
}

/** A small line under the picker: which build this is, how many jobs it has, and what is not there yet. */
function showBuildLine(jobs: number, locale: UiLocale): void {
  const line = document.createElement('p');
  line.style.cssText = 'font:12px monospace;color:#9a9ac0;text-align:center;margin:14px 8px';
  const when = BUILD ? `build ${BUILD.commit}, ${BUILD.date}` : 'development build';
  line.textContent =
    locale === 'vi'
      ? `${when} - ${jobs} công việc - chưa có: rút gọn năm`
      : `${when} - ${jobs} jobs - not in the game yet: shorter years`;
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
      people: peopleSourceOf(setup.world),
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
  run.observe((e) => {
    if (e.type === 'run.ended') {
      const ending = (e.payload as { ending?: string }).ending ?? 'completed';
      void onRunEnded(roleId, setup, run, ending);
    }
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

/** Where the people in scenes come from: the world's roster when there is a world, otherwise made up for the run. */
function peopleSourceOf(world: World | undefined): PeopleSource {
  return {
    library: peopleLibrary(),
    ...(world ? { worldSeed: world.world_seed, roster: world.people } : {}),
  };
}

/** Loads a save: a fresh run replays its inputs and the game continues from the same week. */
async function loadSave(save: GameSave): Promise<void> {
  endSession();
  picker?.dispose();
  picker = undefined;
  let world: World | undefined;
  if (save.world_id) {
    try {
      world = await saveHost.get(save.world_id);
    } catch {
      world = undefined;
    }
  }
  const host = await restoreGame(contentFiles, save, undefined, peopleSourceOf(world));
  await startGame(
    save.roleId,
    save.locale,
    {
      seed: save.seed,
      ...(save.profile ? { profile: save.profile } : {}),
      settings: { ...DEFAULT_WORLD_SETTINGS, ...save.settings },
      ...(world ? { world } : {}),
    },
    undefined,
    { run: host.run, turns: host.turns },
  );
}

/* ------------------------------------------------------------------ the control bar and the save panel */

const barStyle = document.createElement('style');
barStyle.textContent =
  '.je-barwrap{max-width:560px;margin:0 auto}@media (min-width:900px){.je-barwrap[data-wide="true"]{max-width:1000px}}';
document.head.append(barStyle);
const bar = document.createElement('div');
bar.className = 'je-barwrap';
bar.style.cssText =
  'padding:8px 12px 0;font:13px ui-monospace,Menlo,Consolas,monospace;display:flex;gap:6px;flex-wrap:wrap;align-items:center;box-sizing:border-box';
root.before(bar);
const panel = document.createElement('div');
panel.className = 'je-barwrap';
panel.style.cssText =
  'margin-top:8px;padding:0 12px;font:13px ui-monospace,Menlo,Consolas,monospace;color:#eee;box-sizing:border-box';
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
  bar.dataset.wide = String(Boolean(s));
  panel.dataset.wide = String(Boolean(s));
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
      const state = document.createElement('span');
      state.textContent = s.pacer.paused() ? t.paused : `${t.running} ${s.pacer.speed()}x`;
      state.style.cssText = `padding:2px 6px;border:3px solid ${s.pacer.paused() ? '#ff6b6b' : '#8fe388'};color:${s.pacer.paused() ? '#ff6b6b' : '#8fe388'}`;
      bar.append(
        state,
        barButton(
          s.pacer.paused() ? t.resume : t.pause,
          () => {
            s.pacer.setPaused(!s.pacer.paused());
            renderBar();
          },
          s.pacer.paused(),
        ),
        barButton(`${t.speed} ${s.pacer.speed() === 2 ? '2x' : '1x'}`, () => {
          s.pacer.setSpeed(s.pacer.speed() === 1 ? 2 : 1);
          renderBar();
        }),
      );
    }
  }
  bar.append(
    ...(s?.setup.world ? [barButton(t.people, () => togglePanel('people'))] : []),
    barButton(t.save, () => togglePanel('saves')),
    barButton(t.menu, () => {
      // Leaving a game asks first, in the page (a browser dialog can be blocked and looks like a dead button).
      if (session) togglePanel('leave');
      else void showPicker(currentLocale);
    }),
  );
}

let panelOpen = false;
let panelView: 'saves' | 'people' | 'news' | 'leave' = 'saves';
let panelMessage = '';
let newsLines: string[] = [];
function togglePanel(view: 'saves' | 'people' | 'news' | 'leave' = 'saves'): void {
  panelOpen = panelOpen && panelView === view ? false : true;
  panelView = view;
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
  if (panelView === 'people') return renderPeoplePanel();
  if (panelView === 'news') return renderNewsPanel();
  if (panelView === 'leave') return renderLeavePanel();
  renderSavePanel();
}

function renderSavePanel(): void {
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

/* ------------------------------------------------------------------ the world: people and the end of a run */

const handledRuns = new Set<string>();

/** When a run ends in a world: the protagonist stays as an autonomous person, a year passes, and the world is saved. */
async function onRunEnded(roleId: string, setup: Setup, run: Run, ending: string): Promise<void> {
  const world = setup.world;
  const t = SHELL[currentLocale];
  if (!world || handledRuns.has(setup.seed)) return;
  handledRuns.add(setup.seed);
  try {
    const library = peopleLibrary();
    const summary = await summariseRun(contentFiles, run, roleId, ending, setup.profile);
    const retired = retireProtagonist(library, world, summary, setup.seed);
    const aged = advanceWorldYear(library, retired.world);
    await saveHost.put(aged.world);
    if (session && session.setup === setup) session.setup = { ...setup, world: aged.world };
    const name = [
      retired.person.origin.name.family,
      retired.person.origin.name.middle,
      retired.person.origin.name.given,
    ]
      .filter(Boolean)
      .join(' ');
    const events = aged.lore.slice(0, 14).map((l) => (currentLocale === 'vi' ? l.vi : l.en));
    newsLines = [
      `${t.newsYear} ${aged.world.year}.`,
      `${name} ${t.newsLives}`,
      ...(events.length > 0 ? events : [t.noNews]),
      t.newsSaved,
    ];
  } catch (error) {
    newsLines = [t.newsFailed + (error instanceof Error ? error.message : String(error))];
  }
  panelOpen = true;
  panelView = 'news';
  renderPanel();
}

function panelBox(title: string): HTMLElement {
  const box = document.createElement('div');
  box.style.cssText = 'border:3px solid #ffd166;background:#13132a;padding:8px';
  const heading = document.createElement('b');
  heading.textContent = title;
  heading.style.color = '#ffd166';
  box.append(heading);
  return box;
}

function renderLeavePanel(): void {
  const t = SHELL[currentLocale];
  const box = panelBox(t.menu);
  box.append(note(t.leave));
  const row = document.createElement('div');
  row.style.cssText = 'display:flex;gap:6px;margin-top:8px';
  row.append(
    barButton(t.leaveYes, () => {
      panelOpen = false;
      renderPanel();
      autosave();
      void showPicker(currentLocale);
    }),
    barButton(t.stay, () => togglePanel('leave')),
  );
  box.append(row);
  panel.append(box);
}

function renderNewsPanel(): void {
  const t = SHELL[currentLocale];
  const box = panelBox(t.newsTitle);
  const list = document.createElement('ul');
  list.style.cssText = 'margin:6px 0;padding-left:18px';
  for (const line of newsLines) {
    const li = document.createElement('li');
    li.textContent = line;
    list.append(li);
  }
  box.append(
    list,
    barButton(t.close, () => togglePanel('news')),
  );
  panel.append(box);
}

function renderPeoplePanel(): void {
  const t = SHELL[currentLocale];
  const box = panelBox(t.peopleTitle);
  box.append(note(t.peopleIntro));
  const world = session?.setup.world;
  if (!world) {
    box.append(note(t.noWorld));
  } else {
    const departments = new Map<string, string>();
    void listPlayableRoles(contentFiles, currentLocale).then((roles) => {
      for (const r of roles)
        departments.set(r.department.replace(/^dept\./, ''), r.departmentTitle);
      list.replaceChildren(...rowsFor(world, departments));
    });
    const list = document.createElement('div');
    list.style.cssText = 'max-height:320px;overflow:auto;margin-top:6px';
    list.replaceChildren(...rowsFor(world, departments));
    box.append(list);
  }
  box.append(barButton(t.close, () => togglePanel('people')));
  panel.append(box);
}

function rowsFor(world: World, departments: Map<string, string>): HTMLElement[] {
  const t = SHELL[currentLocale];
  const impressions = session
    ? impressionsFromSnapshot(session.run.snapshot()['perception'], peopleLibrary())
    : {};
  const nameOf = (id: string): string => departments.get(id) ?? id.replace(/_/g, ' ');
  return dossierOf(world, currentLocale, nameOf)
    .slice(0, 80)
    .map((e) => {
      const row = document.createElement('div');
      row.style.cssText = `margin:4px 0;padding:4px 6px;border-left:3px solid ${e.legacy ? '#ffd166' : '#556'}`;
      const head = document.createElement('b');
      head.textContent = e.name;
      const detail = document.createElement('div');
      detail.style.cssText = 'color:#bbb;font-size:12px';
      detail.textContent = [e.position, e.department, e.ageBand, e.look, e.retired ? t.retired : '']
        .filter(Boolean)
        .join(' - ');
      row.append(head, detail);
      if (!e.legacy && impressions[e.id]) {
        const seen = document.createElement('div');
        seen.style.cssText = 'color:#9fd8a8;font-size:12px';
        seen.textContent = impressionLine(impressions[e.id], currentLocale);
        row.append(seen);
      }
      if (e.legacy) {
        const l = document.createElement('div');
        l.style.cssText = 'color:#ffd166;font-size:12px';
        l.textContent = e.legacy;
        row.append(l);
      }
      return row;
    });
}

import type { Locale, PlayerProfile, RecordedInput, WorldSettings } from '@je/contracts';
import { DEFAULT_WORLD_SETTINGS } from '@je/contracts';
import type { Run } from '@je/kernel';
import { createGameHost, fastForward, type GameHost } from './host';

/**
 * Saving a game. A run is its seed plus the player's inputs (ADR 0004 builds on this), so a save is small:
 * the seed, the job, the profile and settings, the week reached and every input made so far. Loading
 * starts a fresh run and replays them, which reaches the identical state.
 */
export const SAVE_FORMAT = 1;

export interface GameSave {
  format: typeof SAVE_FORMAT;
  /** Which build wrote it, for support (not used to load). */
  build?: string;
  savedAt: string;
  seed: string;
  roleId: string;
  /** The role's title when saved, so a save can be listed without loading content. */
  title: string;
  locale: Locale;
  profile?: PlayerProfile;
  settings: WorldSettings;
  turn: number;
  inputs: RecordedInput[];
}

export interface SaveSource {
  seed: string;
  roleId: string;
  title: string;
  locale: Locale;
  profile?: PlayerProfile;
  settings: WorldSettings;
  run: Pick<Run, 'turn' | 'inputs'>;
}

export function makeSave(source: SaveSource, savedAt: string, build?: string): GameSave {
  return {
    format: SAVE_FORMAT,
    ...(build ? { build } : {}),
    savedAt,
    seed: source.seed,
    roleId: source.roleId,
    title: source.title,
    locale: source.locale,
    ...(source.profile ? { profile: source.profile } : {}),
    settings: source.settings,
    turn: source.run.turn,
    inputs: [...source.run.inputs],
  };
}

export type ParsedSave = { ok: true; save: GameSave } | { ok: false; error: string };

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

/** Reads a save from text (a file or a stored slot) and checks its shape; it never trusts the content. */
export function parseSave(text: string): ParsedSave {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return { ok: false, error: 'not a JobEx save (could not read it)' };
  }
  if (!isRecord(raw) || raw.format !== SAVE_FORMAT) {
    return {
      ok: false,
      error: `unsupported save format ${isRecord(raw) ? String(raw.format) : '?'}`,
    };
  }
  const { seed, roleId, title, locale, turn, inputs, savedAt } = raw;
  if (typeof seed !== 'string' || seed === '') return { ok: false, error: 'the save has no seed' };
  if (typeof roleId !== 'string' || !roleId.startsWith('role.'))
    return { ok: false, error: 'the save has no job' };
  if (locale !== 'en' && locale !== 'vi')
    return { ok: false, error: 'the save has an unknown language' };
  if (typeof turn !== 'number' || !Number.isInteger(turn) || turn < 0 || turn > 520) {
    return { ok: false, error: 'the save has an invalid week' };
  }
  if (!Array.isArray(inputs) || !inputs.every(validInput))
    return { ok: false, error: 'the save has invalid inputs' };
  const settings = isRecord(raw.settings)
    ? { ...DEFAULT_WORLD_SETTINGS, ...raw.settings }
    : { ...DEFAULT_WORLD_SETTINGS };
  const save: GameSave = {
    format: SAVE_FORMAT,
    ...(typeof raw.build === 'string' ? { build: raw.build } : {}),
    savedAt: typeof savedAt === 'string' ? savedAt : '',
    seed,
    roleId,
    title: typeof title === 'string' ? title : roleId,
    locale,
    ...(isRecord(raw.profile) ? { profile: raw.profile as unknown as PlayerProfile } : {}),
    settings: settings as WorldSettings,
    turn,
    inputs: inputs as RecordedInput[],
  };
  return { ok: true, save };
}

function validInput(v: unknown): boolean {
  return (
    isRecord(v) &&
    typeof v.type === 'string' &&
    typeof v.turn === 'number' &&
    typeof v.phase === 'string' &&
    v.phase === 'idle'
  );
}

/** Starts a fresh run from a save and replays its inputs. The result is exactly where the player stopped. */
export async function restoreGame(
  files: Record<string, string>,
  save: GameSave,
  locale?: Locale,
): Promise<GameHost> {
  const host = await createGameHost({
    files,
    seed: save.seed,
    roleId: save.roleId,
    locale: locale ?? save.locale,
    ...(save.profile ? { profile: save.profile } : {}),
  });
  fastForward(host.run, save.inputs, save.turn);
  return host;
}

/** The slice of the browser's storage the saves use, so tests can pass a fake. */
export interface SlotStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export const SLOT_IDS = ['auto', '1', '2', '3'] as const;
export type SlotId = (typeof SLOT_IDS)[number];
const slotKey = (slot: SlotId): string => `jobex.save.${slot}`;

export function writeSlot(storage: SlotStorage, slot: SlotId, save: GameSave): void {
  storage.setItem(slotKey(slot), JSON.stringify(save));
}

export function readSlot(storage: SlotStorage, slot: SlotId): GameSave | undefined {
  const text = storage.getItem(slotKey(slot));
  if (text === null) return undefined;
  const parsed = parseSave(text);
  return parsed.ok ? parsed.save : undefined;
}

export function deleteSlot(storage: SlotStorage, slot: SlotId): void {
  storage.removeItem(slotKey(slot));
}

export function listSlots(storage: SlotStorage): { slot: SlotId; save: GameSave | undefined }[] {
  return SLOT_IDS.map((slot) => ({ slot, save: readSlot(storage, slot) }));
}

/** A readable file name for an exported save. */
export function saveFileName(save: GameSave): string {
  const who = save.profile?.name ? save.profile.name.replace(/[^\p{L}\p{N}]+/gu, '-') : 'player';
  return `jobex-${who}-week${save.turn}.json`.toLowerCase();
}

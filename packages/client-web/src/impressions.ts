import type { TemperamentAxis } from '@je/contracts';
import type { UiLocale } from './strings';

/** What the player believes about one person: a guess per trait, with how sure they are, and quirks noticed. */
export interface Impression {
  axes: Partial<Record<TemperamentAxis, { estimate: number; confidence: number }>>;
  quirks: { en: string; vi: string }[];
}

type Words = [low: string, mid: string, high: string];

const TRAITS: Record<UiLocale, Record<TemperamentAxis, Words>> = {
  en: {
    caution: ['takes risks', 'weighs the risks', 'very careful'],
    ambition: ['content where they are', 'steady', 'driven to rise'],
    warmth: ['distant', 'polite', 'warm'],
    integrity: ['bends the rules', 'mostly by the book', 'scrupulous'],
    resilience: ['easily rattled', 'copes', 'unshakeable'],
    impulsivity: ['deliberate', 'sometimes hasty', 'acts on impulse'],
  },
  vi: {
    caution: ['dám liều', 'cân nhắc rủi ro', 'rất thận trọng'],
    ambition: ['bằng lòng với hiện tại', 'đều đặn', 'muốn leo cao'],
    warmth: ['xa cách', 'lịch sự', 'ấm áp'],
    integrity: ['hay du di quy định', 'phần lớn theo đúng quy định', 'rất nguyên tắc'],
    resilience: ['dễ chao đảo', 'chịu được áp lực', 'vững như đá'],
    impulsivity: ['thong thả cân nhắc', 'đôi khi hấp tấp', 'hay làm theo cảm hứng'],
  },
};

const SURE: Record<UiLocale, [guess: string, impression: string, fairly: string]> = {
  en: ['a guess', 'an impression', 'fairly sure'],
  vi: ['đoán thôi', 'ấn tượng', 'khá chắc'],
};

export const IMPRESSION_TEXT: Record<UiLocale, { none: string; label: string; quirks: string }> = {
  en: {
    none: 'You do not know them well yet.',
    label: 'What you make of them',
    quirks: 'You have noticed',
  },
  vi: {
    none: 'Bạn chưa hiểu họ nhiều.',
    label: 'Bạn thấy họ',
    quirks: 'Bạn để ý thấy',
  },
};

/** The word for an estimate (0 to 100) on a trait. */
export function traitWord(axis: TemperamentAxis, estimate: number, locale: UiLocale): string {
  const words = TRAITS[locale][axis];
  return estimate < 38 ? words[0] : estimate > 62 ? words[2] : words[1];
}

/** How sure a confidence (0 to 100) is, in words. */
export function sureWord(confidence: number, locale: UiLocale): string {
  const words = SURE[locale];
  return confidence < 35 ? words[0] : confidence < 60 ? words[1] : words[2];
}

const ACTED: Record<UiLocale, Record<string, string>> = {
  en: { vouches: 'has spoken well of you', badmouths: 'has been running you down' },
  vi: { vouches: 'đã nói tốt về bạn', badmouths: 'đang nói xấu bạn' },
};

/** What a guest has visibly done lately, in words; empty when nothing the player could see. */
export function actedLine(actions: readonly string[] | undefined, locale: UiLocale): string {
  const last = actions?.[actions.length - 1];
  return last ? (ACTED[locale][last] ?? '') : '';
}

/** One line for the people panel, most sure trait first; the player never sees a number. */
export function impressionLine(impression: Impression | undefined, locale: UiLocale): string {
  const text = IMPRESSION_TEXT[locale];
  const axes = Object.entries(impression?.axes ?? {}) as [
    TemperamentAxis,
    { estimate: number; confidence: number },
  ][];
  if (!impression || axes.length === 0) return text.none;
  const traits = axes
    .sort((a, b) => b[1].confidence - a[1].confidence)
    .map(
      ([axis, i]) => `${traitWord(axis, i.estimate, locale)} (${sureWord(i.confidence, locale)})`,
    )
    .join(', ');
  const quirks =
    impression.quirks.length > 0
      ? ` ${text.quirks}: ${impression.quirks.map((q) => q[locale]).join(', ')}.`
      : '';
  return `${text.label}: ${traits}.${quirks}`;
}

/** The one trait the player is surest of, as a word and a mark (? a guess, ~ an impression, ! fairly sure). */
export function topTrait(
  impression: Impression | undefined,
  locale: UiLocale,
): { word: string; mark: string } | undefined {
  const axes = Object.entries(impression?.axes ?? {}) as [
    TemperamentAxis,
    { estimate: number; confidence: number },
  ][];
  if (axes.length === 0) return undefined;
  const [axis, best] = axes.sort((a, b) => b[1].confidence - a[1].confidence)[0]!;
  return {
    word: traitWord(axis, best.estimate, locale),
    mark: best.confidence < 35 ? '?' : best.confidence < 60 ? '~' : '!',
  };
}

import type { Gender, Locale, Person } from '@je/contracts';

/** Who is reading: the player's age and gender decide how colleagues address them and how they address colleagues. */
export interface Viewer {
  age: number;
  gender: Gender;
}

export interface Address {
  /** How the player refers to this person: "anh Hùng", "em Lan", "Hùng". */
  call: string;
  /** How this person refers to themselves: "anh", "em", "mình", "I". */
  self: string;
  /** How this person addresses the player: "em", "anh", "bạn", "you". */
  you: string;
}

const kinOlder = (g: Gender): string | undefined =>
  g === 'male' ? 'anh' : g === 'female' ? 'chị' : undefined;
const kinElder = (g: Gender): string | undefined =>
  g === 'male' ? 'chú' : g === 'female' ? 'cô' : undefined;

/**
 * Forms of address (culture pack v1, Vietnamese). Vietnamese has no neutral "you" and "I": the words depend on who is
 * older and on gender. Peers (within two years) use "bạn" and "mình"; an older man or woman is "anh" or "chị" and calls
 * the player "em"; a younger one is "em" and calls the player "anh" or "chị"; much older (18+ years) is "chú" or "cô" and
 * calls the player "cháu". A non-binary person, or a player whose gender is unknown, gets the neutral "bạn" and "mình".
 * English does not change. Appearance and region never come in.
 */
export function addressOf(person: Person, viewer: Viewer | undefined, locale: Locale): Address {
  const given = person.origin.name.given;
  if (locale === 'en') return { call: given, self: 'I', you: 'you' };
  const peer: Address = { call: given, self: 'mình', you: 'bạn' };
  if (!viewer) return peer;
  const gap = person.origin.age_at_creation - viewer.age;
  const theirs = person.origin.gender;
  if (gap >= 18) {
    const word = kinElder(theirs);
    return word ? { call: `${word} ${given}`, self: word, you: 'cháu' } : peer;
  }
  if (gap >= 3) {
    const word = kinOlder(theirs);
    return word ? { call: `${word} ${given}`, self: word, you: 'em' } : peer;
  }
  if (gap <= -3) {
    const you = kinOlder(viewer.gender) ?? 'bạn';
    return { call: `em ${given}`, self: 'em', you };
  }
  return peer;
}

/** Capitalises the first letter, for a word that starts a sentence. */
export const capitalise = (word: string): string =>
  word.charAt(0).toLocaleUpperCase() + word.slice(1);

/** True when a word placed after this text starts a sentence (start of text, after . ! ? … or an opening quote). */
export function startsSentence(before: string): boolean {
  return before.trim() === '' || /(?:[.!?…]\s+|["“‘'(]\s*|\n\s*)$/.test(before);
}

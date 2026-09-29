/** The shell's own interface text. Scene text arrives already translated from the simulation. */
export type UiLocale = 'en' | 'vi';

export interface UiStrings {
  year: string;
  week: string;
  runEnded: string;
  idle: string;
  mapLabel: string;
  language: string;
  outcome: { ok: string; fail: string; ignored: string };
  stats: [path: string, label: string][];
}

export const UI_LOCALES: readonly UiLocale[] = ['en', 'vi'];

export const UI_STRINGS: Record<UiLocale, UiStrings> = {
  en: {
    year: 'Year',
    week: 'Week',
    runEnded: 'Run ended',
    idle: 'Nothing needs your attention yet.',
    mapLabel: 'Office map',
    language: 'Language',
    outcome: { ok: 'It worked out.', fail: 'It did not go well.', ignored: 'You let it pass.' },
    stats: [
      ['player.stress', 'Stress'],
      ['player.energy', 'Energy'],
      ['player.health', 'Health'],
      ['player.cash_vnd', 'Bonus (VND)'],
    ],
  },
  vi: {
    year: 'Năm',
    week: 'Tuần',
    runEnded: 'Đã kết thúc',
    idle: 'Hiện chưa có việc cần bạn xử lý.',
    mapLabel: 'Sơ đồ văn phòng',
    language: 'Ngôn ngữ',
    outcome: {
      ok: 'Mọi việc suôn sẻ.',
      fail: 'Việc không suôn sẻ.',
      ignored: 'Bạn để việc này trôi qua.',
    },
    stats: [
      ['player.stress', 'Căng thẳng'],
      ['player.energy', 'Năng lượng'],
      ['player.health', 'Sức khỏe'],
      ['player.cash_vnd', 'Thưởng (VND)'],
    ],
  },
};

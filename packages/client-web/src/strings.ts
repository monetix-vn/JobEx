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
  reputation: string;
  reps: [path: string, label: string][];
  termsHint: string;
  debrief: { story: string; lessons: string; terms: string; standing: string; week: string };
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
    reputation: 'Standing',
    reps: [
      ['player.rep.boss', 'Boss'],
      ['player.rep.buyer', 'Buyers'],
      ['player.rep.finance', 'Finance'],
      ['player.rep.production', 'Production'],
      ['player.rep.qc', 'QC'],
      ['player.rep.cs', 'Service'],
    ],
    termsHint: 'Tap a word to see what it means',
    debrief: {
      story: 'What you did, and what came back',
      lessons: 'What this teaches',
      terms: 'Words you met',
      standing: 'Where you ended up',
      week: 'Week',
    },
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
    reputation: 'Uy tín',
    reps: [
      ['player.rep.boss', 'Sếp'],
      ['player.rep.buyer', 'Khách'],
      ['player.rep.finance', 'Tài chính'],
      ['player.rep.production', 'Sản xuất'],
      ['player.rep.qc', 'QC'],
      ['player.rep.cs', 'CSKH'],
    ],
    termsHint: 'Chạm vào một từ để xem nghĩa',
    debrief: {
      story: 'Bạn đã làm gì, và điều gì quay lại',
      lessons: 'Bài học rút ra',
      terms: 'Những từ bạn đã gặp',
      standing: 'Bạn đang ở đâu',
      week: 'Tuần',
    },
  },
};

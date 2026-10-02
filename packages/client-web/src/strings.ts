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
  pickJob: string;
  pickHint: string;
  playAgain: string;
  cast: string;
  /** The month-end close checklist (finance). Steps without a label show their id. */
  close: {
    title: string;
    due: string;
    open: string;
    rushed: string;
    done: string;
    steps: Record<string, string>;
  };
  debrief: {
    story: string;
    lessons: string;
    terms: string;
    standing: string;
    week: string;
    people: string;
    arcs: string;
    arcClosed: string;
    arcOpen: string;
    /** Words for how a person feels, from the lowest to the highest trust. */
    feelings: { wary: string; neutral: string; trusts: string };
    trust: string;
    owesYou: string;
    youOwe: string;
  };
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
      ['profile.money_pressure', 'Money pressure'],
    ],
    reputation: 'Standing',
    reps: [
      ['player.rep.boss', 'Boss'],
      ['player.rep.buyer', 'Buyers'],
      ['player.rep.finance', 'Finance'],
      ['player.rep.production', 'Production'],
      ['player.rep.qc', 'QC'],
      ['player.rep.cs', 'Service'],
      ['player.rep.staff', 'Staff'],
    ],
    termsHint: 'Tap a word to see what it means',
    pickJob: 'Choose your job',
    pickHint: 'Different departments, different pressures. You can try the others afterwards.',
    playAgain: 'Choose another job',
    cast: 'People you know',
    close: {
      title: 'Month-end close',
      due: 'due now',
      open: 'open',
      rushed: 'rushed',
      done: 'done properly',
      steps: {
        bank_rec: 'Bank reconciliation',
        ar_aging: 'Receivables ageing',
        accruals: 'Accruals',
        cutoff: 'Cut-off check',
      },
    },
    debrief: {
      story: 'What you did, and what came back',
      lessons: 'What this teaches',
      terms: 'Words you met',
      standing: 'Where you ended up',
      week: 'Week',
      people: 'People who remember you',
      arcs: 'Stories you were part of',
      arcClosed: 'closed',
      arcOpen: 'still unresolved',
      feelings: { wary: 'wary of you', neutral: 'undecided about you', trusts: 'trusts you' },
      trust: 'trust',
      owesYou: 'owes you a favour',
      youOwe: 'you owe a favour',
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
      ['profile.money_pressure', 'Áp lực tiền bạc'],
    ],
    reputation: 'Uy tín',
    reps: [
      ['player.rep.boss', 'Sếp'],
      ['player.rep.buyer', 'Khách'],
      ['player.rep.finance', 'Tài chính'],
      ['player.rep.production', 'Sản xuất'],
      ['player.rep.qc', 'QC'],
      ['player.rep.cs', 'CSKH'],
      ['player.rep.staff', 'Nhân viên'],
    ],
    termsHint: 'Chạm vào một từ để xem nghĩa',
    pickJob: 'Chọn công việc của bạn',
    pickHint: 'Mỗi phòng ban một áp lực khác nhau. Sau đó bạn có thể thử các vai trò khác.',
    playAgain: 'Chọn công việc khác',
    cast: 'Những người bạn quen',
    close: {
      title: 'Khóa sổ cuối tháng',
      due: 'đến hạn',
      open: 'chưa làm',
      rushed: 'làm vội',
      done: 'làm đầy đủ',
      steps: {
        bank_rec: 'Đối chiếu ngân hàng',
        ar_aging: 'Tuổi nợ phải thu',
        accruals: 'Chi phí trích trước',
        cutoff: 'Kiểm tra cắt kỳ',
      },
    },
    debrief: {
      story: 'Bạn đã làm gì, và điều gì quay lại',
      lessons: 'Bài học rút ra',
      terms: 'Những từ bạn đã gặp',
      standing: 'Bạn đang ở đâu',
      week: 'Tuần',
      people: 'Những người nhớ đến bạn',
      arcs: 'Những câu chuyện bạn đã tham gia',
      arcClosed: 'đã khép lại',
      arcOpen: 'còn dang dở',
      feelings: { wary: 'dè chừng bạn', neutral: 'chưa có ý kiến về bạn', trusts: 'tin bạn' },
      trust: 'tin cậy',
      owesYou: 'nợ bạn một ân huệ',
      youOwe: 'bạn nợ một ân huệ',
    },
  },
};

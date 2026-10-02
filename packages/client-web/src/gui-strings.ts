import type { Ending } from '@je/contracts';
import type { UiLocale } from './strings';

/** Interface text for the game screen's newer parts: results, costs, the year strip, the ending banner. */
export interface GuiStrings {
  result: string;
  hours: string;
  energy: string;
  needsSkill: (label: string, need: number) => string;
  needsEnergy: (need: number) => string;
  cash: string;
  yearBar: string;
  months: string[];
  details: string;
  close: string;
  person: { feelsGood: string; feelsBad: string; feelsNone: string; open: string; shut: string };
  /** The big banner at the end of a run. */
  ending: Record<Ending, string>;
  /** Stats where a rise is bad (the result strip shows it red). */
  worseWhenUp: string[];
}

const humanise = (path: string): string => path.split('.').pop()!.replace(/_/g, ' ');

export const GUI_STRINGS: Record<UiLocale, GuiStrings> = {
  en: {
    result: 'Result',
    hours: 'h',
    energy: 'energy',
    needsSkill: (label, need) => `needs ${label} ${need}`,
    needsEnergy: (need) => `needs ${need} energy`,
    cash: 'Cash',
    yearBar: 'Year',
    months: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
    details: 'details',
    close: 'close',
    person: {
      feelsGood: 'friendly',
      feelsBad: 'wary',
      feelsNone: 'neutral',
      open: 'more',
      shut: 'less',
    },
    ending: {
      completed: 'YEAR DONE',
      fired: 'FIRED',
      prosecuted: 'PROSECUTED',
      burnout: 'BURNOUT',
      promoted: 'PROMOTED',
      walked_away: 'WALKED AWAY',
    },
    worseWhenUp: ['player.stress', 'profile.money_pressure'],
  },
  vi: {
    result: 'Kết quả',
    hours: 'giờ',
    energy: 'năng lượng',
    needsSkill: (label, need) => `cần ${label} ${need}`,
    needsEnergy: (need) => `cần ${need} năng lượng`,
    cash: 'Tiền',
    yearBar: 'Năm',
    months: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
    details: 'chi tiết',
    close: 'đóng',
    person: {
      feelsGood: 'thân thiện',
      feelsBad: 'dè chừng',
      feelsNone: 'trung lập',
      open: 'thêm',
      shut: 'bớt',
    },
    ending: {
      completed: 'HẾT NĂM',
      fired: 'BỊ SA THẢI',
      prosecuted: 'BỊ TRUY TỐ',
      burnout: 'KIỆT SỨC',
      promoted: 'ĐƯỢC THĂNG CHỨC',
      walked_away: 'NGHỈ VIỆC',
    },
    worseWhenUp: ['player.stress', 'profile.money_pressure'],
  },
};

const SKILLS_VI: Record<string, string> = {
  analysis: 'phân tích',
  backbone: 'bản lĩnh',
  negotiation: 'đàm phán',
  people: 'giao tiếp',
  leadership: 'lãnh đạo',
  accounting: 'kế toán',
  inspection: 'kiểm tra',
  modelling: 'mô hình hóa',
  planning: 'lập kế hoạch',
  read_the_room: 'đọc tình huống',
  security: 'bảo mật',
  storytelling: 'kể chuyện',
  sysadmin: 'quản trị hệ thống',
  employment_law: 'luật lao động',
  machine_knowledge: 'hiểu máy móc',
  analytics: 'phân tích số liệu',
};

/** A requirement path as words in the player's language. */
export function pathLabel(path: string, locale: UiLocale): string {
  const key = path.split('.').pop() ?? path;
  return locale === 'vi' ? (SKILLS_VI[key] ?? humanise(path)) : humanise(path);
}

import type { UiLocale } from './strings';

type Options = Record<string, string>;

export interface ProfileStrings {
  title: string;
  intro: string;
  quickStart: string;
  random: string;
  personas: Record<string, { name: string; blurb: string }>;
  labels: {
    name: string;
    age: string;
    gender: string;
    education: string;
    experience: string;
    money: string;
    dependents: string;
    hiring: string;
  };
  placeholderName: string;
  gender: Options;
  education: Options;
  experience: Options;
  money: Options;
  dependents: Options;
  hiring: Options;
  settings: string;
  settingsIntro: string;
  timeMode: string;
  timeModes: Options;
  yearLength: string;
  yearLengths: Options;
  intensity: string;
  intensities: Options;
  comingSoon: string;
  effectsTitle: string;
  effectsIntro: string;
  start: string;
  back: string;
  nameDefault: string;
}

export const PROFILE_STRINGS: Record<UiLocale, ProfileStrings> = {
  en: {
    title: 'Who are you?',
    intro:
      'These choices change your pressures and your starting point: money worries, hours, how people see you. They never change what you are worth. Other people in the game are built from the same rules.',
    quickStart: 'Quick start',
    random: 'Surprise me',
    personas: {
      fresh_graduate: {
        name: 'The fresh graduate',
        blurb: '23, first job, family expects help with money',
      },
      parent: {
        name: 'The parent',
        blurb: '36, mortgage and two children, good at the job and short of hours',
      },
      career_switcher: {
        name: 'The career switcher',
        blurb: '41, ten years in another field, savings and something to prove',
      },
      owner_relative: {
        name: "The owner's relative",
        blurb: '28, easy trust and heavy expectations',
      },
    },
    labels: {
      name: 'Name',
      age: 'Age',
      gender: 'Gender',
      education: 'Education',
      experience: 'Experience',
      money: 'Money',
      dependents: 'People who depend on you',
      hiring: 'How you got the job',
    },
    placeholderName: 'Your name',
    gender: { female: 'Female', male: 'Male', non_binary: 'Non-binary / prefer not to say' },
    education: {
      lower_secondary: 'Lower secondary',
      upper_secondary: 'Upper secondary',
      vocational: 'Vocational training',
      college: 'College',
      university: 'University',
      postgraduate: 'Postgraduate',
    },
    experience: {
      none: 'First job',
      some: 'A few years',
      veteran: 'Ten years or more',
      switcher: 'Switching career',
    },
    money: {
      comfortable: 'Comfortable',
      tight: 'Tight',
      in_debt: 'In debt',
      sending_home: 'Sending money to family',
    },
    dependents: {
      none: 'Nobody',
      partner: 'A partner',
      children: 'Children',
      parents: 'Parents',
      several: 'Several people',
    },
    hiring: {
      applied_cold: 'Applied, no connections',
      internal_transfer: 'Moved internally',
      recommended: 'Recommended by someone',
      owner_relative: 'Relative of an owner',
    },
    settings: 'Settings',
    settingsIntro: 'You can change these later.',
    timeMode: 'How the year runs',
    timeModes: {
      thoughtful: 'Thoughtful: time moves when you press Next week',
      steady: 'Steady: a week passes every few seconds, and waits for your decisions',
    },
    yearLength: 'Length of the year',
    yearLengths: {
      '52': 'Full year (52 weeks)',
      '26': 'Short year (26 weeks)',
      '12': 'Sprint (12 weeks)',
    },
    intensity: 'Intensity of text',
    intensities: { reduced: 'Reduced', standard: 'Standard', full: 'Full' },
    comingSoon: 'coming soon',
    effectsTitle: 'What this changes',
    effectsIntro:
      'At the start: stress +{stress}, money pressure {pressure}, standing with the boss {boss}.',
    start: 'Start the job',
    back: 'Back',
    nameDefault: 'You',
  },
  vi: {
    title: 'Bạn là ai?',
    intro:
      'Những lựa chọn này thay đổi áp lực và điểm xuất phát của bạn: lo toan tiền bạc, quỹ thời gian, cách người khác nhìn bạn. Chúng không bao giờ thay đổi giá trị của bạn. Những người khác trong game cũng được tạo ra theo cùng quy tắc.',
    quickStart: 'Bắt đầu nhanh',
    random: 'Ngẫu nhiên',
    personas: {
      fresh_graduate: {
        name: 'Sinh viên mới ra trường',
        blurb: '23 tuổi, công việc đầu tiên, gia đình trông chờ giúp đỡ tiền bạc',
      },
      parent: {
        name: 'Người làm cha mẹ',
        blurb: '36 tuổi, còn nợ nhà và hai con, giỏi việc nhưng thiếu thời gian',
      },
      career_switcher: {
        name: 'Người chuyển nghề',
        blurb: '41 tuổi, mười năm ở lĩnh vực khác, có tiền tiết kiệm và muốn chứng tỏ',
      },
      owner_relative: {
        name: 'Người thân của chủ',
        blurb: '28 tuổi, dễ được tin nhưng bị kỳ vọng nặng nề',
      },
    },
    labels: {
      name: 'Tên',
      age: 'Tuổi',
      gender: 'Giới tính',
      education: 'Học vấn',
      experience: 'Kinh nghiệm',
      money: 'Tiền bạc',
      dependents: 'Người phụ thuộc vào bạn',
      hiring: 'Cách bạn có việc',
    },
    placeholderName: 'Tên của bạn',
    gender: { female: 'Nữ', male: 'Nam', non_binary: 'Phi nhị nguyên / không muốn nói' },
    education: {
      lower_secondary: 'Trung học cơ sở',
      upper_secondary: 'Trung học phổ thông',
      vocational: 'Trung cấp, học nghề',
      college: 'Cao đẳng',
      university: 'Đại học',
      postgraduate: 'Sau đại học',
    },
    experience: {
      none: 'Công việc đầu tiên',
      some: 'Vài năm',
      veteran: 'Mười năm trở lên',
      switcher: 'Đang chuyển nghề',
    },
    money: {
      comfortable: 'Thoải mái',
      tight: 'Eo hẹp',
      in_debt: 'Đang nợ',
      sending_home: 'Gửi tiền về cho gia đình',
    },
    dependents: {
      none: 'Không ai',
      partner: 'Vợ/chồng/người yêu',
      children: 'Con cái',
      parents: 'Cha mẹ',
      several: 'Nhiều người',
    },
    hiring: {
      applied_cold: 'Tự ứng tuyển, không quen biết',
      internal_transfer: 'Chuyển nội bộ',
      recommended: 'Có người giới thiệu',
      owner_relative: 'Người thân của chủ',
    },
    settings: 'Cài đặt',
    settingsIntro: 'Bạn có thể đổi sau.',
    timeMode: 'Thời gian trôi thế nào',
    timeModes: {
      thoughtful: 'Thong thả: thời gian chỉ trôi khi bạn bấm Tuần sau',
      steady: 'Đều đặn: vài giây trôi một tuần, và chờ bạn quyết định',
    },
    yearLength: 'Độ dài của năm',
    yearLengths: {
      '52': 'Cả năm (52 tuần)',
      '26': 'Năm rút gọn (26 tuần)',
      '12': 'Chạy nước rút (12 tuần)',
    },
    intensity: 'Mức độ nội dung',
    intensities: { reduced: 'Giảm nhẹ', standard: 'Tiêu chuẩn', full: 'Đầy đủ' },
    comingSoon: 'sắp có',
    effectsTitle: 'Điều này thay đổi gì',
    effectsIntro:
      'Lúc bắt đầu: căng thẳng +{stress}, áp lực tiền bạc {pressure}, vị thế với sếp {boss}.',
    start: 'Bắt đầu công việc',
    back: 'Quay lại',
    nameDefault: 'Bạn',
  },
};

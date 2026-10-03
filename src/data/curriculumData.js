/**
 * BỘ TỔNG HỢP GIÁO TRÌNH 7 CHƯƠNG TOÀN DIỆN (Phase 9: T-P9-01)
 * Tuân thủ nghiêm ngặt LESSONS.md: 30 bài học thực tế, 7 phần chuẩn hóa
 */

import { CHAPTER_1_LESSONS } from './chapter1Lessons.js';
import {
  CHAPTER_2_LESSONS,
  CHAPTER_3_LESSONS,
  CHAPTER_4_LESSONS,
  CHAPTER_5_LESSONS,
  CHAPTER_6_LESSONS,
  CHAPTER_7_LESSONS,
} from './chapter2To7Lessons.js';

export const CURRICULUM_CHAPTERS = [
  {
    id: 1,
    chapterCode: 'ch_1',
    title: 'Giải Mã Dòng Tiền & Bản Đồ Thu Chi',
    subtitle: 'Nắm vững bản chất thu nhập khả dụng và ngân sách ngày sinh tồn',
    icon: 'wallet-outline',
    lessons: CHAPTER_1_LESSONS,
    lessonsCount: CHAPTER_1_LESSONS.length,
    xpReward: 200,
    badgeTitle: 'Bậc Thầy Dòng Tiền',
  },
  {
    id: 2,
    chapterCode: 'ch_2',
    title: 'Tâm Lý Chi Tiêu & Vượt Bẫy FOMO',
    subtitle: 'Nhận diện bẫy mỏ neo giá, hiệu ứng Diderot và khoảng đệm 72 giờ',
    icon: 'flame-outline',
    lessons: CHAPTER_2_LESSONS,
    lessonsCount: CHAPTER_2_LESSONS.length,
    xpReward: 250,
    badgeTitle: 'Khắc Tinh FOMO',
  },
  {
    id: 3,
    chapterCode: 'ch_3',
    title: 'Tiết Kiệm Kỷ Luật, Mục Tiêu & Lãi Kép',
    subtitle: 'Quỹ khẩn cấp áo phao, công thức 4 trường và sức mạnh thời gian',
    icon: 'shield-outline',
    lessons: CHAPTER_3_LESSONS,
    lessonsCount: CHAPTER_3_LESSONS.length,
    xpReward: 200,
    badgeTitle: 'Chiến Binh Kỷ Luật',
  },
  {
    id: 4,
    chapterCode: 'ch_4',
    title: 'Nợ Tín Dụng, Trả Góp & Bẫy Lãi Suất',
    subtitle: 'Ma trận trả góp 0%, điểm tín dụng CIC và chiến lược thoát nợ',
    icon: 'card-outline',
    lessons: CHAPTER_4_LESSONS,
    lessonsCount: CHAPTER_4_LESSONS.length,
    xpReward: 250,
    badgeTitle: 'Người Quản Lý Nợ Thông Thái',
  },
  {
    id: 5,
    chapterCode: 'ch_5',
    title: 'Lạm Phát & Những Bước Đầu Hiểu Về Đầu Tư',
    subtitle: 'Sức mua đồng tiền, phân bổ đa dạng hóa và tâm lý nhà đầu tư F0',
    icon: 'trending-up-outline',
    lessons: CHAPTER_5_LESSONS,
    lessonsCount: CHAPTER_5_LESSONS.length,
    xpReward: 200,
    badgeTitle: 'Nhà Đầu Tư Lý Trí',
  },
  {
    id: 6,
    chapterCode: 'ch_6',
    title: 'Lá Chắn Bảo Vệ & Phòng Tránh Lừa Đảo',
    subtitle: 'Bảo mật OTP 2 lớp, nhận diện bẫy giật đơn hàng và quyền riêng tư NĐ 13',
    icon: 'lock-closed-outline',
    lessons: CHAPTER_6_LESSONS,
    lessonsCount: CHAPTER_6_LESSONS.length,
    xpReward: 200,
    badgeTitle: 'Thành Trì Bảo Mật',
  },
  {
    id: 7,
    chapterCode: 'ch_7',
    title: 'Tối Ưu Thu Nhập & Kỹ Năng Giá Trị Cao',
    subtitle: 'Gia tăng giá trị mỗi giờ lao động, kỹ năng thu nhập cao và tự do thực sự',
    icon: 'trophy-outline',
    lessons: CHAPTER_7_LESSONS,
    lessonsCount: CHAPTER_7_LESSONS.length,
    xpReward: 300,
    badgeTitle: 'Tự Do Tài Chính Đích Thực',
  },
];

export const ALL_CURRICULUM_LESSONS = [
  ...CHAPTER_1_LESSONS,
  ...CHAPTER_2_LESSONS,
  ...CHAPTER_3_LESSONS,
  ...CHAPTER_4_LESSONS,
  ...CHAPTER_5_LESSONS,
  ...CHAPTER_6_LESSONS,
  ...CHAPTER_7_LESSONS,
];

export function getLessonsByChapter(chapterId) {
  const numericId = Number(chapterId) || 1;
  const chapter = CURRICULUM_CHAPTERS.find((ch) => ch.id === numericId);
  return chapter ? chapter.lessons : CHAPTER_1_LESSONS;
}

export function getChapterById(chapterId) {
  const numericId = Number(chapterId) || 1;
  return CURRICULUM_CHAPTERS.find((ch) => ch.id === numericId) || CURRICULUM_CHAPTERS[0];
}

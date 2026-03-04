export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
export type MascotStage = 'Egg' | 'Little Cat' | 'Big Cat';
export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'student' | 'teacher';
  classId: string;
  mascotName: string;
  mascotStage: MascotStage;
  xpTotal: number;
  xpCurrentLevel: number;
  avatarSeed?: string;
}
export interface SchoolClass {
  id: string;
  name: string;
  gradeLevel: number;
  schoolId: string;
  totalXp: number;
  memberCount: number;
  joinCode: string;
  rankPosition?: number;
}
export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatarSeed?: string;
  classId: string;
  title: string;
  content: string;
  imageUrl?: string;
  category: 'All' | 'Announcements';
  isPinned: boolean;
  upvotesCount: number;
  commentsCount: number;
  createdAt: number;
}
export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorAvatarSeed?: string;
  content: string;
  createdAt: number;
}
export interface Quiz {
  id: string;
  title: string;
  createdBy: string;
  questions: {
    question: string;
    options: string[];
    correctIndex: number;
  }[];
  xpReward: number;
  completions: string[]; // User IDs
}
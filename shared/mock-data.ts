import { User, SchoolClass, Post } from './types';
export const MOCK_CLASSES: SchoolClass[] = [
  { id: 'class-1', name: '10-A Seniors', gradeLevel: 10, schoolId: 'school-1', totalXp: 1250, memberCount: 25, joinCode: 'CODE10A' },
  { id: 'class-2', name: '10-B Warriors', gradeLevel: 10, schoolId: 'school-1', totalXp: 840, memberCount: 20, joinCode: 'CODE10B' },
  { id: 'class-3', name: '9-C Juniors', gradeLevel: 9, schoolId: 'school-1', totalXp: 2100, memberCount: 30, joinCode: 'CODE9C' },
];
export const MOCK_USERS: User[] = [
  {
    id: 'u-student-1',
    name: 'Alex Rivera',
    email: 'alex@school.edu',
    password: 'password123',
    role: 'student',
    classId: 'class-1',
    mascotName: 'Bubbles',
    mascotStage: 'Little Cat',
    xpTotal: 245,
    xpCurrentLevel: 145,
    avatarSeed: 'Felix',
  },
  {
    id: 'u-teacher-1',
    name: 'Ms. Thompson',
    email: 'thompson@school.edu',
    password: 'password123',
    role: 'teacher',
    classId: 'class-1',
    mascotName: 'Professor Paws',
    mascotStage: 'Big Cat',
    xpTotal: 1200,
    xpCurrentLevel: 200,
    avatarSeed: 'Luna',
  }
];
export const MOCK_POSTS: Post[] = [
  {
    id: 'p-1',
    authorId: 'u-teacher-1',
    authorName: 'Ms. Thompson',
    authorAvatarSeed: 'Luna',
    classId: 'class-1',
    title: 'Welcome to SPojka!',
    content: 'Get ready for an amazing year of learning and competing for the top class spot!',
    category: 'Announcements',
    isPinned: true,
    upvotesCount: 15,
    commentsCount: 3,
    createdAt: Date.now() - 86400000,
  },
  {
    id: 'p-2',
    authorId: 'u-student-1',
    authorName: 'Alex Rivera',
    authorAvatarSeed: 'Felix',
    classId: 'class-1',
    title: 'Math Homework Help',
    content: 'Is anyone else struggling with question 5 on the calculus sheet?',
    category: 'All',
    isPinned: false,
    upvotesCount: 4,
    commentsCount: 12,
    createdAt: Date.now() - 3600000,
  }
];
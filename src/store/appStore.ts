import { create } from 'zustand';
import { Post, Comment, Quiz, SchoolClass } from '@shared/types';
import { MOCK_POSTS, MOCK_CLASSES, MOCK_USERS } from '@shared/mock-data';
// Initial Quiz Data
const INITIAL_QUIZZES: Quiz[] = [
  {
    id: 'q-1',
    title: 'Biology Basics: The Cell',
    createdBy: 'u-teacher-1',
    questions: [
      {
        question: 'What is the "powerhouse" of the cell?',
        options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Vacuole'],
        correctIndex: 1
      },
      {
        question: 'Which structure is only found in plant cells?',
        options: ['Cell Wall', 'Cell Membrane', 'Cytoplasm', 'Mitochondria'],
        correctIndex: 0
      }
    ],
    xpReward: 25,
    completions: []
  }
];
interface AppState {
  posts: Post[];
  quizzes: Quiz[];
  classes: SchoolClass[];
  comments: Record<string, Comment[]>; // Map postId -> Comment[]
  isLoadingPosts: boolean;
  isLoadingQuizzes: boolean;
  isLoadingClasses: boolean;
  error: string | null;
  fetchPosts: (classId?: string) => Promise<void>;
  createPost: (postData: Partial<Post>) => Promise<void>;
  upvotePost: (postId: string) => Promise<void>;
  fetchComments: (postId: string) => Promise<Comment[]>;
  addComment: (postId: string, commentData: { authorId: string; authorName: string; authorAvatarSeed?: string; content: string }) => Promise<Comment>;
  fetchQuizzes: () => Promise<void>;
  createQuiz: (quizData: Partial<Quiz>) => Promise<void>;
  submitQuiz: (quizId: string, userId: string) => Promise<void>;
  fetchClasses: () => Promise<void>;
}
export const useAppStore = create<AppState>((set, get) => ({
  posts: MOCK_POSTS,
  quizzes: INITIAL_QUIZZES,
  classes: MOCK_CLASSES,
  comments: {},
  isLoadingPosts: false,
  isLoadingQuizzes: false,
  isLoadingClasses: false,
  error: null,
  fetchPosts: async (classId) => {
    set({ isLoadingPosts: true });
    // Simulate local delay
    await new Promise(r => setTimeout(r, 300));
    set(state => {
      let filtered = [...MOCK_POSTS];
      if (classId) {
        filtered = filtered.filter(p => p.classId === classId);
      }
      return { posts: filtered, isLoadingPosts: false };
    });
  },
  createPost: async (postData) => {
    const newPost: Post = {
      id: Math.random().toString(36).substring(7),
      authorId: postData.authorId || '',
      authorName: postData.authorName || 'Anonymous',
      authorAvatarSeed: postData.authorAvatarSeed || '',
      classId: postData.classId || '',
      title: postData.title || '',
      content: postData.content || '',
      category: postData.category || 'All',
      isPinned: postData.isPinned || false,
      upvotesCount: 0,
      commentsCount: 0,
      createdAt: Date.now(),
    };
    set(state => ({ posts: [newPost, ...state.posts] }));
  },
  upvotePost: async (postId) => {
    set(state => ({
      posts: state.posts.map(p =>
        p.id === postId ? { ...p, upvotesCount: p.upvotesCount + 1 } : p
      )
    }));
  },
  fetchComments: async (postId) => {
    const state = get();
    return state.comments[postId] || [];
  },
  addComment: async (postId, commentData) => {
    const newComment: Comment = {
      id: Math.random().toString(36).substring(7),
      postId,
      authorId: commentData.authorId,
      authorName: commentData.authorName,
      authorAvatarSeed: commentData.authorAvatarSeed || '',
      content: commentData.content,
      createdAt: Date.now(),
    };
    set(state => {
      const postComments = state.comments[postId] || [];
      return {
        comments: {
          ...state.comments,
          [postId]: [...postComments, newComment]
        },
        posts: state.posts.map(p =>
          p.id === postId ? { ...p, commentsCount: (p.commentsCount || 0) + 1 } : p
        )
      };
    });
    return newComment;
  },
  fetchQuizzes: async () => {
    set({ isLoadingQuizzes: true });
    await new Promise(r => setTimeout(r, 200));
    set({ isLoadingQuizzes: false });
  },
  createQuiz: async (quizData) => {
    const newQuiz: Quiz = {
      id: Math.random().toString(36).substring(7),
      title: quizData.title || 'Untitled Quiz',
      createdBy: quizData.createdBy || '',
      questions: quizData.questions || [],
      xpReward: quizData.xpReward || 25,
      completions: []
    };
    set(state => ({ quizzes: [newQuiz, ...state.quizzes] }));
  },
  submitQuiz: async (quizId, userId) => {
    set(state => ({
      quizzes: state.quizzes.map(q =>
        q.id === quizId
          ? { ...q, completions: Array.from(new Set([...(q.completions || []), userId])) }
          : q
      )
    }));
  },
  fetchClasses: async () => {
    set({ isLoadingClasses: true });
    await new Promise(r => setTimeout(r, 400));
    set({ classes: MOCK_CLASSES, isLoadingClasses: false });
  }
}));
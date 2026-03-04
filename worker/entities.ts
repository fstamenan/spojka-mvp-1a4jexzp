import { IndexedEntity } from "./core-utils";
import { User, SchoolClass, Post, Comment, Quiz } from "@shared/types";
import { MOCK_USERS, MOCK_CLASSES, MOCK_POSTS } from "@shared/mock-data";
export const MOCK_QUIZZES: Quiz[] = [
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
      },
      {
        question: 'Where is DNA stored in a eukaryotic cell?',
        options: ['Golgi Apparatus', 'Nucleus', 'Lysosome', 'Endoplasmic Reticulum'],
        correctIndex: 1
      },
      {
        question: 'What process do plants use to make food?',
        options: ['Respiration', 'Photosynthesis', 'Fermentation', 'Digestion'],
        correctIndex: 1
      },
      {
        question: 'Which of these is the smallest unit of life?',
        options: ['Atom', 'Molecule', 'Cell', 'Organ'],
        correctIndex: 2
      }
    ],
    xpReward: 25,
    completions: []
  }
];
export class UserEntity extends IndexedEntity<User> {
  static readonly entityName = "user";
  static readonly indexName = "users";
  static readonly initialState: User = {
    id: "",
    name: "",
    email: "",
    role: "student",
    classId: "",
    mascotName: "",
    mascotStage: "Egg",
    xpTotal: 0,
    xpCurrentLevel: 0
  };
  static seedData = MOCK_USERS;
}
export class SchoolClassEntity extends IndexedEntity<SchoolClass> {
  static readonly entityName = "class";
  static readonly indexName = "classes";
  static readonly initialState: SchoolClass = {
    id: "",
    name: "",
    gradeLevel: 0,
    schoolId: "",
    totalXp: 0,
    memberCount: 0,
    joinCode: ""
  };
  static seedData = MOCK_CLASSES;
}
export class PostEntity extends IndexedEntity<Post> {
  static readonly entityName = "post";
  static readonly indexName = "posts";
  static readonly initialState: Post = {
    id: "",
    authorId: "",
    authorName: "",
    classId: "",
    title: "",
    content: "",
    category: "All",
    isPinned: false,
    upvotesCount: 0,
    commentsCount: 0,
    createdAt: 0
  };
  static seedData = MOCK_POSTS;
}
export class CommentEntity extends IndexedEntity<Comment> {
  static readonly entityName = "comment";
  static readonly indexName = "comments";
  static readonly initialState: Comment = {
    id: "",
    postId: "",
    authorId: "",
    authorName: "",
    content: "",
    createdAt: 0
  };
}
export class QuizEntity extends IndexedEntity<Quiz> {
  static readonly entityName = "quiz";
  static readonly indexName = "quizzes";
  static readonly initialState: Quiz = {
    id: "",
    title: "",
    createdBy: "",
    questions: [],
    xpReward: 25,
    completions: []
  };
  static seedData = MOCK_QUIZZES;
}
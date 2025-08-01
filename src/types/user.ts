export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

export interface Question {
  id: string;
  text: string;
  type: 'multiple-choice' | 'text' | 'boolean';
  options?: string[];
  correctAnswer?: string;
  points: number;
}

export interface Test {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  timeLimit: number; // in minutes
  totalPoints: number;
  assignedAt: Date;
  dueDate?: Date;
  status: 'assigned' | 'in-progress' | 'completed' | 'expired';
}

export interface TestAnswer {
  questionId: string;
  answer: string;
}

export interface TestSubmission {
  testId: string;
  answers: TestAnswer[];
  timeSpent: number; // in minutes
  submittedAt: Date;
}

export interface TestResult {
  id: string;
  testId: string;
  userId: string;
  test: Test;
  user: User;
  answers: TestAnswer[];
  score: number;
  totalPoints: number;
  percentage: number;
  timeSpent: number;
  submittedAt: Date;
  markedAt?: Date;
  feedback?: string;
  status: 'pending' | 'marked' | 'approved';
}

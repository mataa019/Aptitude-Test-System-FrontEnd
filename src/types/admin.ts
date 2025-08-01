import type { User, Test, TestAnswer } from './user';

export interface TestTemplate {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  timeLimit: number;
  totalPoints: number;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface Question {
  id: string;
  text: string;
  type: 'multiple-choice' | 'text' | 'boolean';
  options?: string[];
  correctAnswer?: string;
  points: number;
  explanation?: string;
}

export interface Attempt {
  id: string;
  testId: string;
  userId: string;
  templateId: string;
  user: User;
  test: Test;
  template: TestTemplate;
  answers: TestAnswer[];
  score?: number;
  totalPoints: number;
  percentage?: number;
  timeSpent: number;
  submittedAt: Date;
  markedAt?: Date;
  markedBy?: string;
  feedback?: string;
  status: 'submitted' | 'under-review' | 'marked' | 'approved' | 'rejected';
  isAutoGraded: boolean;
}

export interface MarkingDTO {
  score: number;
  feedback?: string;
  questionFeedback?: {
    questionId: string;
    points: number;
    feedback?: string;
  }[];
}

export interface AttemptSummary {
  totalAttempts: number;
  pendingReview: number;
  marked: number;
  approved: number;
  averageScore: number;
}

export interface AdminDashboardStats {
  totalTemplates: number;
  totalAttempts: number;
  pendingReviews: number;
  recentActivity: RecentActivity[];
}

export interface RecentActivity {
  id: string;
  type: 'attempt_submitted' | 'attempt_marked' | 'template_created';
  description: string;
  timestamp: Date;
  userId?: string;
  userName?: string;
}

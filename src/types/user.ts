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
  type: 'multiple-choice' | 'sentence' | 'boolean';
  options?: string | null; // API returns string or null
  answer?: string | null;
  marks: number;
  createdAt: string;
  updatedAt: string;
}

export interface TestTemplate {
  id: string;
  name: string;
  category: string;
  department: string;
  timeLimit: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  questions: Question[];
}

export interface Test {
  id: string;
  userId: string;
  testTemplateId: string;
  assignedBy: string;
  assignedAt: string;
  status: 'assigned' | 'in-progress' | 'completed' | 'expired';
  testTemplate: TestTemplate;
  
  // Backward compatibility properties
  title?: string;
  description?: string;
  questions?: Question[];
  timeLimit?: number;
  totalPoints?: number;
  dueDate?: Date;
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

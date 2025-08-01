import api from './axios';
import type { User, Test, TestSubmission, TestResult } from '../types/user';

// User authentication
export const loginUser = async (credentials: { email: string; password: string }) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const registerUser = async (userData: Partial<User>) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

// Get assigned tests for user
export const getAssignedTests = async (): Promise<Test[]> => {
  const response = await api.get('/user/assigned-tests');
  return response.data;
};

// Get test details for taking
export const getTestDetails = async (testId: string): Promise<Test> => {
  const response = await api.get(`/user/test/${testId}`);
  return response.data;
};

// Submit test answers
export const submitTestAnswers = async (submission: TestSubmission) => {
  const response = await api.post('/user/submit-test', submission);
  return response.data;
};

// Get user's test results
export const getUserResults = async (): Promise<TestResult[]> => {
  const response = await api.get('/user/results');
  return response.data;
};

// Get specific result details
export const getResultDetails = async (resultId: string): Promise<TestResult> => {
  const response = await api.get(`/user/result/${resultId}`);
  return response.data;
};

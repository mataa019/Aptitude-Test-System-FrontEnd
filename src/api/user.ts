import axios from './axios'; // Your configured Axios instance

// Get user profile
export const getProfile = (userId: string) =>
  axios.get(`/user/profile/${userId}`);

// Get assigned tests for a user
export const getAssignedTests = (userId: string) =>
  axios.get(`/user/assigned-tests/${userId}`);

// Get results for a user
export const getResults = (userId: string) =>
  axios.get(`/user/results/${userId}`);

// Submit all answers for an assignment
export interface SubmitAnswerDto {
  assignmentId: string;
  responses: { questionId: string; answer: string | string[] }[];
}
export const submitAnswers = (data: SubmitAnswerDto, token: string) =>
  axios.post('/user/submit-answers', data, {
    headers: { Authorization: `Bearer ${token}` }
  });

// Start an assignment
export const startAssignment = (assignmentId: string, token: string) =>
  axios.post(`/user/assignment/${assignmentId}/start`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });

// Complete an assignment
export const completeAssignment = (assignmentId: string, token: string) =>
  axios.post(`/user/assignment/${assignmentId}/complete`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
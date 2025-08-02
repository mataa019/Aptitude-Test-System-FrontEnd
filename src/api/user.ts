import { api, handleError } from './config';

// Get user profile
export const getUserProfile = async () => {
  try {
    const response = await api.get('/user/profile');
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

// Get all available tests for user
export const getAvailableTests = async () => {
  try {
    const response = await api.get('/user/tests');
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

// Get specific test by ID
export const getTestById = async (testId: string) => {
  try {
    const response = await api.get(`/user/tests/${testId}`);
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

// Start a test
export const startTest = async (testId: string) => {
  try {
    const response = await api.post(`/user/tests/${testId}/start`);
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

// Submit an answer
export const submitAnswer = async (testId: string, questionId: string, answer: any) => {
  try {
    const response = await api.post(`/user/tests/${testId}/answers`, {
      questionId,
      answer,
    });
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

// Finish/submit a test
export const finishTest = async (testId: string) => {
  try {
    const response = await api.post(`/user/tests/${testId}/finish`);
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

// Get user's test attempts
export const getUserAttempts = async () => {
  try {
    const response = await api.get('/user/attempts');
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};
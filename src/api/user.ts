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
    // Get the current user ID from localStorage
    const userId = localStorage.getItem('userId');
    if (!userId) {
      throw new Error('User not authenticated');
    }
    
    const response = await api.get(`/user/assigned-tests/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

// Get specific test by ID
export const getTestById = async (testId: string) => {
  try {
    const response = await api.get(`/user/test/${testId}`);
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

// Start a test
export const startTest = async (testId: string) => {
  try {
    const response = await api.post(`/user/test/${testId}/start`);
    return response.data;
  } catch (error: any) {
    // Check if it's the "already started" error
    if (error.response?.status === 400 && 
        error.response?.data?.message?.includes('Test already started')) {
      console.log('Test already started, continuing...');
      return { message: 'Test already started', status: 'started' };
    }
    throw new Error(handleError(error));
  }
};

// Submit answers for a test
export const submitAnswers = async (testId: string, answers: any[]) => {
  try {
    console.log('Submitting answers:', { testId, answers });
    
    // Backend expects 'responses' array, not 'answers' array
    const payload = {
      responses: answers.map(answer => ({
        questionId: answer.questionId,
        answer: answer.answer
      }))
    };
    
    console.log('Payload being sent:', JSON.stringify(payload, null, 2));
    
    const response = await api.post(`/user/test/${testId}/submit`, payload);
    console.log('Submit successful:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Submit answers error:', error);
    console.error('Error response:', error.response?.data);
    console.error('Error status:', error.response?.status);
    throw new Error(handleError(error));
  }
};

// Submit an answer (individual - keeping for backward compatibility)
export const submitAnswer = async (testId: string, questionId: string, answer: any) => {
  try {
    const response = await api.post(`/user/test/${testId}/answers`, {
      questionId,
      answer,
    });
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

// Complete a test
export const finishTest = async (testId: string) => {
  try {
    const response = await api.post(`/user/test/${testId}/complete`);
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

// Get submitted test details with answers
export const getSubmittedTest = async (testId: string) => {
  try {
    const response = await api.get(`/user/test/${testId}/submitted`);
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

// Get user's test attempts
export const getUserAttempts = async () => {
  try {
    // Use the submitted tests endpoint instead since that's what exists
    const response = await api.get('/user/submitted-tests');
    return response.data;
  } catch (error) {
    // If the endpoint doesn't exist, return empty array instead of throwing
    console.warn('User attempts endpoint not available:', handleError(error));
    return { data: [] };
  }
};

// Get a specific test attempt with questions and answers
export const getTestAttempt = async (testId: string) => {
  try {
    // First try to get the submitted test details
    const response = await api.get(`/user/test/${testId}/submitted`);
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

// Get user's test results
export const getUserResults = async () => {
  try {
    // For the current user, just use the simple endpoint
    const response = await api.get('/user/results');
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

// Get user's submitted tests for history
export const getUserSubmittedTests = async () => {
  try {
    const response = await api.get('/user/submitted-tests');
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};
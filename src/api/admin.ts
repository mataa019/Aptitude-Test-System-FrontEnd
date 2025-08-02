import { api, handleError } from './config';

// Create a new question
export const createQuestion = async (data: any) => {
  try {
    const response = await api.post('/admin/question', data);
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

// Update a question
export const updateQuestion = async (id: string, data: any) => {
  try {
    const response = await api.put(`/admin/question/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

// Delete a question
export const deleteQuestion = async (id: string) => {
  try {
    const response = await api.delete(`/admin/question/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

// Assign a test to a user
export const assignTest = async (data: { userId: string; testTemplateId: string; assignedBy: string }) => {
  try {
    const response = await api.post('/admin/assign-test', data);
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

// Get test results for a template
export const getTestResults = async (testTemplateId: string) => {
  try {
    const response = await api.get(`/admin/results/${testTemplateId}`);
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

// Create a test template
export const createTestTemplate = async (data: any) => {
  try {
    const response = await api.post('/admin/test-templates', data);
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

// Get a test template with all questions
export const getTestTemplateWithQuestions = async (testTemplateId: string) => {
  try {
    const response = await api.get(`/admin/test-templates/${testTemplateId}`);
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

// Get all attempts for a test template (with answers)
export const getTestAttemptsWithAnswers = async (testTemplateId: string) => {
  try {
    const response = await api.get(`/admin/attempts/${testTemplateId}`);
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

// Mark/approve a test attempt
export const markAttempt = async (attemptId: string, score: number, approved: boolean) => {
  try {
    const response = await api.put(`/admin/attempts/${attemptId}/mark`, { score, approved });
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};
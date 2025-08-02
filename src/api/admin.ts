import { api, handleError } from './config';

// Question Management
export const createQuestion = async (data: any) => {
  try {
    const response = await api.post('/admin/question', data);
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

export const updateQuestion = async (id: string, data: any) => {
  try {
    const response = await api.put(`/admin/question/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

export const deleteQuestion = async (id: string) => {
  try {
    const response = await api.delete(`/admin/question/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

// Test Assignment
export const assignTest = async (data: { userId: string; testTemplateId: string; assignedBy: string }) => {
  try {
    const response = await api.post('/admin/assign-test', data);
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

// Results
export const getTestResults = async (testTemplateId: string) => {
  try {
    const response = await api.get(`/admin/results/${testTemplateId}`);
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

// Test Template Management
export const createTestTemplate = async (data: any) => {
  try {
    const response = await api.post('/admin/test-templates', data);
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

export const getTestTemplateWithQuestions = async (testTemplateId: string) => {
  try {
    const response = await api.get(`/admin/test-templates/${testTemplateId}`);
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

// Attempts Management
export const getTestAttemptsWithAnswers = async (testTemplateId: string) => {
  try {
    const response = await api.get(`/admin/attempts/${testTemplateId}`);
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

// Get individual attempt by ID
export const getAttemptById = async (attemptId: string) => {
  try {
    const response = await api.get(`/admin/attempts/single/${attemptId}`);
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

export const markAttempt = async (attemptId: string, score: number, approved: boolean) => {
  try {
    const response = await api.put(`/admin/attempts/${attemptId}/mark`, { score, approved });
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

// Dashboard Statistics
export const getDashboardStats = async () => {
  try {
    const response = await api.get('/admin/dashboard/stats');
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};
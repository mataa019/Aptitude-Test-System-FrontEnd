import api from './api';

// Create a new question
export const createQuestion = (data: any) =>
  api.post('/admin/question', data);

// Update a question
export const updateQuestion = (id: string, data: any) =>
  api.put(`/admin/question/${id}`, data);

// Delete a question
export const deleteQuestion = (id: string) =>
  api.delete(`/admin/question/${id}`);

// Assign a test to a user
export const assignTest = (data: { userId: string; testTemplateId: string; assignedBy: string }) =>
  api.post('/admin/assign-test', data);

// Get test results for a template
export const getTestResults = (testTemplateId: string) =>
  api.get(`/admin/results/${testTemplateId}`);

// Create a test template
export const createTestTemplate = (data: any) =>
  api.post('/admin/test-templates', data);

// Get a test template with all questions
export const getTestTemplateWithQuestions = (testTemplateId: string) =>
  api.get(`/admin/test-templates/${testTemplateId}`);

// Get all attempts for a test template (with answers)
export const getTestAttemptsWithAnswers = (testTemplateId: string) =>
  api.get(`/admin/attempts/${testTemplateId}`);

// Mark/approve a test attempt
export const markAttempt = (attemptId: string, score: number, approved: boolean) =>
  api.put(`/admin/attempts/${attemptId}/mark`, { score, approved });
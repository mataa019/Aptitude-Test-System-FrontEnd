import axios from './axios'; 

// Create a new question
export const createQuestion = (data: any, token: string) =>
  axios.post('/admin/question', data, {
    headers: { Authorization: `Bearer ${token}` }
  });

// Update a question
export const updateQuestion = (id: string, data: any, token: string) =>
  axios.put(`/admin/question/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });

// Delete a question
export const deleteQuestion = (id: string, token: string) =>
  axios.delete(`/admin/question/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });

// Assign a test to a user
export const assignTest = (data: { userId: string; testTemplateId: string; assignedBy: string }, token: string) =>
  axios.post('/admin/assign-test', data, {
    headers: { Authorization: `Bearer ${token}` }
  });

// Get test results for a template
export const getTestResults = (testTemplateId: string, token: string) =>
  axios.get(`/admin/results/${testTemplateId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });

// Create a test template
export const createTestTemplate = (data: any, token: string) =>
  axios.post('/admin/test-templates', data, {
    headers: { Authorization: `Bearer ${token}` }
  });

// Get a test template with all questions
export const getTestTemplateWithQuestions = (testTemplateId: string, token: string) =>
  axios.get(`/admin/test-templates/${testTemplateId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });

// Get all attempts for a test template (with answers)
export const getTestAttemptsWithAnswers = (testTemplateId: string, token: string) =>
  axios.get(`/admin/attempts/${testTemplateId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });

// Mark/approve a test attempt
export const markAttempt = (attemptId: string, score: number, approved: boolean, token: string) =>
  axios.put(`/admin/attempts/${attemptId}/mark`, { score, approved }, {
    headers: { Authorization: `Bearer ${token}` }
  });
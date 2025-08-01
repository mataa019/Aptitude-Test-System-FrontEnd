import api from './axios';
import { Attempt, MarkingDTO, TestTemplate } from '../types/admin';

// Get all test attempts for admin review
export const getAllAttempts = async (): Promise<Attempt[]> => {
  const response = await api.get('/admin/attempts');
  return response.data;
};

// Get attempts for a specific test template
export const getTemplateAttempts = async (templateId: string): Promise<Attempt[]> => {
  const response = await api.get(`/admin/template/${templateId}/attempts`);
  return response.data;
};

// Get specific attempt details for review
export const getAttemptDetails = async (attemptId: string): Promise<Attempt> => {
  const response = await api.get(`/admin/attempt/${attemptId}`);
  return response.data;
};

// Mark/grade an attempt
export const markAttempt = async (attemptId: string, markingData: MarkingDTO) => {
  const response = await api.post(`/admin/attempt/${attemptId}/mark`, markingData);
  return response.data;
};

// Approve an attempt
export const approveAttempt = async (attemptId: string) => {
  const response = await api.post(`/admin/attempt/${attemptId}/approve`);
  return response.data;
};

// Get all test templates
export const getTestTemplates = async (): Promise<TestTemplate[]> => {
  const response = await api.get('/admin/templates');
  return response.data;
};

// Create new test template
export const createTestTemplate = async (template: Partial<TestTemplate>) => {
  const response = await api.post('/admin/templates', template);
  return response.data;
};

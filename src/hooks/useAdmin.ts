import { useState } from 'react';
import type { Attempt, TestTemplate, AdminDashboardStats } from '../types/admin';
import { 
  getTestAttemptsWithAnswers,
  getTestTemplateWithQuestions,
  markAttempt,
  createTestTemplate
} from '../api/admin';

export const useAdmin = () => {
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [currentAttempt, setCurrentAttempt] = useState<Attempt | null>(null);
  const [templates, setTemplates] = useState<TestTemplate[]>([]);
  const [dashboardStats, setDashboardStats] = useState<AdminDashboardStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch attempts for a specific test template
  const fetchTemplateAttempts = async (testTemplateId: string) => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');
      
      const response = await getTestAttemptsWithAnswers(testTemplateId, token);
      const attemptData = response.data.data || response.data;
      setAttempts(attemptData);
      return attemptData;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch template attempts';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Get specific template with questions
  const fetchTemplateDetails = async (testTemplateId: string) => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');
      
      const response = await getTestTemplateWithQuestions(testTemplateId, token);
      const templateData = response.data.data || response.data;
      return templateData;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch template details';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Mark an attempt with score and approval status
  const markAttemptById = async (attemptId: string, score: number, approved: boolean = false) => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');
      
      const response = await markAttempt(attemptId, score, approved, token);
      return response.data;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to mark attempt';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Create new test template
  const createNewTemplate = async (template: any) => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');
      
      const response = await createTestTemplate(template, token);
      const newTemplate = response.data.data || response.data;
      setTemplates(prev => [...prev, newTemplate]);
      return newTemplate;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to create template';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return {
    attempts,
    currentAttempt,
    templates,
    dashboardStats,
    loading,
    error,
    fetchTemplateAttempts,
    fetchTemplateDetails,
    markAttemptById,
    createNewTemplate,
    clearError,
    setError
  };
};

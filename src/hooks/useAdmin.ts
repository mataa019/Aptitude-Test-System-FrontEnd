import { useState, useEffect } from 'react';
import type { Attempt, TestTemplate, MarkingDTO, AdminDashboardStats } from '../types/admin';
import { 
  getAllAttempts, 
  getTemplateAttempts, 
  getAttemptDetails, 
  markAttempt, 
  approveAttempt,
  getTestTemplates,
  createTestTemplate
} from '../api/admin';

export const useAdmin = () => {
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [currentAttempt, setCurrentAttempt] = useState<Attempt | null>(null);
  const [templates, setTemplates] = useState<TestTemplate[]>([]);
  const [dashboardStats, setDashboardStats] = useState<AdminDashboardStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAllAttempts = async () => {
    try {
      setLoading(true);
      setError(null);
      const allAttempts = await getAllAttempts();
      setAttempts(allAttempts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch attempts');
    } finally {
      setLoading(false);
    }
  };

  const fetchTemplateAttempts = async (templateId: string) => {
    try {
      setLoading(true);
      setError(null);
      const templateAttempts = await getTemplateAttempts(templateId);
      setAttempts(templateAttempts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch template attempts');
    } finally {
      setLoading(false);
    }
  };

  const fetchAttemptDetails = async (attemptId: string) => {
    try {
      setLoading(true);
      setError(null);
      const attempt = await getAttemptDetails(attemptId);
      setCurrentAttempt(attempt);
      return attempt;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch attempt details');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const markAttemptById = async (attemptId: string, markingData: MarkingDTO) => {
    try {
      setLoading(true);
      setError(null);
      await markAttempt(attemptId, markingData);
      // Refresh attempts and current attempt
      await Promise.all([
        fetchAllAttempts(),
        currentAttempt && fetchAttemptDetails(currentAttempt.id)
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark attempt');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const approveAttemptById = async (attemptId: string) => {
    try {
      setLoading(true);
      setError(null);
      await approveAttempt(attemptId);
      // Refresh attempts and current attempt
      await Promise.all([
        fetchAllAttempts(),
        currentAttempt && fetchAttemptDetails(currentAttempt.id)
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to approve attempt');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchTestTemplates = async () => {
    try {
      setLoading(true);
      setError(null);
      const allTemplates = await getTestTemplates();
      setTemplates(allTemplates);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch templates');
    } finally {
      setLoading(false);
    }
  };

  const createTemplate = async (template: Partial<TestTemplate>) => {
    try {
      setLoading(true);
      setError(null);
      const newTemplate = await createTestTemplate(template);
      await fetchTestTemplates(); // Refresh templates
      return newTemplate;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create template');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const calculateDashboardStats = () => {
    if (attempts.length === 0) return null;

    const stats: AdminDashboardStats = {
      totalTemplates: templates.length,
      totalAttempts: attempts.length,
      pendingReviews: attempts.filter(a => a.status === 'submitted').length,
      recentActivity: attempts
        .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
        .slice(0, 5)
        .map(attempt => ({
          id: attempt.id,
          type: 'attempt_submitted' as const,
          description: `${attempt.user.firstName} ${attempt.user.lastName} submitted ${attempt.test.title}`,
          timestamp: attempt.submittedAt,
          userId: attempt.userId,
          userName: `${attempt.user.firstName} ${attempt.user.lastName}`
        }))
    };

    setDashboardStats(stats);
    return stats;
  };

  const clearCurrentAttempt = () => {
    setCurrentAttempt(null);
  };

  useEffect(() => {
    fetchAllAttempts();
    fetchTestTemplates();
  }, []);

  useEffect(() => {
    calculateDashboardStats();
  }, [attempts, templates]);

  return {
    attempts,
    currentAttempt,
    templates,
    dashboardStats,
    loading,
    error,
    fetchAllAttempts,
    fetchTemplateAttempts,
    fetchAttemptDetails,
    markAttemptById,
    approveAttemptById,
    fetchTestTemplates,
    createTemplate,
    clearCurrentAttempt,
    setError
  };
};

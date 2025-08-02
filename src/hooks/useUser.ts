import { useState, useEffect } from 'react';
import type { Test, TestResult, TestSubmission } from '../types/user';
import { 
  getProfile,
  getAssignedTests, 
  getResults, 
  submitAnswers,
  startAssignment,
  completeAssignment,
  type SubmitAnswerDto
} from '../api/user';

export const useUser = () => {
  const [assignedTests, setAssignedTests] = useState<Test[]>([]);
  const [currentTest, setCurrentTest] = useState<Test | null>(null);
  const [results, setResults] = useState<TestResult[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get user ID from localStorage or auth context
  const getUserId = () => {
    // This should come from your auth context or token
    // For now, we'll use a placeholder
    return localStorage.getItem('userId') || 'current-user';
  };

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const userId = getUserId();
      const response = await getProfile(userId);
      const profileData = response.data.data || response.data;
      setUserProfile(profileData);
      return profileData;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch user profile';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const fetchAssignedTests = async () => {
    try {
      setLoading(true);
      setError(null);
      const userId = getUserId();
      const response = await getAssignedTests(userId);
      const testsData = response.data.data || response.data;
      setAssignedTests(testsData);
      return testsData;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch assigned tests';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const fetchTestDetails = async (testId: string) => {
    try {
      setLoading(true);
      setError(null);
      // Note: Your backend doesn't have a single test details endpoint
      // You might need to get this from the assigned tests or implement it on backend
      const userId = getUserId();
      const response = await getAssignedTests(userId);
      const testsData = response.data.data || response.data;
      const test = testsData.find((t: any) => t.id === testId);
      if (!test) {
        throw new Error('Test not found');
      }
      setCurrentTest(test);
      return test;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch test details';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const fetchResults = async () => {
    try {
      setLoading(true);
      setError(null);
      const userId = getUserId();
      const response = await getResults(userId);
      const resultsData = response.data.data || response.data;
      setResults(resultsData);
      return resultsData;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch results';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const submitTest = async (submission: TestSubmission) => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      // Convert submission to your backend format
      const submitData: SubmitAnswerDto = {
        assignmentId: submission.testId,
        responses: submission.answers.map(answer => ({
          questionId: answer.questionId,
          answer: answer.answer
        }))
      };

      const result = await submitAnswers(submitData, token);
      // Refresh assigned tests and results after submission
      await Promise.all([fetchAssignedTests(), fetchResults()]);
      return result.data;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to submit test';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const startTestAssignment = async (assignmentId: string) => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const response = await startAssignment(assignmentId, token);
      return response.data;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to start assignment';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const completeTestAssignment = async (assignmentId: string) => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const response = await completeAssignment(assignmentId, token);
      // Refresh assigned tests and results after completion
      await Promise.all([fetchAssignedTests(), fetchResults()]);
      return response.data;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to complete assignment';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const clearCurrentTest = () => {
    setCurrentTest(null);
  };

  useEffect(() => {
    fetchAssignedTests();
    fetchResults();
  }, []);

  return {
    assignedTests,
    currentTest,
    results,
    userProfile,
    loading,
    error,
    fetchUserProfile,
    fetchAssignedTests,
    fetchTestDetails,
    fetchResults,
    submitTest,
    startTestAssignment,
    completeTestAssignment,
    clearCurrentTest,
    setError
  };
};

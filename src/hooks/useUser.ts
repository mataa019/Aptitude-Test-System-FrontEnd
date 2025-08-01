import { useState, useEffect } from 'react';
import type { Test, TestResult, TestSubmission } from '../types/user';
import { getAssignedTests, getTestDetails, getUserResults, submitTestAnswers } from '../api/user';

export const useUser = () => {
  const [assignedTests, setAssignedTests] = useState<Test[]>([]);
  const [currentTest, setCurrentTest] = useState<Test | null>(null);
  const [results, setResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAssignedTests = async () => {
    try {
      setLoading(true);
      setError(null);
      const tests = await getAssignedTests();
      setAssignedTests(tests);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch assigned tests');
    } finally {
      setLoading(false);
    }
  };

  const fetchTestDetails = async (testId: string) => {
    try {
      setLoading(true);
      setError(null);
      const test = await getTestDetails(testId);
      setCurrentTest(test);
      return test;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch test details');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchResults = async () => {
    try {
      setLoading(true);
      setError(null);
      const userResults = await getUserResults();
      setResults(userResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch results');
    } finally {
      setLoading(false);
    }
  };

  const submitTest = async (submission: TestSubmission) => {
    try {
      setLoading(true);
      setError(null);
      const result = await submitTestAnswers(submission);
      // Refresh assigned tests and results after submission
      await Promise.all([fetchAssignedTests(), fetchResults()]);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit test');
      throw err;
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
    loading,
    error,
    fetchAssignedTests,
    fetchTestDetails,
    fetchResults,
    submitTest,
    clearCurrentTest,
    setError
  };
};

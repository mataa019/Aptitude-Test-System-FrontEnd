import React, { useState, useEffect } from 'react';
import { TestTakingForm } from '../components/user/TestTakingForm';
import { Loader } from '../components/common/Loader';
import { getTestById, startTest, submitAnswer, finishTest } from '../api/user';
import type { TestAnswer } from '../types/user';

interface TestProps {
  testId: string;
  onTestComplete: () => void;
  onBack: () => void;
}

export const Test: React.FC<TestProps> = ({ testId, onTestComplete, onBack }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTest, setCurrentTest] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

  useEffect(() => {
    const loadTest = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await getTestById(testId);
        setCurrentTest(response.data || response);
      } catch (err: any) {
        setError(err.message || 'Failed to load test');
        console.error('Failed to load test:', err);
      } finally {
        setLoading(false);
      }
    };

    if (testId) {
      loadTest();
    }
  }, [testId]);

  const handleStartTest = async () => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      await startTest(testId);
      setIsStarted(true);
    } catch (err: any) {
      setError(err.message || 'Failed to start test');
      console.error('Failed to start test:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitTest = async (answers: TestAnswer[], timeSpent: number) => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      // Submit all answers
      for (const answer of answers) {
        await submitAnswer(testId, answer.questionId, answer.answer);
      }
      
      // Finish the test
      await finishTest(testId);
      onTestComplete();
    } catch (err: any) {
      setError(err.message || 'Failed to submit test');
      console.error('Failed to submit test:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading && !currentTest) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader size="lg" text="Loading test..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4">
            Error: {error}
          </div>
          <button
            onClick={onBack}
            className="text-blue-600 hover:text-blue-500 font-medium"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!currentTest) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-600 px-4 py-3 rounded mb-4">
            Test not found or no longer available.
          </div>
          <button
            onClick={onBack}
            className="text-blue-600 hover:text-blue-500 font-medium"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <div className="mb-6">
          <button
            onClick={onBack}
            className="text-blue-600 hover:text-blue-500 font-medium flex items-center"
            disabled={isSubmitting}
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* Test Start Screen */}
        {!isStarted ? (
          <div className="bg-white shadow rounded-lg p-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {currentTest.title}
              </h2>
              <p className="text-gray-600 mb-6">
                {currentTest.description}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {currentTest.questions?.length || 0}
                  </div>
                  <div className="text-sm text-gray-500">Questions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {currentTest.duration || 60}
                  </div>
                  <div className="text-sm text-gray-500">Minutes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {currentTest.totalPoints || 100}
                  </div>
                  <div className="text-sm text-gray-500">Points</div>
                </div>
              </div>
              <button
                onClick={handleStartTest}
                disabled={isSubmitting}
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 font-medium"
              >
                {isSubmitting ? 'Starting Test...' : 'Start Test'}
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Test Taking Form */}
            <TestTakingForm
              test={currentTest}
              onSubmit={handleSubmitTest}
              isSubmitting={isSubmitting}
            />

            {/* Warning about leaving page */}
            <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Important Notice
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>
                      Please do not refresh this page or navigate away during the test. 
                      Your progress may be lost. The test will auto-submit when time runs out.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

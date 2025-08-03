import React, { useState, useEffect } from 'react';
import { TestTakingForm } from '../../components/user/TestTakingForm';
import { TestReviewForm } from '../../components/user/TestReviewForm';
import { Loader } from '../../components/common/Loader';
import { getTestById, startTest, submitAnswers, finishTest, getSubmittedTest } from '../../api/user';
import type { TestAnswer } from '../../types/user';

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
  const [isCompleted, setIsCompleted] = useState(false);
  const [submitResponse, setSubmitResponse] = useState<any>(null);
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [reviewData, setReviewData] = useState<any>(null);

  useEffect(() => {
    const loadTest = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await getTestById(testId);
        // The API now returns { message: "Test fetched successfully", data: {...} }
        const testData = response.data || response;
        setCurrentTest(testData);
        
        // Check if this is an assignment (from assigned tests) that has a status
        // If the test assignment status is 'in-progress' or 'started', automatically start
        if (testData.status === 'in-progress' || testData.status === 'started') {
          console.log('Test already in progress, skipping start step');
          setIsStarted(true);
        }
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
      
      // Check if test is already started
      if (currentTest?.status === 'in-progress' || currentTest?.status === 'started') {
        console.log('Test already started, proceeding to test form');
        setIsStarted(true);
        return;
      }
      
      const result = await startTest(testId);
      console.log('Start test result:', result);
      setIsStarted(true);
    } catch (err: any) {
      console.error('Failed to start test:', err);
      
      // If error is about test already started, just proceed
      if (err.message.includes("already started") || err.message.includes("Current status: started")) {
        console.log('Test was already started, proceeding to test form');
        setIsStarted(true);
        setError(null);
      } else {
        setError(err.message || 'Failed to start test');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitTest = async (answers: TestAnswer[], timeSpent: number) => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      console.log(`Submitting test with ${answers.length} answers after ${timeSpent} seconds`);
      
      // Submit all answers at once
      const submitResponse = await submitAnswers(testId, answers);
      console.log('Submit response:', submitResponse);
      
      // Store the response to display success information
      setSubmitResponse(submitResponse);
      
      // Check if submit was successful
      if (submitResponse.message === "Answers submitted successfully") {
        setIsCompleted(true);
        
        try {
          // Complete the test
          const completeResponse = await finishTest(testId);
          console.log('Complete response:', completeResponse);
        } catch (completeError: any) {
          console.warn('Complete test failed, but submit was successful:', completeError);
          // Don't throw error here since submit was successful
        }
      }
      
      // Don't call onTestComplete immediately - let user see the success screen
    } catch (err: any) {
      setError(err.message || 'Failed to submit test');
      console.error('Failed to submit test:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewAnswers = async () => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      const response = await getSubmittedTest(testId);
      console.log('Submitted test data:', response);
      
      setReviewData(response.data);
      setIsReviewMode(true);
    } catch (err: any) {
      setError(err.message || 'Failed to load submitted test');
      console.error('Failed to load submitted test:', err);
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
        {/* Review Mode */}
        {isReviewMode && reviewData ? (
          <TestReviewForm 
            testData={reviewData} 
            onBack={() => setIsReviewMode(false)} 
          />
        ) : (
          <>
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

            {/* Test Completed Screen */}
            {isCompleted && submitResponse ? (
          <div className="bg-white shadow rounded-lg p-8">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Test Submitted Successfully!
              </h2>
              <p className="text-gray-600 mb-6">
                {submitResponse.message}
              </p>
              
              {/* Submission Details */}
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Submission Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="text-left">
                    <span className="font-medium text-gray-700">Submission ID:</span>
                    <p className="text-gray-900 font-mono">{submitResponse.data.id}</p>
                  </div>
                  <div className="text-left">
                    <span className="font-medium text-gray-700">Test Template ID:</span>
                    <p className="text-gray-900 font-mono">{submitResponse.data.testTemplateId}</p>
                  </div>
                  <div className="text-left">
                    <span className="font-medium text-gray-700">Started At:</span>
                    <p className="text-gray-900">{new Date(submitResponse.data.startedAt).toLocaleString()}</p>
                  </div>
                  <div className="text-left">
                    <span className="font-medium text-gray-700">Status:</span>
                    <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium capitalize">
                      {submitResponse.data.status}
                    </span>
                  </div>
                  <div className="text-left md:col-span-2">
                    <span className="font-medium text-gray-700">Answers Submitted:</span>
                    <p className="text-gray-900">{JSON.parse(submitResponse.data.answers).length} answers</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-center space-x-4">
                <button
                  onClick={onBack}
                  className="px-6 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 font-medium"
                >
                  Return to Dashboard
                </button>
                <button
                  onClick={handleViewAnswers}
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 font-medium"
                >
                  {isSubmitting ? 'Loading...' : 'View My Answers'}
                </button>
                <button
                  onClick={() => onTestComplete()}
                  className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium"
                >
                  View Results
                </button>
              </div>
            </div>
          </div>
        ) : 
        /* Test Start Screen */
        !isStarted ? (
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
        </>
        )}
      </div>
    </div>
  );
};

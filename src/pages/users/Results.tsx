import React, { useState, useEffect } from 'react';
import { SubmittedTestsList } from '../../components/user/SubmittedTestsList';
import { TestReviewForm } from '../../components/user/TestReviewForm';
import { getUserAttempts, getDetailedReview } from '../../api/user';
import { useLocation } from 'react-router-dom';

interface ResultsProps {
  onBack: () => void;
}

export const Results: React.FC<ResultsProps> = ({ onBack }) => {
  const location = useLocation();
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTestId, setSelectedTestId] = useState<string | null>(null);
  const [detailedReview, setDetailedReview] = useState<any | null>(null);
  const [loadingReview, setLoadingReview] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await getUserAttempts();
        setResults(response.data || response || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load test results');
        console.error('Error fetching results:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  // Handle detailed review fetching
  const fetchDetailedReview = async (attemptId: string) => {
    try {
      setLoadingReview(true);
      const response = await getDetailedReview(attemptId);
      setDetailedReview(response.data || response);
      setSelectedTestId(attemptId);
    } catch (err: any) {
      setError(err.message || 'Failed to load detailed review');
      console.error('Error fetching detailed review:', err);
    } finally {
      setLoadingReview(false);
    }
  };

  // Check for test ID in URL hash and automatically show detailed view
  useEffect(() => {
    const hash = location.hash.substring(1); // Remove the # symbol
    if (hash && hash !== 'all') {
      console.log('🔗 URL hash detected, showing detailed view for:', hash);
      fetchDetailedReview(hash);
    }
  }, [location.hash]);

  const handleViewTestDetails = (testId: string) => {
    console.log('🔍 Switching to detailed view for testId:', testId);
    fetchDetailedReview(testId);
    // Update URL hash to reflect the current view
    window.history.replaceState(null, '', `${window.location.pathname}#${testId}`);
  };

  const handleBackToList = () => {
    console.log('🔙 Returning to list view');
    setSelectedTestId(null);
    setDetailedReview(null);
    // Clear the URL hash
    window.history.replaceState(null, '', window.location.pathname);
  };

  // If a test is selected, show detailed review
  if (selectedTestId && detailedReview) {
    console.log('📋 Rendering detailed review for testId:', selectedTestId);
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <button
              onClick={handleBackToList}
              className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
            >
              ← Back to Results
            </button>
          </div>

          <div className="bg-white shadow rounded-lg overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <h1 className="text-xl font-semibold text-gray-900">Detailed Test Review</h1>
              <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-600">
                <span>Score: {detailedReview.score}</span>
                <span>Percentage: {detailedReview.breakdown?.percentage || 0}%</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  detailedReview.approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {detailedReview.approved ? 'Approved' : 'Under Review'}
                </span>
              </div>
            </div>

            {/* Feedback Section */}
            {detailedReview.feedback && (
              <div className="px-6 py-4 border-b border-gray-200 bg-blue-50">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Feedback</h3>
                <p className="text-gray-700">{detailedReview.feedback}</p>
                {detailedReview.reviewedBy && (
                  <p className="text-sm text-gray-500 mt-2">Reviewed by: {detailedReview.reviewedBy}</p>
                )}
              </div>
            )}

            {/* Questions and Answers */}
            {detailedReview.breakdown?.questionResults && (
              <div className="px-6 py-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Question Breakdown</h3>
                <div className="space-y-6">
                  {detailedReview.breakdown.questionResults.map((question: any, index: number) => (
                    <div key={question.questionId} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-medium text-gray-900">Question {index + 1}</h4>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            question.isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {question.isCorrect ? 'Correct' : 'Incorrect'}
                          </span>
                          <span className="text-sm font-medium text-gray-600">
                            {question.pointsEarned}/{question.maxMarks} pts
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 mb-3">{question.questionText}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-500 mb-1">Your Answer:</p>
                          <p className="text-gray-900 bg-gray-50 p-2 rounded">
                            {question.submittedAnswer || 'No answer provided'}
                          </p>
                        </div>
                        {question.correctAnswer && question.correctAnswer.length > 0 && (
                          <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Correct Answer:</p>
                            <p className="text-green-700 bg-green-50 p-2 rounded">
                              {Array.isArray(question.correctAnswer) 
                                ? question.correctAnswer.join(', ') 
                                : question.correctAnswer}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Summary Statistics */}
                {detailedReview.breakdown?.statistics && (
                  <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">
                        {detailedReview.breakdown.statistics.totalQuestions}
                      </p>
                      <p className="text-sm text-gray-600">Total Questions</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">
                        {detailedReview.breakdown.statistics.correctAnswers}
                      </p>
                      <p className="text-sm text-gray-600">Correct</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-red-600">
                        {detailedReview.breakdown.statistics.incorrectAnswers}
                      </p>
                      <p className="text-sm text-gray-600">Incorrect</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-yellow-600">
                        {detailedReview.breakdown.statistics.unanswered}
                      </p>
                      <p className="text-sm text-gray-600">Unanswered</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Loading state for detailed review
  if (loadingReview && selectedTestId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading detailed review...</p>
        </div>
      </div>
    );
  }

  // If a test is selected but no detailed review yet, show original TestReviewForm
  if (selectedTestId) {
    console.log('📋 Rendering TestReviewForm for testId:', selectedTestId);
    return (
      <div key={`test-review-${selectedTestId}`}>
        <TestReviewForm 
          testId={selectedTestId} 
          onBack={handleBackToList}
        />
      </div>
    );
  }

  console.log('📋 Rendering Results list view');

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={onBack}
            className="text-blue-600 hover:text-blue-500 font-medium flex items-center mb-4"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Test Results</h1>
          <p className="mt-2 text-gray-600">
            View all your completed test results and performance analytics.
          </p>
        </div>

        {/* Results Overview */}
        {results.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="text-2xl">📊</div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Tests
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {results.length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="text-2xl">📈</div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Average Score
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {Math.round(results.reduce((sum, r) => sum + r.percentage, 0) / results.length)}%
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="text-2xl">🏆</div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Best Score
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {Math.max(...results.map(r => r.percentage)).toFixed(0)}%
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="text-2xl">⏱️</div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Avg. Time
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {Math.round(results.reduce((sum, r) => sum + r.timeSpent, 0) / results.length)} min
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results List */}
        <div className="bg-white shadow rounded-lg p-6">
          <SubmittedTestsList
            submittedTests={results}
            onViewDetails={handleViewTestDetails}
            isLoading={loading}
          />
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { AdminNav } from '../../components/admin/AdminNav';
import { AttemptReview } from '../../components/admin/AttemptReview';
import { Loader } from '../../components/common/Loader';
import { getAttemptForReview } from '../../api/admin';

interface ReviewProps {
  attemptId: string;
  currentPage: string;
  onNavigate: (page: string) => void;
  onBack: () => void;
}

export const Review: React.FC<ReviewProps> = ({ 
  attemptId, 
  currentPage, 
  onNavigate, 
  onBack 
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentAttempt, setCurrentAttempt] = useState<any>(null);
  const [isMarking] = useState(false);

  const fetchAttemptDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch the specific attempt by ID for review using the specialized endpoint
      const response = await getAttemptForReview(attemptId);
      
      // Transform the data to match AttemptReview component expectations
      const transformedAttempt = {
        id: response.data.id,
        status: response.data.status,
        submittedAt: response.data.startedAt, // Use startedAt since submittedAt might be null
        timeSpent: response.data.assignment.testTemplate.timeLimit, // Approximate from time limit
        answers: response.data.parsedAnswers, // Use the parsed answers directly
        user: response.data.user,
        test: {
          testTemplate: response.data.assignment.testTemplate
        },
        assignment: response.data.assignment,
        feedback: response.data.feedback || '',
        score: response.data.score,
        approved: response.data.approved
      };
      
      setCurrentAttempt(transformedAttempt);
      
    } catch (err: any) {
      setError(err.message || 'Failed to load attempt details');
      console.error('Error fetching attempt details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (attemptId) {
      fetchAttemptDetails();
    }
  }, [attemptId]);

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav currentPage={currentPage} onNavigate={onNavigate} />
      
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <div className="mb-6">
            <button
              onClick={onBack}
              className="text-blue-600 hover:text-blue-500 font-medium flex items-center"
            >
              ← Back to Attempts
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-6">
              Error: {error}
            </div>
          )}

          {loading && !currentAttempt ? (
            <div className="flex justify-center py-8">
              <Loader size="lg" text="Loading attempt details..." />
            </div>
          ) : currentAttempt ? (
            <div className="space-y-6">
              {/* Attempt Summary */}
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Attempt Review: {currentAttempt.test?.testTemplate?.name}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Student:</span>
                    <p className="text-gray-900">{currentAttempt.user?.name}</p>
                    <p className="text-gray-600">{currentAttempt.user?.email}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Test Details:</span>
                    <p className="text-gray-900">{currentAttempt.test?.testTemplate?.category}</p>
                    <p className="text-gray-600">{currentAttempt.test?.testTemplate?.timeLimit} minutes</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Status:</span>
                    <p className="text-gray-900 capitalize">{currentAttempt.status}</p>
                    <p className="text-gray-600">
                      Started: {new Date(currentAttempt.submittedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Attempt Review Component */}
              <AttemptReview
                attempt={currentAttempt}
                onMarkingComplete={() => {
                  // Refresh the attempt data after marking
                  console.log('Marking completed, refreshing data...');
                  fetchAttemptDetails();
                }}
                isLoading={isMarking}
              />
            </div>
          ) : (
            <div className="bg-white shadow rounded-lg p-6">
              <div className="text-center py-8">
                <h2 className="text-xl font-medium text-gray-900 mb-2">
                  Attempt Not Found
                </h2>
                <p className="text-gray-600 mb-4">
                  The requested attempt could not be found or you don't have permission to view it.
                </p>
                <button
                  onClick={onBack}
                  className="text-blue-600 hover:text-blue-500 font-medium"
                >
                  ← Back to Attempts
                </button>
              </div>
            </div>
          )}

          {/* Help Section */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-blue-900 mb-2">
              Marking Guidelines
            </h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Review each answer carefully against the correct answer or expected response</li>
              <li>• Adjust points for each question based on the quality of the response</li>
              <li>• Provide constructive feedback to help the student improve</li>
              <li>• Mark the attempt once you've reviewed all questions</li>
              <li>• Approve the result to make it final and visible to the student</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

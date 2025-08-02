import React, { useState, useEffect } from 'react';
import { AdminNav } from '../../components/admin/AdminNav';
import { AttemptReview } from '../../components/admin/AttemptReview';
import { Loader } from '../../components/common/Loader';
import { useAdmin } from '../../hooks/useAdmin';

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
  const { 
    loading, 
    error 
  } = useAdmin();
  
  const [currentAttempt] = useState<any>(null);
  const [isMarking] = useState(false);

  // Note: For now, we'll need to implement attempt details fetching separately
  // or modify the backend to provide this functionality
  useEffect(() => {
    // TODO: Implement individual attempt details fetching
    // For now, you would need to pass the attempt data from the parent component
    console.log('Attempt ID:', attemptId);
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
            <AttemptReview
              attempt={currentAttempt}
              onMarkingComplete={() => {
                // Handle marking completion
                console.log('Marking completed');
              }}
              isLoading={isMarking}
            />
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

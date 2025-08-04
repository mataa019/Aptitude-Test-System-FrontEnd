import React, { useState, useEffect } from 'react';
import { Loader } from '../common/Loader';

interface ResultDetail {
  attemptId: string;
  testTemplate: {
    id: string;
    name: string;
    category: string;
    timeLimit: number;
  };
  submittedAt: string | null;
  reviewedAt: string | null;
  status: string;
  approved: boolean | null;
  assignment: {
    assignedAt: string;
    assignedBy: string;
  };
  gradingSummary: {
    totalScore: string;
    percentage: number;
    grade: string;
    status: string;
  };
  hasDetailedReview: boolean;
  reviewedBy: string | null;
  feedback?: string;
  questions?: Array<{
    id: string;
    text: string;
    type: string;
    userAnswer: string;
    correctAnswer?: string;
    points: number;
    maxPoints: number;
  }>;
}

interface ResultDetailViewProps {
  attemptId: string;
  onBack: () => void;
}

export const ResultDetailView: React.FC<ResultDetailViewProps> = ({
  attemptId,
  onBack
}) => {
  const [result, setResult] = useState<ResultDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResultDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // This would be a new API endpoint to get detailed result information
        // For now, we'll simulate the data structure
        // const response = await getUserResultDetails(attemptId);
        // setResult(response.data);
        
        // Simulated result detail - replace with actual API call
        setTimeout(() => {
          setResult({
            attemptId,
            testTemplate: {
              id: 'template-id',
              name: 'Sample Test',
              category: 'Programming',
              timeLimit: 60
            },
            submittedAt: new Date().toISOString(),
            reviewedAt: new Date().toISOString(),
            status: 'completed',
            approved: true,
            assignment: {
              assignedAt: new Date().toISOString(),
              assignedBy: 'admin-id'
            },
            gradingSummary: {
              totalScore: '8/10',
              percentage: 80,
              grade: 'A',
              status: 'Approved'
            },
            hasDetailedReview: true,
            reviewedBy: 'admin-id',
            feedback: 'Great work! You demonstrated good understanding of the concepts.',
            questions: [
              {
                id: '1',
                text: 'What is React?',
                type: 'sentence',
                userAnswer: 'React is a JavaScript library for building user interfaces.',
                correctAnswer: 'React is a JavaScript library for building user interfaces.',
                points: 5,
                maxPoints: 5
              },
              {
                id: '2',
                text: 'Explain the concept of state in React.',
                type: 'sentence',
                userAnswer: 'State is data that can change over time.',
                points: 3,
                maxPoints: 5
              }
            ]
          });
          setLoading(false);
        }, 1000);
        
      } catch (err: any) {
        setError(err.message || 'Failed to load result details');
        setLoading(false);
      }
    };

    if (attemptId) {
      fetchResultDetails();
    }
  }, [attemptId]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'submitted':
        return 'bg-yellow-100 text-yellow-800';
      case 'under review':
        return 'bg-blue-100 text-blue-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A':
        return 'text-green-600';
      case 'B':
        return 'text-blue-600';
      case 'C':
        return 'text-yellow-600';
      case 'D':
        return 'text-orange-600';
      case 'F':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center py-8">
              <Loader size="lg" text="Loading result details..." />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-6">
              Error: {error}
            </div>
            <button
              onClick={onBack}
              className="text-blue-600 hover:text-blue-500 font-medium"
            >
              ← Back to Results
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-8">
              <h2 className="text-xl font-medium text-gray-900 mb-2">
                Result Not Found
              </h2>
              <p className="text-gray-600 mb-4">
                The requested result could not be found.
              </p>
              <button
                onClick={onBack}
                className="text-blue-600 hover:text-blue-500 font-medium"
              >
                ← Back to Results
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <div className="mb-6">
            <button
              onClick={onBack}
              className="text-blue-600 hover:text-blue-500 font-medium flex items-center"
            >
              ← Back to Results
            </button>
          </div>

          {/* Result Header */}
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {result.testTemplate.name}
                </h1>
                <div className="flex items-center space-x-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(result.gradingSummary.status)}`}>
                    {result.gradingSummary.status}
                  </span>
                  {result.approved !== null && (
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      result.approved 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {result.approved ? '✓ Approved' : '✗ Not Approved'}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="text-right">
                <div className={`text-3xl font-bold ${getGradeColor(result.gradingSummary.grade)}`}>
                  {result.gradingSummary.grade}
                </div>
                <div className="text-sm text-gray-600">
                  {result.gradingSummary.totalScore} ({result.gradingSummary.percentage}%)
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div>
                <span className="font-medium">Category:</span> {result.testTemplate.category}
              </div>
              <div>
                <span className="font-medium">Time Limit:</span> {result.testTemplate.timeLimit} minutes
              </div>
              <div>
                <span className="font-medium">Submitted:</span> {
                  result.submittedAt 
                    ? new Date(result.submittedAt).toLocaleString()
                    : 'Not submitted'
                }
              </div>
            </div>
          </div>

          {/* Feedback Section */}
          {result.feedback && (
            <div className="bg-white shadow rounded-lg p-6 mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-3">Feedback</h2>
              <p className="text-gray-700">{result.feedback}</p>
              {result.reviewedAt && (
                <p className="text-sm text-gray-500 mt-2">
                  Reviewed on {new Date(result.reviewedAt).toLocaleString()}
                </p>
              )}
            </div>
          )}

          {/* Questions and Answers */}
          {result.questions && result.questions.length > 0 && (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Questions and Answers</h2>
              <div className="space-y-6">
                {result.questions.map((question, index) => (
                  <div key={question.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-md font-medium text-gray-900">
                        {index + 1}. {question.text}
                      </h3>
                      <div className="text-sm text-gray-600">
                        {question.points}/{question.maxPoints} points
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-700">Your Answer:</span>
                        <p className="mt-1 text-gray-900 bg-gray-50 p-3 rounded">
                          {question.userAnswer}
                        </p>
                      </div>
                      
                      {question.correctAnswer && (
                        <div>
                          <span className="text-sm font-medium text-gray-700">Expected Answer:</span>
                          <p className="mt-1 text-gray-700 bg-blue-50 p-3 rounded">
                            {question.correctAnswer}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No detailed questions available */}
          {(!result.questions || result.questions.length === 0) && (
            <div className="bg-white shadow rounded-lg p-6">
              <div className="text-center py-8">
                <div className="text-gray-400 text-6xl mb-4">📋</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Detailed Review Available</h3>
                <p className="text-gray-600">
                  Detailed question-by-question review is not available for this result.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import type { Attempt } from '../../types/admin';
import { Button } from '../common/Button';
import { getTestAttemptsWithAnswers } from '../../api/admin';

interface AttemptsListProps {
  testTemplateId?: string;
  attempts?: Attempt[];
  onReviewAttempt: (attemptId: string) => void;
  isLoading?: boolean;
}

export const AttemptsList: React.FC<AttemptsListProps> = ({
  testTemplateId,
  attempts: propAttempts,
  onReviewAttempt,
  isLoading: propIsLoading = false
}) => {
  const [attempts, setAttempts] = useState<Attempt[]>(propAttempts || []);
  const [isLoading, setIsLoading] = useState(propIsLoading);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (testTemplateId && !propAttempts) {
      fetchAttempts();
    }
  }, [testTemplateId, propAttempts]);

  const fetchAttempts = async () => {
    if (!testTemplateId) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await getTestAttemptsWithAnswers(testTemplateId);
      setAttempts(response.data || response);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch attempts');
      console.error('Error fetching attempts:', err);
    } finally {
      setIsLoading(false);
    }
  };
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4">
          {error}
        </div>
        {testTemplateId && (
          <button
            onClick={fetchAttempts}
            className="text-blue-600 hover:text-blue-500 font-medium"
          >
            Try Again
          </button>
        )}
      </div>
    );
  }

  if (attempts.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No attempts found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Test Attempts</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Student
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Test
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Submitted
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Time Spent
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Score
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {attempts.map((attempt) => (
              <tr key={attempt.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {attempt.user.firstName} {attempt.user.lastName}
                    </div>
                    <div className="text-sm text-gray-500">{attempt.user.email}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{attempt.test.title}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(attempt.submittedAt).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {attempt.timeSpent} min
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {attempt.score !== undefined ? (
                    <div className="text-sm text-gray-900">
                      {attempt.score}/{attempt.totalPoints}
                      <span className="text-gray-500 ml-1">
                        ({attempt.percentage?.toFixed(1)}%)
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500">Not graded</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      attempt.status === 'submitted'
                        ? 'bg-yellow-100 text-yellow-800'
                        : attempt.status === 'under-review'
                        ? 'bg-blue-100 text-blue-800'
                        : attempt.status === 'marked'
                        ? 'bg-purple-100 text-purple-800'
                        : attempt.status === 'approved'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {attempt.status.replace('-', ' ').toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Button
                    onClick={() => onReviewAttempt(attempt.id)}
                    variant="outline"
                    size="sm"
                  >
                    {attempt.status === 'submitted' ? 'Review' : 'View'}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

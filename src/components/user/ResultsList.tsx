import React from 'react';
import type { TestResult } from '../../types/user';

interface ResultsListProps {
  results: TestResult[];
  onViewDetails: (resultId: string) => void;
  isLoading?: boolean;
}

export const ResultsList: React.FC<ResultsListProps> = ({
  results,
  onViewDetails,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No test results found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Test Results</h2>
      {results.map((result) => (
        <div
          key={result.id}
          className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => onViewDetails(result.id)}
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {result.test.title}
              </h3>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                <span>Score: {result.score}/{result.totalPoints}</span>
                <span>Percentage: {result.percentage.toFixed(1)}%</span>
                <span>Time Spent: {result.timeSpent} minutes</span>
                <span>Submitted: {new Date(result.submittedAt).toLocaleDateString()}</span>
                {result.markedAt && (
                  <span>Marked: {new Date(result.markedAt).toLocaleDateString()}</span>
                )}
              </div>
              {result.feedback && (
                <p className="text-gray-700 text-sm">{result.feedback}</p>
              )}
            </div>
            <div className="ml-4 flex flex-col items-end">
              <span
                className={`inline-flex px-2 py-1 text-xs font-medium rounded-full mb-2 ${
                  result.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : result.status === 'marked'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-green-100 text-green-800'
                }`}
              >
                {result.status.toUpperCase()}
              </span>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">
                  {result.percentage.toFixed(0)}%
                </div>
                <div
                  className={`text-sm font-medium ${
                    result.percentage >= 80
                      ? 'text-green-600'
                      : result.percentage >= 60
                      ? 'text-yellow-600'
                      : 'text-red-600'
                  }`}
                >
                  {result.percentage >= 80
                    ? 'Excellent'
                    : result.percentage >= 60
                    ? 'Good'
                    : 'Needs Improvement'}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

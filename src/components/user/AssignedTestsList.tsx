import React from 'react';
import type { Test } from '../../types/user';
import { Button } from '../common/Button';

interface AssignedTestsListProps {
  tests: Test[];
  onStartTest: (testId: string) => void;
  isLoading?: boolean;
}

export const AssignedTestsList: React.FC<AssignedTestsListProps> = ({
  tests,
  onStartTest,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (tests.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No assigned tests found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Assigned Tests</h2>
      {tests.map((test) => (
        <div
          key={test.id}
          className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {test.title}
              </h3>
              <p className="text-gray-600 mb-3">{test.description}</p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                <span>Questions: {test.questions.length}</span>
                <span>Time Limit: {test.timeLimit} minutes</span>
                <span>Total Points: {test.totalPoints}</span>
                {test.dueDate && (
                  <span>Due: {new Date(test.dueDate).toLocaleDateString()}</span>
                )}
              </div>
            </div>
            <div className="ml-4">
              <span
                className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  test.status === 'assigned'
                    ? 'bg-blue-100 text-blue-800'
                    : test.status === 'in-progress'
                    ? 'bg-yellow-100 text-yellow-800'
                    : test.status === 'completed'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {test.status.replace('-', ' ').toUpperCase()}
              </span>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button
              onClick={() => onStartTest(test.id)}
              disabled={test.status === 'completed' || test.status === 'expired'}
              variant={test.status === 'assigned' ? 'primary' : 'secondary'}
            >
              {test.status === 'assigned'
                ? 'Start Test'
                : test.status === 'in-progress'
                ? 'Continue Test'
                : test.status === 'completed'
                ? 'View Results'
                : 'Expired'}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

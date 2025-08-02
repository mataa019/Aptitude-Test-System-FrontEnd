import React from 'react';
import { AssignedTestsList } from '../components/user/AssignedTestsList';
import { ResultsList } from '../components/user/ResultsList';
import { useUser } from '../hooks/useUser';

interface DashboardProps {
  user: any;
  onStartTest: (testId: string) => void;
  onViewResult: (resultId: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  user, 
  onStartTest, 
  onViewResult 
}) => {
  const {
    assignedTests,
    results,
    loading,
    error
  } = useUser();

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
            Error: {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name || 'Student'}!
          </h1>
          <p className="mt-2 text-gray-600">
            Manage your assigned tests and view your results below.
          </p>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="text-2xl">📝</div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Assigned Tests
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {assignedTests.filter(t => t.status === 'assigned').length}
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
                  <div className="text-2xl">✅</div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Completed Tests
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {assignedTests.filter(t => t.status === 'completed').length}
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
                  <div className="text-2xl">📊</div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Average Score
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {results.length > 0 
                        ? Math.round(results.reduce((sum, r) => sum + r.percentage, 0) / results.length)
                        : 0}%
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Assigned Tests */}
          <div className="bg-white shadow rounded-lg p-6">
            <AssignedTestsList
              tests={assignedTests.filter(t => t.status !== 'completed')}
              onStartTest={onStartTest}
              isLoading={loading}
            />
          </div>

          {/* Recent Results */}
          <div className="bg-white shadow rounded-lg p-6">
            <ResultsList
              results={results.slice(0, 5)} // Show only recent 5 results
              onViewDetails={onViewResult}
              isLoading={loading}
            />
            {results.length > 5 && (
              <div className="mt-4 text-center">
                <button
                  onClick={() => onViewResult('all')}
                  className="text-blue-600 hover:text-blue-500 text-sm font-medium"
                >
                  View all results →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

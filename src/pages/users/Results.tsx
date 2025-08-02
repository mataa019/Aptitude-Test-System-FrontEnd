import React, { useState, useEffect } from 'react';
import { ResultsList } from '../../components/user/ResultsList';
import { getUserAttempts } from '../../api/user';

interface ResultsProps {
  onBack: () => void;
  onViewDetails: (resultId: string) => void;
}

export const Results: React.FC<ResultsProps> = ({ onBack, onViewDetails }) => {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
          <ResultsList
            results={results}
            onViewDetails={onViewDetails}
            isLoading={loading}
          />
        </div>
      </div>
    </div>
  );
};

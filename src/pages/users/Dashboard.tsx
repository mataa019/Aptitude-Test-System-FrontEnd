import React, { useState, useEffect } from 'react';
import { AssignedTestsList } from '../../components/user/AssignedTestsList';
import { SubmittedTestsList } from '../../components/user/SubmittedTestsList';
import { getAvailableTests, getUserSubmittedTests, getUserResults } from '../../api/user';

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
  const [assignedTests, setAssignedTests] = useState<any[]>([]);
  const [submittedTests, setSubmittedTests] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'assigned' | 'submitted' | 'results'>('assigned');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🔍 Dashboard: Fetching data for user:', user);
        console.log('🔍 Current userId from localStorage:', localStorage.getItem('userId'));
        
        // Try to fetch data, but don't fail if endpoints don't exist
        try {
          console.log('🔄 Starting API calls...');
          const [testsResponse, submittedTestsResponse, resultsResponse] = await Promise.all([
            getAvailableTests(),
            getUserSubmittedTests(),
            getUserResults()
          ]);
          
          console.log('📝 Raw tests response:', testsResponse);
          console.log('📊 Raw submitted tests response:', submittedTestsResponse);
          console.log('📊 Raw results response:', resultsResponse);
          
          // Handle the API response structure based on your backend
          const assignedTestsData = testsResponse.data || [];
          const submittedTestsData = submittedTestsResponse.data || submittedTestsResponse || [];
          const resultsData = resultsResponse.data || [];
          
          console.log('📝 Parsed assigned tests:', assignedTestsData);
          console.log('📊 Parsed submitted tests:', submittedTestsData);
          console.log('📊 Parsed results:', resultsData);
          
          setAssignedTests(Array.isArray(assignedTestsData) ? assignedTestsData : []);
          setSubmittedTests(Array.isArray(submittedTestsData) ? submittedTestsData : []);
          setResults(Array.isArray(resultsData) ? resultsData : []);
        } catch (apiError: any) {
          console.warn('⚠️ API endpoints error:', apiError.message);
          // Don't completely fail - show empty dashboard with error info
          setAssignedTests([]);
          setSubmittedTests([]);
        }
      } catch (err: any) {
        console.error('❌ Dashboard data fetch error:', err);
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

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
            Welcome back{user?.name ? `, ${user.name}` : ''}!
          </h1>
          <p className="mt-2 text-gray-600">
            {user?.email ? `Logged in as: ${user.email}` : 'Manage your assigned tests and view your results below.'}
          </p>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
                  <div className="text-2xl">📤</div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Submitted Tests
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {submittedTests.length}
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
                      Results Available
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {results.length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('assigned')}
                className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'assigned'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Assigned Tests
                {assignedTests.filter(t => t.status === 'assigned').length > 0 && (
                  <span className="ml-2 bg-blue-100 text-blue-600 py-0.5 px-2 rounded-full text-xs">
                    {assignedTests.filter(t => t.status === 'assigned').length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('submitted')}
                className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'submitted'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Submitted Tests
                {submittedTests.length > 0 && (
                  <span className="ml-2 bg-green-100 text-green-600 py-0.5 px-2 rounded-full text-xs">
                    {submittedTests.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('results')}
                className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'results'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                My Results
                {results.length > 0 && (
                  <span className="ml-2 bg-purple-100 text-purple-600 py-0.5 px-2 rounded-full text-xs">
                    {results.length}
                  </span>
                )}
              </button>
            </nav>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {/* Show info message if no data */}
          {assignedTests.length === 0 && submittedTests.length === 0 && results.length === 0 && !loading && (
            <div className="col-span-1 bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm">
                    <strong>No Data Available:</strong> You don't have any assigned tests, submitted tests, or results yet. 
                    Tests will appear here once they are assigned to you by an administrator.
                    {user?.email && (
                      <>
                        <br />
                        <small>Logged in as: {user.email}</small>
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Assigned Tests Tab */}
          {activeTab === 'assigned' && (
            <div className="bg-white shadow rounded-lg p-6">
              <AssignedTestsList
                tests={assignedTests.filter(t => t.status !== 'completed')}
                onStartTest={onStartTest}
                isLoading={loading}
              />
            </div>
          )}

          {/* Submitted Tests Tab */}
          {activeTab === 'submitted' && (
            <div className="bg-white shadow rounded-lg p-6">
              <SubmittedTestsList
                submittedTests={submittedTests}
                onViewDetails={onViewResult}
                isLoading={loading}
              />
            </div>
          )}

          {/* Results Tab */}
          {activeTab === 'results' && (
            <div className="bg-white shadow rounded-lg p-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">My Test Results</h3>
                {results.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-gray-400 text-lg mb-2">📊</div>
                    <p className="text-gray-500">No results available yet.</p>
                    <p className="text-sm text-gray-400 mt-1">Complete and submit tests to see your results here.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {results.map((result, index) => (
                      <div 
                        key={result.attemptId || index} 
                        className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {result.testTemplate?.name || 'Test Result'}
                            </h4>
                            <p className="text-sm text-gray-500">
                              Submitted: {result.submittedAt ? new Date(result.submittedAt).toLocaleDateString() : 'N/A'}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              result.approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {result.approved ? 'Approved' : 'Under Review'}
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-sm font-medium text-gray-500">Score</p>
                            <p className="text-lg font-semibold text-gray-900">
                              {result.gradingSummary?.totalScore || result.score || 0}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Percentage</p>
                            <p className="text-lg font-semibold text-gray-900">
                              {result.gradingSummary?.percentage || 0}%
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Questions</p>
                            <p className="text-lg font-semibold text-gray-900">
                              {result.gradingSummary?.totalQuestions || 0}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Correct</p>
                            <p className="text-lg font-semibold text-green-600">
                              {result.gradingSummary?.correctAnswers || 0}
                            </p>
                          </div>
                        </div>

                        {result.hasDetailedReview && (
                          <button
                            onClick={() => onViewResult(result.attemptId)}
                            className="w-full mt-3 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                          >
                            View Detailed Review
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          
        </div>
      </div>
    </div>
  );
};

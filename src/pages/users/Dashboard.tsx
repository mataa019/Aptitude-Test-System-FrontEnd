import React, { useState, useEffect } from 'react';
import { AssignedTestsList } from '../../components/user/AssignedTestsList';
import { SubmittedTestsList } from '../../components/user/SubmittedTestsList';
import { getAvailableTests, getUserSubmittedTests } from '../../api/user';

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
          const [testsResponse, submittedTestsResponse] = await Promise.all([
            getAvailableTests(),
            getUserSubmittedTests()
          ]);
          
          console.log('📝 Raw tests response:', testsResponse);
          console.log('📊 Raw submitted tests response:', submittedTestsResponse);
          
          // Handle the API response structure based on your backend
          const assignedTestsData = testsResponse.data || [];
          const submittedTestsData = submittedTestsResponse.data || submittedTestsResponse || [];
          
          console.log('📝 Parsed assigned tests:', assignedTestsData);
          console.log('📊 Parsed submitted tests:', submittedTestsData);
          
          setAssignedTests(Array.isArray(assignedTestsData) ? assignedTestsData : []);
          setSubmittedTests(Array.isArray(submittedTestsData) ? submittedTestsData : []);
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
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Show info message if no data */}
          {assignedTests.length === 0 && submittedTests.length === 0 && !loading && (
            <div className="col-span-1 lg:col-span-2 bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm">
                    <strong>No Data Available:</strong> You don't have any assigned tests or submitted tests yet. 
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

          {/* Assigned Tests */}
          <div className="bg-white shadow rounded-lg p-6">
            <AssignedTestsList
              tests={assignedTests.filter(t => t.status !== 'completed')}
              onStartTest={onStartTest}
              isLoading={loading}
            />
          </div>

          {/* Recent Submitted Tests */}
          <div className="bg-white shadow rounded-lg p-6">
            <SubmittedTestsList
              submittedTests={submittedTests.slice(0, 5)} // Show only recent 5 submitted tests
              onViewDetails={onViewResult}
              isLoading={loading}
            />
            {submittedTests.length > 5 && (
              <div className="mt-4 text-center">
                <button
                  onClick={() => onViewResult('all')}
                  className="text-blue-600 hover:text-blue-500 text-sm font-medium"
                >
                  View all submitted tests →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

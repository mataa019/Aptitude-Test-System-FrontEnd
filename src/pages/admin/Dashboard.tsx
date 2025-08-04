import React, { useState, useEffect } from 'react';
import { AdminNav } from '../../components/admin/AdminNav';
import { getDashboardStats, getAllUsers } from '../../api/admin';

interface AdminDashboardProps {
  user?: any;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  currentPage, 
  onNavigate 
}) => {
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch dashboard stats and users data in parallel
        const [statsResponse, usersResponse] = await Promise.all([
          getDashboardStats(),
          getAllUsers()
        ]);
        
        console.log('Dashboard API response:', statsResponse);
        console.log('Users API response:', usersResponse);
        
        // Handle the API response structure: { message, data: { totalTemplates, totalAttempts, pendingReviews } }
        const statsData = statsResponse.data || statsResponse;
        
        // Add total users count from users API
        const totalUsers = usersResponse.data ? usersResponse.data.length : 0;
        
        setDashboardStats({
          ...statsData,
          totalUsers
        });
      } catch (err: any) {
        console.error('Dashboard API failed:', err.message);
        setError(err.message || 'Failed to load dashboard statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav currentPage={currentPage} onNavigate={onNavigate} />
      
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="mt-2 text-gray-600">
              Welcome back, Admin! Overview of system activity.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-6">
              Error: {error}
            </div>
          )}

          {/* Dashboard Stats */}
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : dashboardStats ? (
            <>
              {/* Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white overflow-hidden shadow rounded-lg cursor-pointer hover:shadow-md transition-shadow"
                     onClick={() => onNavigate('templates')}>
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="text-2xl">📝</div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            Test Templates
                          </dt>
                          <dd className="text-lg font-medium text-gray-900">
                            {dashboardStats?.totalTemplates || 0}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg cursor-pointer hover:shadow-md transition-shadow"
                     onClick={() => onNavigate('attempts')}>
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="text-2xl">📋</div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            Total Attempts
                          </dt>
                          <dd className="text-lg font-medium text-gray-900">
                            {dashboardStats?.totalAttempts || 0}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg cursor-pointer hover:shadow-md transition-shadow"
                     onClick={() => onNavigate('attempts')}>
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="text-2xl">⏳</div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            Pending Reviews
                          </dt>
                          <dd className="text-lg font-medium text-gray-900">
                            {dashboardStats?.pendingReviews || 0}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg cursor-pointer hover:shadow-md transition-shadow"
                     onClick={() => onNavigate('users')}>
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="text-2xl">👥</div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            Total Users
                          </dt>
                          <dd className="text-lg font-medium text-gray-900">
                            {dashboardStats?.totalUsers || 0}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div className="bg-white shadow rounded-lg p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
                  <div className="space-y-3">
                    <button
                      onClick={() => onNavigate('templates')}
                      className="w-full flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <span className="mr-3">📝</span>
                      Create New Test Template
                    </button>
                    <button
                      onClick={() => onNavigate('questions')}
                      className="w-full flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <span className="mr-3">❓</span>
                      Create New Question
                    </button>
                    <button
                      onClick={() => onNavigate('attempts')}
                      className="w-full flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <span className="mr-3">📋</span>
                      Review Pending Attempts
                    </button>
                    <button
                      onClick={() => onNavigate('users')}
                      className="w-full flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <span className="mr-3">�</span>
                      Manage Users
                    </button>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white shadow rounded-lg p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
                  <div className="flow-root">
                    {dashboardStats?.recentActivity && dashboardStats.recentActivity.length > 0 ? (
                      <ul className="-mb-8">
                        {dashboardStats.recentActivity.map((activity: any, index: number) => (
                          <li key={activity.id}>
                            <div className="relative pb-8">
                              {index !== (dashboardStats?.recentActivity?.length || 0) - 1 && (
                                <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" />
                              )}
                              <div className="relative flex space-x-3">
                                <div>
                                  <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                                    <span className="text-white text-sm">📋</span>
                                  </span>
                                </div>
                                <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                  <div>
                                    <p className="text-sm text-gray-500">
                                      {activity.description}
                                    </p>
                                  </div>
                                  <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                    {new Date(activity.timestamp).toLocaleDateString()}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500">No recent activity found.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No data available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

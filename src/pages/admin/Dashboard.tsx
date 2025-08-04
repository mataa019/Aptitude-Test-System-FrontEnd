import React, { useState, useEffect } from 'react';
import { AdminNav } from '../../components/admin/AdminNav';
import { 
  getDashboardStats, 
  getAllUsers, 
  getAllTestTemplates,
  getTestTemplateById,
  deleteQuestion
} from '../../api/admin';

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
  const [recentQuestions, setRecentQuestions] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch dashboard stats, users data, and templates in parallel
        const [statsResponse, usersResponse, templatesResponse] = await Promise.all([
          getDashboardStats(),
          getAllUsers(),
          getAllTestTemplates()
        ]);
        
        console.log('Dashboard API response:', statsResponse);
        console.log('Users API response:', usersResponse);
        console.log('Templates API response:', templatesResponse);
        
        // Handle the API response structure: { message, data: { totalTemplates, totalAttempts, pendingReviews } }
        const statsData = statsResponse.data || statsResponse;
        
        // Add total users count from users API
        const totalUsers = usersResponse.data ? usersResponse.data.length : 0;
        
        setDashboardStats({
          ...statsData,
          totalUsers
        });

        // Set templates
        setTemplates(templatesResponse.data || []);

        // Fetch recent questions from the first few templates
        const recentTemplates = (templatesResponse.data || []).slice(0, 3);
        const questionsPromises = recentTemplates.map(async (template: any) => {
          try {
            const templateDetails = await getTestTemplateById(template.id);
            return (templateDetails.data?.questions || []).map((question: any) => ({
              ...question,
              templateName: template.name
            }));
          } catch (err) {
            return [];
          }
        });

        const questionsArrays = await Promise.all(questionsPromises);
        const allQuestions = questionsArrays.flat();
        setRecentQuestions(allQuestions.slice(0, 5)); // Show only 5 recent questions

      } catch (err: any) {
        console.error('Dashboard API failed:', err.message);
        setError(err.message || 'Failed to load dashboard statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleEditQuestion = (question: any) => {
    // Navigate to questions page with the specific template selected and question ID
    // We'll store the question ID in sessionStorage so the Questions page can pick it up
    sessionStorage.setItem('editQuestionId', question.id);
    sessionStorage.setItem('selectedTemplateId', question.testTemplateId);
    onNavigate('questions');
  };

  const handleDeleteQuestionFromDashboard = async (questionId: string) => {
    if (!confirm('Are you sure you want to delete this question? This action cannot be undone.')) {
      return;
    }
    
    try {
      setLoading(true);
      await deleteQuestion(questionId);
      
      // Refresh dashboard data to update the questions list
      window.location.reload(); // Simple approach to refresh all data
    } catch (err: any) {
      setError(err.message || 'Failed to delete question');
    } finally {
      setLoading(false);
    }
  };

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

              {/* Recent Questions */}
              <div className="bg-white shadow rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium text-gray-900">Recent Questions</h2>
                  <button
                    onClick={() => onNavigate('questions')}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    View All
                  </button>
                </div>
                
                {recentQuestions.length > 0 ? (
                  <div className="space-y-3">
                    {recentQuestions.map((question, index) => (
                      <div key={question.id} className="border border-gray-200 rounded-lg p-3">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-xs font-medium text-gray-500">Q{index + 1}</span>
                              <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${
                                question.type === 'multiple-choice' 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : 'bg-green-100 text-green-800'
                              }`}>
                                {question.type === 'multiple-choice' ? 'MC' : 'SA'}
                              </span>
                              <span className="text-xs text-gray-500">{question.marks} pts</span>
                              <span className="text-xs text-gray-400">from {question.templateName}</span>
                            </div>
                            <p className="text-sm text-gray-900 mb-1">{question.text}</p>
                            {question.type === 'multiple-choice' && question.options && (
                              <div className="text-xs text-gray-600">
                                Options: {question.options.length} | Answer: {question.answer?.[0] || 'Not set'}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex space-x-1 ml-2">
                            <button
                              onClick={() => handleEditQuestion(question)}
                              className="text-xs text-blue-600 hover:text-blue-800 px-2 py-1 rounded"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteQuestionFromDashboard(question.id)}
                              className="text-xs text-red-600 hover:text-red-800 px-2 py-1 rounded"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-500 text-sm">No questions found. Create your first question to get started.</p>
                  </div>
                )}
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

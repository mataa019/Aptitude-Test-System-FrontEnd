import React, { useState, useEffect } from 'react';
import { AdminNav } from '../../components/admin/AdminNav';
import { AttemptsList } from '../../components/admin/AttemptsList';
import { getAllTestTemplates, getPendingReviewAttempts, getAllAttempts } from '../../api/admin';

interface AttemptsProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onReviewAttempt: (attemptId: string) => void;
  initialTab?: 'pending' | 'by-template' | 'all';
}

interface TestTemplate {
  id: string;
  name: string;
  category: string;
  department: string;
  timeLimit: number;
}

export const Attempts: React.FC<AttemptsProps> = ({ 
  currentPage, 
  onNavigate, 
  onReviewAttempt,
  initialTab = 'pending'
}) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [templates, setTemplates] = useState<TestTemplate[]>([]);
  const [pendingAttempts, setPendingAttempts] = useState<any[]>([]);
  const [allAttempts, setAllAttempts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [pendingLoading, setPendingLoading] = useState(false);
  const [allAttemptsLoading, setAllAttemptsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'pending' | 'by-template' | 'all'>(initialTab);
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('');

  const fetchPendingAttempts = async () => {
    try {
      setPendingLoading(true);
      const response = await getPendingReviewAttempts();
      setPendingAttempts(response.data || []);
    } catch (err: any) {
      console.error('Failed to load pending attempts:', err);
      // Don't set error state for pending attempts, just log it
    } finally {
      setPendingLoading(false);
    }
  };

  const fetchAllAttempts = async () => {
    try {
      setAllAttemptsLoading(true);
      const response = await getAllAttempts();
      setAllAttempts(response.data || []);
    } catch (err: any) {
      console.error('Failed to load all attempts:', err);
      // Don't set error state for all attempts, just log it
    } finally {
      setAllAttemptsLoading(false);
    }
  };

  // Expose refresh function for when returning from review
  React.useEffect(() => {
    if (activeTab === 'pending') {
      fetchPendingAttempts();
    } else if (activeTab === 'all') {
      fetchAllAttempts();
    }
  }, [activeTab]);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true);
        const response = await getAllTestTemplates();
        setTemplates(response.data || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load test templates');
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
    fetchPendingAttempts();
    
    // Fetch all attempts if initially showing the all tab
    if (initialTab === 'all') {
      fetchAllAttempts();
    }
  }, [initialTab]);

  const handleLoadAttempts = () => {
    if (selectedTemplateId) {
      console.log('Loading attempts for template:', selectedTemplateId);
      console.log('Filters applied:', { status: statusFilter, date: dateFilter });
      // The attempts will be loaded by the AttemptsList component
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav currentPage={currentPage} onNavigate={onNavigate} />
      
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Test Attempts</h1>
            <p className="mt-2 text-gray-600">
              Review and manage all test attempts submitted by students.
            </p>
          </div>

          {/* Tabs */}
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                <button
                  onClick={() => setActiveTab('pending')}
                  className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'pending'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Pending Review
                  {pendingAttempts.length > 0 && (
                    <span className="ml-2 bg-red-100 text-red-600 py-0.5 px-2 rounded-full text-xs">
                      {pendingAttempts.length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('all')}
                  className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'all'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  All Attempts
                  {allAttempts.length > 0 && (
                    <span className="ml-2 bg-blue-100 text-blue-600 py-0.5 px-2 rounded-full text-xs">
                      {allAttempts.length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('by-template')}
                  className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'by-template'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Browse by Template
                </button>
              </nav>
            </div>
          </div>

          {/* Pending Review Tab */}
          {activeTab === 'pending' && (
            <div className="space-y-6">
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Submitted Attempts Awaiting Review
                </h2>
                <p className="text-gray-600 mb-6">
                  All test attempts that have been submitted and are waiting for your review and scoring.
                </p>

                {pendingLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : pendingAttempts.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-gray-400 text-6xl mb-4">📝</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Pending Reviews</h3>
                    <p className="text-gray-600">0 attempts pending review</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingAttempts.map((attempt) => (
                      <div
                        key={attempt.id}
                        className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-4 mb-2">
                              <h3 className="text-lg font-medium text-gray-900">
                                {attempt.assignment.testTemplate.name}
                              </h3>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                {attempt.status}
                              </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                              <div>
                                <span className="font-medium">Student:</span> {attempt.user.name} ({attempt.user.email})
                              </div>
                              <div>
                                <span className="font-medium">Category:</span> {attempt.assignment.testTemplate.category}
                              </div>
                              <div>
                                <span className="font-medium">Submitted:</span> {new Date(attempt.startedAt).toLocaleString()}
                              </div>
                            </div>
                            <div className="mt-2 text-sm text-gray-600">
                              <span className="font-medium">Time Limit:</span> {attempt.assignment.testTemplate.timeLimit} minutes
                              <span className="mx-2">•</span>
                              <span className="font-medium">Questions:</span> {attempt.assignment.testTemplate.questions.length}
                            </div>
                          </div>
                          <button
                            onClick={() => onReviewAttempt(attempt.id)}
                            className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
                          >
                            Review
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* All Attempts Tab */}
          {activeTab === 'all' && (
            <div className="space-y-6">
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  All Test Attempts
                </h2>
                <p className="text-gray-600 mb-6">
                  Complete list of all test attempts submitted by students across all templates.
                </p>

                {allAttemptsLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : allAttempts.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-gray-400 text-6xl mb-4">📋</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Attempts Found</h3>
                    <p className="text-gray-600">No test attempts have been submitted yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {allAttempts.map((attempt) => (
                      <div
                        key={attempt.id}
                        className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-4 mb-2">
                              <h3 className="text-lg font-medium text-gray-900">
                                {attempt.assignment?.testTemplate?.name || attempt.testTemplate?.name || 'N/A'}
                              </h3>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                attempt.status === 'submitted' ? 'bg-yellow-100 text-yellow-800' :
                                attempt.status === 'under-review' ? 'bg-blue-100 text-blue-800' :
                                attempt.status === 'marked' ? 'bg-green-100 text-green-800' :
                                attempt.status === 'approved' ? 'bg-green-100 text-green-800' :
                                attempt.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {attempt.status}
                              </span>
                              {attempt.score !== null && attempt.score !== undefined && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                  Score: {attempt.score}%
                                </span>
                              )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
                              <div>
                                <span className="font-medium">Student:</span> {attempt.user?.name || 'N/A'} ({attempt.user?.email || 'N/A'})
                              </div>
                              <div>
                                <span className="font-medium">Category:</span> {attempt.assignment?.testTemplate?.category || attempt.testTemplate?.category || 'N/A'}
                              </div>
                              <div>
                                <span className="font-medium">Submitted:</span> {attempt.startedAt ? new Date(attempt.startedAt).toLocaleString() : 'N/A'}
                              </div>
                              <div>
                                <span className="font-medium">Duration:</span> {attempt.assignment?.testTemplate?.timeLimit || attempt.testTemplate?.timeLimit || 'N/A'} min
                              </div>
                            </div>
                            {attempt.feedback && (
                              <div className="mt-2 text-sm text-gray-600">
                                <span className="font-medium">Feedback:</span> {attempt.feedback}
                              </div>
                            )}
                          </div>
                          <div className="ml-4 flex space-x-2">
                            {(attempt.status === 'submitted' || attempt.status === 'under-review') && (
                              <button
                                onClick={() => onReviewAttempt(attempt.id)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
                              >
                                Review
                              </button>
                            )}
                            {(attempt.status === 'marked' || attempt.status === 'approved') && (
                              <button
                                onClick={() => onReviewAttempt(attempt.id)}
                                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm font-medium"
                              >
                                View Details
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Browse by Template Tab */}
          {activeTab === 'by-template' && (
            <div className="space-y-6">
              {/* Template Selection */}
              <div className="bg-white shadow rounded-lg p-6 mb-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Select Test Template</h2>
                
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4">
                    Error loading templates: {error}
                  </div>
                )}
                
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Test Template
                    </label>
                    <select
                      value={selectedTemplateId}
                      onChange={(e) => setSelectedTemplateId(e.target.value)}
                      disabled={loading}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select a test template...</option>
                      {templates.map((template) => (
                        <option key={template.id} value={template.id}>
                          {template.name} ({template.category}) - {template.timeLimit} min
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex flex-col">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      &nbsp;
                    </label>
                    <button 
                      onClick={handleLoadAttempts}
                      disabled={!selectedTemplateId || loading}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Loading...' : 'Load Attempts'}
                    </button>
                  </div>
                </div>
                
                {selectedTemplateId && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-md">
                    <p className="text-sm text-blue-800">
                      Selected template: <strong>{templates.find(t => t.id === selectedTemplateId)?.name}</strong>
                    </p>
                  </div>
                )}
              </div>

              {/* Filter Options */}
              <div className="bg-white shadow rounded-lg p-6 mb-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Filter Options</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select 
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">All Statuses</option>
                      <option value="submitted">Submitted</option>
                      <option value="under-review">Under Review</option>
                      <option value="marked">Marked</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date Range
                    </label>
                    <select 
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">All Time</option>
                      <option value="today">Today</option>
                      <option value="week">This Week</option>
                      <option value="month">This Month</option>
                      <option value="quarter">This Quarter</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Template Name
                    </label>
                    <input
                      type="text"
                      placeholder="Search by template name..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="flex items-end">
                    <button 
                      onClick={() => {
                        console.log('Applying filters:', { status: statusFilter, date: dateFilter });
                        handleLoadAttempts();
                      }}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Apply Filters
                    </button>
                  </div>
                </div>
                
                {(statusFilter || dateFilter) && (
                  <div className="mt-4 flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Active filters:</span>
                    {statusFilter && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Status: {statusFilter}
                        <button
                          onClick={() => setStatusFilter('')}
                          className="ml-1 text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </span>
                    )}
                    {dateFilter && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Date: {dateFilter}
                        <button
                          onClick={() => setDateFilter('')}
                          className="ml-1 text-green-600 hover:text-green-800"
                        >
                          ×
                        </button>
                      </span>
                    )}
                    <button
                      onClick={() => {
                        setStatusFilter('');
                        setDateFilter('');
                      }}
                      className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      Clear all
                    </button>
                  </div>
                )}
              </div>

              {/* Attempts List */}
              {selectedTemplateId && (
                <div className="bg-white shadow rounded-lg">
                  <AttemptsList
                    testTemplateId={selectedTemplateId}
                    onReviewAttempt={onReviewAttempt}
                  />
                </div>
              )}

              {!selectedTemplateId && (
                <div className="bg-white shadow rounded-lg p-6">
                  <div className="text-center py-8">
                    <p className="text-gray-500">Please select a test template to view attempts.</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

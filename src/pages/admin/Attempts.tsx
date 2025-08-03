import React, { useState, useEffect } from 'react';
import { AdminNav } from '../../components/admin/AdminNav';
import { AttemptsList } from '../../components/admin/AttemptsList';
import { getAllTestTemplates } from '../../api/admin';

interface AttemptsProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onReviewAttempt: (attemptId: string) => void;
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
  onReviewAttempt 
}) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [templates, setTemplates] = useState<TestTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('');

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
  }, []);

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
      </div>
    </div>
  );
};

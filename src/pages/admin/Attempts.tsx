import React from 'react';
import { AdminNav } from '../../components/admin/AdminNav';
import { AttemptsList } from '../../components/admin/AttemptsList';
import { useAdmin } from '../../hooks/useAdmin';

interface AttemptsProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onReviewAttempt: (attemptId: string) => void;
}

export const Attempts: React.FC<AttemptsProps> = ({ 
  currentPage, 
  onNavigate, 
  onReviewAttempt 
}) => {
  const { attempts, loading, error } = useAdmin();

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

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-6">
              Error: {error}
            </div>
          )}

          {/* Filter Options */}
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Filter Options</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="">All Statuses</option>
                  <option value="submitted">Submitted</option>
                  <option value="under-review">Under Review</option>
                  <option value="marked">Marked</option>
                  <option value="approved">Approved</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date Range
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Test Template
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="">All Templates</option>
                  {/* Template options would be populated here */}
                </select>
              </div>
              <div className="flex items-end">
                <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                  Apply Filters
                </button>
              </div>
            </div>
          </div>

          {/* Attempts List */}
          <div className="bg-white shadow rounded-lg">
            <AttemptsList
              attempts={attempts}
              onReviewAttempt={onReviewAttempt}
              isLoading={loading}
            />
          </div>

          {/* Summary Statistics */}
          {attempts.length > 0 && (
            <div className="mt-6 bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Summary Statistics</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {attempts.length}
                  </div>
                  <div className="text-sm text-gray-500">Total Attempts</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {attempts.filter(a => a.status === 'submitted').length}
                  </div>
                  <div className="text-sm text-gray-500">Pending Review</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {attempts.filter(a => a.status === 'marked').length}
                  </div>
                  <div className="text-sm text-gray-500">Marked</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {attempts.filter(a => a.status === 'approved').length}
                  </div>
                  <div className="text-sm text-gray-500">Approved</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

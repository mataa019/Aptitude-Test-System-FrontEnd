import React, { useState } from 'react';
import { AdminNav } from '../../components/admin/AdminNav';
import { AttemptsList } from '../../components/admin/AttemptsList';

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
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');

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
            <div className="flex items-center space-x-4">
              <input
                type="text"
                placeholder="Enter Test Template ID"
                value={selectedTemplateId}
                onChange={(e) => setSelectedTemplateId(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button 
                onClick={() => setSelectedTemplateId(selectedTemplateId)}
                disabled={!selectedTemplateId}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
              >
                Load Attempts
              </button>
            </div>
          </div>



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

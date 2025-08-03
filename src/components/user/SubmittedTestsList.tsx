import React from 'react';

interface SubmittedTest {
  id: string;
  testTemplate: {
    id: string;
    name: string;
    category: string;
    timeLimit: number;
  };
  submittedAt: string | null;
  startedAt: string;
  status: string;
  score: number | null;
  approved: boolean | null;
  assignment: {
    assignedAt: string;
    assignedBy: string;
  };
}

interface SubmittedTestsListProps {
  submittedTests: SubmittedTest[];
  onViewDetails: (testId: string) => void;
  isLoading?: boolean;
}

export const SubmittedTestsList: React.FC<SubmittedTestsListProps> = ({
  submittedTests,
  onViewDetails,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (submittedTests.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 mb-2">
          <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p className="text-gray-500">No submitted tests found.</p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'submitted':
        return 'bg-blue-100 text-blue-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Submitted Tests History</h2>
      
      {submittedTests.map((test) => (
        <div
          key={test.id}
          className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => onViewDetails(test.testTemplate.id)}
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {test.testTemplate.name}
              </h3>
              
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                <span className="flex items-center">
                  <span className="text-gray-400 mr-1">📁</span>
                  {test.testTemplate.category}
                </span>
                <span className="flex items-center">
                  <span className="text-gray-400 mr-1">⏱️</span>
                  {test.testTemplate.timeLimit} min
                </span>
                <span className="flex items-center">
                  <span className="text-gray-400 mr-1">📅</span>
                  Started: {formatDate(test.startedAt)}
                </span>
                {test.submittedAt && (
                  <span className="flex items-center">
                    <span className="text-gray-400 mr-1">✅</span>
                    Submitted: {formatDate(test.submittedAt)}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <span className="flex items-center">
                  <span className="text-gray-400 mr-1">👤</span>
                  Assigned: {formatDate(test.assignment.assignedAt)}
                </span>
                {test.score !== null && (
                  <span className="flex items-center">
                    <span className="text-gray-400 mr-1">📊</span>
                    Score: {test.score}
                  </span>
                )}
              </div>
            </div>

            <div className="ml-4 flex flex-col items-end">
              <span
                className={`inline-flex px-3 py-1 text-xs font-medium rounded-full mb-3 ${getStatusColor(test.status)}`}
              >
                {test.status.toUpperCase()}
              </span>
              
              {test.approved !== null && (
                <div className="text-right">
                  <div className={`text-sm font-medium ${
                    test.approved ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {test.approved ? '✅ Approved' : '❌ Not Approved'}
                  </div>
                </div>
              )}
              
              <div className="text-xs text-gray-400 mt-2">
                Click to view details
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { AdminNav } from '../../components/admin/AdminNav';
import { 
  getAllTestTemplates, 
  getAllUsers,
  assignTemplateToUser,
  getUserAssignedTests
} from '../../api/admin';

interface AssignmentsProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

interface TestTemplate {
  id: string;
  name: string;
  category: string;
  department: string;
  timeLimit: number;
  createdAt: string;
}

interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: string;
  department: string;
}

interface Assignment {
  id: string;
  userId: string;
  testTemplateId: string;
  assignedBy: string;
  assignedAt: string;
  dueDate?: string;
  status: string;
  user?: User;
  testTemplate?: TestTemplate;
}

export const Assignments: React.FC<AssignmentsProps> = ({ 
  currentPage, 
  onNavigate 
}) => {
  const [templates, setTemplates] = useState<TestTemplate[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showAssignForm, setShowAssignForm] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    userId: '',
    testTemplateId: '',
    dueDate: ''
  });

  const [selectedUser, setSelectedUser] = useState<string>('');

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      fetchUserAssignments(selectedUser);
    }
  }, [selectedUser]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [templatesResponse, usersResponse] = await Promise.all([
        getAllTestTemplates(),
        getAllUsers()
      ]);
      
      setTemplates(templatesResponse.data || []);
      setUsers(usersResponse.data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserAssignments = async (userId: string) => {
    try {
      setLoading(true);
      const response = await getUserAssignedTests(userId);
      setAssignments(response.data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load user assignments');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      const assignmentData = {
        userId: formData.userId,
        testTemplateId: formData.testTemplateId,
        assignedBy: localStorage.getItem('userId') || 'admin',
        ...(formData.dueDate && { dueDate: formData.dueDate })
      };

      await assignTemplateToUser(assignmentData);
      
      setSuccess('Template assigned successfully!');
      
      // Reset form
      setFormData({
        userId: '',
        testTemplateId: '',
        dueDate: ''
      });
      setShowAssignForm(false);
      
      // Refresh assignments if user is selected
      if (selectedUser) {
        await fetchUserAssignments(selectedUser);
      }
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to assign template');
    } finally {
      setLoading(false);
    }
  };

  const startAssign = () => {
    setFormData({
      userId: selectedUser || '',
      testTemplateId: '',
      dueDate: ''
    });
    setShowAssignForm(true);
    setError(null);
    setSuccess(null);
  };

  const getSelectedUserName = () => {
    const user = users.find(u => u.id === selectedUser);
    return user ? `${user.fullName} (${user.username})` : '';
  };

  const getTemplateName = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    return template ? template.name : 'Unknown Template';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav currentPage={currentPage} onNavigate={onNavigate} />
      
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Template Assignments</h1>
              <p className="mt-2 text-gray-600">
                Assign test templates to users and manage their assignments.
              </p>
            </div>
            <button
              onClick={startAssign}
              disabled={!selectedUser}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
            >
              Assign Template
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded mb-6">
              {success}
            </div>
          )}

          {/* User Selection */}
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Select User</h2>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a user...</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.fullName} ({user.username}) - {user.department}
                </option>
              ))}
            </select>
          </div>

          {/* Assignment Form */}
          {showAssignForm && (
            <div className="bg-white shadow rounded-lg p-6 mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Assign Template to {getSelectedUserName()}
              </h2>
              
              <form onSubmit={handleAssignTemplate}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      User
                    </label>
                    <select
                      value={formData.userId}
                      onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select a user...</option>
                      {users.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.fullName} ({user.username}) - {user.department}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Test Template
                    </label>
                    <select
                      value={formData.testTemplateId}
                      onChange={(e) => setFormData({ ...formData, testTemplateId: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select a template...</option>
                      {templates.map((template) => (
                        <option key={template.id} value={template.id}>
                          {template.name} ({template.category}) - {template.timeLimit} min
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Due Date (Optional)
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.dueDate}
                      onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAssignForm(false);
                      setFormData({
                        userId: '',
                        testTemplateId: '',
                        dueDate: ''
                      });
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                  >
                    {loading ? 'Assigning...' : 'Assign Template'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* User Assignments */}
          {selectedUser && (
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">
                  Assignments for {getSelectedUserName()}
                </h2>
              </div>
              
              {loading && assignments.length === 0 ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : assignments.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No assignments found for this user. Assign a template to get started.</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {assignments.map((assignment) => (
                    <div key={assignment.id} className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            {getTemplateName(assignment.testTemplateId)}
                          </h3>
                          <div className="space-y-1 text-sm text-gray-600">
                            <p>
                              <span className="font-medium">Assigned:</span> {' '}
                              {new Date(assignment.assignedAt).toLocaleDateString()}
                            </p>
                            {assignment.dueDate && (
                              <p>
                                <span className="font-medium">Due:</span> {' '}
                                {new Date(assignment.dueDate).toLocaleDateString()}
                              </p>
                            )}
                            <p>
                              <span className="font-medium">Status:</span> {' '}
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                assignment.status === 'completed' 
                                  ? 'bg-green-100 text-green-800'
                                  : assignment.status === 'in-progress'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {assignment.status}
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Quick Assign Section */}
          <div className="mt-8 bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Assignment</h2>
            <p className="text-gray-600 mb-4">
              Quickly assign a template to multiple users by department or role.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Template
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="">Select template...</option>
                  {templates.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="">All departments...</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Sales">Sales</option>
                  <option value="HR">HR</option>
                </select>
              </div>
              
              <div className="flex items-end">
                <button className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                  Bulk Assign
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

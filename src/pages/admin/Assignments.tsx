import React, { useState, useEffect } from 'react';
import { AdminNav } from '../../components/admin/AdminNav';
import { 
  getAllTestTemplates, 
  getAllUsers,
  assignTemplateToUser,
  reassignTemplateToUser,
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
  name: string;
  email: string;
  role: string;
  department: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: {
    assignments: number;
    attempts: number;
  };
}

interface Assignment {
  id: string;
  userId: string;
  testTemplateId: string;
  assignedBy: string;
  assignedAt: string;
  status: string;
  dueDate?: string;
  testTemplate?: {
    id: string;
    name: string;
    category: string;
    timeLimit: number;
    department: string;
  };
  user?: {
    id: string;
    name: string;
    email: string;
  };
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
  const [showReassignForm, setShowReassignForm] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    userId: '',
    testTemplateId: '',
    dueDate: ''
  });

  // Reassignment form state
  const [reassignData, setReassignData] = useState({
    userId: '',
    testTemplateId: '',
    reason: '',
    dueDate: ''
  });

  // Quick assignment state
  const [quickAssignData, setQuickAssignData] = useState({
    testTemplateId: '',
    department: '',
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
      
      console.log('Users API response:', usersResponse);
      console.log('Templates API response:', templatesResponse);
      
      setTemplates(templatesResponse.data || []);
      setUsers(usersResponse.data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserAssignments = async (userId: string) => {
    try {
      setLoading(true);
      const response = await getUserAssignedTests(userId);
      setAssignments(response.data || []);
      setError(null); // Clear any previous errors
    } catch (err: any) {
      console.error('Error fetching assignments:', err);
      setError(err.message || 'Failed to load user assignments');
      setAssignments([]); // Clear assignments on error
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

  const handleReassignTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      const reassignmentData = {
        userId: reassignData.userId,
        testTemplateId: reassignData.testTemplateId,
        assignedBy: localStorage.getItem('userId') || 'admin',
        reason: reassignData.reason,
        ...(reassignData.dueDate && { dueDate: reassignData.dueDate })
      };

      await reassignTemplateToUser(reassignmentData);
      
      setSuccess('Template reassigned successfully with updated questions!');
      
      // Reset form
      setReassignData({
        userId: '',
        testTemplateId: '',
        reason: '',
        dueDate: ''
      });
      setShowReassignForm(false);
      
      // Refresh assignments if user is selected
      if (selectedUser) {
        await fetchUserAssignments(selectedUser);
      }
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to reassign template');
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

  const startReassign = () => {
    setReassignData({
      userId: selectedUser || '',
      testTemplateId: '',
      reason: '',
      dueDate: ''
    });
    setShowReassignForm(true);
    setError(null);
    setSuccess(null);
  };

  const handleQuickAssign = async () => {
    if (!quickAssignData.testTemplateId || !quickAssignData.department) {
      setError('Please select both template and department');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Get users in the selected department
      const usersInDepartment = users.filter(user => 
        quickAssignData.department === '' || user.department === quickAssignData.department
      );

      if (usersInDepartment.length === 0) {
        setError('No users found in the selected department');
        return;
      }

      // Assign template to all users in department
      const assignmentPromises = usersInDepartment.map(user =>
        assignTemplateToUser({
          userId: user.id,
          testTemplateId: quickAssignData.testTemplateId,
          assignedBy: 'current-admin-id', // Replace with actual admin ID
          ...(quickAssignData.dueDate && { dueDate: quickAssignData.dueDate })
        })
      );

      await Promise.all(assignmentPromises);
      
      setSuccess(`Template assigned successfully to ${usersInDepartment.length} users!`);
      
      // Reset form
      setQuickAssignData({
        testTemplateId: '',
        department: '',
        dueDate: ''
      });
      
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

  const getSelectedUserName = () => {
    const user = users.find(u => u.id === selectedUser);
    return user ? `${user.name} (${user.email})` : '';
  };

  const getTemplateName = (assignment: Assignment) => {
    // Use populated testTemplate data if available, otherwise fallback to templates array
    if (assignment.testTemplate) {
      return assignment.testTemplate.name;
    }
    const template = templates.find(t => t.id === assignment.testTemplateId);
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
            <div className="flex gap-2">
              <button
                onClick={startAssign}
                disabled={!selectedUser}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
              >
                Assign Template
              </button>
              <button
                onClick={startReassign}
                disabled={!selectedUser}
                className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:bg-gray-400"
              >
                Reassign Template
              </button>
            </div>
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
            {users.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-gray-500">Loading users...</p>
              </div>
            ) : (
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a user...</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.email}) - {user.department || 'No Department'}
                  </option>
                ))}
              </select>
            )}
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
                          {user.name} ({user.email}) - {user.department || 'No Department'}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Test Template
                    </label>
                    {templates.length === 0 ? (
                      <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500">
                        No templates available. Please create a template first.
                      </div>
                    ) : (
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
                    )}
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
                    disabled={loading || templates.length === 0}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                  >
                    {loading ? 'Assigning...' : templates.length === 0 ? 'No Templates Available' : 'Assign Template'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Reassignment Form */}
          {showReassignForm && (
            <div className="bg-white shadow rounded-lg p-6 mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Reassign Template to {getSelectedUserName()}
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Use this to reassign a template when you've added new questions or made updates.
              </p>
              
              <form onSubmit={handleReassignTemplate}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      User
                    </label>
                    <select
                      value={reassignData.userId}
                      onChange={(e) => setReassignData({ ...reassignData, userId: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="">Select a user...</option>
                      {users.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.name} ({user.email}) - {user.department || 'No Department'}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Test Template
                    </label>
                    {templates.length === 0 ? (
                      <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500">
                        No templates available. Please create a template first.
                      </div>
                    ) : (
                      <select
                        value={reassignData.testTemplateId}
                        onChange={(e) => setReassignData({ ...reassignData, testTemplateId: e.target.value })}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      >
                        <option value="">Select a template...</option>
                        {templates.map((template) => (
                          <option key={template.id} value={template.id}>
                            {template.name} ({template.category}) - {template.timeLimit} min
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reason for Reassignment
                    </label>
                    <textarea
                      value={reassignData.reason}
                      onChange={(e) => setReassignData({ ...reassignData, reason: e.target.value })}
                      required
                      placeholder="e.g., Added 5 new questions to Digital Innovations test"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Due Date (Optional)
                    </label>
                    <input
                      type="datetime-local"
                      value={reassignData.dueDate}
                      onChange={(e) => setReassignData({ ...reassignData, dueDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowReassignForm(false);
                      setReassignData({
                        userId: '',
                        testTemplateId: '',
                        reason: '',
                        dueDate: ''
                      });
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading || templates.length === 0}
                    className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:bg-gray-400"
                  >
                    {loading ? 'Reassigning...' : templates.length === 0 ? 'No Templates Available' : 'Reassign Template'}
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
                  <div className="text-gray-500 space-y-2">
                    <p>📋 No assignments found for this user.</p>
                    <p className="text-sm">Assign a template to get started!</p>
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {assignments.map((assignment) => (
                    <div key={assignment.id} className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            {getTemplateName(assignment)}
                          </h3>
                          <div className="space-y-1 text-sm text-gray-600">
                            {assignment.testTemplate && (
                              <p>
                                <span className="font-medium">Category:</span> {assignment.testTemplate.category} | 
                                <span className="font-medium"> Department:</span> {assignment.testTemplate.department} | 
                                <span className="font-medium"> Time Limit:</span> {assignment.testTemplate.timeLimit} min
                              </p>
                            )}
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
                              <span className="font-medium">Assigned By:</span> {assignment.assignedBy}
                            </p>
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
                <select 
                  value={quickAssignData.testTemplateId}
                  onChange={(e) => setQuickAssignData({ ...quickAssignData, testTemplateId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
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
                <select 
                  value={quickAssignData.department}
                  onChange={(e) => setQuickAssignData({ ...quickAssignData, department: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All departments...</option>
                  {[...new Set(users.map(user => user.department).filter(Boolean))].map((dept) => (
                    <option key={dept} value={dept!}>
                      {dept}
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
                  value={quickAssignData.dueDate}
                  onChange={(e) => setQuickAssignData({ ...quickAssignData, dueDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="flex items-end">
                <button 
                  onClick={handleQuickAssign}
                  disabled={loading || !quickAssignData.testTemplateId}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Assigning...' : 'Bulk Assign'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

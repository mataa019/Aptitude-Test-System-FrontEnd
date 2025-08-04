import React, { useState, useEffect } from 'react';
import { AdminNav } from '../../components/admin/AdminNav';
import { 
  getAllTestTemplates, 
  createTestTemplate, 
  updateTestTemplate, 
  deleteTestTemplate,
  getTestTemplateById,
  deleteQuestion
} from '../../api/admin';

interface TemplatesProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

interface TestTemplate {
  id: string;
  name: string;
  category: string;
  department: string;
  timeLimit: number;
  createdBy: string;
  createdAt: string;
  questionCount?: number;
}

interface DetailedTestTemplate extends TestTemplate {
  updatedAt: string;
  questions: Array<{
    id: string;
    testTemplateId: string;
    type: 'multiple-choice' | 'sentence';
    text: string;
    options: string[] | null;
    answer: string[] | null;
    marks: number;
    createdAt: string;
    updatedAt: string;
  }>;
  assignments: Array<{
    id: string;
    userId: string;
    testTemplateId: string;
    assignedBy: string;
    assignedAt: string;
    status: string;
    user: {
      id: string;
      name: string;
      email: string;
      department: string | null;
    };
  }>;
  attempts: Array<{
    id: string;
    assignmentId: string;
    userId: string;
    testTemplateId: string;
    startedAt: string;
    submittedAt: string | null;
    answers: Array<{
      questionId: string;
      answer: string;
    }> | null;
    status: string;
    score: number | null;
    approved: boolean | null;
    createdAt: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
  }>;
  _count: {
    assignments: number;
    attempts: number;
  };
}

export const Templates: React.FC<TemplatesProps> = ({ 
  currentPage, 
  onNavigate 
}) => {
  const [templates, setTemplates] = useState<TestTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<TestTemplate | null>(null);
  const [viewingTemplate, setViewingTemplate] = useState<DetailedTestTemplate | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    department: '',
    timeLimit: 60
  });

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllTestTemplates();
      
      // Fetch question counts for each template
      const templatesWithQuestionCounts = await Promise.all(
        (response.data || []).map(async (template: TestTemplate) => {
          try {
            const detailsResponse = await getTestTemplateById(template.id);
            return {
              ...template,
              questionCount: detailsResponse.data?.questions?.length || 0
            };
          } catch (err) {
            // If fetching details fails, return template with 0 questions
            return {
              ...template,
              questionCount: 0
            };
          }
        })
      );
      
      setTemplates(templatesWithQuestionCounts);
    } catch (err: any) {
      setError(err.message || 'Failed to load test templates');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await createTestTemplate({
        ...formData,
        createdBy: localStorage.getItem('userId') || 'admin'
      });
      
      setFormData({ name: '', category: '', department: '', timeLimit: 60 });
      setShowCreateForm(false);
      await fetchTemplates();
    } catch (err: any) {
      setError(err.message || 'Failed to create template');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTemplate) return;
    
    try {
      setLoading(true);
      await updateTestTemplate(editingTemplate.id, formData);
      
      setEditingTemplate(null);
      setFormData({ name: '', category: '', department: '', timeLimit: 60 });
      await fetchTemplates();
    } catch (err: any) {
      setError(err.message || 'Failed to update template');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    if (!confirm('Are you sure you want to delete this template? This action cannot be undone.')) {
      return;
    }
    
    try {
      setLoading(true);
      await deleteTestTemplate(templateId);
      await fetchTemplates();
    } catch (err: any) {
      setError(err.message || 'Failed to delete template');
    } finally {
      setLoading(false);
    }
  };

  const handleViewTemplate = async (templateId: string) => {
    try {
      setDetailsLoading(true);
      setError(null);
      const response = await getTestTemplateById(templateId);
      setViewingTemplate(response.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load template details');
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleEditQuestionFromTemplate = (question: any) => {
    // Store question and template info for navigation to Questions page
    sessionStorage.setItem('editQuestionId', question.id);
    sessionStorage.setItem('selectedTemplateId', question.testTemplateId);
    
    // Close the template details modal
    setViewingTemplate(null);
    
    // Navigate to questions page
    onNavigate('questions');
  };

  const handleDeleteQuestionFromTemplate = async (questionId: string) => {
    if (!confirm('Are you sure you want to delete this question? This action cannot be undone.')) {
      return;
    }
    
    try {
      setDetailsLoading(true);
      await deleteQuestion(questionId);
      
      // Refresh the template details to show updated questions
      if (viewingTemplate) {
        const response = await getTestTemplateById(viewingTemplate.id);
        setViewingTemplate(response.data);
      }
      
      // Refresh the templates list to update question counts
      await fetchTemplates();
    } catch (err: any) {
      setError(err.message || 'Failed to delete question');
    } finally {
      setDetailsLoading(false);
    }
  };

  const startEdit = (template: TestTemplate) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      category: template.category,
      department: template.department,
      timeLimit: template.timeLimit
    });
    setShowCreateForm(true);
  };

  const cancelEdit = () => {
    setEditingTemplate(null);
    setFormData({ name: '', category: '', department: '', timeLimit: 60 });
    setShowCreateForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav currentPage={currentPage} onNavigate={onNavigate} />
      
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Test Templates</h1>
              <p className="mt-2 text-gray-600">
                Create and manage test templates for your organization.
              </p>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Create New Template
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {/* Create/Edit Form */}
          {showCreateForm && (
            <div className="bg-white shadow rounded-lg p-6 mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                {editingTemplate ? 'Edit Template' : 'Create New Template'}
              </h2>
              
              <form onSubmit={editingTemplate ? handleUpdateTemplate : handleCreateTemplate}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Template Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Mathematics Assessment"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Math, Science, Programming"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department
                    </label>
                    <input
                      type="text"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Engineering, HR"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Time Limit (minutes)
                    </label>
                    <input
                      type="number"
                      value={formData.timeLimit}
                      onChange={(e) => setFormData({ ...formData, timeLimit: parseInt(e.target.value) })}
                      required
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                  >
                    {loading ? 'Saving...' : (editingTemplate ? 'Update Template' : 'Create Template')}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Templates List */}
          <div className="bg-white shadow rounded-lg">
            {loading && templates.length === 0 ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : templates.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No test templates found. Create your first template to get started.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Template Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Department
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Time Limit
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Questions
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {templates.map((template) => (
                      <tr key={template.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{template.name}</div>
                          <div className="text-sm text-gray-500">Created {new Date(template.createdAt).toLocaleDateString()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            {template.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {template.department}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {template.timeLimit} min
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {template.questionCount || 0} questions
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button
                            onClick={() => handleViewTemplate(template.id)}
                            className="text-purple-600 hover:text-purple-900"
                          >
                            View Details
                          </button>
                          <button
                            onClick={() => startEdit(template)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteTemplate(template.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => onNavigate(`template/${template.id}`)}
                            className="text-green-600 hover:text-green-900"
                          >
                            Manage Questions
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Template Details Modal */}
      {viewingTemplate && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Template Details</h3>
              <button
                onClick={() => setViewingTemplate(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {detailsLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Template Info */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">{viewingTemplate.name}</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Category:</span>
                      <p className="text-gray-900">{viewingTemplate.category}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Department:</span>
                      <p className="text-gray-900">{viewingTemplate.department}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Time Limit:</span>
                      <p className="text-gray-900">{viewingTemplate.timeLimit} minutes</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Created:</span>
                      <p className="text-gray-900">{new Date(viewingTemplate.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600">{viewingTemplate.questions.length}</div>
                    <div className="text-sm text-blue-800">Total Questions</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600">{viewingTemplate._count.assignments}</div>
                    <div className="text-sm text-green-800">Assignments</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-purple-600">{viewingTemplate._count.attempts}</div>
                    <div className="text-sm text-purple-800">Attempts</div>
                  </div>
                </div>

                {/* Questions */}
                <div>
                  <h5 className="text-md font-semibold text-gray-900 mb-3">Questions ({viewingTemplate.questions.length})</h5>
                  <div className="max-h-60 overflow-y-auto space-y-3">
                    {viewingTemplate.questions.map((question, index) => (
                      <div key={question.id} className="border border-gray-200 rounded-lg p-3">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="text-sm font-medium text-gray-700">Question {index + 1}</span>
                              <div className="flex items-center space-x-2">
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                  question.type === 'multiple-choice' 
                                    ? 'bg-blue-100 text-blue-800' 
                                    : 'bg-green-100 text-green-800'
                                }`}>
                                  {question.type}
                                </span>
                                <span className="text-xs text-gray-500">{question.marks} marks</span>
                              </div>
                            </div>
                            <p className="text-sm text-gray-900 mb-2">{question.text}</p>
                            {question.type === 'multiple-choice' && question.options && (
                              <div className="mt-2">
                                <div className="text-xs text-gray-600 mb-1">Options:</div>
                                <div className="space-y-1">
                                  {question.options.map((option, optIndex) => (
                                    <div key={optIndex} className={`text-xs p-1 rounded ${
                                      question.answer && question.answer.includes(option)
                                        ? 'bg-green-100 text-green-800 font-medium'
                                        : 'bg-gray-100 text-gray-700'
                                    }`}>
                                      {option} {question.answer && question.answer.includes(option) && '✓'}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex flex-col space-y-1 ml-3">
                            <button
                              onClick={() => handleEditQuestionFromTemplate(question)}
                              className="text-xs text-blue-600 hover:text-blue-800 px-2 py-1 rounded border border-blue-200 hover:bg-blue-50"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteQuestionFromTemplate(question.id)}
                              className="text-xs text-red-600 hover:text-red-800 px-2 py-1 rounded border border-red-200 hover:bg-red-50"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Assignments */}
                {viewingTemplate.assignments.length > 0 && (
                  <div>
                    <h5 className="text-md font-semibold text-gray-900 mb-3">Assignments ({viewingTemplate.assignments.length})</h5>
                    <div className="max-h-40 overflow-y-auto">
                      <div className="space-y-2">
                        {viewingTemplate.assignments.map((assignment) => (
                          <div key={assignment.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{assignment.user.name}</div>
                              <div className="text-xs text-gray-500">{assignment.user.email}</div>
                            </div>
                            <div className="text-right">
                              <div className={`text-xs px-2 py-1 rounded-full ${
                                assignment.status === 'completed' 
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {assignment.status}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                {new Date(assignment.assignedAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Attempts */}
                {viewingTemplate.attempts.length > 0 && (
                  <div>
                    <h5 className="text-md font-semibold text-gray-900 mb-3">Recent Attempts ({viewingTemplate.attempts.length})</h5>
                    <div className="max-h-40 overflow-y-auto">
                      <div className="space-y-2">
                        {viewingTemplate.attempts.slice(0, 5).map((attempt) => (
                          <div key={attempt.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{attempt.user.name}</div>
                              <div className="text-xs text-gray-500">{attempt.user.email}</div>
                            </div>
                            <div className="text-right">
                              <div className={`text-xs px-2 py-1 rounded-full ${
                                attempt.status === 'submitted' 
                                  ? 'bg-blue-100 text-blue-800'
                                  : attempt.status === 'completed'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {attempt.status}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                {new Date(attempt.startedAt).toLocaleDateString()}
                              </div>
                              {attempt.score !== null && (
                                <div className="text-xs text-gray-700 font-medium">
                                  Score: {attempt.score}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}


              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

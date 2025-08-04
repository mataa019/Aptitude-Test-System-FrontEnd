import React, { useState, useEffect } from 'react';
import { AdminNav } from '../../components/admin/AdminNav';
import { 
  getAllTestTemplates, 
  createQuestion,
  getQuestionsByTemplateId,
  updateQuestion,
  deleteQuestion
} from '../../api/admin';

interface QuestionsProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

interface TestTemplate {
  id: string;
  name: string;
  category: string;
  department: string;
}

interface Question {
  id: string;
  testTemplateId: string;
  type: 'multiple-choice' | 'sentence';
  text: string;
  options: string[] | null;
  answer: string[] | null;
  marks: number;
  createdAt: string;
  updatedAt: string;
}

export const Questions: React.FC<QuestionsProps> = ({ 
  currentPage, 
  onNavigate 
}) => {
  const [templates, setTemplates] = useState<TestTemplate[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    testTemplateId: '',
    type: 'multiple-choice' as 'multiple-choice' | 'sentence',
    text: '',
    options: ['', '', '', ''],
    answer: [''],
    marks: 1
  });

  useEffect(() => {
    fetchTemplates();
  }, []);

  useEffect(() => {
    if (selectedTemplateId) {
      fetchQuestions(selectedTemplateId);
    }
  }, [selectedTemplateId]);

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

  const fetchQuestions = async (templateId: string) => {
    try {
      setLoading(true);
      const response = await getQuestionsByTemplateId(templateId);
      setQuestions(response.data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load questions');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      // Filter out empty options for multiple choice
      const filteredOptions = formData.type === 'multiple-choice' 
        ? formData.options.filter(option => option.trim() !== '')
        : [];
      
      const questionData = {
        testTemplateId: formData.testTemplateId,
        type: formData.type,
        text: formData.text,
        options: filteredOptions,
        answer: formData.answer.filter(ans => ans.trim() !== ''),
        marks: formData.marks
      };

      await createQuestion(questionData);
      
      // Reset form
      setFormData({
        testTemplateId: '',
        type: 'multiple-choice',
        text: '',
        options: ['', '', '', ''],
        answer: [''],
        marks: 1
      });
      setShowCreateForm(false);
      
      // Refresh questions if template is selected
      if (selectedTemplateId) {
        await fetchQuestions(selectedTemplateId);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create question');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (!confirm('Are you sure you want to delete this question? This action cannot be undone.')) {
      return;
    }
    
    try {
      setLoading(true);
      await deleteQuestion(questionId);
      
      // Refresh questions
      if (selectedTemplateId) {
        await fetchQuestions(selectedTemplateId);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete question');
    } finally {
      setLoading(false);
    }
  };

  const startCreate = () => {
    setFormData({
      testTemplateId: selectedTemplateId || '',
      type: 'multiple-choice',
      text: '',
      options: ['', '', '', ''],
      answer: [''],
      marks: 1
    });
    setShowCreateForm(true);
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  const addOption = () => {
    setFormData({ ...formData, options: [...formData.options, ''] });
  };

  const removeOption = (index: number) => {
    const newOptions = formData.options.filter((_, i) => i !== index);
    setFormData({ ...formData, options: newOptions });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav currentPage={currentPage} onNavigate={onNavigate} />
      
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Question Management</h1>
              <p className="mt-2 text-gray-600">
                Create and manage questions for your test templates.
              </p>
            </div>
            <button
              onClick={startCreate}
              disabled={!selectedTemplateId}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
            >
              Create New Question
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {/* Template Selection */}
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Select Test Template</h2>
            <select
              value={selectedTemplateId}
              onChange={(e) => setSelectedTemplateId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a template...</option>
              {templates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name} ({template.category})
                </option>
              ))}
            </select>
          </div>

          {/* Create/Edit Form */}
          {showCreateForm && (
            <div className="bg-white shadow rounded-lg p-6 mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                {editingQuestion ? 'Edit Question' : 'Create New Question'}
              </h2>
              
              <form onSubmit={handleCreateQuestion}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Template
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
                          {template.name} ({template.category})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Question Type
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as 'multiple-choice' | 'sentence' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="multiple-choice">Multiple Choice</option>
                      <option value="sentence">Short Answer</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Question Text
                    </label>
                    <textarea
                      value={formData.text}
                      onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                      required
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your question here..."
                    />
                  </div>

                  {formData.type === 'multiple-choice' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Answer Options
                        </label>
                        {formData.options.map((option, index) => (
                          <div key={index} className="flex items-center space-x-2 mb-2">
                            <input
                              type="text"
                              value={option}
                              onChange={(e) => handleOptionChange(index, e.target.value)}
                              placeholder={`Option ${index + 1}`}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            {formData.options.length > 2 && (
                              <button
                                type="button"
                                onClick={() => removeOption(index)}
                                className="px-2 py-1 text-red-600 hover:text-red-800"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={addOption}
                          className="mt-2 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                        >
                          Add Option
                        </button>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Correct Answer(s)
                        </label>
                        <select
                          value={formData.answer[0] || ''}
                          onChange={(e) => setFormData({ ...formData, answer: [e.target.value] })}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select correct answer...</option>
                          {formData.options.filter(opt => opt.trim() !== '').map((option, index) => (
                            <option key={index} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>
                    </>
                  )}
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Marks
                    </label>
                    <input
                      type="number"
                      value={formData.marks}
                      onChange={(e) => setFormData({ ...formData, marks: parseInt(e.target.value) })}
                      required
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                  >
                    {loading ? 'Creating...' : 'Create Question'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Questions List */}
          {selectedTemplateId && (
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Questions</h2>
              </div>
              
              {loading && questions.length === 0 ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : questions.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No questions found for this template. Create your first question to get started.</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {questions.map((question, index) => (
                    <div key={question.id} className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-sm font-medium text-gray-500">Q{index + 1}</span>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              question.type === 'multiple-choice' 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {question.type === 'multiple-choice' ? 'Multiple Choice' : 'Short Answer'}
                            </span>
                            <span className="text-xs text-gray-500">{question.marks} marks</span>
                          </div>
                          <p className="text-gray-900 mb-2">{question.text}</p>
                          
                          {question.type === 'multiple-choice' && question.options && (
                            <div className="space-y-1">
                              {question.options.map((option, optIndex) => (
                                <div key={optIndex} className={`text-sm ${
                                  question.answer?.includes(option) 
                                    ? 'text-green-600 font-medium' 
                                    : 'text-gray-600'
                                }`}>
                                  {String.fromCharCode(65 + optIndex)}. {option}
                                  {question.answer?.includes(option) && ' ✓'}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleDeleteQuestion(question.id)}
                            className="text-red-600 hover:text-red-900 text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

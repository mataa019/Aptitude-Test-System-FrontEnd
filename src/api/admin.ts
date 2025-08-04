import { api, handleError } from './config';

// 📋 Test Template Management
export const createTestTemplate = async (data: {
  name: string;
  category: string;
  department: string;
  timeLimit: number;
  createdBy: string;
}) => {
  try {
    const response = await api.post('/admin/test-templates', data);
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

export const getAllTestTemplates = async () => {
  try {
    const response = await api.get('/admin/test-templates');
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

export const getTestTemplateById = async (templateId: string) => {
  try {
    const response = await api.get(`/admin/test-templates/${templateId}`);
    
    // Parse JSON strings in questions if they exist
    if (response.data?.data?.questions) {
      response.data.data.questions = response.data.data.questions.map((question: any) => ({
        ...question,
        options: question.options ? JSON.parse(question.options) : null,
        answer: question.answer ? JSON.parse(question.answer) : null
      }));
    }
    
    // Parse JSON strings in attempts if they exist
    if (response.data?.data?.attempts) {
      response.data.data.attempts = response.data.data.attempts.map((attempt: any) => ({
        ...attempt,
        answers: attempt.answers ? JSON.parse(attempt.answers) : null
      }));
    }
    
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};


export const updateTestTemplate = async (templateId: string, data: {
  name?: string;
  timeLimit?: number;
  department?: string;
  category?: string;
}) => {
  try {
    const response = await api.put(`/admin/test-templates/${templateId}`, data);
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

export const deleteTestTemplate = async (templateId: string) => {
  try {
    const response = await api.delete(`/admin/test-templates/${templateId}`);
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

// 🎯 Question Management
export const createQuestion = async (data: {
  testTemplateId: string;
  type: 'multiple-choice' | 'sentence';
  text: string;
  options: string[];
  answer: string[];
  marks: number;
}) => {
  try {
    const response = await api.post('/admin/question', data);
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

export const updateQuestion = async (questionId: string, data: {
  testTemplateId?: string;
  type?: 'multiple-choice' | 'sentence';
  text?: string;
  options?: string[];
  answer?: string[];
  marks?: number;
}) => {
  try {
    const response = await api.put(`/admin/question/${questionId}`, data);
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

export const deleteQuestion = async (questionId: string) => {
  try {
    const response = await api.delete(`/admin/question/${questionId}`);
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

// 👥 User Management
export const getAllUsers = async () => {
  try {
    const response = await api.get('/admin/users');
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

export const getUserById = async (userId: string) => {
  try {
    const response = await api.get(`/admin/users/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

export const createUser = async (data: {
  username: string;
  email: string;
  fullName: string;
  password: string;
  role: string;
  department: string;
}) => {
  try {
    const response = await api.post('/admin/users', data);
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

export const deleteUser = async (userId: string) => {
  try {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

// 📝 Test Assignment
export const assignTemplateToUser = async (data: { 
  userId: string; 
  testTemplateId: string; 
  assignedBy: string;
  dueDate?: string;
}) => {
  try {
    const response = await api.post('/admin/assign-template', {
      userId: data.userId,
      testTemplateId: data.testTemplateId,
      assignedBy: data.assignedBy,
      ...(data.dueDate && { dueDate: data.dueDate })
    });
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

// Get all assignments or assignments for a specific user
export const getAssignments = async (userId?: string) => {
  try {
    const url = userId ? `/admin/assignments?userId=${userId}` : '/admin/assignments';
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

// Legacy function - keeping for backward compatibility
export const getUserAssignedTests = async (userId: string) => {
  // Use the new getAssignments function
  return getAssignments(userId);
};

// 📊 Results & Review
export const getTestResults = async (testTemplateId: string) => {
  try {
    const response = await api.get(`/admin/results/${testTemplateId}`);
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

export const getTestAttemptsWithAnswers = async (testTemplateId: string) => {
  try {
    const response = await api.get(`/admin/attempts/${testTemplateId}`);
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

export const getAttemptById = async (attemptId: string) => {
  try {
    const response = await api.get(`/admin/attempts/single/${attemptId}`);
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

export const markTestAttempt = async (attemptId: string, markingData: {
  score: number;
  approved: boolean;
}) => {
  try {
    const response = await api.put(`/admin/attempts/${attemptId}/mark`, markingData);
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

// 📈 Dashboard Statistics
export const getDashboardStats = async () => {
  try {
    const response = await api.get('/admin/dashboard/stats');
    // The API returns { message: "Dashboard stats fetched successfully", data: { totalTemplates, totalAttempts, pendingReviews } }
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

// Legacy function names for backward compatibility
export const markAttempt = (attemptId: string, score: number, approved: boolean) => 
  markTestAttempt(attemptId, { score, approved });
export const getTestTemplateWithQuestions = getTestTemplateById;
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

// Reassign template to user (when template is updated with new questions)
export const reassignTemplateToUser = async (data: { 
  userId: string; 
  testTemplateId: string; 
  assignedBy: string;
  reason: string;
  dueDate?: string;
}) => {
  try {
    const response = await api.post('/admin/reassign-template', {
      userId: data.userId,
      testTemplateId: data.testTemplateId,
      assignedBy: data.assignedBy,
      reason: data.reason,
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

export const getPendingReviewAttempts = async () => {
  try {
    const response = await api.get('/admin/attempts/pending/review');
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

export const getAllAttempts = async () => {
  try {
    const response = await api.get('/admin/test-attempts');
    return { data: response.data };
  } catch (error) {
    throw new Error(handleError(error));
  }
};

export const getTestAttemptsWithAnswers = async (testTemplateId: string) => {
  try {
    const response = await api.get(`/admin/attempts/${testTemplateId}`);
    // Parse answers if present and is a string
    if (Array.isArray(response.data?.data)) {
      response.data.data = response.data.data.map((attempt: any) => ({
        ...attempt,
        answers: attempt.answers && typeof attempt.answers === 'string' ? JSON.parse(attempt.answers) : attempt.answers,
        result: attempt.result && attempt.result.breakdown && typeof attempt.result.breakdown === 'string'
          ? { ...attempt.result, breakdown: JSON.parse(attempt.result.breakdown) }
          : attempt.result
      }));
    }
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

export const getAttemptById = async (attemptId: string) => {
  try {
    const response = await api.get(`/admin/test-attempts/${attemptId}`);
    // Parse answers if present and is a string
    if (response.data?.data) {
      const attempt = response.data.data;
      response.data.data = {
        ...attempt,
        answers: attempt.answers && typeof attempt.answers === 'string' ? JSON.parse(attempt.answers) : attempt.answers,
        result: attempt.result && attempt.result.breakdown && typeof attempt.result.breakdown === 'string'
          ? { ...attempt.result, breakdown: JSON.parse(attempt.result.breakdown) }
          : attempt.result
      };
    }
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

export const getAttemptForReview = async (attemptId: string) => {
  try {
    const response = await api.get(`/admin/attempt/${attemptId}/review`);
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

export const markTestAttempt = async (attemptId: string, markingData: {
  score: number;
  approved: boolean;
  feedback?: string;
  reviewedBy?: string;
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
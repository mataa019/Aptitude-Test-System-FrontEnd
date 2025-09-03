// apiService.js - Mobile API service for user endpoints
import axios from 'axios';

const BASE_URL = 'https://your-api-base-url.com'; // Replace with your API base URL

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getUserProfile = async () => {
  const res = await api.get('/user/profile');
  return res.data;
};

export const getAvailableTests = async (userId) => {
  const res = await api.get(`/user/assigned-tests/${userId}`);
  return res.data;
};

export const getTestById = async (testId) => {
  const res = await api.get(`/user/test/${testId}`);
  return res.data;
};

export const startTest = async (testId) => {
  const res = await api.post(`/user/test/${testId}/start`);
  return res.data;
};

export const submitAnswers = async (testId, answers) => {
  const payload = {
    responses: answers.map(a => ({ questionId: a.questionId, answer: a.answer }))
  };
  const res = await api.post(`/user/test/${testId}/submit`, payload);
  return res.data;
};

export const finishTest = async (testId) => {
  const res = await api.post(`/user/test/${testId}/complete`);
  return res.data;
};

export const getSubmittedTest = async (testId) => {
  const res = await api.get(`/user/test/${testId}/submitted`);
  return res.data;
};

export const getUserAttempts = async () => {
  const res = await api.get('/user/submitted-tests');
  return res.data;
};

export const getTestAttempt = async (testId) => {
  const res = await api.get(`/user/test/${testId}/submitted`);
  return res.data;
};

export const getUserResults = async () => {
  const res = await api.get('/user/results');
  return res.data;
};

export const getUserSubmittedTests = async () => {
  const res = await api.get('/user/submitted-tests');
  return res.data;
};

export const getDetailedReview = async (attemptId) => {
  const res = await api.get(`/user/results/${attemptId}/detailed-review`);
  return res.data;
};

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Page Components
import { Dashboard as DashboardPage } from '../pages/Dashboard';
import { Test as TestPage } from '../pages/Test';
import { Results as ResultsPage } from '../pages/Results';
import { AdminDashboard as AdminDashboardPage } from '../pages/admin/Dashboard';
import { Attempts as AttemptsPage } from '../pages/admin/Attempts';
import { Review as ReviewPage } from '../pages/admin/Review';

// Wrapper Components with Router integration
export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <DashboardPage
      user={user}
      onStartTest={(testId) => navigate(`/test/${testId}`)}
      onViewResult={(resultId) => navigate('/results')}
    />
  );
};

export const Test: React.FC = () => {
  const { testId } = useParams<{ testId: string }>();
  const navigate = useNavigate();

  if (!testId) {
    navigate('/dashboard');
    return null;
  }

  return (
    <TestPage
      testId={testId}
      onTestComplete={() => navigate('/dashboard')}
      onBack={() => navigate('/dashboard')}
    />
  );
};

export const Results: React.FC = () => {
  const navigate = useNavigate();

  return (
    <ResultsPage
      onBack={() => navigate('/dashboard')}
      onViewDetails={(resultId) => console.log('View result:', resultId)}
    />
  );
};

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <AdminDashboardPage
      user={user}
      currentPage="dashboard"
      onNavigate={(page) => {
        switch (page) {
          case 'attempts':
            navigate('/admin/attempts');
            break;
          case 'templates':
            // Navigate to templates when implemented
            break;
          default:
            navigate('/admin/dashboard');
        }
      }}
    />
  );
};

export const Attempts: React.FC = () => {
  const navigate = useNavigate();

  return (
    <AttemptsPage
      currentPage="attempts"
      onNavigate={(page) => {
        switch (page) {
          case 'dashboard':
            navigate('/admin/dashboard');
            break;
          default:
            navigate('/admin/attempts');
        }
      }}
      onReviewAttempt={(attemptId) => navigate(`/admin/review/${attemptId}`)}
    />
  );
};

export const Review: React.FC = () => {
  const { attemptId } = useParams<{ attemptId: string }>();
  const navigate = useNavigate();

  if (!attemptId) {
    navigate('/admin/attempts');
    return null;
  }

  return (
    <ReviewPage
      attemptId={attemptId}
      currentPage="review"
      onNavigate={(page) => {
        switch (page) {
          case 'dashboard':
            navigate('/admin/dashboard');
            break;
          case 'attempts':
            navigate('/admin/attempts');
            break;
          default:
            navigate('/admin/attempts');
        }
      }}
      onBack={() => navigate('/admin/attempts')}
    />
  );
};

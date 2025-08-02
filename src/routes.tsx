import { lazy } from 'react';
import { Navigate, type RouteObject, useParams, useNavigate } from 'react-router-dom';
import { user } from './api/config';

// Lazy load components for better performance
const Auth = lazy(() => import('./pages/Auth').then(m => ({ default: m.Auth })));

// User pages
const Dashboard = lazy(() => import('./pages/users/Dashboard').then(m => ({ default: m.Dashboard })));
const Test = lazy(() => import('./pages/users/Test').then(m => ({ default: m.Test })));
const Results = lazy(() => import('./pages/users/Results').then(m => ({ default: m.Results })));

// Admin pages
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard').then(m => ({ default: m.AdminDashboard })));
const Attempts = lazy(() => import('./pages/admin/Attempts').then(m => ({ default: m.Attempts })));
const Review = lazy(() => import('./pages/admin/Review').then(m => ({ default: m.Review })));

// Route wrapper components that handle routing props
const TestWrapper = () => {
  const { testId } = useParams<{ testId: string }>();
  const navigate = useNavigate();
  
  return (
    <Test 
      testId={testId || ''} 
      onTestComplete={() => navigate('/results')} 
      onBack={() => navigate('/dashboard')} 
    />
  );
};

const ReviewWrapper = () => {
  const { attemptId } = useParams<{ attemptId: string }>();
  const navigate = useNavigate();
  
  return (
    <Review 
      attemptId={attemptId || ''} 
      currentPage="review"
      onNavigate={(page) => navigate(`/admin/${page}`)}
      onBack={() => navigate('/admin/attempts')} 
    />
  );
};

const DashboardWrapper = () => {
  const navigate = useNavigate();
  
  // Safely get user data
  const getUserData = () => {
    try {
      return user.get();
    } catch (error) {
      console.warn('Error getting user data:', error);
      return null;
    }
  };
  
  return (
    <Dashboard 
      user={getUserData()}
      onStartTest={(testId) => navigate(`/test/${testId}`)}
      onViewResult={(resultId) => navigate(`/results#${resultId}`)}
    />
  );
};

const ResultsWrapper = () => {
  const navigate = useNavigate();
  
  return (
    <Results 
      onBack={() => navigate('/dashboard')}
      onViewDetails={(id) => console.log('View details:', id)}
    />
  );
};

const AdminDashboardWrapper = () => {
  const navigate = useNavigate();
  
  return (
    <AdminDashboard 
      user={user.get()}
      currentPage="dashboard"
      onNavigate={(page) => navigate(`/admin/${page}`)}
    />
  );
};

const AttemptsWrapper = () => {
  const navigate = useNavigate();
  
  return (
    <Attempts 
      currentPage="attempts"
      onNavigate={(page) => navigate(`/admin/${page}`)}
      onReviewAttempt={(attemptId) => navigate(`/admin/review/${attemptId}`)}
    />
  );
};

// Authentication routes - Auth component should be handled by AppRouter
export const authRoutes: RouteObject[] = [
  {
    path: '/auth',
    element: <div>Auth handled by AppRouter</div> // Placeholder, actual auth is in AppRouter
  }
];

export const userRoutes: RouteObject[] = [
  {
    path: '/',
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <DashboardWrapper /> },
      { path: 'test/:testId', element: <TestWrapper /> },
      { path: 'results', element: <ResultsWrapper /> },
    ]
  }
];

export const adminRoutes: RouteObject[] = [
  {
    path: '/admin',
    children: [
      { index: true, element: <Navigate to="/admin/dashboard" replace /> },
      { path: 'dashboard', element: <AdminDashboardWrapper /> },
      { path: 'attempts', element: <AttemptsWrapper /> },
      { path: 'review/:attemptId', element: <ReviewWrapper /> },
    ]
  }
];

export { 
  Auth, 
  Dashboard, 
  Test, 
  Results, 
  AdminDashboard, 
  Attempts, 
  Review,
  TestWrapper,
  ReviewWrapper,
  DashboardWrapper,
  ResultsWrapper,
  AdminDashboardWrapper,
  AttemptsWrapper
};

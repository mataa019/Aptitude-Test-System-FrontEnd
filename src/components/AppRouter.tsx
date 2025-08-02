import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, createBrowserRouter, RouterProvider } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader } from '../components/common/Loader';

// Import pages
import { Auth } from '../pages/Auth';

// Import routes and wrapper components
import { 
  userRoutes, 
  adminRoutes,
  DashboardWrapper,
  TestWrapper,
  ResultsWrapper,
  AdminDashboardWrapper,
  AttemptsWrapper,
  ReviewWrapper
} from '../routes';

export const AppRouter: React.FC = () => {
  const { isAuthenticated, user, login } = useAuth();

  if (!isAuthenticated) {
    return <Auth onAuthSuccess={login} />;
  }

  const isAdmin = user?.role === 'admin';

  return (
    <Router>
      <Suspense fallback={<Loader size="lg" text="Loading..." />}>
        <Routes>
          {/* User Routes */}
          {!isAdmin && (
            <>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardWrapper />} />
              <Route path="/test/:testId" element={<TestWrapper />} />
              <Route path="/results" element={<ResultsWrapper />} />
            </>
          )}

          {/* Admin Routes */}
          {isAdmin && (
            <>
              <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="/admin/dashboard" element={<AdminDashboardWrapper />} />
              <Route path="/admin/attempts" element={<AttemptsWrapper />} />
              <Route path="/admin/review/:attemptId" element={<ReviewWrapper />} />
            </>
          )}

          {/* Fallback */}
          <Route 
            path="*" 
            element={
              <Navigate to={isAdmin ? "/admin/dashboard" : "/dashboard"} replace />
            } 
          />
        </Routes>
      </Suspense>
    </Router>
  );
};

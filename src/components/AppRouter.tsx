import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader } from '../components/common/Loader';

// Import pages
import { Auth } from '../pages/Auth';
import { LandingPage } from '../pages/LandingPage';

// Import routes and wrapper components
import { 
  DashboardWrapper,
  TestWrapper,
  ResultsWrapper,
  AdminDashboardWrapper,
  AttemptsWrapper,
  TemplatesWrapper,
  QuestionsWrapper,
  AssignmentsWrapper,
  UsersWrapper,
  ReviewWrapper
} from '../routes';

export const AppRouter: React.FC = () => {
  const { isAuthenticated, user, login } = useAuth();
  const [authState, setAuthState] = React.useState<'none' | 'user' | 'admin'>('none');

  if (!isAuthenticated) {
    if (authState === 'user' || authState === 'admin') {
      return (
        <Auth 
          onAuthSuccess={login}
          onBackToLanding={() => setAuthState('none')}
          isAdminMode={authState === 'admin'}
        />
      );
    }
    return (
      <LandingPage 
        onGetStarted={() => setAuthState('user')}
        onLogin={() => setAuthState('user')}
        onAdminLogin={() => setAuthState('admin')}
      />
    );
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
              <Route path="/admin/templates" element={<TemplatesWrapper />} />
              <Route path="/admin/questions" element={<QuestionsWrapper />} />
              <Route path="/admin/assignments" element={<AssignmentsWrapper />} />
              <Route path="/admin/users" element={<UsersWrapper />} />
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

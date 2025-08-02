import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader } from '../components/common/Loader';

// Import pages
import { Login } from '../pages/Login';
import { Register } from '../pages/Register';

// Import route wrappers
import { 
  Dashboard, 
  Test, 
  Results, 
  AdminDashboard, 
  Attempts, 
  Review 
} from './RouteWrappers';

export const AppRouter: React.FC = () => {
  const { isAuthenticated, user, login } = useAuth();
  const [showRegister, setShowRegister] = React.useState(false);

  if (!isAuthenticated) {
    if (showRegister) {
      return (
        <Register 
          onRegisterSuccess={login}
          onSwitchToLogin={() => setShowRegister(false)}
        />
      );
    }
    return (
      <Login 
        onLoginSuccess={login}
        onSwitchToRegister={() => setShowRegister(true)}
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
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/test/:testId" element={<Test />} />
              <Route path="/results" element={<Results />} />
            </>
          )}

          {/* Admin Routes */}
          {isAdmin && (
            <>
              <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/attempts" element={<Attempts />} />
              <Route path="/admin/review/:attemptId" element={<Review />} />
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

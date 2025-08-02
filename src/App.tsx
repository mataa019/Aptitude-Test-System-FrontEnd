
import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AppRouter } from './components/AppRouter';

// Logout Button Component
const LogoutButton: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        onClick={logout}
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
      >
        Logout
      </button>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <AppRouter />
        <LogoutButton />
      </div>
    </AuthProvider>
  );
}

export default App;

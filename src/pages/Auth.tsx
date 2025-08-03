import React, { useState } from 'react';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { login, register } from '../api/auth';

interface AuthProps {
  onAuthSuccess: (token: string, user: any) => void;
  onBackToLanding?: () => void;
  isAdminMode?: boolean;
}

export const Auth: React.FC<AuthProps> = ({ onAuthSuccess, onBackToLanding, isAdminMode = false }) => {
  const [isLogin, setIsLogin] = useState(true);
  // For admin mode, always show login (no registration for admins)
  const actualIsLogin = isAdminMode || isLogin;
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear messages when user starts typing
    if (error) setError(null);
    if (successMessage) setSuccessMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let response;
      
      if (actualIsLogin) {
        response = await login(formData.email, formData.password);
        // Login returns token and user data (automatically stored by the auth function)
        onAuthSuccess(response.token, response.user);
      } else {
        // Validate passwords match for registration
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }

        // Validate password strength
        if (formData.password.length < 6) {
          setError('Password must be at least 6 characters long');
          setLoading(false);
          return;
        }

        response = await register(
          `${formData.firstName} ${formData.lastName}`,
          formData.email,
          formData.password
        );
        
        // Registration successful - switch to login mode
        console.log('Registration successful:', response);
        setIsLogin(true); // Switch to login mode
        resetForm(); // Clear the form
        setError(null); // Clear any errors
        
        // Show success message
        setSuccessMessage(`Registration successful! Please sign in with your email: ${formData.email}`);
        setTimeout(() => setSuccessMessage(null), 5000); // Clear success message after 5 seconds
      }
    } catch (err: any) {
      setError(err.message || `${actualIsLogin ? 'Login' : 'Registration'} failed. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: ''
    });
    setError(null);
    setSuccessMessage(null);
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className={`mx-auto h-12 w-12 flex items-center justify-center rounded-full ${isAdminMode ? 'bg-red-100' : 'bg-blue-100'}`}>
            <svg className={`h-6 w-6 ${isAdminMode ? 'text-red-600' : 'text-blue-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {actualIsLogin ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              )}
            </svg>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isAdminMode ? 'Admin Sign In' : 
              (actualIsLogin ? 'Sign in to your account' : 'Create your account')
            }
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {isAdminMode ? 'Access the admin dashboard' : 
              (actualIsLogin ? "Don't have an account? " : 'Already have an account? ')
            }
            {/* Only show registration toggle for users, not admins */}
            {!isAdminMode && (
              <button
                type="button"
                onClick={switchMode}
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                {actualIsLogin ? 'Create one here' : 'Sign in here'}
              </button>
            )}
            {onBackToLanding && (
              <>
                {!isAdminMode && ' | '}
                <button
                  type="button"
                  onClick={onBackToLanding}
                  className="font-medium text-gray-600 hover:text-gray-500"
                >
                  Back to Home
                </button>
              </>
            )}
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Name Fields - Only for Registration and not for Admin mode */}
            {!actualIsLogin && !isAdminMode && (
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  name="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="John"
                />
                <Input
                  label="Last Name"
                  name="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Doe"
                />
              </div>
            )}

            {/* Email Field */}
            <Input
              label="Email address"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              placeholder="john.doe@example.com"
            />

            {/* Password Field */}
            <Input
              label="Password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleInputChange}
              placeholder={actualIsLogin ? "Enter your password" : "Enter a strong password"}
            />
            
            {/* Confirm Password - Only for Registration and not for Admin mode */}
            {!actualIsLogin && !isAdminMode && (
              <Input
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm your password"
              />
            )}
          </div>

          {/* Password Requirements - Only for Registration (not for admin) */}
          {!actualIsLogin && (
            <div className="text-xs text-gray-500 space-y-1">
              <p>Password requirements:</p>
              <ul className="list-disc list-inside space-y-0.5 ml-2">
                <li>At least 6 characters long</li>
                <li>Should contain a mix of letters and numbers</li>
              </ul>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded">
              {successMessage}
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={loading}
            className="w-full"
          >
            {loading 
              ? (actualIsLogin ? 'Signing in...' : 'Creating account...') 
              : (actualIsLogin ? (isAdminMode ? 'Admin Sign In' : 'Sign in') : 'Create Account')
            }
          </Button>
        </form>

        {/* Terms and Privacy - Only for Registration and not for Admin mode */}
        {!actualIsLogin && !isAdminMode && (
          <div className="text-center">
            <p className="text-xs text-gray-500">
              By creating an account, you agree to our{' '}
              <a href="#" className="text-blue-600 hover:text-blue-500">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-blue-600 hover:text-blue-500">
                Privacy Policy
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
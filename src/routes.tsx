import { lazy } from 'react';
import { Navigate, type RouteObject } from 'react-router-dom';

// Lazy load components for better performance
const Login = lazy(() => import('./pages/Login').then(m => ({ default: m.Login })));
const Dashboard = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })));
const Test = lazy(() => import('./pages/Test').then(m => ({ default: m.Test })));
const Results = lazy(() => import('./pages/Results').then(m => ({ default: m.Results })));

// Admin pages
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard').then(m => ({ default: m.AdminDashboard })));
const Attempts = lazy(() => import('./pages/admin/Attempts').then(m => ({ default: m.Attempts })));
const Review = lazy(() => import('./pages/admin/Review').then(m => ({ default: m.Review })));

export const userRoutes: RouteObject[] = [
  {
    path: '/',
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'test/:testId', element: <Test /> },
      { path: 'results', element: <Results /> },
    ]
  }
];

export const adminRoutes: RouteObject[] = [
  {
    path: '/admin',
    children: [
      { index: true, element: <Navigate to="/admin/dashboard" replace /> },
      { path: 'dashboard', element: <AdminDashboard /> },
      { path: 'attempts', element: <Attempts /> },
      { path: 'review/:attemptId', element: <Review /> },
    ]
  }
];

export { Login, Dashboard, Test, Results, AdminDashboard, Attempts, Review };

import { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from './hooks/redux';
import { useGetCurrentUserQuery } from './services/auth-api';
import { loginSuccess } from './store/auth-slice';
import ProtectedRoute from './components/auth/protected-route';
import LoadingSpinner from './components/ui/loading-spinner';
import ErrorBoundary from './components/error-boundary';
import DevTools from './components/dev-tools';
import DebugAuth from './components/debug-auth';

// Lazy load page components for better performance
const AuthPages = lazy(() => import('./pages/auth'));
const PartnerPages = lazy(() => import('./pages/partner'));
const BusinessPages = lazy(() => import('./pages/business'));
const EmployeePages = lazy(() => import('./pages/employee'));
const LandingPage = lazy(() => import('./pages/landing'));

function App() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, token, user } = useAppSelector((state) => state.auth);
  
  // Try to get current user if we have a token but no user data
  const { data: currentUserData, isLoading } = useGetCurrentUserQuery(undefined, {
    skip: !token || !!user,
  });

  useEffect(() => {
    // If we have user data from the API and a token, update the auth state
    if (currentUserData?.data && token) {
      dispatch(loginSuccess({ user: currentUserData.data, token }));
    }
  }, [currentUserData, token, dispatch]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <Suspense
          fallback={
            <div className="min-h-screen flex items-center justify-center">
              <LoadingSpinner size="lg" />
            </div>
          }
        >
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth/*" element={<AuthPages />} />
            
            {/* Protected routes by role */}
            <Route
              path="/partner/*"
              element={
                <ProtectedRoute roles={['PARTNER']}>
                  <PartnerPages />
                </ProtectedRoute>
              }
            />
            <Route
              path="/business/*"
              element={
                <ProtectedRoute roles={['BUSINESS']}>
                  <BusinessPages />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employee/*"
              element={
                <ProtectedRoute roles={['EMPLOYEE']}>
                  <EmployeePages />
                </ProtectedRoute>
              }
            />
            
            {/* Redirect authenticated users to their dashboard */}
            <Route
              path="/dashboard"
              element={
                isAuthenticated ? (
                  user?.role === 'PARTNER' ? (
                    <Navigate to="/partner/dashboard" />
                  ) : user?.role === 'BUSINESS' ? (
                    <Navigate to="/business/dashboard" />
                  ) : user?.role === 'EMPLOYEE' ? (
                    <Navigate to="/employee/dashboard" />
                  ) : (
                    <Navigate to="/auth/signin" />
                  )
                ) : (
                  <Navigate to="/auth/signin" />
                )
              }
            />
            
            {/* 404 and other routes */}
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
        <DevTools />
        <DebugAuth />
      </div>
    </ErrorBoundary>
  );
}

// Simple error pages
const UnauthorizedPage = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">401</h1>
      <p className="text-gray-600 mb-8">You are not authorized to access this page.</p>
      <a
        href="/"
        className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
      >
        Go Home
      </a>
    </div>
  </div>
);

const NotFoundPage = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
      <p className="text-gray-600 mb-8">The page you are looking for does not exist.</p>
      <a
        href="/"
        className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
      >
        Go Home
      </a>
    </div>
  </div>
);

export default App; 
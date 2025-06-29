import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { vi } from 'vitest';
import { User, UserRole } from '../types';
import authSlice from '../store/auth-slice';
import uiSlice from '../store/ui-slice';
import { authApi } from '../services/auth-api';

// Mock user data for testing
export const mockUsers = {
  partner: {
    id: 'test-partner-1',
    email: 'partner@test.com',
    firstName: 'Test',
    lastName: 'Partner',
    phone: '+1-555-0123',
    role: 'PARTNER' as UserRole,
    status: 'ACTIVE' as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  business: {
    id: 'test-business-1',
    email: 'business@test.com',
    firstName: 'Test',
    lastName: 'Business',
    phone: '+1-555-0124',
    role: 'BUSINESS' as UserRole,
    status: 'ACTIVE' as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  employee: {
    id: 'test-employee-1',
    email: 'employee@test.com',
    firstName: 'Test',
    lastName: 'Employee',
    phone: '+1-555-0125',
    role: 'EMPLOYEE' as UserRole,
    status: 'ACTIVE' as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  unauthenticated: null,
};

// Create test store with optional user and auth state
export const createTestStore = (user: User | null = null, isAuthenticated = false) => {
  const store = configureStore({
    reducer: {
      auth: authSlice,
      ui: uiSlice,
      authApi: authApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ['persist/FLUSH', 'persist/REHYDRATE', 'persist/PAUSE', 'persist/PERSIST', 'persist/PURGE', 'persist/REGISTER'],
        },
      }).concat(authApi.middleware),
  });

  // Dispatch initial auth state if provided
  if (isAuthenticated && user) {
    store.dispatch({
      type: 'auth/loginSuccess',
      payload: { user, token: 'test-token' },
    });
  }

  return store;
};

// Custom render function with providers
interface ExtendedRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialEntries?: string[];
  user?: User | null;
  isAuthenticated?: boolean;
  useMemoryRouter?: boolean;
}

export function renderWithProviders(
  ui: ReactElement,
  {
    initialEntries = ['/'],
    user = null,
    isAuthenticated = false,
    useMemoryRouter = true,
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  const store = createTestStore(user, isAuthenticated);

  const Router = useMemoryRouter ? MemoryRouter : BrowserRouter;
  const routerProps = useMemoryRouter ? { initialEntries } : {};

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <Provider store={store}>
        <Router {...routerProps}>
          {children}
        </Router>
      </Provider>
    );
  }

  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}

// Helper functions for common test scenarios
export const renderAsAuthenticated = (ui: ReactElement, role: UserRole, options?: ExtendedRenderOptions) => {
  const user = mockUsers[role.toLowerCase() as keyof typeof mockUsers] as User;
  return renderWithProviders(ui, {
    ...options,
    user,
    isAuthenticated: true,
  });
};

export const renderAsUnauthenticated = (ui: ReactElement, options?: ExtendedRenderOptions) => {
  return renderWithProviders(ui, {
    ...options,
    user: null,
    isAuthenticated: false,
  });
};

// Mock implementations for testing
export const mockNavigate = vi.fn();
export const mockLocation = {
  pathname: '/',
  search: '',
  hash: '',
  state: null,
  key: 'default',
};

// Setup function to be called before each test
export const setupTest = () => {
  // Clear all mocks
  vi.clearAllMocks();
  
  // Clear localStorage
  localStorage.clear();
  
  // Reset navigate mock
  mockNavigate.mockClear();
};

// Route test helpers
export const routeTestCases = {
  public: [
    { path: '/', name: 'Landing Page' },
    { path: '/auth/signin', name: 'Sign In' },
    { path: '/auth/signup', name: 'Sign Up' },
    { path: '/unauthorized', name: 'Unauthorized' },
  ],
  protected: {
    partner: [
      { path: '/partner', name: 'Partner Root' },
      { path: '/partner/dashboard', name: 'Partner Dashboard' },
    ],
    business: [
      { path: '/business', name: 'Business Root' },
      { path: '/business/dashboard', name: 'Business Dashboard' },
    ],
    employee: [
      { path: '/employee', name: 'Employee Root' },
      { path: '/employee/dashboard', name: 'Employee Dashboard' },
    ],
  },
  redirects: [
    { path: '/dashboard', name: 'Dashboard Redirect' },
  ],
  notFound: [
    { path: '/non-existent-route', name: '404 Route' },
    { path: '/auth/invalid', name: 'Invalid Auth Route' },
  ],
};

export default renderWithProviders; 
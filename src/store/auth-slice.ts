import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// Test user for development
const testUser: User = {
  id: 'test-employee-1',
  email: 'test@employee.com',
  firstName: 'Test',
  lastName: 'Employee',
  phone: '+1-555-0123',
  role: 'EMPLOYEE',
  status: 'ACTIVE',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// Enable testing mode to bypass authentication
// Change 'true' to 'false' below to require real authentication in development
const TESTING_MODE = process.env.NODE_ENV === 'development' && false;

// Helper to get stored user
const getStoredUser = (): User | null => {
  try {
    const stored = localStorage.getItem('upzy_user');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const initialState: AuthState = (() => {
  if (TESTING_MODE) {
    // In testing mode, use default test user
    return {
      user: testUser,
      token: 'test-token-employee',
      isAuthenticated: true,
      loading: false,
      error: null,
    };
  } else {
    // In production mode, check localStorage
    const storedToken = localStorage.getItem('upzy_token');
    const storedUser = getStoredUser();
    return {
      user: storedUser,
      token: storedToken,
      isAuthenticated: !!(storedToken && storedUser),
      loading: false,
      error: null,
    };
  }
})();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
      localStorage.setItem('upzy_token', action.payload.token);
      localStorage.setItem('upzy_user', JSON.stringify(action.payload.user));
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = action.payload;
      localStorage.removeItem('upzy_token');
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = null;
      state.loading = false;
      localStorage.removeItem('upzy_token');
      localStorage.removeItem('upzy_user');
    },
    clearError: (state) => {
      state.error = null;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    // Testing helpers
    setTestUser: (state, action: PayloadAction<'PARTNER' | 'BUSINESS' | 'EMPLOYEE'>) => {
      if (process.env.NODE_ENV === 'development') {
        const testUsers = {
          PARTNER: {
            id: 'test-partner-1',
            email: 'test@partner.com',
            firstName: 'Test',
            lastName: 'Partner',
            phone: '+1-555-0123',
            role: 'PARTNER' as const,
            status: 'ACTIVE' as const,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          BUSINESS: {
            id: 'test-business-1',
            email: 'test@business.com',
            firstName: 'Test',
            lastName: 'Business',
            phone: '+1-555-0124',
            role: 'BUSINESS' as const,
            status: 'ACTIVE' as const,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          EMPLOYEE: {
            id: 'test-employee-1',
            email: 'test@employee.com',
            firstName: 'Test',
            lastName: 'Employee',
            phone: '+1-555-0125',
            role: 'EMPLOYEE' as const,
            status: 'ACTIVE' as const,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        };
        state.user = testUsers[action.payload];
        state.isAuthenticated = true;
        state.token = `test-token-${action.payload.toLowerCase()}`;
        state.loading = false;
        state.error = null;
        // Update localStorage to persist the change
        localStorage.setItem('upzy_token', state.token);
        localStorage.setItem('upzy_user', JSON.stringify(state.user));
      }
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  clearError,
  updateUser,
  setTestUser,
} = authSlice.actions;

export default authSlice.reducer; 
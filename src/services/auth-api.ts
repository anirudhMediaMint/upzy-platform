import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { User, LoginForm, ApiResponse } from '../types';
import { RootState } from '../store';
import { SignupFormData } from '../lib/validations';

// Define the base URL - will be configurable via environment variables
const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/v1';

// Development mode mock responses
const DEVELOPMENT_MODE = import.meta.env.DEV;

// Mock user generator for development
const createMockUser = (userData: Partial<User>): User => ({
  id: `mock-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  email: userData.email || 'test@example.com',
  firstName: userData.firstName || 'Test',
  lastName: userData.lastName || 'User',
  phone: userData.phone || '+1-555-0123',
  role: userData.role || 'PARTNER',
  status: 'ACTIVE',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

// Mock API response wrapper
const createMockResponse = <T>(data: T): ApiResponse<T> => ({
  success: true,
  message: 'Success',
  data,
});

// Custom fetch function that includes development mocking
const mockFetchBaseQuery = fetchBaseQuery({
  baseUrl: `${baseUrl}/auth`,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    headers.set('content-type', 'application/json');
    return headers;
  },
});

// Enhanced base query with development mode fallback
const enhancedBaseQuery = async (args: any, api: any, extraOptions: any) => {
  try {
    // Try the real API first
    const result = await mockFetchBaseQuery(args, api, extraOptions);
    
    // If successful, return the result
    if (result.data || !result.error) {
      return result;
    }
    
    // If network error and in development mode, return mock data
    if (DEVELOPMENT_MODE && result.error && 'status' in result.error && 
        (result.error.status === 'FETCH_ERROR' || result.error.status === 'PARSING_ERROR')) {
      console.warn('🚀 Development Mode: Using mock API response for', args.url);
      return handleMockResponse(args, api);
    }
    
    return result;
  } catch (error) {
    // If request fails completely and we're in development, use mocks
    if (DEVELOPMENT_MODE) {
      console.warn('🚀 Development Mode: API unavailable, using mock response for', args.url);
      return handleMockResponse(args, api);
    }
    throw error;
  }
};

// Mock response handler
const handleMockResponse = (args: any, api: any) => {
  const { url, method, body } = args;
  
  // Simulate API delay
  const delay = () => new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
  
  if (url === '/signup' && method === 'POST') {
    return delay().then(() => {
      const signupData = body as Omit<SignupFormData, 'confirmPassword' | 'terms'>;
      const mockUser = createMockUser({
        email: signupData.email,
        firstName: signupData.firstName,
        lastName: signupData.lastName,
        phone: signupData.phone,
        role: signupData.userType as 'PARTNER' | 'BUSINESS' | 'EMPLOYEE',
      });
      
      const mockToken = `mock-jwt-${Date.now()}-${mockUser.role.toLowerCase()}`;
      
      return {
        data: createMockResponse({
          user: mockUser,
          token: mockToken,
        }),
      };
    });
  }
  
  if (url === '/login' && method === 'POST') {
    return delay().then(() => {
      const loginData = body as LoginForm;
      const mockUser = createMockUser({
        email: loginData.email,
        role: 'PARTNER', // Default for demo
      });
      
      const mockToken = `mock-jwt-${Date.now()}-partner`;
      
      return {
        data: createMockResponse({
          user: mockUser,
          token: mockToken,
        }),
      };
    });
  }
  
  if (url === '/logout' && method === 'POST') {
    return delay().then(() => ({
      data: createMockResponse({}),
    }));
  }
  
  // Default mock response
  return delay().then(() => ({
    data: createMockResponse({ message: 'Mock response' }),
  }));
};

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: enhancedBaseQuery,
  tagTypes: ['User'],
  endpoints: (builder) => ({
    login: builder.mutation<
      ApiResponse<{ user: User; token: string }>,
      LoginForm
    >({
      query: (credentials) => ({
        url: '/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User'],
    }),
    
    logout: builder.mutation<ApiResponse<void>, void>({
      query: () => ({
        url: '/logout',
        method: 'POST',
      }),
      invalidatesTags: ['User'],
    }),
    
    register: builder.mutation<
      ApiResponse<{ user: User; token: string }>,
      {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        phone: string;
        role: 'PARTNER' | 'BUSINESS';
      }
    >({
      query: (userData) => ({
        url: '/register',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),

    signup: builder.mutation<
      ApiResponse<{ user: User; token: string }>,
      Omit<SignupFormData, 'confirmPassword' | 'terms'>
    >({
      query: (signupData) => ({
        url: '/signup',
        method: 'POST',
        body: signupData,
      }),
      invalidatesTags: ['User'],
    }),
    
    getCurrentUser: builder.query<ApiResponse<User>, void>({
      query: () => '/me',
      providesTags: ['User'],
    }),
    
    updateProfile: builder.mutation<
      ApiResponse<User>,
      { id: string; data: Partial<User> }
    >({
      query: ({ id, data }) => ({
        url: `/profile/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
    
    forgotPassword: builder.mutation<
      ApiResponse<{ message: string }>,
      { email: string }
    >({
      query: (data) => ({
        url: '/forgot-password',
        method: 'POST',
        body: data,
      }),
    }),
    
    resetPassword: builder.mutation<
      ApiResponse<{ message: string }>,
      { token: string; password: string }
    >({
      query: (data) => ({
        url: '/reset-password',
        method: 'POST',
        body: data,
      }),
    }),
    
    changePassword: builder.mutation<
      ApiResponse<{ message: string }>,
      { currentPassword: string; newPassword: string }
    >({
      query: (data) => ({
        url: '/change-password',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useSignupMutation,
  useGetCurrentUserQuery,
  useUpdateProfileMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
} = authApi; 
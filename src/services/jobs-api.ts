import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Job, JobFilters, JobForm, ApiResponse, PaginatedResponse } from '../types';
import { RootState } from '../store';

// Define the base URL - will be configurable via environment variables
const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/v1';

export const jobsApi = createApi({
  reducerPath: 'jobsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl}/jobs`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      headers.set('content-type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Job', 'JobList'],
  endpoints: (builder) => ({
    getJobs: builder.query<PaginatedResponse<Job>, JobFilters>({
      query: (filters = {}) => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, value.toString());
          }
        });
        return `/?${params.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Job' as const, id })),
              { type: 'JobList', id: 'LIST' },
            ]
          : [{ type: 'JobList', id: 'LIST' }],
    }),

    getJobById: builder.query<ApiResponse<Job>, string>({
      query: (id) => `/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Job', id }],
    }),

    createJob: builder.mutation<ApiResponse<Job>, JobForm>({
      query: (jobData) => ({
        url: '/',
        method: 'POST',
        body: jobData,
      }),
      invalidatesTags: [{ type: 'JobList', id: 'LIST' }],
    }),

    updateJob: builder.mutation<
      ApiResponse<Job>,
      { id: string; data: Partial<JobForm> }
    >({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Job', id },
        { type: 'JobList', id: 'LIST' },
      ],
    }),

    deleteJob: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Job', id },
        { type: 'JobList', id: 'LIST' },
      ],
    }),

    acceptJob: builder.mutation<ApiResponse<Job>, string>({
      query: (jobId) => ({
        url: `/${jobId}/accept`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, jobId) => [
        { type: 'Job', id: jobId },
        { type: 'JobList', id: 'LIST' },
      ],
    }),

    cancelJob: builder.mutation<
      ApiResponse<Job>,
      { jobId: string; reason?: string }
    >({
      query: ({ jobId, reason }) => ({
        url: `/${jobId}/cancel`,
        method: 'POST',
        body: { reason },
      }),
      invalidatesTags: (_result, _error, { jobId }) => [
        { type: 'Job', id: jobId },
        { type: 'JobList', id: 'LIST' },
      ],
    }),

    completeJob: builder.mutation<ApiResponse<Job>, string>({
      query: (jobId) => ({
        url: `/${jobId}/complete`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, jobId) => [
        { type: 'Job', id: jobId },
        { type: 'JobList', id: 'LIST' },
      ],
    }),

    getMyJobs: builder.query<PaginatedResponse<Job>, JobFilters>({
      query: (filters = {}) => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, value.toString());
          }
        });
        return `/my-jobs?${params.toString()}`;
      },
      providesTags: [{ type: 'JobList', id: 'MY_JOBS' }],
    }),

    searchPartners: builder.query<
      PaginatedResponse<any>,
      { jobId: string; filters?: any }
    >({
      query: ({ jobId, filters = {} }) => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, value.toString());
          }
        });
        return `/${jobId}/partners?${params.toString()}`;
      },
    }),
  }),
});

export const {
  useGetJobsQuery,
  useGetJobByIdQuery,
  useCreateJobMutation,
  useUpdateJobMutation,
  useDeleteJobMutation,
  useAcceptJobMutation,
  useCancelJobMutation,
  useCompleteJobMutation,
  useGetMyJobsQuery,
  useSearchPartnersQuery,
} = jobsApi; 
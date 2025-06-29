import React, { useState } from 'react';
import { useGetMyJobsQuery, useCompleteJobMutation, useCancelJobMutation } from '../../services/jobs-api';
import { JobFilters, JobStatus } from '../../types';
import Card from '../../components/ui/card';
import Button from '../../components/ui/button';
import LoadingSpinner from '../../components/ui/loading-spinner';

const PartnerMyJobs: React.FC = () => {
  const [filters, setFilters] = useState<JobFilters>({
    page: 1,
    limit: 10,
  });

  const { data: jobsData, isLoading, error } = useGetMyJobsQuery(filters);
  const [completeJob, { isLoading: isCompleting }] = useCompleteJobMutation();
  const [cancelJob, { isLoading: isCancelling }] = useCancelJobMutation();

  const handleCompleteJob = async (jobId: string) => {
    try {
      await completeJob(jobId).unwrap();
      // Show success message
    } catch (error) {
      console.error('Failed to complete job:', error);
    }
  };

     const handleCancelJob = async (jobId: string, reason?: string) => {
     try {
       const params = reason ? { jobId, reason } : { jobId };
       await cancelJob(params).unwrap();
      // Show success message
    } catch (error) {
      console.error('Failed to cancel job:', error);
    }
  };

  const handleFilterChange = (newFilters: Partial<JobFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: JobStatus) => {
    const colors = {
      ASSIGNED: 'bg-blue-100 text-blue-800',
      IN_PROGRESS: 'bg-yellow-100 text-yellow-800',
      COMPLETED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
      DRAFT: 'bg-gray-100 text-gray-800',
      POSTED: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

     const getCategoryIcon = (category: string) => {
     const icons: Record<string, string> = {
       DELIVERY: '🚚',
       INSTALLATION: '🔧',
       MAINTENANCE: '⚙️',
       CLEANING: '🧹',
       TECH_SUPPORT: '💻',
       OTHER: '📋',
     };
     return icons[category] || '📋';
   };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900">Failed to load jobs</h3>
          <p className="mt-2 text-sm text-gray-500">Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Jobs</h1>
        <p className="mt-1 text-sm text-gray-500">
          Track and manage your accepted jobs
        </p>
      </div>

      {/* Status Filter */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-wrap gap-2">
                     <Button
             variant={!filters.status ? 'primary' : 'outline'}
             onClick={() => {
               const { status, ...rest } = filters;
               setFilters({ ...rest, page: 1 });
             }}
             className="text-sm"
           >
             All Jobs
           </Button>
          <Button
            variant={filters.status === 'ASSIGNED' ? 'primary' : 'outline'}
            onClick={() => handleFilterChange({ status: 'ASSIGNED' })}
            className="text-sm"
          >
            Assigned
          </Button>
          <Button
            variant={filters.status === 'IN_PROGRESS' ? 'primary' : 'outline'}
            onClick={() => handleFilterChange({ status: 'IN_PROGRESS' })}
            className="text-sm"
          >
            In Progress
          </Button>
          <Button
            variant={filters.status === 'COMPLETED' ? 'primary' : 'outline'}
            onClick={() => handleFilterChange({ status: 'COMPLETED' })}
            className="text-sm"
          >
            Completed
          </Button>
        </div>
      </div>

      {/* Job Results */}
      <div className="space-y-4">
        {jobsData?.data?.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900">No jobs found</h3>
              <p className="mt-2 text-sm text-gray-500">
                You haven't accepted any jobs yet. Check out available jobs to get started.
              </p>
            </div>
          </Card>
        ) : (
          jobsData?.data?.map((job) => (
            <Card key={job.id} className="hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{getCategoryIcon(job.category)}</span>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="capitalize">{job.category.toLowerCase().replace('_', ' ')}</span>
                        <span>•</span>
                        <span className="capitalize">{job.type.toLowerCase().replace('_', ' ')}</span>
                        <span>•</span>
                        <span>Accepted {formatDate(job.updatedAt)}</span>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                      {job.status.replace('_', ' ')}
                    </span>
                  </div>

                  <p className="text-gray-700 mb-4 line-clamp-2">{job.description}</p>

                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <span>📍 {job.location.city}, {job.location.state}</span>
                    <span>⏱️ {job.duration}</span>
                    {job.deadline && (
                      <span className={job.deadline < new Date().toISOString() ? 'text-red-600 font-medium' : ''}>
                        📅 Due {formatDate(job.deadline)}
                      </span>
                    )}
                  </div>

                  {job.status === 'IN_PROGRESS' && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4">
                      <div className="flex items-center">
                        <span className="text-yellow-500 mr-2">⚠️</span>
                        <span className="text-sm text-yellow-800">
                          This job is currently in progress. Complete it when finished.
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="ml-6 text-right">
                  <div className="mb-4">
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(job.budget.amount)}
                    </div>
                    <div className="text-sm text-gray-500 capitalize">
                      {job.budget.type.toLowerCase()}
                    </div>
                  </div>

                  <div className="space-y-2">
                    {job.status === 'ASSIGNED' && (
                      <>
                        <Button
                          variant="primary"
                          onClick={() => {
                            // In a real app, this would update the job status to IN_PROGRESS
                            console.log('Start job:', job.id);
                          }}
                          className="w-full"
                        >
                          Start Job
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleCancelJob(job.id)}
                          disabled={isCancelling}
                          className="w-full text-red-600 border-red-300 hover:bg-red-50"
                        >
                          {isCancelling ? 'Cancelling...' : 'Cancel Job'}
                        </Button>
                      </>
                    )}

                    {job.status === 'IN_PROGRESS' && (
                      <Button
                        variant="primary"
                        onClick={() => handleCompleteJob(job.id)}
                        disabled={isCompleting}
                        className="w-full"
                      >
                        {isCompleting ? 'Completing...' : 'Mark Complete'}
                      </Button>
                    )}

                    {job.status === 'COMPLETED' && (
                      <div className="text-center">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                          ✅ Completed
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {jobsData?.pagination && jobsData.pagination.totalPages > 1 && (
        <div className="mt-8 flex justify-center items-center gap-4">
          <Button
            variant="outline"
            onClick={() => handleFilterChange({ page: Math.max(1, filters.page! - 1) })}
            disabled={filters.page === 1}
          >
            Previous
          </Button>
          
          <span className="text-sm text-gray-600">
            Page {jobsData.pagination.page} of {jobsData.pagination.totalPages}
          </span>
          
          <Button
            variant="outline"
            onClick={() => handleFilterChange({ page: filters.page! + 1 })}
            disabled={filters.page === jobsData.pagination.totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default PartnerMyJobs; 
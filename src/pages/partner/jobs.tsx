import React, { useState } from 'react';
import { useGetJobsQuery, useAcceptJobMutation } from '../../services/jobs-api';
import { JobFilters, JobCategory, JobType } from '../../types';
import Card from '../../components/ui/card';
import Button from '../../components/ui/button';
import LoadingSpinner from '../../components/ui/loading-spinner';

const PartnerJobs: React.FC = () => {
  const [filters, setFilters] = useState<JobFilters>({
    status: 'POSTED',
    page: 1,
    limit: 10,
  });

  const { data: jobsData, isLoading, error } = useGetJobsQuery(filters);
  const [acceptJob, { isLoading: isAccepting }] = useAcceptJobMutation();

  const handleAcceptJob = async (jobId: string) => {
    try {
      await acceptJob(jobId).unwrap();
      // Show success message
    } catch (error) {
      // Show error message
      console.error('Failed to accept job:', error);
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

  const getCategoryIcon = (category: JobCategory) => {
    const icons = {
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
        <h1 className="text-2xl font-bold text-gray-900">Available Jobs</h1>
        <p className="mt-1 text-sm text-gray-500">
          Browse and accept jobs that match your skills
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              value={filters.category || ''}
              onChange={(e) => handleFilterChange({
                category: e.target.value as JobCategory || undefined
              })}
            >
              <option value="">All Categories</option>
              <option value="DELIVERY">Delivery</option>
              <option value="INSTALLATION">Installation</option>
              <option value="MAINTENANCE">Maintenance</option>
              <option value="CLEANING">Cleaning</option>
              <option value="TECH_SUPPORT">Tech Support</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Type
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              value={filters.type || ''}
              onChange={(e) => handleFilterChange({
                type: e.target.value as JobType || undefined
              })}
            >
              <option value="">All Types</option>
              <option value="ONE_TIME">One Time</option>
              <option value="RECURRING">Recurring</option>
              <option value="PROJECT">Project</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Min Budget
            </label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Min amount"
              value={filters.minBudget || ''}
                           onChange={(e) => {
               const value = e.target.value;
               if (value) {
                 handleFilterChange({ minBudget: parseInt(value) });
               } else {
                 const { minBudget, ...rest } = filters;
                 setFilters({ ...rest, page: 1 });
               }
             }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="City, State"
              value={filters.location || ''}
              onChange={(e) => {
               const value = e.target.value;
               if (value) {
                 handleFilterChange({ location: value });
               } else {
                 const { location, ...rest } = filters;
                 setFilters({ ...rest, page: 1 });
               }
             }}
            />
          </div>
        </div>
      </div>

      {/* Job Results */}
      <div className="space-y-4">
        {jobsData?.data?.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900">No jobs found</h3>
              <p className="mt-2 text-sm text-gray-500">
                Try adjusting your filters to see more results.
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
                        <span>Posted {formatDate(job.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4 line-clamp-3">{job.description}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.requirements.slice(0, 3).map((req, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {req}
                      </span>
                    ))}
                    {job.requirements.length > 3 && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        +{job.requirements.length - 3} more
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>📍 {job.location.city}, {job.location.state}</span>
                    <span>⏱️ {job.duration}</span>
                    {job.deadline && (
                      <span>📅 Due {formatDate(job.deadline)}</span>
                    )}
                  </div>
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

                  <Button
                    variant="primary"
                    onClick={() => handleAcceptJob(job.id)}
                    disabled={isAccepting}
                    className="w-full"
                  >
                    {isAccepting ? 'Accepting...' : 'Accept Job'}
                  </Button>
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

export default PartnerJobs; 
import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { jobs, acceptedJobs } from '../data/jobs.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Helper function to apply filters to jobs
const applyJobFilters = (jobList, filters) => {
  let filteredJobs = [...jobList];

  if (filters.category) {
    filteredJobs = filteredJobs.filter(job => job.category === filters.category);
  }

  if (filters.type) {
    filteredJobs = filteredJobs.filter(job => job.type === filters.type);
  }

  if (filters.status) {
    filteredJobs = filteredJobs.filter(job => job.status === filters.status);
  }

  if (filters.minBudget) {
    filteredJobs = filteredJobs.filter(job => job.budget.amount >= parseInt(filters.minBudget));
  }

  if (filters.maxBudget) {
    filteredJobs = filteredJobs.filter(job => job.budget.amount <= parseInt(filters.maxBudget));
  }

  if (filters.location) {
    const locationLower = filters.location.toLowerCase();
    filteredJobs = filteredJobs.filter(job => 
      job.location.city.toLowerCase().includes(locationLower) ||
      job.location.state.toLowerCase().includes(locationLower)
    );
  }

  return filteredJobs;
};

// Helper function to paginate results
const paginateResults = (data, page = 1, limit = 10) => {
  const pageNum = parseInt(page);
  const pageSize = parseInt(limit);
  const startIndex = (pageNum - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  
  return {
    data: data.slice(startIndex, endIndex),
    pagination: {
      page: pageNum,
      limit: pageSize,
      total: data.length,
      totalPages: Math.ceil(data.length / pageSize)
    }
  };
};

// GET /jobs - Get all jobs with filtering and pagination
router.get('/', (req, res) => {
  try {
    const filters = req.query;
    const { page = 1, limit = 10 } = filters;

    // Apply filters
    const filteredJobs = applyJobFilters(jobs, filters);

    // Sort by creation date (newest first)
    filteredJobs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Paginate results
    const result = paginateResults(filteredJobs, page, limit);

    res.json(result);
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch jobs'
    });
  }
});

// GET /my-jobs - Get partner's jobs (moved above the :id route to avoid conflicts)
router.get('/my-jobs', authenticateToken, requireRole(['PARTNER']), (req, res) => {
  try {
    const filters = req.query;
    const { page = 1, limit = 10 } = filters;

    // Get partner's jobs
    let partnerJobs = acceptedJobs.filter(job => job.partnerId === req.user.id);

    // Apply status filter if provided
    if (filters.status) {
      partnerJobs = partnerJobs.filter(job => job.status === filters.status);
    }

    // Sort by updated date (most recent first)
    partnerJobs.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    // Paginate results
    const result = paginateResults(partnerJobs, page, limit);

    res.json(result);
  } catch (error) {
    console.error('Get my jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch your jobs'
    });
  }
});

// GET /jobs/:id - Get job by ID
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const job = jobs.find(j => j.id === id) || acceptedJobs.find(j => j.id === id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    res.json({
      success: true,
      data: job
    });
  } catch (error) {
    console.error('Get job by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch job'
    });
  }
});

// POST /jobs - Create new job (business only)
router.post('/', authenticateToken, requireRole(['BUSINESS']), (req, res) => {
  try {
    const jobData = req.body;
    
    const newJob = {
      id: uuidv4(),
      ...jobData,
      businessId: req.user.id,
      partnerId: null,
      status: 'POSTED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    jobs.push(newJob);

    res.status(201).json({
      success: true,
      data: newJob,
      message: 'Job created successfully'
    });
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create job'
    });
  }
});

// PATCH /jobs/:id - Update job
router.patch('/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const jobIndex = jobs.findIndex(j => j.id === id);
    if (jobIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    const job = jobs[jobIndex];
    
    // Check permissions
    if (req.user.role === 'BUSINESS' && job.businessId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this job'
      });
    }

    // Update job
    jobs[jobIndex] = {
      ...job,
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    res.json({
      success: true,
      data: jobs[jobIndex],
      message: 'Job updated successfully'
    });
  } catch (error) {
    console.error('Update job error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update job'
    });
  }
});

// DELETE /jobs/:id - Delete job
router.delete('/:id', authenticateToken, requireRole(['BUSINESS']), (req, res) => {
  try {
    const { id } = req.params;
    
    const jobIndex = jobs.findIndex(j => j.id === id);
    if (jobIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    const job = jobs[jobIndex];
    
    // Check permissions
    if (job.businessId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this job'
      });
    }

    // Remove job
    jobs.splice(jobIndex, 1);

    res.json({
      success: true,
      message: 'Job deleted successfully'
    });
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete job'
    });
  }
});

// POST /jobs/:id/accept - Accept job (partner only)
router.post('/:id/accept', authenticateToken, requireRole(['PARTNER']), (req, res) => {
  try {
    const { id } = req.params;
    
    const jobIndex = jobs.findIndex(j => j.id === id);
    if (jobIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    const job = jobs[jobIndex];
    
    // Check if job is available
    if (job.status !== 'POSTED') {
      return res.status(400).json({
        success: false,
        message: 'Job is not available for acceptance'
      });
    }

    // Accept the job
    const acceptedJob = {
      ...job,
      partnerId: req.user.id,
      status: 'ASSIGNED',
      updatedAt: new Date().toISOString()
    };

    // Remove from jobs and add to acceptedJobs
    jobs.splice(jobIndex, 1);
    acceptedJobs.push(acceptedJob);

    res.json({
      success: true,
      data: acceptedJob,
      message: 'Job accepted successfully'
    });
  } catch (error) {
    console.error('Accept job error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to accept job'
    });
  }
});

// POST /jobs/:id/cancel - Cancel job
router.post('/:id/cancel', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    
    // Check in accepted jobs first
    let jobIndex = acceptedJobs.findIndex(j => j.id === id);
    let isAcceptedJob = true;
    
    if (jobIndex === -1) {
      jobIndex = jobs.findIndex(j => j.id === id);
      isAcceptedJob = false;
    }

    if (jobIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    const jobArray = isAcceptedJob ? acceptedJobs : jobs;
    const job = jobArray[jobIndex];
    
    // Check permissions
    const canCancel = (req.user.role === 'BUSINESS' && job.businessId === req.user.id) ||
                     (req.user.role === 'PARTNER' && job.partnerId === req.user.id);
    
    if (!canCancel) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this job'
      });
    }

    // Cancel the job
    const cancelledJob = {
      ...job,
      status: 'CANCELLED',
      cancellationReason: reason,
      updatedAt: new Date().toISOString()
    };

    jobArray[jobIndex] = cancelledJob;

    res.json({
      success: true,
      data: cancelledJob,
      message: 'Job cancelled successfully'
    });
  } catch (error) {
    console.error('Cancel job error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel job'
    });
  }
});

// POST /jobs/:id/complete - Complete job (partner only)
router.post('/:id/complete', authenticateToken, requireRole(['PARTNER']), (req, res) => {
  try {
    const { id } = req.params;
    
    const jobIndex = acceptedJobs.findIndex(j => j.id === id);
    if (jobIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    const job = acceptedJobs[jobIndex];
    
    // Check permissions
    if (job.partnerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to complete this job'
      });
    }

    // Check if job can be completed
    if (job.status !== 'ASSIGNED' && job.status !== 'IN_PROGRESS') {
      return res.status(400).json({
        success: false,
        message: 'Job cannot be completed in current status'
      });
    }

    // Complete the job
    acceptedJobs[jobIndex] = {
      ...job,
      status: 'COMPLETED',
      completedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    res.json({
      success: true,
      data: acceptedJobs[jobIndex],
      message: 'Job completed successfully'
    });
  } catch (error) {
    console.error('Complete job error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to complete job'
    });
  }
});

// GET /my-jobs - Get partner's jobs (moved above the :id route to avoid conflicts)
router.get('/my-jobs', authenticateToken, requireRole(['PARTNER']), (req, res) => {
  try {
    const filters = req.query;
    const { page = 1, limit = 10 } = filters;

    // Get partner's jobs
    let partnerJobs = acceptedJobs.filter(job => job.partnerId === req.user.id);

    // Apply status filter if provided
    if (filters.status) {
      partnerJobs = partnerJobs.filter(job => job.status === filters.status);
    }

    // Sort by updated date (most recent first)
    partnerJobs.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    // Paginate results
    const result = paginateResults(partnerJobs, page, limit);

    res.json(result);
  } catch (error) {
    console.error('Get my jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch your jobs'
    });
  }
});

// GET /jobs/:id/partners - Search partners for job (business only)
router.get('/:id/partners', authenticateToken, requireRole(['BUSINESS']), (req, res) => {
  try {
    const { id } = req.params;
    const filters = req.query;
    
    const job = jobs.find(j => j.id === id);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check permissions
    if (job.businessId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view partners for this job'
      });
    }

    // Mock partner search results
    const mockPartners = [
      {
        id: uuidv4(),
        name: 'John Smith',
        rating: 4.8,
        totalJobs: 127,
        skills: ['Installation', 'Delivery', 'Maintenance'],
        location: 'San Francisco, CA',
        distance: '2.3 miles',
        hourlyRate: 35
      },
      {
        id: uuidv4(),
        name: 'Maria Garcia',
        rating: 4.9,
        totalJobs: 203,
        skills: ['Cleaning', 'Delivery', 'Tech Support'],
        location: 'Oakland, CA',
        distance: '5.1 miles',
        hourlyRate: 40
      }
    ];

    const result = paginateResults(mockPartners, filters.page || 1, filters.limit || 10);

    res.json(result);
  } catch (error) {
    console.error('Search partners error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search partners'
    });
  }
});

export default router; 
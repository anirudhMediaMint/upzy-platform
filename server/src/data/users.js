import { v4 as uuidv4 } from 'uuid';

export const users = [
  {
    id: uuidv4(),
    email: 'partner@example.com',
    firstName: 'John',
    lastName: 'Smith',
    phone: '+1-555-0123',
    role: 'PARTNER',
    status: 'ACTIVE',
    createdAt: new Date('2024-01-01').toISOString(),
    updatedAt: new Date().toISOString(),
    skills: ['Installation', 'Delivery', 'Maintenance'],
    experience: 3,
    rating: 4.8,
    totalJobs: 127,
    earnings: {
      today: 0,
      week: 850,
      month: 3200,
      total: 28500
    },
    availability: true,
    location: {
      city: 'San Francisco',
      state: 'CA',
      coordinates: {
        lat: 37.7749,
        lng: -122.4194
      }
    }
  },
  {
    id: uuidv4(),
    email: 'business@example.com',
    firstName: 'Sarah',
    lastName: 'Johnson',
    phone: '+1-555-0456',
    role: 'BUSINESS',
    status: 'ACTIVE',
    createdAt: new Date('2024-01-15').toISOString(),
    updatedAt: new Date().toISOString(),
    companyName: 'TechCorp Solutions',
    industry: 'Technology',
    size: 'MEDIUM',
    address: {
      street: '123 Business Ave',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94105',
      country: 'USA'
    },
    activeJobs: 5,
    totalSpent: 12500
  },
  {
    id: uuidv4(),
    email: 'partner2@example.com',
    firstName: 'Maria',
    lastName: 'Garcia',
    phone: '+1-555-0789',
    role: 'PARTNER',
    status: 'ACTIVE',
    createdAt: new Date('2024-02-01').toISOString(),
    updatedAt: new Date().toISOString(),
    skills: ['Cleaning', 'Delivery', 'Tech Support'],
    experience: 5,
    rating: 4.9,
    totalJobs: 203,
    earnings: {
      today: 120,
      week: 1200,
      month: 4800,
      total: 45200
    },
    availability: true,
    location: {
      city: 'Oakland',
      state: 'CA',
      coordinates: {
        lat: 37.8044,
        lng: -122.2711
      }
    }
  }
]; 
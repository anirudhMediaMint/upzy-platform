import { v4 as uuidv4 } from 'uuid';

export let jobs = [
  {
    id: uuidv4(),
    title: 'Office Equipment Installation',
    description: 'Install new desktop computers, printers, and network equipment in our downtown office. Must have experience with hardware installation and cable management.',
    requirements: [
      'Experience with computer hardware installation',
      'Knowledge of basic networking',
      'Own tools and transportation',
      'Available during business hours'
    ],
    category: 'INSTALLATION',
    type: 'ONE_TIME',
    duration: '4-6 hours',
    budget: {
      amount: 350,
      currency: 'USD',
      type: 'FIXED'
    },
    location: {
      street: '456 Market St',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94105',
      country: 'USA'
    },
    status: 'POSTED',
    businessId: '12345',
    partnerId: null,
    createdAt: new Date('2024-01-20').toISOString(),
    updatedAt: new Date('2024-01-20').toISOString(),
    deadline: new Date('2024-02-15').toISOString()
  },
  {
    id: uuidv4(),
    title: 'Weekly Office Cleaning',
    description: 'Regular cleaning service for a 2,000 sq ft office space. Includes vacuuming, dusting, bathroom cleaning, and trash removal.',
    requirements: [
      'Professional cleaning experience',
      'Own cleaning supplies and equipment',
      'Flexible schedule',
      'Reliable transportation'
    ],
    category: 'CLEANING',
    type: 'RECURRING',
    duration: '2-3 hours weekly',
    budget: {
      amount: 25,
      currency: 'USD',
      type: 'HOURLY'
    },
    location: {
      street: '789 Pine St',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94108',
      country: 'USA'
    },
    status: 'POSTED',
    businessId: '12345',
    partnerId: null,
    createdAt: new Date('2024-01-18').toISOString(),
    updatedAt: new Date('2024-01-18').toISOString(),
    deadline: new Date('2024-02-01').toISOString()
  },
  {
    id: uuidv4(),
    title: 'Same-Day Package Delivery',
    description: 'Urgent delivery of important documents and small packages across the city. Multiple stops required.',
    requirements: [
      'Reliable vehicle',
      'Valid drivers license',
      'Smartphone with GPS',
      'Available immediately'
    ],
    category: 'DELIVERY',
    type: 'ONE_TIME',
    duration: '3-4 hours',
    budget: {
      amount: 120,
      currency: 'USD',
      type: 'FIXED'
    },
    location: {
      street: '321 Bryant St',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94107',
      country: 'USA'
    },
    status: 'POSTED',
    businessId: '12345',
    partnerId: null,
    createdAt: new Date('2024-01-22').toISOString(),
    updatedAt: new Date('2024-01-22').toISOString(),
    deadline: new Date('2024-01-25').toISOString()
  },
  {
    id: uuidv4(),
    title: 'Server Maintenance & Updates',
    description: 'Monthly server maintenance including updates, backups, and performance optimization for small business.',
    requirements: [
      'Linux server administration experience',
      'Knowledge of backup systems',
      'Network security awareness',
      '2+ years experience'
    ],
    category: 'TECH_SUPPORT',
    type: 'RECURRING',
    duration: '2-3 hours monthly',
    budget: {
      amount: 500,
      currency: 'USD',
      type: 'FIXED'
    },
    location: {
      street: '654 Folsom St',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94105',
      country: 'USA'
    },
    status: 'POSTED',
    businessId: '12345',
    partnerId: null,
    createdAt: new Date('2024-01-19').toISOString(),
    updatedAt: new Date('2024-01-19').toISOString(),
    deadline: new Date('2024-02-10').toISOString()
  },
  {
    id: uuidv4(),
    title: 'HVAC System Maintenance',
    description: 'Quarterly maintenance of office HVAC system including filter replacement, duct cleaning, and system inspection.',
    requirements: [
      'HVAC certification or experience',
      'Own tools and equipment',
      'Ability to work at heights',
      'Weekend availability preferred'
    ],
    category: 'MAINTENANCE',
    type: 'RECURRING',
    duration: '4-5 hours quarterly',
    budget: {
      amount: 45,
      currency: 'USD',
      type: 'HOURLY'
    },
    location: {
      street: '987 Howard St',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94103',
      country: 'USA'
    },
    status: 'POSTED',
    businessId: '12345',
    partnerId: null,
    createdAt: new Date('2024-01-17').toISOString(),
    updatedAt: new Date('2024-01-17').toISOString(),
    deadline: new Date('2024-02-28').toISOString()
  },
  {
    id: uuidv4(),
    title: 'Website Migration Support',
    description: 'Help migrate company website to new hosting platform. Includes database transfer, domain setup, and testing.',
    requirements: [
      'Web development experience',
      'Database management knowledge',
      'DNS configuration experience',
      'Problem-solving skills'
    ],
    category: 'TECH_SUPPORT',
    type: 'PROJECT',
    duration: '1-2 weeks',
    budget: {
      amount: 1200,
      currency: 'USD',
      type: 'FIXED'
    },
    location: {
      street: '159 2nd St',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94105',
      country: 'USA'
    },
    status: 'POSTED',
    businessId: '12345',
    partnerId: null,
    createdAt: new Date('2024-01-16').toISOString(),
    updatedAt: new Date('2024-01-16').toISOString(),
    deadline: new Date('2024-03-01').toISOString()
  },
  {
    id: uuidv4(),
    title: 'Event Setup & Breakdown',
    description: 'Setup and breakdown for company quarterly meeting. Includes tables, chairs, AV equipment, and catering setup.',
    requirements: [
      'Event setup experience',
      'Physical ability to lift 50+ lbs',
      'Punctual and reliable',
      'Professional appearance'
    ],
    category: 'OTHER',
    type: 'ONE_TIME',
    duration: '6-8 hours',
    budget: {
      amount: 20,
      currency: 'USD',
      type: 'HOURLY'
    },
    location: {
      street: '753 Mission St',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94103',
      country: 'USA'
    },
    status: 'POSTED',
    businessId: '12345',
    partnerId: null,
    createdAt: new Date('2024-01-21').toISOString(),
    updatedAt: new Date('2024-01-21').toISOString(),
    deadline: new Date('2024-02-05').toISOString()
  }
];

// Some accepted jobs for testing "My Jobs" functionality
export const acceptedJobs = [
  {
    id: uuidv4(),
    title: 'Emergency Printer Repair',
    description: 'Fix jammed printer in accounting department. Urgent repair needed.',
    requirements: [
      'Printer repair experience',
      'Available immediately',
      'Own tools'
    ],
    category: 'MAINTENANCE',
    type: 'ONE_TIME',
    duration: '1-2 hours',
    budget: {
      amount: 85,
      currency: 'USD',
      type: 'FIXED'
    },
    location: {
      street: '246 California St',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94111',
      country: 'USA'
    },
    status: 'ASSIGNED',
    businessId: '12345',
    partnerId: 'partner-123',
    createdAt: new Date('2024-01-15').toISOString(),
    updatedAt: new Date('2024-01-23').toISOString(),
    deadline: new Date('2024-01-24').toISOString()
  },
  {
    id: uuidv4(),
    title: 'Data Entry Project',
    description: 'Enter customer data from paper forms into Excel spreadsheet. About 200 records.',
    requirements: [
      'Excel proficiency',
      'Attention to detail',
      'Data entry experience'
    ],
    category: 'OTHER',
    type: 'PROJECT',
    duration: '2-3 days',
    budget: {
      amount: 15,
      currency: 'USD',
      type: 'HOURLY'
    },
    location: {
      street: '135 Kearny St',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94108',
      country: 'USA'
    },
    status: 'IN_PROGRESS',
    businessId: '12345',
    partnerId: 'partner-123',
    createdAt: new Date('2024-01-10').toISOString(),
    updatedAt: new Date('2024-01-20').toISOString(),
    deadline: new Date('2024-01-30').toISOString()
  }
]; 
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { NavItem } from '../../types';
import AppShell from '../../components/layout/app-shell';
import Card from '../../components/ui/card';

const businessNavigation: NavItem[] = [
  {
    id: 'main',
    label: 'Main',
    children: [
      { id: 'dashboard', label: 'Dashboard', href: '/business/dashboard', icon: '📊' },
      { id: 'jobs', label: 'Post Jobs', href: '/business/jobs', icon: '📝' },
      { id: 'active-jobs', label: 'Active Jobs', href: '/business/active-jobs', icon: '🔄', badge: 3 },
      { id: 'partners', label: 'Partners', href: '/business/partners', icon: '👥' },
      { id: 'payments', label: 'Payments', href: '/business/payments', icon: '💳' },
    ],
  },
  {
    id: 'account',
    label: 'Account',
    children: [
      { id: 'profile', label: 'Company Profile', href: '/business/profile', icon: '🏢' },
      { id: 'settings', label: 'Settings', href: '/business/settings', icon: '⚙️' },
    ],
  },
];

const BusinessDashboard = () => (
  <div className="px-4 sm:px-6 lg:px-8">
    <div className="mb-8">
      <h1 className="text-2xl font-bold text-gray-900">Business Dashboard</h1>
      <p className="mt-1 text-sm text-gray-500">
        Manage your jobs and find skilled partners
      </p>
    </div>

    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <Card title="Active Jobs" subtitle="Currently posted">
        <div className="text-3xl font-bold text-primary-600">5</div>
        <p className="text-sm text-gray-500 mt-1">2 new applications</p>
      </Card>
      
      <Card title="Available Partners" subtitle="In your area">
        <div className="text-3xl font-bold text-green-600">24</div>
        <p className="text-sm text-gray-500 mt-1">12 online now</p>
      </Card>
      
      <Card title="This Month" subtitle="Total spent">
        <div className="text-3xl font-bold text-blue-600">$1,250</div>
        <p className="text-sm text-gray-500 mt-1">3 completed jobs</p>
      </Card>
    </div>

    <div className="mt-8">
      <Card title="Recent Job Posts">
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <p className="font-medium text-gray-900">Office Cleaning Service</p>
              <p className="text-sm text-gray-500">Posted 2 hours ago</p>
            </div>
            <span className="text-sm font-medium text-green-600">3 applications</span>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <p className="font-medium text-gray-900">IT Support Needed</p>
              <p className="text-sm text-gray-500">Posted yesterday</p>
            </div>
            <span className="text-sm text-gray-500">In progress</span>
          </div>
        </div>
      </Card>
    </div>
  </div>
);

const BusinessPages: React.FC = () => {
  return (
    <AppShell navigation={businessNavigation}>
      <Routes>
        <Route path="/dashboard" element={<BusinessDashboard />} />
        <Route path="/" element={<BusinessDashboard />} />
      </Routes>
    </AppShell>
  );
};

export default BusinessPages; 
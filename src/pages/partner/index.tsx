import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { NavItem } from '../../types';
import AppShell from '../../components/layout/app-shell';
import Card from '../../components/ui/card';
import PartnerJobs from './jobs';
import PartnerMyJobs from './my-jobs';
import PartnerEarnings from './earnings';
import PartnerProfile from './profile';
import PartnerSettings from './settings';

const partnerNavigation: NavItem[] = [
  {
    id: 'main',
    label: 'Main',
    children: [
      { id: 'dashboard', label: 'Dashboard', href: '/partner/dashboard', icon: '📊' },
      { id: 'jobs', label: 'Available Jobs', href: '/partner/jobs', icon: '💼', badge: 5 },
      { id: 'my-jobs', label: 'My Jobs', href: '/partner/my-jobs', icon: '✅' },
      { id: 'earnings', label: 'Earnings', href: '/partner/earnings', icon: '💰' },
    ],
  },
  {
    id: 'account',
    label: 'Account',
    children: [
      { id: 'profile', label: 'Profile', href: '/partner/profile', icon: '👤' },
      { id: 'settings', label: 'Settings', href: '/partner/settings', icon: '⚙️' },
    ],
  },
];

const PartnerDashboard = () => (
  <div className="px-4 sm:px-6 lg:px-8">
    <div className="mb-8">
      <h1 className="text-2xl font-bold text-gray-900">Partner Dashboard</h1>
      <p className="mt-1 text-sm text-gray-500">
        Manage your jobs and track your earnings
      </p>
    </div>

    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <Card title="Available Jobs" subtitle="New opportunities">
        <div className="text-3xl font-bold text-primary-600">12</div>
        <p className="text-sm text-gray-500 mt-1">3 new today</p>
      </Card>
      
      <Card title="Active Jobs" subtitle="Currently working">
        <div className="text-3xl font-bold text-green-600">3</div>
        <p className="text-sm text-gray-500 mt-1">2 due this week</p>
      </Card>
      
      <Card title="This Month" subtitle="Total earnings">
        <div className="text-3xl font-bold text-green-600">$2,430</div>
        <p className="text-sm text-gray-500 mt-1">+12% from last month</p>
      </Card>
    </div>

    <div className="mt-8">
      <Card title="Recent Activity">
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <p className="font-medium text-gray-900">Delivery completed</p>
              <p className="text-sm text-gray-500">Coffee shop downtown</p>
            </div>
            <span className="text-sm font-medium text-green-600">+$45</span>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <p className="font-medium text-gray-900">New job assigned</p>
              <p className="text-sm text-gray-500">Tech support - Remote</p>
            </div>
            <span className="text-sm text-gray-500">2 hours ago</span>
          </div>
        </div>
      </Card>
    </div>
  </div>
);

const PartnerPages: React.FC = () => {
  return (
    <AppShell navigation={partnerNavigation}>
      <Routes>
        <Route path="/dashboard" element={<PartnerDashboard />} />
        <Route path="/jobs" element={<PartnerJobs />} />
        <Route path="/my-jobs" element={<PartnerMyJobs />} />
        <Route path="/earnings" element={<PartnerEarnings />} />
        <Route path="/profile" element={<PartnerProfile />} />
        <Route path="/settings" element={<PartnerSettings />} />
        <Route path="/" element={<PartnerDashboard />} />
      </Routes>
    </AppShell>
  );
};

export default PartnerPages; 
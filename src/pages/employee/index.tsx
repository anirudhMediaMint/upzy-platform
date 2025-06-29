import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { NavItem } from '../../types';
import AppShell from '../../components/layout/app-shell';
import Card from '../../components/ui/card';

const employeeNavigation: NavItem[] = [
  {
    id: 'main',
    label: 'Main',
    children: [
      { id: 'dashboard', label: 'Dashboard', href: '/employee/dashboard', icon: '📊' },
      { id: 'schedule', label: 'My Schedule', href: '/employee/schedule', icon: '📅' },
      { id: 'tasks', label: 'Tasks', href: '/employee/tasks', icon: '✅', badge: 2 },
      { id: 'timesheet', label: 'Timesheet', href: '/employee/timesheet', icon: '⏰' },
      { id: 'requests', label: 'Requests', href: '/employee/requests', icon: '📋' },
    ],
  },
  {
    id: 'account',
    label: 'Account',
    children: [
      { id: 'profile', label: 'Profile', href: '/employee/profile', icon: '👤' },
      { id: 'settings', label: 'Settings', href: '/employee/settings', icon: '⚙️' },
    ],
  },
];

const EmployeeDashboard = () => (
  <div className="px-4 sm:px-6 lg:px-8">
    <div className="mb-8">
      <h1 className="text-2xl font-bold text-gray-900">Employee Dashboard</h1>
      <p className="mt-1 text-sm text-gray-500">
        Track your schedule and manage tasks
      </p>
    </div>

    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <Card title="Today's Tasks" subtitle="Pending completion">
        <div className="text-3xl font-bold text-primary-600">4</div>
        <p className="text-sm text-gray-500 mt-1">2 in progress</p>
      </Card>
      
      <Card title="Hours This Week" subtitle="Total logged">
        <div className="text-3xl font-bold text-green-600">32</div>
        <p className="text-sm text-gray-500 mt-1">8 hours remaining</p>
      </Card>
      
      <Card title="Completed Tasks" subtitle="This month">
        <div className="text-3xl font-bold text-blue-600">18</div>
        <p className="text-sm text-gray-500 mt-1">95% completion rate</p>
      </Card>
    </div>

    <div className="mt-8">
      <Card title="Recent Activity">
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <p className="font-medium text-gray-900">Submitted timesheet</p>
              <p className="text-sm text-gray-500">Week ending Dec 15</p>
            </div>
            <span className="text-sm font-medium text-green-600">Approved</span>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <p className="font-medium text-gray-900">Completed task</p>
              <p className="text-sm text-gray-500">Office inventory check</p>
            </div>
            <span className="text-sm text-gray-500">2 hours ago</span>
          </div>
        </div>
      </Card>
    </div>
  </div>
);

const EmployeePages: React.FC = () => {
  return (
    <AppShell navigation={employeeNavigation}>
      <Routes>
        <Route path="/dashboard" element={<EmployeeDashboard />} />
        <Route path="/" element={<EmployeeDashboard />} />
      </Routes>
    </AppShell>
  );
};

export default EmployeePages; 
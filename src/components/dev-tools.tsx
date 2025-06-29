import React from 'react';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { setTestUser, logout } from '../store/auth-slice';
import Button from './ui/button';

const DevTools: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Development Mode Indicator */}
      <div className="mb-2 bg-yellow-100 border border-yellow-400 text-yellow-800 px-3 py-2 rounded-md text-xs">
        🚀 Development Mode: Mock APIs Active
      </div>
      
      {/* Quick User Switcher */}
      <div className="bg-gray-800 text-white p-3 rounded-lg shadow-lg">
        <h4 className="text-xs font-semibold mb-2">Quick Login (Dev Only)</h4>
        <div className="space-y-1">
          <button
            onClick={() => dispatch(setTestUser('PARTNER'))}
            className="block w-full text-left px-2 py-1 text-xs hover:bg-gray-700 rounded"
          >
            🔧 Partner
          </button>
          <button
            onClick={() => dispatch(setTestUser('BUSINESS'))}
            className="block w-full text-left px-2 py-1 text-xs hover:bg-gray-700 rounded"
          >
            🏢 Business
          </button>
          <button
            onClick={() => dispatch(setTestUser('EMPLOYEE'))}
            className="block w-full text-left px-2 py-1 text-xs hover:bg-gray-700 rounded"
          >
            👤 Employee
          </button>
        </div>
      </div>

      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-purple-600 text-white px-3 py-2 rounded-full shadow-lg hover:bg-purple-700 text-sm font-medium"
        >
          🛠️ Dev
        </button>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-64">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Dev Tools</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-500 mb-2">Current User:</p>
              <p className="text-sm font-medium">
                {user ? `${user.firstName} ${user.lastName} (${user.role})` : 'Not logged in'}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-2">Switch User Role:</p>
              <div className="grid grid-cols-1 gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    dispatch(setTestUser('PARTNER'));
                    console.log('Switched to PARTNER role');
                    // Force page reload to ensure state is updated
                    setTimeout(() => window.location.reload(), 100);
                  }}
                  className="text-xs"
                >
                  Partner
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    dispatch(setTestUser('BUSINESS'));
                    console.log('Switched to BUSINESS role');
                    // Force page reload to ensure state is updated
                    setTimeout(() => window.location.reload(), 100);
                  }}
                  className="text-xs"
                >
                  Business
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    dispatch(setTestUser('EMPLOYEE'));
                    console.log('Switched to EMPLOYEE role');
                    // Force page reload to ensure state is updated
                    setTimeout(() => window.location.reload(), 100);
                  }}
                  className="text-xs"
                >
                  Employee
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    dispatch(logout());
                    console.log('Logged out');
                    setTimeout(() => window.location.reload(), 100);
                  }}
                  className="text-xs text-red-600 border-red-300 hover:bg-red-50"
                >
                  Logout
                </Button>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-100">
              <p className="text-xs text-gray-400">
                Development mode only
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DevTools; 
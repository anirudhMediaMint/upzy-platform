import { useAppSelector } from '../hooks/redux';

const DebugAuth: React.FC = () => {
  const authState = useAppSelector((state) => state.auth);

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-20 right-4 z-40 bg-yellow-100 border border-yellow-300 rounded-lg p-3 text-xs max-w-xs">
      <div className="font-semibold text-yellow-800 mb-2">Auth Debug</div>
      <div className="space-y-1 text-yellow-700">
        <div>
          <strong>Authenticated:</strong> {authState.isAuthenticated ? '✅ Yes' : '❌ No'}
        </div>
        <div>
          <strong>User:</strong> {authState.user ? `${authState.user.firstName} ${authState.user.lastName}` : 'None'}
        </div>
        <div>
          <strong>Role:</strong> {authState.user?.role || 'None'}
        </div>
        <div>
          <strong>Token:</strong> {authState.token ? '✅ Present' : '❌ Missing'}
        </div>
        <div>
          <strong>Loading:</strong> {authState.loading ? '⏳ Yes' : '✅ No'}
        </div>
        <div>
          <strong>Error:</strong> {authState.error || 'None'}
        </div>
        <div className="pt-1 border-t border-yellow-300">
          <strong>LocalStorage Token:</strong> {localStorage.getItem('upzy_token') ? '✅ Present' : '❌ Missing'}
        </div>
        <div>
          <strong>LocalStorage User:</strong> {localStorage.getItem('upzy_user') ? '✅ Present' : '❌ Missing'}
        </div>
      </div>
    </div>
  );
};

export default DebugAuth; 
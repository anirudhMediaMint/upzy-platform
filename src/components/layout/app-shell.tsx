import { NavItem } from '../../types';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { toggleSidebar } from '../../store/ui-slice';
import { logout } from '../../store/auth-slice';
import SideNav from './side-nav';
import Header from './header';

interface AppShellProps {
  children: React.ReactNode;
  navigation?: NavItem[];
}

const AppShell: React.FC<AppShellProps> = ({ children, navigation = [] }) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { sidebarOpen } = useAppSelector((state) => state.ui);

  const handleToggleSidebar = () => {
    dispatch(toggleSidebar());
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  if (!user) {
    return null; // This should be handled by ProtectedRoute
  }

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Sidebar */}
      <SideNav
        navigation={navigation}
        isOpen={sidebarOpen}
        onClose={() => dispatch(toggleSidebar())}
      />

      {/* Main content area */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Header */}
        <Header
          user={user}
          onToggleSidebar={handleToggleSidebar}
          onLogout={handleLogout}
        />

        {/* Main content */}
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
          <div className="py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppShell; 
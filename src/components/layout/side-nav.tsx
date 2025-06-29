import { Fragment } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';
import { NavItem } from '../../types';

interface SideNavProps {
  navigation: NavItem[];
  isOpen: boolean;
  onClose: () => void;
}

const SideNav: React.FC<SideNavProps> = ({ navigation, isOpen, onClose }) => {
  const location = useLocation();

  return (
    <Fragment>
      {/* Mobile backdrop */}
      {isOpen && (
        <div className="fixed inset-0 flex z-40 md:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={onClose} />
        </div>
      )}

      {/* Sidebar */}
      <div
        className={clsx(
          'fixed inset-y-0 left-0 flex flex-col w-64 bg-white border-r border-gray-200 z-40 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-0',
          {
            'translate-x-0': isOpen,
            '-translate-x-full': !isOpen,
          }
        )}
      >
        {/* Logo */}
        <div className="flex items-center h-16 flex-shrink-0 px-4 bg-white border-b border-gray-200">
          <h1 className="text-xl font-bold text-primary-600">Upzy</h1>
        </div>

        {/* Navigation */}
        <nav className="mt-5 flex-1 flex flex-col overflow-y-auto">
          <div className="px-2 space-y-1">
            {navigation.map((item) => {
              if (item.children) {
                return (
                  <div key={item.id} className="space-y-1">
                    <div className="text-gray-500 text-xs font-semibold uppercase tracking-wide px-3 py-2">
                      {item.label}
                    </div>
                    {item.children.map((subItem) => (
                      <Link
                        key={subItem.id}
                        to={subItem.href}
                        className={clsx(
                          location.pathname === subItem.href
                            ? 'nav-link-active'
                            : 'nav-link-inactive',
                          'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                        )}
                      >
                        {subItem.icon && (
                          <span className="mr-3 flex-shrink-0 h-5 w-5">{subItem.icon}</span>
                        )}
                        {subItem.label}
                        {subItem.badge && (
                          <span className="ml-auto inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                            {subItem.badge}
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                );
              }

              return (
                <Link
                  key={item.id}
                  to={item.href || '#'}
                  className={clsx(
                    location.pathname === item.href
                      ? 'nav-link-active'
                      : 'nav-link-inactive',
                    'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                  )}
                >
                  {item.icon && (
                    <span className="mr-3 flex-shrink-0 h-5 w-5">{item.icon}</span>
                  )}
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </Fragment>
  );
};

export default SideNav; 
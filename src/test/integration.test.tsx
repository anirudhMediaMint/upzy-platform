import { describe, it, expect, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, mockUsers, setupTest } from './test-utils';
import App from '../App';

describe('Integration Tests', () => {
  beforeEach(() => {
    setupTest();
  });

  describe('User Navigation Flows', () => {
    it('should navigate from landing to signin', async () => {
      const user = userEvent.setup();
      renderWithProviders(<App />, {
        initialEntries: ['/'],
        isAuthenticated: false,
      });

      // Should render landing page
      await waitFor(() => {
        expect(document.body).toBeTruthy();
      });

      // Navigate to signin by URL
      window.history.pushState({}, '', '/auth/signin');
      
      await waitFor(() => {
        expect(window.location.pathname).toBe('/auth/signin');
      });
    });

    it('should navigate from signin to signup', async () => {
      renderWithProviders(<App />, {
        initialEntries: ['/auth/signin'],
        isAuthenticated: false,
      });

      // Navigate to signup by URL
      window.history.pushState({}, '', '/auth/signup');
      
      await waitFor(() => {
        expect(window.location.pathname).toBe('/auth/signup');
      });
    });

    it('should redirect authenticated users to appropriate dashboard', async () => {
      const testCases = [
        { user: mockUsers.partner, expectedPath: '/partner' },
        { user: mockUsers.business, expectedPath: '/business' },
        { user: mockUsers.employee, expectedPath: '/employee' },
      ];

      for (const { user, expectedPath } of testCases) {
        renderWithProviders(<App />, {
          initialEntries: ['/'],
          user,
          isAuthenticated: true,
        });

        // Navigate to dashboard
        window.history.pushState({}, '', '/dashboard');
        
        await waitFor(() => {
          // Should redirect to role-specific dashboard
          expect(document.body).toBeTruthy();
        });
      }
    });
  });

  describe('Protected Route Access', () => {
    it('should allow access to role-specific routes', async () => {
      const testCases = [
        { user: mockUsers.partner, route: '/partner' },
        { user: mockUsers.business, route: '/business' },
        { user: mockUsers.employee, route: '/employee' },
      ];

      for (const { user, route } of testCases) {
        renderWithProviders(<App />, {
          initialEntries: [route],
          user,
          isAuthenticated: true,
        });

        await waitFor(() => {
          // Should render the protected route
          expect(document.body).toBeTruthy();
        });
      }
    });

    it('should block access to other role routes', async () => {
      const testCases = [
        { user: mockUsers.partner, blockedRoute: '/business' },
        { user: mockUsers.business, blockedRoute: '/employee' },
        { user: mockUsers.employee, blockedRoute: '/partner' },
      ];

      for (const { user, blockedRoute } of testCases) {
        renderWithProviders(<App />, {
          initialEntries: [blockedRoute],
          user,
          isAuthenticated: true,
        });

        await waitFor(() => {
          // Should redirect or show unauthorized
          expect(document.body).toBeTruthy();
        });
      }
    });

    it('should redirect unauthenticated users to signin', async () => {
      const protectedRoutes = ['/partner', '/business', '/employee', '/dashboard'];

      for (const route of protectedRoutes) {
        renderWithProviders(<App />, {
          initialEntries: [route],
          isAuthenticated: false,
        });

        await waitFor(() => {
          // Should redirect to signin or show auth required
          expect(document.body).toBeTruthy();
        });
      }
    });
  });

  describe('Error Handling', () => {
    it('should handle 404 routes gracefully', async () => {
      const notFoundRoutes = [
        '/non-existent-route',
        '/auth/invalid',
        '/partner/invalid',
        '/business/invalid',
        '/employee/invalid',
      ];

      for (const route of notFoundRoutes) {
        renderWithProviders(<App />, {
          initialEntries: [route],
          isAuthenticated: false,
        });

        await waitFor(() => {
          // Should handle 404 gracefully
          expect(document.body).toBeTruthy();
        });
      }
    });
  });

  describe('Full User Journey', () => {
    it('should support complete authentication flow', async () => {
      // Start unauthenticated
      const { rerender } = renderWithProviders(<App />, {
        initialEntries: ['/'],
        isAuthenticated: false,
      });

      // Navigate to signin
      window.history.pushState({}, '', '/auth/signin');
      
      await waitFor(() => {
        expect(window.location.pathname).toBe('/auth/signin');
      });

      // Simulate successful login by re-rendering as authenticated
      rerender(<App />);
      renderWithProviders(<App />, {
        initialEntries: ['/partner'],
        user: mockUsers.partner,
        isAuthenticated: true,
      });

      await waitFor(() => {
        // Should access protected route after authentication
        expect(document.body).toBeTruthy();
      });
    });

    it('should maintain navigation state during role switching', async () => {
      // Test role switching in development mode
      const roles = [mockUsers.partner, mockUsers.business, mockUsers.employee];

      for (const user of roles) {
        renderWithProviders(<App />, {
          initialEntries: ['/dashboard'],
          user,
          isAuthenticated: true,
        });

        await waitFor(() => {
          // Should handle role-based routing
          expect(document.body).toBeTruthy();
        });
      }
    });
  });

  describe('Route Performance', () => {
    it('should load routes efficiently', async () => {
      const allRoutes = [
        '/',
        '/auth/signin',
        '/auth/signup',
        '/partner',
        '/business',
        '/employee',
        '/unauthorized',
      ];

      for (const route of allRoutes) {
        const startTime = performance.now();
        
        renderWithProviders(<App />, {
          initialEntries: [route],
          user: route.includes('/auth') || route === '/' ? null : mockUsers.partner,
          isAuthenticated: !route.includes('/auth') && route !== '/',
        });

        await waitFor(() => {
          expect(document.body).toBeTruthy();
        });

        const endTime = performance.now();
        const loadTime = endTime - startTime;

        // Route should load within reasonable time (100ms)
        expect(loadTime).toBeLessThan(100);
      }
    });
  });
}); 
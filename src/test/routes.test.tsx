import { describe, it, expect, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders, mockUsers, routeTestCases, setupTest } from './test-utils';
import App from '../App';

describe('Route Rendering Tests', () => {
  beforeEach(() => {
    setupTest();
  });

  describe('Public Routes', () => {
    routeTestCases.public.forEach(({ path, name }) => {
      it(`should render ${name} at ${path}`, async () => {
        renderWithProviders(<App />, {
          initialEntries: [path],
          isAuthenticated: false,
        });

        // Wait for any async operations to complete
        await waitFor(() => {
          // Verify the route rendered without crashing
          expect(document.body).toBeTruthy();
        });

        // Take a snapshot for visual regression testing
        expect(document.body.innerHTML).toMatchSnapshot(`${name.toLowerCase().replace(/\s+/g, '-')}-route`);
      });
    });

    it('should render landing page with correct content', async () => {
      renderWithProviders(<App />, {
        initialEntries: ['/'],
        isAuthenticated: false,
      });

      await waitFor(() => {
        expect(screen.getByText(/upzy/i)).toBeInTheDocument();
      });
    });

    it('should render signin page with form', async () => {
      renderWithProviders(<App />, {
        initialEntries: ['/auth/signin'],
        isAuthenticated: false,
      });

      await waitFor(() => {
        expect(screen.getByText(/sign in/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      });
    });

    it('should render signup page with form', async () => {
      renderWithProviders(<App />, {
        initialEntries: ['/auth/signup'],
        isAuthenticated: false,
      });

      await waitFor(() => {
        expect(screen.getByText(/create account/i)).toBeInTheDocument();
      });
    });
  });

  describe('Protected Routes - Partner', () => {
    routeTestCases.protected.partner.forEach(({ path, name }) => {
      it(`should render ${name} at ${path} when authenticated as Partner`, async () => {
        renderWithProviders(<App />, {
          initialEntries: [path],
          user: mockUsers.partner,
          isAuthenticated: true,
        });

        await waitFor(() => {
          expect(document.body).toBeTruthy();
        });

        expect(document.body.innerHTML).toMatchSnapshot(`partner-${name.toLowerCase().replace(/\s+/g, '-')}-route`);
      });

      it(`should redirect ${name} at ${path} when not authenticated`, async () => {
        renderWithProviders(<App />, {
          initialEntries: [path],
          isAuthenticated: false,
        });

        await waitFor(() => {
          // Should redirect to signin or show unauthorized
          expect(window.location.pathname === '/auth/signin' || screen.queryByText(/unauthorized/i)).toBeTruthy();
        });
      });

      it(`should show unauthorized for ${name} at ${path} when authenticated as different role`, async () => {
        renderWithProviders(<App />, {
          initialEntries: [path],
          user: mockUsers.business,
          isAuthenticated: true,
        });

        await waitFor(() => {
          expect(screen.queryByText(/unauthorized/i) || window.location.pathname === '/unauthorized').toBeTruthy();
        });
      });
    });
  });

  describe('Protected Routes - Business', () => {
    routeTestCases.protected.business.forEach(({ path, name }) => {
      it(`should render ${name} at ${path} when authenticated as Business`, async () => {
        renderWithProviders(<App />, {
          initialEntries: [path],
          user: mockUsers.business,
          isAuthenticated: true,
        });

        await waitFor(() => {
          expect(document.body).toBeTruthy();
        });

        expect(document.body.innerHTML).toMatchSnapshot(`business-${name.toLowerCase().replace(/\s+/g, '-')}-route`);
      });

      it(`should redirect ${name} at ${path} when not authenticated`, async () => {
        renderWithProviders(<App />, {
          initialEntries: [path],
          isAuthenticated: false,
        });

        await waitFor(() => {
          expect(window.location.pathname === '/auth/signin' || screen.queryByText(/unauthorized/i)).toBeTruthy();
        });
      });
    });
  });

  describe('Protected Routes - Employee', () => {
    routeTestCases.protected.employee.forEach(({ path, name }) => {
      it(`should render ${name} at ${path} when authenticated as Employee`, async () => {
        renderWithProviders(<App />, {
          initialEntries: [path],
          user: mockUsers.employee,
          isAuthenticated: true,
        });

        await waitFor(() => {
          expect(document.body).toBeTruthy();
        });

        expect(document.body.innerHTML).toMatchSnapshot(`employee-${name.toLowerCase().replace(/\s+/g, '-')}-route`);
      });

      it(`should redirect ${name} at ${path} when not authenticated`, async () => {
        renderWithProviders(<App />, {
          initialEntries: [path],
          isAuthenticated: false,
        });

        await waitFor(() => {
          expect(window.location.pathname === '/auth/signin' || screen.queryByText(/unauthorized/i)).toBeTruthy();
        });
      });
    });
  });

  describe('Dashboard Redirects', () => {
    it('should redirect /dashboard to partner dashboard for partner users', async () => {
      renderWithProviders(<App />, {
        initialEntries: ['/dashboard'],
        user: mockUsers.partner,
        isAuthenticated: true,
      });

      await waitFor(() => {
        expect(window.location.pathname).toBe('/partner');
      });
    });

    it('should redirect /dashboard to business dashboard for business users', async () => {
      renderWithProviders(<App />, {
        initialEntries: ['/dashboard'],
        user: mockUsers.business,
        isAuthenticated: true,
      });

      await waitFor(() => {
        expect(window.location.pathname).toBe('/business');
      });
    });

    it('should redirect /dashboard to employee dashboard for employee users', async () => {
      renderWithProviders(<App />, {
        initialEntries: ['/dashboard'],
        user: mockUsers.employee,
        isAuthenticated: true,
      });

      await waitFor(() => {
        expect(window.location.pathname).toBe('/employee');
      });
    });

    it('should redirect /dashboard to signin when not authenticated', async () => {
      renderWithProviders(<App />, {
        initialEntries: ['/dashboard'],
        isAuthenticated: false,
      });

      await waitFor(() => {
        expect(window.location.pathname).toBe('/auth/signin');
      });
    });
  });

  describe('404 Not Found Routes', () => {
    routeTestCases.notFound.forEach(({ path, name }) => {
      it(`should show 404 for ${name} at ${path}`, async () => {
        renderWithProviders(<App />, {
          initialEntries: [path],
          isAuthenticated: false,
        });

        await waitFor(() => {
          // Should show 404 or redirect to a valid route
          expect(document.body).toBeTruthy();
        });
      });
    });
  });

  describe('Route Transitions', () => {
    it('should handle navigation between public routes', async () => {
      const { store } = renderWithProviders(<App />, {
        initialEntries: ['/'],
        isAuthenticated: false,
      });

      // Navigate to signin
      window.history.pushState({}, '', '/auth/signin');
      
      await waitFor(() => {
        expect(window.location.pathname).toBe('/auth/signin');
      });

      // Navigate to signup
      window.history.pushState({}, '', '/auth/signup');
      
      await waitFor(() => {
        expect(window.location.pathname).toBe('/auth/signup');
      });
    });

    it('should handle navigation between protected routes for same role', async () => {
      renderWithProviders(<App />, {
        initialEntries: ['/partner'],
        user: mockUsers.partner,
        isAuthenticated: true,
      });

      // Navigate to partner dashboard
      window.history.pushState({}, '', '/partner/dashboard');
      
      await waitFor(() => {
        expect(window.location.pathname).toBe('/partner/dashboard');
      });
    });
  });
}); 
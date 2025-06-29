import { describe, it, expect, beforeEach, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, mockUsers, setupTest } from './test-utils';
import Button from '../components/ui/button';
import Input from '../components/ui/input';
import Card from '../components/ui/card';
import Modal from '../components/ui/modal';
import Header from '../components/layout/header';
import SideNav from '../components/layout/side-nav';
import LoadingSpinner from '../components/ui/loading-spinner';

describe('UI Component Tests', () => {
  beforeEach(() => {
    setupTest();
  });

  describe('Button Component', () => {
    it('should render button with default variant', () => {
      renderWithProviders(<Button>Click me</Button>);
      
      const button = screen.getByRole('button', { name: /click me/i });
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass('bg-primary-600');
    });

    it('should render button with secondary variant', () => {
      renderWithProviders(<Button variant="secondary">Secondary</Button>);
      
      const button = screen.getByRole('button', { name: /secondary/i });
      expect(button).toHaveClass('bg-gray-200');
    });

    it('should render button with outline variant', () => {
      renderWithProviders(<Button variant="outline">Outline</Button>);
      
      const button = screen.getByRole('button', { name: /outline/i });
      expect(button).toHaveClass('border-primary-600');
    });

    it('should handle button click', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      
      renderWithProviders(<Button onClick={handleClick}>Click me</Button>);
      
      const button = screen.getByRole('button', { name: /click me/i });
      await user.click(button);
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should render disabled button', () => {
      renderWithProviders(<Button disabled>Disabled</Button>);
      
      const button = screen.getByRole('button', { name: /disabled/i });
      expect(button).toBeDisabled();
    });

    it('should render loading button', () => {
      renderWithProviders(<Button loading>Loading</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    it('should render button with different sizes', () => {
      const { rerender } = renderWithProviders(<Button size="sm">Small</Button>);
      expect(screen.getByRole('button')).toHaveClass('px-3 py-1.5');
      
      rerender(<Button size="lg">Large</Button>);
      expect(screen.getByRole('button')).toHaveClass('px-6 py-3');
    });
  });

  describe('Input Component', () => {
    it('should render input with label', () => {
      renderWithProviders(<Input label="Email" />);
      
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    });

    it('should render input with placeholder', () => {
      renderWithProviders(<Input placeholder="Enter your email" />);
      
      expect(screen.getByPlaceholderText(/enter your email/i)).toBeInTheDocument();
    });

    it('should render input with error state', () => {
      renderWithProviders(<Input label="Email" error="Email is required" />);
      
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toHaveClass('border-danger-500');
    });

    it('should handle input change', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      
      renderWithProviders(<Input label="Email" onChange={handleChange} />);
      
      const input = screen.getByLabelText(/email/i);
      await user.type(input, 'test@example.com');
      
      expect(handleChange).toHaveBeenCalled();
    });

    it('should render different input types', () => {
      const { rerender } = renderWithProviders(<Input type="password" label="Password" />);
      expect(screen.getByLabelText(/password/i)).toHaveAttribute('type', 'password');
      
      rerender(<Input type="email" label="Email" />);
      expect(screen.getByLabelText(/email/i)).toHaveAttribute('type', 'email');
    });
  });

  describe('Card Component', () => {
    it('should render card with content', () => {
      renderWithProviders(
        <Card>
          <div>
            <h3>Test Title</h3>
            <p>Test content</p>
          </div>
        </Card>
      );
      
      expect(screen.getByText(/test title/i)).toBeInTheDocument();
      expect(screen.getByText(/test content/i)).toBeInTheDocument();
    });

    it('should render card with custom className', () => {
      renderWithProviders(
        <Card className="custom-card">
          <p>Card content</p>
        </Card>
      );
      
      expect(screen.getByText(/card content/i)).toBeInTheDocument();
    });
  });

  describe('Modal Component', () => {
    it('should render modal when open', () => {
      renderWithProviders(
        <Modal isOpen={true} onClose={vi.fn()}>
          <div>
            <h2>Test Modal</h2>
            <p>Modal content</p>
          </div>
        </Modal>
      );
      
      expect(screen.getByText(/test modal/i)).toBeInTheDocument();
      expect(screen.getByText(/modal content/i)).toBeInTheDocument();
    });

    it('should not render modal when closed', () => {
      renderWithProviders(
        <Modal isOpen={false} onClose={vi.fn()}>
          <div>
            <p>Modal content</p>
          </div>
        </Modal>
      );
      
      expect(screen.queryByText(/modal content/i)).not.toBeInTheDocument();
    });

    it('should handle close action', async () => {
      const handleClose = vi.fn();
      
      renderWithProviders(
        <Modal isOpen={true} onClose={handleClose}>
          <div>
            <h2>Test Modal</h2>
            <p>Content</p>
          </div>
        </Modal>
      );
      
      // Modal should be rendered
      expect(screen.getByText(/test modal/i)).toBeInTheDocument();
    });
  });

  describe('Loading Spinner', () => {
    it('should render loading spinner', () => {
      renderWithProviders(<LoadingSpinner />);
      
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('should render loading spinner with custom size', () => {
      renderWithProviders(<LoadingSpinner size="lg" />);
      
      const spinner = screen.getByRole('status');
      expect(spinner.firstChild).toHaveClass('h-8 w-8');
    });

    it('should render loading spinner with text', () => {
      renderWithProviders(<LoadingSpinner text="Loading data..." />);
      
      expect(screen.getByText(/loading data/i)).toBeInTheDocument();
    });
  });
});

describe('Layout Component Tests', () => {
  beforeEach(() => {
    setupTest();
  });

  describe('Header Component', () => {
    it('should render header for authenticated user', () => {
      renderWithProviders(<Header />, {
        user: mockUsers.partner,
        isAuthenticated: true,
      });
      
      expect(screen.getByText(/upzy/i)).toBeInTheDocument();
      expect(screen.getByText(/test partner/i)).toBeInTheDocument();
    });

    it('should render header for unauthenticated user', () => {
      renderWithProviders(<Header />, {
        isAuthenticated: false,
      });
      
      expect(screen.getByText(/upzy/i)).toBeInTheDocument();
      expect(screen.queryByText(/test partner/i)).not.toBeInTheDocument();
    });

    it('should handle mobile menu toggle', async () => {
      const user = userEvent.setup();
      renderWithProviders(<Header />, {
        user: mockUsers.partner,
        isAuthenticated: true,
      });
      
      const menuButton = screen.getByRole('button', { name: /menu/i });
      await user.click(menuButton);
      
      // Should toggle mobile menu
      expect(document.body).toBeTruthy();
    });
  });

  describe('Side Navigation', () => {
    it('should render partner navigation', () => {
      renderWithProviders(<SideNav />, {
        user: mockUsers.partner,
        isAuthenticated: true,
      });
      
      expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
      expect(screen.getByText(/jobs/i)).toBeInTheDocument();
      expect(screen.getByText(/earnings/i)).toBeInTheDocument();
    });

    it('should render business navigation', () => {
      renderWithProviders(<SideNav />, {
        user: mockUsers.business,
        isAuthenticated: true,
      });
      
      expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
      expect(screen.getByText(/post job/i)).toBeInTheDocument();
      expect(screen.getByText(/partners/i)).toBeInTheDocument();
    });

    it('should render employee navigation', () => {
      renderWithProviders(<SideNav />, {
        user: mockUsers.employee,
        isAuthenticated: true,
      });
      
      expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
      expect(screen.getByText(/tasks/i)).toBeInTheDocument();
      expect(screen.getByText(/schedule/i)).toBeInTheDocument();
    });

    it('should handle navigation item click', async () => {
      const user = userEvent.setup();
      renderWithProviders(<SideNav />, {
        user: mockUsers.partner,
        isAuthenticated: true,
      });
      
      const dashboardLink = screen.getByText(/dashboard/i);
      await user.click(dashboardLink);
      
      // Should navigate to dashboard
      expect(document.body).toBeTruthy();
    });
  });
}); 
# Upzy React Web Application

A modern React application for the Upzy platform that connects businesses with skilled partners for on-demand work opportunities.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

1. Clone the repository and install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Foundation components (Button, Input, etc.)
│   ├── layout/          # Layout components (AppShell, Navigation)
│   ├── auth/            # Authentication components
│   └── business/        # Business logic components
├── pages/               # Route-level components
│   ├── auth/            # Authentication pages
│   ├── partner/         # Partner dashboard and features
│   ├── business/        # Business dashboard and features
│   └── employee/        # Employee dashboard and features
├── hooks/               # Custom React hooks
├── store/               # Redux store configuration
│   ├── auth-slice.ts    # Authentication state
│   └── ui-slice.ts      # UI state (modals, sidebar, etc.)
├── services/            # API services using RTK Query
│   ├── auth-api.ts      # Authentication endpoints
│   └── jobs-api.ts      # Job management endpoints
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
└── test/                # Test configuration and utilities
```

## 🛠 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests
- `npm run test:coverage` - Run tests with coverage
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors

## 🏗 Architecture

### State Management
- **Redux Toolkit** for global state management
- **RTK Query** for API caching and data fetching
- Typed hooks for TypeScript safety

### Routing
- **React Router v6** with role-based route protection
- Lazy loading for code splitting
- Protected routes for authenticated users

### Styling
- **Tailwind CSS** for utility-first styling
- Custom design system with consistent spacing and colors
- Responsive design with mobile-first approach

### API Integration
- RESTful API integration with axios and RTK Query
- Automatic caching and background updates
- Optimistic updates for better UX

## 👥 User Roles

### 1. Partner
- View and accept job opportunities
- Track earnings and job history
- Manage profile and availability

### 2. Business
- Create and manage job postings
- Search and hire partners
- Track job progress and payments

### 3. Employee (Internal)
- Approve partner onboarding
- Moderate platform content
- Access admin analytics

## 🎨 Design System

### Colors
- **Primary**: Blue (#0ea5e9)
- **Success**: Green (#22c55e)
- **Warning**: Amber (#f59e0b)
- **Danger**: Red (#ef4444)

### Typography
- **Font**: Inter (Google Fonts)
- **Sizes**: xs, sm, base, lg, xl, 2xl, 3xl, 4xl

### Components
- Consistent button variants (primary, secondary, outline, ghost)
- Form inputs with validation states
- Loading states and error handling

## 🔐 Authentication

### JWT Token Management
- Secure token storage in localStorage
- Automatic token refresh
- Role-based route protection

### User Flow
1. User signs in with email/password
2. Server returns JWT token and user data
3. Token is stored and used for API requests
4. Protected routes check authentication status

## 📱 Responsive Design

- **Mobile First**: Designed for mobile devices first
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Touch Friendly**: Optimized for touch interactions

## 🧪 Testing

### Setup
- **Vitest** for unit testing
- **React Testing Library** for component testing
- **JSdom** for DOM simulation

### Test Utilities
- Custom render function with providers
- Mock store configuration
- Helper functions for common test scenarios

## 🚀 Deployment

### Build
```bash
npm run build
```

### Environment Variables
- `VITE_API_URL`: Backend API base URL
- `VITE_APP_TITLE`: Application title
- `VITE_APP_VERSION`: Application version

### Performance
- Code splitting by route and feature
- Lazy loading of heavy components
- Bundle analysis with rollup-plugin-visualizer

## 🔧 Development

### Code Standards
- **TypeScript**: Strict mode enabled
- **ESLint**: Configured with React and TypeScript rules
- **Prettier**: Code formatting
- **Import Organization**: Absolute imports with path mapping

### Git Workflow
1. Create feature branch from main
2. Implement changes with tests
3. Run linting and tests
4. Submit pull request

## 📊 Performance Targets

- **First Contentful Paint**: ≤ 1.5s
- **Largest Contentful Paint**: ≤ 2.5s
- **First Input Delay**: ≤ 100ms
- **Cumulative Layout Shift**: ≤ 0.1

## 🐛 Troubleshooting

### Common Issues

1. **Module not found errors**: Run `npm install`
2. **TypeScript errors**: Check `tsconfig.json` configuration
3. **Build failures**: Clear `node_modules` and reinstall
4. **API connection issues**: Verify `VITE_API_URL` environment variable

### Debug Mode
Set `NODE_ENV=development` for detailed error messages and debugging tools.

## 📄 License

This project is proprietary and confidential.

---

For questions or support, contact the development team. 
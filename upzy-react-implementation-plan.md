# Upzy React UI - Implementation Plan

## 1. Project Setup & Structure

### 1.1 Initial Setup

**1. Create Project**
```bash
npm create vite@latest upzy-web -- --template react-ts
cd upzy-web
npm install
```

**2. Install Dependencies**
```bash
# Core dependencies
npm install @reduxjs/toolkit react-redux react-router-dom
npm install tailwindcss @tailwindcss/forms lucide-react
npm install react-hook-form @hookform/resolvers zod
npm install axios date-fns clsx

# Dev dependencies  
npm install -D @types/node eslint-config-prettier prettier
npm install -D @testing-library/react @testing-library/jest-dom
npm install -D @testing-library/user-event vitest jsdom
```

**3. Configure Tailwind CSS**
```bash
npx tailwindcss init -p
```

### 1.2 Project Structure
```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Foundation components
│   ├── layout/          # Layout components  
│   ├── data/            # Data display components
│   ├── forms/           # Form components
│   └── business/        # Business logic components
├── pages/               # Route-level components
│   ├── auth/
│   ├── partner/
│   ├── business/
│   └── employee/
├── hooks/               # Custom React hooks
├── store/               # Redux store & slices
├── services/            # API services (RTK Query)
├── types/               # TypeScript types
├── utils/               # Utility functions
├── constants/           # App constants
└── App.tsx
```

## 2. Implementation Phases

### Phase 1: Foundation (Week 1)
- Project setup and configuration
- Design system implementation
- Foundation components
- Basic routing structure

### Phase 2: Authentication & Layout (Week 2)  
- Authentication system
- Layout components
- Route protection
- User context

### Phase 3: Core Features (Weeks 3-4)
- Partner dashboard and job listings
- Business dashboard and job creation
- Employee approval workflows

### Phase 4: Integration & Polish (Week 5)
- API integration
- Error handling
- Performance optimization
- Testing

## 3. Component Implementation Order

### 3.1 Foundation Components (Priority 1)

**Button Component**
```typescript
// src/components/ui/button.tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}
```

**Input Component**
```typescript
// src/components/ui/input.tsx
interface InputProps {
  type?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
```

**Card Component**
```typescript
// src/components/ui/card.tsx
interface CardProps {
  title?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}
```

### 3.2 Layout Components (Priority 2)

**AppShell**
```typescript
// src/components/layout/app-shell.tsx
interface AppShellProps {
  user: User;
  navigation: NavItem[];
  children: React.ReactNode;
}
```

**SideNav**
```typescript
// src/components/layout/side-nav.tsx
interface SideNavProps {
  links: NavLink[];
  currentPath: string;
}
```

### 3.3 Business Components (Priority 3)

**JobCard**
```typescript
// src/components/business/job-card.tsx
interface JobCardProps {
  job: Job;
  onAccept?: (jobId: string) => void;
  variant?: 'list' | 'grid';
}
```

**EarningsWidget**
```typescript
// src/components/business/earnings-widget.tsx
interface EarningsWidgetProps {
  amount: number;
  period: 'today' | 'week' | 'month';
  trend?: number;
}
```

## 4. State Management Setup

### 4.1 Redux Store Configuration
```typescript
// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import { authApi } from '../services/auth-api';
import { jobsApi } from '../services/jobs-api';
import authSlice from './auth-slice';
import uiSlice from './ui-slice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    ui: uiSlice,
    [authApi.reducerPath]: authApi.reducer,
    [jobsApi.reducerPath]: jobsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      jobsApi.middleware
    ),
});
```

### 4.2 Auth Slice
```typescript
// src/store/auth-slice.ts
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: false,
};
```

### 4.3 RTK Query APIs
```typescript
// src/services/jobs-api.ts
export const jobsApi = createApi({
  reducerPath: 'jobsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/v1/jobs',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Job'],
  endpoints: (builder) => ({
    getJobs: builder.query<Job[], JobFilters>({
      query: (filters) => ({
        url: '/',
        params: filters,
      }),
      providesTags: ['Job'],
    }),
    acceptJob: builder.mutation<void, string>({
      query: (jobId) => ({
        url: `/${jobId}/accept`,
        method: 'POST',
      }),
      invalidatesTags: ['Job'],
    }),
  }),
});
```

## 5. Routing & Authentication

### 5.1 Router Setup
```typescript
// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './components/auth/protected-route';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth/*" element={<AuthPages />} />
        <Route
          path="/partner/*"
          element={
            <ProtectedRoute roles={['PARTNER']}>
              <PartnerPages />
            </ProtectedRoute>
          }
        />
        <Route
          path="/business/*"
          element={
            <ProtectedRoute roles={['BUSINESS']}>
              <BusinessPages />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee/*"
          element={
            <ProtectedRoute roles={['EMPLOYEE']}>
              <EmployeePages />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
```

### 5.2 Protected Route Component
```typescript
// src/components/auth/protected-route.tsx
interface ProtectedRouteProps {
  children: React.ReactNode;
  roles: string[];
}

export const ProtectedRoute: FC<ProtectedRouteProps> = ({ 
  children, 
  roles 
}) => {
  const { user, isAuthenticated } = useAppSelector(state => state.auth);
  
  if (!isAuthenticated) {
    return <Navigate to="/auth/signin" />;
  }
  
  if (!roles.includes(user?.role)) {
    return <Navigate to="/unauthorized" />;
  }
  
  return <>{children}</>;
};
```

## 6. Page Implementation

### 6.1 Partner Dashboard
```typescript
// src/pages/partner/dashboard.tsx
export const PartnerDashboard: FC = () => {
  const { data: earnings } = useGetEarningsQuery();
  const { data: jobs } = useGetJobsQuery({ limit: 5 });
  
  return (
    <AppShell user={user} navigation={partnerNavigation}>
      <Container>
        <div className="space-y-6">
          <EarningsWidget 
            amount={earnings?.today || 0}
            period="today"
            trend={earnings?.trend}
          />
          
          <Card title="Recent Jobs">
            <DataTable 
              columns={jobColumns}
              data={jobs || []}
              onRowClick={(job) => navigate(`/partner/jobs/${job.id}`)}
            />
          </Card>
          
          <div className="flex gap-4">
            <Button 
              variant="primary"
              onClick={() => navigate('/partner/jobs')}
            >
              View All Jobs
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate('/partner/profile')}
            >
              Update Profile
            </Button>
          </div>
        </div>
      </Container>
    </AppShell>
  );
};
```

### 6.2 Business Job Creation
```typescript
// src/pages/business/job-create.tsx
export const JobCreate: FC = () => {
  const [createJob] = useCreateJobMutation();
  const navigate = useNavigate();
  
  const handleSubmit = async (data: JobFormData) => {
    try {
      await createJob(data).unwrap();
      navigate('/business/jobs');
    } catch (error) {
      // Handle error
    }
  };
  
  return (
    <AppShell user={user} navigation={businessNavigation}>
      <Container>
        <Card title="Create New Job">
          <JobForm onSubmit={handleSubmit} />
        </Card>
      </Container>
    </AppShell>
  );
};
```

## 7. Testing Strategy

### 7.1 Test Setup
```typescript
// src/test/setup.ts
import '@testing-library/jest-dom';
import { configureStore } from '@reduxjs/toolkit';
import { render as rtlRender } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

// Custom render function with providers
export function renderWithProviders(ui: React.ReactElement) {
  const store = configureStore({
    reducer: {
      // Test reducers
    },
  });
  
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <Provider store={store}>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </Provider>
    );
  }
  
  return rtlRender(ui, { wrapper: Wrapper });
}
```

### 7.2 Component Tests
```typescript
// src/components/ui/button.test.tsx
describe('Button', () => {
  it('renders with correct text', () => {
    renderWithProviders(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
  
  it('calls onClick when clicked', async () => {
    const onClick = jest.fn();
    renderWithProviders(<Button onClick={onClick}>Click me</Button>);
    
    await userEvent.click(screen.getByText('Click me'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
```

## 8. Build & Deployment

### 8.1 Environment Configuration
```typescript
// src/config/index.ts
export const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'https://api.upzy.in/v1',
  environment: import.meta.env.MODE,
  version: import.meta.env.VITE_APP_VERSION || '1.0.0',
};
```

### 8.2 Build Scripts
```json
// package.json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "build:staging": "tsc && vite build --mode staging",
    "preview": "vite preview",
    "test": "vitest",
    "test:coverage": "vitest --coverage",
    "lint": "eslint src --ext ts,tsx",
    "lint:fix": "eslint src --ext ts,tsx --fix"
  }
}
```

## 9. Performance Optimization

### 9.1 Code Splitting
```typescript
// Route-based code splitting
const PartnerPages = lazy(() => import('./pages/partner'));
const BusinessPages = lazy(() => import('./pages/business'));
const EmployeePages = lazy(() => import('./pages/employee'));

// Component wrapping with Suspense
<Suspense fallback={<Loading />}>
  <PartnerPages />
</Suspense>
```

### 9.2 Bundle Analysis
```bash
# Install bundle analyzer
npm install -D rollup-plugin-visualizer

# Add to vite.config.ts
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({ filename: 'dist/stats.html' })
  ]
});
```

## 10. Development Timeline

### Week 1: Foundation
- [ ] Project setup and configuration
- [ ] Design system tokens
- [ ] Foundation components (Button, Input, Card, Modal)
- [ ] Basic layout components

### Week 2: Authentication & Layout
- [ ] Authentication system
- [ ] AppShell and navigation
- [ ] Route protection
- [ ] User context and state management

### Week 3: Partner Features
- [ ] Partner dashboard
- [ ] Job listings and job cards
- [ ] Job acceptance flow
- [ ] Basic profile management

### Week 4: Business Features
- [ ] Business dashboard
- [ ] Job creation form
- [ ] Partner search
- [ ] Job management

### Week 5: Employee Features & Polish
- [ ] Employee dashboard
- [ ] Onboarding approval workflow
- [ ] API integration completion
- [ ] Error handling and loading states
- [ ] Performance optimization
- [ ] Testing

## 11. Quality Checklist

### 11.1 Code Quality
- [ ] TypeScript strict mode enabled
- [ ] ESLint and Prettier configured
- [ ] All components have proper TypeScript interfaces
- [ ] Error boundaries implemented
- [ ] Loading states for all async operations

### 11.2 User Experience
- [ ] Mobile-responsive design
- [ ] Proper loading indicators
- [ ] Error messages are user-friendly
- [ ] Navigation is intuitive
- [ ] Performance meets targets (LCP ≤2.5s)

### 11.3 Security
- [ ] JWT tokens stored securely
- [ ] API calls include authentication headers
- [ ] Route protection working correctly
- [ ] No sensitive data in client-side code

---

This implementation plan provides a structured approach to building the Upzy React UI, prioritizing core functionality while maintaining code quality and performance standards. 
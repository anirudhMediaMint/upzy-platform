# Upzy Web Platform - Critical Components Specification (MVP)

## 1. Executive Summary

### 1.1 Platform Overview
Upzy is a labour platform that connects India's gig workforce with businesses for on-demand jobs. This MVP focuses on core job matching functionality with essential partner onboarding and business management tools.

### 1.2 Business Context
- **Target Market**: On-demand labour economy in major Indian cities
- **Revenue Model**: Commission on completed jobs
- **MVP Goal**: Prove core value proposition with minimal viable features

### 1.3 Technical Overview
React 18 web application serving 3 core personas with role-based access. Mobile-responsive design focused on essential user journeys.

## 2. MVP Goals & Success Metrics

### 2.1 Primary Goals
- Enable partners to view and accept jobs through web interface
- Allow businesses to create and manage job postings
- Provide basic onboarding approval workflow for employees
- Establish core platform architecture for future expansion

### 2.2 Success Metrics
- Partner job acceptance rate >60% within first month
- Business job posting completion rate >80%
- Employee onboarding approval time <24 hours average
- Platform uptime >99%

### 2.3 Non-Goals (MVP)
- Advanced analytics and reporting
- Real-time notifications
- Equipment rental management
- Vehicle loans and financial services
- Multi-language support (English only)
- Advanced accessibility features

## 3. Technical Architecture

### 3.1 Frontend Stack
- **Framework**: React 18 + Vite
- **State Management**: Redux Toolkit + RTK Query
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **Icons**: Lucide-react
- **Testing**: Jest + React Testing Library

### 3.2 API Architecture
- **Base URL**: `https://api.upzy.in/v1`
- **Protocol**: REST with JSON
- **Authentication**: JWT tokens
- **Authorization**: Role-Based Access Control

## 4. Core User Personas

### 4.1 Partner (Gig Worker)
- **Needs**: Find jobs, track earnings, manage profile
- **Access**: Job listings, earnings dashboard, basic profile

### 4.2 Business Admin
- **Needs**: Post jobs, find workers, track performance
- **Access**: Job creation, partner search, basic analytics

### 4.3 Employee (Upzy Staff)
- **Needs**: Approve partner onboarding, resolve basic issues
- **Access**: Approval workflows, user management

## 5. Information Architecture

### 5.1 Route Structure

```yaml
# Authentication
/auth
  - /signin                    # Role-based login
  - /logout                    # Secure logout

# Partner Routes
/partner
  - /dashboard                 # Earnings and job overview
  - /jobs                      # Available jobs
  - /jobs/:jobId               # Job details
  - /profile                   # Basic profile management
  - /onboarding                # Onboarding status (read-only)

# Business Routes  
/business
  - /dashboard                 # Business overview
  - /jobs                      # Job management
  - /jobs/create               # Create new job
  - /jobs/:jobId               # Job details
  - /partners                  # Available partners

# Employee Routes
/employee
  - /dashboard                 # Employee overview
  - /approvals                 # Pending approvals
  - /approvals/:applicationId  # Review application
  - /users                     # Basic user management
```

## 6. Essential Components

### 6.1 Foundation Components
| Component | Props | Usage |
|-----------|-------|-------|
| `<Button>` | `variant`, `size`, `disabled`, `onClick` | Primary interactions |
| `<Input>` | `type`, `placeholder`, `error`, `value`, `onChange` | Text entry |
| `<Select>` | `options[]`, `value`, `onChange`, `placeholder` | Dropdowns |
| `<Card>` | `title`, `children`, `actions[]` | Content containers |
| `<Modal>` | `isOpen`, `onClose`, `title`, `children` | Dialogs |
| `<Badge>` | `variant`, `children` | Status indicators |
| `<Avatar>` | `src`, `name`, `size` | User representation |

### 6.2 Layout Components
| Component | Props | Usage |
|-----------|-------|-------|
| `<AppShell>` | `user`, `navigation[]`, `children` | Main layout |
| `<SideNav>` | `links[]`, `currentPath` | Navigation menu |
| `<TopBar>` | `user`, `onLogout` | Header with user info |
| `<Container>` | `size`, `children` | Content wrapper |

### 6.3 Data Components
| Component | Props | Usage |
|-----------|-------|-------|
| `<DataTable>` | `columns[]`, `data[]`, `onRowClick` | Lists and tables |
| `<JobCard>` | `job`, `onAccept`, `variant` | Job listings |
| `<StatusBadge>` | `status`, `size` | Application status |
| `<EarningsWidget>` | `amount`, `period`, `trend` | Financial summaries |

### 6.4 Form Components
| Component | Props | Usage |
|-----------|-------|-------|
| `<Form>` | `onSubmit`, `children`, `loading` | Form wrapper |
| `<FormField>` | `label`, `error`, `required`, `children` | Form field container |
| `<FileUpload>` | `onUpload`, `accept`, `maxSize` | Document uploads |

### 6.5 Business Logic Components
| Component | Props | Usage |
|-----------|-------|-------|
| `<OnboardingProgress>` | `steps[]`, `currentStep` | Application progress |
| `<JobForm>` | `initialValues`, `onSubmit` | Job creation |
| `<PartnerProfile>` | `partner`, `editable`, `onUpdate` | Partner details |

## 7. Core Page Specifications

### 7.1 Partner Dashboard (`/partner/dashboard`)
**Purpose**: Show partner earnings, available jobs, and key actions

**Layout**: Single column, mobile-first

**Components**:
- **Earnings Summary** (EarningsWidget): Today/week earnings
- **Job Status** (StatusBadge): Active jobs count  
- **Quick Actions** (Button): View jobs, update profile
- **Recent Activity** (DataTable): Last 5 jobs

### 7.2 Business Dashboard (`/business/dashboard`)
**Purpose**: Show business job performance and partner availability

**Layout**: 2-column grid on desktop

**Components**:
- **Active Jobs** (Card): Current job count and status
- **Partner Metrics** (EarningsWidget): Available partners, response rates
- **Quick Actions** (Button): Create job, view applications
- **Recent Jobs** (DataTable): Job history

### 7.3 Job Listings (`/partner/jobs`)
**Purpose**: Show available jobs for partners to accept

**Layout**: Card grid with filters

**Components**:
- **Job Cards** (JobCard): Job details with accept button
- **Filters** (Select): Location, type, pay range
- **Pagination**: Load more jobs

### 7.4 Job Creation (`/business/jobs/create`)
**Purpose**: Allow businesses to post new jobs

**Layout**: Multi-step form

**Components**:
- **Job Form** (JobForm): Title, description, location, payment
- **Requirements** (FormField): Skills, experience needed
- **Schedule** (DatePicker): When job needs to be done
- **Review** (Card): Summary before posting

### 7.5 Onboarding Approval (`/employee/approvals`)
**Purpose**: Employee review and approval of partner applications

**Layout**: List with detail modal

**Components**:
- **Application List** (DataTable): Pending applications
- **Application Detail** (Modal): Document review, approval actions
- **Decision Form** (Form): Approve/reject with comments

## 8. State Management

### 8.1 Redux Store Structure
```javascript
{
  auth: {
    user: User | null,
    token: string | null,
    isAuthenticated: boolean
  },
  jobs: {
    list: Job[],
    loading: boolean,
    filters: JobFilters
  },
  profile: {
    data: UserProfile | null,
    loading: boolean
  },
  onboarding: {
    applications: Application[],
    currentApplication: Application | null
  }
}
```

### 8.2 API Integration
```javascript
// RTK Query APIs
export const jobsApi = createApi({
  reducerPath: 'jobsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/v1/jobs',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) headers.set('authorization', `Bearer ${token}`);
    },
  }),
  endpoints: (builder) => ({
    getJobs: builder.query({
      query: (filters) => ({ url: '/', params: filters }),
    }),
    acceptJob: builder.mutation({
      query: (jobId) => ({ url: `/${jobId}/accept`, method: 'POST' }),
    }),
  }),
});
```

## 9. Critical User Flows

### 9.1 Partner Job Acceptance
1. Login to partner dashboard
2. Navigate to jobs page
3. Browse available jobs with filters
4. Click on job card to view details
5. Accept job (redirects to mobile app for execution)

### 9.2 Business Job Creation
1. Login to business dashboard  
2. Click "Create Job" button
3. Fill job form (title, description, location, payment)
4. Set requirements and schedule
5. Review and publish job

### 9.3 Employee Onboarding Approval
1. Login to employee dashboard
2. View pending applications list
3. Click on application to review details
4. Review uploaded documents
5. Approve or reject with comments

## 10. Authentication & Security

### 10.1 Authentication Flow
- Phone number + OTP verification
- JWT token with 24-hour expiry
- Role-based route protection
- Automatic logout on token expiry

### 10.2 Authorization
```typescript
enum Permission {
  VIEW_OWN_JOBS = 'view_own_jobs',
  CREATE_JOBS = 'create_jobs',
  APPROVE_USERS = 'approve_users',
  VIEW_ALL_USERS = 'view_all_users'
}

const rolePermissions = {
  PARTNER: [Permission.VIEW_OWN_JOBS],
  BUSINESS: [Permission.CREATE_JOBS],
  EMPLOYEE: [Permission.APPROVE_USERS, Permission.VIEW_ALL_USERS]
};
```

## 11. Design System (Minimal)

### 11.1 Colors
```javascript
const colors = {
  primary: "#2C49EE",    // Upzy Blue
  accent: "#9DFD71",     // Lime Green  
  success: "#25A65B",
  danger: "#E02E2E",
  warning: "#F59E0B",
  gray: {
    50: "#F9FAFB",
    100: "#F3F4F6", 
    500: "#6B7280",
    900: "#111827"
  }
};
```

### 11.2 Typography
```javascript
const typography = {
  fontFamily: "Inter, system-ui, sans-serif",
  fontSize: {
    sm: "14px",
    base: "16px", 
    lg: "18px",
    xl: "20px",
    "2xl": "24px"
  }
};
```

### 11.3 Spacing
```javascript
const spacing = {
  1: "4px",
  2: "8px", 
  3: "12px",
  4: "16px",
  6: "24px",
  8: "32px"
};
```

## 12. Development Guidelines

### 12.1 Code Standards
- TypeScript strict mode
- ESLint + Prettier
- Component-driven development
- Mobile-first responsive design

### 12.2 Component Pattern
```typescript
interface ComponentProps {
  // Required props
  id: string;
  // Optional props with defaults
  variant?: 'primary' | 'secondary';
  // Event handlers
  onClick?: () => void;
}

export const Component: FC<ComponentProps> = ({ 
  id, 
  variant = 'primary',
  onClick 
}) => {
  return (
    <div className={`component component--${variant}`}>
      {/* Implementation */}
    </div>
  );
};
```

### 12.3 Testing Strategy
- Unit tests for utilities
- Component tests for UI logic  
- Integration tests for user flows
- Manual testing for critical paths

## 13. Performance Requirements

### 13.1 Core Web Vitals
- LCP: ≤2.5s on 3G connection
- FID: ≤100ms
- CLS: ≤0.1

### 13.2 Optimization
- Code splitting by route
- Image optimization
- Lazy loading for heavy components
- Bundle size monitoring

## 14. Deployment

### 14.1 Environments
- **Development**: dev.upzy.in
- **Production**: app.upzy.in

### 14.2 Build & Deploy
- Vite production build
- Static asset optimization
- Environment variable configuration
- Health check endpoints

## 15. Future Expansion

### 15.1 Phase 2 Features
- Real-time job notifications
- Advanced analytics dashboard
- Equipment rental management
- Multi-language support

### 15.2 Additional Personas
- Agency Manager for partner recruitment
- Finance Admin for payment disputes
- Café Admin for equipment tracking

### 15.3 Technical Debt
- Implement comprehensive accessibility
- Add advanced state management patterns
- Build component documentation
- Expand test coverage

---

This MVP specification focuses on delivering core value with minimal complexity, establishing the foundation for future platform growth. 
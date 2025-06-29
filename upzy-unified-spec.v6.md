# Upzy Web Platform - Unified Comprehensive Design Specification

## 1. Executive Summary

### 1.1 Platform Overview
Upzy is an API-driven labour platform that unites India's fragmented gig workforce under one verified profile, enabling partners to tap jobs across multiple commerce, food-delivery, ride-hailing and service apps after a single onboarding, boosting income and security.

### 1.2 Business Context
- **Market Opportunity**: ₹20-30B addressable market in India's on-demand labour economy
- **Revenue Model**: Commission on job value, daily equipment rentals (helmets, lockers), and SaaS API fees to businesses
- **Competitive Landscape**: Urban Company, Blinkit Rider Ops, Rapido Rider Ops, Swiggy Delivery Partner Platform

### 1.3 Technical Overview
A single React 18 web application serving eight distinct personas with role-based layouts, permissions, and real-time capabilities. Desktop-first responsive design (1280px → 360px) with WCAG 2.2 AA compliance and multilingual support.

## 2. Goals & Success Metrics

### 2.1 Primary Goals
- Provide a unified React web application serving all external and internal personas with role-based layouts and permissions
- Surface all Partner onboarding steps on web for employees/agency staff (read-only for partners post-submission)
- Achieve WCAG 2.2 AA accessibility compliance
- Launch with multilingual support (English + 5 Indian languages)

### 2.2 Success Metrics
- DAU per persona ≥ 70% of registered users 30 days post-launch
- Average job-accept latency reduced by 15% for Business persona
- Support ticket resolution via impersonation drops by 25%
- 2000ms LCP on desktop, 3000ms LCP on mobile

### 2.3 Non-Goals
- Browser push notifications (email/SMS only)
- Partner editing of onboarding data after first submission
- Direct partner onboarding on web (mobile/kiosk primary)

## 3. Technical Architecture

### 3.1 Frontend Stack
- **Framework**: React 18 + Vite
- **State Management**: Redux Toolkit + RTK Query
- **Styling**: Tailwind CSS with custom design tokens
- **Routing**: React Router v6 with role-based guards
- **Internationalization**: react-i18next
- **Icons**: Lucide-react
- **Build Tools**: Vite, ESBuild
- **Testing**: Jest, React Testing Library, Cypress

### 3.2 API Architecture
- **Base URL**: `https://api.upzy.in/v1`
- **Protocol**: REST with OpenAPI 3.0 contracts
- **Real-time**: WebSocket channel `/v1/ws/jobs`
- **Authentication**: OAuth 2.0 / JWT
- **Authorization**: Role-Based Access Control (RBAC)

### 3.3 Third-Party Integrations
| Provider | Purpose | Authentication |
|----------|---------|----------------|
| Mapbox | Interactive zone picker | API Token |
| SendGrid | Transactional email | API Key |
| Twilio | SMS OTP & notifications | Auth SID/Token |

## 4. User Personas & Roles

### 4.1 External Personas
1. **Partner** (Gig Worker)
   - Needs: Track earnings, accept jobs, resolve disputes
   - Access: Read-only onboarding status, full access to jobs/finance

2. **Coordinator** 
   - Partner role with elevated privileges
   - Can switch between linked partner accounts
   - No separate shell (uses Partner layout)

3. **Agency Manager**
   - Needs: Onboard partners, monitor performance, reconcile payouts
   - Access: Partner management, maker role in onboarding

4. **Business Admin/User**
   - Needs: Reliable supply, real-time KPIs, API integration
   - Access: Job management, payments, API keys

5. **Developer**
   - Alias for Business → API Keys section
   - Access: API documentation and key management

6. **Café Admin**
   - Needs: Checkout helmets, track inventory
   - Access: Tablet-optimized kiosk UI

### 4.2 Internal Personas
1. **Upzy Employee**
   - Needs: Resolve tickets, approve onboarding, impersonate users
   - Access: All support tools, checker role in approvals

2. **Finance Admin**
   - Needs: Investigate deductions, process refunds
   - Access: Dispute resolution workflows

3. **Admin** (Super Admin)
   - Full platform access including audit logs and settings

## 5. Information Architecture

### 5.1 Route Structure & Hierarchy

#### 5.1.1 Authentication & Public Routes
```yaml
/auth
  - /signin                          # Multi-role login (phone + OTP)
  - /signin/:role                    # Role-specific login flows
  - /forgot-password                 # Password recovery
  - /otp-verify                      # OTP verification
  - /reset-password/:token           # Password reset completion
  - /logout                          # Secure logout with cleanup
  - /terms                           # Terms of service
  - /privacy                         # Privacy policy
  - /help                            # Public help documentation

/onboarding                          # Public onboarding info
  - /partner                         # Partner onboarding overview
  - /agency                          # Agency program information
  - /business                        # Business partnership info
```

#### 5.1.2 Partner Routes (PartnerShell Layout)
```yaml
/partner                             # Protected: PARTNER role
  - /dashboard                       # Main dashboard with earnings/jobs
  - /onboarding-status               # READ-ONLY: Current application status
    - /documents                     # Document submission status
    - /verification                  # Verification progress
    - /approval                      # Approval status & next steps
  - /jobs                           # Job management
    - /                             # Job listings with filters
    - /active                       # Currently active jobs
    - /history                      # Job history with pagination
    - /:jobId                       # Individual job details
    - /:jobId/dispute               # Job dispute form
  - /finance                        # Financial management
    - /earnings                     # Earnings dashboard
    - /payouts                      # Payout history
    - /deductions                   # Deduction history & disputes
    - /tax-documents                # Tax forms and documents
  - /benefits                       # Partner benefits
    - /health-insurance             # Health insurance details
    - /equipment-loans              # Equipment financing
    - /training-programs            # Available training
  - /vehicle-loan                   # Vehicle financing
    - /application                  # Loan application form
    - /status                       # Application status
    - /emi-details                  # EMI schedule & payments
  - /profile                        # Profile management
    - /personal                     # Personal information
    - /documents                    # Document management
    - /bank-details                 # Banking information
    - /preferences                  # Work preferences & zones
    - /emergency-contacts           # Emergency contact info
```

#### 5.1.3 Agency Routes (AgencyShell Layout)
```yaml
/agency                             # Protected: AGENCY_MANAGER role
  - /dashboard                      # Agency performance overview
  - /partners                       # Partner management
    - /                            # Partner listing table
    - /add                         # New partner onboarding
    - /:partnerId                  # Partner profile (drawer/modal)
    - /:partnerId/edit             # Edit partner details
    - /:partnerId/documents        # Partner document management
    - /:partnerId/jobs             # Partner job history
    - /:partnerId/finance          # Partner financial records
    - /bulk-actions                # Bulk operations interface
    - /onboarding-queue            # Pending onboarding queue
  - /jobs                          # Job distribution management
    - /assignments                 # Job assignment overview
    - /performance                 # Partner performance metrics
    - /disputes                    # Job dispute resolution
  - /finance                       # Financial management
    - /commission                  # Commission tracking
    - /payouts                     # Payout management
    - /reconciliation              # Payment reconciliation
  - /tickets                       # Support ticket management
    - /                           # Ticket listing
    - /:ticketId                  # Ticket details
    - /create                     # Create new ticket
  - /reports                       # Analytics & reporting
    - /partner-performance         # Partner analytics
    - /financial-summary          # Financial reports
    - /operational-metrics        # Operational dashboards
```

#### 5.1.4 Business Routes (BizShell Layout)
```yaml
/business                           # Protected: BUSINESS_ADMIN/USER roles
  - /dashboard                      # Business analytics dashboard
  - /jobs                          # Job management
    - /                           # Job listings & filters
    - /create                     # Create new job posting
    - /:jobId                     # Job details & management
    - /:jobId/edit                # Edit job details
    - /:jobId/applications        # Partner applications for job
    - /:jobId/analytics           # Job performance metrics
    - /templates                  # Job templates
    - /bulk-operations            # Bulk job management
  - /payments                      # Payment management
    - /invoices                   # Invoice management
    - /transactions               # Transaction history
    - /billing-settings          # Billing configuration
    - /payment-methods            # Payment method management
  - /api-keys                      # Developer tools
    - /                          # API key management
    - /documentation             # API documentation
    - /webhooks                  # Webhook configuration
    - /rate-limits               # Usage & rate limit monitoring
    - /logs                      # API usage logs
  - /users                         # Team management
    - /                          # User listing
    - /invite                    # Invite new users
    - /:userId                   # User profile management
    - /roles                     # Role & permission management
  - /profile                       # Business profile
    - /company-details           # Company information
    - /verification              # Business verification status
    - /preferences               # Notification & operational preferences
  - /analytics                     # Advanced analytics
    - /performance               # Service performance metrics
    - /partner-ratings           # Partner feedback & ratings
    - /geographic                # Geographic insights
    - /trends                    # Market trend analysis
```

#### 5.1.5 Employee Routes (UpzyShell Layout)
```yaml
/employee                           # Protected: UPZY_EMPLOYEE role
  - /dashboard                      # Employee dashboard with queue overview
  - /tickets                        # Support ticket management
    - /                           # Ticket queue with filters
    - /:ticketId                  # Ticket details & resolution
    - /assign                     # Ticket assignment
    - /escalate                   # Escalation management
    - /knowledge-base             # Internal knowledge base
  - /approvals                      # Approval workflows
    - /workers                    # Worker onboarding approvals
      - /pending                  # Pending approvals queue
      - /:applicationId           # Individual application review
      - /rejected                 # Rejected applications
      - /approved                 # Approved applications
      - /escalated                # Escalated cases
    - /vehicles                   # Vehicle verification approvals
      - /pending                  # Vehicle verification queue
      - /:vehicleId               # Vehicle details & documents
    - /businesses                 # Business verification approvals
      - /pending                  # Business verification queue
      - /:businessId              # Business verification details
  - /switch-account                 # Account impersonation
    - /search                     # Search users for impersonation
    - /history                    # Impersonation audit log
    - /active                     # Currently active impersonations
  - /reports                        # Reporting & analytics
    - /finance                    # Financial reports
    - /operational                # Operational metrics
    - /user-activity              # User activity analytics
    - /system-health              # System health monitoring
  - /tools                          # Employee tools
    - /data-export                # Data export utilities
    - /bulk-operations            # Bulk operation tools
    - /system-announcements       # System-wide announcements
```

#### 5.1.6 Café Admin Routes (CafeShell Layout)
```yaml
/cafe-admin                         # Protected: CAFE_ADMIN role
  - /dashboard                      # Café operations dashboard
  - /helmets                        # Helmet management
    - /checkout                   # Helmet checkout interface
    - /checkin                    # Helmet return interface
    - /inventory                  # Inventory management
    - /maintenance                # Maintenance tracking
    - /lost-damaged               # Lost/damaged item processing
  - /equipment                      # General equipment management
    - /lockers                    # Locker management
    - /charging-stations          # Charging station monitoring
    - /accessories               # Other equipment tracking
  - /transactions                   # Transaction management
    - /                          # Transaction history
    - /deposits                  # Deposit management
    - /refunds                   # Refund processing
    - /reports                   # Daily/weekly reports
  - /partners                       # Partner interactions
    - /lookup                    # Partner lookup & verification
    - /blacklist                 # Blacklisted partners
    - /frequent-users            # Frequent user management
  - /settings                       # Café settings
    - /pricing                   # Equipment pricing configuration
    - /policies                  # Rental policies
    - /notifications             # Notification preferences
```

#### 5.1.7 Finance Admin Routes (UpzyShell Layout)
```yaml
/finance-admin                      # Protected: FINANCE_ADMIN role
  - /dashboard                      # Financial operations dashboard
  - /disputes                       # Dispute management
    - /deductions                 # Deduction disputes
      - /open                     # Open disputes
      - /:disputeId               # Individual dispute resolution
      - /resolved                 # Resolved disputes
      - /escalated                # Escalated disputes
    - /refunds                    # Refund management
    - /chargebacks                # Chargeback handling
  - /investigations                 # Financial investigations
    - /fraud-detection            # Fraud monitoring
    - /suspicious-activity        # Suspicious activity alerts
    - /audit-trails               # Financial audit trails
  - /reconciliation                 # Payment reconciliation
    - /partner-payouts            # Partner payout reconciliation
    - /business-payments          # Business payment reconciliation
    - /equipment-rentals          # Equipment rental reconciliation
  - /reports                        # Financial reporting
    - /daily-summary              # Daily financial summary
    - /partner-earnings           # Partner earnings reports
    - /business-revenue           # Business revenue reports
    - /equipment-revenue          # Equipment rental revenue
```

#### 5.1.8 Admin Routes (UpzyShell Layout)
```yaml
/admin                              # Protected: ADMIN role (Super Admin)
  - /dashboard                      # System administration dashboard
  - /users                          # User management
    - /                           # User listing with filters
    - /:userId                    # User profile & permissions
    - /roles                      # Role management
    - /permissions                # Permission matrix
    - /audit-log                  # User activity audit log
  - /system                         # System management
    - /settings                   # System configuration
    - /feature-flags              # Feature flag management
    - /maintenance                # Maintenance mode controls
    - /monitoring                 # System monitoring
    - /logs                       # System logs
  - /content                        # Content management
    - /announcements              # System announcements
    - /notifications              # Notification templates
    - /help-articles              # Help documentation
    - /policy-updates             # Policy & terms updates
  - /analytics                      # Platform analytics
    - /usage-metrics              # Platform usage statistics
    - /performance                # Performance monitoring
    - /error-tracking             # Error monitoring & alerts
  - /archive                        # Data archival
    - /users                      # Archived user accounts
    - /data-retention             # Data retention policies
    - /compliance                 # Compliance & legal tools
```

### 5.2 Cross-Persona Navigation Patterns

#### 5.2.1 Shared Routes & Deep Linking
```yaml
/shared                             # Context-aware shared routes
  - /job/:jobId                     # Universal job view (role-aware)
  - /partner/:partnerId             # Universal partner profile (permission-aware)
  - /transaction/:transactionId     # Universal transaction view
  - /document/:documentId           # Universal document viewer
  - /notification/:notificationId   # Universal notification handler
  - /help/:articleId                # Universal help article
```

#### 5.2.2 Mobile App Integration Routes
```yaml
/mobile                             # Mobile app deep-link handlers
  - /job-accept/:jobId              # Deep link to mobile for job acceptance
  - /camera-capture/:type           # Camera capture deep link
  - /location-share/:context        # Location sharing deep link
  - /emergency-contact              # Emergency contact deep link
```

#### 5.2.3 External Integration Routes
```yaml
/integrations                       # External integration endpoints
  - /webhook/:provider              # Webhook handlers
  - /callback/:service              # OAuth/API callbacks
  - /redirect/:destination          # Secure redirect handlers
  - /embed/:widget                  # Embeddable widget endpoints
```

### 5.3 Route Guards & Permissions

#### 5.3.1 Permission Matrix
```typescript
enum Permission {
  // Partner permissions
  VIEW_OWN_PROFILE = 'view_own_profile',
  EDIT_OWN_PROFILE = 'edit_own_profile',
  VIEW_OWN_JOBS = 'view_own_jobs',
  VIEW_OWN_FINANCE = 'view_own_finance',
  
  // Agency permissions
  VIEW_AGENCY_PARTNERS = 'view_agency_partners',
  EDIT_AGENCY_PARTNERS = 'edit_agency_partners',
  ONBOARD_PARTNERS = 'onboard_partners',
  
  // Business permissions
  CREATE_JOBS = 'create_jobs',
  MANAGE_TEAM = 'manage_team',
  VIEW_ANALYTICS = 'view_analytics',
  MANAGE_API_KEYS = 'manage_api_keys',
  
  // Employee permissions
  APPROVE_ONBOARDING = 'approve_onboarding',
  IMPERSONATE_USERS = 'impersonate_users',
  VIEW_SUPPORT_TICKETS = 'view_support_tickets',
  
  // Finance permissions
  RESOLVE_DISPUTES = 'resolve_disputes',
  PROCESS_REFUNDS = 'process_refunds',
  VIEW_FINANCIAL_DATA = 'view_financial_data',
  
  // Admin permissions
  MANAGE_SYSTEM = 'manage_system',
  VIEW_ALL_DATA = 'view_all_data',
  MANAGE_USERS = 'manage_users'
}
```

#### 5.3.2 Route Protection Patterns
```typescript
interface RouteGuard {
  path: string;
  permissions: Permission[];
  fallbackRedirect: string;
  allowImpersonation?: boolean;
  requireMFA?: boolean;
}

const routeGuards: RouteGuard[] = [
  {
    path: '/admin/*',
    permissions: [Permission.MANAGE_SYSTEM],
    fallbackRedirect: '/auth/signin',
    requireMFA: true
  },
  {
    path: '/finance-admin/*',
    permissions: [Permission.RESOLVE_DISPUTES],
    fallbackRedirect: '/unauthorized',
    requireMFA: true
  },
  {
    path: '/employee/switch-account',
    permissions: [Permission.IMPERSONATE_USERS],
    fallbackRedirect: '/employee/dashboard',
    allowImpersonation: false
  }
];
```

### 5.4 Error Handling & Fallback Routes

#### 5.4.1 Error Routes
```yaml
/error                              # Error handling
  - /404                           # Page not found
  - /403                           # Forbidden/unauthorized
  - /500                           # Internal server error
  - /maintenance                   # Maintenance mode
  - /network-error                 # Network connectivity issues
  - /session-expired               # Session timeout
  - /account-suspended             # Account suspension notice
  - /feature-unavailable           # Feature temporarily unavailable
```

#### 5.4.2 Redirect Patterns
```yaml
/redirect                           # Intelligent redirects
  - /role-detection                # Auto-redirect based on user role
  - /onboarding-flow               # Redirect to appropriate onboarding step
  - /post-login                    # Post-login intelligent routing
  - /mobile-fallback               # Mobile app fallback handling
```

### 5.5 SEO & Discovery Routes

#### 5.5.1 Public Discovery Pages
```yaml
/discover                           # Public-facing discovery
  - /partner-opportunities         # Partner opportunity showcase
  - /business-solutions            # Business solution overview
  - /agency-program                # Agency program details
  - /success-stories               # Case studies & testimonials
  - /pricing                       # Transparent pricing information
```

#### 5.5.2 Content Routes
```yaml
/content                            # Content management
  - /blog/:slug                    # Blog articles
  - /guides/:category/:slug        # How-to guides
  - /case-studies/:slug            # Case studies
  - /press/:slug                   # Press releases
  - /legal/:document               # Legal documents
```

### 5.6 Real-time & Dynamic Routes

#### 5.6.1 WebSocket Integration Points
```yaml
/ws                                 # WebSocket connection endpoints
  - /jobs                          # Real-time job updates
  - /notifications                 # Real-time notifications
  - /chat/:conversationId          # Support chat connections
  - /live-tracking/:jobId          # Live job tracking
```

#### 5.6.2 Dynamic Content Routes
```yaml
/dynamic                            # Dynamically generated content
  - /reports/:reportId             # Generated reports
  - /exports/:exportId             # Data export downloads
  - /certificates/:certificateId   # Training certificates
  - /receipts/:transactionId       # Transaction receipts
```

## 6. Design System

### 6.1 Design Tokens (Brand Confirmed)

```javascript
const tokens = {
  color: {
    primary: {
      500: "#2C49EE",  // Upzy Blue (from logo)
      700: "#1F34B0"   // 20% darker for hover/active
    },
    accent: {
      500: "#9DFD71",  // Lime Green (logo circle)
      700: "#6BCC4E"   // 20% darker for interactive
    },
    semantic: {
      success: "#25A65B",
      danger: "#E02E2E",
      warning: "#F59E0B",
      info: "#3B82F6"
    },
    neutral: {
      900: "#111827",
      800: "#1F2937",
      700: "#374151",
      600: "#4B5563",
      500: "#6B7280",
      400: "#9CA3AF",
      300: "#D1D5DB",
      200: "#E5E7EB",
      100: "#F3F4F6",
      50: "#F9FAFB"
    }
  },
  typography: {
    fontFamily: {
      base: "Inter, system-ui, sans-serif",
      mono: "JetBrains Mono, monospace"
    },
    scale: [12, 14, 16, 18, 20, 24, 30, 36, 48],
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75
    }
  },
  spacing: {
    scale: [0, 4, 8, 12, 16, 24, 32, 48, 64, 96]
  },
  radius: {
    sm: "4px",
    md: "8px",
    lg: "16px",
    full: "9999px"
  },
  elevation: {
    sm: "0 1px 3px rgba(0,0,0,0.04)",
    md: "0 2px 6px rgba(0,0,0,0.06)",
    lg: "0 4px 12px rgba(0,0,0,0.08)",
    xl: "0 8px 24px rgba(0,0,0,0.12)"
  },
  animation: {
    duration: {
      fast: "150ms",
      normal: "300ms",
      slow: "500ms"
    },
    easing: {
      default: "cubic-bezier(0.4, 0, 0.2, 1)",
      bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)"
    }
  }
}
```

### 6.2 Component Library

#### 6.2.1 Foundation Components (UI Primitives)

| Component | Props | Behavior | Accessibility | Usage |
|-----------|-------|----------|---------------|-------|
| `<Button>` | `variant`, `size`, `disabled`, `loading`, `icon`, `onClick` | Loading states, focus ring, hover effects | Full keyboard support, ARIA states | Primary interactions |
| `<Input>` | `type`, `placeholder`, `error`, `disabled`, `icon`, `mask` | Validation states, auto-focus, formatting | Label association, error announcements | Text entry |
| `<Textarea>` | `rows`, `resize`, `maxLength`, `placeholder`, `error` | Auto-resize, character counting | Screen reader support | Long text input |
| `<Select>` | `options[]`, `multiple`, `searchable`, `placeholder`, `error` | Keyboard navigation, search filtering | ARIA combobox pattern | Option selection |
| `<Checkbox>` | `checked`, `indeterminate`, `disabled`, `error` | Tri-state support, group management | Proper ARIA states | Boolean inputs |
| `<Radio>` | `name`, `value`, `checked`, `disabled` | Exclusive selection, keyboard nav | Radio group semantics | Single choice |
| `<Switch>` | `checked`, `disabled`, `size`, `label` | Toggle animation, haptic feedback | Switch role, state announcements | Binary toggles |
| `<Slider>` | `min`, `max`, `step`, `value`, `range`, `marks` | Thumb positioning, value display | Slider role, value announcements | Numeric input |
| `<Avatar>` | `src`, `name`, `size`, `fallback`, `status` | Image loading, fallback generation | Alt text, decorative marking | User representation |
| `<Badge>` | `variant`, `size`, `dot`, `count`, `max` | Overflow handling, animations | Status announcements | Counts/status |

#### 6.2.2 Layout & Navigation Components

| Component | Props | Behavior | Accessibility | Usage |
|-----------|-------|----------|---------------|-------|
| `<SideNav>` | `links[]`, `role`, `collapsed`, `onCollapse`, `locale` | Auto-highlights active route, responsive collapse | Navigation landmarks, skip links | All shell layouts |
| `<TopBar>` | `user`, `notifications[]`, `showEarnings`, `actions[]` | Sticky positioning, responsive menu | Header landmark, menu button | Global header |
| `<Breadcrumbs>` | `items[]`, `separator`, `maxItems`, `onNavigate` | Path truncation, overflow handling | Navigation landmark | Hierarchical nav |
| `<Tabs>` | `items[]`, `orientation`, `variant`, `defaultTab` | Keyboard navigation, lazy loading | Tablist pattern, panel association | Content organization |
| `<Pagination>` | `total`, `current`, `pageSize`, `showSizeChanger` | Page navigation, size selection | Page navigation semantics | Data navigation |
| `<Card>` | `variant`, `padding`, `hoverable`, `loading`, `actions[]` | Hover effects, loading skeleton | Proper heading hierarchy | Content containers |
| `<Divider>` | `orientation`, `variant`, `text`, `spacing` | Visual separation | Decorative separator role | Visual separation |
| `<Container>` | `size`, `centered`, `padding`, `responsive` | Responsive breakpoints, max-width | Landmark regions | Page layout |

#### 6.2.3 Data Display Components

| Component | Props | Behavior | Accessibility | Usage |
|-----------|-------|----------|---------------|-------|
| `<DataTable>` | `columns[]`, `data[]`, `loading`, `pagination`, `selection`, `filters`, `sorting` | Server-side ops, virtual scrolling | Table semantics, sort announcements | Complex data lists |
| `<List>` | `items[]`, `renderItem`, `loading`, `infinite`, `virtual` | Infinite scroll, virtualization | List semantics, item counting | Simple data lists |
| `<Tree>` | `data[]`, `expandable`, `selectable`, `searchable` | Expand/collapse, selection | Tree semantics, expansion states | Hierarchical data |
| `<KPIWidget>` | `title`, `value`, `trend`, `loading`, `format`, `comparison` | Animated number transitions, trend indicators | Value announcements | Metrics display |
| `<Chart>` | `type`, `data[]`, `config`, `responsive`, `loading` | Interactive tooltips, zoom/pan | Chart descriptions, data tables | Data visualization |
| `<StatusBadge>` | `status`, `size`, `animated`, `icon`, `text` | Color-mapped states, pulse animation | Status announcements | Status indicators |
| `<Progress>` | `value`, `max`, `size`, `showText`, `status` | Progress animation, status colors | Progress announcements | Task completion |
| `<Timeline>` | `items[]`, `direction`, `pending`, `status` | Step completion states | Timeline semantics | Process steps |

#### 6.2.4 Feedback & Interaction Components

| Component | Props | Behavior | Accessibility | Usage |
|-----------|-------|----------|---------------|-------|
| `<Modal>` | `open`, `onClose`, `size`, `closable`, `destroyOnClose` | Focus trap, ESC handling, backdrop click | Dialog role, focus management | Critical interactions |
| `<Drawer>` | `open`, `placement`, `size`, `mask`, `onClose` | Slide animation, backdrop | Sheet role, focus trap | Secondary content |
| `<Popover>` | `content`, `trigger`, `placement`, `arrow`, `controlled` | Positioning, auto-flip | Tooltip/dialog patterns | Contextual info |
| `<Tooltip>` | `content`, `placement`, `delay`, `trigger`, `arrow` | Hover/focus triggers, positioning | Tooltip role, describedby | Help text |
| `<NotificationToast>` | `message`, `type`, `duration`, `action`, `closable` | Auto-dismiss, queue management | Alert role, announcements | System feedback |
| `<ConfirmDialog>` | `title`, `content`, `confirmText`, `cancelText`, `danger` | Promise-based API, focus handling | Alertdialog role | Destructive actions |
| `<Loading>` | `size`, `spinning`, `tip`, `delay`, `global` | Smooth animations, delay handling | Aria-live regions | Async operations |
| `<Skeleton>` | `rows`, `avatar`, `title`, `active`, `loading` | Shimmer animation, content matching | Screen reader hiding | Content placeholders |

#### 6.2.5 Form & Input Components

| Component | Props | Behavior | Accessibility | Usage |
|-----------|-------|----------|---------------|-------|
| `<Form>` | `onSubmit`, `validation`, `initialValues`, `loading` | Validation orchestration, submission handling | Form semantics, error summaries | Data collection |
| `<FormField>` | `name`, `label`, `required`, `error`, `help`, `validation` | Field registration, validation display | Label association, error linking | Individual form fields |
| `<PhoneInput>` | `country`, `format`, `validation`, `international` | Country selection, formatting, validation | Accessible combobox pattern | Phone numbers |
| `<OTPInput>` | `length`, `autoFocus`, `onComplete`, `secure` | Auto-advance, paste handling | Individual field labels | Verification codes |
| `<DatePicker>` | `format`, `range`, `disabled`, `locale`, `showTime` | Calendar navigation, range selection | Date picker semantics | Date selection |
| `<FileUploader>` | `accept[]`, `multiple`, `maxSize`, `onScan`, `preview` | Drag-drop, progress, virus scan | File input semantics | Document uploads |
| `<SearchInput>` | `onSearch`, `suggestions[]`, `debounce`, `highlight` | Debounced search, autocomplete | Combobox pattern, announcements | Search functionality |
| `<BankAccountInput>` | `onIFSCLookup`, `validation`, `countries[]` | IFSC/routing validation, bank lookup | Grouped field semantics | Payment setup |
| `<AddressInput>` | `countries[]`, `onGeocode`, `validation` | Address autocomplete, geocoding | Address form patterns | Location entry |

#### 6.2.6 Business Logic Components

| Component | Props | Behavior | Accessibility | Usage |
|-----------|-------|----------|---------------|-------|
| `<JobCard>` | `job`, `variant`, `actions[]`, `onAccept`, `realtime` | Real-time updates, action handling | Card semantics, action buttons | Job listings |
| `<PartnerProfile>` | `partner`, `editable`, `onUpdate`, `sections[]` | Section management, photo upload | Profile semantics, form integration | Partner details |
| `<EarningsWidget>` | `period`, `data`, `breakdown`, `trends` | Period switching, trend visualization | Widget semantics, chart descriptions | Financial summaries |
| `<OnboardingProgress>` | `steps[]`, `current`, `validation`, `navigation` | Step validation, progress persistence | Stepper semantics, completion status | Onboarding flows |
| `<DocumentViewer>` | `documents[]`, `annotations`, `comparison`, `zoom` | Document zoom, side-by-side comparison | Document semantics, zoom controls | Document review |
| `<TransactionHistory>` | `transactions[]`, `filters`, `export`, `dispute` | Filtering, export, dispute initiation | Table semantics, action buttons | Financial records |
| `<InventoryGrid>` | `items[]`, `selection`, `filters`, `checkout` | Item selection, availability states | Grid semantics, item states | Equipment management |
| `<KanbanBoard>` | `columns[]`, `cards[]`, `onMove`, `onUpdate` | Drag-drop, real-time updates | Drag-drop semantics, live regions | Workflow management |

#### 6.2.7 Specialized Components

| Component | Props | Behavior | Accessibility | Usage |
|-----------|-------|----------|---------------|-------|
| `<MapComponent>` | `center`, `zoom`, `markers[]`, `polygons[]`, `interactive` | Lazy loading, clustering, drawing tools | Map semantics, keyboard navigation | Location visualization |
| `<ZonePicker>` | `zones[]`, `selected[]`, `onSelect`, `searchable` | Multi-select, search filtering | Listbox semantics, selection announcements | Service area selection |
| `<CameraCapture>` | `onCapture`, `quality`, `facing`, `overlay` | Camera access, image processing | Camera permissions, capture feedback | Document photography |
| `<QRScanner>` | `onScan`, `continuous`, `overlay`, `torch` | QR detection, torch control | Scanner feedback, success announcements | Code scanning |
| `<LanguageSwitcher>` | `locales[]`, `current`, `variant`, `persist` | Language switching, persistence | Language selection semantics | Internationalization |
| `<AccountSwitcher>` | `accounts[]`, `current`, `onSwitch`, `search` | Account switching, impersonation audit | Combobox pattern, switch announcements | User impersonation |
| `<ThemeSwitcher>` | `themes[]`, `current`, `system`, `persist` | Theme switching, system preference | Theme selection semantics | UI theming |
| `<ErrorBoundary>` | `fallback`, `onError`, `recovery`, `logging` | Error catching, recovery actions | Error announcements, recovery options | App stability |

#### 6.2.8 Real-time & Connection Components

| Component | Props | Behavior | Accessibility | Usage |
|-----------|-------|----------|---------------|-------|
| `<WebSocketProvider>` | `url`, `protocols[]`, `reconnect`, `onMessage` | Connection management, auto-reconnect | Connection status announcements | Real-time communication |
| `<LiveDataTable>` | `endpoint`, `realtime`, `filters`, `updates` | Real-time data updates, optimistic UI | Live region updates | Dynamic data display |
| `<NotificationCenter>` | `provider`, `realtime`, `history`, `preferences` | Real-time notifications, history | Notification announcements | System notifications |
| `<ConnectionStatus>` | `showWhen`, `position`, `retry`, `details` | Network status monitoring | Connection status updates | Network feedback |

#### 6.2.9 Utility Components

| Component | Props | Behavior | Accessibility | Usage |
|-----------|-------|----------|---------------|-------|
| `<EmptyState>` | `icon`, `title`, `description`, `action`, `variant` | Illustrated empty states, call-to-action | Descriptive content, actionable elements | No data scenarios |
| `<ErrorState>` | `error`, `retry`, `contact`, `details` | Error display, retry mechanisms | Error announcements, recovery actions | Error handling |
| `<Announcer>` | `message`, `priority`, `clear` | Screen reader announcements | Aria-live region management | Accessibility feedback |
| `<FocusManager>` | `trap`, `restore`, `auto`, `group` | Focus management and restoration | Focus trap implementation | Accessibility utility |
| `<LazyComponent>` | `component`, `fallback`, `threshold`, `once` | Lazy loading with intersection observer | Loading announcements | Performance optimization |

## 7. Page Specifications

### 7.1 Partner Dashboard (`/partner/dashboard`)

**Layout**: 2-column grid on desktop, stacked on mobile

**Components**:
1. **Earnings Summary** (KPIWidget)
   - Today's earnings with trend
   - Toggle: Today/Week/Month
   - Real-time WebSocket updates

2. **Jobs Overview** (KPIWidget + Pills)
   - Active job count
   - Breakdown by type (Delivery, Ride-hail, Services)
   - Click pill to filter job list

3. **Peak Times Heatmap**
   - 24×7 grid visualization
   - Darker = busier periods
   - Hover for exact job counts

4. **Performance Metrics**
   - Average rating (bar chart by business)
   - Completion rate
   - Response time percentile

5. **Financial Status**
   - Loan balance & next EMI
   - Pending deductions
   - Last payout date

6. **Action Center**
   - Primary CTA: "Accept Next Job" (deep-links to mobile)
   - Quick links: Update bank, view benefits

7. **Alerts**
   - Onboarding incomplete banner (if status ≠ approved)
   - Pending document renewals
   - New benefits available

### 7.2 Business Dashboard (`/business/dashboard`)

**Layout**: Metric cards + charts grid

**Components**:
1. **Satisfaction Metrics**
   - NPS/CSAT score with trend
   - Partner rating distribution
   - Volume indicators

2. **Operational KPIs**
   - Jobs by status (stacked bar)
   - Response time distribution
   - SLA compliance percentage

3. **Geographic Insights**
   - Heat map of top areas
   - Tabular breakdown by city/zone
   - Demand vs supply overlay

4. **Financial Summary**
   - Total payments to Upzy
   - Outstanding invoices
   - Cost per job trends

5. **Job Analytics**
   - Type distribution (pie/donut)
   - Time-of-day patterns
   - Backlog management table

### 7.3 Agency Partners Management (`/agency/partners`)

**Layout**: Full-width data table with drawer

**Table Columns**:
- Name (searchable)
- Phone (masked)
- City
- Status (badge)
- Rating
- Latest Job
- Actions

**Row Actions**:
- View details (opens drawer)
- Switch to partner view
- Download documents

**Bulk Actions**:
- Export selected (PII-redacted)
- Send bulk notification

**Partner Drawer Tabs**:
1. **Profile**: Personal info, documents, verification status
2. **Jobs**: Recent activity, performance metrics
3. **Finance**: Earnings, deductions, payout history
4. **Actions**: Update status, add note, trigger verification

### 7.4 Employee Approvals (`/employee/approvals/workers`)

**Layout**: Kanban board with 5 columns

**Columns**:
1. **Pending**: New submissions
2. **In Review**: Assigned to reviewer
3. **Escalated**: Requires senior approval
4. **Approved**: Completed, awaiting activation
5. **Rejected**: With rejection reasons

**Card Information**:
- Partner name & photo
- Submission date/time
- Document checklist status
- Risk indicators

**Verifier Pane** (modal):
- Side-by-side comparison view
- Document zoom/pan
- Checklist with mandatory items
- Background check status
- Approve/Reject/Escalate actions

### 7.5 Café Admin Helmet Management (`/cafe-admin/helmets-checkout`)

**Layout**: Search + inventory grid (tablet-optimized)

**Checkout Flow**:
1. **Partner Lookup**
   - NFC/QR scanner integration
   - Phone number search fallback
   - Show photo for verification

2. **Helmet Selection**
   - Available inventory grid
   - Filter by size (S/M/L/XL)
   - Condition indicators

3. **Checkout Confirmation**
   - Deposit amount
   - Daily rental fee
   - Total deduction preview
   - Terms acceptance

4. **Transaction Complete**
   - Print/SMS receipt option
   - Update partner record
   - Log to transactions

### 7.6 Finance Admin Disputes (`/finance-admin/deductions-disputes`)

**Layout**: Filterable table + resolution modal

**Table Filters**:
- Status (Open/Resolved/Escalated)
- Type (Helmet/Locker/Restroom)
- Date range
- Amount range

**Dispute Modal**:
- **Transaction History**: Full audit trail with timestamps
- **Evidence**: Uploaded documents, café notes
- **Resolution Options**:
  - Approve full refund
  - Partial refund (custom amount)
  - Uphold deduction
  - Escalate to admin
- **Communication**: Auto-generated partner notification

## 8. Critical User Flows

### 8.1 Partner Onboarding (Maker-Checker Pattern)

**Maker Steps** (Agency/Employee):
1. **Account Creation** → Phone OTP verification
2. **Personal Information** → Name, DOB, address, selfie capture
3. **Identity Verification** → Aadhaar/passport + proof of address
4. **Employment Links** → UAN/e-Shram (optional)
5. **Vehicle Details** → (Conditional on category)
6. **Skills & Equipment** → Multi-select capabilities
7. **Payment Setup** → Bank/UPI + tax forms
8. **Training Modules** → SCORM player with quiz
9. **Work Preferences** → Zones (map) + shift hours
10. **Summary Review** → Editable before submission
11. **Maker Signoff** → Declaration & submit

**Checker Steps** (Approver):
12. **Document Verification** → Side-by-side review
13. **Background Check** → Automated API trigger
14. **Final Approval** → Activate partner profile

### 8.2 Employee Account Switching

1. Navigate to `/employee/switch-account`
2. Search by partner name/phone or business name
3. Select entity from results table
4. Confirm impersonation (audit warning)
5. Top banner shows active impersonation
6. Perform support actions in target context
7. Exit impersonation to return

### 8.3 Helmet Checkout & Return

**Checkout**:
1. Café admin scans partner card/searches phone
2. Verifies partner photo
3. Selects available helmet
4. Reviews fees & confirms
5. Prints/sends receipt

**Return**:
1. Navigate to `/cafe-admin/helmets-inventory`
2. Search helmet ID or scan
3. Inspect condition
4. Mark as returned/maintenance/lost
5. Process any damage fees

## 9. State Management Architecture

### 9.1 Redux Store Structure

```javascript
{
  auth: {
    user: { id, role, permissions },
    token: string,
    isAuthenticated: boolean,
    impersonation: { active, targetUser }
  },
  jobs: {
    list: Job[],
    filters: FilterState,
    pagination: PaginationState,
    realtime: WebSocketState
  },
  finance: {
    earnings: EarningsData,
    deductions: Deduction[],
    disputes: Dispute[],
    payouts: Payout[]
  },
  onboarding: {
    currentStep: number,
    formData: OnboardingData,
    validation: ValidationState,
    submission: SubmissionState
  },
  ui: {
    theme: 'light' | 'dark',
    locale: string,
    notifications: Notification[],
    modals: ModalState
  }
}
```

### 9.2 API Integration Pattern

```javascript
// RTK Query service example
export const jobsApi = createApi({
  reducerPath: 'jobsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/v1/jobs',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) headers.set('authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['Job', 'JobStats'],
  endpoints: (builder) => ({
    getJobs: builder.query({
      query: (filters) => ({ url: '/', params: filters }),
      providesTags: ['Job'],
    }),
    acceptJob: builder.mutation({
      query: (jobId) => ({ url: `/${jobId}/accept`, method: 'POST' }),
      invalidatesTags: ['Job', 'JobStats'],
    }),
  }),
});
```

## 10. Internationalization Strategy

### 10.1 Supported Locales
- `en-US` - English (default)
- `hi-IN` - Hindi
- `te-IN` - Telugu
- `kn-IN` - Kannada
- `ta-IN` - Tamil
- `bn-IN` - Bengali

### 10.2 Implementation Pattern

```javascript
// i18n configuration
i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en-US',
    supportedLngs: ['en-US', 'hi-IN', 'te-IN', 'kn-IN', 'ta-IN', 'bn-IN'],
    interpolation: { escapeValue: false },
    backend: { loadPath: '/locales/{{lng}}/{{ns}}.json' }
  });

// Component usage
function PartnerDashboard() {
  const { t } = useTranslation('partner');
  return <h1>{t('dashboard.title')}</h1>;
}
```

### 10.3 Content Guidelines
- Gender-neutral language
- Culturally appropriate imagery
- Number/date formatting per locale
- RTL support ready (future Arabic)

## 11. Accessibility Requirements

### 11.1 WCAG 2.2 AA Compliance
- **Perceivable**: Alt text, captions, contrast ratios (4.5:1 normal, 3:1 large)
- **Operable**: Keyboard navigation, focus indicators, skip links
- **Understandable**: Clear labels, error messages, consistent navigation
- **Robust**: Semantic HTML, ARIA landmarks, screen reader testing

### 11.2 Implementation Checklist
- [ ] Keyboard navigation for all interactive elements
- [ ] Focus management in modals/drawers
- [ ] Announce dynamic content changes
- [ ] Form validation with clear error messages
- [ ] Color not sole indicator of meaning
- [ ] Reduced motion preferences respected
- [ ] Touch targets minimum 44×44px
- [ ] Page titles and heading hierarchy

## 12. Performance Requirements

### 12.1 Core Web Vitals Targets
- **LCP** (Largest Contentful Paint): ≤2.0s desktop, ≤3.0s mobile
- **FID** (First Input Delay): ≤100ms
- **CLS** (Cumulative Layout Shift): ≤0.1

### 12.2 Optimization Strategies
- Route-based code splitting
- Lazy loading for below-fold content
- Image optimization (WebP with fallbacks)
- CDN for static assets
- Service worker for offline capability
- Virtual scrolling for large lists
- Debounced search inputs
- Memoization for expensive computations

## 13. Security & Privacy

### 13.1 Authentication & Authorization
- OAuth 2.0 flow with refresh tokens
- JWT stored in httpOnly cookies
- Role-based route guards
- Permission-based component rendering
- Session timeout after 30 minutes idle

### 13.2 Data Protection
- **PII Handling**:
  - Field-level encryption for sensitive data
  - Automatic PII redaction in exports
  - Masked display (phone: ******1234)
  - Audit logs for data access
  
- **GDPR/DPDP Compliance**:
  - Data Subject Access Request API
  - Right to erasure implementation
  - Consent management
  - Data retention policies

### 13.3 Security Headers
```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
```

## 14. Analytics & Monitoring

### 14.1 Key Events
```javascript
// User journey events
analytics.track('user_signed_in', { method: 'phone_otp', role: user.role });
analytics.track('job_accepted', { jobId, responseTime, jobType });
analytics.track('onboarding_completed', { duration, stepsCompleted });
analytics.track('dispute_resolved', { disputeId, resolution, refundAmount });

// Performance monitoring
analytics.page({ loadTime, route, userRole });
```

### 14.2 Error Tracking
- Sentry integration for runtime errors
- API error rate monitoring
- Failed validation tracking
- Network failure resilience

## 15. Development Guidelines

### 15.1 Code Standards

#### 15.1.1 General Standards
- TypeScript strict mode with `noImplicitAny` and `strictNullChecks`
- ESLint + Prettier configuration with React-specific rules
- Conventional commits following Angular specification
- Component documentation with Storybook
- Unit test coverage >80%
- E2E tests for critical paths

#### 15.1.2 React Component Architecture

**Component Organization**:
```
src/
├── components/           # Shared UI components
│   ├── ui/              # Primitive components (Button, Input, Modal)
│   ├── layout/          # Layout components (SideNav, TopBar, Shell)
│   └── domain/          # Business logic components (JobCard, PartnerProfile)
├── pages/               # Route-level components
├── hooks/               # Custom React hooks
├── stores/              # Redux slices and RTK Query APIs
├── utils/               # Pure utility functions
└── types/               # TypeScript type definitions
```

**Component Naming Conventions**:
- PascalCase for components: `PartnerDashboard`, `JobStatusBadge`
- camelCase for hooks: `useJobFilters`, `usePartnerEarnings`
- kebab-case for files: `partner-dashboard.tsx`, `job-status-badge.tsx`
- Descriptive, domain-specific names over generic terms

**Component Structure Pattern**:
```typescript
// Required component template
interface ComponentProps {
  // Props definition with JSDoc comments
  /** Primary identifier for the component */
  id: string;
  /** Optional callback for user interactions */
  onAction?: (data: ActionData) => void;
}

export const ComponentName: FC<ComponentProps> = memo(({ 
  id, 
  onAction 
}) => {
  // 1. Hooks (in order: state, context, custom, effects)
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();
  const { data } = useCustomHook(id);
  
  useEffect(() => {
    // Side effects
  }, [id]);

  // 2. Event handlers
  const handleClick = useCallback((event: MouseEvent) => {
    onAction?.(event.target.value);
  }, [onAction]);

  // 3. Computed values
  const computedValue = useMemo(() => {
    return data?.map(item => transformItem(item));
  }, [data]);

  // 4. Early returns for loading/error states
  if (isLoading) return <LoadingSpinner />;
  if (!data) return <EmptyState />;

  // 5. Main render
  return (
    <div className="component-wrapper">
      {/* JSX implementation */}
    </div>
  );
});

// Display name for debugging
ComponentName.displayName = 'ComponentName';
```

#### 15.1.3 React Best Practices

**Performance Optimization**:
- Use `React.memo()` for all functional components by default
- Implement `useCallback()` for event handlers passed as props
- Apply `useMemo()` for expensive computations
- Avoid inline objects and functions in JSX props
- Lazy load components with `React.lazy()` and `Suspense`
- Implement virtual scrolling for lists >100 items

**State Management Patterns**:
```typescript
// Prefer local state for UI-only concerns
const [isModalOpen, setIsModalOpen] = useState(false);

// Use Redux for shared/persistent state
const dispatch = useAppDispatch();
const jobsState = useAppSelector(state => state.jobs);

// Custom hooks for complex state logic
const { filters, updateFilter, resetFilters } = useJobFilters();

// Avoid prop drilling - use context sparingly
const ThemeContext = createContext<ThemeContextValue>({});
```

**Error Boundaries and Error Handling**:
```typescript
// Wrap route components with error boundaries
<ErrorBoundary fallback={<ErrorFallback />}>
  <PartnerDashboard />
</ErrorBoundary>

// Handle async errors gracefully
const { data, error, isLoading } = useQuery(endpoint, {
  onError: (error) => {
    toast.error(t('errors.loadFailed'));
    analytics.track('api_error', { endpoint, error: error.message });
  }
});
```

**Props and API Design**:
- Use discriminated unions for variant props
- Prefer explicit props over spread operators
- Include default values in destructuring
- Use generic types for reusable components
```typescript
interface BaseButtonProps {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
}

interface PrimaryButtonProps extends BaseButtonProps {
  variant: 'primary';
  size?: 'sm' | 'md' | 'lg';
}

interface IconButtonProps extends BaseButtonProps {
  variant: 'icon';
  icon: LucideIcon;
}

type ButtonProps = PrimaryButtonProps | IconButtonProps;
```

#### 15.1.4 Accessibility Implementation

**ARIA and Semantic HTML**:
```typescript
// Use semantic HTML elements
<main role="main">
  <section aria-labelledby="dashboard-title">
    <h1 id="dashboard-title">{t('dashboard.title')}</h1>
  </section>
</main>

// Provide ARIA labels for complex widgets
<div 
  role="tabpanel" 
  aria-labelledby="tab-jobs"
  aria-describedby="tab-jobs-desc"
>
  <JobsList />
</div>
```

**Keyboard Navigation**:
- Implement `onKeyDown` handlers for custom interactive elements
- Use `tabIndex={-1}` for programmatically focusable elements
- Manage focus in modals and drawers
- Provide skip links for main content areas

**Screen Reader Support**:
- Use `aria-live` regions for dynamic content updates
- Implement `aria-expanded` for collapsible sections
- Provide `alt` text for informative images
- Use `aria-label` for icon-only buttons

#### 15.1.5 Testing Patterns

**Component Testing with React Testing Library**:
```typescript
describe('PartnerDashboard', () => {
  const defaultProps = {
    partnerId: 'partner-123'
  };

  it('should display earnings summary', async () => {
    renderWithProviders(<PartnerDashboard {...defaultProps} />);
    
    expect(screen.getByRole('heading', { name: /earnings/i })).toBeInTheDocument();
    expect(await screen.findByText(/₹1,250/)).toBeInTheDocument();
  });

  it('should handle job acceptance', async () => {
    const user = userEvent.setup();
    const onJobAccept = jest.fn();
    
    renderWithProviders(
      <PartnerDashboard {...defaultProps} onJobAccept={onJobAccept} />
    );
    
    await user.click(screen.getByRole('button', { name: /accept job/i }));
    expect(onJobAccept).toHaveBeenCalledWith('job-456');
  });
});
```

**Custom Hook Testing**:
```typescript
describe('useJobFilters', () => {
  it('should update filters correctly', () => {
    const { result } = renderHook(() => useJobFilters());
    
    act(() => {
      result.current.updateFilter('status', 'active');
    });
    
    expect(result.current.filters.status).toBe('active');
  });
});
```

#### 15.1.6 Code Quality Standards

**TypeScript Usage**:
- Define strict interfaces for all props and state
- Use utility types: `Pick`, `Omit`, `Partial` for prop derivation
- Avoid `any` type - use `unknown` when type is truly unknown
- Implement type guards for runtime type checking

**Import Organization**:
```typescript
// 1. External libraries
import React, { FC, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

// 2. Internal utilities and types
import { formatCurrency } from '@/utils/format';
import type { Partner } from '@/types/partner';

// 3. UI components (ordered by hierarchy)
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { PartnerCard } from '@/components/domain/partner-card';

// 4. Relative imports
import './component-name.css';
```

**Error Prevention**:
- Use exhaustive switch statements with `never` type
- Implement null checks before object property access
- Validate external data with schemas (Zod/Yup)
- Use optional chaining and nullish coalescing operators

#### 15.1.7 Performance Monitoring

**Bundle Size Management**:
- Monitor bundle size with Webpack Bundle Analyzer
- Implement tree-shaking for unused imports
- Use dynamic imports for route-level code splitting
- Lazy load heavy dependencies (charts, maps)

**Runtime Performance**:
- Use React DevTools Profiler for component analysis
- Implement performance marks for critical user journeys
- Monitor Core Web Vitals in production
- Set up Lighthouse CI for automated audits

#### 15.1.8 Styling Standards

**Tailwind CSS Usage**:
```typescript
// Use design tokens from theme configuration
className="bg-primary-500 text-white hover:bg-primary-700"

// Prefer utility composition over custom CSS
className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md"

// Use responsive prefixes consistently
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
```

**Component Styling Patterns**:
- Co-locate styles with components using CSS modules or styled-components
- Use BEM methodology for custom CSS classes
- Implement design system variants using cva (class-variance-authority)
- Maintain consistent spacing and typography scale

### 15.2 Component Development Pattern
```typescript
interface PartnerDashboardProps {
  partnerId: string;
  onJobAccept?: (jobId: string) => void;
}

export const PartnerDashboard: FC<PartnerDashboardProps> = memo(({ 
  partnerId, 
  onJobAccept 
}) => {
  const { t } = useTranslation('partner');
  const { data: earnings } = useGetEarningsQuery(partnerId);
  
  return (
    <DashboardLayout>
      {/* Component implementation */}
    </DashboardLayout>
  );
});
```

### 15.3 Testing Strategy
- Unit tests for utilities and hooks
- Integration tests for API interactions
- Component tests with React Testing Library
- E2E tests for critical user journeys
- Visual regression with Chromatic
- Accessibility tests with axe-core

## 16. Deployment & Infrastructure

### 16.1 Environments
- **Development**: dev.upzy.in
- **Staging**: staging.upzy.in
- **Production**: app.upzy.in


### 17.2 Feature Flags
```javascript
const features = {
  'partner-benefits': { enabled: true, rollout: 100 },
  'vehicle-loans': { enabled: true, rollout: 50 },
  'voice-search': { enabled: false, rollout: 0 },
  'dark-mode': { enabled: true, rollout: 100 }
};
```

## 19. Appendices

### 19.1 Glossary
- **PII**: Personally Identifiable Information
- **EMI**: Equated Monthly Instalment  
- **IFSC**: Indian Financial System Code
- **UAN**: Universal Account Number
- **DPDP**: Digital Personal Data Protection Act
- **NPS**: Net Promoter Score
- **CSAT**: Customer Satisfaction Score



// Core User Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'PARTNER' | 'BUSINESS' | 'EMPLOYEE';
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'SUSPENDED';

// Partner-specific types
export interface Partner extends User {
  skills: string[];
  experience: number;
  rating: number;
  totalJobs: number;
  earnings: {
    today: number;
    week: number;
    month: number;
    total: number;
  };
  availability: boolean;
  location: {
    city: string;
    state: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
}

// Business-specific types
export interface Business extends User {
  companyName: string;
  industry: string;
  size: CompanySize;
  address: Address;
  activeJobs: number;
  totalSpent: number;
}

export type CompanySize = 'STARTUP' | 'SMALL' | 'MEDIUM' | 'LARGE' | 'ENTERPRISE';

// Job Types
export interface Job {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  category: JobCategory;
  type: JobType;
  duration: string;
  budget: {
    amount: number;
    currency: string;
    type: 'FIXED' | 'HOURLY';
  };
  location: Address;
  status: JobStatus;
  businessId: string;
  partnerId?: string;
  createdAt: string;
  updatedAt: string;
  deadline?: string;
}

export type JobCategory = 
  | 'DELIVERY' 
  | 'INSTALLATION' 
  | 'MAINTENANCE' 
  | 'CLEANING' 
  | 'TECH_SUPPORT' 
  | 'OTHER';

export type JobType = 'ONE_TIME' | 'RECURRING' | 'PROJECT';

export type JobStatus = 
  | 'DRAFT' 
  | 'POSTED' 
  | 'ASSIGNED' 
  | 'IN_PROGRESS' 
  | 'COMPLETED' 
  | 'CANCELLED';

// Address Type
export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

// Navigation Types
export interface NavLink {
  id: string;
  label: string;
  href: string;
  icon?: string;
  badge?: number;
}

export interface NavItem {
  id: string;
  label: string;
  href?: string;
  icon?: string;
  children?: NavLink[];
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
  remember?: boolean;
}

export interface SignupFormBase {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
}

export interface PartnerSignupForm extends SignupFormBase {
  userType: 'PARTNER';
  skills: string[];
  experience: number;
  city: string;
  state: string;
}

export interface BusinessSignupForm extends SignupFormBase {
  userType: 'BUSINESS';
  companyName: string;
  industry: string;
  companySize: CompanySize;
  address: Address;
}

export interface EmployeeSignupForm extends SignupFormBase {
  userType: 'EMPLOYEE';
  department: string;
  position: string;
  employeeId?: string;
}

export interface JobForm {
  title: string;
  description: string;
  category: JobCategory;
  type: JobType;
  duration: string;
  budget: {
    amount: number;
    type: 'FIXED' | 'HOURLY';
  };
  requirements: string[];
  location: Address;
  deadline?: string;
}

// Filter Types
export interface JobFilters {
  category?: JobCategory;
  type?: JobType;
  minBudget?: number;
  maxBudget?: number;
  location?: string;
  status?: JobStatus;
  page?: number;
  limit?: number;
}

// Error Types
export interface AppError {
  message: string;
  code?: string;
  field?: string;
}

// UI State Types
export interface LoadingState {
  isLoading: boolean;
  error?: AppError | null;
}

export interface ModalState {
  isOpen: boolean;
  type?: string | undefined;
  data?: any;
} 
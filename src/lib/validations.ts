import { z } from 'zod';

// Base user validation schema
const baseUserSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  terms: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms and conditions',
  }),
});

// Partner-specific fields
const partnerSchema = baseUserSchema.extend({
  userType: z.literal('PARTNER'),
  skills: z.array(z.string()).min(1, 'Please select at least one skill'),
  experience: z.number().min(0, 'Experience must be 0 or greater'),
  city: z.string().min(2, 'Please enter your city'),
  state: z.string().min(2, 'Please enter your state'),
});

// Business-specific fields
const businessSchema = baseUserSchema.extend({
  userType: z.literal('BUSINESS'),
  companyName: z.string().min(2, 'Company name must be at least 2 characters'),
  industry: z.string().min(2, 'Please select an industry'),
  companySize: z.enum(['STARTUP', 'SMALL', 'MEDIUM', 'LARGE', 'ENTERPRISE']),
  address: z.object({
    street: z.string().min(5, 'Please enter a valid street address'),
    city: z.string().min(2, 'Please enter your city'),
    state: z.string().min(2, 'Please enter your state'),
    zipCode: z.string().min(5, 'Please enter a valid zip code'),
  }),
});

// Employee-specific fields  
const employeeSchema = baseUserSchema.extend({
  userType: z.literal('EMPLOYEE'),
  department: z.string().min(2, 'Please enter your department'),
  position: z.string().min(2, 'Please enter your position'),
  employeeId: z.string().optional(),
});

// Union schema for all user types
export const signupSchema = z.discriminatedUnion('userType', [
  partnerSchema,
  businessSchema,
  employeeSchema,
]).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

// Login schema
export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  remember: z.boolean().optional(),
});

// Contact form schema
export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

// Export types
export type SignupFormData = z.infer<typeof signupSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type ContactFormData = z.infer<typeof contactSchema>; 
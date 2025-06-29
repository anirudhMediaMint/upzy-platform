import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppDispatch } from '../../hooks/redux';
import { useSignupMutation } from '../../services/auth-api';
import { loginSuccess } from '../../store/auth-slice';
import { signupSchema, SignupFormData } from '../../lib/validations';
import { UserRole } from '../../types';
import Button from '../../components/ui/button';
import Input from '../../components/ui/input';

const skillsOptions = [
  'Delivery', 'Installation', 'Maintenance', 'Cleaning', 'Tech Support',
  'Customer Service', 'Sales', 'Marketing', 'Design', 'Photography',
  'Writing', 'Translation', 'Tutoring', 'Fitness', 'Beauty Services'
];

const industryOptions = [
  'Technology', 'Healthcare', 'Finance', 'Education', 'Retail',
  'Manufacturing', 'Construction', 'Real Estate', 'Food & Beverage',
  'Transportation', 'Entertainment', 'Non-Profit', 'Government', 'Other'
];

const SignUp: React.FC = () => {
  const [step, setStep] = useState<'userType' | 'form'>('userType');
  const [selectedUserType, setSelectedUserType] = useState<UserRole | null>(null);
  
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [signup, { isLoading, error }] = useSignupMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      userType: selectedUserType as any,
      skills: [],
      experience: 0,
    },
  });

  const watchedSkills = watch('skills') || [];

  const handleUserTypeSelect = (userType: UserRole) => {
    setSelectedUserType(userType);
    setValue('userType', userType as any);
    setStep('form');
  };

  const onSubmit = async (data: SignupFormData) => {
    try {
      // Remove confirmPassword and terms from the data before sending
      const { confirmPassword, terms, ...signupData } = data;
      
      const result = await signup(signupData).unwrap();
      
      // Update auth state
      dispatch(loginSuccess({
        user: result.data.user,
        token: result.data.token
      }));
      
      // Redirect based on user role
      const redirectPath = `/${userType?.toLowerCase()}/dashboard`;
      navigate(redirectPath, { replace: true });
    } catch (err) {
      console.error('Signup failed:', err);
    }
  };

  const handleSkillToggle = (skill: string) => {
    const currentSkills = watchedSkills;
    const newSkills = currentSkills.includes(skill)
      ? currentSkills.filter(s => s !== skill)
      : [...currentSkills, skill];
    setValue('skills', newSkills);
    trigger('skills');
  };

  const userType = watch('userType');

  if (step === 'userType') {
    return (
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Join Upzy
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Choose your account type to get started
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {/* Partner Card */}
          <div
            onClick={() => handleUserTypeSelect('PARTNER')}
            className="relative bg-white p-6 rounded-lg border-2 border-gray-200 hover:border-primary-500 cursor-pointer transition-colors"
          >
            <div className="text-center">
              <div className="text-4xl mb-4">🔧</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Partner</h3>
              <p className="text-sm text-gray-600 mb-4">
                Offer your skills and services to businesses
              </p>
              <ul className="text-xs text-gray-500 space-y-1">
                <li>• Find flexible work opportunities</li>
                <li>• Set your own rates</li>
                <li>• Build your reputation</li>
              </ul>
            </div>
          </div>

          {/* Business Card */}
          <div
            onClick={() => handleUserTypeSelect('BUSINESS')}
            className="relative bg-white p-6 rounded-lg border-2 border-gray-200 hover:border-primary-500 cursor-pointer transition-colors"
          >
            <div className="text-center">
              <div className="text-4xl mb-4">🏢</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Business</h3>
              <p className="text-sm text-gray-600 mb-4">
                Find skilled partners for your projects
              </p>
              <ul className="text-xs text-gray-500 space-y-1">
                <li>• Post jobs and requirements</li>
                <li>• Access verified partners</li>
                <li>• Manage projects efficiently</li>
              </ul>
            </div>
          </div>

          {/* Employee Card */}
          <div
            onClick={() => handleUserTypeSelect('EMPLOYEE')}
            className="relative bg-white p-6 rounded-lg border-2 border-gray-200 hover:border-primary-500 cursor-pointer transition-colors"
          >
            <div className="text-center">
              <div className="text-4xl mb-4">👤</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Employee</h3>
              <p className="text-sm text-gray-600 mb-4">
                Join as a company team member
              </p>
              <ul className="text-xs text-gray-500 space-y-1">
                <li>• Manage your tasks</li>
                <li>• Track your schedule</li>
                <li>• Submit timesheets</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link
              to="/auth/signin"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900">
          Create your {selectedUserType?.toLowerCase()} account
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          <button
            onClick={() => setStep('userType')}
            className="font-medium text-primary-600 hover:text-primary-500"
          >
            ← Change account type
          </button>
        </p>
      </div>

      <div className="bg-white py-8 px-6 shadow sm:rounded-lg sm:px-10">
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">
                {'data' in error 
                  ? (error.data as any)?.message || 'Signup failed'
                  : 'Network error occurred'
                }
              </div>
            </div>
          )}

          {/* Basic Information */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Input
              label="First Name"
              {...register('firstName')}
              error={errors.firstName?.message}
            />
            <Input
              label="Last Name"
              {...register('lastName')}
              error={errors.lastName?.message}
            />
          </div>

          <Input
            label="Email Address"
            type="email"
            {...register('email')}
            error={errors.email?.message}
          />

          <Input
            label="Phone Number"
            type="tel"
            {...register('phone')}
            error={errors.phone?.message}
          />

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Input
              label="Password"
              type="password"
              {...register('password')}
              error={errors.password?.message}
            />
            <Input
              label="Confirm Password"
              type="password"
              {...register('confirmPassword')}
              error={errors.confirmPassword?.message}
            />
          </div>

          {/* User Type Specific Fields */}
          {userType === 'PARTNER' && (
            <>
              <div>
                <label className="form-label">Skills</label>
                <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {skillsOptions.map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => handleSkillToggle(skill)}
                      className={`px-3 py-2 text-xs rounded-md border transition-colors ${
                        watchedSkills.includes(skill)
                          ? 'bg-primary-100 border-primary-300 text-primary-800'
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
                {errors.skills && (
                  <p className="form-error">{errors.skills.message}</p>
                )}
              </div>

              <Input
                label="Years of Experience"
                type="number"
                min="0"
                {...register('experience', { valueAsNumber: true })}
                error={errors.experience?.message}
              />

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <Input
                  label="City"
                  {...register('city')}
                  error={errors.city?.message}
                />
                <Input
                  label="State"
                  {...register('state')}
                  error={errors.state?.message}
                />
              </div>
            </>
          )}

          {userType === 'BUSINESS' && (
            <>
              <Input
                label="Company Name"
                {...register('companyName')}
                error={errors.companyName?.message}
              />

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="industry" className="form-label">
                    Industry
                  </label>
                  <select
                    id="industry"
                    {...register('industry')}
                    className="form-input"
                  >
                    <option value="">Select Industry</option>
                    {industryOptions.map((industry) => (
                      <option key={industry} value={industry}>
                        {industry}
                      </option>
                    ))}
                  </select>
                  {errors.industry && (
                    <p className="form-error">{errors.industry.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="companySize" className="form-label">
                    Company Size
                  </label>
                  <select
                    id="companySize"
                    {...register('companySize')}
                    className="form-input"
                  >
                    <option value="">Select Size</option>
                    <option value="STARTUP">Startup (1-10)</option>
                    <option value="SMALL">Small (11-50)</option>
                    <option value="MEDIUM">Medium (51-200)</option>
                    <option value="LARGE">Large (201-1000)</option>
                    <option value="ENTERPRISE">Enterprise (1000+)</option>
                  </select>
                  {errors.companySize && (
                    <p className="form-error">{errors.companySize.message}</p>
                  )}
                </div>
              </div>

              <Input
                label="Street Address"
                {...register('address.street')}
                error={errors.address?.street?.message}
              />

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                <Input
                  label="City"
                  {...register('address.city')}
                  error={errors.address?.city?.message}
                />
                <Input
                  label="State"
                  {...register('address.state')}
                  error={errors.address?.state?.message}
                />
                <Input
                  label="Zip Code"
                  {...register('address.zipCode')}
                  error={errors.address?.zipCode?.message}
                />
              </div>
            </>
          )}

          {userType === 'EMPLOYEE' && (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <Input
                  label="Department"
                  {...register('department')}
                  error={errors.department?.message}
                />
                <Input
                  label="Position"
                  {...register('position')}
                  error={errors.position?.message}
                />
              </div>

              <Input
                label="Employee ID (Optional)"
                {...register('employeeId')}
                error={errors.employeeId?.message}
              />
            </>
          )}

          {/* Terms and Conditions */}
          <div className="flex items-start">
            <input
              id="terms"
              type="checkbox"
              {...register('terms')}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-1"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
              I agree to the{' '}
              <Link to="/terms" className="text-primary-600 hover:text-primary-500">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-primary-600 hover:text-primary-500">
                Privacy Policy
              </Link>
            </label>
          </div>
          {errors.terms && (
            <p className="form-error">{errors.terms.message}</p>
          )}

          <Button
            type="submit"
            loading={isLoading}
            className="w-full"
          >
            Create Account
          </Button>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                to="/auth/signin"
                className="font-medium text-primary-600 hover:text-primary-500"
              >
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp; 
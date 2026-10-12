import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  GraduationCap,
  ShieldCheck,
  Briefcase,
  Users,
  ArrowRight,
  Lock,
  Mail,
  School,
  Check,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { UserRole } from '../../types';
import { mockSchoolSettings, mockUsers } from '../../data/mockData';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(4, 'Password must be at least 4 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState<UserRole>('admin');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: mockUsers.admin.email,
      password: 'password123',
    },
  });

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    const mockUser = mockUsers[role];
    if (mockUser) {
      setValue('email', mockUser.email);
      setValue('password', 'password123');
    }
  };

  const onSubmit = async () => {
    login(selectedRole);
    showToast(`Authenticated as ${mockUsers[selectedRole]?.name}`, 'success');
    navigate(`/${selectedRole}/dashboard`);
  };

  const roleOptions: {
    id: UserRole;
    label: string;
    sublabel: string;
    user: (typeof mockUsers)[UserRole];
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    {
      id: 'admin',
      label: 'Administrator',
      sublabel: 'Dr. Adeleke',
      user: mockUsers.admin,
      icon: ShieldCheck,
    },
    {
      id: 'teacher',
      label: 'Faculty Staff',
      sublabel: 'Mr. Okafor',
      user: mockUsers.teacher,
      icon: Briefcase,
    },
    {
      id: 'student',
      label: 'Student Portal',
      sublabel: 'Amina A.',
      user: mockUsers.student,
      icon: GraduationCap,
    },
    {
      id: 'parent',
      label: 'Parent Portal',
      sublabel: 'Chief Adeyemi',
      user: mockUsers.parent,
      icon: Users,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* School Crest & Letterhead */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-brand-800 text-white shadow-xs mb-3 font-bold text-lg font-mono">
            FEA
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            {mockSchoolSettings.schoolName}
          </h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-mono">
            Student Information & Administrative Portal (SIS)
          </p>
        </div>

        {/* Login Box */}
        <div className="mt-6 bg-white dark:bg-slate-900 py-6 px-5 sm:px-8 shadow-xs rounded-xl border border-slate-200 dark:border-slate-800">
          {/* Role Selector Tabs */}
          <div className="mb-5">
            <span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 font-mono mb-2">
              Select Demo Role Profile:
            </span>
            <div className="grid grid-cols-2 gap-2">
              {roleOptions.map((rc) => {
                const Icon = rc.icon;
                const isSelected = selectedRole === rc.id;
                return (
                  <button
                    key={rc.id}
                    type="button"
                    onClick={() => handleRoleSelect(rc.id)}
                    className={`flex items-start gap-2 p-2.5 rounded-lg border text-left transition-colors ${
                      isSelected
                        ? 'border-brand-700 bg-brand-50/60 dark:bg-brand-950/60 text-brand-900 dark:text-brand-100'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-4 h-4 mt-0.5 shrink-0 text-slate-500" />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold leading-tight truncate">{rc.label}</p>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">{rc.sublabel}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Portal Email / Staff ID
              </label>
              <div className="relative rounded-md shadow-xs">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  {...register('email')}
                  className={`block w-full rounded-md border pl-9 pr-3 py-2 text-xs bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 transition-colors ${
                    errors.email
                      ? 'border-rose-400 focus:border-rose-500'
                      : 'border-slate-300 dark:border-slate-700'
                  }`}
                  placeholder="name@federalexcellence.edu.ng"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-rose-500">{errors.email.message}</p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <span className="text-[11px] text-brand-700 dark:text-brand-400 hover:underline cursor-pointer">
                  Forgot password?
                </span>
              </div>
              <div className="relative rounded-md shadow-xs">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  {...register('password')}
                  className={`block w-full rounded-md border pl-9 pr-3 py-2 text-xs bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 transition-colors ${
                    errors.password
                      ? 'border-rose-400 focus:border-rose-500'
                      : 'border-slate-300 dark:border-slate-700'
                  }`}
                  placeholder="••••••••"
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-rose-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-md shadow-xs text-xs font-semibold text-white bg-brand-800 hover:bg-brand-900 focus:outline-none transition-colors"
              >
                <span>Sign In to {roleOptions.find((r) => r.id === selectedRole)?.label}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          {/* Session Footer */}
          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 text-center text-[11px] text-slate-400 font-mono">
            Session: {mockSchoolSettings.currentSession} • {mockSchoolSettings.currentTerm}
          </div>
        </div>

        {/* Accreditation Disclaimer */}
        <p className="mt-4 text-center text-[11px] text-slate-400 font-mono">
          Federal Excellence Academy • Victoria Island, Lagos
        </p>
      </div>
    </div>
  );
};

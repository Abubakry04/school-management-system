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
  Check,
  Eye,
  EyeOff,
  Sun,
  Moon,
  HelpCircle,
  Sparkles,
  KeyRound,
  X,
  Phone,
  Shield,
  CheckCircle2,
  AlertCircle,
  Clock,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useTheme } from '../../context/ThemeContext';
import { UserRole } from '../../types';
import { mockSchoolSettings, mockUsers } from '../../data/mockData';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(4, 'Password must be at least 4 characters'),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const {
    role: activeSessionRole,
    user: activeSessionUser,
    login,
    loginWithCredentials,
    logout,
  } = useAuth();
  const { showToast } = useToast();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState<UserRole>('admin');
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotMethod, setForgotMethod] = useState<'email' | 'sms'>('email');

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
      rememberMe: true,
    },
  });

  const roleDefinitions: {
    id: UserRole;
    label: string;
    sublabel: string;
    description: string;
    user: (typeof mockUsers)[UserRole];
    icon: React.ComponentType<{ className?: string }>;
    accentColor: string;
    badgeBg: string;
  }[] = [
    {
      id: 'admin',
      label: 'Administrator',
      sublabel: 'School Leadership',
      description: 'Manage students, academic staff, financial records, approvals & settings.',
      user: mockUsers.admin,
      icon: ShieldCheck,
      accentColor: 'text-blue-600 dark:text-blue-400',
      badgeBg: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    },
    {
      id: 'teacher',
      label: 'Faculty Staff',
      sublabel: 'Teaching Staff',
      description: 'Input term grades, record daily attendance, manage lesson plans & classes.',
      user: mockUsers.teacher,
      icon: Briefcase,
      accentColor: 'text-emerald-600 dark:text-emerald-400',
      badgeBg: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    },
    {
      id: 'student',
      label: 'Student Portal',
      sublabel: 'Learners & Scholars',
      description: 'View report sheets, class timetables, fee invoices & school notices.',
      user: mockUsers.student,
      icon: GraduationCap,
      accentColor: 'text-violet-600 dark:text-violet-400',
      badgeBg: 'bg-violet-50 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300 border-violet-200 dark:border-violet-800',
    },
    {
      id: 'parent',
      label: 'Parent Portal',
      sublabel: 'Guardians & Sponsors',
      description: 'Track academic progress, monitor attendance & pay term fees for wards.',
      user: mockUsers.parent,
      icon: Users,
      accentColor: 'text-amber-600 dark:text-amber-400',
      badgeBg: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    },
  ];

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    const mockUser = mockUsers[role];
    if (mockUser) {
      setValue('email', mockUser.email);
      setValue('password', 'password123');
    }
  };

  const handleDirectDemoLogin = async (role: UserRole) => {
    setSelectedRole(role);
    const mockUser = mockUsers[role];
    if (mockUser) {
      setValue('email', mockUser.email);
      setValue('password', 'password123');
    }
    const result = await login(role);
    if (result.success && result.user) {
      showToast(`Welcome back, ${result.user.name}`, 'success');
      navigate(`/${role}/dashboard`);
    } else {
      showToast(result.error || 'Demo login failed', 'error');
    }
  };

  const onSubmit = async (values: LoginFormValues) => {
    const result = await loginWithCredentials({
      email: values.email,
      password: values.password,
      role: selectedRole,
    });

    if (result.success && result.user) {
      showToast(`Welcome back, ${result.user.name}!`, 'success');
      navigate(`/${result.user.role}/dashboard`);
    } else {
      showToast(result.error || 'Authentication failed. Please verify credentials.', 'error');
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) {
      showToast('Please enter your portal email or registration ID', 'error');
      return;
    }
    setForgotSent(true);
    showToast(
      `Password recovery instructions dispatched via ${forgotMethod.toUpperCase()} to ${forgotEmail}`,
      'success'
    );
  };

  const currentRoleConfig = roleDefinitions.find((r) => r.id === selectedRole) || roleDefinitions[0];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col lg:flex-row transition-colors">
      {/* ================= LEFT COLUMN: HERO SHOWCASE (Desktop) ================= */}
      <div className="relative hidden lg:flex lg:w-1/2 xl:w-5/12 flex-col justify-between p-10 xl:p-14 overflow-hidden border-r border-slate-200 dark:border-slate-800/80">
        {/* Campus Background Image with Deep Tint & Gradient Overlays */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
          style={{
            backgroundImage: "url('/images/academy_campus_hero.jpg')",
          }}
        />
        {/* Dynamic Dark Gradient Veil */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/85 to-brand-950/80" />

        {/* Ambient Glows */}
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/3 -right-20 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header / School Crest */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-indigo-500 flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-brand-500/30 border border-white/20">
              FEA
            </div>
            <div>
              <h2 className="font-extrabold text-white text-lg tracking-tight font-sans">
                {mockSchoolSettings.schoolName}
              </h2>
              <p className="text-xs text-brand-200/90 font-medium">
                {mockSchoolSettings.motto} • Est. {mockSchoolSettings.established}
              </p>
            </div>
          </div>

          <div className="mt-5 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-brand-100 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Academic Session: {mockSchoolSettings.currentSession}</span>
            <span className="text-white/40">•</span>
            <span className="text-amber-300 font-semibold">{mockSchoolSettings.currentTerm}</span>
          </div>
        </div>

        {/* Center Presentation: Headline & Stats */}
        <div className="relative z-10 my-auto py-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-400/20 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-4 border border-amber-400/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Integrated School Portal 3.4</span>
          </div>

          <h1 className="text-3xl xl:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Nurturing Tomorrow's Leaders Through Integrity & Knowledge.
          </h1>

          <p className="mt-4 text-sm text-slate-300 leading-relaxed max-w-lg">
            A unified, real-time portal connecting administrators, educators, students, and parents
            with instant academic records, attendance logs, and fee processing.
          </p>

          {/* Quick Stats Grid */}
          <div className="mt-8 grid grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-colors">
              <p className="text-xl xl:text-2xl font-bold text-white font-mono">2,450+</p>
              <p className="text-[11px] text-slate-300 mt-0.5 leading-tight">Enrolled Students</p>
            </div>
            <div className="p-3.5 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-colors">
              <p className="text-xl xl:text-2xl font-bold text-emerald-400 font-mono">99.4%</p>
              <p className="text-[11px] text-slate-300 mt-0.5 leading-tight">WAEC Pass Rate</p>
            </div>
            <div className="p-3.5 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-colors">
              <p className="text-xl xl:text-2xl font-bold text-amber-300 font-mono">100%</p>
              <p className="text-[11px] text-slate-300 mt-0.5 leading-tight">Verified Records</p>
            </div>
          </div>
        </div>

        {/* Bottom Principal Quote & Security Pill */}
        <div className="relative z-10 pt-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            <img
              src={mockUsers.admin.avatar}
              alt="Principal"
              className="w-11 h-11 rounded-full object-cover border-2 border-brand-400/60 shadow-md"
            />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white leading-tight truncate">
                {mockSchoolSettings.principalName}
              </p>
              <p className="text-[11px] text-brand-200/80 truncate">
                Principal & Head of Academic Council
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <div className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>256-bit SSL Encrypted • Role-Based Access</span>
            </div>
            <span>Victoria Island, Lagos</span>
          </div>
        </div>
      </div>

      {/* ================= RIGHT COLUMN: INTERACTIVE AUTH PORTAL ================= */}
      <div className="flex-1 flex flex-col justify-between py-6 px-4 sm:px-8 lg:px-12 xl:px-16 overflow-y-auto">
        {/* Top Utility Bar */}
        <div className="flex items-center justify-between">
          {/* Mobile Brand Mark */}
          <div className="flex items-center gap-2 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-brand-800 text-white font-bold flex items-center justify-center text-sm shadow-xs font-mono">
              FEA
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight block text-slate-900 dark:text-white">
                {mockSchoolSettings.schoolName}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block -mt-0.5">
                Portal v3.4
              </span>
            </div>
          </div>

          <div className="hidden lg:block">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Next Term Resumption:{' '}
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                {mockSchoolSettings.nextTermResumption}
              </span>
            </span>
          </div>

          {/* Right Action Icons: Theme Toggle & Support */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={() => setShowHelpModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
              <span>Helpdesk</span>
            </button>
          </div>
        </div>

        {/* Center Content Container */}
        <div className="w-full max-w-lg mx-auto my-6 lg:my-auto">
          {/* Active Session Notification (if already logged in) */}
          {activeSessionRole && (
            <div className="mb-6 p-4 rounded-xl bg-brand-50/80 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-800/80 flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  {activeSessionUser?.name?.charAt(0) || 'U'}
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-brand-800 dark:text-brand-200 font-semibold truncate">
                    Currently signed in as {activeSessionUser?.name}
                  </p>
                  <p className="text-[11px] text-brand-600 dark:text-brand-400 capitalize">
                    Role: {activeSessionRole}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => navigate(`/${activeSessionRole}/dashboard`)}
                  className="px-3 py-1.5 rounded-md bg-brand-700 hover:bg-brand-800 text-white text-xs font-medium shadow-xs transition-colors"
                >
                  Dashboard
                </button>
                <button
                  type="button"
                  onClick={logout}
                  className="px-2.5 py-1.5 rounded-md border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-900 text-xs transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}

          {/* Form Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Sign In to Your Account
            </h2>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
              Select your academic portal profile below or enter your registered portal credentials.
            </p>
          </div>

          {/* Role Selection Tabs */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">
                Select Account Role:
              </span>
              <span className="text-[11px] text-brand-700 dark:text-brand-400 font-medium">
                {currentRoleConfig.sublabel}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {roleDefinitions.map((roleItem) => {
                const Icon = roleItem.icon;
                const isSelected = selectedRole === roleItem.id;
                return (
                  <button
                    key={roleItem.id}
                    type="button"
                    onClick={() => handleRoleSelect(roleItem.id)}
                    className={`relative flex flex-col items-center text-center p-3 rounded-xl border transition-all ${
                      isSelected
                        ? 'border-brand-600 bg-brand-50/70 dark:bg-brand-950/60 dark:border-brand-500 shadow-xs ring-1 ring-brand-500'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center mb-1.5 transition-colors ${
                        isSelected
                          ? 'bg-brand-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span
                      className={`text-xs font-semibold leading-tight ${
                        isSelected
                          ? 'text-brand-900 dark:text-brand-100'
                          : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {roleItem.label}
                    </span>
                    {isSelected && (
                      <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-600 dark:bg-brand-400" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Role Context Helper Banner */}
            <div className="mt-2.5 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800/90 text-[11px] text-slate-600 dark:text-slate-400 flex items-center gap-2">
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium border ${currentRoleConfig.badgeBg}`}>
                {currentRoleConfig.label}
              </span>
              <span className="truncate">{currentRoleConfig.description}</span>
            </div>
          </div>

          {/* Quick 1-Click Demo Profiles Strip */}
          <div className="mb-5 p-3 rounded-xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Instant Demo Access</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">1-click login</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {roleDefinitions.map((item) => (
                <button
                  key={`demo-${item.id}`}
                  type="button"
                  onClick={() => handleDirectDemoLogin(item.id)}
                  className="flex items-center gap-2 p-2 rounded-lg bg-white dark:bg-slate-900 hover:bg-brand-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-left transition-all group shadow-2xs"
                  title={`Sign in as ${item.user.name}`}
                >
                  <img
                    src={item.user.avatar}
                    alt={item.user.name}
                    className="w-7 h-7 rounded-full object-cover shrink-0 border border-slate-200 dark:border-slate-700 group-hover:border-brand-500"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-semibold text-slate-800 dark:text-slate-200 truncate group-hover:text-brand-700 dark:group-hover:text-brand-400">
                      {item.user.name.split(' ')[0]} {item.user.name.split(' ')[1] || ''}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate capitalize">
                      {item.id} Demo
                    </p>
                  </div>
                  <ChevronRight className="w-3 h-3 text-slate-400 group-hover:text-brand-600 transition-transform group-hover:translate-x-0.5" />
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email / ID Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
              >
                Portal Email / Staff ID / Reg No.
              </label>
              <div className="relative rounded-lg shadow-2xs">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  {...register('email')}
                  className={`block w-full rounded-lg border pl-10 pr-3 py-2.5 text-xs bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600 transition-all ${
                    errors.email
                      ? 'border-rose-400 dark:border-rose-500 focus:border-rose-500'
                      : 'border-slate-300 dark:border-slate-700'
                  }`}
                  placeholder={
                    selectedRole === 'admin'
                      ? 'admin@federalexcellence.edu.ng'
                      : selectedRole === 'teacher'
                      ? 'c.okafor@federalexcellence.edu.ng'
                      : selectedRole === 'student'
                      ? 'amina.adeyemi@student.federalexcellence.edu.ng'
                      : 'guardian@mail.com'
                  }
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-xs text-rose-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.email.message}</span>
                </p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label
                  htmlFor="password"
                  className="block text-xs font-medium text-slate-700 dark:text-slate-300"
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-[11px] text-brand-700 dark:text-brand-400 hover:text-brand-800 dark:hover:text-brand-300 hover:underline cursor-pointer font-medium"
                >
                  Forgot password?
                </button>
              </div>

              <div className="relative rounded-lg shadow-2xs">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  className={`block w-full rounded-lg border pl-10 pr-10 py-2.5 text-xs bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600 transition-all ${
                    errors.password
                      ? 'border-rose-400 dark:border-rose-500 focus:border-rose-500'
                      : 'border-slate-300 dark:border-slate-700'
                  }`}
                  placeholder="Enter your portal password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 focus:outline-none"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-rose-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.password.message}</span>
                </p>
              )}
            </div>

            {/* Remember Me & Security Notice */}
            <div className="flex items-center justify-between text-xs pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  {...register('rememberMe')}
                  className="w-3.5 h-3.5 rounded border-slate-300 dark:border-slate-700 text-brand-600 focus:ring-brand-500"
                />
                <span className="text-slate-600 dark:text-slate-400">
                  Keep me signed in on this device
                </span>
              </label>

              <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
                Default: password123
              </span>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl shadow-md text-xs font-semibold text-white bg-brand-700 hover:bg-brand-800 dark:bg-brand-600 dark:hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all transform active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign In to {currentRoleConfig.label}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Session Footer Info */}
          <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400">
            <span>
              Academic Session: <strong className="text-slate-700 dark:text-slate-300">{mockSchoolSettings.currentSession}</strong>
            </span>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                SIS Live
              </span>
              <span>•</span>
              <button
                type="button"
                onClick={() => setShowHelpModal(true)}
                className="hover:text-brand-600 hover:underline"
              >
                Help & Guidelines
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Disclaimer */}
        <div className="mt-6 text-center text-[11px] text-slate-400 dark:text-slate-500">
          <p>
            © {new Date().getFullYear()} {mockSchoolSettings.schoolName}. All rights reserved.
          </p>
          <p className="mt-0.5">
            Ministry of Education Accredited School Management System • Victoria Island, Lagos
          </p>
        </div>
      </div>

      {/* ================= FORGOT PASSWORD MODAL ================= */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 relative">
            <button
              type="button"
              onClick={() => {
                setShowForgotModal(false);
                setForgotSent(false);
              }}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 text-brand-600 dark:text-brand-400 flex items-center justify-center">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Reset Portal Password
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Student, Guardian & Staff Recovery
                </p>
              </div>
            </div>

            {forgotSent ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Recovery Dispatched!
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xs mx-auto">
                  We have dispatched step-by-step verification instructions to{' '}
                  <strong className="text-slate-800 dark:text-slate-200">{forgotEmail}</strong>.
                  Please check your inbox or registered SMS.
                </p>
                <div className="pt-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotModal(false);
                      setForgotSent(false);
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-brand-700 hover:bg-brand-800 text-white text-xs font-semibold shadow-xs transition-colors"
                  >
                    Return to Login
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Enter your registered institutional email address or student registration number
                  (e.g., <span className="font-mono text-slate-700 dark:text-slate-300">FEA/2024/001</span>).
                </p>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Portal Email or Student ID
                  </label>
                  <input
                    type="text"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="e.g. c.okafor@federalexcellence.edu.ng"
                    className="block w-full rounded-lg border border-slate-300 dark:border-slate-700 px-3 py-2 text-xs bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Delivery Method
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setForgotMethod('email')}
                      className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg border text-xs font-medium transition-colors ${
                        forgotMethod === 'email'
                          ? 'border-brand-600 bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 font-semibold'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                      }`}
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Email Link</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setForgotMethod('sms')}
                      className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg border text-xs font-medium transition-colors ${
                        forgotMethod === 'sms'
                          ? 'border-brand-600 bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 font-semibold'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                      }`}
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>SMS OTP</span>
                    </button>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="flex-1 py-2.5 px-4 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 px-4 rounded-xl bg-brand-700 hover:bg-brand-800 text-white text-xs font-semibold shadow-xs transition-colors"
                  >
                    Send Recovery Instructions
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ================= HELPDESK & SUPPORT MODAL ================= */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 relative">
            <button
              type="button"
              onClick={() => setShowHelpModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 text-brand-600 dark:text-brand-400 flex items-center justify-center">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Portal Support & Helpdesk
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Federal Excellence Academy ICT Unit
                </p>
              </div>
            </div>

            <div className="space-y-3.5 text-xs text-slate-600 dark:text-slate-300">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-brand-600 dark:text-brand-400 shrink-0" />
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">Telephone Support</p>
                    <p className="text-slate-500 dark:text-slate-400">{mockSchoolSettings.phone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1 border-t border-slate-200 dark:border-slate-700/60">
                  <Mail className="w-4 h-4 text-brand-600 dark:text-brand-400 shrink-0" />
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">Registrar & Portal Email</p>
                    <p className="text-slate-500 dark:text-slate-400">{mockSchoolSettings.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1 border-t border-slate-200 dark:border-slate-700/60">
                  <Clock className="w-4 h-4 text-brand-600 dark:text-brand-400 shrink-0" />
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">Operating Hours</p>
                    <p className="text-slate-500 dark:text-slate-400">Monday – Friday: 7:30 AM – 4:30 PM WAT</p>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-blue-900 dark:text-blue-200">
                <p className="font-semibold mb-0.5">Need First-Time Login Credentials?</p>
                <p className="text-[11px] text-blue-800 dark:text-blue-300 leading-relaxed">
                  New students and guardians receive their admission letter containing their temporary
                  portal PIN and registration code. Staff accounts are provisioned by the ICT
                  Department.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowHelpModal(false)}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 text-white text-xs font-semibold shadow-xs transition-colors"
              >
                Close Helpdesk
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

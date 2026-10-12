import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Menu,
  Moon,
  Sun,
  Bell,
  LogOut,
  ChevronDown,
  UserCheck,
  Check,
  GraduationCap,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import { UserRole } from '../../types';
import { mockAnnouncements } from '../../data/mockData';

interface TopbarProps {
  onToggleSidebar: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onToggleSidebar }) => {
  const { user, role, switchRole, logout, selectedWard, wards, setSelectedWardId } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showWardMenu, setShowWardMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleRoleChange = (newRole: UserRole) => {
    switchRole(newRole);
    setShowRoleMenu(false);
    showToast(`Switched active view to ${newRole.toUpperCase()}`, 'info');
    navigate(`/${newRole}/dashboard`);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    showToast('Logged out of session', 'info');
  };

  const rolesList: { id: UserRole; title: string; subtitle: string }[] = [
    { id: 'admin', title: 'Administrator', subtitle: 'Dr. Funmilayo Adeleke' },
    { id: 'teacher', title: 'Teacher (Staff)', subtitle: 'Mr. Chukwuma Okafor' },
    { id: 'student', title: 'Student', subtitle: 'Amina Adeyemi' },
    { id: 'parent', title: 'Parent / Guardian', subtitle: 'Chief Babatunde Adeyemi' },
  ];

  return (
    <header className="sticky top-0 z-30 h-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between">
      {/* Left side: Hamburger + Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-1.5 rounded-md text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden focus:outline-none"
          aria-label="Toggle navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Clean Breadcrumb */}
        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span className="font-medium text-slate-800 dark:text-slate-200 capitalize">
            {role} Portal
          </span>
          <span>/</span>
          <span className="text-slate-600 dark:text-slate-400 capitalize">
            {location.pathname.split('/')[2] || 'Dashboard'}
          </span>
        </div>

        {/* Parent Ward Selector */}
        {role === 'parent' && selectedWard && (
          <div className="relative ml-2">
            <button
              onClick={() => setShowWardMenu(!showWardMenu)}
              className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 hover:bg-slate-200 transition-colors"
            >
              <span className="text-slate-500">Ward:</span>
              <span className="font-semibold">{selectedWard.name}</span>
              <span className="text-[10px] text-slate-500">({selectedWard.className})</span>
              <ChevronDown className="w-3 h-3 text-slate-400 ml-0.5" />
            </button>

            {showWardMenu && (
              <div className="absolute left-0 mt-1.5 w-52 rounded-lg bg-white dark:bg-slate-900 shadow-lg border border-slate-200 dark:border-slate-800 p-1.5 z-50">
                <p className="text-[10px] font-semibold text-slate-400 px-2 py-1 uppercase tracking-wider font-mono">
                  Select Ward
                </p>
                {wards.map((ward) => (
                  <button
                    key={ward.studentId}
                    onClick={() => {
                      setSelectedWardId(ward.studentId);
                      setShowWardMenu(false);
                      showToast(`Viewing dashboard for ${ward.name}`, 'info');
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-md text-xs transition-colors ${
                      ward.studentId === selectedWard.studentId
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="text-left">
                      <p className="font-medium">{ward.name}</p>
                      <p className="text-[10px] text-slate-400">{ward.className}</p>
                    </div>
                    {ward.studentId === selectedWard.studentId && (
                      <Check className="w-3.5 h-3.5 text-brand-600" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right side: Role Switcher, Dark mode, Notifications, Profile */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Role Switcher Menu */}
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 text-slate-700 dark:text-slate-200 text-xs font-medium transition-colors"
            title="Switch demo role"
          >
            <UserCheck className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden md:inline text-slate-500">Role:</span>
            <span className="font-semibold capitalize text-slate-900 dark:text-white">
              {role}
            </span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-1.5 w-56 rounded-lg bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 p-1.5 z-50">
              <div className="px-2 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider font-mono border-b border-slate-100 dark:border-slate-800 mb-1">
                Switch Environment Role
              </div>
              <div className="space-y-0.5">
                {rolesList.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => handleRoleChange(r.id)}
                    className={`w-full flex items-center justify-between p-2 rounded-md text-left text-xs transition-colors ${
                      r.id === role
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div>
                      <p className="font-medium leading-tight">{r.title}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{r.subtitle}</p>
                    </div>
                    {r.id === role && <Check className="w-3.5 h-3.5 text-brand-600" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-1.5 rounded-md text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors"
          aria-label="Toggle theme"
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-1.5 rounded-md text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-3.5 h-3.5" />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-brand-600" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-1.5 w-72 rounded-lg bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 p-2.5 z-50">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 px-1">
                <span className="text-xs font-semibold text-slate-900 dark:text-white">
                  Noticeboard Alerts
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {mockAnnouncements.length} Active
                </span>
              </div>
              <div className="py-1 space-y-1.5 max-h-60 overflow-y-auto">
                {mockAnnouncements.map((anc) => (
                  <div
                    key={anc.id}
                    className="p-2 rounded-md bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs"
                  >
                    <p className="font-medium text-slate-900 dark:text-slate-200 truncate">
                      {anc.title}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-2">
                      {anc.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        {user && (
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-7 h-7 rounded-md object-cover ring-1 ring-slate-200 dark:ring-slate-700"
            />
            <div className="hidden lg:block text-left">
              <p className="text-xs font-semibold text-slate-900 dark:text-white leading-tight truncate max-w-[120px]">
                {user.name.split(' ')[0]} {user.name.split(' ').slice(-1)[0]}
              </p>
              <p className="text-[10px] text-slate-400 font-mono truncate max-w-[120px]">
                {user.title?.split('/')[0] || user.role}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="p-1 rounded text-slate-400 hover:text-rose-600 transition-colors ml-0.5"
              title="Logout"
              aria-label="Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Menu,
  Moon,
  Sun,
  Bell,
  LogOut,
  ChevronDown,
  Search,
  Check,
  User,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import { UserRole } from '../../types';
import { mockAnnouncements } from '../../data/mockData';

interface TopbarProps {
  onToggleSidebar: () => void;
}

const ROLES_LIST: { id: UserRole; label: string }[] = [
  { id: 'admin', label: 'Admin' },
  { id: 'teacher', label: 'Teacher' },
  { id: 'student', label: 'Student' },
  { id: 'parent', label: 'Parent' },
];

export const Topbar: React.FC<TopbarProps> = ({ onToggleSidebar }) => {
  const { user, role, switchRole, logout, selectedWard, wards, setSelectedWardId } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showWardMenu, setShowWardMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleRoleChange = (newRole: UserRole) => {
    switchRole(newRole);
    showToast(`Switched active view to ${newRole.toUpperCase()}`, 'info');
    navigate(`/${newRole}/dashboard`);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    showToast('Logged out of session', 'info');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const q = searchQuery.toLowerCase();
    if (q.includes('teach') || q.includes('staff')) {
      navigate('/admin/teachers');
    } else if (q.includes('class')) {
      navigate('/admin/classes');
    } else if (q.includes('attend')) {
      navigate('/admin/attendance');
    } else if (q.includes('report') || q.includes('grade')) {
      navigate('/admin/results');
    } else {
      navigate(`/admin/students?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const userInitials = user?.name
    ? user.name
        .replace(/Dr\.|Mrs\.|Mr\.|Chief|\(|\)|,|\./gi, '')
        .trim()
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((n) => n[0].toUpperCase())
        .join('') || 'FA'
    : 'FA';

  return (
    <header className="sticky top-0 z-30 h-20 bg-[#f4f6f5]/90 dark:bg-slate-950/90 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between border-b border-[#e5eae6]/60 dark:border-slate-800">
      {/* Left side: Mobile menu toggle + Search bar */}
      <div className="flex items-center gap-3 sm:gap-4 flex-1 max-w-xl">
        <button
          onClick={onToggleSidebar}
          className="p-2.5 rounded-xl text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-white dark:bg-slate-900 border border-[#e1e7e3] dark:border-slate-800 lg:hidden focus:outline-none shadow-xs"
          aria-label="Toggle navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar matching Figma */}
        <form onSubmit={handleSearchSubmit} className="relative w-full max-w-[170px] xs:max-w-xs sm:max-w-md">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 bg-[#eaf0ec] dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm rounded-xl border border-transparent focus:border-emerald-600 focus:bg-white dark:focus:bg-slate-900 transition-all placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
        </form>
      </div>

      {/* Right side: Segmented Role Pills, Notification bell, Avatar */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Parent Ward Selector if in parent view */}
        {role === 'parent' && selectedWard && (
          <div className="relative hidden md:block">
            <button
              onClick={() => setShowWardMenu(!showWardMenu)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-[#e1e7e3] dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 hover:bg-slate-50 transition-colors shadow-xs"
            >
              <span className="text-slate-400">Ward:</span>
              <span className="font-semibold">{selectedWard.name}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showWardMenu && (
              <div className="absolute left-0 mt-1.5 w-52 rounded-xl bg-white dark:bg-slate-900 shadow-lg border border-slate-200 dark:border-slate-800 p-1.5 z-50">
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
                    className={`w-full flex items-center justify-between p-2 rounded-lg text-xs transition-colors ${
                      ward.studentId === selectedWard.studentId
                        ? 'bg-emerald-50 dark:bg-slate-800 text-emerald-800 dark:text-white font-semibold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="text-left">
                      <p className="font-medium">{ward.name}</p>
                      <p className="text-[10px] text-slate-400">{ward.className}</p>
                    </div>
                    {ward.studentId === selectedWard.studentId && (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Segmented Control Role Switcher matching Figma */}
        <div className="hidden sm:flex items-center p-1 bg-[#e4ede7] dark:bg-slate-900 rounded-xl border border-[#dce6df] dark:border-slate-800">
          {ROLES_LIST.map((r) => {
            const isActive = role === r.id;
            return (
              <button
                key={r.id}
                onClick={() => handleRoleChange(r.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {r.label}
              </button>
            );
          })}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-white dark:bg-slate-900 border border-[#e1e7e3] dark:border-slate-800 shadow-xs transition-colors"
          aria-label="Toggle theme"
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </button>

        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 border border-[#e1e7e3] dark:border-slate-800 shadow-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors relative"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-emerald-600 ring-2 ring-white dark:ring-slate-900" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] sm:w-80 max-w-sm rounded-2xl bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 px-1">
                <span className="text-xs font-semibold text-slate-900 dark:text-white">
                  Noticeboard & Alerts
                </span>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  {mockAnnouncements.length} New
                </span>
              </div>
              <div className="py-2 space-y-2 max-h-64 overflow-y-auto">
                {mockAnnouncements.map((anc) => (
                  <div
                    key={anc.id}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs hover:border-emerald-300 transition-colors"
                  >
                    <p className="font-semibold text-slate-900 dark:text-slate-200 truncate">
                      {anc.title}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                      {anc.content}
                    </p>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      {anc.date} · {anc.authorRole}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Avatar matching Figma: Green squircle with dynamic initials */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="w-10 h-10 rounded-xl bg-[#93bfae] hover:bg-[#85b5a3] text-[#143d30] font-bold text-sm flex items-center justify-center shadow-xs transition-transform active:scale-95 focus:outline-none"
            title={`${user?.name || 'Account'} (Settings)`}
          >
            {userInitials}
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] sm:w-64 max-w-xs rounded-2xl bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="p-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#93bfae] text-[#143d30] font-bold text-sm flex items-center justify-center shrink-0">
                    {userInitials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {user?.name || 'Portal User'}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {user?.email || 'admin@federalexcellence.edu.ng'}
                    </p>
                  </div>
                </div>
                <div className="mt-2.5 inline-block text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {(role || 'admin').toUpperCase()} · Federal Excellence
                </div>
              </div>

              {/* Mobile Role Switcher */}
              <div className="p-2 sm:hidden border-b border-slate-100 dark:border-slate-800">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 px-2 mb-1.5">
                  Switch Active Role
                </p>
                <div className="grid grid-cols-2 gap-1">
                  {ROLES_LIST.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => {
                        handleRoleChange(r.id);
                        setShowProfileMenu(false);
                      }}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-medium text-left ${
                        role === r.id
                          ? 'bg-emerald-600 text-white font-semibold'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-1 space-y-0.5">
                <button
                  onClick={() => {
                    navigate('/admin/settings');
                    setShowProfileMenu(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <User className="w-4 h-4 text-slate-500" />
                  <span>Account & Portal Settings</span>
                </button>
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign out of session</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

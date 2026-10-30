import React, { useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Home,
  Users,
  GraduationCap,
  BookOpen,
  CalendarCheck,
  BarChart3,
  MessageSquare,
  Settings,
  CreditCard,
  Calendar,
  X,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import { UserRole } from '../../types';

interface SidebarProps {
  role: UserRole;
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({ role, isOpen, onClose }) => {
  const navigate = useNavigate();
  const { switchRole } = useAuth();

  // Lock body scroll when mobile drawer is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  // Admin Sections matching Figma strictly
  const adminSections: NavSection[] = [
    {
      title: 'WORKSPACE',
      items: [
        { label: 'Overview', path: '/admin/dashboard', icon: Home },
        { label: 'Students', path: '/admin/students', icon: Users },
        { label: 'Teachers', path: '/admin/teachers', icon: GraduationCap },
        { label: 'Classes', path: '/admin/classes', icon: BookOpen },
        { label: 'Attendance', path: '/admin/attendance', icon: CalendarCheck },
        { label: 'Reports', path: '/admin/results', icon: BarChart3 },
        { label: 'Messages', path: '/admin/announcements', icon: MessageSquare, badge: 2 },
        { label: 'Settings', path: '/admin/settings', icon: Settings },
      ],
    },
    {
      title: 'FINANCE & SCHEDULE',
      items: [
        { label: 'Bursary & Fees', path: '/admin/fees', icon: CreditCard },
        { label: 'Timetable', path: '/admin/timetable', icon: Calendar },
      ],
    },
  ];

  const teacherSections: NavSection[] = [
    {
      title: 'WORKSPACE',
      items: [
        { label: 'Overview', path: '/teacher/dashboard', icon: Home },
        { label: 'Assigned Classes', path: '/teacher/classes', icon: BookOpen },
        { label: 'Attendance', path: '/teacher/attendance', icon: CalendarCheck },
        { label: 'Gradebook', path: '/teacher/grades', icon: BarChart3 },
        { label: 'Timetable', path: '/teacher/timetable', icon: Calendar },
        { label: 'Noticeboard', path: '/teacher/announcements', icon: MessageSquare, badge: 1 },
      ],
    },
  ];

  const studentSections: NavSection[] = [
    {
      title: 'WORKSPACE',
      items: [
        { label: 'Overview', path: '/student/dashboard', icon: Home },
        { label: 'Report Card', path: '/student/results', icon: BarChart3 },
        { label: 'Attendance Log', path: '/student/attendance', icon: CalendarCheck },
        { label: 'Timetable', path: '/student/timetable', icon: Calendar },
        { label: 'Clearance & Fees', path: '/student/fees', icon: CreditCard },
        { label: 'Circulars', path: '/student/announcements', icon: MessageSquare },
      ],
    },
  ];

  const parentSections: NavSection[] = [
    {
      title: 'WORKSPACE',
      items: [
        { label: 'Overview', path: '/parent/dashboard', icon: Home },
        { label: "Ward's Report", path: '/parent/results', icon: BarChart3 },
        { label: 'Attendance', path: '/parent/attendance', icon: CalendarCheck },
        { label: 'Fee Receipts', path: '/parent/fees', icon: CreditCard },
        { label: 'PTA Notices', path: '/parent/announcements', icon: MessageSquare },
      ],
    },
  ];

  const sectionsMap: Record<UserRole, NavSection[]> = {
    admin: adminSections,
    teacher: teacherSections,
    student: studentSections,
    parent: parentSections,
  };

  const sections = sectionsMap[role] || [];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Shell */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 lg:w-64 max-w-[85vw] bg-[#153e31] text-[#93b7aa] flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-20 px-5 sm:px-6 flex items-center justify-between border-b border-[#1f4a3c]/60">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-white text-[#153e31] flex items-center justify-center shadow-xs shrink-0 font-bold text-sm tracking-wider">
              FEA
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-sm sm:text-base text-white tracking-tight leading-tight truncate">
                Federal Excellence
              </span>
              <span className="text-[10px] text-[#93b7aa] uppercase tracking-wider font-mono">
                {role} SIS Portal
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl text-[#93b7aa] hover:text-white bg-white/5 hover:bg-white/10 flex items-center justify-center lg:hidden transition-colors"
            aria-label="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-6">
          {sections.map((section) => (
            <div key={section.title} className="space-y-1">
              <h4 className="px-3 text-[11px] font-semibold uppercase tracking-wider text-[#638e7f]">
                {section.title}
              </h4>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => {
                        if (window.innerWidth < 1024) onClose();
                      }}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                          isActive
                            ? 'bg-[#224d3e] text-white shadow-xs'
                            : 'text-[#92b5a8] hover:bg-[#1a4637] hover:text-white'
                        }`
                      }
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Icon className="w-5 h-5 shrink-0" />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge !== undefined && (
                        <span className="w-5 h-5 rounded-full bg-[#e76f51] text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Help Widget matching Figma bottom-left card */}
        {/* <div className="p-4">
          <div className="rounded-2xl bg-[#1c483a]/80 border border-[#275645] p-3.5 text-white shadow-xs">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#275645] flex items-center justify-center shrink-0">
                <HelpCircle className="w-4 h-4 text-[#a3cbbd]" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-white">Need any help?</p>
                <p className="text-[11px] text-[#9dc2b4] mt-0.5 leading-snug">
                  Reach FEA portal support 24/7
                </p>
                <button
                  onClick={() => alert('FEA SIS Support: info@federalexcellence.edu.ng | +234 803 456 7890')}
                  className="mt-2 text-[11px] font-medium text-emerald-300 hover:text-white underline flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Support Center</span>
                </button>
              </div>
            </div>
          </div>
        </div> */}

        {/* Mobile Quick Role Switcher */}
        <div className="p-4 border-t border-[#1f4a3c]/60 lg:hidden bg-[#103227]/40">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#638e7f] mb-2 font-mono">
            Switch Portal Role
          </p>
          <div className="grid grid-cols-2 gap-1.5">
            {(['admin', 'teacher', 'student', 'parent'] as UserRole[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => {
                  switchRole(r);
                  onClose();
                  navigate(`/${r}/dashboard`);
                }}
                className={`py-2 px-2.5 rounded-xl text-xs font-semibold capitalize text-center transition-all active:scale-95 ${
                  role === r
                    ? 'bg-white text-[#153e31] shadow-xs'
                    : 'bg-[#1c483a] text-[#a3cbbd] hover:text-white hover:bg-[#235847]'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
};

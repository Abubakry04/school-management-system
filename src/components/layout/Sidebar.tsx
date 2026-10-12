import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  CalendarCheck,
  Award,
  CreditCard,
  Calendar,
  Megaphone,
  Settings,
  ClipboardList,
  FileSpreadsheet,
  X,
  School,
  Building2,
} from 'lucide-react';
import { UserRole } from '../../types';
import { mockSchoolSettings } from '../../data/mockData';

interface SidebarProps {
  role: UserRole;
  isOpen: boolean;
  onClose: () => void;
}

interface NavSection {
  title: string;
  items: {
    label: string;
    path: string;
    icon: React.ComponentType<{ className?: string }>;
  }[];
}

export const Sidebar: React.FC<SidebarProps> = ({ role, isOpen, onClose }) => {
  const adminSections: NavSection[] = [
    {
      title: 'Overview',
      items: [
        { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
      ],
    },
    {
      title: 'Academics & Faculty',
      items: [
        { label: 'Student Directory', path: '/admin/students', icon: GraduationCap },
        { label: 'Faculty & Staff', path: '/admin/teachers', icon: Users },
        { label: 'Classes & Arms', path: '/admin/classes', icon: BookOpen },
        { label: 'Broadsheet & Results', path: '/admin/results', icon: Award },
        { label: 'School Timetable', path: '/admin/timetable', icon: Calendar },
      ],
    },
    {
      title: 'Operations & Finance',
      items: [
        { label: 'Attendance Monitor', path: '/admin/attendance', icon: CalendarCheck },
        { label: 'Bursary & Fees', path: '/admin/fees', icon: CreditCard },
        { label: 'School Broadcasts', path: '/admin/announcements', icon: Megaphone },
      ],
    },
    {
      title: 'Configuration',
      items: [
        { label: 'Portal Settings', path: '/admin/settings', icon: Settings },
      ],
    },
  ];

  const teacherSections: NavSection[] = [
    {
      title: 'Overview',
      items: [
        { label: 'Dashboard', path: '/teacher/dashboard', icon: LayoutDashboard },
      ],
    },
    {
      title: 'Classroom & Scoring',
      items: [
        { label: 'Assigned Classes', path: '/teacher/classes', icon: BookOpen },
        { label: 'Mark Attendance', path: '/teacher/attendance', icon: ClipboardList },
        { label: 'Enter CA & Exam Scores', path: '/teacher/grades', icon: FileSpreadsheet },
        { label: 'Teaching Timetable', path: '/teacher/timetable', icon: Calendar },
      ],
    },
    {
      title: 'Communications',
      items: [
        { label: 'Staff Noticeboard', path: '/teacher/announcements', icon: Megaphone },
      ],
    },
  ];

  const studentSections: NavSection[] = [
    {
      title: 'Overview',
      items: [
        { label: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
      ],
    },
    {
      title: 'Academic Records',
      items: [
        { label: 'Terminal Report Card', path: '/student/results', icon: Award },
        { label: 'Attendance Log', path: '/student/attendance', icon: CalendarCheck },
        { label: 'Class Timetable', path: '/student/timetable', icon: Calendar },
      ],
    },
    {
      title: 'Clearance & Notices',
      items: [
        { label: 'Bursary Clearance', path: '/student/fees', icon: CreditCard },
        { label: 'Student Circulars', path: '/student/announcements', icon: Megaphone },
      ],
    },
  ];

  const parentSections: NavSection[] = [
    {
      title: 'Overview',
      items: [
        { label: 'Parent Dashboard', path: '/parent/dashboard', icon: LayoutDashboard },
      ],
    },
    {
      title: 'Ward Dossier',
      items: [
        { label: "Child's Report Card", path: '/parent/results', icon: Award },
        { label: "Child's Attendance", path: '/parent/attendance', icon: CalendarCheck },
      ],
    },
    {
      title: 'Bursary & PTA',
      items: [
        { label: 'Fee Invoices & Receipts', path: '/parent/fees', icon: CreditCard },
        { label: 'PTA Circulars', path: '/parent/announcements', icon: Megaphone },
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
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Shell */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-60 bg-slate-900 text-slate-300 border-r border-slate-800 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Institutional Branding Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-md bg-brand-700 flex items-center justify-center text-white shrink-0 font-bold text-sm tracking-wider">
              FEA
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-semibold text-xs text-white leading-tight truncate">
                Federal Excellence
              </span>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">
                {role} SIS Portal
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white lg:hidden"
            aria-label="Close navigation"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Academic Session Bar */}
        <div className="px-4 py-2 border-b border-slate-800/80 bg-slate-900/80 flex items-center justify-between text-[11px] text-slate-400">
          <span className="font-mono">{mockSchoolSettings.currentSession}</span>
          <span className="px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-medium">
            {mockSchoolSettings.currentTerm}
          </span>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4 text-xs">
          {sections.map((section) => (
            <div key={section.title} className="space-y-1">
              <h4 className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500 font-mono">
                {section.title}
              </h4>
              <div className="space-y-0.5">
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
                        `flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                          isActive
                            ? 'bg-brand-700 text-white font-semibold'
                            : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                        }`
                      }
                    >
                      <Icon className="w-4 h-4 shrink-0 opacity-80" />
                      <span className="truncate">{item.label}</span>
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Institutional Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/40 text-[11px] text-slate-500 flex items-center justify-between font-mono">
          <span>v2.4.0 (Live)</span>
          <span>SIS Lagos</span>
        </div>
      </aside>
    </>
  );
};

import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { Topbar } from '../components/layout/Topbar';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

interface DashboardLayoutProps {
  role: UserRole;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ role }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#f4f6f5] dark:bg-slate-950 flex flex-col font-sans print:bg-white">
      {/* Sidebar for this role */}
      <div className="no-print">
        <Sidebar
          role={role}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      </div>

      {/* Main Content Area */}
      <div className="lg:pl-64 flex flex-col flex-1 min-w-0 print:pl-0">
        <div className="no-print">
          <Topbar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
        </div>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-300 print:p-0 print:max-w-none">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

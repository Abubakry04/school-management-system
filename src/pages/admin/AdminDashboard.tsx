import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  Users,
  CreditCard,
  CalendarCheck,
  UserPlus,
  PlusCircle,
  FileSpreadsheet,
  ArrowUpRight,
  Megaphone,
  BookOpen,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { StatCard } from '../../components/ui/StatCard';
import { Badge } from '../../components/ui/Badge';
import {
  mockDashboardStats,
  attendanceTrendData,
  termFeeCollectionData,
  mockAnnouncements,
  mockSchoolSettings,
} from '../../data/mockData';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const stats = mockDashboardStats.admin;

  return (
    <div className="space-y-6">
      {/* Page Header & Operational Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Institutional Overview
            </h1>
            <Badge variant="brand" size="sm">
              {mockSchoolSettings.currentSession} • {mockSchoolSettings.currentTerm}
            </Badge>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {mockSchoolSettings.schoolName} • Student Information & Financial Operations
          </p>
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => navigate('/admin/students')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-brand-700 hover:bg-brand-800 text-white shadow-xs transition-colors"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Enroll Student</span>
          </button>
          <button
            onClick={() => navigate('/admin/fees')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition-colors"
          >
            <CreditCard className="w-3.5 h-3.5 text-slate-500" />
            <span>Record Payment</span>
          </button>
          <button
            onClick={() => navigate('/admin/attendance')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition-colors"
          >
            <CalendarCheck className="w-3.5 h-3.5 text-slate-500" />
            <span>Roll Call</span>
          </button>
          <button
            onClick={() => navigate('/admin/announcements')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5 text-slate-500" />
            <span>Post Circular</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Enrollment"
          value={stats.totalStudents}
          icon={GraduationCap}
          trend={{ value: '+4.2% term', positive: true }}
          subtitle="JSS 1 to SS 3 arms"
          onClick={() => navigate('/admin/students')}
        />
        <StatCard
          title="Academic Faculty"
          value={stats.totalTeachers}
          icon={Users}
          trend={{ value: '100% active', positive: true }}
          subtitle="28 teaching staff"
          onClick={() => navigate('/admin/teachers')}
        />
        <StatCard
          title="Bursary Revenue"
          value={`₦${(stats.totalFeesCollected / 1000000).toFixed(2)}M`}
          icon={CreditCard}
          trend={{ value: '87.2% collected', positive: true }}
          subtitle={`₦${(stats.outstandingFees / 1000000).toFixed(2)}M outstanding`}
          onClick={() => navigate('/admin/fees')}
        />
        <StatCard
          title="Today's Attendance"
          value={`${stats.attendanceRate}%`}
          icon={CalendarCheck}
          trend={{ value: '+1.5% weekly', positive: true }}
          subtitle="Benchmark: 85.0%"
          onClick={() => navigate('/admin/attendance')}
        />
      </div>

      {/* Analytical Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Weekly Attendance Trend Chart */}
        <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Weekly Student Attendance Rate
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Week 6 aggregate daily check-ins
              </p>
            </div>
            <button
              onClick={() => navigate('/admin/attendance')}
              className="text-xs font-medium text-brand-700 dark:text-brand-400 hover:underline flex items-center gap-1"
            >
              <span>Detailed Log</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={attendanceTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="attendanceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0f71e6" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#0f71e6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.6} />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis domain={[80, 100]} stroke="#94a3b8" fontSize={11} tickLine={false} unit="%" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #1e293b',
                    borderRadius: '6px',
                    color: '#fff',
                    fontSize: '11px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="attendance"
                  stroke="#0f71e6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#attendanceGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Fee Inflow Chart */}
        <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Bursary Revenue Collection (₦ Millions)
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Monthly tuition & levy receipts vs target
              </p>
            </div>
            <button
              onClick={() => navigate('/admin/fees')}
              className="text-xs font-medium text-brand-700 dark:text-brand-400 hover:underline flex items-center gap-1"
            >
              <span>Ledger</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={termFeeCollectionData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.6} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(val) => `₦${val / 1000000}M`}
                />
                <Tooltip
                  formatter={(val: any) => [`₦${Number(val || 0).toLocaleString()}`, 'Amount']}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #1e293b',
                    borderRadius: '6px',
                    color: '#fff',
                    fontSize: '11px',
                  }}
                />
                <Bar dataKey="collected" fill="#0f71e6" radius={[3, 3, 0, 0]} name="Collected" />
                <Bar dataKey="target" fill="#cbd5e1" radius={[3, 3, 0, 0]} name="Target" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Operational Modules & Broadcasts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent Circulars */}
        <div className="lg:col-span-2 p-4 sm:p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
            <div className="flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-slate-500" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Official School Circulars
              </h3>
            </div>
            <button
              onClick={() => navigate('/admin/announcements')}
              className="text-xs font-medium text-brand-700 dark:text-brand-400 hover:underline"
            >
              All Circulars &rarr;
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {mockAnnouncements.slice(0, 3).map((item) => (
              <div key={item.id} className="py-3 first:pt-0 last:pb-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h4 className="text-xs font-semibold text-slate-900 dark:text-white">
                    {item.title}
                  </h4>
                  <Badge
                    variant={item.priority === 'High' ? 'danger' : 'neutral'}
                    size="sm"
                  >
                    {item.priority}
                  </Badge>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                  {item.content}
                </p>
                <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>Target: {item.targetAudience}</span>
                  <span>{item.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Operational Directory */}
        <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Management Modules
            </h3>
            <p className="text-[11px] text-slate-400 mb-3">
              Direct access to administrative workflows
            </p>

            <div className="space-y-1.5">
              <button
                onClick={() => navigate('/admin/classes')}
                className="w-full flex items-center justify-between p-2 rounded-md border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                  Classes & Arms Allocation
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
              <button
                onClick={() => navigate('/admin/results')}
                className="w-full flex items-center justify-between p-2 rounded-md border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <FileSpreadsheet className="w-3.5 h-3.5 text-slate-500" />
                  Examination Broadsheet
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
              <button
                onClick={() => navigate('/admin/timetable')}
                className="w-full flex items-center justify-between p-2 rounded-md border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <CalendarCheck className="w-3.5 h-3.5 text-slate-500" />
                  Master Weekly Schedule
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
              <button
                onClick={() => navigate('/admin/settings')}
                className="w-full flex items-center justify-between p-2 rounded-md border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <GraduationCap className="w-3.5 h-3.5 text-slate-500" />
                  Academic Calendar Dates
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 mt-3 text-[11px] text-slate-400 text-center font-mono">
            FEA SIS Portal • Accredited System
          </div>
        </div>
      </div>
    </div>
  );
};

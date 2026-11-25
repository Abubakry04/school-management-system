import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Award,
  CalendarCheck,
  CreditCard,
  ArrowRight,
  Megaphone,
  Check,
  GraduationCap,
} from 'lucide-react';
import { StatCard } from '../../components/ui/StatCard';
import { Badge } from '../../components/ui/Badge';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { EmptyState } from '../../components/ui/EmptyState';
import { WardDropdown } from '../../components/parent/WardDropdown';

export const ParentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { selectedWard, wards, setSelectedWardId, user, switchRole } = useAuth();
  const { announcements, settings } = useData();
  const { showToast } = useToast();

  const activeWard = selectedWard || wards[0];

  if (!activeWard) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Parent & Guardian Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {settings.schoolName} • Academic Session {settings.currentSession}
          </p>
        </div>

        <div className="p-8 sm:p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm max-w-2xl mx-auto space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center mx-auto">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              No Enrolled Wards Linked
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
              There are currently no active students registered under this parent profile. When students are enrolled or assigned to your guardian credentials, their progress reports, attendance, and fee clearances will display here.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                switchRole('admin');
                navigate('/admin/students');
              }}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-brand-600 hover:bg-brand-700 text-white shadow-sm transition-colors"
            >
              Switch to Admin Console
            </button>
            <button
              onClick={() => navigate('/parent/announcements')}
              className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              View PTA Circulars
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header and Ward Dropdown */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Parent & Guardian Portal
            </h1>
            <Badge variant="brand" size="sm">
              {wards.length} Ward{wards.length !== 1 ? 's' : ''} Enrolled
            </Badge>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Account: {user?.name || 'Chief Babatunde Adeyemi, FCA'}
          </p>
        </div>

        {/* Touch-sensitive Ward Dropdown */}
        <WardDropdown />
      </div>

      {/* Selected Child KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={`${activeWard.name.split(' ')[0]}'s Average`}
          value={`${activeWard.averageGrade}%`}
          icon={Award}
          trend={{ value: 'Distinction', positive: true }}
          subtitle="2nd Term Evaluation"
          onClick={() => navigate('/parent/results')}
        />
        <StatCard
          title="Attendance Log"
          value={`${activeWard.attendancePercentage}%`}
          icon={CalendarCheck}
          trend={{ value: 'Punctual', positive: true }}
          subtitle="Morning Gatehouse Log"
          onClick={() => navigate('/parent/attendance')}
        />
        <StatCard
          title="Current Arm"
          value={activeWard.className}
          icon={Users}
          subtitle={`Adm: ${activeWard.admissionNo}`}
        />
        <StatCard
          title="Bursary Balance"
          value={activeWard.feeBalance > 0 ? `₦${activeWard.feeBalance.toLocaleString()}` : 'Cleared'}
          icon={CreditCard}
          trend={activeWard.feeBalance > 0 ? { value: 'Due', positive: false } : { value: 'Paid in full', positive: true }}
          subtitle={activeWard.feeBalance > 0 ? 'Requires settlement' : 'Official clearance valid'}
          onClick={() => navigate('/parent/fees')}
        />
      </div>

      {/* Wards Directory & PTA Circulars */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 p-4 sm:p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Enrolled Children Status
            </h2>
            <span className="text-xs text-slate-400 font-mono">
              Academic Session {settings.currentSession}
            </span>
          </div>

          <div className="space-y-2">
            {wards.map((ward) => (
              <div
                key={ward.studentId}
                onClick={() => {
                  setSelectedWardId(ward.studentId);
                  navigate('/parent/results');
                }}
                className={`p-3.5 rounded-lg border transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  ward.studentId === activeWard.studentId
                    ? 'border-brand-500 bg-brand-50/20 dark:bg-brand-950/20'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={ward.avatar}
                    alt={ward.name}
                    className="w-10 h-10 rounded-md object-cover ring-1 ring-slate-200"
                  />
                  <div>
                    <h3 className="font-semibold text-xs text-slate-900 dark:text-white">
                      {ward.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 font-mono">
                      {ward.className} • Adm: {ward.admissionNo}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Average</span>
                    <strong className="text-slate-900 dark:text-white">{ward.averageGrade}%</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Fees</span>
                    <Badge variant={ward.feeBalance === 0 ? 'success' : 'danger'} size="sm">
                      {ward.feeBalance === 0 ? 'Cleared' : `₦${ward.feeBalance.toLocaleString()} Due`}
                    </Badge>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PTA Circulars */}
        <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                PTA & General Circulars
              </h3>
              <Megaphone className="w-3.5 h-3.5 text-slate-400" />
            </div>

            <div className="space-y-2.5">
              {announcements.filter((a) => a.targetAudience === 'Parents' || a.targetAudience === 'All').length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">No PTA notices published.</p>
              ) : (
                announcements
                  .filter((a) => a.targetAudience === 'Parents' || a.targetAudience === 'All')
                  .slice(0, 3)
                  .map((a) => (
                    <div key={a.id} className="p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 text-xs">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="font-semibold text-slate-900 dark:text-white truncate">{a.title}</span>
                        <Badge variant={a.priority === 'High' ? 'danger' : 'neutral'} size="sm">{a.priority}</Badge>
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-2">{a.content}</p>
                    </div>
                  ))
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 mt-3 text-center">
            <button
              onClick={() => navigate('/parent/announcements')}
              className="text-xs font-medium text-brand-700 dark:text-brand-400 hover:underline"
            >
              Noticeboard Archive &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

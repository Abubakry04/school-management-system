import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  CalendarCheck,
  FileSpreadsheet,
  Calendar,
  Clock,
  Megaphone,
  CheckCircle2,
} from 'lucide-react';
import { StatCard } from '../../components/ui/StatCard';
import { Badge } from '../../components/ui/Badge';
import {
  mockDashboardStats,
  mockTimetableSlots,
  mockAnnouncements,
  mockUsers,
  mockSchoolSettings,
} from '../../data/mockData';

export const TeacherDashboard: React.FC = () => {
  const navigate = useNavigate();
  const teacherUser = mockUsers.teacher;
  const stats = mockDashboardStats.teacher;

  const todayClasses = mockTimetableSlots.filter(
    (s) => s.day === 'Monday' && s.teacherId === 'tch-01'
  );

  return (
    <div className="space-y-6">
      {/* Header and Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Faculty Workspace
            </h1>
            <Badge variant="brand" size="sm">
              Staff ID: FEA/STF/004
            </Badge>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {teacherUser.name} • {teacherUser.title}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => navigate('/teacher/attendance')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-brand-700 hover:bg-brand-800 text-white shadow-xs transition-colors"
          >
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>Mark Morning Attendance</span>
          </button>
          <button
            onClick={() => navigate('/teacher/grades')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-slate-500" />
            <span>Enter Assessment Scores</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Students"
          value={stats.assignedStudents}
          icon={BookOpen}
          subtitle="SS 2 & SS 3 Science"
          onClick={() => navigate('/teacher/classes')}
        />
        <StatCard
          title="Form Master Role"
          value="SS 2 Science"
          icon={CalendarCheck}
          subtitle="31 enrolled pupils"
          onClick={() => navigate('/teacher/classes')}
        />
        <StatCard
          title="Today's Teaching Load"
          value={`${todayClasses.length} Periods`}
          icon={Clock}
          subtitle="Physics & Further Maths"
          onClick={() => navigate('/teacher/timetable')}
        />
        <StatCard
          title="Pending CA Entries"
          value={stats.pendingGradeEntries}
          icon={FileSpreadsheet}
          trend={{ value: 'Due Friday', positive: false }}
          subtitle="2nd Term CA 2 Moderation"
          onClick={() => navigate('/teacher/grades')}
        />
      </div>

      {/* Teaching Periods & Notices */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 p-4 sm:p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Today's Teaching Schedule (Monday)
              </h2>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Instructional lessons and practical sessions
              </p>
            </div>
            <button
              onClick={() => navigate('/teacher/timetable')}
              className="text-xs font-medium text-brand-700 dark:text-brand-400 hover:underline"
            >
              Full Timetable &rarr;
            </button>
          </div>

          <div className="space-y-2">
            {todayClasses.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-center font-mono font-semibold text-slate-700 dark:text-slate-300">
                    P{item.period}
                  </span>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      {item.subject}
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Cohort: {item.className} • Location: {item.room}
                    </p>
                  </div>
                </div>

                <div className="text-right font-mono">
                  <span className="text-slate-800 dark:text-slate-200 font-medium">
                    {item.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Staff Notices */}
        <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Academic Staff Circulars
              </h3>
              <Megaphone className="w-3.5 h-3.5 text-slate-400" />
            </div>

            <div className="space-y-2.5">
              {mockAnnouncements.filter((a) => a.targetAudience === 'Teachers' || a.targetAudience === 'All').map((a) => (
                <div key={a.id} className="p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 text-xs">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="font-semibold text-slate-900 dark:text-white truncate">{a.title}</span>
                    <Badge variant={a.priority === 'High' ? 'danger' : 'neutral'} size="sm">{a.priority}</Badge>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-2">{a.content}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 mt-3 text-center">
            <button
              onClick={() => navigate('/teacher/announcements')}
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

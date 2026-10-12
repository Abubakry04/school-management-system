import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Award,
  CalendarCheck,
  CreditCard,
  Calendar,
  Clock,
  Printer,
  FileText,
} from 'lucide-react';
import { StatCard } from '../../components/ui/StatCard';
import { Badge } from '../../components/ui/Badge';
import {
  mockStudents,
  mockTimetableSlots,
  mockAnnouncements,
  mockGrades,
  mockSchoolSettings,
} from '../../data/mockData';

export const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const student = mockStudents[0]; // Amina Adeyemi

  const myGrades = mockGrades.filter((g) => g.studentId === student.id);
  const totalScore = myGrades.reduce((acc, curr) => acc + curr.total, 0);
  const averagePercentage = myGrades.length > 0 ? (totalScore / myGrades.length).toFixed(1) : '85.4';

  const todayClasses = mockTimetableSlots.filter(
    (s) => s.day === 'Monday' && s.classId === student.classId
  );

  return (
    <div className="space-y-6">
      {/* Student Academic Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Student Academic Portal
            </h1>
            <Badge variant="brand" size="sm">
              {student.className}
            </Badge>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
            {student.fullName} • Admission No: {student.admissionNo}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => navigate('/student/results')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-brand-700 hover:bg-brand-800 text-white shadow-xs transition-colors"
          >
            <Award className="w-3.5 h-3.5" />
            <span>Terminal Report Card</span>
          </button>
          <button
            onClick={() => navigate('/student/timetable')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition-colors"
          >
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>Class Timetable</span>
          </button>
          <button
            onClick={() => navigate('/student/fees')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition-colors"
          >
            <CreditCard className="w-3.5 h-3.5 text-slate-500" />
            <span>Bursary Clearance</span>
          </button>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Terminal Average"
          value={`${averagePercentage}%`}
          icon={Award}
          trend={{ value: 'Top 5%', positive: true }}
          subtitle="Distinction Level"
          onClick={() => navigate('/student/results')}
        />
        <StatCard
          title="Attendance Log"
          value={`${student.attendancePercentage}%`}
          icon={CalendarCheck}
          trend={{ value: '62/64 Days', positive: true }}
          subtitle="Punctual Status"
          onClick={() => navigate('/student/attendance')}
        />
        <StatCard
          title="Class Standing"
          value="2nd of 31"
          icon={Award}
          subtitle="SS 2 Science Arm"
          onClick={() => navigate('/student/results')}
        />
        <StatCard
          title="Fee Clearance"
          value="Cleared"
          icon={CreditCard}
          trend={{ value: '₦0 Balance', positive: true }}
          subtitle="2nd Term 2025/2026"
          onClick={() => navigate('/student/fees')}
        />
      </div>

      {/* Today's Schedule & Circulars */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 p-4 sm:p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Today's Lecture Periods (Monday)
              </h2>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Classroom: Science Complex Lab 2
              </p>
            </div>
            <button
              onClick={() => navigate('/student/timetable')}
              className="text-xs font-medium text-brand-700 dark:text-brand-400 hover:underline"
            >
              Full Schedule &rarr;
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
                      Instructor: {item.teacherName} • Room: {item.room}
                    </p>
                  </div>
                </div>

                <span className="font-mono text-slate-700 dark:text-slate-300 font-medium">
                  {item.time}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Notices */}
        <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                School Notices
              </h3>
              <span className="text-[11px] font-mono text-slate-400">FEA Broadcast</span>
            </div>

            <div className="space-y-2.5">
              {mockAnnouncements.slice(0, 2).map((a) => (
                <div key={a.id} className="p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 text-xs">
                  <p className="font-semibold text-slate-900 dark:text-white truncate">{a.title}</p>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{a.content}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 mt-3 text-center">
            <button
              onClick={() => navigate('/student/announcements')}
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

import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Award,
  CalendarCheck,
  CreditCard,
  Calendar,
  Clock,
  Printer,
  FileText,
  User,
  GraduationCap,
  Camera,
  Upload,
} from 'lucide-react';
import { StatCard } from '../../components/ui/StatCard';
import { Badge } from '../../components/ui/Badge';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { EmptyState } from '../../components/ui/EmptyState';

export const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { switchRole } = useAuth();
  const { showToast } = useToast();
  const { students, grades, timetable, announcements, payments, attendance, settings, updateStudent } = useData();
  const student = students[0];
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePassportUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (JPG, PNG, WebP)', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('Image size exceeds 5MB limit', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64 && student) {
        updateStudent(student.id, { avatar: base64 });
        showToast('Passport photograph updated successfully!', 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  if (!student) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Student Academic Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {settings.schoolName} • Academic Session {settings.currentSession}
          </p>
        </div>

        <div className="p-8 sm:p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm max-w-2xl mx-auto space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center mx-auto">
            <GraduationCap className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              No Student Dossier Registered
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
              There are currently no active student enrollments in the registry. An administrator can register students from the Admissions or Students management console.
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
              Switch to Admin & Enroll Student
            </button>
            <button
              onClick={() => navigate('/student/announcements')}
              className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              View School Notices
            </button>
          </div>
        </div>
      </div>
    );
  }

  const myGrades = grades.filter((g) => g.studentId === student.id);
  const totalScore = myGrades.reduce((acc, curr) => acc + curr.total, 0);
  const averagePercentage = myGrades.length > 0 ? (totalScore / myGrades.length).toFixed(1) : '85.4';

  const todayClasses = timetable.filter(
    (s) => s.day === 'Monday' && s.classId === student.classId
  );

  const studentPayments = payments.filter((p) => p.studentId === student.id);
  const totalPaid = studentPayments.reduce((acc, p) => acc + p.amountPaid, 0);

  return (
    <div className="space-y-6">
      {/* Student Academic Header with Passport Photo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-4">
          {/* Passport Photograph with Camera Upload Trigger */}
          <div className="relative group shrink-0">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handlePassportUpload}
              accept="image/*"
              className="hidden"
            />
            {student.avatar ? (
              <img
                src={student.avatar}
                alt={student.fullName}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-emerald-600/30 dark:ring-emerald-500/40 shadow-sm"
              />
            ) : (
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold text-xl flex items-center justify-center ring-2 ring-emerald-600/20">
                {student.firstName[0]}
                {student.lastName[0]}
              </div>
            )}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 p-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white shadow-md active:scale-95 transition-all touch-manipulation cursor-pointer"
              title="Upload / Change Passport Photograph"
              aria-label="Upload passport photograph"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {student.fullName}
              </h1>
              <Badge variant="brand" size="sm">
                {student.className}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              Admission No: <strong className="text-slate-800 dark:text-slate-200">{student.admissionNo}</strong>
            </p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1 mt-1 touch-manipulation cursor-pointer"
            >
              <Upload className="w-3 h-3" />
              <span>Change passport picture</span>
            </button>
          </div>
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
          trend={{ value: 'Performance', positive: true }}
          subtitle={`${myGrades.length} graded subjects`}
          onClick={() => navigate('/student/results')}
        />
        <StatCard
          title="Attendance Log"
          value={`${student.attendancePercentage || 100}%`}
          icon={CalendarCheck}
          trend={{ value: 'Logged', positive: true }}
          subtitle="Morning Roll Call"
          onClick={() => navigate('/student/attendance')}
        />
        <StatCard
          title="Class Arm"
          value={student.className}
          icon={GraduationCap}
          subtitle={`Adm: ${student.admissionNo}`}
          onClick={() => navigate('/student/results')}
        />
        <StatCard
          title="Fee Payments"
          value={`₦${totalPaid.toLocaleString()}`}
          icon={CreditCard}
          trend={{ value: studentPayments.length > 0 ? 'Receipt issued' : 'Pending', positive: studentPayments.length > 0 }}
          subtitle={`${settings.currentTerm} Clearance`}
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
                Classroom: {student.className}
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
            {todayClasses.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No timetable periods scheduled for today.</p>
            ) : (
              todayClasses.map((item) => (
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
              ))
            )}
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
              {announcements.length === 0 ? (
                <p className="text-xs text-slate-400 py-3 text-center">No active announcements.</p>
              ) : (
                announcements.slice(0, 2).map((a) => (
                  <div key={a.id} className="p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 text-xs">
                    <p className="font-semibold text-slate-900 dark:text-white truncate">{a.title}</p>
                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{a.content}</p>
                  </div>
                ))
              )}
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

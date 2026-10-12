import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Users,
  CalendarCheck,
  FileSpreadsheet,
  Phone,
  Mail,
  GraduationCap,
} from 'lucide-react';
import { mockClasses, mockStudents } from '../../data/mockData';
import { Badge } from '../../components/ui/Badge';

export const TeacherClassesPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedClassId, setSelectedClassId] = useState('cls-06'); // SS 2 Science

  // Teacher's classes
  const teacherClasses = mockClasses.filter((c) =>
    ['SS 2 Science', 'SS 3 Science'].includes(c.name)
  );

  const activeClass = teacherClasses.find((c) => c.id === selectedClassId) || teacherClasses[0];
  const classStudents = mockStudents.filter((s) => s.classId === activeClass.id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          My Assigned Classes
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Review your form class and subject cohorts, student rosters, and guardian emergency lines.
        </p>
      </div>

      {/* Class Selector Tabs */}
      <div className="flex flex-wrap gap-3">
        {teacherClasses.map((cls) => {
          const isSelected = cls.id === selectedClassId;
          const isFormTeacher = cls.classTeacherId === 'tch-01';

          return (
            <button
              key={cls.id}
              onClick={() => setSelectedClassId(cls.id)}
              className={`p-4 rounded-2xl border text-left transition-all min-w-[200px] flex-1 sm:flex-initial ${
                isSelected
                  ? 'border-brand-600 bg-brand-50/80 dark:bg-brand-950/60 ring-2 ring-brand-500/20'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-sm text-slate-900 dark:text-white">
                  {cls.name}
                </span>
                {isFormTeacher && (
                  <Badge variant="brand" size="sm">Form Class</Badge>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {cls.studentCount} Students • {cls.room}
              </p>
            </button>
          );
        })}
      </div>

      {/* Class Action Bar */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Roster: {activeClass.name}
          </h3>
          <p className="text-xs text-slate-400">
            {classStudents.length} students enrolled in active registry
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/teacher/attendance')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-brand-600 hover:bg-brand-700 text-white shadow-sm transition-colors"
          >
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>Mark Attendance</span>
          </button>
          <button
            onClick={() => navigate('/teacher/grades')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Enter Grades</span>
          </button>
        </div>
      </div>

      {/* Student Roster Table */}
      <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase font-bold tracking-wider">
              <th className="py-3 px-3">Student Name</th>
              <th className="py-3 px-3">Admission No</th>
              <th className="py-3 px-3">Gender</th>
              <th className="py-3 px-3">Attendance %</th>
              <th className="py-3 px-3">Guardian Contact</th>
              <th className="py-3 px-3 text-right">Fee Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:border-slate-800">
            {classStudents.map((s) => (
              <tr key={s.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                <td className="py-3 px-3">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={s.avatar}
                      alt={s.fullName}
                      className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
                    />
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {s.fullName}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-3 font-mono text-slate-400">{s.admissionNo}</td>
                <td className="py-3 px-3 text-slate-600 dark:text-slate-400">{s.gender}</td>
                <td className="py-3 px-3">
                  <span className="font-semibold text-brand-600 dark:text-brand-400">
                    {s.attendancePercentage}%
                  </span>
                </td>
                <td className="py-3 px-3 text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3 h-3 text-slate-400" />
                    <span>{s.guardianPhone}</span>
                  </div>
                </td>
                <td className="py-3 px-3 text-right">
                  <Badge variant={s.feeBalance === 0 ? 'success' : 'warning'} size="sm">
                    {s.feeBalance === 0 ? 'Cleared' : 'Pending'}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

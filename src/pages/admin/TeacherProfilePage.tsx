import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  BookOpen,
  Briefcase,
  GraduationCap,
  Award,
} from 'lucide-react';
import { mockTeachers, mockTimetableSlots } from '../../data/mockData';
import { Badge } from '../../components/ui/Badge';

export const TeacherProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const teacher = mockTeachers.find((t) => t.id === id) || mockTeachers[0];
  const teacherPeriods = mockTimetableSlots.filter((slot) => slot.teacherId === teacher.id);

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/admin/teachers')}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Faculty List</span>
        </button>
      </div>

      {/* Main Profile Header Card */}
      <div className="p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <img
            src={teacher.avatar}
            alt={teacher.name}
            className="w-24 h-24 rounded-3xl object-cover ring-4 ring-brand-500/20 shadow-md"
          />
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {teacher.name}
              </h1>
              <Badge variant="success" dot size="sm">
                {teacher.status}
              </Badge>
              <Badge variant="brand" size="sm">
                {teacher.department}
              </Badge>
            </div>
            <p className="text-xs font-mono text-slate-400">
              Staff ID: <span className="font-bold text-slate-700 dark:text-slate-300">{teacher.staffId}</span>
            </p>
            <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Appointed: {teacher.dateJoined}
              </span>
              <span className="flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                {teacher.qualification}
              </span>
            </div>
          </div>
        </div>

        {/* Contact info pill */}
        <div className="flex flex-col gap-2 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 pt-4 md:pt-0 md:pl-6 text-xs text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-slate-400" />
            <span>{teacher.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-slate-400" />
            <span>{teacher.phone}</span>
          </div>
          {teacher.isClassTeacherOf && (
            <div className="mt-1">
              <span className="text-[11px] text-slate-400">Form Teacher of: </span>
              <strong className="text-brand-600 dark:text-brand-400 font-bold">{teacher.isClassTeacherOf}</strong>
            </div>
          )}
        </div>
      </div>

      {/* Grid: Subjects, Classes & Timetable */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Subjects & Teaching Allocations */}
        <div className="space-y-6">
          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
              Subject Allocations
            </h3>
            <div className="space-y-2">
              {teacher.subjects.map((sub) => (
                <div
                  key={sub}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200"
                >
                  <span className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-brand-600" />
                    {sub}
                  </span>
                  <Badge variant="neutral" size="sm">Active</Badge>
                </div>
              ))}
            </div>

            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mt-6 mb-3">
              Assigned Classes
            </h3>
            <div className="flex flex-wrap gap-2">
              {teacher.assignedClasses.map((cls) => (
                <span
                  key={cls}
                  className="px-3 py-1.5 rounded-xl bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 text-xs font-bold border border-brand-200 dark:border-brand-800"
                >
                  {cls}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (2 cols): Weekly Periods Schedule */}
        <div className="lg:col-span-2 p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Teacher's Active Teaching Schedule
              </h3>
              <p className="text-xs text-slate-400">
                Weekly periods and assigned classrooms
              </p>
            </div>
            <Badge variant="brand" size="sm">
              {teacherPeriods.length} Weekly Periods
            </Badge>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase font-bold tracking-wider">
                  <th className="py-3 px-3">Day</th>
                  <th className="py-3 px-3">Time</th>
                  <th className="py-3 px-3">Subject</th>
                  <th className="py-3 px-3">Class</th>
                  <th className="py-3 px-3">Room</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:border-slate-800">
                {teacherPeriods.map((slot) => (
                  <tr key={slot.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">
                      {slot.day}
                    </td>
                    <td className="py-3 px-3 text-slate-500 dark:text-slate-400 font-mono">
                      {slot.time}
                    </td>
                    <td className="py-3 px-3 font-medium text-brand-600 dark:text-brand-400">
                      {slot.subject}
                    </td>
                    <td className="py-3 px-3 text-slate-700 dark:text-slate-300">
                      {slot.className}
                    </td>
                    <td className="py-3 px-3 text-slate-500 dark:text-slate-400">
                      {slot.room}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

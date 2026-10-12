import React, { useState } from 'react';
import {
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  Filter,
  Download,
} from 'lucide-react';
import { mockAttendanceRecords, mockClasses, mockStudents } from '../../data/mockData';
import { Badge } from '../../components/ui/Badge';
import { useToast } from '../../context/ToastContext';

export const AttendancePage: React.FC = () => {
  const { showToast } = useToast();
  const [selectedDate, setSelectedDate] = useState('2026-02-16');
  const [selectedClassId, setSelectedClassId] = useState('all');

  const filteredRecords = mockAttendanceRecords.filter((rec) => {
    const matchDate = rec.date === selectedDate;
    const matchClass = selectedClassId === 'all' || rec.classId === selectedClassId;
    return matchDate && matchClass;
  });

  const presentCount = filteredRecords.filter((r) => r.status === 'Present').length;
  const lateCount = filteredRecords.filter((r) => r.status === 'Late').length;
  const absentCount = filteredRecords.filter((r) => r.status === 'Absent').length;
  const totalCount = filteredRecords.length || 1;
  const rate = Math.round(((presentCount + lateCount) / totalCount) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Daily Attendance Monitor
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            School-wide daily morning roll call, punctual arrivals, and medical leaves.
          </p>
        </div>

        <button
          onClick={() => showToast('Attendance report exported to CSV', 'info')}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Daily Sheet</span>
        </button>
      </div>

      {/* Date & Filter Controls */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-brand-600" />
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Date:
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Class:
            </label>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="all">All Classes (Entire School)</option>
              {mockClasses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="text-xs text-slate-500">
          Showing records for: <span className="font-bold text-slate-900 dark:text-white">{selectedDate}</span>
        </div>
      </div>

      {/* Metric summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 uppercase font-semibold">Present</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{presentCount}</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 uppercase font-semibold">Late Arrival</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{lateCount}</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600">
            <XCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 uppercase font-semibold">Absent</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{absentCount}</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600">
            <CalendarCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 uppercase font-semibold">Punctuality Rate</p>
            <p className="text-lg font-bold text-brand-600 dark:text-brand-400">{rate}%</p>
          </div>
        </div>
      </div>

      {/* Attendance Entries Table */}
      <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
          Student Attendance Entries
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase font-bold tracking-wider">
                <th className="py-3 px-3">Student Name</th>
                <th className="py-3 px-3">Admission No</th>
                <th className="py-3 px-3">Class</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Remark / Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:border-slate-800">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No attendance records for the selected class and date filter.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((item) => {
                  const student = mockStudents.find((s) => s.id === item.studentId);
                  const className = student?.className || 'SS 2 Science';

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">
                        {item.studentName}
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-400">
                        {item.admissionNo}
                      </td>
                      <td className="py-3 px-3 text-slate-700 dark:text-slate-300">
                        {className}
                      </td>
                      <td className="py-3 px-3 text-slate-500">
                        {item.date}
                      </td>
                      <td className="py-3 px-3">
                        <Badge
                          variant={
                            item.status === 'Present'
                              ? 'success'
                              : item.status === 'Late'
                              ? 'warning'
                              : 'danger'
                          }
                          dot
                          size="sm"
                        >
                          {item.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-3 text-slate-500 dark:text-slate-400 italic">
                        {item.remark || 'N/A'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

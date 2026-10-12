import React from 'react';
import { CalendarCheck, CheckCircle2, Clock, XCircle, Calendar } from 'lucide-react';
import { mockAttendanceRecords, mockStudents } from '../../data/mockData';
import { Badge } from '../../components/ui/Badge';

export const StudentAttendancePage: React.FC = () => {
  const student = mockStudents[0];

  const attendanceEntries = [
    { date: '16th Feb, 2026', day: 'Monday', status: 'Present', arrival: '07:42 AM', remark: 'Punctual' },
    { date: '13th Feb, 2026', day: 'Friday', status: 'Present', arrival: '07:45 AM', remark: 'Punctual' },
    { date: '12th Feb, 2026', day: 'Thursday', status: 'Present', arrival: '07:38 AM', remark: 'Punctual' },
    { date: '11th Feb, 2026', day: 'Wednesday', status: 'Late', arrival: '08:12 AM', remark: 'Rainfall delay' },
    { date: '10th Feb, 2026', day: 'Tuesday', status: 'Present', arrival: '07:40 AM', remark: 'Punctual' },
    { date: '09th Feb, 2026', day: 'Monday', status: 'Present', arrival: '07:35 AM', remark: 'Punctual' },
    { date: '06th Feb, 2026', day: 'Friday', status: 'Present', arrival: '07:44 AM', remark: 'Punctual' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          My Attendance Record
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Term attendance tally, arrival timestamps, and punctuality rate.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-400 uppercase font-semibold">Attendance %</p>
          <p className="text-2xl font-black text-brand-600 dark:text-brand-400 mt-1">{student.attendancePercentage}%</p>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-400 uppercase font-semibold">Days Present</p>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">62 Days</p>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-400 uppercase font-semibold">Late Arrivals</p>
          <p className="text-2xl font-black text-amber-500 mt-1">2 Days</p>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-400 uppercase font-semibold">Days Absent</p>
          <p className="text-2xl font-black text-rose-500 mt-1">0 Days</p>
        </div>
      </div>

      <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-x-auto">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
          Daily Log History
        </h3>
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase font-bold tracking-wider">
              <th className="py-3 px-3">Date</th>
              <th className="py-3 px-3">Day</th>
              <th className="py-3 px-3">Time In</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-3">Remarks</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:border-slate-800">
            {attendanceEntries.map((entry, idx) => (
              <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">
                  {entry.date}
                </td>
                <td className="py-3 px-3 text-slate-500">{entry.day}</td>
                <td className="py-3 px-3 font-mono text-slate-600 dark:text-slate-300">
                  {entry.arrival}
                </td>
                <td className="py-3 px-3">
                  <Badge variant={entry.status === 'Present' ? 'success' : 'warning'} size="sm" dot>
                    {entry.status}
                  </Badge>
                </td>
                <td className="py-3 px-3 text-slate-500 dark:text-slate-400 italic">
                  {entry.remark}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

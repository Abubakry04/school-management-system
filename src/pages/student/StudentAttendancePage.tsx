import React from 'react';
import { CalendarCheck, CheckCircle2, Clock, XCircle, Calendar } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { useData } from '../../context/DataContext';
import { EmptyState } from '../../components/ui/EmptyState';

export const StudentAttendancePage: React.FC = () => {
  const { students, attendance } = useData();
  const student = students[0];

  if (!student) {
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
        <EmptyState
          title="No Attendance Record"
          description="There are currently no active students registered in this session to display attendance logs for."
        />
      </div>
    );
  }

  const myEntries = attendance.filter((a) => a.studentId === student.id);
  const attendanceRate = student.attendancePercentage || 100;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          My Attendance Record
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Term attendance tally, arrival timestamps, and punctuality rate for {student.fullName}.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-400 uppercase font-semibold">Attendance %</p>
          <p className="text-2xl font-black text-brand-600 dark:text-brand-400 mt-1">{attendanceRate}%</p>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-400 uppercase font-semibold">Days Present</p>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {myEntries.filter((e) => e.status === 'Present').length} Days
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-400 uppercase font-semibold">Late Arrivals</p>
          <p className="text-2xl font-black text-amber-500 mt-1">
            {myEntries.filter((e) => e.status === 'Late').length} Days
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-400 uppercase font-semibold">Days Absent</p>
          <p className="text-2xl font-black text-rose-500 mt-1">
            {myEntries.filter((e) => e.status === 'Absent').length} Days
          </p>
        </div>
      </div>

      <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-x-auto">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
          Daily Log History
        </h3>
        {myEntries.length === 0 ? (
          <EmptyState
            title="No Attendance Logs Yet"
            description="Daily morning roll calls taken by your form teacher will be listed here."
          />
        ) : (
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase font-bold tracking-wider">
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:border-slate-800">
              {myEntries.map((entry) => (
                <tr key={entry.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">
                    {entry.date}
                  </td>
                  <td className="py-3 px-3">
                    <Badge variant={entry.status === 'Present' ? 'success' : entry.status === 'Late' ? 'warning' : 'danger'} size="sm" dot>
                      {entry.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-3 text-slate-500 dark:text-slate-400 italic">
                    {entry.remark || 'Regular attendance'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

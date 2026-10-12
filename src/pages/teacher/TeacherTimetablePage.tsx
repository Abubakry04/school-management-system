import React from 'react';
import { Calendar, Clock, Printer, Download } from 'lucide-react';
import { mockTimetableSlots } from '../../data/mockData';
import { useToast } from '../../context/ToastContext';

export const TeacherTimetablePage: React.FC = () => {
  const { showToast } = useToast();

  const teacherSlots = mockTimetableSlots.filter((slot) => slot.teacherId === 'tch-01');

  const days: ('Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday')[] = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
  ];

  const periods = [
    { period: 1, time: '08:00 - 08:45' },
    { period: 2, time: '08:45 - 09:30' },
    { period: 3, time: '09:45 - 10:30' },
    { period: 4, time: '10:30 - 11:15' },
    { period: 5, time: '11:45 - 12:30' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            My Teaching Timetable
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Personal teaching schedule, laboratory periods, and assigned classes.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors self-start sm:self-auto"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print Schedule</span>
        </button>
      </div>

      {/* Grid */}
      <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-x-auto">
        <table className="w-full min-w-[700px] border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
              <th className="p-3 text-left font-bold text-slate-700 dark:text-slate-300 w-32">
                Period / Time
              </th>
              {days.map((day) => (
                <th key={day} className="p-3 text-center font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:border-slate-800">
            {periods.map((p) => (
              <tr key={p.period} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                <td className="p-3 font-semibold text-slate-600 dark:text-slate-300 bg-slate-50/70 dark:bg-slate-800/40">
                  <div className="font-bold text-slate-900 dark:text-white">Period {p.period}</div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">{p.time}</div>
                </td>

                {days.map((day) => {
                  const slot = teacherSlots.find((s) => s.day === day && s.period === p.period);

                  return (
                    <td key={day} className="p-2.5 text-center align-top">
                      {slot ? (
                        <div className="p-2.5 rounded-2xl bg-blue-50/80 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-left">
                          <p className="font-bold text-blue-900 dark:text-blue-200 text-xs">
                            {slot.subject}
                          </p>
                          <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                            {slot.className}
                          </p>
                          <p className="text-[10px] text-blue-600 dark:text-blue-400 font-medium mt-1">
                            {slot.room}
                          </p>
                        </div>
                      ) : (
                        <div className="p-2.5 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-slate-300 dark:text-slate-600 text-[11px] italic">
                          Free Period
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

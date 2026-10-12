import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Printer,
  Download,
  Filter,
} from 'lucide-react';
import { mockTimetableSlots, mockClasses } from '../../data/mockData';
import { Badge } from '../../components/ui/Badge';
import { useToast } from '../../context/ToastContext';

export const TimetablePage: React.FC = () => {
  const { showToast } = useToast();
  const [selectedClassId, setSelectedClassId] = useState('cls-06'); // SS 2 Science

  const selectedClass = mockClasses.find((c) => c.id === selectedClassId) || mockClasses[0];

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

  const classSlots = mockTimetableSlots.filter((slot) => slot.classId === selectedClassId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Master School Timetable
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Weekly subject schedule, teaching periods, and assigned laboratory allocations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Timetable</span>
          </button>
          <button
            onClick={() => showToast('Timetable schedule downloaded', 'info')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-brand-600 hover:bg-brand-700 text-white shadow-sm transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Schedule</span>
          </button>
        </div>
      </div>

      {/* Class Selector Bar */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-3">
          <Filter className="w-4 h-4 text-brand-600" />
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Selected Class:
          </label>
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            {mockClasses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.level} Secondary)
              </option>
            ))}
          </select>
        </div>

        <div className="text-xs text-slate-500">
          Form Teacher: <strong className="text-slate-700 dark:text-slate-200">{selectedClass.classTeacherName}</strong>
        </div>
      </div>

      {/* Timetable Weekly Grid */}
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
                  const slot = classSlots.find((s) => s.day === day && s.period === p.period);

                  return (
                    <td key={day} className="p-2.5 text-center align-top">
                      {slot ? (
                        <div className="p-2.5 rounded-2xl bg-brand-50/80 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800/80 hover:shadow-sm transition-all text-left">
                          <p className="font-bold text-brand-900 dark:text-brand-200 text-xs truncate">
                            {slot.subject}
                          </p>
                          <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 truncate">
                            {slot.teacherName}
                          </p>
                          <div className="mt-1 flex items-center justify-between text-[10px] text-brand-600 dark:text-brand-400 font-medium">
                            <span className="truncate">{slot.room}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="p-2.5 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-slate-300 dark:text-slate-600 text-[11px] italic">
                          Study / Recess
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

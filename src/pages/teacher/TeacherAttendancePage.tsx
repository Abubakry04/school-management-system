import React, { useState } from 'react';
import {
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Save,
  Check,
  Calendar,
} from 'lucide-react';
import { mockStudents } from '../../data/mockData';
import { Badge } from '../../components/ui/Badge';
import { useToast } from '../../context/ToastContext';

interface StudentAttendanceState {
  studentId: string;
  name: string;
  admissionNo: string;
  status: 'Present' | 'Absent' | 'Late';
  remark: string;
}

export const TeacherAttendancePage: React.FC = () => {
  const { showToast } = useToast();
  const [selectedDate, setSelectedDate] = useState('2026-02-16');

  // SS 2 Science students for form teacher
  const classStudents = mockStudents.filter((s) => s.className === 'SS 2 Science');

  const [attendanceList, setAttendanceList] = useState<StudentAttendanceState[]>(() =>
    classStudents.map((s) => ({
      studentId: s.id,
      name: s.fullName,
      admissionNo: s.admissionNo,
      status: 'Present',
      remark: '',
    }))
  );

  const handleStatusChange = (studentId: string, status: 'Present' | 'Absent' | 'Late') => {
    setAttendanceList((prev) =>
      prev.map((item) => (item.studentId === studentId ? { ...item, status } : item))
    );
  };

  const handleRemarkChange = (studentId: string, remark: string) => {
    setAttendanceList((prev) =>
      prev.map((item) => (item.studentId === studentId ? { ...item, remark } : item))
    );
  };

  const handleMarkAllPresent = () => {
    setAttendanceList((prev) => prev.map((item) => ({ ...item, status: 'Present' })));
    showToast('All students marked Present', 'info');
  };

  const handleSaveAttendance = () => {
    const present = attendanceList.filter((a) => a.status === 'Present').length;
    const absent = attendanceList.filter((a) => a.status === 'Absent').length;
    const late = attendanceList.filter((a) => a.status === 'Late').length;

    showToast(
      `Roll call for SS 2 Science saved! (${present} Present, ${late} Late, ${absent} Absent)`,
      'success'
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Daily Roll Call Attendance Sheet
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Class: <strong className="text-slate-900 dark:text-white">SS 2 Science</strong> • Academic Session 2025/2026
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleMarkAllPresent}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span>Mark All Present</span>
          </button>
          <button
            type="button"
            onClick={handleSaveAttendance}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-600/20 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Submit Attendance</span>
          </button>
        </div>
      </div>

      {/* Date Bar */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Calendar className="w-4 h-4 text-brand-600" />
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Attendance Date:
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div className="text-xs text-slate-500">
          Total Students: <strong className="text-slate-800 dark:text-white">{attendanceList.length}</strong>
        </div>
      </div>

      {/* Interactive Roll Call Table */}
      <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase font-bold tracking-wider">
              <th className="py-3 px-3">Student Name</th>
              <th className="py-3 px-3">Admission No</th>
              <th className="py-3 px-3 text-center w-64">Attendance Status</th>
              <th className="py-3 px-3">Remark / Note</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:border-slate-800">
            {attendanceList.map((item) => (
              <tr key={item.studentId} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">
                  {item.name}
                </td>
                <td className="py-3 px-3 font-mono text-slate-400">
                  {item.admissionNo}
                </td>
                <td className="py-3 px-3">
                  <div className="flex items-center justify-center gap-1.5">
                    {/* Present */}
                    <button
                      type="button"
                      onClick={() => handleStatusChange(item.studentId, 'Present')}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1 ${
                        item.status === 'Present'
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Present</span>
                    </button>

                    {/* Late */}
                    <button
                      type="button"
                      onClick={() => handleStatusChange(item.studentId, 'Late')}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1 ${
                        item.status === 'Late'
                          ? 'bg-amber-500 text-white shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>Late</span>
                    </button>

                    {/* Absent */}
                    <button
                      type="button"
                      onClick={() => handleStatusChange(item.studentId, 'Absent')}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1 ${
                        item.status === 'Absent'
                          ? 'bg-rose-600 text-white shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                      }`}
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Absent</span>
                    </button>
                  </div>
                </td>
                <td className="py-3 px-3">
                  <input
                    type="text"
                    value={item.remark}
                    onChange={(e) => handleRemarkChange(item.studentId, e.target.value)}
                    placeholder="Add remark if late/absent..."
                    className="w-full px-2.5 py-1 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

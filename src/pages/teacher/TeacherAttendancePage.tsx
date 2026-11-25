import React, { useState, useEffect } from 'react';
import {
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Save,
  Check,
  Calendar,
} from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { useToast } from '../../context/ToastContext';
import { useData } from '../../context/DataContext';
import { EmptyState } from '../../components/ui/EmptyState';

interface StudentAttendanceState {
  studentId: string;
  name: string;
  admissionNo: string;
  status: 'Present' | 'Absent' | 'Late';
  remark: string;
}

export const TeacherAttendancePage: React.FC = () => {
  const { showToast } = useToast();
  const { students: allStudents, classes, markAttendance } = useData();
  const [selectedClass, setSelectedClass] = useState(classes[0]?.name || 'JSS 1A');
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().slice(0, 10));

  const classStudents = allStudents.filter((s) => s.className === selectedClass);

  const [attendanceList, setAttendanceList] = useState<StudentAttendanceState[]>([]);

  useEffect(() => {
    setAttendanceList(
      classStudents.map((s) => ({
        studentId: s.id,
        name: s.fullName,
        admissionNo: s.admissionNo,
        status: 'Present',
        remark: '',
      }))
    );
  }, [selectedClass, allStudents]);

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
    if (attendanceList.length === 0) {
      showToast('No students in this class to record attendance for', 'info');
      return;
    }

    const present = attendanceList.filter((a) => a.status === 'Present').length;
    const absent = attendanceList.filter((a) => a.status === 'Absent').length;
    const late = attendanceList.filter((a) => a.status === 'Late').length;

    const entries = attendanceList.map((a) => {
      const stu = classStudents.find((s) => s.id === a.studentId);
      return {
        id: `att-${Date.now()}-${a.studentId}`,
        studentId: a.studentId,
        studentName: a.name,
        admissionNo: a.admissionNo,
        classId: stu?.classId || 'cls-01',
        className: selectedClass,
        date: selectedDate,
        status: a.status,
        remark: a.remark,
      };
    });

    markAttendance(entries);

    showToast(
      `Attendance for ${selectedClass} saved: ${present} Present, ${absent} Absent, ${late} Late`,
      'success'
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Daily Morning Attendance Register
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Form teacher roll call log. Synchronizes live with student transcripts and parent portal.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleMarkAllPresent}
            disabled={attendanceList.length === 0}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span>Mark All Present</span>
          </button>
          <button
            onClick={handleSaveAttendance}
            disabled={attendanceList.length === 0}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-600/20 transition-all disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Submit Roll Call</span>
          </button>
        </div>
      </div>

      {/* Control Strip */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Class:
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              {classes.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Date:
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold">
          <span className="text-emerald-600 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Present:{' '}
            {attendanceList.filter((a) => a.status === 'Present').length}
          </span>
          <span className="text-amber-500 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Late:{' '}
            {attendanceList.filter((a) => a.status === 'Late').length}
          </span>
          <span className="text-rose-600 flex items-center gap-1">
            <XCircle className="w-3.5 h-3.5" /> Absent:{' '}
            {attendanceList.filter((a) => a.status === 'Absent').length}
          </span>
        </div>
      </div>

      {/* Attendance Sheet Table */}
      <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-x-auto">
        {attendanceList.length === 0 ? (
          <EmptyState
            title={`No Students Enrolled in ${selectedClass}`}
            description="Students enrolled into this class arm will appear here for morning roll call."
          />
        ) : (
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase font-bold tracking-wider">
                <th className="py-3 px-3">Student Name</th>
                <th className="py-3 px-3 font-mono">Admission No</th>
                <th className="py-3 px-3 text-center">Roll Call Status</th>
                <th className="py-3 px-3">Observation / Remark</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:border-slate-800">
              {attendanceList.map((row) => (
                <tr key={row.studentId} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                  <td className="py-3.5 px-3 font-semibold text-slate-900 dark:text-white">
                    {row.name}
                  </td>
                  <td className="py-3.5 px-3 font-mono text-slate-400">
                    {row.admissionNo}
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleStatusChange(row.studentId, 'Present')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                          row.status === 'Present'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
                        }`}
                      >
                        Present
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStatusChange(row.studentId, 'Late')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                          row.status === 'Late'
                            ? 'bg-amber-500 text-white shadow-xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-amber-50 dark:hover:bg-amber-950/40'
                        }`}
                      >
                        Late
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStatusChange(row.studentId, 'Absent')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                          row.status === 'Absent'
                            ? 'bg-rose-600 text-white shadow-xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-950/40'
                        }`}
                      >
                        Absent
                      </button>
                    </div>
                  </td>
                  <td className="py-3.5 px-3">
                    <input
                      type="text"
                      placeholder="e.g. Excused, medical leave, rainfall"
                      value={row.remark}
                      onChange={(e) => handleRemarkChange(row.studentId, e.target.value)}
                      className="w-full px-3 py-1 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
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

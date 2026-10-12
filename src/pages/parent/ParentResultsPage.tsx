import React from 'react';
import { Printer, Download, GraduationCap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { mockGrades, mockSchoolSettings } from '../../data/mockData';
import { useToast } from '../../context/ToastContext';

export const ParentResultsPage: React.FC = () => {
  const { selectedWard, wards, setSelectedWardId } = useAuth();
  const { showToast } = useToast();

  const activeWard = selectedWard || wards[0];
  const grades = mockGrades.filter((g) => g.studentId === activeWard.studentId);

  const totalScore = grades.reduce((acc, curr) => acc + curr.total, 0);
  const maxPossible = grades.length * 100 || 100;
  const averagePercentage = grades.length > 0 ? (totalScore / grades.length).toFixed(1) : activeWard.averageGrade;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header and Child Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800 no-print">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Ward Terminal Report Card
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Viewing records for <strong className="text-slate-900 dark:text-white">{activeWard.name}</strong> ({activeWard.className})
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Ward Switcher */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700">
            {wards.map((w) => (
              <button
                key={w.studentId}
                onClick={() => setSelectedWardId(w.studentId)}
                className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors ${
                  w.studentId === activeWard.studentId
                    ? 'bg-white dark:bg-slate-900 text-brand-700 dark:text-brand-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {w.name.split(' ')[0]}
              </button>
            ))}
          </div>

          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* Official Report Card */}
      <div className="p-8 sm:p-10 bg-white dark:bg-slate-900 rounded-lg border border-slate-300 dark:border-slate-700 shadow-xs print-shadow-none text-slate-900 dark:text-white">
        {/* Letterhead */}
        <div className="text-center pb-6 border-b-2 border-slate-800 dark:border-slate-200">
          <div className="inline-block p-2 rounded border border-slate-800 dark:border-slate-200 font-mono font-bold text-xs tracking-widest uppercase mb-2">
            FEDERAL MINISTRY OF EDUCATION APPROVED
          </div>
          <h2 className="text-2xl font-bold tracking-tight uppercase">
            {mockSchoolSettings.schoolName}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {mockSchoolSettings.address} • Tel: {mockSchoolSettings.phone}
          </p>
          <div className="mt-3 inline-block px-3 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-bold uppercase tracking-wider font-mono">
            OFFICIAL TERMINAL REPORT SHEET • 2ND TERM 2025/2026
          </div>
        </div>

        {/* Bio Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 border-b border-slate-300 dark:border-slate-700 text-xs font-mono">
          <div className="p-2 border border-slate-200 dark:border-slate-800">
            <span className="text-slate-400 uppercase text-[10px] block">Ward's Name:</span>
            <strong className="text-xs font-sans">{activeWard.name}</strong>
          </div>
          <div className="p-2 border border-slate-200 dark:border-slate-800">
            <span className="text-slate-400 uppercase text-[10px] block">Admission No:</span>
            <strong className="text-xs">{activeWard.admissionNo}</strong>
          </div>
          <div className="p-2 border border-slate-200 dark:border-slate-800">
            <span className="text-slate-400 uppercase text-[10px] block">Class / Cohort:</span>
            <strong className="text-xs font-sans">{activeWard.className}</strong>
          </div>
          <div className="p-2 border border-slate-200 dark:border-slate-800">
            <span className="text-slate-400 uppercase text-[10px] block">Attendance Rate:</span>
            <strong className="text-xs">{activeWard.attendancePercentage}%</strong>
          </div>
        </div>

        {/* Grades Table */}
        <div className="py-4 overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs border border-slate-300 dark:border-slate-700">
            <thead>
              <tr className="border-b border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase font-semibold text-[11px] font-mono">
                <th className="py-2.5 px-3 border-r border-slate-300 dark:border-slate-700">Subject</th>
                <th className="py-2.5 px-2 text-center border-r border-slate-300 dark:border-slate-700">CA 1 (20)</th>
                <th className="py-2.5 px-2 text-center border-r border-slate-300 dark:border-slate-700">CA 2 (20)</th>
                <th className="py-2.5 px-2 text-center border-r border-slate-300 dark:border-slate-700">Exam (60)</th>
                <th className="py-2.5 px-2 text-center font-bold border-r border-slate-300 dark:border-slate-700">Total (100)</th>
                <th className="py-2.5 px-2 text-center border-r border-slate-300 dark:border-slate-700">Grade</th>
                <th className="py-2.5 px-3">Subject Teacher Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {grades.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                  <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white border-r border-slate-200 dark:border-slate-800">
                    {item.subject}
                  </td>
                  <td className="py-2.5 px-2 text-center text-slate-600 dark:text-slate-300 font-mono border-r border-slate-200 dark:border-slate-800">
                    {item.ca1}
                  </td>
                  <td className="py-2.5 px-2 text-center text-slate-600 dark:text-slate-300 font-mono border-r border-slate-200 dark:border-slate-800">
                    {item.ca2}
                  </td>
                  <td className="py-2.5 px-2 text-center text-slate-600 dark:text-slate-300 font-mono border-r border-slate-200 dark:border-slate-800">
                    {item.exam}
                  </td>
                  <td className="py-2.5 px-2 text-center font-bold text-slate-900 dark:text-white font-mono border-r border-slate-200 dark:border-slate-800">
                    {item.total}
                  </td>
                  <td className="py-2.5 px-2 text-center font-bold font-mono border-r border-slate-200 dark:border-slate-800">
                    {item.grade}
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400 italic">
                    {item.remark}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary Ribbon */}
        <div className="border border-slate-300 dark:border-slate-700 p-3 grid grid-cols-2 sm:grid-cols-3 gap-3 text-center my-3 bg-slate-50/80 dark:bg-slate-950/40 text-xs font-mono">
          <div>
            <span className="text-slate-400 uppercase text-[10px] block">Total Obtained</span>
            <strong className="text-sm text-slate-900 dark:text-white">{totalScore} / {maxPossible}</strong>
          </div>
          <div>
            <span className="text-slate-400 uppercase text-[10px] block">Overall Average</span>
            <strong className="text-sm text-brand-700 dark:text-brand-300">{averagePercentage}%</strong>
          </div>
          <div>
            <span className="text-slate-400 uppercase text-[10px] block">Academic Standing</span>
            <strong className="text-sm text-emerald-700 dark:text-emerald-400">Excellent Distinction</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

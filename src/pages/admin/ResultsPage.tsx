import React, { useState } from 'react';
import {
  Award,
  Filter,
  Download,
  Printer,
  FileCheck,
  TrendingUp,
} from 'lucide-react';
import { mockGrades, mockClasses } from '../../data/mockData';
import { GradeItem } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { useToast } from '../../context/ToastContext';

export const ResultsPage: React.FC = () => {
  const { showToast } = useToast();
  const [selectedClassId, setSelectedClassId] = useState('cls-06'); // SS 2 Science
  const [selectedTerm, setSelectedTerm] = useState('2nd Term');
  const [selectedSubject, setSelectedSubject] = useState('all');

  const selectedClass = mockClasses.find((c) => c.id === selectedClassId) || mockClasses[0];

  const filteredGrades = mockGrades.filter((g) => {
    const matchClass = g.classId === selectedClassId;
    const matchTerm = g.term === selectedTerm;
    const matchSubject = selectedSubject === 'all' || g.subject === selectedSubject;
    return matchClass && matchTerm && matchSubject;
  });

  const averageScore = filteredGrades.length > 0
    ? (filteredGrades.reduce((acc, curr) => acc + curr.total, 0) / filteredGrades.length).toFixed(1)
    : '0';

  const highestScore = filteredGrades.length > 0
    ? Math.max(...filteredGrades.map((g) => g.total))
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Academic Broadsheet & Results
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Official termly academic scores compilation and broadsheet moderation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Broadsheet</span>
          </button>
          <button
            onClick={() => showToast('Class broadsheet exported as PDF', 'success')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-brand-600 hover:bg-brand-700 text-white shadow-sm transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Master Sheet</span>
          </button>
        </div>
      </div>

      {/* Filters bar */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Class:
            </label>
            <select
              value={selectedClassId}
              onChange={(e) => {
                setSelectedClassId(e.target.value);
                setSelectedSubject('all');
              }}
              className="px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              {mockClasses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Term:
            </label>
            <select
              value={selectedTerm}
              onChange={(e) => setSelectedTerm(e.target.value)}
              className="px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="1st Term">1st Term</option>
              <option value="2nd Term">2nd Term</option>
              <option value="3rd Term">3rd Term</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Subject:
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="all">All Subjects</option>
              {selectedClass.subjects.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div>
            <span className="text-slate-400">Class Average: </span>
            <strong className="text-brand-600 dark:text-brand-400 text-sm font-bold">
              {averageScore}%
            </strong>
          </div>
          <div>
            <span className="text-slate-400">Highest Score: </span>
            <strong className="text-emerald-600 dark:text-emerald-400 text-sm font-bold">
              {highestScore}/100
            </strong>
          </div>
        </div>
      </div>

      {/* Broadsheet Table */}
      <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-brand-600" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Broadsheet: {selectedClass.name} • {selectedTerm}
            </h3>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
            Dean Moderated
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase font-bold tracking-wider">
                <th className="py-3 px-3">Student Name</th>
                <th className="py-3 px-3">Admission No</th>
                <th className="py-3 px-3">Subject</th>
                <th className="py-3 px-3 text-center">CA 1 (20)</th>
                <th className="py-3 px-3 text-center">CA 2 (20)</th>
                <th className="py-3 px-3 text-center">Exam (60)</th>
                <th className="py-3 px-3 text-center font-bold">Total (100)</th>
                <th className="py-3 px-3 text-center">Grade</th>
                <th className="py-3 px-3">Remark</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:border-slate-800">
              {filteredGrades.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    No scores compiled for the selected class, term and subject criteria.
                  </td>
                </tr>
              ) : (
                filteredGrades.map((g) => (
                  <tr key={g.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">
                      {g.studentName}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-400">
                      {g.admissionNo}
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-700 dark:text-slate-300">
                      {g.subject}
                    </td>
                    <td className="py-3 px-3 text-center text-slate-600 dark:text-slate-300">
                      {g.ca1}
                    </td>
                    <td className="py-3 px-3 text-center text-slate-600 dark:text-slate-300">
                      {g.ca2}
                    </td>
                    <td className="py-3 px-3 text-center text-slate-600 dark:text-slate-300">
                      {g.exam}
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-slate-900 dark:text-white">
                      {g.total}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded font-black text-xs ${
                          g.grade === 'A'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : g.grade === 'B'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}
                      >
                        {g.grade}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-500 dark:text-slate-400 italic">
                      {g.remark}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

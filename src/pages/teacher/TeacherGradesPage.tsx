import React, { useState, useEffect } from 'react';
import {
  FileSpreadsheet,
  Save,
  CheckCircle2,
  Award,
  Filter,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useData } from '../../context/DataContext';
import { EmptyState } from '../../components/ui/EmptyState';

interface EditableScoreRow {
  studentId: string;
  name: string;
  admissionNo: string;
  ca1: number;
  ca2: number;
  exam: number;
  total: number;
  grade: string;
  remark: string;
}

const calculateGradeAndRemark = (total: number) => {
  if (total >= 80) return { grade: 'A', remark: 'Distinction' };
  if (total >= 70) return { grade: 'B', remark: 'Very Good' };
  if (total >= 60) return { grade: 'C', remark: 'Credit' };
  if (total >= 50) return { grade: 'D', remark: 'Pass' };
  if (total >= 40) return { grade: 'E', remark: 'Fair' };
  return { grade: 'F', remark: 'Fail' };
};

export const TeacherGradesPage: React.FC = () => {
  const { showToast } = useToast();
  const { students: allStudents, classes, subjects, settings, grades, saveGrade } = useData();
  const [selectedSubject, setSelectedSubject] = useState(subjects[0]?.name || 'General Mathematics');
  const [selectedClass, setSelectedClass] = useState(classes[0]?.name || 'JSS 1A');

  const classStudents = allStudents.filter((s) => s.className === selectedClass);
  const [scores, setScores] = useState<EditableScoreRow[]>([]);

  useEffect(() => {
    const rows = classStudents.map((s) => {
      const existingGrade = grades.find(
        (g) => g.studentId === s.id && g.subject === selectedSubject && g.term === settings.currentTerm
      );

      const ca1 = existingGrade ? existingGrade.ca1 : 0;
      const ca2 = existingGrade ? existingGrade.ca2 : 0;
      const exam = existingGrade ? existingGrade.exam : 0;
      const total = ca1 + ca2 + exam;
      const { grade, remark } = calculateGradeAndRemark(total);

      return {
        studentId: s.id,
        name: s.fullName,
        admissionNo: s.admissionNo,
        ca1,
        ca2,
        exam,
        total,
        grade,
        remark,
      };
    });
    setScores(rows);
  }, [selectedClass, selectedSubject, allStudents, grades, settings.currentTerm]);

  const handleScoreChange = (
    studentId: string,
    field: 'ca1' | 'ca2' | 'exam',
    value: string
  ) => {
    const numValue = Math.max(0, Math.min(field === 'exam' ? 60 : 20, Number(value) || 0));

    setScores((prev) =>
      prev.map((row) => {
        if (row.studentId === studentId) {
          const updated = { ...row, [field]: numValue };
          updated.total = updated.ca1 + updated.ca2 + updated.exam;
          const { grade, remark } = calculateGradeAndRemark(updated.total);
          updated.grade = grade;
          updated.remark = remark;
          return updated;
        }
        return row;
      })
    );
  };

  const handleSaveAll = () => {
    if (scores.length === 0) {
      showToast('No student score entries to save', 'info');
      return;
    }
    const targetClass = classes.find((c) => c.name === selectedClass);

    scores.forEach((row) => {
      saveGrade({
        studentId: row.studentId,
        studentName: row.name,
        admissionNo: row.admissionNo,
        classId: targetClass ? targetClass.id : 'cls-01',
        subject: selectedSubject,
        ca1: row.ca1,
        ca2: row.ca2,
        exam: row.exam,
        term: settings.currentTerm,
        session: settings.currentSession,
      });
    });

    showToast(
      `Assessment entries for ${scores.length} students in ${selectedClass} saved!`,
      'success'
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Enter Term Continuous Assessment & Exam Scores
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Scores automatically calculate totals, generate Nigerian national grade brackets, and remarks.
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-600/20 transition-all self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          <span>Save All Scores</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Subject:
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              {subjects.map((s) => (
                <option key={s.id} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Class Cohort:
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
        </div>

        <div className="text-xs text-slate-500">
          Max Allocation: <span className="font-semibold text-slate-800 dark:text-slate-200">CA1 (20) + CA2 (20) + Exam (60) = 100</span>
        </div>
      </div>

      {/* Editable Scores Table */}
      <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-x-auto">
        {scores.length === 0 ? (
          <EmptyState
            title={`No Students in ${selectedClass}`}
            description="Students enrolled into this class will appear here for score entry."
          />
        ) : (
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase font-bold tracking-wider">
                <th className="py-3 px-3">Student</th>
                <th className="py-3 px-3 font-mono">Admission No</th>
                <th className="py-3 px-3 text-center w-28">CA 1 (Max 20)</th>
                <th className="py-3 px-3 text-center w-28">CA 2 (Max 20)</th>
                <th className="py-3 px-3 text-center w-28">Exam (Max 60)</th>
                <th className="py-3 px-3 text-center font-bold">Total (100)</th>
                <th className="py-3 px-3 text-center">Grade</th>
                <th className="py-3 px-3">Academic Remark</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:border-slate-800">
              {scores.map((row) => (
                <tr key={row.studentId} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">
                    {row.name}
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-400">
                    {row.admissionNo}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <input
                      type="number"
                      min="0"
                      max="20"
                      value={row.ca1}
                      onChange={(e) => handleScoreChange(row.studentId, 'ca1', e.target.value)}
                      className="w-16 px-2 py-1 text-center font-bold text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </td>
                  <td className="py-3 px-3 text-center">
                    <input
                      type="number"
                      min="0"
                      max="20"
                      value={row.ca2}
                      onChange={(e) => handleScoreChange(row.studentId, 'ca2', e.target.value)}
                      className="w-16 px-2 py-1 text-center font-bold text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </td>
                  <td className="py-3 px-3 text-center">
                    <input
                      type="number"
                      min="0"
                      max="60"
                      value={row.exam}
                      onChange={(e) => handleScoreChange(row.studentId, 'exam', e.target.value)}
                      className="w-16 px-2 py-1 text-center font-bold text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </td>
                  <td className="py-3 px-3 text-center font-bold text-base text-brand-600 dark:text-brand-400">
                    {row.total}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`inline-block px-2.5 py-1 rounded font-black text-xs ${
                        row.grade === 'A'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : row.grade === 'B'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}
                    >
                      {row.grade}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-400 italic">
                    {row.remark}
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

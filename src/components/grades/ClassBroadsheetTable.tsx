import React, { useState } from 'react';
import { Award, Printer, Download, FileText, CheckCircle2, AlertTriangle, UserCheck } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { Student, SchoolClass } from '../../types';
import { exportToCSV } from '../../utils/exportUtils';
import { OfficialReportCard } from '../reports/OfficialReportCard';
import { BehavioralAssessmentModal } from './BehavioralAssessmentModal';
import { Modal } from '../ui/Modal';

interface ClassBroadsheetTableProps {
  initialClassId?: string;
  initialTerm?: '1st Term' | '2nd Term' | '3rd Term';
}

export const ClassBroadsheetTable: React.FC<ClassBroadsheetTableProps> = ({
  initialClassId,
  initialTerm,
}) => {
  const { classes, students, grades, settings } = useData();
  const { showToast } = useToast();

  const [selectedClassId, setSelectedClassId] = useState<string>(
    initialClassId || classes[0]?.id || 'cls-01'
  );
  const [selectedTerm, setSelectedTerm] = useState<'1st Term' | '2nd Term' | '3rd Term'>(
    initialTerm || settings.currentTerm
  );
  const [reportStudent, setReportStudent] = useState<Student | null>(null);
  const [behaviorStudent, setBehaviorStudent] = useState<Student | null>(null);

  const activeClass = classes.find((c) => c.id === selectedClassId) || classes[0];
  const classStudents = students.filter((s) => s.classId === selectedClassId);

  // Determine subjects for this class
  const classSubjects = activeClass?.subjects && activeClass.subjects.length > 0
    ? activeClass.subjects
    : ['Mathematics', 'English Language', 'Basic Science', 'Social Studies'];

  // Calculate student performance aggregates
  const studentRows = classStudents.map((stu) => {
    const studentGrades = grades.filter(
      (g) =>
        g.studentId === stu.id &&
        g.term === selectedTerm &&
        (!g.session || g.session === settings.currentSession)
    );

    const subjectScores: Record<string, number | null> = {};
    let totalScore = 0;
    let countedSubjects = 0;

    classSubjects.forEach((sub) => {
      const gItem = studentGrades.find((g) => g.subject.toLowerCase() === sub.toLowerCase());
      if (gItem) {
        subjectScores[sub] = gItem.total;
        totalScore += gItem.total;
        countedSubjects++;
      } else {
        subjectScores[sub] = null;
      }
    });

    const average = classSubjects.length > 0 ? (totalScore / classSubjects.length) : 0;
    const isPassing = average >= 50;

    return {
      student: stu,
      subjectScores,
      totalScore,
      average: parseFloat(average.toFixed(1)),
      isPassing,
      studentGrades,
    };
  });

  // Sort descending by total score to calculate class position
  studentRows.sort((a, b) => b.totalScore - a.totalScore);

  const handleExportCSV = () => {
    if (studentRows.length === 0) {
      showToast('No students enrolled in this class to export', 'info');
      return;
    }

    const headers: Record<string, string> = {
      position: 'Class Rank',
      name: 'Student Name',
      admissionNo: 'Admission No',
    };

    classSubjects.forEach((sub) => {
      headers[sub] = sub;
    });

    headers.grandTotal = 'Grand Total';
    headers.average = 'Average (%)';
    headers.status = 'Remark';

    const dataToExport = studentRows.map((row, idx) => {
      const item: any = {
        position: `${idx + 1}`,
        name: row.student.fullName,
        admissionNo: row.student.admissionNo,
      };
      classSubjects.forEach((sub) => {
        item[sub] = row.subjectScores[sub] !== null ? row.subjectScores[sub] : '-';
      });
      item.grandTotal = row.totalScore;
      item.average = `${row.average}%`;
      item.status = row.isPassing ? 'Passed' : 'Requires Intervention';
      return item;
    });

    exportToCSV(`Broadsheet_${activeClass?.name || 'Class'}_${selectedTerm}.csv`, dataToExport, headers);
    showToast('Class broadsheet master mark sheet exported to CSV!', 'success');
  };

  return (
    <div className="space-y-5">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Class:</span>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="text-xs font-semibold py-1.5 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
            >
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({students.filter((s) => s.classId === c.id).length} Students)
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Term:</span>
            <select
              value={selectedTerm}
              onChange={(e) => setSelectedTerm(e.target.value as any)}
              className="text-xs font-semibold py-1.5 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
            >
              <option value="1st Term">1st Term</option>
              <option value="2nd Term">2nd Term</option>
              <option value="3rd Term">3rd Term</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Broadsheet</span>
          </button>
          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Broadsheet Matrix Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                Master Broadsheet: {activeClass?.name} • {selectedTerm} {settings.currentSession}
              </h3>
              <p className="text-[11px] text-slate-500">
                Official cumulative mark sheet ranking all {studentRows.length} students across curriculum subjects.
              </p>
            </div>
          </div>
          <span className="hidden sm:inline-block text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            {classSubjects.length} Subjects Evaluated
          </span>
        </div>

        {studentRows.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            No students currently enrolled in {activeClass?.name}. Enroll students to generate the class broadsheet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-3 w-12 text-center">Rank</th>
                  <th className="py-3 px-3 min-w-[150px]">Student Details</th>
                  {classSubjects.map((sub) => (
                    <th key={sub} className="py-3 px-2 text-center min-w-[70px]" title={sub}>
                      {sub.length > 12 ? `${sub.substring(0, 10)}..` : sub}
                    </th>
                  ))}
                  <th className="py-3 px-3 text-center min-w-[80px]">Grand Total</th>
                  <th className="py-3 px-3 text-center min-w-[70px]">Average</th>
                  <th className="py-3 px-3 text-center min-w-[90px]">Status</th>
                  <th className="py-3 px-3 text-right min-w-[110px] no-print">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {studentRows.map((row, idx) => (
                  <tr
                    key={row.student.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-flex items-center justify-center w-6 h-6 rounded-full font-black text-xs ${
                          idx === 0
                            ? 'bg-amber-100 text-amber-800 font-extrabold ring-1 ring-amber-400'
                            : idx === 1
                            ? 'bg-slate-200 text-slate-700 font-bold'
                            : idx === 2
                            ? 'bg-amber-50 text-amber-900 border border-amber-300'
                            : 'text-slate-500'
                        }`}
                      >
                        {idx + 1}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        {row.student.avatar ? (
                          <img
                            src={row.student.avatar}
                            alt={row.student.fullName}
                            className="w-7 h-7 rounded-full object-cover shrink-0"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center justify-center shrink-0">
                            {row.student.firstName[0]}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 dark:text-white truncate">
                            {row.student.fullName}
                          </p>
                          <p className="text-[10px] font-mono text-slate-400">
                            {row.student.admissionNo}
                          </p>
                        </div>
                      </div>
                    </td>

                    {classSubjects.map((sub) => {
                      const score = row.subjectScores[sub];
                      return (
                        <td key={sub} className="py-3 px-2 text-center font-mono">
                          {score !== null ? (
                            <span
                              className={`font-semibold ${
                                score >= 75
                                  ? 'text-emerald-700 dark:text-emerald-400'
                                  : score >= 50
                                  ? 'text-slate-800 dark:text-slate-200'
                                  : 'text-rose-600 font-bold'
                              }`}
                            >
                              {score}
                            </span>
                          ) : (
                            <span className="text-slate-300 dark:text-slate-600">-</span>
                          )}
                        </td>
                      );
                    })}

                    <td className="py-3 px-3 text-center font-bold text-slate-900 dark:text-white bg-slate-50/50 dark:bg-slate-800/20 font-mono">
                      {row.totalScore}
                    </td>

                    <td className="py-3 px-3 text-center font-extrabold text-emerald-700 dark:text-emerald-400 font-mono">
                      {row.average}%
                    </td>

                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          row.isPassing
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                        }`}
                      >
                        {row.isPassing ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Passed</span>
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="w-3 h-3" />
                            <span>Intervention</span>
                          </>
                        )}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right no-print">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => setBehaviorStudent(row.student)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-950/60 transition-colors"
                          title="Rate Affective & Psychomotor Traits"
                        >
                          <UserCheck className="w-4 h-4 text-emerald-600" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setReportStudent(row.student)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 transition-colors"
                          title="Generate Official Report Card"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Official Report Card Modal */}
      {reportStudent && (
        <Modal
          isOpen={Boolean(reportStudent)}
          onClose={() => setReportStudent(null)}
          title={`Academic Transcript: ${reportStudent.fullName}`}
          maxWidth="5xl"
        >
          <OfficialReportCard
            student={reportStudent}
            grades={grades.filter((g) => g.studentId === reportStudent.id)}
            settings={settings}
            term={selectedTerm}
            session={settings.currentSession}
            onClose={() => setReportStudent(null)}
          />
        </Modal>
      )}

      {/* Behavioral Assessment Modal */}
      {behaviorStudent && (
        <BehavioralAssessmentModal
          isOpen={Boolean(behaviorStudent)}
          onClose={() => setBehaviorStudent(null)}
          student={behaviorStudent}
          term={selectedTerm}
          session={settings.currentSession}
        />
      )}
    </div>
  );
};

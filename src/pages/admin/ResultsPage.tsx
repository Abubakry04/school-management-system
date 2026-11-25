import React, { useState } from 'react';
import {
  Award,
  Download,
  Printer,
  FileText,
} from 'lucide-react';
import { Student } from '../../types';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../context/ToastContext';
import { useData } from '../../context/DataContext';
import { OfficialReportCard } from '../../components/reports/OfficialReportCard';

export const ResultsPage: React.FC = () => {
  const { showToast } = useToast();
  const { grades: allGrades, classes: mockClasses, students, settings } = useData();

  const [selectedClassId, setSelectedClassId] = useState('cls-06'); // SS 2 Science
  const [selectedTerm, setSelectedTerm] = useState<string>(settings.currentTerm);
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [previewStudent, setPreviewStudent] = useState<Student | null>(null);

  const selectedClass = mockClasses.find((c) => c.id === selectedClassId) || mockClasses[0] || {
    id: 'cls-01',
    name: 'All Classes',
    level: 'Junior' as const,
    classTeacherId: '',
    classTeacherName: '',
    studentCount: 0,
    capacity: 35,
    room: '',
    subjects: [],
  };

  const filteredGrades = allGrades.filter((g) => {
    const matchClass = g.classId === selectedClassId || selectedClassId === 'all';
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

  const handleOpenReportCard = (studentId: string) => {
    const found = students.find((s) => s.id === studentId);
    if (found) {
      setPreviewStudent(found);
    } else {
      // Fallback pseudo student
      const gradeSample = allGrades.find((g) => g.studentId === studentId);
      if (gradeSample) {
        setPreviewStudent({
          id: studentId,
          admissionNo: gradeSample.admissionNo,
          firstName: gradeSample.studentName.split(' ')[0],
          lastName: gradeSample.studentName.split(' ').slice(1).join(' '),
          fullName: gradeSample.studentName,
          gender: 'Female',
          dob: '2009-10-12',
          classId: selectedClass.id,
          className: selectedClass.name,
          guardianName: 'Guardian',
          guardianPhone: '+234 800 000 0000',
          guardianEmail: 'parent@example.com',
          address: 'Victoria Island, Lagos',
          bloodGroup: 'O+',
          stateOfOrigin: 'Lagos State',
          lga: 'Ikeja',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          status: 'Active',
          feeBalance: 0,
          attendancePercentage: 97,
          parentId: 'par-01',
          enrolledDate: '12th Sep, 2023',
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Academic Broadsheet & Results
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Official termly academic scores compilation, moderation, and individual terminal report sheets.
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
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-brand-600 hover:bg-brand-700 text-white shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Broadsheet</span>
          </button>
        </div>
      </div>

      {/* Filter Bar & Key Metrics */}
      <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Class Select */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Class:</span>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="text-xs font-medium py-1.5 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              {mockClasses.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>

          {/* Term Select */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Term:</span>
            <select
              value={selectedTerm}
              onChange={(e) => setSelectedTerm(e.target.value)}
              className="text-xs font-medium py-1.5 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="1st Term">1st Term</option>
              <option value="2nd Term">2nd Term</option>
              <option value="3rd Term">3rd Term</option>
            </select>
          </div>

          {/* Subject Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Subject:</span>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="text-xs font-medium py-1.5 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
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
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:border-slate-800">
              {filteredGrades.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-slate-400">
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
                    <td className="py-3 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleOpenReportCard(g.studentId)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 transition-colors"
                      >
                        <FileText className="w-3 h-3" />
                        <span>Report Card</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Official Report Card Modal for Selected Student */}
      {previewStudent && (
        <Modal
          isOpen={!!previewStudent}
          onClose={() => setPreviewStudent(null)}
          title={`Official Terminal Report Card — ${previewStudent.fullName}`}
          maxWidth="3xl"
        >
          <div className="py-2">
            <OfficialReportCard
              student={previewStudent}
              grades={allGrades}
              settings={settings}
              term={selectedTerm}
              session={settings.currentSession}
              onClose={() => setPreviewStudent(null)}
            />
          </div>
        </Modal>
      )}
    </div>
  );
};

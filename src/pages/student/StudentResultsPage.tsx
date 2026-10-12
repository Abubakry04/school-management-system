import React, { useState } from 'react';
import {
  Printer,
  Download,
  GraduationCap,
  FileText,
} from 'lucide-react';
import { mockStudents, mockGrades, mockSchoolSettings } from '../../data/mockData';
import { useToast } from '../../context/ToastContext';

export const StudentResultsPage: React.FC = () => {
  const { showToast } = useToast();
  const [selectedTerm, setSelectedTerm] = useState('2nd Term');
  const student = mockStudents[0]; // Amina Adeyemi

  const grades = mockGrades.filter(
    (g) => g.studentId === student.id && g.term === selectedTerm
  );

  const totalScore = grades.reduce((acc, curr) => acc + curr.total, 0);
  const maxPossible = grades.length * 100;
  const averagePercentage = grades.length > 0 ? (totalScore / grades.length).toFixed(1) : '85.4';

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    showToast(`Official Term Report Card for ${student.fullName} downloaded.`, 'success');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800 no-print">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Continuous Assessment & Terminal Report Card
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Official evaluation record for {student.fullName} ({student.className})
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedTerm}
            onChange={(e) => setSelectedTerm(e.target.value)}
            className="px-3 py-1.5 text-xs font-medium bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
          >
            <option value="1st Term">1st Term 2025/2026</option>
            <option value="2nd Term">2nd Term 2025/2026</option>
            <option value="3rd Term">3rd Term 2025/2026</option>
          </select>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Sheet</span>
          </button>
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-brand-700 hover:bg-brand-800 text-white shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* Official Authentic Nigerian Secondary School Report Card */}
      <div className="p-8 sm:p-10 bg-white dark:bg-slate-900 rounded-lg border border-slate-300 dark:border-slate-700 shadow-xs print-shadow-none text-slate-900 dark:text-white">
        {/* Letterhead Header */}
        <div className="text-center pb-6 border-b-2 border-slate-800 dark:border-slate-200">
          <div className="inline-block p-2 rounded border border-slate-800 dark:border-slate-200 font-mono font-bold text-xs tracking-widest uppercase mb-2">
            FEDERAL MINISTRY OF EDUCATION APPROVED
          </div>
          <h2 className="text-2xl font-bold tracking-tight uppercase">
            {mockSchoolSettings.schoolName}
          </h2>
          <p className="text-xs font-serif italic text-slate-600 dark:text-slate-400 mt-0.5">
            Motto: "{mockSchoolSettings.motto}"
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {mockSchoolSettings.address} • Tel: {mockSchoolSettings.phone} • Email: {mockSchoolSettings.email}
          </p>
          <div className="mt-3 inline-block px-4 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-bold uppercase tracking-wider font-mono">
            TERMINAL CONTINUOUS ASSESSMENT & EXAMINATION REPORT SHEET
          </div>
        </div>

        {/* Student Dossier Bio Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 border-b border-slate-300 dark:border-slate-700 text-xs font-mono">
          <div className="p-2 border border-slate-200 dark:border-slate-800">
            <span className="text-slate-400 uppercase text-[10px] block">Student Name:</span>
            <strong className="text-xs font-sans">{student.fullName}</strong>
          </div>
          <div className="p-2 border border-slate-200 dark:border-slate-800">
            <span className="text-slate-400 uppercase text-[10px] block">Admission No:</span>
            <strong className="text-xs">{student.admissionNo}</strong>
          </div>
          <div className="p-2 border border-slate-200 dark:border-slate-800">
            <span className="text-slate-400 uppercase text-[10px] block">Class / Arm:</span>
            <strong className="text-xs font-sans">{student.className}</strong>
          </div>
          <div className="p-2 border border-slate-200 dark:border-slate-800">
            <span className="text-slate-400 uppercase text-[10px] block">Session / Term:</span>
            <strong className="text-xs">{mockSchoolSettings.currentSession} • {selectedTerm}</strong>
          </div>
          <div className="p-2 border border-slate-200 dark:border-slate-800">
            <span className="text-slate-400 uppercase text-[10px] block">Class Position:</span>
            <strong className="text-xs font-sans">2nd of 31 Students</strong>
          </div>
          <div className="p-2 border border-slate-200 dark:border-slate-800">
            <span className="text-slate-400 uppercase text-[10px] block">Attendance:</span>
            <strong className="text-xs">62 / 64 Days (96.8%)</strong>
          </div>
          <div className="p-2 border border-slate-200 dark:border-slate-800">
            <span className="text-slate-400 uppercase text-[10px] block">Form Master:</span>
            <strong className="text-xs font-sans">Mr. C. Okafor</strong>
          </div>
          <div className="p-2 border border-slate-200 dark:border-slate-800">
            <span className="text-slate-400 uppercase text-[10px] block">Next Term Begins:</span>
            <strong className="text-xs font-sans">{mockSchoolSettings.nextTermResumption}</strong>
          </div>
        </div>

        {/* Cognitive Performance Table */}
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

        {/* Aggregate Summary Ribbon */}
        <div className="border border-slate-300 dark:border-slate-700 p-3 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center my-3 bg-slate-50/80 dark:bg-slate-950/40 text-xs font-mono">
          <div>
            <span className="text-slate-400 uppercase text-[10px] block">Total Obtained</span>
            <strong className="text-sm text-slate-900 dark:text-white">{totalScore} / {maxPossible}</strong>
          </div>
          <div>
            <span className="text-slate-400 uppercase text-[10px] block">Overall Average</span>
            <strong className="text-sm text-brand-700 dark:text-brand-300">{averagePercentage}%</strong>
          </div>
          <div>
            <span className="text-slate-400 uppercase text-[10px] block">Overall Grade</span>
            <strong className="text-sm text-slate-900 dark:text-white">A (Distinction)</strong>
          </div>
          <div>
            <span className="text-slate-400 uppercase text-[10px] block">Promotion Status</span>
            <strong className="text-sm text-emerald-700 dark:text-emerald-400">In Good Standing</strong>
          </div>
        </div>

        {/* Standard Grading Key */}
        <div className="py-2 text-[10px] font-mono text-slate-500 border-t border-slate-200 dark:border-slate-800 flex flex-wrap justify-between gap-1">
          <span>GRADING SCALE:</span>
          <span>A: 80 - 100% (Distinction)</span>
          <span>B: 70 - 79% (Very Good)</span>
          <span>C: 60 - 69% (Credit)</span>
          <span>D: 50 - 59% (Pass)</span>
          <span>E: 40 - 49% (Fair)</span>
          <span>F: 0 - 39% (Fail)</span>
        </div>

        {/* Remarks and Signatures */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-300 dark:border-slate-700 text-xs">
          <div className="p-3 border border-slate-200 dark:border-slate-800 rounded">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 font-mono block mb-1">
              Form Teacher's Assessment:
            </span>
            <p className="italic text-slate-700 dark:text-slate-300 text-xs leading-relaxed">
              "Amina is an exceptionally dedicated, analytical, and courteous student. Her performance in Physics and Further Mathematics is exemplary."
            </p>
            <div className="mt-4 pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center text-[11px] font-mono text-slate-500">
              <span>Mr. Chukwuma Okafor</span>
              <span className="font-serif italic font-bold">Authenticated</span>
            </div>
          </div>

          <div className="p-3 border border-slate-200 dark:border-slate-800 rounded">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 font-mono block mb-1">
              Principal's Moderation:
            </span>
            <p className="italic text-slate-700 dark:text-slate-300 text-xs leading-relaxed">
              "Commendable academic accomplishment. Maintains the premier standard of excellence in the Senior Secondary division."
            </p>
            <div className="mt-4 pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center text-[11px] font-mono text-slate-500">
              <span>{mockSchoolSettings.principalName}</span>
              <span className="font-serif italic font-bold text-brand-700">OFFICIAL SEAL</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

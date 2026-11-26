import React, { useState } from 'react';
import {
  Printer,
  ShieldCheck,
  QrCode,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Download,
  CreditCard,
  FileCheck,
} from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Student, SchoolSettings } from '../../types';
import { useData } from '../../context/DataContext';

interface StudentIDCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
}

export const StudentIDCardModal: React.FC<StudentIDCardModalProps> = ({
  isOpen,
  onClose,
  student,
}) => {
  const { settings, classes, subjects } = useData();
  const [activeView, setActiveView] = useState<'idcard' | 'examdocket'>('idcard');

  if (!student) return null;

  const targetClass = classes.find((c) => c.id === student.classId);
  const enrolledSubjects = targetClass?.subjects && targetClass.subjects.length > 0
    ? targetClass.subjects
    : ['Mathematics', 'English Language', 'Basic Science', 'Civic Education', 'Social Studies'];

  const isClearedForExam = student.feeBalance === 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Credentials & Verification: ${student.fullName}`}
      description={`${student.className} • Admission: ${student.admissionNo}`}
      maxWidth="3xl"
    >
      <div className="space-y-6">
        {/* Toggle between Student ID Card and Exam Clearance Slip */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 no-print">
          <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveView('idcard')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeView === 'idcard'
                  ? 'bg-white dark:bg-slate-900 text-emerald-800 dark:text-emerald-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Student Identity Card</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveView('examdocket')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeView === 'examdocket'
                  ? 'bg-white dark:bg-slate-900 text-emerald-800 dark:text-emerald-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>Examination Entry Docket</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Document</span>
          </button>
        </div>

        {/* 1. STUDENT IDENTITY CARD VIEW */}
        {activeView === 'idcard' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              {/* Front of ID Card */}
              <div className="w-[330px] sm:w-[360px] h-[220px] rounded-2xl bg-gradient-to-br from-[#12382c] via-[#1a4f3e] to-[#0d2a21] text-white p-4 shadow-xl border-2 border-emerald-500/40 relative overflow-hidden flex flex-col justify-between font-sans select-none">
                {/* Decorative watermarks */}
                <div className="absolute -right-12 -top-12 w-40 h-40 rounded-full bg-emerald-500/10 pointer-events-none" />
                <div className="absolute right-4 bottom-4 opacity-10 font-black text-6xl text-white pointer-events-none">
                  FEA
                </div>

                {/* Card Header */}
                <div className="flex items-center gap-2.5 border-b border-emerald-400/30 pb-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#12382c] font-black text-sm flex items-center justify-center border border-emerald-300 shrink-0">
                    FEA
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-extrabold text-[12px] uppercase tracking-tight text-emerald-100 truncate">
                      {settings.schoolName}
                    </h3>
                    <p className="text-[9px] text-emerald-300 font-medium italic truncate">
                      "{settings.motto}"
                    </p>
                  </div>
                </div>

                {/* Card Body */}
                <div className="flex items-center gap-3.5 my-auto">
                  {/* Passport Picture */}
                  <div className="w-20 h-24 rounded-xl bg-white border-2 border-emerald-400/60 p-0.5 shrink-0 shadow-md overflow-hidden">
                    {student.avatar ? (
                      <img
                        src={student.avatar}
                        alt={student.fullName}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-full h-full bg-emerald-950 text-emerald-300 font-bold text-xl flex items-center justify-center">
                        {student.firstName[0]}
                      </div>
                    )}
                  </div>

                  {/* Student Details */}
                  <div className="min-w-0 space-y-1 text-left">
                    <div>
                      <p className="text-[9px] uppercase tracking-wider text-emerald-300 font-semibold">
                        Student Name
                      </p>
                      <p className="font-extrabold text-sm text-white truncate leading-tight">
                        {student.fullName}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                      <div>
                        <span className="text-[8px] uppercase text-emerald-300 block">Class</span>
                        <strong className="text-white">{student.className}</strong>
                      </div>
                      <div>
                        <span className="text-[8px] uppercase text-emerald-300 block">Blood Group</span>
                        <strong className="text-white">{student.bloodGroup || 'O+'}</strong>
                      </div>
                    </div>

                    <div>
                      <span className="text-[8px] uppercase text-emerald-300 block">Admission ID</span>
                      <strong className="font-mono text-emerald-200 tracking-wider text-[11px]">
                        {student.admissionNo}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="flex items-center justify-between pt-1.5 border-t border-emerald-400/20 text-[9px] text-emerald-300 font-mono">
                  <span>Session: {settings.currentSession}</span>
                  <span className="font-bold text-emerald-200">STUDENT IDENTITY CARD</span>
                </div>
              </div>

              {/* Back of ID Card */}
              <div className="w-[330px] sm:w-[360px] h-[220px] rounded-2xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 p-4 shadow-xl border-2 border-slate-300 dark:border-slate-700 flex flex-col justify-between font-sans select-none text-[10px]">
                {/* Magnetic / Barcode simulation strip */}
                <div className="space-y-1">
                  <div className="w-full h-7 bg-slate-900 rounded flex items-center justify-center px-4">
                    <div className="w-full flex justify-between tracking-widest text-[8px] font-mono text-emerald-400">
                      <span>||||||| | ||||| |||| ||||| ||||||</span>
                      <span>{student.admissionNo.replace('/', '-')}</span>
                    </div>
                  </div>
                </div>

                {/* Terms of Use */}
                <div className="space-y-1 text-[9px] text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 pb-2">
                  <p>• This official ID card is property of {settings.schoolName}.</p>
                  <p>• Must be presented on school premises, examination halls, and library.</p>
                  <p>• If found, please return to: {settings.address}.</p>
                </div>

                {/* Emergency & Signature */}
                <div className="flex items-center justify-between pt-1">
                  <div>
                    <span className="text-[8px] font-bold text-slate-400 block uppercase">
                      Emergency Contact (Parent)
                    </span>
                    <strong className="text-slate-900 dark:text-white block truncate max-w-[170px]">
                      {student.guardianName}
                    </strong>
                    <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 font-semibold">
                      {student.guardianPhone}
                    </span>
                  </div>

                  <div className="text-right">
                    <div className="h-6 flex items-end justify-end">
                      <span className="italic font-serif font-bold text-slate-700 dark:text-slate-300 text-xs border-b border-slate-400 pb-0.5">
                        {settings.principalName.split(' ')[0]}...
                      </span>
                    </div>
                    <span className="text-[8px] text-slate-400 block uppercase font-semibold">
                      Authorized Signature
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. EXAMINATION ENTRY DOCKET VIEW */}
        {activeView === 'examdocket' && (
          <div className="bg-white text-slate-950 p-6 sm:p-8 rounded-2xl border-2 border-slate-800 font-sans shadow-md">
            {/* Header */}
            <div className="text-center border-b-2 border-slate-900 pb-4 mb-4">
              <div className="w-12 h-12 rounded-xl border border-[#12382c] flex items-center justify-center font-black text-lg text-[#12382c] mx-auto mb-1 bg-emerald-50">
                FEA
              </div>
              <h2 className="text-xl font-black uppercase text-[#12382c] tracking-tight">
                {settings.schoolName}
              </h2>
              <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500">
                Examination & Records Bureau • Terminal Examination Clearance Docket
              </p>
              <div className="inline-block mt-1.5 px-3 py-0.5 rounded bg-slate-900 text-white font-mono text-xs uppercase font-bold">
                {settings.currentTerm} • {settings.currentSession}
              </div>
            </div>

            {/* Student & Clearance Status Strip */}
            <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-300 mb-5 text-xs">
              <div className="w-20 h-24 rounded bg-white border border-slate-400 p-0.5 shrink-0 overflow-hidden shadow-xs">
                {student.avatar ? (
                  <img src={student.avatar} alt={student.fullName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-slate-100 flex items-center justify-center font-bold text-slate-400">
                    No Photo
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 flex-1 w-full">
                <div>
                  <span className="text-[10px] uppercase text-slate-500 font-bold block">Candidate Name</span>
                  <span className="font-bold text-slate-900 text-sm">{student.fullName}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-slate-500 font-bold block">Examination Number</span>
                  <span className="font-mono font-bold text-slate-900">{student.admissionNo}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-slate-500 font-bold block">Class & Stream</span>
                  <span className="font-bold text-slate-900">{student.className}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-slate-500 font-bold block">Tuition Fee Status</span>
                  {isClearedForExam ? (
                    <span className="inline-flex items-center gap-1 text-emerald-800 font-bold font-mono">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      CLEARED (₦0 Due)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-rose-700 font-bold font-mono">
                      <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                      UNPAID: ₦{student.feeBalance.toLocaleString()}
                    </span>
                  )}
                </div>
                <div>
                  <span className="text-[10px] uppercase text-slate-500 font-bold block">Examination Hall</span>
                  <span className="font-semibold text-slate-900">{targetClass?.room || 'Main Hall A'}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-slate-500 font-bold block">Clearance Status</span>
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                      isClearedForExam
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-rose-100 text-rose-800 border border-rose-300'
                    }`}
                  >
                    {isClearedForExam ? 'ADMISSIBLE TO EXAM' : 'BARRED: PENDING BURSARY CLEARANCE'}
                  </span>
                </div>
              </div>
            </div>

            {/* Registered Examination Courses Schedule */}
            <div className="mb-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">
                Registered Examination Subjects ({enrolledSubjects.length})
              </h4>
              <table className="w-full border-collapse border border-slate-800 text-xs text-left">
                <thead>
                  <tr className="bg-slate-100 text-slate-900 font-bold text-[10px] uppercase">
                    <th className="border border-slate-800 p-2 w-10 text-center">S/N</th>
                    <th className="border border-slate-800 p-2">Course / Subject</th>
                    <th className="border border-slate-800 p-2 w-28 text-center">Date & Time</th>
                    <th className="border border-slate-800 p-2 w-28 text-center">Desk Seat</th>
                    <th className="border border-slate-800 p-2 w-32 text-center">Invigilator Sign</th>
                  </tr>
                </thead>
                <tbody>
                  {enrolledSubjects.map((sub, idx) => (
                    <tr key={sub}>
                      <td className="border border-slate-800 p-2 text-center font-mono">{idx + 1}</td>
                      <td className="border border-slate-800 p-2 font-semibold text-slate-900">{sub}</td>
                      <td className="border border-slate-800 p-2 text-center text-slate-500 font-mono text-[10px]">
                        Session Week {idx + 1}
                      </td>
                      <td className="border border-slate-800 p-2 text-center font-mono font-bold">
                        D-{String(idx + 1).padStart(2, '0')}
                      </td>
                      <td className="border border-slate-800 p-2 text-center text-slate-300 italic text-[10px]">
                        [ Sign on entry ]
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Certification Footer */}
            <div className="border-t-2 border-slate-800 pt-3 flex items-center justify-between text-xs text-slate-600">
              <div>
                <span className="block text-[10px] uppercase font-bold text-slate-400">Bursar Endorsement</span>
                <span className="font-semibold text-slate-800">
                  {isClearedForExam ? '✓ Verified by School Bursary Office' : '⚠ Action Required: Pay fees to clear'}
                </span>
              </div>
              <div className="text-right">
                <span className="block text-[10px] uppercase font-bold text-slate-400">Chief Examiner</span>
                <span className="font-semibold text-slate-800">{settings.principalName}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

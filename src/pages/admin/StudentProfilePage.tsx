import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  ShieldAlert,
  Award,
  CheckCircle2,
  Printer,
  FileText,
  CreditCard,
} from 'lucide-react';
import { mockStudents, mockGrades, mockPaymentRecords } from '../../data/mockData';
import { Badge } from '../../components/ui/Badge';
import { useToast } from '../../context/ToastContext';

export const StudentProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const student = mockStudents.find((s) => s.id === id) || mockStudents[0];
  const grades = mockGrades.filter((g) => g.studentId === student.id);
  const payments = mockPaymentRecords.filter((p) => p.studentId === student.id);

  const calculateAverage = () => {
    if (grades.length === 0) return '85.4';
    const sum = grades.reduce((acc, curr) => acc + curr.total, 0);
    return (sum / grades.length).toFixed(1);
  };

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/admin/students')}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Students List</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Dossier</span>
          </button>
          <button
            onClick={() => showToast('Student official transcript generated.', 'success')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-brand-600 hover:bg-brand-700 text-white shadow-sm transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Generate Transcript</span>
          </button>
        </div>
      </div>

      {/* Main Profile Header Card */}
      <div className="p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <img
            src={student.avatar}
            alt={student.fullName}
            className="w-24 h-24 rounded-3xl object-cover ring-4 ring-brand-500/20 shadow-md"
          />
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {student.fullName}
              </h1>
              <Badge variant="success" dot size="sm">
                {student.status}
              </Badge>
              <Badge variant="brand" size="sm">
                {student.className}
              </Badge>
            </div>
            <p className="text-xs font-mono text-slate-400">
              Admission ID: <span className="font-bold text-slate-700 dark:text-slate-300">{student.admissionNo}</span>
            </p>
            <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Enrolled: {student.enrolledDate}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {student.stateOfOrigin} ({student.lga})
              </span>
              <span>Blood Group: <strong className="text-slate-700 dark:text-slate-300">{student.bloodGroup}</strong></span>
            </div>
          </div>
        </div>

        {/* Quick Highlights */}
        <div className="flex gap-4 sm:gap-6 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 pt-4 md:pt-0 md:pl-6 w-full md:w-auto">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
              Term Average
            </p>
            <p className="text-2xl font-black text-brand-600 dark:text-brand-400 mt-1">
              {calculateAverage()}%
            </p>
            <p className="text-[10px] text-emerald-600 font-semibold">Distinction Level</p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
              Attendance
            </p>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {student.attendancePercentage}%
            </p>
            <p className="text-[10px] text-slate-400">62 of 64 Days</p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
              Fees Balance
            </p>
            <p className={`text-2xl font-black mt-1 ${student.feeBalance > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
              ₦{student.feeBalance.toLocaleString()}
            </p>
            <p className="text-[10px] text-slate-400">
              {student.feeBalance === 0 ? 'Cleared' : 'Outstanding'}
            </p>
          </div>
        </div>
      </div>

      {/* Grid: Guardian info and Academic Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Guardian & Personal Details */}
        <div className="space-y-6">
          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
              Parent / Guardian Dossier
            </h3>
            <div className="space-y-3.5 text-xs">
              <div>
                <p className="text-slate-400">Primary Contact</p>
                <p className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5">
                  {student.guardianName}
                </p>
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{student.guardianPhone}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="truncate">{student.guardianEmail}</span>
              </div>
              <div className="flex items-start gap-2 text-slate-600 dark:text-slate-300">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>{student.address}</span>
              </div>
            </div>
          </div>

          {/* Fee Invoices */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Recent Bursary Receipts
              </h3>
              <CreditCard className="w-4 h-4 text-slate-400" />
            </div>
            {payments.length === 0 ? (
              <p className="text-xs text-slate-400">No payment receipts found for this term.</p>
            ) : (
              <div className="space-y-3">
                {payments.map((p) => (
                  <div
                    key={p.id}
                    className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-xs"
                  >
                    <div className="flex items-center justify-between font-semibold">
                      <span className="font-mono text-slate-700 dark:text-slate-300">{p.receiptNumber}</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">₦{p.amountPaid.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                      <span>{p.paymentDate}</span>
                      <Badge variant={p.status === 'Paid' ? 'success' : 'warning'} size="sm">
                        {p.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (2 cols): Grades & Examination Records */}
        <div className="lg:col-span-2 p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Current Term Academic Broadscore
              </h3>
              <p className="text-xs text-slate-400">
                2025/2026 Session • 2nd Term Continuous Assessment & Exam
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
              Verified by Dean
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase font-bold tracking-wider">
                  <th className="py-3 px-2">Subject</th>
                  <th className="py-3 px-2 text-center">CA 1 (20)</th>
                  <th className="py-3 px-2 text-center">CA 2 (20)</th>
                  <th className="py-3 px-2 text-center">Exam (60)</th>
                  <th className="py-3 px-2 text-center font-bold">Total (100)</th>
                  <th className="py-3 px-2 text-center">Grade</th>
                  <th className="py-3 px-2">Teacher's Remark</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:border-slate-800">
                {grades.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-6 text-center text-slate-400">
                      No score records entered for this student yet.
                    </td>
                  </tr>
                ) : (
                  grades.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-2 font-semibold text-slate-900 dark:text-white">
                        {item.subject}
                      </td>
                      <td className="py-3 px-2 text-center text-slate-600 dark:text-slate-300">
                        {item.ca1}
                      </td>
                      <td className="py-3 px-2 text-center text-slate-600 dark:text-slate-300">
                        {item.ca2}
                      </td>
                      <td className="py-3 px-2 text-center text-slate-600 dark:text-slate-300">
                        {item.exam}
                      </td>
                      <td className="py-3 px-2 text-center font-bold text-slate-900 dark:text-white">
                        {item.total}
                      </td>
                      <td className="py-3 px-2 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded font-black text-xs ${
                            item.grade === 'A'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : item.grade === 'B'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          }`}
                        >
                          {item.grade}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-slate-500 dark:text-slate-400 italic">
                        {item.remark}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  AlertTriangle,
  Download,
  Printer,
  Mail,
  Phone,
  FileText,
  UserX,
  CreditCard,
  Send,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { Student } from '../../types';
import { exportToCSV } from '../../utils/exportUtils';
import { FeeDemandNoticeModal } from './FeeDemandNoticeModal';

export const DebtorsRegisterTable: React.FC = () => {
  const { students, classes, payments, feeStructures, settings } = useData();
  const { showToast } = useToast();

  const [selectedClassId, setSelectedClassId] = useState<string>('all');
  const [selectedDebtor, setSelectedDebtor] = useState<Student | null>(null);

  // Filter students who have feeBalance > 0
  const debtors = students.filter((s) => {
    const matchClass = selectedClassId === 'all' || s.classId === selectedClassId;
    return matchClass && s.feeBalance > 0;
  });

  const totalOutstanding = debtors.reduce((acc, curr) => acc + curr.feeBalance, 0);

  const handleExportCSV = () => {
    if (debtors.length === 0) {
      showToast('No outstanding fee debtors found to export.', 'info');
      return;
    }

    const dataToExport = debtors.map((s, idx) => ({
      sn: idx + 1,
      studentName: s.fullName,
      admissionNo: s.admissionNo,
      className: s.className,
      guardianName: s.guardianName,
      guardianPhone: s.guardianPhone,
      guardianEmail: s.guardianEmail,
      balanceDue: `₦${s.feeBalance.toLocaleString()}`,
    }));

    exportToCSV(`School_Fee_Debtors_Register_${settings.currentTerm}.csv`, dataToExport, {
      sn: 'S/N',
      studentName: 'Student Name',
      admissionNo: 'Admission No',
      className: 'Class Arm',
      guardianName: 'Guardian Name',
      guardianPhone: 'Guardian Phone',
      guardianEmail: 'Guardian Email',
      balanceDue: 'Outstanding Balance (₦)',
    });

    showToast('Debtors register exported to CSV', 'success');
  };

  return (
    <div className="space-y-5">
      {/* Debtors KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 shadow-xs">
          <p className="text-xs text-rose-600 dark:text-rose-400 font-bold uppercase tracking-wider">
            Total Outstanding Tuition Debt
          </p>
          <p className="text-2xl font-black text-rose-700 dark:text-rose-300 mt-1 font-mono">
            ₦{totalOutstanding.toLocaleString()}
          </p>
          <p className="text-[11px] text-rose-500 mt-0.5">Across {debtors.length} registered students</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
            Debtors Count
          </p>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {debtors.length} Candidate{debtors.length !== 1 ? 's' : ''}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">Barred from exam entry until cleared</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
            Current Session Tariffs
          </p>
          <p className="text-lg font-bold text-slate-800 dark:text-slate-200 mt-1">
            Senior: ₦290k • Junior: ₦240k
          </p>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5">Zenith Bank Collection Active</p>
        </div>
      </div>

      {/* Filter and Export Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-500">Filter by Class:</span>
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="text-xs font-semibold py-1.5 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
          >
            <option value="all">All Class Arms ({students.filter((s) => s.feeBalance > 0).length} Debtors)</option>
            {classes.map((c) => {
              const count = students.filter((s) => s.classId === c.id && s.feeBalance > 0).length;
              return (
                <option key={c.id} value={c.id}>
                  {c.name} ({count} Debtors)
                </option>
              );
            })}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Ledger</span>
          </button>
          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-rose-700 hover:bg-rose-800 text-white shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Debtors CSV</span>
          </button>
        </div>
      </div>

      {/* Debtors Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {debtors.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <UserX className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">No Outstanding Debtors</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              All students in the selected class cohort have fully cleared their tuition dues.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-3">Student Name</th>
                  <th className="py-3 px-3">Class</th>
                  <th className="py-3 px-3">Admission No</th>
                  <th className="py-3 px-3">Guardian Contact</th>
                  <th className="py-3 px-3 text-right">Outstanding Arrears</th>
                  <th className="py-3 px-3 text-right no-print">Demand Notice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {debtors.map((student) => (
                  <tr
                    key={student.id}
                    className="hover:bg-rose-50/30 dark:hover:bg-rose-950/20 transition-colors"
                  >
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        {student.avatar ? (
                          <img
                            src={student.avatar}
                            alt={student.fullName}
                            className="w-8 h-8 rounded-full object-cover shrink-0"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-800 font-bold text-xs flex items-center justify-center shrink-0">
                            {student.firstName[0]}
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">
                            {student.fullName}
                          </p>
                          <p className="text-[10px] text-slate-400 font-mono">
                            Enrolled: {student.enrolledDate}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3 font-medium text-slate-700 dark:text-slate-300">
                      {student.className}
                    </td>

                    <td className="py-3 px-3 font-mono font-bold text-slate-700 dark:text-slate-300">
                      {student.admissionNo}
                    </td>

                    <td className="py-3 px-3">
                      <p className="font-semibold text-slate-900 dark:text-white">
                        {student.guardianName}
                      </p>
                      <a
                        href={`tel:${student.guardianPhone}`}
                        className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3 inline" />
                        <span>{student.guardianPhone}</span>
                      </a>
                    </td>

                    <td className="py-3 px-3 text-right font-mono font-extrabold text-sm text-rose-700 dark:text-rose-400">
                      ₦{student.feeBalance.toLocaleString()}
                    </td>

                    <td className="py-3 px-3 text-right no-print">
                      <button
                        type="button"
                        onClick={() => setSelectedDebtor(student)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-colors cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Demand Letter</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Fee Demand Letter Modal */}
      {selectedDebtor && (
        <FeeDemandNoticeModal
          isOpen={Boolean(selectedDebtor)}
          onClose={() => setSelectedDebtor(null)}
          student={selectedDebtor}
        />
      )}
    </div>
  );
};

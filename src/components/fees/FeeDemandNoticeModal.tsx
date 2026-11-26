import React from 'react';
import { Printer, ShieldAlert, AlertTriangle, Building, CheckCircle2 } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Student, SchoolSettings } from '../../types';
import { useData } from '../../context/DataContext';

interface FeeDemandNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
}

export const FeeDemandNoticeModal: React.FC<FeeDemandNoticeModalProps> = ({
  isOpen,
  onClose,
  student,
}) => {
  const { settings, feeStructures, payments } = useData();

  if (!student) return null;

  const isSenior = student.className.startsWith('SS');
  const feeStructure = isSenior ? feeStructures[0] : feeStructures[1] || feeStructures[0];
  const totalPayable = feeStructure?.totalAmount || (isSenior ? 290000 : 240000);
  const studentPayments = payments.filter((p) => p.studentId === student.id);
  const totalPaid = studentPayments.reduce((acc, p) => acc + p.amountPaid, 0);
  const balanceDue = student.feeBalance > 0 ? student.feeBalance : Math.max(0, totalPayable - totalPaid);

  const currentDate = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Fee Demand Notice: ${student.fullName}`}
      description={`Guardian: ${student.guardianName} • Outstanding: ₦${balanceDue.toLocaleString()}`}
      maxWidth="3xl"
    >
      <div className="space-y-4">
        {/* Action Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 no-print">
          <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 text-xs font-semibold">
            <AlertTriangle className="w-4 h-4" />
            <span>Formal School Tuition Arrears Notice</span>
          </div>

          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-white shadow-xs transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Official Notice (A4)</span>
          </button>
        </div>

        {/* Printable Official Letter */}
        <div className="bg-white text-slate-950 p-6 sm:p-10 rounded-2xl border-2 border-slate-800 shadow-md font-serif text-xs max-w-2xl mx-auto leading-relaxed">
          {/* Header */}
          <div className="text-center border-b-2 border-slate-900 pb-4 mb-4">
            <div className="w-12 h-12 rounded-xl border-2 border-[#153e31] flex flex-col items-center justify-center font-sans font-black text-lg text-[#153e31] mx-auto mb-1 bg-emerald-50">
              FEA
            </div>
            <h1 className="text-xl sm:text-2xl font-black uppercase text-[#153e31] font-sans tracking-tight">
              {settings.schoolName}
            </h1>
            <p className="text-[10px] italic text-slate-600 font-sans">
              "{settings.motto}"
            </p>
            <p className="text-[10px] text-slate-500 font-sans mt-0.5">
              {settings.address} | Tel: {settings.phone} | Bursary: bursary@federalexcellence.edu.ng
            </p>
            <div className="mt-2 inline-block bg-rose-800 text-white font-sans text-[10px] uppercase font-bold px-3 py-0.5 rounded tracking-wider">
              Bursary & Accounts Directorate • Final Fee Demand Notice
            </div>
          </div>

          {/* Date & Recipient Details */}
          <div className="flex justify-between items-start mb-4 font-sans text-xs">
            <div>
              <p className="font-bold text-slate-900">TO:</p>
              <p className="font-semibold text-slate-900">{student.guardianName}</p>
              <p className="text-slate-600">{student.address || 'Lagos, Nigeria'}</p>
              <p className="text-slate-600">Tel: {student.guardianPhone}</p>
              <p className="text-slate-600">Email: {student.guardianEmail}</p>
            </div>
            <div className="text-right">
              <p className="text-slate-500 text-[10px] uppercase font-bold">Ref Code:</p>
              <p className="font-mono font-bold text-slate-900">BUR/{student.admissionNo.replace('/', '-')}</p>
              <p className="text-slate-500 text-[10px] uppercase font-bold mt-1">Date Issued:</p>
              <p className="font-semibold text-slate-900">{currentDate}</p>
            </div>
          </div>

          {/* Letter Body */}
          <div className="space-y-3 font-sans">
            <p className="font-bold text-slate-900 text-xs uppercase border-b border-slate-300 pb-1">
              RE: OUTSTANDING TUITION & SCHOOL LEVY FOR {student.fullName.toUpperCase()} ({student.admissionNo} — {student.className})
            </p>

            <p className="text-slate-800">
              Dear Respected Parent / Guardian,
            </p>

            <p className="text-slate-700 text-justify">
              The Directorate of Bursary and Accounts hereby brings to your formal attention that the academic records for the <strong>{settings.currentTerm} {settings.currentSession}</strong> session indicate an outstanding tuition balance on the student account of your ward, <strong>{student.fullName}</strong>.
            </p>

            {/* Financial Ledger Table */}
            <div className="border border-slate-800 rounded-lg overflow-hidden my-3">
              <table className="w-full border-collapse text-left text-xs font-sans">
                <thead>
                  <tr className="bg-slate-100 text-slate-900 font-bold border-b border-slate-800">
                    <th className="p-2">Fee Description</th>
                    <th className="p-2 text-right">Assessed (₦)</th>
                    <th className="p-2 text-right">Amount Paid (₦)</th>
                    <th className="p-2 text-right">Arrears Due (₦)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-300 font-mono">
                  <tr>
                    <td className="p-2 font-sans">Term Tuition & Facilities Levy</td>
                    <td className="p-2 text-right">{totalPayable.toLocaleString()}</td>
                    <td className="p-2 text-right text-emerald-800">{totalPaid.toLocaleString()}</td>
                    <td className="p-2 text-right font-bold text-rose-800">{balanceDue.toLocaleString()}</td>
                  </tr>
                  <tr className="bg-slate-50 font-bold border-t border-slate-800">
                    <td className="p-2 font-sans uppercase">Total Overdue Remittance</td>
                    <td className="p-2 text-right">{totalPayable.toLocaleString()}</td>
                    <td className="p-2 text-right text-emerald-800">{totalPaid.toLocaleString()}</td>
                    <td className="p-2 text-right text-base text-rose-800">₦{balanceDue.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Bank Payment Mandate */}
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-300 space-y-1 text-xs">
              <p className="font-bold text-slate-900 uppercase text-[10px] tracking-wider">
                Approved Bank Remittance Details:
              </p>
              <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                <div>
                  <span className="text-slate-500 block text-[9px]">Account Name:</span>
                  <strong>Federal Excellence Academy</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[9px]">Bank Name:</span>
                  <strong>Zenith Bank Plc</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[9px]">Account Number:</span>
                  <strong className="text-emerald-800 text-sm">1012345678</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[9px]">Payment Narration:</span>
                  <strong>{student.admissionNo} - {student.firstName}</strong>
                </div>
              </div>
            </div>

            <p className="text-slate-700 text-justify">
              In accordance with school policy, candidates with unresolved arrears are not admissible into the examination hall or granted clearance dockets for terminal assessment examinations. We kindly request settlement of the aforementioned balance within <strong>5 working days</strong>.
            </p>

            <p className="text-slate-700">
              Please present the bank teller or proof of online transaction at the Bursary counter to receive an official digital receipt.
            </p>
          </div>

          {/* Signatures */}
          <div className="mt-6 pt-4 border-t-2 border-slate-800 flex justify-between items-end font-sans">
            <div>
              <p className="font-bold text-slate-900">Mrs. K. Bankole, FCA</p>
              <p className="text-[10px] text-slate-500">Director of Financial Services & Bursar</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-slate-900">{settings.principalName}</p>
              <p className="text-[10px] text-slate-500">Principal & Chief Executive</p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

import React from 'react';
import { Modal } from './Modal';
import { PaymentRecord } from '../../types';
import { mockSchoolSettings } from '../../data/mockData';
import { Printer, Download, CheckCircle } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: PaymentRecord | null;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  isOpen,
  onClose,
  record,
}) => {
  const { showToast } = useToast();

  if (!record) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    showToast(`Bursary Receipt ${record.receiptNumber} downloaded.`, 'success');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Official Bursary Payment Receipt"
      description={`Receipt reference: ${record.receiptNumber}`}
      maxWidth="xl"
      footer={
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-2.5 no-print">
          <div className="text-xs text-slate-500 font-mono">
            Recorded by: <span className="font-semibold text-slate-700 dark:text-slate-300">{record.recordedBy}</span>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold border border-slate-300 dark:border-slate-700 rounded-md text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-brand-700 hover:bg-brand-800 text-white rounded-md transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>
      }
    >
      {/* Official Bursary Document */}
      <div className="p-4 sm:p-6 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white print-shadow-none">
        {/* School Letterhead */}
        <div className="text-center pb-4 border-b border-slate-800 dark:border-slate-200">
          <div className="inline-block px-2 py-0.5 border border-slate-800 dark:border-slate-200 text-[10px] font-mono font-bold uppercase tracking-widest mb-1.5">
            BURSARY & ACCOUNTS DEPARTMENT
          </div>
          <h2 className="text-lg font-bold tracking-tight uppercase">
            {mockSchoolSettings.schoolName}
          </h2>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            {mockSchoolSettings.address} • Tel: {mockSchoolSettings.phone}
          </p>
          <div className="mt-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            OFFICIAL ELECTRONIC PAYMENT RECEIPT
          </div>
        </div>

        {/* Receipt Meta Grid */}
        <div className="grid grid-cols-2 gap-3 py-4 border-b border-slate-200 dark:border-slate-800 text-xs font-mono">
          <div>
            <span className="text-slate-400 text-[10px] uppercase block">Receipt No:</span>
            <strong className="text-slate-900 dark:text-white font-bold">{record.receiptNumber}</strong>
          </div>
          <div className="text-right">
            <span className="text-slate-400 text-[10px] uppercase block">Date Issued:</span>
            <strong className="text-slate-900 dark:text-white">{record.paymentDate}</strong>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] uppercase block">Student Name:</span>
            <strong className="text-slate-900 dark:text-white font-sans">{record.studentName}</strong>
            <span className="block text-[11px] text-slate-500">Adm No: {record.admissionNo}</span>
          </div>
          <div className="text-right">
            <span className="text-slate-400 text-[10px] uppercase block">Class / Term:</span>
            <strong className="text-slate-900 dark:text-white font-sans">{record.className}</strong>
            <span className="block text-[11px] text-slate-500">{record.term} ({record.session})</span>
          </div>
        </div>

        {/* Payment Line Items */}
        <div className="py-4 space-y-2 text-xs">
          <div className="flex justify-between text-slate-600 dark:text-slate-400 font-mono">
            <span>Total Assessed Fees:</span>
            <span className="font-semibold text-slate-900 dark:text-white">
              ₦{record.totalDue.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between text-slate-600 dark:text-slate-400 font-mono">
            <span>Payment Channel:</span>
            <span className="font-medium text-slate-800 dark:text-slate-200">{record.paymentMethod}</span>
          </div>
          <div className="flex justify-between py-2 border-t border-b border-slate-200 dark:border-slate-800 font-mono font-bold text-sm">
            <span className="text-slate-900 dark:text-white">AMOUNT TENDERED:</span>
            <span className="text-emerald-700 dark:text-emerald-400">
              ₦{record.amountPaid.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-500">Outstanding Balance:</span>
            <span className={record.balance > 0 ? 'text-rose-700 font-bold' : 'text-slate-500'}>
              ₦{record.balance.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Official Endorsement */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-500">
          <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>AUTHENTICATED BY BURSARY</span>
          </div>
          <div className="text-slate-400">
            STAMP: SYSTEM VERIFIED
          </div>
        </div>
      </div>
    </Modal>
  );
};

import React, { useState } from 'react';
import {
  CreditCard,
  Receipt,
  CheckCircle2,
  Calendar,
  Download,
} from 'lucide-react';
import { mockPaymentRecords, mockFeeStructures, mockStudents } from '../../data/mockData';
import { Badge } from '../../components/ui/Badge';
import { ReceiptModal } from '../../components/ui/ReceiptModal';
import { PaymentRecord } from '../../types';

export const StudentFeesPage: React.FC = () => {
  const student = mockStudents[0];
  const feeStructure = mockFeeStructures[0]; // Senior secondary
  const payment = mockPaymentRecords.find((p) => p.studentId === student.id) || mockPaymentRecords[0];

  const [selectedReceipt, setSelectedReceipt] = useState<PaymentRecord | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          School Fees & Clearance Statement
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          2nd Term 2025/2026 bursary statement and official receipt clearance.
        </p>
      </div>

      {/* Clearance Banner */}
      <div className="p-6 rounded-3xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-emerald-600 text-white">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-emerald-900 dark:text-emerald-100">
              Fees Fully Cleared for 2nd Term
            </h3>
            <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-0.5">
              Receipt No: <strong className="font-mono">{payment.receiptNumber}</strong> • Paid on {payment.paymentDate}
            </p>
          </div>
        </div>

        <button
          onClick={() => setSelectedReceipt(payment)}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors self-start sm:self-auto"
        >
          <Receipt className="w-4 h-4" />
          <span>View Official Receipt</span>
        </button>
      </div>

      {/* Breakdown Card */}
      <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Senior Secondary Fee Breakdown
          </h3>
          <Badge variant="success" size="sm">Fully Paid</Badge>
        </div>

        <div className="space-y-3 text-xs">
          <div className="flex justify-between py-1 text-slate-600 dark:text-slate-400">
            <span>Tuition & Instructional Material:</span>
            <span className="font-semibold text-slate-900 dark:text-white">₦{feeStructure.tuitionFee.toLocaleString()}</span>
          </div>
          <div className="flex justify-between py-1 text-slate-600 dark:text-slate-400">
            <span>Development & Infrastructure Levy:</span>
            <span className="font-semibold text-slate-900 dark:text-white">₦{feeStructure.developmentLevy.toLocaleString()}</span>
          </div>
          <div className="flex justify-between py-1 text-slate-600 dark:text-slate-400">
            <span>Computer Laboratory & ICT Subscription:</span>
            <span className="font-semibold text-slate-900 dark:text-white">₦{feeStructure.ictFee.toLocaleString()}</span>
          </div>
          <div className="flex justify-between py-1 text-slate-600 dark:text-slate-400">
            <span>PTA Termly Contribution:</span>
            <span className="font-semibold text-slate-900 dark:text-white">₦{feeStructure.ptaLevy.toLocaleString()}</span>
          </div>
          <div className="flex justify-between py-1 text-slate-600 dark:text-slate-400">
            <span>Science Laboratory & Reagents:</span>
            <span className="font-semibold text-slate-900 dark:text-white">₦{(feeStructure.laboratoryFee || 0).toLocaleString()}</span>
          </div>
          <div className="flex justify-between pt-3 border-t border-slate-200 dark:border-slate-800 font-bold text-sm text-slate-900 dark:text-white">
            <span>Total Term Amount:</span>
            <span className="text-brand-600 dark:text-brand-400 text-base">₦{feeStructure.totalAmount.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <ReceiptModal
        isOpen={Boolean(selectedReceipt)}
        onClose={() => setSelectedReceipt(null)}
        record={selectedReceipt}
      />
    </div>
  );
};

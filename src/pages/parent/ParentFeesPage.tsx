import React, { useState } from 'react';
import {
  CreditCard,
  Receipt,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { mockPaymentRecords, mockFeeStructures } from '../../data/mockData';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { ReceiptModal } from '../../components/ui/ReceiptModal';
import { PaymentRecord } from '../../types';
import { useToast } from '../../context/ToastContext';

export const ParentFeesPage: React.FC = () => {
  const { selectedWard, wards, setSelectedWardId } = useAuth();
  const { showToast } = useToast();

  const activeWard = selectedWard || wards[0];
  const isSenior = activeWard.className.startsWith('SS');
  const feeStructure = isSenior ? mockFeeStructures[0] : mockFeeStructures[1];

  const paymentRecord = mockPaymentRecords.find((p) => p.studentId === activeWard.studentId) || mockPaymentRecords[0];

  const [selectedReceipt, setSelectedReceipt] = useState<PaymentRecord | null>(null);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSimulatePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsPayModalOpen(false);
      activeWard.feeBalance = 0;
      showToast(`Payment of ₦${(35000).toLocaleString()} for ${activeWard.name} successful!`, 'success');
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Header and Child Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            School Fee Statements & Payments
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Review fee bills and pay tuition securely online for <strong className="text-brand-600 dark:text-brand-400">{activeWard.name}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          {wards.map((w) => (
            <button
              key={w.studentId}
              onClick={() => setSelectedWardId(w.studentId)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                w.studentId === activeWard.studentId
                  ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {w.name.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Outstanding Balance or Cleared Alert */}
      {activeWard.feeBalance > 0 ? (
        <div className="p-6 rounded-3xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-amber-600 text-white">
              <AlertCircle className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-amber-950 dark:text-amber-100">
                Outstanding Balance: ₦{activeWard.feeBalance.toLocaleString()}
              </h3>
              <p className="text-xs text-amber-700 dark:text-amber-300 mt-0.5">
                2nd Term balance for {activeWard.name} ({activeWard.className}). Due before examination clearance.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPayModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold rounded-xl bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-600/20 transition-all"
            >
              <CreditCard className="w-4 h-4" />
              <span>Pay ₦{activeWard.feeBalance.toLocaleString()} Online</span>
            </button>
            <button
              onClick={() => setSelectedReceipt(paymentRecord)}
              className="px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-900/40"
            >
              Partial Receipt
            </button>
          </div>
        </div>
      ) : (
        <div className="p-6 rounded-3xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-emerald-600 text-white">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-emerald-950 dark:text-emerald-100">
                Term Fees Fully Paid
              </h3>
              <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-0.5">
                Zero balance remaining for {activeWard.name}. Bursary clearance authenticated.
              </p>
            </div>
          </div>

          <button
            onClick={() => setSelectedReceipt(paymentRecord)}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors"
          >
            <Receipt className="w-4 h-4" />
            <span>View Bursary Receipt</span>
          </button>
        </div>
      )}

      {/* Detailed Bill Breakdown */}
      <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Official Fee Bill: {activeWard.name} ({activeWard.className})
          </h3>
          <Badge variant="brand" size="sm">2nd Term 2025/2026</Badge>
        </div>

        <div className="space-y-3 text-xs">
          <div className="flex justify-between py-1 text-slate-600 dark:text-slate-400">
            <span>Tuition & Boarding Services:</span>
            <span className="font-semibold text-slate-900 dark:text-white">₦{feeStructure.tuitionFee.toLocaleString()}</span>
          </div>
          <div className="flex justify-between py-1 text-slate-600 dark:text-slate-400">
            <span>Development & Library Levy:</span>
            <span className="font-semibold text-slate-900 dark:text-white">₦{feeStructure.developmentLevy.toLocaleString()}</span>
          </div>
          <div className="flex justify-between py-1 text-slate-600 dark:text-slate-400">
            <span>ICT Infrastructure & Software Portal:</span>
            <span className="font-semibold text-slate-900 dark:text-white">₦{feeStructure.ictFee.toLocaleString()}</span>
          </div>
          <div className="flex justify-between py-1 text-slate-600 dark:text-slate-400">
            <span>Parents Teachers Association (PTA) Levy:</span>
            <span className="font-semibold text-slate-900 dark:text-white">₦{feeStructure.ptaLevy.toLocaleString()}</span>
          </div>
          {feeStructure.laboratoryFee && (
            <div className="flex justify-between py-1 text-slate-600 dark:text-slate-400">
              <span>Science Laboratories & Consumables:</span>
              <span className="font-semibold text-slate-900 dark:text-white">₦{feeStructure.laboratoryFee.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between pt-3 border-t border-slate-200 dark:border-slate-800 font-bold text-sm text-slate-900 dark:text-white">
            <span>Total Term Assessment:</span>
            <span className="text-brand-600 dark:text-brand-400 text-base">₦{feeStructure.totalAmount.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Pay Online Modal Simulation */}
      <Modal
        isOpen={isPayModalOpen}
        onClose={() => setIsPayModalOpen(false)}
        title="Pay School Fees Online"
        description={`Direct settlement for ${activeWard.name} (${activeWard.className})`}
        maxWidth="md"
        footer={
          <div className="flex items-center justify-between w-full">
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-500" /> 256-Bit SSL Encrypted
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsPayModalOpen(false)}
                className="px-3.5 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSimulatePayment}
                disabled={isProcessing}
                className="px-5 py-2 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-md transition-all"
              >
                {isProcessing ? 'Processing Payment...' : `Authorize ₦${activeWard.feeBalance.toLocaleString()}`}
              </button>
            </div>
          </div>
        }
      >
        <div className="space-y-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Student:</span>
              <strong className="text-slate-900 dark:text-white">{activeWard.name}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Class:</span>
              <span className="text-slate-700 dark:text-slate-300">{activeWard.className}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Amount to Pay:</span>
              <strong className="text-emerald-600 text-sm">₦{activeWard.feeBalance.toLocaleString()}</strong>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Select Payment Method
            </label>
            <select className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs">
              <option>Debit Card (Mastercard / Visa / Verve)</option>
              <option>Direct Bank Transfer (Instant NIP)</option>
              <option>USSD Banking (*737# / *901#)</option>
            </select>
          </div>
        </div>
      </Modal>

      {/* Official Receipt Modal */}
      <ReceiptModal
        isOpen={Boolean(selectedReceipt)}
        onClose={() => setSelectedReceipt(null)}
        record={selectedReceipt}
      />
    </div>
  );
};

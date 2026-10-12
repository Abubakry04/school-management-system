import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  CreditCard,
  Plus,
  Receipt,
  Download,
  CheckCircle2,
  AlertCircle,
  FileText,
  DollarSign,
} from 'lucide-react';
import { DataTable, Column } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { FormInput, FormSelect } from '../../components/ui/FormInputs';
import { ReceiptModal } from '../../components/ui/ReceiptModal';
import { PaymentRecord, FeeStructure } from '../../types';
import { mockPaymentRecords, mockFeeStructures, mockStudents } from '../../data/mockData';
import { useToast } from '../../context/ToastContext';

const paymentSchema = z.object({
  studentId: z.string().min(1, 'Please select a student'),
  amountPaid: z.number().min(5000, 'Minimum payment amount is ₦5,000'),
  paymentMethod: z.enum(['Bank Transfer', 'POS', 'Cash', 'Card Online']),
  term: z.string().min(1, 'Term is required'),
});

type PaymentFormData = z.infer<typeof paymentSchema>;

export const FeesPage: React.FC = () => {
  const { showToast } = useToast();

  const [paymentRecords, setPaymentRecords] = useState<PaymentRecord[]>(mockPaymentRecords);
  const [selectedReceipt, setSelectedReceipt] = useState<PaymentRecord | null>(null);
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      studentId: mockStudents[0].id,
      amountPaid: 290000,
      paymentMethod: 'Bank Transfer',
      term: '2nd Term',
    },
  });

  const totalCollected = paymentRecords.reduce((acc, curr) => acc + curr.amountPaid, 0);
  const totalBalance = paymentRecords.reduce((acc, curr) => acc + curr.balance, 0);

  const onSubmitPayment = (data: PaymentFormData) => {
    const student = mockStudents.find((s) => s.id === data.studentId) || mockStudents[0];
    const totalDue = student.className.startsWith('SS') ? 290000 : 240000;
    const balance = Math.max(0, totalDue - data.amountPaid);
    const status = balance === 0 ? 'Paid' : data.amountPaid > 0 ? 'Partial' : 'Pending';

    const newPayment: PaymentRecord = {
      id: `pay-${Date.now()}`,
      receiptNumber: `FEA/REC/2026/0${Math.floor(550 + Math.random() * 400)}`,
      studentId: student.id,
      studentName: student.fullName,
      admissionNo: student.admissionNo,
      className: student.className,
      amountPaid: data.amountPaid,
      totalDue,
      balance,
      paymentDate: '16th Feb, 2026',
      paymentMethod: data.paymentMethod,
      status,
      term: data.term,
      session: '2025/2026',
      recordedBy: 'Mrs. K. Bankole (Bursar)',
    };

    setPaymentRecords((prev) => [newPayment, ...prev]);
    showToast(`Payment of ₦${data.amountPaid.toLocaleString()} recorded for ${student.fullName}`, 'success');
    setIsRecordModalOpen(false);
    reset();
  };

  const columns: Column<PaymentRecord>[] = [
    {
      key: 'receiptNumber',
      header: 'Receipt No.',
      sortable: true,
      accessor: (p) => (
        <span className="font-mono text-xs font-bold text-brand-600 dark:text-brand-400">
          {p.receiptNumber}
        </span>
      ),
    },
    {
      key: 'studentName',
      header: 'Student Name',
      sortable: true,
      accessor: (p) => (
        <div>
          <p className="font-semibold text-slate-900 dark:text-white leading-tight">
            {p.studentName}
          </p>
          <p className="text-[11px] text-slate-400">{p.className} • {p.admissionNo}</p>
        </div>
      ),
    },
    {
      key: 'amountPaid',
      header: 'Amount Paid',
      sortable: true,
      accessor: (p) => (
        <span className="font-bold text-emerald-600 dark:text-emerald-400">
          ₦{p.amountPaid.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'balance',
      header: 'Balance',
      sortable: true,
      accessor: (p) => (
        <span className={p.balance > 0 ? 'font-bold text-rose-600' : 'text-slate-400'}>
          ₦{p.balance.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'paymentMethod',
      header: 'Method',
      accessor: (p) => (
        <span className="text-xs text-slate-600 dark:text-slate-400">{p.paymentMethod}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      accessor: (p) => (
        <Badge
          variant={p.status === 'Paid' ? 'success' : p.status === 'Partial' ? 'warning' : 'danger'}
          dot
          size="sm"
        >
          {p.status}
        </Badge>
      ),
    },
    {
      key: 'paymentDate',
      header: 'Date',
      accessor: (p) => <span className="text-xs text-slate-500">{p.paymentDate}</span>,
    },
    {
      key: 'receiptAction',
      header: 'Receipt',
      className: 'text-right',
      accessor: (p) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setSelectedReceipt(p);
          }}
          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-brand-50 dark:hover:bg-brand-950/60 text-slate-700 dark:text-slate-300 hover:text-brand-600 transition-colors"
        >
          <Receipt className="w-3.5 h-3.5" />
          <span>Receipt</span>
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Bursary & Fee Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Termly fee structures, student payment records, outstanding balances, and official receipts.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => showToast('Financial audit statement downloaded', 'info')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Statement</span>
          </button>
          <button
            onClick={() => setIsRecordModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-600/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Record Payment</span>
          </button>
        </div>
      </div>

      {/* Summary Stat Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-xs text-slate-400 font-semibold uppercase">Total Fee Payments</p>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            ₦{totalCollected.toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">Logged across {paymentRecords.length} transactions</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-xs text-slate-400 font-semibold uppercase">Outstanding Term Balances</p>
          <p className="text-2xl font-black text-rose-600 mt-1">
            ₦{totalBalance.toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">Automated SMS reminders active</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-xs text-slate-400 font-semibold uppercase">Senior Secondary Tariff</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            ₦290,000 / Term
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">Junior: ₦240,000 / Term</p>
        </div>
      </div>

      {/* Fee Structure Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockFeeStructures.map((fee) => (
          <div
            key={fee.id}
            className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {fee.title}
              </h3>
              <Badge variant="brand" size="sm">{fee.term}</Badge>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Tuition & Boarding Fee:</span>
                <span className="font-semibold text-slate-900 dark:text-white">₦{fee.tuitionFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>School Development Levy:</span>
                <span className="font-semibold text-slate-900 dark:text-white">₦{fee.developmentLevy.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>ICT & Computer Lab Fee:</span>
                <span className="font-semibold text-slate-900 dark:text-white">₦{fee.ictFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>PTA Termly Levy:</span>
                <span className="font-semibold text-slate-900 dark:text-white">₦{fee.ptaLevy.toLocaleString()}</span>
              </div>
              {fee.laboratoryFee && (
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Science Practical & Lab Fee:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">₦{fee.laboratoryFee.toLocaleString()}</span>
                </div>
              )}
            </div>
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-baseline font-bold text-sm">
              <span className="text-slate-900 dark:text-white">Total Term Payable</span>
              <span className="text-brand-600 dark:text-brand-400 text-lg">₦{fee.totalAmount.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Payment Transactions DataTable */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Payment Transactions Register
        </h3>
        <DataTable
          data={paymentRecords}
          columns={columns}
          rowKey={(p) => p.id}
          searchPlaceholder="Search by receipt no, student name, admission no..."
          searchKeys={['receiptNumber', 'studentName', 'admissionNo', 'className']}
          filters={[
            {
              key: 'status',
              label: 'Status',
              options: [
                { label: 'Paid', value: 'Paid' },
                { label: 'Partial', value: 'Partial' },
                { label: 'Pending', value: 'Pending' },
              ],
            },
          ]}
          onRowClick={(p) => setSelectedReceipt(p)}
        />
      </div>

      {/* Record Payment Modal */}
      <Modal
        isOpen={isRecordModalOpen}
        onClose={() => setIsRecordModalOpen(false)}
        title="Record School Fee Payment"
        description="Issue official bursary record and receipt."
        maxWidth="md"
      >
        <form onSubmit={handleSubmit(onSubmitPayment)} className="space-y-4">
          <FormSelect
            label="Select Student"
            required
            {...register('studentId')}
            options={mockStudents.map((s) => ({
              label: `${s.fullName} (${s.className} - ${s.admissionNo})`,
              value: s.id,
            }))}
          />

          <FormInput
            label="Amount Paid (₦)"
            required
            type="number"
            {...register('amountPaid', { valueAsNumber: true })}
            error={errors.amountPaid?.message}
            placeholder="e.g. 290000"
          />

          <div className="grid grid-cols-2 gap-4">
            <FormSelect
              label="Payment Channel"
              required
              {...register('paymentMethod')}
              options={[
                { label: 'Bank Transfer', value: 'Bank Transfer' },
                { label: 'POS Terminal', value: 'POS' },
                { label: 'Cash at Bursary', value: 'Cash' },
                { label: 'Card Online', value: 'Card Online' },
              ]}
            />
            <FormSelect
              label="Term"
              required
              {...register('term')}
              options={[
                { label: '2nd Term', value: '2nd Term' },
                { label: '1st Term', value: '1st Term' },
                { label: '3rd Term', value: '3rd Term' },
              ]}
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsRecordModalOpen(false)}
              className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-md transition-colors"
            >
              Issue Receipt
            </button>
          </div>
        </form>
      </Modal>

      {/* Printable Receipt Preview Modal */}
      <ReceiptModal
        isOpen={Boolean(selectedReceipt)}
        onClose={() => setSelectedReceipt(null)}
        record={selectedReceipt}
      />
    </div>
  );
};

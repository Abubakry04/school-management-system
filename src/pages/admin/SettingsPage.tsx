import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Calendar,
  Save,
  Building,
  RotateCcw,
  Trash2,
  ShieldAlert,
  FileSpreadsheet,
  Clock,
  Activity,
} from 'lucide-react';
import { SchoolSettings, AuditLog } from '../../types';
import { FormInput, FormSelect } from '../../components/ui/FormInputs';
import { useToast } from '../../context/ToastContext';
import { useData } from '../../context/DataContext';
import { exportToCSV } from '../../utils/exportUtils';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';

const settingsSchema = z.object({
  schoolName: z.string().min(3, 'School name is required'),
  motto: z.string().min(3, 'Motto is required'),
  address: z.string().min(5, 'Address is required'),
  phone: z.string().min(7, 'Phone is required'),
  email: z.string().email('Valid email is required'),
  currentSession: z.string().min(4, 'Session is required'),
  currentTerm: z.enum(['1st Term', '2nd Term', '3rd Term']),
  principalName: z.string().min(3, 'Principal name is required'),
  nextTermResumption: z.string().min(3, 'Resumption date is required'),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

export const SettingsPage: React.FC = () => {
  const { showToast } = useToast();
  const { settings, updateSettings, clearAllRecords, auditLogs } = useData();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: settings,
  });

  const onSubmit = (data: SettingsFormData) => {
    updateSettings(data);
    showToast('School settings and term parameters updated!', 'success');
  };

  const handleClearAllRecords = () => {
    if (
      window.confirm(
        'Are you sure you want to purge all dynamic records (students, invoices, attendance, grades, announcements)? Institutional details and subjects will remain intact.'
      )
    ) {
      clearAllRecords();
      showToast('All dynamic data purged. The system is now completely fresh.', 'info');
    }
  };

  const handleExportAuditLogs = () => {
    if (auditLogs.length === 0) {
      showToast('No audit events recorded yet', 'info');
      return;
    }
    exportToCSV('school_system_audit_log.csv', auditLogs, {
      id: 'Event ID',
      timestamp: 'Timestamp',
      category: 'Category',
      action: 'Action',
      details: 'Details',
      performedBy: 'User',
    });
    showToast('Audit trail exported successfully', 'success');
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          System & Institutional Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Configure school identity, active academic calendar, data maintenance, and security audit trail.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* School Profile Card */}
        <div className="p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Building className="w-5 h-5 text-brand-600" />
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                School Information & Letterhead
              </h2>
              <p className="text-xs text-slate-400">
                Details printed on official report cards, fee receipts, and correspondence.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Official School Name"
              required
              {...register('schoolName')}
              error={errors.schoolName?.message}
            />
            <FormInput
              label="School Motto"
              required
              {...register('motto')}
              error={errors.motto?.message}
            />
          </div>

          <FormInput
            label="Campus Address"
            required
            {...register('address')}
            error={errors.address?.message}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Administrative Phone"
              required
              {...register('phone')}
              error={errors.phone?.message}
            />
            <FormInput
              label="Official Email"
              required
              type="email"
              {...register('email')}
              error={errors.email?.message}
            />
          </div>

          <FormInput
            label="Principal / Head of School"
            required
            {...register('principalName')}
            error={errors.principalName?.message}
          />
        </div>

        {/* Academic Session & Calendar Card */}
        <div className="p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Calendar className="w-5 h-5 text-brand-600" />
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Academic Session & Term Configuration
              </h2>
              <p className="text-xs text-slate-400">
                Controls portal term calculations, exam score access, and fee schedules.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormInput
              label="Active Session"
              required
              {...register('currentSession')}
              error={errors.currentSession?.message}
              placeholder="2025/2026"
            />
            <FormSelect
              label="Active Term"
              required
              {...register('currentTerm')}
              options={[
                { label: '1st Term (Autumn)', value: '1st Term' },
                { label: '2nd Term (Winter/Spring)', value: '2nd Term' },
                { label: '3rd Term (Summer)', value: '3rd Term' },
              ]}
            />
            <FormInput
              label="Next Term Resumption"
              required
              {...register('nextTermResumption')}
              error={errors.nextTermResumption?.message}
              placeholder="28th April, 2026"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-md shadow-brand-600/25 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>

      {/* System Audit Trail */}
      <div className="p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <Activity className="w-5 h-5 text-brand-600" />
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Audit Trail & Security Activity Log
              </h2>
              <p className="text-xs text-slate-400">
                Tracks critical administrative mutations, student status modifications, and financial actions.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleExportAuditLogs}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Export CSV</span>
          </button>
        </div>

        {auditLogs.length === 0 ? (
          <EmptyState
            title="No activity recorded"
            description="Operational events and user actions will be listed here chronologically."
          />
        ) : (
          <div className="max-h-72 overflow-y-auto space-y-2 pr-1 divide-y divide-slate-100 dark:divide-slate-800/60">
            {auditLogs.map((log) => (
              <div key={log.id} className="pt-2.5 pb-1 flex items-start justify-between gap-4 text-xs">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Badge variant="brand" size="sm">
                      {log.category}
                    </Badge>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {log.action}
                    </span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                    {log.details}
                  </p>
                </div>
                <div className="text-right whitespace-nowrap text-[10px] text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{log.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Database Maintenance & Clear Data */}
      <div className="p-6 sm:p-8 bg-rose-50/50 dark:bg-rose-950/20 rounded-3xl border border-rose-200 dark:border-rose-900/40 shadow-sm space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-rose-100 dark:border-rose-900/40">
          <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400" />
          <div>
            <h2 className="text-base font-bold text-rose-900 dark:text-rose-200">
              Data Purge & System Reset
            </h2>
            <p className="text-xs text-rose-600 dark:text-rose-400">
              Administrative data management controls.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
          <div>
            <p className="text-xs font-semibold text-slate-900 dark:text-white">
              Purge All Dynamic Records (Fresh State)
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Permanently empties all students, invoices/payments, attendance, grades, and announcements. Institutional settings and subjects remain preserved.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClearAllRecords}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-rose-700 dark:text-rose-300 bg-rose-100 hover:bg-rose-200 dark:bg-rose-900/40 dark:hover:bg-rose-900/60 rounded-xl transition-colors whitespace-nowrap"
          >
            <Trash2 className="w-4 h-4" />
            <span>Purge Dynamic Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};

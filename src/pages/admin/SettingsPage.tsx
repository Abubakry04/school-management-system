import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Settings,
  School,
  Calendar,
  Save,
  CheckCircle,
  Building,
  GraduationCap,
} from 'lucide-react';
import { mockSchoolSettings } from '../../data/mockData';
import { SchoolSettings } from '../../types';
import { FormInput, FormSelect } from '../../components/ui/FormInputs';
import { useToast } from '../../context/ToastContext';

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
  const [settings, setSettings] = useState<SchoolSettings>(mockSchoolSettings);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: settings,
  });

  const onSubmit = (data: SettingsFormData) => {
    setSettings((prev) => ({ ...prev, ...data }));
    showToast('School settings and term parameters updated!', 'success');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          System & Institutional Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Configure school identity, active academic calendar, and administrative authorities.
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

        {/* Action Button */}
        <div className="flex justify-end">
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
    </div>
  );
};

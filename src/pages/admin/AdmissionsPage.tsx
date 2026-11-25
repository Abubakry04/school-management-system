import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  UserPlus,
  CheckCircle2,
  Clock,
  Award,
  ChevronRight,
  Filter,
  Plus,
  Mail,
  Phone,
  FileCheck,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { AdmissionApplicant } from '../../types';
import { Modal } from '../../components/ui/Modal';
import { FormInput, FormSelect } from '../../components/ui/FormInputs';
import { Badge } from '../../components/ui/Badge';

const applicantSchema = z.object({
  studentName: z.string().min(3, 'Full name is required'),
  gender: z.enum(['Male', 'Female']),
  targetClass: z.string().min(2, 'Target class is required'),
  guardianName: z.string().min(3, 'Guardian name is required'),
  guardianPhone: z.string().min(10, 'Guardian phone is required'),
  guardianEmail: z.string().email('Valid email is required'),
});

type ApplicantFormData = z.infer<typeof applicantSchema>;

export const AdmissionsPage: React.FC = () => {
  const { showToast } = useToast();
  const { applicants, classes, addApplicant, updateApplicantStatus, enrollApplicant } = useData();

  const [statusFilter, setStatusFilter] = useState('All');
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState<AdmissionApplicant | null>(null);
  const [scoreInput, setScoreInput] = useState<number>(75);
  const [enrollClassId, setEnrollClassId] = useState<string>(classes[0]?.id || '');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ApplicantFormData>({
    resolver: zodResolver(applicantSchema),
    defaultValues: {
      gender: 'Male',
      targetClass: 'JSS 1',
    },
  });

  const filteredApplicants = applicants.filter((a) => {
    if (statusFilter === 'All') return true;
    return a.status === statusFilter;
  });

  const onSubmit = (data: ApplicantFormData) => {
    const created = addApplicant({
      ...data,
      status: 'Pending Review',
    });
    showToast(`Application registered for ${created.studentName} (${created.applicationNo})`, 'success');
    setIsNewModalOpen(false);
    reset();
  };

  const handleUpdateStatus = (id: string, status: AdmissionApplicant['status'], score?: number) => {
    updateApplicantStatus(id, status, score);
    showToast(`Status updated to ${status}`, 'info');
    setSelectedApplicant(null);
  };

  const handleConfirmEnroll = () => {
    if (!selectedApplicant) return;
    const enrolled = enrollApplicant(selectedApplicant.id, enrollClassId);
    if (enrolled) {
      showToast(`${enrolled.fullName} successfully enrolled into ${enrolled.className}!`, 'success');
    }
    setSelectedApplicant(null);
  };

  const getStatusBadge = (status: AdmissionApplicant['status']) => {
    switch (status) {
      case 'Pending Review':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">Pending Review</span>;
      case 'Exam Scheduled':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">Exam Scheduled</span>;
      case 'Offered Admission':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300">Offered Admission</span>;
      case 'Enrolled':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">Enrolled (Active)</span>;
      default:
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Admissions & Candidate Pipeline
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Entrance assessment records, applicant intake, and matriculation onboarding.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsNewModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#153e31] hover:bg-[#1a4a3b] text-white text-sm font-semibold shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Application</span>
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <p className="text-xs font-semibold uppercase text-slate-500">Total Applicants</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{applicants.length}</p>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <p className="text-xs font-semibold uppercase text-slate-500">Exams & Screening</p>
          <p className="text-2xl font-black text-blue-600 mt-1">
            {applicants.filter((a) => a.status === 'Exam Scheduled' || a.status === 'Pending Review').length}
          </p>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <p className="text-xs font-semibold uppercase text-slate-500">Admission Offered</p>
          <p className="text-2xl font-black text-amber-600 mt-1">
            {applicants.filter((a) => a.status === 'Offered Admission').length}
          </p>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <p className="text-xs font-semibold uppercase text-slate-500">Enrolled Students</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">
            {applicants.filter((a) => a.status === 'Enrolled').length}
          </p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-3 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
        <span className="text-xs font-semibold text-slate-500">Filter Status:</span>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-1.5 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
        >
          <option value="All">All Applications</option>
          <option value="Pending Review">Pending Review</option>
          <option value="Exam Scheduled">Exam Scheduled</option>
          <option value="Offered Admission">Offered Admission</option>
          <option value="Enrolled">Enrolled</option>
        </select>
      </div>

      {/* Applicants List */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase font-bold tracking-wider">
                <th className="py-3.5 px-4">Applicant</th>
                <th className="py-3.5 px-4">Application No</th>
                <th className="py-3.5 px-4">Target Class</th>
                <th className="py-3.5 px-4">Guardian Contact</th>
                <th className="py-3.5 px-4 text-center">Score</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredApplicants.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No admission applications found for this filter.
                  </td>
                </tr>
              ) : (
                filteredApplicants.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-900 dark:text-white text-sm">
                        {app.studentName}
                      </p>
                      <p className="text-slate-400 text-[11px]">{app.gender} • Applied {app.applicationDate}</p>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-300 font-bold">
                      {app.applicationNo}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200">
                      {app.targetClass}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                      <p className="font-medium text-slate-800 dark:text-slate-200">{app.guardianName}</p>
                      <p className="text-[11px]">{app.guardianPhone}</p>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {app.entranceScore ? (
                        <span className="font-black text-slate-900 dark:text-white text-sm">
                          {app.entranceScore}%
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">Not tested</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      {getStatusBadge(app.status)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {app.status === 'Offered Admission' ? (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedApplicant(app);
                            setEnrollClassId(classes[0]?.id || '');
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs transition-colors"
                        >
                          <FileCheck className="w-3.5 h-3.5" />
                          <span>Enroll Student</span>
                        </button>
                      ) : app.status === 'Enrolled' ? (
                        <span className="text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
                          Active Student
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedApplicant(app);
                            setScoreInput(app.entranceScore || 75);
                          }}
                          className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
                        >
                          Update Status
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Application Modal */}
      <Modal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        title="Register New Entrance Applicant"
        maxWidth="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Candidate Full Name"
              required
              {...register('studentName')}
              error={errors.studentName?.message}
              placeholder="e.g. Babatunde Adeyemi"
            />
            <FormSelect
              label="Gender"
              required
              {...register('gender')}
              options={[
                { label: 'Male', value: 'Male' },
                { label: 'Female', value: 'Female' },
              ]}
            />
          </div>

          <FormSelect
            label="Target Class for Admission"
            required
            {...register('targetClass')}
            options={[
              { label: 'JSS 1', value: 'JSS 1' },
              { label: 'JSS 2', value: 'JSS 2' },
              { label: 'JSS 3', value: 'JSS 3' },
              { label: 'SS 1 Science', value: 'SS 1 Science' },
              { label: 'SS 1 Arts', value: 'SS 1 Arts' },
              { label: 'SS 2 Science', value: 'SS 2 Science' },
            ]}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Parent / Guardian Name"
              required
              {...register('guardianName')}
              error={errors.guardianName?.message}
            />
            <FormInput
              label="Guardian Phone"
              required
              {...register('guardianPhone')}
              error={errors.guardianPhone?.message}
              placeholder="+234 803 000 0000"
            />
          </div>

          <FormInput
            label="Guardian Email"
            type="email"
            required
            {...register('guardianEmail')}
            error={errors.guardianEmail?.message}
          />

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={() => setIsNewModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs transition-colors"
            >
              Submit Application
            </button>
          </div>
        </form>
      </Modal>

      {/* Status Update / Matriculation Modal */}
      {selectedApplicant && (
        <Modal
          isOpen={!!selectedApplicant}
          onClose={() => setSelectedApplicant(null)}
          title={`Review Candidate: ${selectedApplicant.studentName}`}
          maxWidth="md"
        >
          <div className="space-y-4 py-2">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs space-y-1">
              <p>Application: <strong>{selectedApplicant.applicationNo}</strong></p>
              <p>Target: <strong>{selectedApplicant.targetClass}</strong></p>
              <p>Current Status: <strong>{selectedApplicant.status}</strong></p>
            </div>

            {selectedApplicant.status === 'Offered Admission' ? (
              <div className="space-y-3">
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Select which classroom arm to allocate this accepted student into:
                </p>
                <FormSelect
                  label="Assign Class Arm"
                  value={enrollClassId}
                  onChange={(e) => setEnrollClassId(e.target.value)}
                  options={classes.map((c) => ({ label: `${c.name} (${c.room})`, value: c.id }))}
                />
                <button
                  type="button"
                  onClick={handleConfirmEnroll}
                  className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-colors"
                >
                  Matriculate & Create Active Student Profile
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <FormInput
                  label="Entrance Exam Score (%)"
                  type="number"
                  value={scoreInput}
                  onChange={(e) => setScoreInput(Number(e.target.value))}
                  min={0}
                  max={100}
                />

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(selectedApplicant.id, 'Exam Scheduled')}
                    className="py-2 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 text-slate-700 dark:text-slate-200"
                  >
                    Schedule Exam
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(selectedApplicant.id, 'Offered Admission', scoreInput)}
                    className="py-2 text-xs font-semibold rounded-xl bg-emerald-700 text-white hover:bg-emerald-800"
                  >
                    Offer Admission
                  </button>
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  Clock,
  Award,
  Layers,
  GraduationCap,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { Subject } from '../../types';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { FormInput, FormSelect } from '../../components/ui/FormInputs';
import { Badge } from '../../components/ui/Badge';

const subjectSchema = z.object({
  code: z.string().min(2, 'Code is required (e.g. MTH-101)'),
  name: z.string().min(3, 'Subject name is required'),
  department: z.enum(['Sciences', 'Arts & Humanities', 'Commercial', 'Languages', 'Vocational']),
  level: z.enum(['Junior', 'Senior', 'All']),
  periodsPerWeek: z.number().min(1).max(10),
  passMark: z.number().min(30).max(70),
  headTeacherId: z.string().optional(),
});

type SubjectFormData = z.infer<typeof subjectSchema>;

export const SubjectsPage: React.FC = () => {
  const { showToast } = useToast();
  const { subjects, teachers, addSubject, updateSubject, deleteSubject } = useData();

  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [levelFilter, setLevelFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [subjectToDelete, setSubjectToDelete] = useState<Subject | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SubjectFormData>({
    resolver: zodResolver(subjectSchema),
    defaultValues: {
      department: 'Sciences',
      level: 'All',
      periodsPerWeek: 4,
      passMark: 50,
    },
  });

  const filteredSubjects = subjects.filter((s) => {
    const matchDept = departmentFilter === 'All' || s.department === departmentFilter;
    const matchLvl = levelFilter === 'All' || s.level === levelFilter || s.level === 'All';
    return matchDept && matchLvl;
  });

  const handleOpenAdd = () => {
    setEditingSubject(null);
    reset({
      code: '',
      name: '',
      department: 'Sciences',
      level: 'All',
      periodsPerWeek: 4,
      passMark: 50,
      headTeacherId: teachers[0]?.id || '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (subject: Subject) => {
    setEditingSubject(subject);
    reset({
      code: subject.code,
      name: subject.name,
      department: subject.department,
      level: subject.level,
      periodsPerWeek: subject.periodsPerWeek,
      passMark: subject.passMark,
      headTeacherId: subject.headTeacherId || teachers[0]?.id || '',
    });
    setIsModalOpen(true);
  };

  const onSubmit = (data: SubjectFormData) => {
    const teacher = teachers.find((t) => t.id === data.headTeacherId);
    const headTeacherName = teacher ? teacher.name : 'Unassigned';

    if (editingSubject) {
      updateSubject(editingSubject.id, {
        ...data,
        headTeacherName,
      });
      showToast(`Subject ${data.name} updated successfully!`, 'success');
    } else {
      addSubject({
        ...data,
        headTeacherName,
      });
      showToast(`New subject ${data.name} added to curriculum!`, 'success');
    }

    setIsModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (!subjectToDelete) return;
    deleteSubject(subjectToDelete.id);
    showToast(`Subject ${subjectToDelete.name} deleted from curriculum.`, 'info');
    setSubjectToDelete(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Curriculum & Subjects
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage secondary school subject offerings, academic departments, and syllabus coordinators.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#153e31] hover:bg-[#1a4a3b] text-white text-sm font-semibold shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Subject</span>
        </button>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <p className="text-xs font-semibold uppercase text-slate-500">Total Subjects</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{subjects.length}</p>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <p className="text-xs font-semibold uppercase text-slate-500">Sciences</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">
            {subjects.filter((s) => s.department === 'Sciences').length}
          </p>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <p className="text-xs font-semibold uppercase text-slate-500">Arts & Commercial</p>
          <p className="text-2xl font-black text-blue-600 mt-1">
            {subjects.filter((s) => s.department === 'Arts & Humanities' || s.department === 'Commercial').length}
          </p>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <p className="text-xs font-semibold uppercase text-slate-500">Weekly Periods</p>
          <p className="text-2xl font-black text-purple-600 mt-1">
            {subjects.reduce((sum, s) => sum + s.periodsPerWeek, 0)}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
        <span className="text-xs font-semibold text-slate-500">Filter Department:</span>
        <select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          className="px-3 py-1.5 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
        >
          <option value="All">All Departments</option>
          <option value="Sciences">Sciences</option>
          <option value="Arts & Humanities">Arts & Humanities</option>
          <option value="Commercial">Commercial</option>
          <option value="Languages">Languages</option>
          <option value="Vocational">Vocational</option>
        </select>

        <span className="text-xs font-semibold text-slate-500 ml-2">Level:</span>
        <select
          value={levelFilter}
          onChange={(e) => setLevelFilter(e.target.value)}
          className="px-3 py-1.5 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
        >
          <option value="All">All Levels</option>
          <option value="Junior">Junior Secondary</option>
          <option value="Senior">Senior Secondary</option>
        </select>
      </div>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSubjects.map((sub) => (
          <div
            key={sub.id}
            className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-emerald-300 dark:hover:border-emerald-800 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <span className="font-mono font-bold text-xs px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900">
                  {sub.code}
                </span>
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  {sub.level} Level
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                {sub.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Dept: <strong className="text-slate-700 dark:text-slate-300">{sub.department}</strong>
              </p>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex items-center justify-between">
                  <span>Periods / Week:</span>
                  <strong className="text-slate-900 dark:text-white">{sub.periodsPerWeek} Periods</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>Pass Benchmark:</span>
                  <strong className="text-emerald-700 dark:text-emerald-400">{sub.passMark}% Minimum</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>Coordinator:</span>
                  <span className="text-slate-800 dark:text-slate-200 truncate font-medium">
                    {sub.headTeacherName || 'Unassigned'}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => handleOpenEdit(sub)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Edit Subject"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setSubjectToDelete(sub)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                title="Delete Subject"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSubject ? `Edit Subject: ${editingSubject.name}` : 'Add New Subject'}
        maxWidth="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Subject Code"
              required
              {...register('code')}
              error={errors.code?.message}
              placeholder="e.g. MTH-101"
            />
            <FormInput
              label="Subject Name"
              required
              {...register('name')}
              error={errors.name?.message}
              placeholder="e.g. Further Mathematics"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormSelect
              label="Department"
              required
              {...register('department')}
              options={[
                { label: 'Sciences', value: 'Sciences' },
                { label: 'Arts & Humanities', value: 'Arts & Humanities' },
                { label: 'Commercial', value: 'Commercial' },
                { label: 'Languages', value: 'Languages' },
                { label: 'Vocational', value: 'Vocational' },
              ]}
            />
            <FormSelect
              label="Target Level"
              required
              {...register('level')}
              options={[
                { label: 'All Levels (Junior & Senior)', value: 'All' },
                { label: 'Junior Secondary (JSS 1-3)', value: 'Junior' },
                { label: 'Senior Secondary (SS 1-3)', value: 'Senior' },
              ]}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Periods Per Week"
              type="number"
              required
              {...register('periodsPerWeek', { valueAsNumber: true })}
              error={errors.periodsPerWeek?.message}
              min={1}
              max={10}
            />
            <FormInput
              label="Pass Benchmark (%)"
              type="number"
              required
              {...register('passMark', { valueAsNumber: true })}
              error={errors.passMark?.message}
              min={30}
              max={70}
            />
          </div>

          <FormSelect
            label="Head Subject Teacher"
            {...register('headTeacherId')}
            options={teachers.map((t) => ({ label: `${t.name} (${t.department})`, value: t.id }))}
          />

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs transition-colors"
            >
              {editingSubject ? 'Update Subject' : 'Add Subject'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!subjectToDelete}
        title="Remove Subject from Curriculum"
        message={`Are you sure you want to remove "${subjectToDelete?.name}" (${subjectToDelete?.code})? This will affect academic records.`}
        confirmLabel="Delete Subject"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onClose={() => setSubjectToDelete(null)}
      />
    </div>
  );
};

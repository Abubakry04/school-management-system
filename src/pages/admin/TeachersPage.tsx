import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  UserPlus,
  Eye,
  Edit2,
  Trash2,
  BookOpen,
  Briefcase,
  Download,
} from 'lucide-react';
import { DataTable, Column } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { FormInput, FormSelect } from '../../components/ui/FormInputs';
import { Teacher } from '../../types';
import { mockTeachers } from '../../data/mockData';
import { useToast } from '../../context/ToastContext';

const teacherSchema = z.object({
  name: z.string().min(3, 'Full name is required'),
  email: z.string().email('Valid school email is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  department: z.enum(['Sciences', 'Arts & Humanities', 'Commercial', 'Languages', 'Vocational']),
  qualification: z.string().min(3, 'Academic qualification is required'),
  gender: z.enum(['Male', 'Female']),
  status: z.enum(['Active', 'On Leave']),
});

type TeacherFormData = z.infer<typeof teacherSchema>;

export const TeachersPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [teachersList, setTeachersList] = useState<Teacher[]>(mockTeachers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [teacherToDelete, setTeacherToDelete] = useState<Teacher | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TeacherFormData>({
    resolver: zodResolver(teacherSchema),
    defaultValues: {
      department: 'Sciences',
      gender: 'Male',
      status: 'Active',
    },
  });

  const handleOpenAdd = () => {
    setEditingTeacher(null);
    reset({
      name: '',
      email: '',
      phone: '',
      department: 'Sciences',
      qualification: 'B.Sc (Ed), University of Lagos',
      gender: 'Male',
      status: 'Active',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (teacher: Teacher, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingTeacher(teacher);
    reset({
      name: teacher.name,
      email: teacher.email,
      phone: teacher.phone,
      department: teacher.department,
      qualification: teacher.qualification,
      gender: teacher.gender,
      status: teacher.status,
    });
    setIsModalOpen(true);
  };

  const onSubmit = (data: TeacherFormData) => {
    if (editingTeacher) {
      setTeachersList((prev) =>
        prev.map((t) => (t.id === editingTeacher.id ? { ...t, ...data } : t))
      );
      showToast(`Teacher profile for ${data.name} updated successfully!`, 'success');
    } else {
      const newTeacher: Teacher = {
        id: `tch-${Date.now()}`,
        staffId: `FEA/STF/${Math.floor(100 + Math.random() * 900)}`,
        name: data.name,
        email: data.email,
        phone: data.phone,
        gender: data.gender,
        qualification: data.qualification,
        department: data.department,
        subjects: ['General Studies'],
        assignedClasses: ['JSS 1A'],
        avatar:
          data.gender === 'Female'
            ? 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80'
            : 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
        status: data.status,
        dateJoined: '10th Feb, 2026',
      };
      setTeachersList((prev) => [newTeacher, ...prev]);
      showToast(`Faculty member ${newTeacher.name} appointed!`, 'success');
    }

    setIsModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (!teacherToDelete) return;
    setTeachersList((prev) => prev.filter((t) => t.id !== teacherToDelete.id));
    showToast(`Staff record for ${teacherToDelete.name} archived.`, 'info');
    setTeacherToDelete(null);
  };

  const columns: Column<Teacher>[] = [
    {
      key: 'name',
      header: 'Staff Member',
      sortable: true,
      accessor: (teacher) => (
        <div className="flex items-center gap-3">
          <img
            src={teacher.avatar}
            alt={teacher.name}
            className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
          />
          <div>
            <p className="font-semibold text-slate-900 dark:text-white leading-tight">
              {teacher.name}
            </p>
            <p className="text-xs text-slate-400 font-mono mt-0.5">{teacher.staffId}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'department',
      header: 'Department',
      sortable: true,
      accessor: (teacher) => (
        <Badge variant="brand" size="sm">
          {teacher.department}
        </Badge>
      ),
    },
    {
      key: 'subjects',
      header: 'Subjects Taught',
      accessor: (teacher) => (
        <div className="flex flex-wrap gap-1">
          {teacher.subjects.map((sub) => (
            <span
              key={sub}
              className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            >
              {sub}
            </span>
          ))}
        </div>
      ),
    },
    {
      key: 'assignedClasses',
      header: 'Assigned Classes',
      accessor: (teacher) => (
        <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">
          {teacher.assignedClasses.join(', ')}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      accessor: (teacher) => (
        <Badge variant={teacher.status === 'Active' ? 'success' : 'warning'} dot size="sm">
          {teacher.status}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      accessor: (teacher) => (
        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => navigate(`/admin/teachers/${teacher.id}`)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-950/60 transition-colors"
            title="View Profile"
            aria-label="View Profile"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => handleOpenEdit(teacher, e)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/60 transition-colors"
            title="Edit Teacher"
            aria-label="Edit Teacher"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setTeacherToDelete(teacher);
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60 transition-colors"
            title="Delete Staff"
            aria-label="Delete Staff"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Academic Faculty & Staff
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Faculty credentials, department allocations, and teaching appointments.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => showToast('Staff directory exported to Excel', 'info')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Faculty</span>
          </button>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-brand-700 hover:bg-brand-800 text-white shadow-xs transition-colors"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Appoint Faculty</span>
          </button>
        </div>
      </div>

      {/* Main DataTable */}
      <DataTable
        data={teachersList}
        columns={columns}
        rowKey={(t) => t.id}
        searchPlaceholder="Search by staff name, subject or staff ID..."
        searchKeys={['name', 'staffId', 'department', 'email']}
        filters={[
          {
            key: 'department',
            label: 'Departments',
            options: [
              { label: 'Sciences', value: 'Sciences' },
              { label: 'Languages', value: 'Languages' },
              { label: 'Commercial', value: 'Commercial' },
              { label: 'Arts & Humanities', value: 'Arts & Humanities' },
            ],
          },
          {
            key: 'status',
            label: 'Status',
            options: [
              { label: 'Active', value: 'Active' },
              { label: 'On Leave', value: 'On Leave' },
            ],
          },
        ]}
        onRowClick={(teacher) => navigate(`/admin/teachers/${teacher.id}`)}
      />

      {/* Add / Edit Teacher Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTeacher ? `Edit Teacher: ${editingTeacher.name}` : 'Appoint New Teacher'}
        description="Provide academic credentials, contact info, and department allocation."
        maxWidth="2xl"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Full Name"
              required
              {...register('name')}
              error={errors.name?.message}
              placeholder="e.g. Mr. Chukwuma Okafor"
            />
            <FormInput
              label="Official Email"
              required
              type="email"
              {...register('email')}
              error={errors.email?.message}
              placeholder="c.okafor@federalexcellence.edu.ng"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Phone Number"
              required
              {...register('phone')}
              error={errors.phone?.message}
              placeholder="+234 803 778 9922"
            />
            <FormInput
              label="Qualifications"
              required
              {...register('qualification')}
              error={errors.qualification?.message}
              placeholder="B.Sc (Ed) Physics, UNN"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormSelect
              label="Department"
              required
              {...register('department')}
              options={[
                { label: 'Sciences', value: 'Sciences' },
                { label: 'Languages', value: 'Languages' },
                { label: 'Commercial', value: 'Commercial' },
                { label: 'Arts & Humanities', value: 'Arts & Humanities' },
                { label: 'Vocational', value: 'Vocational' },
              ]}
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
            <FormSelect
              label="Status"
              required
              {...register('status')}
              options={[
                { label: 'Active', value: 'Active' },
                { label: 'On Leave', value: 'On Leave' },
              ]}
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-md shadow-brand-600/20 transition-all"
            >
              {editingTeacher ? 'Update Profile' : 'Confirm Appointment'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(teacherToDelete)}
        onClose={() => setTeacherToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Archive Staff Record"
        message={`Are you sure you want to archive staff record for ${teacherToDelete?.name} (${teacherToDelete?.staffId})?`}
        confirmLabel="Archive Staff"
      />
    </div>
  );
};

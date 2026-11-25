import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  UserPlus,
  Eye,
  Edit2,
  Trash2,
  GraduationCap,
  Download,
  CheckCircle,
  Camera,
  Upload,
} from 'lucide-react';
import { DataTable, Column } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { FormInput, FormSelect } from '../../components/ui/FormInputs';
import { Student } from '../../types';
import { useToast } from '../../context/ToastContext';
import { useData } from '../../context/DataContext';

const studentSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  gender: z.enum(['Male', 'Female']),
  classId: z.string().min(1, 'Please select a class'),
  guardianName: z.string().min(3, 'Guardian name is required'),
  guardianPhone: z.string().min(10, 'Guardian phone number is required'),
  guardianEmail: z.string().email('Valid email is required'),
  stateOfOrigin: z.string().min(2, 'State of origin is required'),
  status: z.enum(['Active', 'Suspended', 'Transferred']),
});

type StudentFormData = z.infer<typeof studentSchema>;

export const StudentsPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { students: studentsList, classes: mockClasses, addStudent, updateStudent, deleteStudent } = useData();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const [passportPreview, setPassportPreview] = useState<string>('');
  const modalFileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      gender: 'Male',
      status: 'Active',
      stateOfOrigin: 'Lagos State',
    },
  });

  const handleModalPassportUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (JPG, PNG, WebP)', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('Image size exceeds 5MB limit', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        setPassportPreview(base64);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleOpenAdd = () => {
    setEditingStudent(null);
    setPassportPreview('');
    reset({
      firstName: '',
      lastName: '',
      gender: 'Male',
      classId: mockClasses[0]?.id || '',
      guardianName: '',
      guardianPhone: '',
      guardianEmail: '',
      stateOfOrigin: 'Lagos State',
      status: 'Active',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (student: Student, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingStudent(student);
    setPassportPreview(student.avatar || '');
    reset({
      firstName: student.firstName,
      lastName: student.lastName,
      gender: student.gender,
      classId: student.classId,
      guardianName: student.guardianName,
      guardianPhone: student.guardianPhone,
      guardianEmail: student.guardianEmail,
      stateOfOrigin: student.stateOfOrigin,
      status: student.status,
    });
    setIsModalOpen(true);
  };

  const onSubmit = (data: StudentFormData) => {
    const selectedClass = mockClasses.find((c) => c.id === data.classId);
    const className = selectedClass ? selectedClass.name : 'JSS 1A';

    if (editingStudent) {
      updateStudent(editingStudent.id, {
        ...data,
        className,
        ...(passportPreview ? { avatar: passportPreview } : {}),
      });
      showToast(`Student record for ${data.firstName} ${data.lastName} updated!`, 'success');
    } else {
      const created = addStudent({
        ...data,
        className,
        avatar: passportPreview || `https://images.unsplash.com/photo-1544717305-2782549b5136?w=150`,
      });
      showToast(`New student ${created.fullName} registered successfully!`, 'success');
    }

    setIsModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (!studentToDelete) return;
    deleteStudent(studentToDelete.id);
    showToast(`Student ${studentToDelete.fullName} removed from records.`, 'info');
    setStudentToDelete(null);
  };

  const columns: Column<Student>[] = [
    {
      key: 'fullName',
      header: 'Student',
      sortable: true,
      accessor: (student) => (
        <div className="flex items-center gap-3">
          <img
            src={student.avatar}
            alt={student.fullName}
            className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
          />
          <div>
            <p className="font-semibold text-slate-900 dark:text-white leading-tight">
              {student.fullName}
            </p>
            <p className="text-xs text-slate-400 font-mono mt-0.5">{student.admissionNo}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'className',
      header: 'Class',
      sortable: true,
      accessor: (student) => (
        <span className="font-medium text-slate-700 dark:text-slate-300">
          {student.className}
        </span>
      ),
    },
    {
      key: 'gender',
      header: 'Gender',
      accessor: (student) => (
        <span className="text-xs text-slate-500 dark:text-slate-400">{student.gender}</span>
      ),
    },
    {
      key: 'guardianName',
      header: 'Guardian Contact',
      accessor: (student) => (
        <div>
          <p className="text-xs font-medium text-slate-800 dark:text-slate-200">{student.guardianName}</p>
          <p className="text-[11px] text-slate-400">{student.guardianPhone}</p>
        </div>
      ),
    },
    {
      key: 'feeBalance',
      header: 'Fee Status',
      sortable: true,
      accessor: (student) => (
        student.feeBalance === 0 ? (
          <Badge variant="success" size="sm">Cleared</Badge>
        ) : (
          <Badge variant="danger" size="sm">₦{student.feeBalance.toLocaleString()} Due</Badge>
        )
      ),
    },
    {
      key: 'status',
      header: 'Status',
      accessor: (student) => (
        <Badge
          variant={
            student.status === 'Active'
              ? 'success'
              : student.status === 'Suspended'
              ? 'danger'
              : 'neutral'
          }
          dot
          size="sm"
        >
          {student.status}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      accessor: (student) => (
        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => navigate(`/admin/students/${student.id}`)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-950/60 transition-colors"
            title="View Full Profile"
            aria-label="View Full Profile"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => handleOpenEdit(student, e)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/60 transition-colors"
            title="Edit Student"
            aria-label="Edit Student"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setStudentToDelete(student);
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60 transition-colors"
            title="Delete Student"
            aria-label="Delete Student"
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
            Student Information Directory
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Academic records, class arm rosters, and guardian emergency contact registry.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => showToast('Student register exported to CSV', 'info')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Roster</span>
          </button>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-brand-700 hover:bg-brand-800 text-white shadow-xs transition-colors"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Enroll New Student</span>
          </button>
        </div>
      </div>

      {/* Main DataTable */}
      <DataTable
        data={studentsList}
        columns={columns}
        rowKey={(s) => s.id}
        searchPlaceholder="Search by name, admission no, or guardian..."
        searchKeys={['fullName', 'admissionNo', 'guardianName', 'className']}
        filters={[
          {
            key: 'className',
            label: 'Classes',
            options: mockClasses.map((c) => ({ label: c.name, value: c.name })),
          },
          {
            key: 'status',
            label: 'Status',
            options: [
              { label: 'Active', value: 'Active' },
              { label: 'Suspended', value: 'Suspended' },
            ],
          },
        ]}
        onRowClick={(student) => navigate(`/admin/students/${student.id}`)}
      />

      {/* Add / Edit Student Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingStudent ? `Edit Student: ${editingStudent.fullName}` : 'Enroll New Student'}
        description="Fill in all the required academic and guardian biodata."
        maxWidth="2xl"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Passport Photograph Upload */}
          <div className="flex items-center gap-4 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
            <input
              type="file"
              ref={modalFileInputRef}
              onChange={handleModalPassportUpload}
              accept="image/*"
              className="hidden"
            />
            <div className="relative group shrink-0">
              {passportPreview ? (
                <img
                  src={passportPreview}
                  alt="Student Passport Preview"
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-brand-500/30 shadow-xs"
                />
              ) : (
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex flex-col items-center justify-center border-2 border-dashed border-brand-200 dark:border-brand-800/60">
                  <Camera className="w-6 h-6 mb-0.5" />
                  <span className="text-[10px] font-semibold">Passport</span>
                </div>
              )}
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold text-slate-900 dark:text-white">
                Student Passport Photograph
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Upload official portrait (JPG, PNG or WebP, max 5MB). Will appear on ID cards and official term reports.
              </p>
              <div className="flex items-center gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => modalFileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{passportPreview ? 'Change Photo' : 'Select Photo'}</span>
                </button>
                {passportPreview && (
                  <button
                    type="button"
                    onClick={() => setPassportPreview('')}
                    className="text-[11px] text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="First Name"
              required
              {...register('firstName')}
              error={errors.firstName?.message}
              placeholder="e.g. Babatunde"
            />
            <FormInput
              label="Last Name"
              required
              {...register('lastName')}
              error={errors.lastName?.message}
              placeholder="e.g. Adeyemi"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
              label="Class Assigned"
              required
              {...register('classId')}
              options={mockClasses.map((c) => ({ label: c.name, value: c.id }))}
            />
            <FormSelect
              label="Enrollment Status"
              required
              {...register('status')}
              options={[
                { label: 'Active', value: 'Active' },
                { label: 'Suspended', value: 'Suspended' },
                { label: 'Transferred', value: 'Transferred' },
              ]}
            />
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
              Guardian Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput
                label="Guardian Full Name"
                required
                {...register('guardianName')}
                error={errors.guardianName?.message}
                placeholder="Chief Babatunde Adeyemi"
              />
              <FormInput
                label="Guardian Phone Number"
                required
                {...register('guardianPhone')}
                error={errors.guardianPhone?.message}
                placeholder="+234 802 998 8776"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <FormInput
                label="Guardian Email"
                required
                type="email"
                {...register('guardianEmail')}
                error={errors.guardianEmail?.message}
                placeholder="parent@gmail.com"
              />
              <FormInput
                label="State of Origin"
                required
                {...register('stateOfOrigin')}
                error={errors.stateOfOrigin?.message}
                placeholder="e.g. Ogun State"
              />
            </div>
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
              {editingStudent ? 'Save Changes' : 'Complete Enrollment'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(studentToDelete)}
        onClose={() => setStudentToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Confirm Student Deletion"
        message={`Are you sure you want to remove ${studentToDelete?.fullName} (${studentToDelete?.admissionNo}) from the active student register? This action cannot be reversed.`}
        confirmLabel="Remove Student"
      />
    </div>
  );
};

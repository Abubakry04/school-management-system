import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Users,
  DoorOpen,
  CheckCircle2,
  Edit,
  GraduationCap,
} from 'lucide-react';
import { mockClasses, mockTeachers } from '../../data/mockData';
import { SchoolClass } from '../../types';
import { Modal } from '../../components/ui/Modal';
import { FormInput, FormSelect } from '../../components/ui/FormInputs';
import { Badge } from '../../components/ui/Badge';
import { useToast } from '../../context/ToastContext';

export const ClassesPage: React.FC = () => {
  const { showToast } = useToast();
  const [classesList, setClassesList] = useState<SchoolClass[]>(mockClasses);
  const [selectedClass, setSelectedClass] = useState<SchoolClass | null>(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedTeacherId, setSelectedTeacherId] = useState('');

  const handleOpenAssign = (cls: SchoolClass) => {
    setSelectedClass(cls);
    setSelectedTeacherId(cls.classTeacherId);
    setIsAssignModalOpen(true);
  };

  const handleSaveTeacher = () => {
    if (!selectedClass) return;
    const teacher = mockTeachers.find((t) => t.id === selectedTeacherId);
    const teacherName = teacher ? teacher.name : selectedClass.classTeacherName;

    setClassesList((prev) =>
      prev.map((c) =>
        c.id === selectedClass.id
          ? { ...c, classTeacherId: selectedTeacherId, classTeacherName: teacherName }
          : c
      )
    );
    showToast(`Form Teacher for ${selectedClass.name} updated to ${teacherName}`, 'success');
    setIsAssignModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Classes & Subject Allocations
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage junior & senior secondary classes, form teachers, and enrolled student limits.
          </p>
        </div>

        <button
          onClick={() => showToast('Class arms setup locked by Academic Council', 'info')}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-600/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Class Arm</span>
        </button>
      </div>

      {/* Class Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classesList.map((cls) => {
          const occupancy = Math.round((cls.studentCount / cls.capacity) * 100);

          return (
            <div
              key={cls.id}
              className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="p-2 rounded-xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400">
                      <GraduationCap className="w-5 h-5" />
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {cls.name}
                    </h3>
                  </div>
                  <Badge variant={cls.level === 'Senior' ? 'brand' : 'neutral'} size="sm">
                    {cls.level} Sec.
                  </Badge>
                </div>

                {/* Form Teacher row */}
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                      Form Teacher
                    </p>
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                      {cls.classTeacherName}
                    </p>
                  </div>
                  <button
                    onClick={() => handleOpenAssign(cls)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    title="Change Teacher"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Capacity Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5">
                    <span>Enrolled Students</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                      {cls.studentCount} / {cls.capacity} ({occupancy}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        occupancy >= 95 ? 'bg-amber-500' : 'bg-brand-600'
                      }`}
                      style={{ width: `${occupancy}%` }}
                    />
                  </div>
                </div>

                {/* Class details */}
                <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <DoorOpen className="w-4 h-4 text-slate-400" />
                    <span>Assigned Room: <strong className="text-slate-700 dark:text-slate-300">{cls.room}</strong></span>
                  </div>
                </div>

                {/* Subjects list */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Curriculum Subjects ({cls.subjects.length})
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {cls.subjects.map((s) => (
                      <span
                        key={s}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Assign Teacher Modal */}
      <Modal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        title={`Assign Form Teacher: ${selectedClass?.name}`}
        description="Select a qualified faculty member to oversee administrative duties for this class."
        maxWidth="md"
        footer={
          <div className="flex items-center justify-end gap-3 w-full">
            <button
              onClick={() => setIsAssignModalOpen(false)}
              className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveTeacher}
              className="px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-md transition-colors"
            >
              Confirm Assignment
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <FormSelect
            label="Select Teacher"
            value={selectedTeacherId}
            onChange={(e) => setSelectedTeacherId(e.target.value)}
            options={mockTeachers.map((t) => ({
              label: `${t.name} (${t.department})`,
              value: t.id,
            }))}
          />
        </div>
      </Modal>
    </div>
  );
};

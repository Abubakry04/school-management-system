import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Users,
  DoorOpen,
  CheckCircle2,
  Edit,
  GraduationCap,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { SchoolClass } from '../../types';
import { Modal } from '../../components/ui/Modal';
import { FormInput, FormSelect } from '../../components/ui/FormInputs';
import { Badge } from '../../components/ui/Badge';
import { useToast } from '../../context/ToastContext';
import { useData } from '../../context/DataContext';

export const ClassesPage: React.FC = () => {
  const { showToast } = useToast();
  const { classes: classesList, teachers: mockTeachers, students, updateClass, promoteStudents } = useData();
  const [selectedClass, setSelectedClass] = useState<SchoolClass | null>(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedTeacherId, setSelectedTeacherId] = useState('');

  // Promotion Modal State
  const [isPromoteModalOpen, setIsPromoteModalOpen] = useState(false);
  const [fromClassId, setFromClassId] = useState(classesList[0]?.id || '');
  const [toClassId, setToClassId] = useState(classesList[1]?.id || '');

  const fromClass = classesList.find((c) => c.id === fromClassId);
  const toClass = classesList.find((c) => c.id === toClassId);
  const eligibleStudentsCount = students.filter(
    (s) => s.classId === fromClassId && s.status === 'Active'
  ).length;

  const handleOpenAssign = (cls: SchoolClass) => {
    setSelectedClass(cls);
    setSelectedTeacherId(cls.classTeacherId);
    setIsAssignModalOpen(true);
  };

  const handleSaveTeacher = () => {
    if (!selectedClass) return;
    const teacher = mockTeachers.find((t) => t.id === selectedTeacherId);
    const teacherName = teacher ? teacher.name : selectedClass.classTeacherName;

    updateClass(selectedClass.id, {
      classTeacherId: selectedTeacherId,
      classTeacherName: teacherName,
    });
    showToast(`Form Teacher for ${selectedClass.name} updated to ${teacherName}`, 'success');
    setIsAssignModalOpen(false);
  };

  const handlePromoteStudents = () => {
    if (!fromClassId || !toClassId) {
      showToast('Please select both source and target classes', 'error');
      return;
    }
    if (fromClassId === toClassId) {
      showToast('Source and destination classes cannot be identical', 'error');
      return;
    }

    const count = promoteStudents(fromClassId, toClassId);
    if (count === 0) {
      showToast(`No active students found in ${fromClass?.name || 'source class'} to promote`, 'info');
    } else {
      showToast(`Successfully promoted ${count} student${count > 1 ? 's' : ''} to ${toClass?.name}!`, 'success');
    }
    setIsPromoteModalOpen(false);
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

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPromoteModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/60 shadow-sm transition-all"
          >
            <TrendingUp className="w-4 h-4 text-brand-600" />
            <span>Academic Promotion</span>
          </button>
          <button
            onClick={() => showToast('Class arms setup locked by Academic Council', 'info')}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-600/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Class Arm</span>
          </button>
        </div>
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
      {/* Promotion Modal */}
      <Modal
        isOpen={isPromoteModalOpen}
        onClose={() => setIsPromoteModalOpen(false)}
        title="Student Promotion & Session Rollover"
        description="Advance active students from their current class arm to the next academic grade level."
        maxWidth="lg"
        footer={
          <div className="flex items-center justify-end gap-3 w-full">
            <button
              onClick={() => setIsPromoteModalOpen(false)}
              className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
            >
              Cancel
            </button>
            <button
              onClick={handlePromoteStudents}
              className="px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-md transition-colors"
            >
              Execute Promotion
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-brand-50 dark:bg-brand-950/40 border border-brand-100 dark:border-brand-900/40 text-xs text-brand-900 dark:text-brand-300">
            <p className="font-semibold mb-1">Session Advancement Note</p>
            <p className="opacity-90">
              Promoting advances all active students in the selected source class. Their profile class name, class ID, and class capacity metrics will be updated immediately in the school registry.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <FormSelect
                label="Source Class (From)"
                value={fromClassId}
                onChange={(e) => setFromClassId(e.target.value)}
                options={classesList.map((c) => ({
                  label: `${c.name} (${students.filter((s) => s.classId === c.id && s.status === 'Active').length} active students)`,
                  value: c.id,
                }))}
              />
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
                Eligible students ready for advancement: <strong className="text-brand-600 font-semibold">{eligibleStudentsCount}</strong>
              </p>
            </div>

            <div>
              <FormSelect
                label="Destination Class (To)"
                value={toClassId}
                onChange={(e) => setToClassId(e.target.value)}
                options={classesList.map((c) => ({
                  label: `${c.name} (Max cap: ${c.capacity})`,
                  value: c.id,
                }))}
              />
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
                Target class arm: <strong className="text-slate-700 dark:text-slate-300">{toClass?.name || 'None selected'}</strong>
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

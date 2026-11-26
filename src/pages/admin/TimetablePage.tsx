import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Calendar,
  Clock,
  Printer,
  Download,
  Filter,
  Plus,
  Trash2,
  AlertTriangle,
  Building,
  GraduationCap,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { TimetableSlot } from '../../types';
import { Modal } from '../../components/ui/Modal';
import { FormInput, FormSelect } from '../../components/ui/FormInputs';
import { exportToCSV } from '../../utils/exportUtils';

export const TimetablePage: React.FC = () => {
  const { showToast } = useToast();
  const { timetable, classes, teachers, subjects, addTimetableSlot, deleteTimetableSlot } = useData();

  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || 'cls-01');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [conflictError, setConflictError] = useState<string | null>(null);

  const [slotForm, setSlotForm] = useState({
    day: 'Monday' as TimetableSlot['day'],
    period: 1,
    time: '08:00 - 08:45',
    subject: subjects[0]?.name || 'General Mathematics',
    teacherId: teachers[0]?.id || '',
    room: 'Room 101',
  });

  const selectedClass = classes.find((c) => c.id === selectedClassId) || classes[0] || {
    id: 'cls-01',
    name: 'JSS 1A',
    level: 'Junior' as const,
    classTeacherId: '',
    classTeacherName: 'Unassigned',
    studentCount: 0,
    capacity: 35,
    room: 'Room 101',
    subjects: [],
  };

  const days: TimetableSlot['day'][] = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
  ];

  const periods = [
    { period: 1, time: '08:00 - 08:45' },
    { period: 2, time: '08:45 - 09:30' },
    { period: 3, time: '09:45 - 10:30' },
    { period: 4, time: '10:30 - 11:15' },
    { period: 5, time: '11:45 - 12:30' },
  ];

  const classSlots = timetable.filter((slot) => slot.classId === selectedClassId);

  const handleOpenAddSlot = (day?: TimetableSlot['day'], period?: number) => {
    const selectedPeriodObj = periods.find((p) => p.period === period) || periods[0];
    setConflictError(null);
    setSlotForm({
      day: day || 'Monday',
      period: period || 1,
      time: selectedPeriodObj.time,
      subject: subjects[0]?.name || 'General Mathematics',
      teacherId: teachers[0]?.id || '',
      room: selectedClass.room || 'Room 101',
    });
    setIsAddModalOpen(true);
  };

  const handlePeriodSelect = (periodNum: number) => {
    const pObj = periods.find((p) => p.period === periodNum);
    setSlotForm((prev) => ({
      ...prev,
      period: periodNum,
      time: pObj ? pObj.time : prev.time,
    }));
  };

  const handleAddSlotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setConflictError(null);

    const assignedTeacher = teachers.find((t) => t.id === slotForm.teacherId);
    const teacherName = assignedTeacher ? assignedTeacher.name : 'Faculty Staff';

    const result = addTimetableSlot({
      day: slotForm.day,
      period: Number(slotForm.period),
      time: slotForm.time,
      subject: slotForm.subject,
      teacherId: slotForm.teacherId,
      teacherName,
      classId: selectedClass.id,
      className: selectedClass.name,
      room: slotForm.room,
    });

    if (!result.success) {
      setConflictError(result.conflictMessage || 'Timetable clash detected');
      return;
    }

    showToast(`Scheduled ${slotForm.subject} on ${slotForm.day} Period ${slotForm.period}!`, 'success');
    setIsAddModalOpen(false);
  };

  const handleExportCSV = () => {
    if (classSlots.length === 0) {
      showToast('No timetable entries scheduled to export for this class', 'info');
      return;
    }
    exportToCSV(`timetable_${selectedClass.name}`, classSlots, {
      day: 'Day',
      period: 'Period',
      time: 'Time',
      subject: 'Subject',
      teacherName: 'Teacher',
      room: 'Room',
      className: 'Class',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Class Timetable & Period Scheduler
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Weekly class schedules with automated teacher assignment and room conflict validation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleOpenAddSlot()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-[#153e31] hover:bg-[#1a4a3b] text-white shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Schedule Period</span>
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors no-print"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>
          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors no-print"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Class Selector Bar */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap gap-4 items-center justify-between no-print">
        <div className="flex items-center gap-3">
          <Filter className="w-4 h-4 text-emerald-700" />
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Classroom Arm:
          </label>
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600"
          >
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.level} Secondary)
              </option>
            ))}
          </select>
        </div>

        <div className="text-xs text-slate-500">
          Form Teacher: <strong className="text-slate-700 dark:text-slate-200">{selectedClass.classTeacherName || 'Unassigned'}</strong>
        </div>
      </div>

      {/* Timetable Weekly Grid */}
      <div className="p-3.5 sm:p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                <th className="p-3 text-left font-bold text-slate-700 dark:text-slate-300 w-32 sticky left-0 z-10 bg-slate-100 dark:bg-slate-800">
                  Period / Time
                </th>
                {days.map((day) => (
                  <th key={day} className="p-3 text-center font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:border-slate-800">
              {periods.map((p) => (
                <tr key={p.period} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="p-3 font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 sticky left-0 z-10">
                    <div className="font-bold text-slate-900 dark:text-white">Period {p.period}</div>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5">{p.time}</div>
                  </td>

                  {days.map((day) => {
                    const slot = classSlots.find((s) => s.day === day && s.period === p.period);

                    return (
                      <td key={day} className="p-2 sm:p-2.5 text-center align-top">
                        {slot ? (
                          <div className="p-2.5 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 text-left relative group">
                            <button
                              type="button"
                              onClick={() => deleteTimetableSlot(slot.id)}
                              className="absolute top-1.5 right-1.5 p-1 rounded-md text-slate-400 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Delete period"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                            <p className="font-bold text-emerald-950 dark:text-emerald-100 text-xs pr-4">
                              {slot.subject}
                            </p>
                            <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                              {slot.teacherName}
                            </p>
                            <div className="mt-1 flex items-center justify-between text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">
                              <span>{slot.room}</span>
                            </div>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleOpenAddSlot(day, p.period)}
                            className="w-full h-16 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-slate-400 hover:text-emerald-700 hover:border-emerald-500/60 hover:bg-emerald-50/20 text-[11px] flex items-center justify-center gap-1 transition-all"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Assign</span>
                          </button>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Period Modal with Clash Warning */}
      {isAddModalOpen && (
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title={`Assign Schedule Slot: ${selectedClass.name}`}
          maxWidth="lg"
        >
          <form onSubmit={handleAddSlotSubmit} className="space-y-4 py-2">
            {conflictError && (
              <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 flex items-start gap-3 text-rose-800 dark:text-rose-300 text-xs animate-in shake duration-200">
                <AlertTriangle className="w-5 h-5 shrink-0 text-rose-600" />
                <div>
                  <p className="font-bold">Schedule Clash Detected!</p>
                  <p className="mt-0.5 leading-snug">{conflictError}</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormSelect
                label="Day of Week"
                value={slotForm.day}
                onChange={(e) => setSlotForm({ ...slotForm, day: e.target.value as TimetableSlot['day'] })}
                options={days.map((d) => ({ label: d, value: d }))}
              />
              <FormSelect
                label="Period & Time Interval"
                value={String(slotForm.period)}
                onChange={(e) => handlePeriodSelect(Number(e.target.value))}
                options={periods.map((p) => ({ label: `Period ${p.period} (${p.time})`, value: String(p.period) }))}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormSelect
                label="Subject"
                value={slotForm.subject}
                onChange={(e) => setSlotForm({ ...slotForm, subject: e.target.value })}
                options={subjects.map((s) => ({ label: `${s.name} (${s.code})`, value: s.name }))}
              />
              <FormSelect
                label="Assigned Teacher"
                value={slotForm.teacherId}
                onChange={(e) => setSlotForm({ ...slotForm, teacherId: e.target.value })}
                options={teachers.length > 0
                  ? teachers.map((t) => ({ label: `${t.name} (${t.department})`, value: t.id }))
                  : [{ label: 'No staff available (Create teacher first)', value: '' }]
                }
              />
            </div>

            <FormInput
              label="Allocated Room / Laboratory"
              value={slotForm.room}
              onChange={(e) => setSlotForm({ ...slotForm, room: e.target.value })}
              placeholder="e.g. Science Lab 2"
            />

            <div className="flex justify-end gap-2 pt-3">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white"
              >
                Schedule & Validate Period
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

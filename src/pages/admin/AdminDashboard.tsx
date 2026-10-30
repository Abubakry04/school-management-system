import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  GraduationCap,
  BarChart2,
  ClipboardList,
  Clock,
  MoreHorizontal,
  Plus,
  Check,
  ChevronRight,
  Calendar,
  X,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';
import { StatCard } from '../../components/ui/StatCard';
import { useToast } from '../../context/ToastContext';

interface ScheduleItem {
  id: string;
  time: string;
  period: string;
  title: string;
  location: string;
  duration: string;
  dotColor: string;
}

interface TaskItem {
  id: string;
  title: string;
  category: string;
  due: string;
  dueBadgeColor: string;
  completed: boolean;
}

interface AttendanceDay {
  day: string;
  date: string;
  rate: number;
}

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Add Student Modal State
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [studentForm, setStudentForm] = useState({
    firstName: '',
    lastName: '',
    classGrade: 'SS 2 Science',
    gender: 'Female',
    guardianName: '',
    guardianEmail: '',
    guardianPhone: '',
  });

  // Schedule data matching Figma
  const [scheduleItems] = useState<ScheduleItem[]>([
    {
      id: 'sch-1',
      time: '09:00',
      period: 'AM',
      title: 'Leadership stand-up',
      location: 'Science Lab 2',
      duration: '60 min',
      dotColor: 'border-emerald-500 bg-emerald-50 text-emerald-600 ring-emerald-100',
    },
    {
      id: 'sch-2',
      time: '10:30',
      period: 'AM',
      title: 'Admissions review',
      location: 'Room 214',
      duration: '60 min',
      dotColor: 'border-blue-500 bg-blue-50 text-blue-600 ring-blue-100',
    },
    {
      id: 'sch-3',
      time: '13:00',
      period: 'PM',
      title: 'Staff workshop',
      location: 'Room 108',
      duration: '60 min',
      dotColor: 'border-amber-500 bg-amber-50 text-amber-600 ring-amber-100',
    },
    {
      id: 'sch-4',
      time: '14:30',
      period: 'PM',
      title: 'Basketball finals',
      location: 'Sports Hall',
      duration: '60 min',
      dotColor: 'border-purple-500 bg-purple-50 text-purple-600 ring-purple-100',
    },
  ]);

  // Tasks data matching Figma
  const [tasks, setTasks] = useState<TaskItem[]>([
    {
      id: 'task-1',
      title: 'Review new student applications',
      category: 'Admissions',
      due: 'Today',
      dueBadgeColor: 'bg-rose-100/70 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300',
      completed: false,
    },
    {
      id: 'task-2',
      title: 'Approve science lab budget',
      category: 'Finance',
      due: 'Tomorrow',
      dueBadgeColor: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
      completed: false,
    },
    {
      id: 'task-3',
      title: 'Staff meeting agenda',
      category: 'Operations',
      due: 'Fri, 14 Jun',
      dueBadgeColor: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
      completed: false,
    },
  ]);

  // Inline add task state
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState('Academics');

  // Attendance data matching Figma capsule chart
  const attendanceDays: AttendanceDay[] = [
    { day: 'M', date: 'Mon, 3 Jun', rate: 70 },
    { day: 'T', date: 'Tue, 4 Jun', rate: 86 },
    { day: 'W', date: 'Wed, 5 Jun', rate: 74 },
    { day: 'T', date: 'Thu, 6 Jun', rate: 96 },
    { day: 'F', date: 'Fri, 7 Jun', rate: 89 },
    { day: 'M', date: 'Mon, 10 Jun', rate: 94 },
    { day: 'T', date: 'Tue, 11 Jun', rate: 93 },
  ];

  // Active hover tooltip for capsule chart
  const [activeHoverDay, setActiveHoverDay] = useState<AttendanceDay | null>(null);

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    const newTask: TaskItem = {
      id: `task-${Date.now()}`,
      title: newTaskTitle.trim(),
      category: newTaskCategory,
      due: 'This week',
      dueBadgeColor: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300',
      completed: false,
    };
    setTasks((prev) => [newTask, ...prev]);
    setNewTaskTitle('');
    setIsAddingTask(false);
    showToast('Task added to schedule', 'success');
  };

  const handleAddStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentForm.firstName || !studentForm.lastName) {
      showToast('Please enter student first and last name', 'error');
      return;
    }
    showToast(
      `Successfully enrolled ${studentForm.firstName} ${studentForm.lastName} into ${studentForm.classGrade}!`,
      'success'
    );
    setIsAddStudentOpen(false);
    setStudentForm({
      firstName: '',
      lastName: '',
      classGrade: 'SS 2 Science',
      gender: 'Female',
      guardianName: '',
      guardianEmail: '',
      guardianPhone: '',
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Page Header matching Figma */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#153e31] dark:text-emerald-400 block mb-1">
            School Overview
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            Good morning, Dr. Funmilayo
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Here’s what’s happening at Federal Excellence Academy today.
          </p>
        </div>

        {/* Action Button: + Add new student */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddStudentOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#153e31] hover:bg-[#103227] text-white font-medium text-sm shadow-xs transition-colors active:scale-98"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add new student</span>
          </button>
        </div>
      </div>

      {/* 4 Primary Metric Cards matching Figma */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total students"
          value="1,248"
          trend={{ value: '+4.6% this year', positive: true }}
          icon={Users}
          iconBg="bg-[#e6f4ea] dark:bg-emerald-950/60"
          iconColor="text-[#166534] dark:text-emerald-400"
          onClick={() => navigate('/admin/students')}
        />

        <StatCard
          title="Teaching staff"
          value="86"
          subtitle="4 currently away"
          icon={GraduationCap}
          iconBg="bg-[#e8f0fe] dark:bg-blue-950/60"
          iconColor="text-[#2563eb] dark:text-blue-400"
          onClick={() => navigate('/admin/teachers')}
        />

        <StatCard
          title="Attendance rate"
          value="94.2%"
          trend={{ value: '+1.8% this month', positive: true }}
          icon={BarChart2}
          iconBg="bg-[#fef0e6] dark:bg-amber-950/60"
          iconColor="text-[#ea580c] dark:text-amber-400"
          onClick={() => navigate('/admin/attendance')}
        />

        <StatCard
          title="Open requests"
          value="12"
          subtitle="3 need attention"
          icon={ClipboardList}
          iconBg="bg-[#f3e8fd] dark:bg-purple-950/60"
          iconColor="text-[#9333ea] dark:text-purple-400"
          onClick={() => navigate('/admin/announcements')}
        />
      </div>

      {/* Middle Section: Today's schedule & Upcoming tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Card: Today's Schedule (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl border border-[#e8ede9] dark:border-slate-800 p-6 sm:p-7 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Today’s schedule
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Wednesday, 12 June
                </p>
              </div>
              <button
                onClick={() => navigate('/admin/timetable')}
                className="text-xs font-semibold text-slate-800 hover:text-emerald-800 dark:text-slate-300 dark:hover:text-white flex items-center gap-1 transition-colors"
              >
                <span>View calendar</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Vertical Timeline */}
            <div className="space-y-6 relative pl-2">
              {scheduleItems.map((item, idx) => {
                const isLast = idx === scheduleItems.length - 1;
                return (
                  <div key={item.id} className="relative flex items-start gap-4">
                    {/* Time Column */}
                    <div className="w-14 shrink-0 text-left">
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">
                        {item.time}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium block">
                        {item.period}
                      </span>
                    </div>

                    {/* Timeline Node & Connecting Line */}
                    <div className="relative flex flex-col items-center">
                      <div
                        className={`w-3 h-3 rounded-full border-2 ${item.dotColor} ring-4 z-10`}
                      />
                      {!isLast && (
                        <div className="w-0.5 bg-slate-200 dark:bg-slate-800 absolute top-3 bottom-[-24px]" />
                      )}
                    </div>

                    {/* Content Column */}
                    <div className="flex-1 min-w-0 pb-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-semibold text-slate-900 dark:text-white leading-tight">
                            {item.title}
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span>
                              {item.location} · {item.duration}
                            </span>
                          </p>
                        </div>
                        <button
                          onClick={() =>
                            showToast(`${item.title} scheduled in ${item.location}`, 'info')
                          }
                          className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
                          aria-label="Options"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Card: Upcoming tasks (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl border border-[#e8ede9] dark:border-slate-800 p-6 sm:p-7 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Upcoming tasks
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {tasks.filter((t) => !t.completed).length} items this week
                </p>
              </div>
              <button
                onClick={() => navigate('/admin/announcements')}
                className="text-xs font-semibold text-slate-800 hover:text-emerald-800 dark:text-slate-300 dark:hover:text-white flex items-center gap-1 transition-colors"
              >
                <span>View all</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Task List */}
            <div className="space-y-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    task.completed
                      ? 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-60'
                      : 'bg-white dark:bg-slate-900 border-[#e8ede9] dark:border-slate-800 hover:border-emerald-300 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors shrink-0 ${
                        task.completed
                          ? 'bg-emerald-700 border-emerald-700 text-white'
                          : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                      }`}
                    >
                      {task.completed && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                    </div>
                    <div className="min-w-0">
                      <p
                        className={`text-xs font-semibold text-slate-900 dark:text-white truncate ${
                          task.completed ? 'line-through text-slate-400 dark:text-slate-500' : ''
                        }`}
                      >
                        {task.title}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate">
                        {task.category}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-md shrink-0 ${task.dueBadgeColor}`}
                  >
                    {task.due}
                  </span>
                </div>
              ))}
            </div>

            {/* Inline Add Task Form */}
            {isAddingTask ? (
              <form onSubmit={handleCreateTask} className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="Task title..."
                  className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  autoFocus
                />
                <div className="flex items-center justify-between gap-2">
                  <select
                    value={newTaskCategory}
                    onChange={(e) => setNewTaskCategory(e.target.value)}
                    className="text-xs px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900"
                  >
                    <option value="Admissions">Admissions</option>
                    <option value="Finance">Finance</option>
                    <option value="Operations">Operations</option>
                    <option value="Academics">Academics</option>
                  </select>
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => setIsAddingTask(false)}
                      className="px-2 py-1 text-xs text-slate-500 hover:text-slate-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1 text-xs font-semibold bg-[#153e31] text-white rounded-lg hover:bg-[#103227]"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <button
                onClick={() => setIsAddingTask(true)}
                className="mt-4 w-full py-2.5 rounded-xl border border-dashed border-slate-200 hover:border-emerald-600 hover:text-emerald-700 text-slate-500 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add a task</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Section: Attendance Overview Capsule Bar Chart matching Figma */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-[#e8ede9] dark:border-slate-800 p-6 sm:p-7 shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Attendance overview
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Last 7 school days
            </p>
          </div>

          <div className="relative">
            <button
              onClick={() => showToast('Filtered by current academic week', 'info')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors shadow-2xs"
            >
              <span>This week</span>
              <ChevronRight className="w-3 h-3 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Capsule Chart Area */}
        <div className="relative pt-6 pb-2">
          {/* Active Tooltip Popover */}
          {activeHoverDay && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 px-3 py-1 rounded-lg bg-[#153e31] text-white text-xs font-medium shadow-md pointer-events-none flex items-center gap-2 animate-in fade-in zoom-in-95 duration-150 z-20">
              <span>{activeHoverDay.date}</span>
              <span className="font-bold text-emerald-300">
                {activeHoverDay.rate}% Present
              </span>
            </div>
          )}

          {/* 7 Days Columns */}
          <div className="grid grid-cols-7 gap-1.5 xs:gap-2.5 sm:gap-6 items-end justify-items-center max-w-4xl mx-auto py-2">
            {attendanceDays.map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center gap-2 w-full cursor-pointer group"
                onMouseEnter={() => setActiveHoverDay(item)}
                onMouseLeave={() => setActiveHoverDay(null)}
              >
                {/* Capsule Column Container */}
                <div className="w-8 xs:w-11 sm:w-16 h-36 sm:h-44 rounded-xl sm:rounded-2xl bg-[#ebf0ed] dark:bg-slate-800 p-1 flex flex-col justify-end transition-transform group-hover:scale-102">
                  <div
                    className="w-full rounded-lg sm:rounded-xl bg-gradient-to-t from-[#1b4334] to-[#3a7c64] group-hover:to-[#4e9e80] transition-all duration-300 shadow-2xs"
                    style={{ height: `${item.rate}%` }}
                  />
                </div>

                {/* Day Label */}
                <span className="text-[11px] sm:text-xs font-medium text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                  {item.day}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Legend and Summary Row */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1b4334]" />
            <span>Present</span>
          </div>

          <div className="text-right">
            <span className="text-base font-bold text-slate-900 dark:text-white">
              94.2%
            </span>
            <span className="text-slate-500 dark:text-slate-400 ml-1 font-normal">
              average
            </span>
          </div>
        </div>
      </div>

      {/* Modal: + Add New Student matching Figma action button */}
      {isAddStudentOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-5 sm:p-7 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
                  Student Enrollment
                </span>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Add New Student
                </h2>
              </div>
              <button
                onClick={() => setIsAddStudentOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddStudentSubmit} className="mt-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={studentForm.firstName}
                    onChange={(e) =>
                      setStudentForm({ ...studentForm, firstName: e.target.value })
                    }
                    placeholder="e.g. Liam"
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={studentForm.lastName}
                    onChange={(e) =>
                      setStudentForm({ ...studentForm, lastName: e.target.value })
                    }
                    placeholder="e.g. Bennett"
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Class / Grade
                  </label>
                  <select
                    value={studentForm.classGrade}
                    onChange={(e) =>
                      setStudentForm({ ...studentForm, classGrade: e.target.value })
                    }
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  >
                    <option value="JSS 1A">JSS 1A</option>
                    <option value="JSS 2A">JSS 2A</option>
                    <option value="JSS 3A">JSS 3A</option>
                    <option value="SS 1 Science">SS 1 Science</option>
                    <option value="SS 2 Science">SS 2 Science</option>
                    <option value="SS 3 Science">SS 3 Science</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Gender
                  </label>
                  <select
                    value={studentForm.gender}
                    onChange={(e) =>
                      setStudentForm({ ...studentForm, gender: e.target.value })
                    }
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Parent / Guardian Name
                </label>
                <input
                  type="text"
                  value={studentForm.guardianName}
                  onChange={(e) =>
                    setStudentForm({ ...studentForm, guardianName: e.target.value })
                  }
                  placeholder="e.g. Dr. Arthur Bennett"
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Guardian Email
                  </label>
                  <input
                    type="email"
                    value={studentForm.guardianEmail}
                    onChange={(e) =>
                      setStudentForm({ ...studentForm, guardianEmail: e.target.value })
                    }
                    placeholder="guardian@example.com"
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Guardian Phone
                  </label>
                  <input
                    type="tel"
                    value={studentForm.guardianPhone}
                    onChange={(e) =>
                      setStudentForm({ ...studentForm, guardianPhone: e.target.value })
                    }
                    placeholder="+234 803 000 0000"
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddStudentOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-[#153e31] hover:bg-[#103227] text-white shadow-xs transition-colors"
                >
                  Save & Register
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

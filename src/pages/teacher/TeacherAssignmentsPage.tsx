import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  BookOpen,
  Plus,
  Calendar,
  CheckCircle2,
  Clock,
  Trash2,
  Award,
  FileText,
  User,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { Assignment, AssignmentSubmission } from '../../types';
import { Modal } from '../../components/ui/Modal';
import { FormInput, FormSelect, FormTextarea } from '../../components/ui/FormInputs';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';

const assignmentSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  subject: z.string().min(2, 'Subject is required'),
  classId: z.string().min(1, 'Please select target class'),
  dueDate: z.string().min(1, 'Due date is required'),
  maxScore: z.number().min(5).max(100),
  description: z.string().min(5, 'Instructions are required'),
});

type AssignmentFormData = z.infer<typeof assignmentSchema>;

export const TeacherAssignmentsPage: React.FC = () => {
  const { showToast } = useToast();
  const { classes, subjects, assignments, submissions, addAssignment, deleteAssignment, gradeSubmission } = useData();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [gradingSubmission, setGradingSubmission] = useState<AssignmentSubmission | null>(null);
  const [gradeInput, setGradeInput] = useState<number>(85);
  const [feedbackInput, setFeedbackInput] = useState<string>('Well answered!');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AssignmentFormData>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: {
      maxScore: 20,
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
    },
  });

  const onSubmit = (data: AssignmentFormData) => {
    const targetClass = classes.find((c) => c.id === data.classId);
    addAssignment({
      title: data.title,
      subject: data.subject,
      classId: data.classId,
      className: targetClass ? targetClass.name : 'Class',
      teacherId: 'tch-01',
      teacherName: 'Faculty Staff',
      dueDate: data.dueDate,
      maxScore: data.maxScore,
      description: data.description,
    });
    showToast(`Assignment "${data.title}" posted for ${targetClass?.name}!`, 'success');
    setIsModalOpen(false);
    reset();
  };

  const handleGradeSubmit = () => {
    if (!gradingSubmission) return;
    gradeSubmission(gradingSubmission.id, gradeInput, feedbackInput);
    showToast(`Submission by ${gradingSubmission.studentName} graded!`, 'success');
    setGradingSubmission(null);
  };

  const assignmentSubmissions = selectedAssignment
    ? submissions.filter((s) => s.assignmentId === selectedAssignment.id)
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Assignments & Coursework
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Publish continuous assessment tasks, review homework submissions, and return scored feedback.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#153e31] hover:bg-[#1a4a3b] text-white text-sm font-semibold shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Assignment</span>
        </button>
      </div>

      {/* Main Grid: Assignments List */}
      {assignments.length === 0 ? (
        <EmptyState
          title="No assignments posted yet"
          description="Create your first homework task, continuous assessment quiz, or project."
          action={{
            label: 'Create Assignment',
            onClick: () => setIsModalOpen(true),
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {assignments.map((asg) => {
            const subCount = submissions.filter((s) => s.assignmentId === asg.id).length;

            return (
              <div
                key={asg.id}
                className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                      {asg.className}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> Due {asg.dueDate}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                    {asg.title}
                  </h3>
                  <p className="text-xs font-semibold text-slate-500 mt-0.5">{asg.subject}</p>

                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-3 line-clamp-3">
                    {asg.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-600 dark:text-slate-300">
                    Max: {asg.maxScore} pts • {subCount} turned in
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setSelectedAssignment(asg)}
                      className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                    >
                      Submissions ({subCount})
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteAssignment(asg.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                      title="Delete assignment"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Submissions Review Modal */}
      {selectedAssignment && (
        <Modal
          isOpen={!!selectedAssignment}
          onClose={() => setSelectedAssignment(null)}
          title={`Submissions: ${selectedAssignment.title} (${selectedAssignment.className})`}
          maxWidth="2xl"
        >
          <div className="space-y-4 py-2">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-600 dark:text-slate-300">
              <p>Due: <strong>{selectedAssignment.dueDate}</strong> | Max Points: <strong>{selectedAssignment.maxScore}</strong></p>
              <p className="mt-1">{selectedAssignment.description}</p>
            </div>

            {assignmentSubmissions.length === 0 ? (
              <p className="text-center py-6 text-xs text-slate-400">
                No students have turned in this assignment yet.
              </p>
            ) : (
              <div className="space-y-3">
                {assignmentSubmissions.map((sub) => (
                  <div key={sub.id} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-3 text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white">{sub.studentName}</span>
                        <span className="text-[10px] text-slate-400">Turned in {sub.submissionDate}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${sub.status === 'Graded' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                          {sub.status}
                        </span>
                      </div>
                      <p className="mt-2 text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{sub.content}</p>
                      {sub.score !== undefined && (
                        <p className="mt-2 font-bold text-emerald-700 dark:text-emerald-400">
                          Score: {sub.score} / {selectedAssignment.maxScore} • Feedback: "{sub.feedback}"
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setGradingSubmission(sub);
                        setGradeInput(sub.score ?? 18);
                        setFeedbackInput(sub.feedback ?? 'Good analysis!');
                      }}
                      className="px-2.5 py-1 rounded-lg border border-slate-300 dark:border-slate-700 font-semibold hover:bg-slate-100 shrink-0"
                    >
                      {sub.status === 'Graded' ? 'Re-grade' : 'Grade'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Grade Submission Modal */}
      {gradingSubmission && (
        <Modal
          isOpen={!!gradingSubmission}
          onClose={() => setGradingSubmission(null)}
          title={`Score Submission: ${gradingSubmission.studentName}`}
          maxWidth="md"
        >
          <div className="space-y-4 py-2">
            <FormInput
              label="Points Awarded"
              type="number"
              value={gradeInput}
              onChange={(e) => setGradeInput(Number(e.target.value))}
              min={0}
              max={100}
            />
            <FormTextarea
              label="Instructor Feedback"
              value={feedbackInput}
              onChange={(e) => setFeedbackInput(e.target.value)}
              placeholder="Constructive remarks for student..."
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setGradingSubmission(null)}
                className="px-3 py-1.5 text-xs font-semibold border rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleGradeSubmit}
                className="px-4 py-1.5 text-xs font-semibold bg-emerald-700 text-white rounded-xl hover:bg-emerald-800"
              >
                Save Grade & Feedback
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Add Assignment Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Post New Course Assignment"
        maxWidth="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <FormInput
            label="Assignment Title"
            required
            {...register('title')}
            error={errors.title?.message}
            placeholder="e.g. Newton's Laws and Motion Dynamics Problem Set"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormSelect
              label="Target Class"
              required
              {...register('classId')}
              options={classes.map((c) => ({ label: `${c.name} (${c.level})`, value: c.id }))}
            />
            <FormSelect
              label="Subject"
              required
              {...register('subject')}
              options={subjects.map((s) => ({ label: s.name, value: s.name }))}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Submission Deadline"
              type="date"
              required
              {...register('dueDate')}
              error={errors.dueDate?.message}
            />
            <FormInput
              label="Maximum Score (Marks)"
              type="number"
              required
              {...register('maxScore', { valueAsNumber: true })}
              error={errors.maxScore?.message}
              min={5}
              max={100}
            />
          </div>

          <FormTextarea
            label="Assignment Instructions & Questions"
            required
            {...register('description')}
            error={errors.description?.message}
            placeholder="Outline questions, guidelines, and expected deliverables..."
          />

          <div className="flex justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white"
            >
              Publish Assignment
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

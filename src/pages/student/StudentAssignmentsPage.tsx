import React, { useState } from 'react';
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Send,
  Award,
  AlertCircle,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { Assignment } from '../../types';
import { Modal } from '../../components/ui/Modal';
import { FormTextarea } from '../../components/ui/FormInputs';
import { EmptyState } from '../../components/ui/EmptyState';

export const StudentAssignmentsPage: React.FC = () => {
  const { showToast } = useToast();
  const { assignments, submissions, submitAssignment, students } = useData();

  const [activeAssignment, setActiveAssignment] = useState<Assignment | null>(null);
  const [submissionText, setSubmissionText] = useState('');

  const currentStudent = students[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeAssignment) return;
    if (!submissionText.trim()) {
      showToast('Please type your solution or answer text', 'error');
      return;
    }

    submitAssignment({
      assignmentId: activeAssignment.id,
      studentId: currentStudent?.id || 'stu-demo',
      studentName: currentStudent?.fullName || 'Student',
      content: submissionText.trim(),
      status: 'Submitted',
    });

    showToast(`Homework for "${activeAssignment.title}" turned in!`, 'success');
    setActiveAssignment(null);
    setSubmissionText('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          My Assignments & Homework
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Review coursework, submit written solutions, and view teacher feedback & marks.
        </p>
      </div>

      {/* Assignments List */}
      {assignments.length === 0 ? (
        <EmptyState
          title="No assignments due"
          description="Your teachers have not posted any pending coursework or homework tasks for your class."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {assignments.map((asg) => {
            const mySubmission = submissions.find(
              (s) => s.assignmentId === asg.id && (s.studentId === currentStudent?.id || s.studentId === 'stu-demo')
            );

            return (
              <div
                key={asg.id}
                className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                      {asg.subject}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                      <Clock className="w-3.5 h-3.5" /> Due {asg.dueDate}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {asg.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">Assigned by {asg.teacherName}</p>

                  <div className="mt-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                    {asg.description}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">
                    Max: {asg.maxScore} marks
                  </span>

                  {mySubmission ? (
                    <div className="text-right">
                      <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${mySubmission.status === 'Graded' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'}`}>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {mySubmission.status === 'Graded' ? `${mySubmission.score} / ${asg.maxScore} pts` : 'Turned In'}
                      </span>
                      {mySubmission.feedback && (
                        <p className="text-[10px] text-slate-500 italic mt-0.5">"{mySubmission.feedback}"</p>
                      )}
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setActiveAssignment(asg)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Solution</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Submission Modal */}
      {activeAssignment && (
        <Modal
          isOpen={!!activeAssignment}
          onClose={() => setActiveAssignment(null)}
          title={`Submit: ${activeAssignment.title}`}
          maxWidth="lg"
        >
          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs space-y-1 text-slate-600 dark:text-slate-300">
              <p>Subject: <strong>{activeAssignment.subject}</strong></p>
              <p>Due Date: <strong>{activeAssignment.dueDate}</strong> | Max Score: <strong>{activeAssignment.maxScore} pts</strong></p>
              <p className="mt-1 font-medium">{activeAssignment.description}</p>
            </div>

            <FormTextarea
              label="Your Solution / Answers"
              required
              value={submissionText}
              onChange={(e) => setSubmissionText(e.target.value)}
              placeholder="Type your answers, proofs, or assignment responses here..."
            />

            <div className="flex justify-end gap-2 pt-3">
              <button
                type="button"
                onClick={() => setActiveAssignment(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white"
              >
                Turn in Assignment
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

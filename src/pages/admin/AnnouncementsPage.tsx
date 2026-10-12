import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Megaphone,
  Plus,
  Pin,
  Trash2,
  Calendar,
  Users,
  AlertCircle,
} from 'lucide-react';
import { Announcement } from '../../types';
import { mockAnnouncements } from '../../data/mockData';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { FormInput, FormSelect, FormTextarea } from '../../components/ui/FormInputs';
import { useToast } from '../../context/ToastContext';

const announcementSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  targetAudience: z.enum(['All', 'Teachers', 'Students', 'Parents']),
  priority: z.enum(['Low', 'Medium', 'High']),
});

type AnnouncementFormData = z.infer<typeof announcementSchema>;

export const AnnouncementsPage: React.FC = () => {
  const { showToast } = useToast();
  const [announcements, setAnnouncements] = useState<Announcement[]>(mockAnnouncements);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Announcement | null>(null);
  const [audienceFilter, setAudienceFilter] = useState('All');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AnnouncementFormData>({
    resolver: zodResolver(announcementSchema),
    defaultValues: {
      targetAudience: 'All',
      priority: 'Medium',
    },
  });

  const filteredAnnouncements = announcements.filter((item) => {
    if (audienceFilter === 'All') return true;
    return item.targetAudience === audienceFilter || item.targetAudience === 'All';
  });

  const onSubmit = (data: AnnouncementFormData) => {
    const newAnnouncement: Announcement = {
      id: `anc-${Date.now()}`,
      title: data.title,
      content: data.content,
      targetAudience: data.targetAudience,
      author: 'Dr. (Mrs.) Funmilayo Adeleke',
      authorRole: 'Principal',
      date: '16th Feb, 2026',
      priority: data.priority,
      pinned: data.priority === 'High',
    };

    setAnnouncements((prev) => [newAnnouncement, ...prev]);
    showToast('Broadcast published to community portals!', 'success');
    setIsModalOpen(false);
    reset();
  };

  const handleDelete = () => {
    if (!itemToDelete) return;
    setAnnouncements((prev) => prev.filter((a) => a.id !== itemToDelete.id));
    showToast('Announcement removed', 'info');
    setItemToDelete(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            School Broadcasts & Noticeboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Publish circulars, PTA alerts, exam schedules, and holiday announcements.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-600/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Broadcast</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {['All', 'Parents', 'Teachers', 'Students'].map((aud) => (
          <button
            key={aud}
            onClick={() => setAudienceFilter(aud)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              audienceFilter === aud
                ? 'bg-brand-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
            }`}
          >
            {aud === 'All' ? 'All Broadcasts' : `${aud} Only`}
          </button>
        ))}
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {filteredAnnouncements.map((item) => (
          <div
            key={item.id}
            className={`p-6 bg-white dark:bg-slate-900 rounded-3xl border transition-all ${
              item.pinned
                ? 'border-brand-300 dark:border-brand-800 shadow-sm'
                : 'border-slate-200 dark:border-slate-800'
            }`}
          >
            <div className="flex items-start justify-between gap-4 mb-2">
              <div className="flex items-center gap-2">
                {item.pinned && (
                  <Pin className="w-4 h-4 text-brand-600 dark:text-brand-400 fill-brand-600 shrink-0" />
                )}
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {item.title}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    item.priority === 'High'
                      ? 'danger'
                      : item.priority === 'Medium'
                      ? 'warning'
                      : 'neutral'
                  }
                  size="sm"
                >
                  {item.priority} Priority
                </Badge>
                <button
                  onClick={() => setItemToDelete(item)}
                  className="p-1 rounded-lg text-slate-400 hover:text-rose-600 transition-colors"
                  title="Delete Announcement"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              {item.content}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <span>By: <strong className="text-slate-700 dark:text-slate-300">{item.author}</strong> ({item.authorRole})</span>
                <span>•</span>
                <span>Audience: <strong className="text-brand-600 dark:text-brand-400">{item.targetAudience}</strong></span>
              </div>
              <span>{item.date}</span>
            </div>
          </div>
        ))}
      </div>

      {/* New Announcement Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Compose School Broadcast"
        description="This circular will be visible on dashboards matching the target audience."
        maxWidth="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormInput
            label="Announcement Title"
            required
            {...register('title')}
            error={errors.title?.message}
            placeholder="e.g. End of Term Examination Schedule"
          />

          <div className="grid grid-cols-2 gap-4">
            <FormSelect
              label="Target Audience"
              required
              {...register('targetAudience')}
              options={[
                { label: 'Entire School Community (All)', value: 'All' },
                { label: 'Parents / Guardians', value: 'Parents' },
                { label: 'Academic Staff (Teachers)', value: 'Teachers' },
                { label: 'Students Only', value: 'Students' },
              ]}
            />
            <FormSelect
              label="Priority Level"
              required
              {...register('priority')}
              options={[
                { label: 'High Priority (Pinned)', value: 'High' },
                { label: 'Medium Priority', value: 'Medium' },
                { label: 'Low / General Info', value: 'Low' },
              ]}
            />
          </div>

          <FormTextarea
            label="Announcement Content"
            required
            rows={4}
            {...register('content')}
            error={errors.content?.message}
            placeholder="Write the full message details here..."
          />

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-md transition-colors"
            >
              Publish Broadcast
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={Boolean(itemToDelete)}
        onClose={() => setItemToDelete(null)}
        onConfirm={handleDelete}
        title="Delete Broadcast"
        message={`Are you sure you want to remove "${itemToDelete?.title}" from the noticeboard?`}
        confirmLabel="Delete Notice"
      />
    </div>
  );
};

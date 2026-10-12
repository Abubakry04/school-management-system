import React from 'react';
import { Megaphone, Pin } from 'lucide-react';
import { mockAnnouncements } from '../../data/mockData';
import { Badge } from '../../components/ui/Badge';

export const TeacherAnnouncementsPage: React.FC = () => {
  const staffAnnouncements = mockAnnouncements.filter(
    (a) => a.targetAudience === 'Teachers' || a.targetAudience === 'All'
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Staff Noticeboard & Academic Circulars
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Internal administrative memos, CA submission schedules, and curriculum directives.
        </p>
      </div>

      <div className="space-y-4">
        {staffAnnouncements.map((item) => (
          <div
            key={item.id}
            className={`p-6 bg-white dark:bg-slate-900 rounded-3xl border ${
              item.pinned ? 'border-brand-300 dark:border-brand-800' : 'border-slate-200 dark:border-slate-800'
            } shadow-sm`}
          >
            <div className="flex items-start justify-between gap-4 mb-2">
              <div className="flex items-center gap-2">
                {item.pinned && <Pin className="w-4 h-4 text-brand-600 fill-brand-600 shrink-0" />}
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {item.title}
                </h3>
              </div>
              <Badge variant={item.priority === 'High' ? 'danger' : 'neutral'} size="sm">
                {item.priority} Priority
              </Badge>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              {item.content}
            </p>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800">
              <span>Author: <strong className="text-slate-700 dark:text-slate-300">{item.author}</strong> ({item.authorRole})</span>
              <span>{item.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

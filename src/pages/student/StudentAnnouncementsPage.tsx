import React from 'react';
import { Megaphone, Pin } from 'lucide-react';
import { mockAnnouncements } from '../../data/mockData';
import { Badge } from '../../components/ui/Badge';

export const StudentAnnouncementsPage: React.FC = () => {
  const studentNotices = mockAnnouncements.filter(
    (a) => a.targetAudience === 'Students' || a.targetAudience === 'All'
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Student Noticeboard & Events
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Inter-house sports, club schedules, examinations, and holiday notifications.
        </p>
      </div>

      <div className="space-y-4">
        {studentNotices.map((item) => (
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
              <Badge variant={item.priority === 'High' ? 'danger' : 'brand'} size="sm">
                {item.priority}
              </Badge>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              {item.content}
            </p>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800">
              <span>Announced by: <strong className="text-slate-700 dark:text-slate-300">{item.author}</strong> ({item.authorRole})</span>
              <span>{item.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

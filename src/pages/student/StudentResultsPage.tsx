import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { OfficialReportCard } from '../../components/reports/OfficialReportCard';
import { EmptyState } from '../../components/ui/EmptyState';

export const StudentResultsPage: React.FC = () => {
  const { students, grades, settings } = useData();
  const [selectedTerm, setSelectedTerm] = useState<string>(settings.currentTerm);
  const student = students[0]; // Active student

  if (!student) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Terminal Academic Report Card
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Continuous Assessment (CA) scores, examination totals, and term evaluations.
          </p>
        </div>
        <EmptyState
          title="No Student Results Available"
          description="There are currently no active students registered in this session to display report card transcripts."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Term Selector Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800 no-print">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Terminal Academic Report Card
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Continuous Assessment (CA) scores, examination totals, and term evaluations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
            Term:
          </label>
          <select
            value={selectedTerm}
            onChange={(e) => setSelectedTerm(e.target.value)}
            className="px-3 py-1.5 text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
          >
            <option value="1st Term">1st Term {settings.currentSession}</option>
            <option value="2nd Term">2nd Term {settings.currentSession}</option>
            <option value="3rd Term">3rd Term {settings.currentSession}</option>
          </select>
        </div>
      </div>

      {/* Official Terminal Report Sheet Component */}
      <OfficialReportCard
        student={student}
        grades={grades}
        settings={settings}
        term={selectedTerm}
        session={settings.currentSession}
      />
    </div>
  );
};

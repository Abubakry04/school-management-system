import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { OfficialReportCard } from '../../components/reports/OfficialReportCard';
import { WardDropdown } from '../../components/parent/WardDropdown';

export const ParentResultsPage: React.FC = () => {
  const { selectedWard, wards, setSelectedWardId } = useAuth();
  const { students, grades, settings } = useData();
  const [selectedTerm, setSelectedTerm] = useState<string>(settings.currentTerm);

  const activeWard = selectedWard || wards[0];

  if (!activeWard) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Ward Terminal Academic Report
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Continuous Assessment (CA) scores, examination totals, and term evaluations.
          </p>
        </div>
        <div className="p-8 sm:p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">No Wards Registered</p>
          <p className="text-xs text-slate-500 mt-1">There are currently no active students linked to your guardian profile.</p>
        </div>
      </div>
    );
  }

  const matchedStudent = students.find((s) => s.id === activeWard.studentId) || {
    id: activeWard.studentId,
    admissionNo: activeWard.admissionNo,
    firstName: activeWard.name.split(' ')[0],
    lastName: activeWard.name.split(' ').slice(1).join(' '),
    fullName: activeWard.name,
    gender: 'Female' as const,
    dob: '2009-08-14',
    classId: 'cls-03',
    className: activeWard.className,
    guardianName: 'Chief Babatunde Adeyemi',
    guardianPhone: '+234 802 998 8776',
    guardianEmail: 'parent@example.com',
    address: 'Victoria Island, Lagos',
    bloodGroup: 'O+',
    stateOfOrigin: 'Lagos State',
    lga: 'Eti-Osa',
    avatar: activeWard.avatar,
    status: 'Active' as const,
    feeBalance: activeWard.feeBalance,
    attendancePercentage: activeWard.attendancePercentage,
    parentId: 'par-01',
    enrolledDate: '12th Sep, 2023',
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header and Child Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800 no-print">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Ward Terminal Academic Report
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Viewing authenticated report sheet for <strong className="text-slate-900 dark:text-white">{activeWard.name}</strong> ({activeWard.className})
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Ward Dropdown */}
          <WardDropdown />

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

      {/* Official Terminal Report Card */}
      <OfficialReportCard
        student={matchedStudent}
        grades={grades}
        settings={settings}
        term={selectedTerm}
        session={settings.currentSession}
      />
    </div>
  );
};

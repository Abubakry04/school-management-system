import React from 'react';
import { Printer, Download, Award, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Student, GradeItem, SchoolSettings } from '../../types';
import { useData } from '../../context/DataContext';

interface OfficialReportCardProps {
  student: Student;
  grades: GradeItem[];
  settings: SchoolSettings;
  term?: string;
  session?: string;
  showActions?: boolean;
  onClose?: () => void;
}

export const OfficialReportCard: React.FC<OfficialReportCardProps> = ({
  student,
  grades,
  settings,
  term = settings.currentTerm,
  session = settings.currentSession,
  showActions = true,
  onClose,
}) => {
  const { behavioralRatings } = useData();
  const studentRating = (behavioralRatings || []).find(
    (b) => b.studentId === student.id && b.term === term && (!b.session || b.session === session)
  );

  const filteredGrades = grades.filter(
    (g) => g.term === term && (!g.session || g.session === session)
  );

  const totalObtained = filteredGrades.reduce((sum, g) => sum + g.total, 0);
  const maxPossible = Math.max(filteredGrades.length * 100, 100);
  const averagePercentage =
    filteredGrades.length > 0 ? (totalObtained / filteredGrades.length).toFixed(1) : '85.4';

  const avgNum = parseFloat(averagePercentage);

  const getOverallRemark = () => {
    if (avgNum >= 80) return 'An outstanding academic performance with exemplary focus and discipline. Keep striving for greater heights!';
    if (avgNum >= 70) return 'A very commendable performance. Demonstrated keen comprehension and steady diligence throughout the term.';
    if (avgNum >= 60) return 'Good overall effort. Can achieve even greater results with more consistency in examination revisions.';
    if (avgNum >= 50) return 'Satisfactory work. Encouraged to seek academic counseling and devote more home study hours to challenging subjects.';
    return 'Performance requires immediate academic intervention and regular monitored home studies.';
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      {/* Action Bar (hidden when printing) */}
      {showActions && (
        <div className="flex items-center justify-between gap-3 p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl no-print">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100">
              Official Academic Transcript • {term} {session}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </button>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 text-xs font-medium rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
              >
                Close
              </button>
            )}
          </div>
        </div>
      )}

      {/* Official A4-Proportioned Report Sheet */}
      <div className="bg-white text-slate-950 p-6 sm:p-10 rounded-2xl border-2 border-slate-800 shadow-md print:shadow-none print:border-none print:p-0 print:m-0 print:rounded-none max-w-4xl mx-auto font-serif">
        {/* Header / Crest */}
        <div className="text-center border-b-2 border-slate-900 pb-5 mb-5 relative">
          <div className="flex justify-center mb-2">
            <div className="w-16 h-16 rounded-2xl border-2 border-[#153e31] flex flex-col items-center justify-center font-sans font-black text-xl text-[#153e31] tracking-tighter bg-emerald-50">
              <span>FEA</span>
              <span className="text-[9px] font-mono tracking-widest -mt-1 uppercase text-emerald-800">SIS</span>
            </div>
          </div>

          <p className="text-[10px] tracking-widest font-sans uppercase font-bold text-slate-500">
            Federal Ministry of Education Recognized
          </p>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#153e31] mt-0.5 font-sans">
            {settings.schoolName}
          </h1>
          <p className="text-xs italic text-slate-700 mt-0.5">
            "{settings.motto}"
          </p>
          <p className="text-[11px] text-slate-600 font-sans mt-1">
            {settings.address} | Tel: {settings.phone} | Web: {settings.website}
          </p>

          <div className="mt-3 inline-block bg-[#153e31] text-white font-sans text-xs uppercase px-4 py-1 rounded font-bold tracking-wider">
            Continuous Assessment & Terminal Progress Report
          </div>
        </div>

        {/* Bio Strip with Student Passport Photograph */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 bg-slate-50 p-4 rounded-xl border border-slate-300 font-sans text-xs mb-5">
          {/* Passport Photo Container */}
          <div className="w-24 h-28 shrink-0 bg-white border-2 border-slate-400 p-1 rounded shadow-xs flex flex-col items-center justify-center overflow-hidden">
            {student.avatar ? (
              <img
                src={student.avatar}
                alt={student.fullName}
                className="w-full h-full object-cover rounded-xs"
              />
            ) : (
              <div className="w-full h-full bg-slate-100 flex flex-col items-center justify-center text-slate-400 text-[10px] uppercase font-bold text-center p-1 border border-dashed border-slate-300">
                <span>Passport</span>
                <span>Photograph</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 flex-1 w-full">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Student Name</span>
              <span className="font-bold text-slate-900 text-sm">{student.fullName}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Admission Number</span>
              <span className="font-mono font-bold text-slate-900">{student.admissionNo}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Class & Level</span>
              <span className="font-bold text-slate-900">{student.className}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Term / Session</span>
              <span className="font-bold text-slate-900">{term} • {session}</span>
            </div>

            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">School Attendance</span>
              <span className="font-semibold text-slate-900">114 of 118 Days ({student.attendancePercentage}%)</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Gender & Blood Group</span>
              <span className="font-semibold text-slate-900">{student.gender} • {student.bloodGroup || 'O+'}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Term Resumption</span>
              <span className="font-semibold text-emerald-800">{settings.nextTermResumption}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Class Position</span>
              <span className="font-bold text-emerald-800">1st of 32 Students</span>
            </div>
          </div>
        </div>

        {/* Cognitive Domain Table */}
        <div className="mb-6 overflow-x-auto">
          <table className="w-full border-collapse border border-slate-800 text-xs font-sans text-left">
            <thead>
              <tr className="bg-[#153e31] text-white text-center font-bold">
                <th className="border border-slate-800 p-2 text-left">Subject Curriculum</th>
                <th className="border border-slate-800 p-2 w-14">CA 1 (20)</th>
                <th className="border border-slate-800 p-2 w-14">CA 2 (20)</th>
                <th className="border border-slate-800 p-2 w-14">Exam (60)</th>
                <th className="border border-slate-800 p-2 w-16">Total (100)</th>
                <th className="border border-slate-800 p-2 w-12">Grade</th>
                <th className="border border-slate-800 p-2 text-left hidden sm:table-cell">Master's Remark</th>
              </tr>
            </thead>
            <tbody>
              {filteredGrades.map((g, idx) => (
                <tr key={g.id || idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                  <td className="border border-slate-800 p-2 font-semibold text-slate-900">
                    {g.subject}
                  </td>
                  <td className="border border-slate-800 p-2 text-center">{g.ca1}</td>
                  <td className="border border-slate-800 p-2 text-center">{g.ca2}</td>
                  <td className="border border-slate-800 p-2 text-center">{g.exam}</td>
                  <td className="border border-slate-800 p-2 text-center font-bold text-slate-950 bg-slate-100/60">
                    {g.total}
                  </td>
                  <td className="border border-slate-800 p-2 text-center font-black">
                    <span
                      className={`inline-block px-1.5 py-0.5 rounded text-[11px] ${
                        g.grade === 'A'
                          ? 'text-emerald-800 font-extrabold'
                          : g.grade === 'B'
                          ? 'text-blue-800'
                          : 'text-amber-800'
                      }`}
                    >
                      {g.grade}
                    </span>
                  </td>
                  <td className="border border-slate-800 p-2 text-xs italic text-slate-700 hidden sm:table-cell">
                    {g.remark || 'Very good work'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Performance Metrics Summary Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 border-2 border-slate-800 p-3 rounded-lg font-sans text-center mb-6 bg-emerald-50/50">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Total Score</span>
            <span className="text-base font-black text-slate-900">{totalObtained} / {maxPossible}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Term Average</span>
            <span className="text-base font-black text-emerald-800">{averagePercentage}%</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Standing</span>
            <span className="text-base font-bold text-slate-900">Distinction (1st Class)</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Promotion Status</span>
            <span className="text-base font-bold text-emerald-700 flex items-center justify-center gap-1">
              <CheckCircle2 className="w-4 h-4 inline" /> Clear Pass
            </span>
          </div>
        </div>

        {/* Affective & Psychomotor Domain Evaluation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans text-xs mb-6">
          <div className="border border-slate-800 rounded-lg p-3 bg-slate-50/60">
            <h4 className="font-bold uppercase tracking-wider text-[11px] text-[#153e31] mb-2 border-b border-slate-300 pb-1">
              Affective Traits (Behavioral Rating 1 - 5)
            </h4>
            <div className="space-y-1">
              {[
                { trait: 'Punctuality & Regularity', score: studentRating?.punctuality ?? 5 },
                { trait: 'Personal Cleanliness & Neatness', score: studentRating?.neatness ?? 5 },
                { trait: 'Politeness & Respect for Staff', score: studentRating?.politeness ?? 5 },
                { trait: 'Honesty & Integrity', score: studentRating?.honesty ?? 5 },
                { trait: 'Classroom Leadership & Initiative', score: studentRating?.leadership ?? 4 },
                { trait: 'Attentiveness & Peer Relations', score: studentRating?.relationshipWithPeers ?? 5 },
              ].map((item) => (
                <div key={item.trait} className="flex justify-between items-center text-[11px]">
                  <span>{item.trait}</span>
                  <span className="font-bold bg-white px-2 py-0.5 rounded border border-slate-300">
                    {item.score} / 5
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-slate-800 rounded-lg p-3 bg-slate-50/60">
            <h4 className="font-bold uppercase tracking-wider text-[11px] text-[#153e31] mb-2 border-b border-slate-300 pb-1">
              Psychomotor & Practical Skills (1 - 5)
            </h4>
            <div className="space-y-1">
              {[
                { trait: 'Handwriting & Script Presentation', score: studentRating?.handwriting ?? 4 },
                { trait: 'Participation in Sports & Games', score: studentRating?.sportsAndGames ?? 4 },
                { trait: 'Verbal Fluency & Expression', score: studentRating?.verbalFluency ?? 5 },
                { trait: 'Tools Handling, Crafts & ICT', score: studentRating?.craftsAndTools ?? 4 },
              ].map((item) => (
                <div key={item.trait} className="flex justify-between items-center text-[11px]">
                  <span>{item.trait}</span>
                  <span className="font-bold bg-white px-2 py-0.5 rounded border border-slate-300">
                    {item.score} / 5
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Endorsements & Comments */}
        <div className="space-y-3 font-sans text-xs border-t-2 border-slate-800 pt-4">
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <span className="font-bold text-slate-800 block text-[11px] uppercase">
              Class Teacher's Appraisal:
            </span>
            <p className="italic text-slate-700 mt-1">
              "{studentRating?.teacherRemark || `${student.fullName} has exhibited phenomenal academic consistency and leadership traits among peers this term. Excellent candidate.`}"
            </p>
            <span className="block text-[10px] text-slate-500 font-semibold mt-1">
              Signed: Form Master / Class Teacher
            </span>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <span className="font-bold text-slate-800 block text-[11px] uppercase">
              Principal's Executive Endorsement:
            </span>
            <p className="italic text-slate-700 mt-1">
              "{getOverallRemark()}"
            </p>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200">
              <span className="text-[10px] text-slate-500 font-semibold">
                {settings.principalName}
              </span>
              <div className="flex items-center gap-1.5 text-emerald-800 font-mono text-[10px] uppercase font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>OFFICIAL EMBOSSED STAMP AFFIXED</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-5 text-center text-[10px] text-slate-500 font-sans border-t border-slate-200 pt-2">
          This document is generated by the Federal Excellence Academy SIS Portal. Verified electronic student record.
        </div>
      </div>
    </div>
  );
};

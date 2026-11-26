import React, { useState, useEffect } from 'react';
import { Award, Star, Check, Sparkles, MessageSquare } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Student, BehavioralRating } from '../../types';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';

interface BehavioralAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  term?: '1st Term' | '2nd Term' | '3rd Term';
  session?: string;
}

const PRESET_REMARKS = [
  'An outstanding student with exemplary focus, discipline, and strong character.',
  'Demonstrates steady diligence, punctuality, and excellent peer cooperation.',
  'Well-behaved, polite, and attentive in academic and extracurricular engagements.',
  'Good behavioral disposition; encouraged to participate more actively in group leadership.',
];

export const BehavioralAssessmentModal: React.FC<BehavioralAssessmentModalProps> = ({
  isOpen,
  onClose,
  student,
  term,
  session,
}) => {
  const { settings, behavioralRatings, saveBehavioralRating } = useData();
  const { showToast } = useToast();

  const activeTerm = term || settings.currentTerm;
  const activeSession = session || settings.currentSession;

  // Form State
  const [punctuality, setPunctuality] = useState<number>(5);
  const [neatness, setNeatness] = useState<number>(5);
  const [politeness, setPoliteness] = useState<number>(5);
  const [honesty, setHonesty] = useState<number>(5);
  const [leadership, setLeadership] = useState<number>(4);
  const [relationshipWithPeers, setRelationshipWithPeers] = useState<number>(5);

  const [handwriting, setHandwriting] = useState<number>(4);
  const [sportsAndGames, setSportsAndGames] = useState<number>(4);
  const [verbalFluency, setVerbalFluency] = useState<number>(5);
  const [craftsAndTools, setCraftsAndTools] = useState<number>(4);

  const [teacherRemark, setTeacherRemark] = useState<string>('');

  // Load existing rating if available
  useEffect(() => {
    if (student) {
      const existing = (behavioralRatings || []).find(
        (b) =>
          b.studentId === student.id &&
          b.term === activeTerm &&
          b.session === activeSession
      );
      if (existing) {
        setPunctuality(existing.punctuality);
        setNeatness(existing.neatness);
        setPoliteness(existing.politeness);
        setHonesty(existing.honesty);
        setLeadership(existing.leadership);
        setRelationshipWithPeers(existing.relationshipWithPeers);
        setHandwriting(existing.handwriting);
        setSportsAndGames(existing.sportsAndGames);
        setVerbalFluency(existing.verbalFluency);
        setCraftsAndTools(existing.craftsAndTools);
        setTeacherRemark(existing.teacherRemark || '');
      } else {
        setPunctuality(5);
        setNeatness(5);
        setPoliteness(5);
        setHonesty(5);
        setLeadership(4);
        setRelationshipWithPeers(5);
        setHandwriting(4);
        setSportsAndGames(4);
        setVerbalFluency(5);
        setCraftsAndTools(4);
        setTeacherRemark(`${student.fullName} has exhibited phenomenal academic consistency and leadership traits among peers this term.`);
      }
    }
  }, [student, activeTerm, activeSession, behavioralRatings]);

  if (!student) return null;

  const handleSave = () => {
    saveBehavioralRating({
      studentId: student.id,
      term: activeTerm,
      session: activeSession,
      punctuality,
      neatness,
      politeness,
      honesty,
      leadership,
      relationshipWithPeers,
      handwriting,
      sportsAndGames,
      verbalFluency,
      craftsAndTools,
      teacherRemark,
    });
    showToast(`Behavioral appraisal for ${student.fullName} saved!`, 'success');
    onClose();
  };

  const RatingButtons: React.FC<{
    value: number;
    onChange: (val: number) => void;
  }> = ({ value, onChange }) => (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((score) => (
        <button
          key={score}
          type="button"
          onClick={() => onChange(score)}
          className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
            value === score
              ? 'bg-emerald-600 text-white shadow-xs scale-105'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
          }`}
        >
          {score}
        </button>
      ))}
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Affective & Skills Appraisal: ${student.fullName}`}
      description={`${student.className} • Admission: ${student.admissionNo} • ${activeTerm} (${activeSession})`}
      maxWidth="3xl"
    >
      <div className="space-y-6 max-h-[75vh] overflow-y-auto pr-1">
        {/* Scale Legend */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-[11px] text-emerald-900 dark:text-emerald-300">
          <span className="font-semibold uppercase tracking-wider font-mono">UBEC / WAEC Scale:</span>
          <span>5 = Excellent</span>
          <span>4 = Very Good</span>
          <span>3 = Good</span>
          <span>2 = Fair</span>
          <span>1 = Poor</span>
        </div>

        {/* 1. Affective Domain */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-600" />
            <span>Affective Domain (Character & Social Conduct)</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40">
              <span className="font-medium text-slate-700 dark:text-slate-300">Punctuality & Regularity</span>
              <RatingButtons value={punctuality} onChange={setPunctuality} />
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40">
              <span className="font-medium text-slate-700 dark:text-slate-300">Personal Neatness</span>
              <RatingButtons value={neatness} onChange={setNeatness} />
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40">
              <span className="font-medium text-slate-700 dark:text-slate-300">Politeness & Courtesy</span>
              <RatingButtons value={politeness} onChange={setPoliteness} />
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40">
              <span className="font-medium text-slate-700 dark:text-slate-300">Honesty & Integrity</span>
              <RatingButtons value={honesty} onChange={setHonesty} />
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40">
              <span className="font-medium text-slate-700 dark:text-slate-300">Classroom Leadership</span>
              <RatingButtons value={leadership} onChange={setLeadership} />
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40">
              <span className="font-medium text-slate-700 dark:text-slate-300">Peer Relations</span>
              <RatingButtons value={relationshipWithPeers} onChange={setRelationshipWithPeers} />
            </div>
          </div>
        </div>

        {/* 2. Psychomotor Domain */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-600" />
            <span>Psychomotor & Practical Dexterity</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40">
              <span className="font-medium text-slate-700 dark:text-slate-300">Handwriting & Script</span>
              <RatingButtons value={handwriting} onChange={setHandwriting} />
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40">
              <span className="font-medium text-slate-700 dark:text-slate-300">Sports & Athletics</span>
              <RatingButtons value={sportsAndGames} onChange={setSportsAndGames} />
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40">
              <span className="font-medium text-slate-700 dark:text-slate-300">Verbal Fluency</span>
              <RatingButtons value={verbalFluency} onChange={setVerbalFluency} />
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40">
              <span className="font-medium text-slate-700 dark:text-slate-300">Crafts, Tools & ICT</span>
              <RatingButtons value={craftsAndTools} onChange={setCraftsAndTools} />
            </div>
          </div>
        </div>

        {/* 3. Class Teacher Appraisal Remark */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-emerald-600" />
            <span>Class Teacher's Terminal Appraisal Remark</span>
          </h4>

          <textarea
            value={teacherRemark}
            onChange={(e) => setTeacherRemark(e.target.value)}
            rows={3}
            className="w-full text-xs p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
            placeholder="Enter customized teacher appraisal comment..."
          />

          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[10px] text-slate-400 font-semibold uppercase">Presets:</span>
            {PRESET_REMARKS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setTeacherRemark(preset)}
                className="text-[11px] px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-950 transition-colors text-left"
              >
                Preset {idx + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md transition-all cursor-pointer"
          >
            Save Behavioral Assessment
          </button>
        </div>
      </div>
    </Modal>
  );
};

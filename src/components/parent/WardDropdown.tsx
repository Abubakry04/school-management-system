import React, { useState, useRef } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useClickOutside } from '../../hooks/useClickOutside';

interface WardDropdownProps {
  className?: string;
}

export const WardDropdown: React.FC<WardDropdownProps> = ({ className = '' }) => {
  const { selectedWard, wards, setSelectedWardId } = useAuth();
  const { showToast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useClickOutside(menuRef, () => setIsOpen(false), isOpen);

  const activeWard = selectedWard || wards[0];
  if (!activeWard || wards.length === 0) return null;

  return (
    <div ref={menuRef} className={`relative inline-block ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs transition-all shadow-xs touch-manipulation active:scale-95 cursor-pointer select-none ${
          isOpen
            ? 'bg-emerald-50 dark:bg-slate-800/90 border-emerald-500/50 text-emerald-900 dark:text-emerald-300 ring-2 ring-emerald-500/20'
            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/70'
        }`}
        aria-expanded={isOpen}
        aria-label="Select active student ward"
      >
        {activeWard.avatar ? (
          <img
            src={activeWard.avatar}
            alt={activeWard.name}
            className="w-5 h-5 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0"
          />
        ) : (
          <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 font-bold text-[10px] flex items-center justify-center shrink-0">
            {activeWard.name[0]}
          </div>
        )}
        <span className="font-semibold text-slate-900 dark:text-white max-w-[140px] truncate">
          {activeWard.name}
        </span>
        <span className="text-[11px] text-slate-400 font-mono">({activeWard.className})</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-emerald-600 dark:text-emerald-400' : ''
          }`}
        />
      </button>

      {isOpen && (
        <>
          {/* Mobile backdrop for instant touch-outside dismissal */}
          <div
            className="fixed inset-0 z-40 bg-black/20 dark:bg-black/50 backdrop-blur-[1px] md:hidden"
            onClick={() => setIsOpen(false)}
            onTouchStart={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Dropdown Menu */}
          <div
            className="absolute right-0 mt-2 w-72 sm:w-64 max-w-[calc(100vw-1.5rem)] rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 p-2 z-50 animate-in fade-in zoom-in-95 duration-150 touch-manipulation"
            role="menu"
          >
            <div className="flex items-center justify-between px-2.5 py-1.5 border-b border-slate-100 dark:border-slate-800 mb-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                Select Ward ({wards.length})
              </p>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                Active Student
              </span>
            </div>

            <div className="space-y-1 max-h-64 overflow-y-auto overscroll-contain pr-0.5">
              {wards.map((ward) => {
                const isSelected = ward.studentId === activeWard.studentId;
                return (
                  <button
                    key={ward.studentId}
                    type="button"
                    onClick={() => {
                      setSelectedWardId(ward.studentId);
                      setIsOpen(false);
                      showToast(`Viewing dashboard for ${ward.name}`, 'info');
                    }}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs transition-all touch-manipulation cursor-pointer select-none active:scale-[0.98] ${
                      isSelected
                        ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-200 font-semibold ring-1 ring-emerald-500/30'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 active:bg-slate-100 dark:active:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 text-left">
                      {ward.avatar ? (
                        <img
                          src={ward.avatar}
                          alt={ward.name}
                          className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex items-center justify-center shrink-0">
                          {ward.name[0]}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900 dark:text-white truncate">
                          {ward.name}
                        </p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono mt-0.5">
                          {ward.className} • Adm: {ward.admissionNo}
                        </p>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs ml-2">
                        <Check className="w-3 h-3 stroke-[2.5]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

import React from 'react';

export const PageLoader: React.FC = () => {
  return (
    <div className="flex-1 min-h-[50vh] flex flex-col items-center justify-center p-8">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-4 border-emerald-200 dark:border-emerald-950" />
        <div className="absolute inset-0 rounded-full border-4 border-emerald-600 border-t-transparent animate-spin" />
      </div>
      <p className="mt-4 text-xs font-medium text-slate-500 dark:text-slate-400 tracking-wider uppercase font-mono">
        Loading view...
      </p>
    </div>
  );
};

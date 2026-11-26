import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Compass, ArrowLeft, Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const { role } = useAuth();

  const homePath = role ? `/${role}/dashboard` : '/login';

  return (
    <div className="min-h-screen bg-[#f4f6f5] dark:bg-slate-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mb-6 shadow-xs">
          <Compass className="w-10 h-10 animate-pulse" />
        </div>

        <h1 className="text-6xl font-black tracking-tight text-slate-900 dark:text-white font-mono">
          404
        </h1>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mt-2">
          Page Not Found
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-sm mx-auto">
          The destination you requested does not exist or has been moved within the Federal Excellence Academy portal.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>
          <button
            type="button"
            onClick={() => navigate(homePath)}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-[#153e31] hover:bg-[#1a4a3b] text-white shadow-xs transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Portal Dashboard</span>
          </button>
        </div>
      </div>
    </div>
  );
};

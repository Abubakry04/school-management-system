import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: {
    value: string;
    positive: boolean;
  };
  subtitle?: string;
  iconBg?: string;
  iconColor?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  subtitle,
  iconBg = 'bg-emerald-50 dark:bg-emerald-950/40',
  iconColor = 'text-emerald-700 dark:text-emerald-400',
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white dark:bg-slate-900 border border-[#e8ede9] dark:border-slate-800 p-6 rounded-2xl shadow-xs transition-all duration-200 ${
        onClick
          ? 'cursor-pointer hover:shadow-md hover:border-emerald-300 dark:hover:border-slate-700'
          : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-sans tabular-nums">
            {value}
          </div>
          <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
            {title}
          </p>
        </div>

        {Icon && (
          <div className={`w-11 h-11 rounded-xl ${iconBg} ${iconColor} flex items-center justify-center shrink-0 shadow-xs`}>
            <Icon className="w-5 h-5 stroke-[2.2]" />
          </div>
        )}
      </div>

      <div className="mt-4 pt-1">
        {trend && (
          <span
            className={`text-xs font-semibold ${
              trend.positive
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-rose-600 dark:text-rose-400'
            }`}
          >
            {trend.value}
          </span>
        )}
        {subtitle && !trend && (
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
};

import React, { useState, useMemo } from 'react';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Filter,
} from 'lucide-react';
import { TableSkeleton } from './Skeleton';
import { EmptyState } from './EmptyState';

export interface Column<T> {
  key: string;
  header: string;
  accessor?: (item: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
}

interface FilterOption {
  key: string;
  label: string;
  options: { label: string; value: string }[];
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchPlaceholder?: string;
  searchKeys?: (keyof T)[];
  filters?: FilterOption[];
  pageSize?: number;
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  actions?: React.ReactNode;
  rowKey: (item: T) => string;
  onRowClick?: (item: T) => void;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  searchPlaceholder = 'Search records...',
  searchKeys,
  filters,
  pageSize = 10,
  isLoading = false,
  emptyTitle = 'No records found',
  emptyDescription = 'There are no items matching your criteria.',
  actions,
  rowKey,
  onRowClick,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>({});
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);

  const handleFilterChange = (key: string, value: string) => {
    setSelectedFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleSort = (key: string) => {
    setSortConfig((prev) => {
      if (prev?.key === key) {
        if (prev.direction === 'asc') return { key, direction: 'desc' };
        return null;
      }
      return { key, direction: 'asc' };
    });
  };

  const filteredData = useMemo(() => {
    let result = [...data];

    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      result = result.filter((item) => {
        if (searchKeys && searchKeys.length > 0) {
          return searchKeys.some((k) => {
            const val = item[k];
            return val !== undefined && val !== null && String(val).toLowerCase().includes(term);
          });
        }
        return Object.values(item).some(
          (val) => val !== undefined && val !== null && String(val).toLowerCase().includes(term)
        );
      });
    }

    if (filters && filters.length > 0) {
      Object.entries(selectedFilters).forEach(([filterKey, filterVal]) => {
        if (filterVal && filterVal !== 'all') {
          result = result.filter((item) => {
            const itemVal = item[filterKey];
            return String(itemVal).toLowerCase() === filterVal.toLowerCase();
          });
        }
      });
    }

    if (sortConfig) {
      result.sort((a, b) => {
        const valA = a[sortConfig.key];
        const valB = b[sortConfig.key];
        if (valA === valB) return 0;
        if (valA === undefined || valA === null) return 1;
        if (valB === undefined || valB === null) return -1;

        if (typeof valA === 'number' && typeof valB === 'number') {
          return sortConfig.direction === 'asc' ? valA - valB : valB - valA;
        }

        const comp = String(valA).localeCompare(String(valB));
        return sortConfig.direction === 'asc' ? comp : -comp;
      });
    }

    return result;
  }, [data, searchTerm, searchKeys, filters, selectedFilters, sortConfig]);

  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  return (
    <div className="w-full space-y-3">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row flex-1 gap-2 items-stretch sm:items-center">
          <div className="relative w-full sm:w-auto flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={searchPlaceholder}
              className="w-full pl-9 pr-3 py-2 sm:py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg sm:rounded-md focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 transition-colors"
            />
          </div>

          {filters && filters.length > 0 && (
            <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 w-full sm:w-auto">
              {filters.map((f) => (
                <div key={f.key} className="flex-1 sm:flex-none">
                  <select
                    value={selectedFilters[f.key] || 'all'}
                    onChange={(e) => handleFilterChange(f.key, e.target.value)}
                    className="w-full sm:w-auto px-2.5 py-2 sm:py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg sm:rounded-md text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-colors"
                  >
                    <option value="all">All {f.label}</option>
                    {f.options.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          )}
        </div>

        {actions && <div className="flex items-center gap-2 pt-1 sm:pt-0">{actions}</div>}
      </div>

      {/* Table Container */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-2xs overflow-hidden">
        {isLoading ? (
          <TableSkeleton rows={pageSize} cols={columns.length} />
        ) : filteredData.length === 0 ? (
          <EmptyState
            title={emptyTitle}
            description={emptyDescription}
            icon={Filter}
            action={
              searchTerm || Object.values(selectedFilters).some((v) => v !== 'all')
                ? {
                    label: 'Clear Filters',
                    onClick: () => {
                      setSearchTerm('');
                      setSelectedFilters({});
                    },
                  }
                : undefined
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/50 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {columns.map((col) => {
                    const isSorted = sortConfig?.key === col.key;
                    return (
                      <th
                        key={col.key}
                        className={`py-2.5 px-3.5 sm:px-4 ${col.className || ''}`}
                      >
                        {col.sortable ? (
                          <button
                            type="button"
                            onClick={() => handleSort(col.key)}
                            className="flex items-center gap-1 hover:text-slate-900 dark:hover:text-white transition-colors focus:outline-none"
                          >
                            <span>{col.header}</span>
                            {isSorted ? (
                              sortConfig?.direction === 'asc' ? (
                                <ArrowUp className="w-3 h-3 text-brand-600" />
                              ) : (
                                <ArrowDown className="w-3 h-3 text-brand-600" />
                              )
                            ) : (
                              <ArrowUpDown className="w-3 h-3 text-slate-400" />
                            )}
                          </button>
                        ) : (
                          <span>{col.header}</span>
                        )}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {paginatedData.map((item) => (
                  <tr
                    key={rowKey(item)}
                    onClick={() => onRowClick && onRowClick(item)}
                    className={`transition-colors ${
                      onRowClick
                        ? 'cursor-pointer hover:bg-slate-50/80 dark:hover:bg-slate-800/40'
                        : 'hover:bg-slate-50/50 dark:hover:bg-slate-800/20'
                    }`}
                  >
                    {columns.map((col) => (
                      <td key={col.key} className={`py-2.5 px-3.5 sm:px-4 ${col.className || ''}`}>
                        {col.accessor ? col.accessor(item) : item[col.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer Pagination */}
        {!isLoading && filteredData.length > 0 && (
          <div className="px-3.5 py-2.5 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs text-slate-500 dark:text-slate-400 bg-slate-50/40 dark:bg-slate-950/20">
            <div>
              Showing{' '}
              <span className="font-medium text-slate-700 dark:text-slate-200 tabular-nums">
                {(currentPage - 1) * pageSize + 1}
              </span>{' '}
              to{' '}
              <span className="font-medium text-slate-700 dark:text-slate-200 tabular-nums">
                {Math.min(currentPage * pageSize, filteredData.length)}
              </span>{' '}
              of{' '}
              <span className="font-medium text-slate-700 dark:text-slate-200 tabular-nums">
                {filteredData.length}
              </span>{' '}
              records
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-2 py-1 rounded border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-xs flex items-center gap-1"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Prev</span>
              </button>

              <span className="px-2 text-xs font-medium tabular-nums">
                {currentPage} / {totalPages}
              </span>

              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-2 py-1 rounded border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-xs flex items-center gap-1"
                aria-label="Next page"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

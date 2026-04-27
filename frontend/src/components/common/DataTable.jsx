import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const DataTable = ({ columns, data, pagination, onPageChange, isLoading }) => {
  return (
    <div className="glass-panel p-0 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900/50 border-b border-white/10">
              {columns.map((col) => (
                <th key={col.key} className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {columns.map((col) => (
                    <td key={col.key} className="px-6 py-4">
                      <div className="h-4 bg-slate-800 rounded w-3/4"></div>
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length > 0 ? (
              data.map((row, i) => (
                <tr key={i} className="hover:bg-white/5 transition-colors group">
                  {columns.map((col) => (
                    <td key={col.key} className="px-6 py-4 text-sm text-slate-300">
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-500 font-medium">
                  No data found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className="px-6 py-4 bg-slate-900/30 border-t border-white/10 flex items-center justify-between">
          <div className="text-sm text-slate-400">
            Showing <span className="text-white font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> to <span className="text-white font-medium">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of <span className="text-white font-medium">{pagination.total}</span> entries
          </div>
          <div className="flex gap-2">
            <button 
              disabled={pagination.page === 1}
              onClick={() => onPageChange(pagination.page - 1)}
              className="p-2 rounded-lg border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => onPageChange(pagination.page + 1)}
              className="p-2 rounded-lg border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;

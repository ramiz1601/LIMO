import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { useErp } from '../../context/ErpContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useErp();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
      {toasts.map(toast => {
        const iconMap = {
          success: <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />,
          warning: <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />,
          error: <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />,
          info: <Info className="h-4 w-4 text-blue-600 shrink-0" />
        };

        const bgMap = {
          success: 'bg-white border-emerald-300 text-slate-800 shadow-emerald-500/10',
          warning: 'bg-white border-amber-300 text-slate-800 shadow-amber-500/10',
          error: 'bg-white border-rose-300 text-slate-800 shadow-rose-500/10',
          info: 'bg-white border-blue-300 text-slate-800 shadow-blue-500/10'
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-2xl border shadow-xl transition-all animate-in fade-in slide-in-from-bottom-2 ${bgMap[toast.type]}`}
          >
            <div className="flex items-center gap-2.5">
              {iconMap[toast.type]}
              <p className="text-xs font-semibold leading-snug">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="rounded-lg p-1 hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

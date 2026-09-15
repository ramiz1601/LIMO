import React from 'react';
import { 
  AlertTriangle, 
  ChevronRight, 
  Clock, 
  Car, 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownRight,
  Sparkles,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { useErp } from '../../context/ErpContext';

export const RightPanel: React.FC = () => {
  const { 
    notifications, 
    payments, 
    vehicles, 
    transactions,
    setActiveTab,
    setSelectedDriverForCheckpoint,
    setCheckpointModalOpen,
    drivers
  } = useErp();

  const urgentAlerts = notifications.slice(0, 3);
  const pendingPayments = payments
    .filter(p => p.status === 'overdue' || p.status === 'partial' || p.status === 'pending')
    .slice(0, 3);

  const activeVehicles = vehicles.filter(v => v.status === 'rented' || v.status === 'available').length;
  const maintenanceVehicles = vehicles.filter(v => v.status === 'maintenance').length;
  const recentTxns = transactions.slice(0, 3);

  const handleCollect = (driverId: string) => {
    const driver = drivers.find(d => d.id === driverId);
    if (driver) {
      setSelectedDriverForCheckpoint(driver);
      setCheckpointModalOpen(true);
    }
  };

  return (
    <aside className="hidden 2xl:flex w-80 flex-col gap-4 border-l border-slate-200/90 bg-white/95 p-4 overflow-y-auto shadow-xs">
      {/* 15-DAY CYCLE SUMMARY */}
      <div className="rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50/70 via-white to-orange-50/40 p-4 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-amber-600" />
            <span className="text-xs font-extrabold uppercase tracking-wider text-amber-900">
              15-Day Cycle 1 (1 - 15 Sep)
            </span>
          </div>
          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-200">
            Day 13/15
          </span>
        </div>

        <p className="mt-2 text-xs text-slate-600 leading-relaxed">
          Standard Limousine rental cycle. Mileage checkpoint verification active.
        </p>

        {/* Mini stats */}
        <div className="mt-3 grid grid-cols-2 gap-2 border-t border-amber-200/60 pt-3 text-center">
          <div className="rounded-xl bg-white p-2 border border-slate-200 shadow-2xs">
            <span className="block text-[10px] font-semibold text-slate-500 uppercase">Active Fleet</span>
            <span className="text-sm font-bold text-slate-900">{activeVehicles} Cars</span>
          </div>
          <div className="rounded-xl bg-white p-2 border border-slate-200 shadow-2xs">
            <span className="block text-[10px] font-semibold text-slate-500 uppercase">In Garage</span>
            <span className="text-sm font-bold text-amber-700">{maintenanceVehicles} Cars</span>
          </div>
        </div>
      </div>

      {/* RECENT ALERTS */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-rose-100 text-rose-600 border border-rose-200">
              <AlertTriangle className="h-3.5 w-3.5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Recent Alerts
            </span>
          </div>
          <button 
            onClick={() => setActiveTab('notifications')}
            className="text-[10px] font-semibold text-amber-700 hover:underline flex items-center gap-0.5"
          >
            View All <ChevronRight className="h-2.5 w-2.5" />
          </button>
        </div>

        <div className="space-y-2">
          {urgentAlerts.length === 0 ? (
            <div className="py-4 text-center rounded-xl bg-slate-50 border border-slate-100">
              <CheckCircle2 className="h-5 w-5 mx-auto mb-1 text-emerald-500" />
              <p className="text-xs font-semibold text-slate-700">All systems normal</p>
              <p className="text-[10px] text-slate-500 mt-0.5">No critical alerts or warnings</p>
            </div>
          ) : (
            urgentAlerts.map((alert) => {
              const severityColor = 
                alert.severity === 'critical' ? 'border-rose-200 bg-rose-50 text-rose-900' :
                alert.severity === 'warning' ? 'border-amber-200 bg-amber-50 text-amber-900' :
                'border-sky-200 bg-sky-50 text-sky-900';

              const dotColor =
                alert.severity === 'critical' ? 'bg-rose-500' :
                alert.severity === 'warning' ? 'bg-amber-500' :
                'bg-sky-500';

              return (
                <div
                  key={alert.id}
                  onClick={() => {
                    if (alert.relatedType === 'driver') setActiveTab('payments');
                    else if (alert.relatedType === 'vehicle') setActiveTab('vehicles');
                    else setActiveTab('notifications');
                  }}
                  className={`rounded-xl border p-2.5 cursor-pointer hover:shadow-xs transition-all ${severityColor}`}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className={`h-1.5 w-1.5 rounded-full ${dotColor}`}></span>
                    <span className="text-[11px] font-bold truncate leading-tight">{alert.title}</span>
                  </div>
                  <p className="text-[10px] text-slate-600 line-clamp-2 leading-relaxed">
                    {alert.message}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* UPCOMING DRIVER PAYMENTS */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-100 text-amber-700 border border-amber-200">
              <Clock className="h-3.5 w-3.5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Upcoming Payments
            </span>
          </div>
          <button 
            onClick={() => setActiveTab('payments')}
            className="text-[10px] font-semibold text-amber-700 hover:underline flex items-center gap-0.5"
          >
            All <ChevronRight className="h-2.5 w-2.5" />
          </button>
        </div>

        <div className="space-y-2">
          {pendingPayments.length === 0 ? (
            <div className="py-4 text-center rounded-xl bg-slate-50 border border-slate-100">
              <CheckCircle2 className="h-5 w-5 mx-auto mb-1 text-emerald-500" />
              <p className="text-xs font-semibold text-slate-700">No overdue payments</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Ready for cycle recordings</p>
            </div>
          ) : (
            pendingPayments.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between rounded-xl bg-slate-50 p-2.5 border border-slate-200 hover:border-slate-300 transition-all"
              >
                <div>
                  <div className="text-xs font-bold text-slate-900">{p.driverName}</div>
                  <div className="text-[10px] text-slate-500 flex items-center gap-1">
                    <span className="font-mono text-amber-700 font-semibold">{p.plateNumber}</span>
                    <span>•</span>
                    <span>Due: QAR {p.outstandingBalance > 0 ? p.outstandingBalance.toLocaleString() : p.amountDue.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleCollect(p.driverId)}
                  className="rounded-lg bg-emerald-600 hover:bg-emerald-700 px-2.5 py-1 text-[10px] font-bold text-white transition-all active:scale-95 shadow-xs"
                >
                  Collect
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* RECENT TRANSACTIONS */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-100 text-blue-700 border border-blue-200">
              <ArrowDownRight className="h-3.5 w-3.5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Recent Transactions
            </span>
          </div>
          <button 
            onClick={() => setActiveTab('finance')}
            className="text-[10px] font-semibold text-amber-700 hover:underline flex items-center gap-0.5"
          >
            Ledger <ChevronRight className="h-2.5 w-2.5" />
          </button>
        </div>

        <div className="space-y-2">
          {recentTxns.length === 0 ? (
            <div className="py-4 text-center rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-xs font-semibold text-slate-700">No transactions recorded yet</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Fresh ledger ready</p>
            </div>
          ) : (
            recentTxns.map((tx) => {
              const isIncome = tx.type === 'income';
              return (
                <div
                  key={tx.id}
                  className="flex items-center justify-between rounded-xl bg-slate-50 p-2.5 border border-slate-200"
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg ${
                      isIncome ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                    }`}>
                      {isIncome ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                    </div>
                    <div className="truncate">
                      <p className="text-[11px] font-bold text-slate-800 truncate">{tx.description || tx.category}</p>
                      <p className="text-[9px] text-slate-500">{tx.date}</p>
                    </div>
                  </div>

                  <div className={`text-xs font-mono font-bold whitespace-nowrap pl-2 ${
                    isIncome ? 'text-emerald-700' : 'text-rose-700'
                  }`}>
                    {isIncome ? '+' : '-'}QAR {tx.amount.toLocaleString()}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </aside>
  );
};

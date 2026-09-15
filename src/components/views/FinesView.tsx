import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Search, 
  Plus, 
  AlertTriangle, 
  CheckCircle2, 
  DollarSign,
  Car,
  User,
  Clock,
  Check
} from 'lucide-react';
import { useErp } from '../../context/ErpContext';
import { LogTrafficViolationModal } from '../modals/LogTrafficViolationModal';

export const FinesView: React.FC = () => {
  const { fines, settleTrafficFine, showToast } = useErp();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'deducted_from_driver' | 'paid_by_company'>('all');
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  const totalFinesAmount = fines.reduce((sum, f) => sum + f.amount, 0);
  const pendingFinesList = fines.filter(f => f.status === 'pending');
  const pendingFinesAmount = pendingFinesList.reduce((sum, f) => sum + f.amount, 0);

  const filteredFines = fines.filter(fine => {
    if (filterStatus !== 'all' && fine.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchPlate = fine.plateNumber.toLowerCase().includes(q);
      const matchDriver = fine.driverName.toLowerCase().includes(q);
      const matchViolation = fine.violation.toLowerCase().includes(q);
      const matchFineNo = fine.fineNumber.toLowerCase().includes(q);
      return matchPlate || matchDriver || matchViolation || matchFineNo;
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900">Qatar MOI Traffic Fines & Violations</h1>
            <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-mono font-bold text-rose-800 border border-rose-200">
              Metrash2 Sync
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Ministry of Interior radar & traffic violations attributed directly to drivers on duty.
          </p>
        </div>

        <button
          onClick={() => setIsLogModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-rose-600 hover:bg-rose-700 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition-all active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span>Log Traffic Violation</span>
        </button>
      </div>

      {/* Summary Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-500 block">Total Fine Liability</span>
          <div className="text-2xl font-black font-mono text-rose-700 mt-1">
            QAR {totalFinesAmount.toLocaleString()}
          </div>
          <span className="text-xs text-slate-500 block mt-1">{fines.length} total logged violations</span>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-amber-800 block">Pending Driver Deduction</span>
          <div className="text-2xl font-black font-mono text-amber-800 mt-1">
            {pendingFinesList.length} Violations
          </div>
          <span className="text-xs text-slate-500 block mt-1">QAR {pendingFinesAmount.toLocaleString()} to settle in cycle</span>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-emerald-700 block">Attribution Status</span>
          <div className="text-2xl font-black font-mono text-emerald-700 mt-1">
            Continuous
          </div>
          <span className="text-xs text-slate-500 block mt-1">Active driver linked to vehicle</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by plate, driver name, violation..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white pl-9 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:border-rose-500 focus:outline-none font-medium"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {(['all', 'pending', 'deducted_from_driver', 'paid_by_company'] as const).map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold whitespace-nowrap transition-all ${
                filterStatus === status
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              {status === 'all' ? 'All Fines' : status.replace(/_/g, ' ').toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {fines.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500 space-y-3">
          <ShieldAlert className="h-10 w-10 text-slate-300 mx-auto" />
          <div className="font-bold text-slate-700 text-base">No traffic fines on record</div>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Log Metrash2 traffic violations to allocate them to the responsible driver and deduct from their 15-day cycle.
          </p>
          <button
            onClick={() => setIsLogModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 transition-colors shadow-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Log First Violation</span>
          </button>
        </div>
      ) : filteredFines.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-xs text-slate-500">
          No violations match the search filter.
        </div>
      ) : (
        /* Violations Table */
        <div className="rounded-3xl border border-slate-200 bg-white p-4 overflow-x-auto shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-100 text-slate-500 uppercase text-[10px] font-bold">
              <tr>
                <th className="pb-3">Reference No</th>
                <th className="pb-3">Date</th>
                <th className="pb-3">Vehicle Plate</th>
                <th className="pb-3">Driver on Duty</th>
                <th className="pb-3">Violation & Location</th>
                <th className="pb-3 text-right">Fine Amount</th>
                <th className="pb-3">Responsibility</th>
                <th className="pb-3 text-center">Status</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredFines.map(fine => {
                const isDriverResponsible = fine.responsiblePerson === 'driver';

                return (
                  <tr key={fine.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 font-mono font-bold text-slate-700">{fine.fineNumber}</td>
                    <td className="py-3 font-mono text-slate-500">{fine.date}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded font-mono font-bold bg-amber-100 text-amber-900 border border-amber-200 text-[10px]">
                        {fine.plateNumber}
                      </span>
                    </td>
                    <td className="py-3 font-bold text-slate-900">{fine.driverName}</td>
                    <td className="py-3">
                      <div className="font-bold text-slate-900">{fine.violation}</div>
                      <span className="text-[10px] text-slate-500">{fine.location}</span>
                    </td>
                    <td className="py-3 text-right font-mono font-extrabold text-rose-600 text-sm">
                      QAR {fine.amount.toLocaleString()}
                    </td>
                    <td className="py-3 capitalize text-slate-700">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${isDriverResponsible ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                        {isDriverResponsible ? 'Driver Account' : 'Company Fleet'}
                      </span>
                    </td>
                    <td className="py-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${
                          fine.status === 'pending'
                            ? 'bg-amber-100 text-amber-800 border-amber-200'
                            : fine.status === 'deducted_from_driver'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                            : 'bg-blue-100 text-blue-800 border-blue-200'
                        }`}
                      >
                        {fine.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      {fine.status === 'pending' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => settleTrafficFine(fine.id, 'driver_next_cycle')}
                            className="rounded-lg bg-amber-100 border border-amber-200 px-2.5 py-1 text-[10px] font-bold text-amber-900 hover:bg-amber-200 transition-colors"
                          >
                            Deduct from Rent
                          </button>
                          <button
                            onClick={() => settleTrafficFine(fine.id, 'company_paid')}
                            className="rounded-lg bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-700 hover:bg-slate-200 transition-colors"
                          >
                            Company Paid
                          </button>
                        </div>
                      ) : (
                        <span className="text-[10px] font-bold text-emerald-700 flex items-center justify-end gap-1">
                          <Check className="h-3 w-3 text-emerald-600" /> Settled
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <LogTrafficViolationModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
      />
    </div>
  );
};

import React, { useState } from 'react';
import { 
  CreditCard, 
  Search, 
  Filter, 
  Sparkles, 
  Printer, 
  CheckCircle2, 
  AlertTriangle, 
  Calendar, 
  Gauge, 
  ArrowUpRight,
  Receipt,
  FileCheck
} from 'lucide-react';
import { useErp } from '../../context/ErpContext';
import { PaymentStatus } from '../../types';

export const PaymentsView: React.FC = () => {
  const { 
    payments, 
    drivers, 
    vehicles, 
    setCheckpointModalOpen, 
    setSelectedReceipt,
    setSelectedDriverForCheckpoint
  } = useErp();

  const [cycleFilter, setCycleFilter] = useState<'all' | 'cycle1' | 'cycle2'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | PaymentStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Calculations for current cycle banner
  const totalDue = payments.reduce((sum, p) => sum + p.amountDue, 0);
  const totalCollected = payments.reduce((sum, p) => sum + p.amountPaid, 0);
  const totalOutstanding = payments.reduce((sum, p) => sum + p.outstandingBalance, 0);
  const totalKmRecorded = payments.reduce((sum, p) => sum + p.kmDriven, 0);

  const filteredPayments = payments.filter(p => {
    if (cycleFilter === 'cycle1' && !p.periodLabel.includes('01 Sep') && !p.periodLabel.includes('Cycle 1')) return false;
    if (cycleFilter === 'cycle2' && !p.periodLabel.includes('16 Sep') && !p.periodLabel.includes('Cycle 2')) return false;
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.receiptNumber.toLowerCase().includes(q) ||
        p.driverName.toLowerCase().includes(q) ||
        p.plateNumber.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const percentCollected = totalDue > 0 ? Math.round((totalCollected / totalDue) * 100) : 100;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900">15-Day Payment & Mileage Checkpoints</h1>
            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-mono font-bold text-amber-800 border border-amber-200">
              Active Cycle: 15-Day Cadence
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Strict 15-day rent collection system tied directly with odometer verification.
          </p>
        </div>

        <button
          onClick={() => {
            const defDriver = drivers.find(d => d.assignedVehicleId) || drivers[0];
            if (defDriver) {
              setSelectedDriverForCheckpoint(defDriver);
            }
            setCheckpointModalOpen(true);
          }}
          className="flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition-all active:scale-95"
        >
          <Sparkles className="h-4 w-4" />
          <span>Record Payment & Checkpoint</span>
        </button>
      </div>

      {/* Cycle Progress Summary Banner */}
      <div className="rounded-3xl border border-slate-200 bg-gradient-to-r from-amber-50/60 via-white to-emerald-50/40 p-6 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-800 font-bold border border-amber-200">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900">
                15-Day Rent Cycle Collection Summary
              </h3>
              <p className="text-xs text-slate-500">
                Odometer verification and receipts generated for active driver agreements.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-xl bg-white border border-slate-200 text-xs font-mono font-bold text-emerald-700 shadow-2xs">
              {totalDue > 0 ? `${percentCollected}% Collected` : 'Fresh Cycle Active'}
            </span>
          </div>
        </div>

        {/* 4 Metrics in Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
          <div className="rounded-2xl bg-white p-3.5 border border-slate-200 shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Total Due</span>
            <div className="text-base font-extrabold font-mono text-slate-900 mt-1">
              QAR {totalDue.toLocaleString()}
            </div>
            <span className="text-[9px] text-slate-400 block mt-0.5">{payments.length} checkpoints recorded</span>
          </div>

          <div className="rounded-2xl bg-white p-3.5 border border-slate-200 shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-emerald-700 block">Total Collected</span>
            <div className="text-base font-extrabold font-mono text-emerald-700 mt-1">
              QAR {totalCollected.toLocaleString()}
            </div>
            <span className="text-[9px] text-slate-400 block mt-0.5">Deposited to QNB & Vault</span>
          </div>

          <div className="rounded-2xl bg-white p-3.5 border border-slate-200 shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-amber-800 block">Pending Outstanding</span>
            <div className="text-base font-extrabold font-mono text-amber-800 mt-1">
              QAR {totalOutstanding.toLocaleString()}
            </div>
            <span className="text-[9px] text-slate-400 block mt-0.5">Due balance</span>
          </div>

          <div className="rounded-2xl bg-white p-3.5 border border-slate-200 shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-blue-700 block">Total KM Recorded</span>
            <div className="text-base font-extrabold font-mono text-blue-700 mt-1">
              {totalKmRecorded.toLocaleString()} KM
            </div>
            <span className="text-[9px] text-slate-400 block mt-0.5">Logged odometer verified</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-1.5 text-xs">
            <button
              onClick={() => setCycleFilter('all')}
              className={`rounded-xl px-3 py-1.5 font-bold transition-all ${
                cycleFilter === 'all' ? 'bg-amber-500 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              All Cycles
            </button>
            <button
              onClick={() => setCycleFilter('cycle1')}
              className={`rounded-xl px-3 py-1.5 font-bold transition-all ${
                cycleFilter === 'cycle1' ? 'bg-amber-500 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              Cycle 1 (01–15th)
            </button>
            <button
              onClick={() => setCycleFilter('cycle2')}
              className={`rounded-xl px-3 py-1.5 font-bold transition-all ${
                cycleFilter === 'cycle2' ? 'bg-amber-500 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              Cycle 2 (16–30th)
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search receipt, driver, plate..."
              className="w-64 rounded-xl border border-slate-300 bg-white pl-9 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:outline-none font-medium"
            />
          </div>
        </div>
      </div>

      {/* Empty State */}
      {payments.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500 space-y-3">
          <CreditCard className="h-10 w-10 text-slate-300 mx-auto" />
          <div className="font-bold text-slate-700 text-base">No payments or checkpoints recorded yet</div>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Record a 15-day rent collection checkpoint to update driver balances and vehicle odometer readings.
          </p>
          <button
            onClick={() => {
              const defDriver = drivers.find(d => d.assignedVehicleId) || drivers[0];
              if (defDriver) {
                setSelectedDriverForCheckpoint(defDriver);
              }
              setCheckpointModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 text-white font-bold text-xs hover:bg-amber-600 transition-colors shadow-xs"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Record First Payment</span>
          </button>
        </div>
      ) : filteredPayments.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-xs text-slate-500">
          No payments match the search criteria.
        </div>
      ) : (
        /* Payments Ledger Table */
        <div className="rounded-3xl border border-slate-200 bg-white p-4 overflow-x-auto shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-100 text-slate-500 uppercase text-[10px] font-bold">
              <tr>
                <th className="pb-3">Receipt No</th>
                <th className="pb-3">Driver Name</th>
                <th className="pb-3">Vehicle & Plate</th>
                <th className="pb-3">Cycle Period</th>
                <th className="pb-3 text-right">Mileage Progress</th>
                <th className="pb-3 text-right">KM Driven</th>
                <th className="pb-3 text-right">Amount Paid</th>
                <th className="pb-3 text-right">Balance</th>
                <th className="pb-3 text-center">Status</th>
                <th className="pb-3 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPayments.map(p => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 font-mono font-bold text-amber-800">{p.receiptNumber}</td>
                  <td className="py-3 font-bold text-slate-900">{p.driverName}</td>
                  <td className="py-3">
                    <div className="text-slate-900 font-medium">{p.vehicleName}</div>
                    <span className="px-1.5 py-0.2 rounded font-mono font-bold bg-amber-100 text-amber-900 border border-amber-200 text-[9px]">
                      {p.plateNumber}
                    </span>
                  </td>
                  <td className="py-3 text-slate-700">{p.periodLabel}</td>
                  <td className="py-3 text-right font-mono text-slate-500">
                    <span>{p.previousMileage.toLocaleString()}</span>
                    <span className="text-slate-400 mx-1">→</span>
                    <strong className="text-slate-900">{p.currentMileage.toLocaleString()} KM</strong>
                  </td>
                  <td className="py-3 text-right font-mono font-bold text-emerald-700">
                    +{p.kmDriven.toLocaleString()} KM
                  </td>
                  <td className="py-3 text-right font-mono font-extrabold text-slate-900">
                    QAR {p.amountPaid.toLocaleString()}
                  </td>
                  <td className="py-3 text-right font-mono">
                    {p.outstandingBalance > 0 ? (
                      <span className="font-bold text-rose-600">QAR {p.outstandingBalance.toLocaleString()}</span>
                    ) : (
                      <span className="text-slate-400 font-medium">QAR 0</span>
                    )}
                  </td>
                  <td className="py-3 text-center">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                      p.status === 'paid'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => setSelectedReceipt(p)}
                      className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-700 hover:bg-slate-200 transition-colors"
                    >
                      <Printer className="h-3 w-3" />
                      <span>Print</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

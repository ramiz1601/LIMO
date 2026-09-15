import React, { useState } from 'react';
import {
  Car,
  Calendar,
  Gauge,
  CheckCircle2,
  AlertTriangle,
  Receipt,
  Phone,
  Clock,
  ShieldCheck,
  ChevronRight,
  ArrowUpRight,
  FileCheck2,
  Sparkles
} from 'lucide-react';
import { useErp } from '../../context/ErpContext';

export const DriverPortalView: React.FC = () => {
  const {
    currentTenant,
    drivers,
    vehicles,
    payments,
    mileageRecords,
    setPaymentCheckpointModal,
    showToast
  } = useErp();

  // Find active driver (e.g. Tariq Mehmood or first active driver)
  const activeDriver = drivers.find((d) => d.status === 'active' && d.assignedVehicleId) || drivers[0];
  const assignedVehicle = vehicles.find((v) => v.id === activeDriver?.assignedVehicleId);

  const driverPayments = payments.filter((p) => p.driverId === activeDriver?.id);
  const driverMileage = mileageRecords.filter((m) => m.driverId === activeDriver?.id);

  const currency = currentTenant.currency || 'QAR';

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Driver Identity Card */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500 font-black text-white text-lg shadow-sm">
              {activeDriver ? activeDriver.fullName.charAt(0) : 'D'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-slate-900">
                  {activeDriver ? activeDriver.fullName : 'Driver Portal'}
                </h1>
                <span className="rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 px-2.5 py-0.5 text-[10px] font-extrabold uppercase">
                  Active Chauffeur
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono">
                QID / ID: {activeDriver?.qid || '784-1988-1234567'} • Mobile: {activeDriver?.mobile || '+974 5512 3456'}
              </p>
              <div className="text-[11px] text-amber-800 font-semibold mt-0.5">
                Affiliated with <strong>{currentTenant.name}</strong>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              if (activeDriver && assignedVehicle) {
                setPaymentCheckpointModal({
                  isOpen: true,
                  driverId: activeDriver.id,
                  vehicleId: assignedVehicle.id
                });
              } else {
                showToast('No assigned vehicle found to submit checkpoint', 'warning');
              }
            }}
            className="flex items-center justify-center gap-2 rounded-2xl bg-amber-500 hover:bg-amber-600 px-5 py-3 text-xs font-black text-white shadow-md shadow-amber-500/20 transition-transform active:scale-95"
          >
            <Gauge className="h-4 w-4" /> Submit 15-Day Checkpoint
          </button>
        </div>
      </div>

      {/* Vehicle & Cycle Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Assigned Limousine */}
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Assigned Vehicle</span>
            <span className="rounded-full bg-slate-100 text-slate-700 px-2 py-0.5 text-[10px] font-mono font-bold">
              {assignedVehicle?.plateNumber || 'LIM 1029'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
              <Car className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                {assignedVehicle ? `${assignedVehicle.make} ${assignedVehicle.model}` : 'Toyota Camry 2.5 GLX'}
              </h3>
              <p className="text-xs text-slate-500">Year {assignedVehicle?.year || 2025} • {assignedVehicle?.color || 'Pearl White'}</p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 border-t border-slate-100 pt-3 text-xs">
            <div>
              <span className="text-slate-400 text-[11px]">Current Verified KM</span>
              <div className="font-mono font-black text-slate-900 text-sm">
                {(assignedVehicle?.currentMileage || 12450).toLocaleString()} KM
              </div>
            </div>
            <div>
              <span className="text-slate-400 text-[11px]">Monthly Rental</span>
              <div className="font-mono font-bold text-slate-800 text-sm">
                {currency} {(activeDriver?.monthlyRent || 4500).toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* 15-Day Cycle Overview */}
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Current 15-Day Cycle</span>
            <span className="rounded-full bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 text-[10px] font-bold">
              Cycle 1 (Day 1 - 15)
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">15-Day Cycle Due Amount:</span>
              <span className="font-mono font-bold text-slate-900">
                {currency} {((activeDriver?.monthlyRent || 4500) / 2).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Total Collected to Date:</span>
              <span className="font-mono font-bold text-emerald-700">
                {currency} {(activeDriver?.totalCollected || 0).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Outstanding Balance:</span>
              <span className="font-mono font-bold text-rose-600">
                {currency} {(activeDriver?.outstandingBalance || 0).toLocaleString()}
              </span>
            </div>
          </div>

          <div className="mt-4 rounded-xl bg-amber-50 border border-amber-200 p-2.5 text-[11px] text-amber-900 flex items-center gap-2">
            <Clock className="h-4 w-4 shrink-0 text-amber-600" />
            <span>Next odometer check and rent payment is scheduled on the 15th.</span>
          </div>
        </div>
      </div>

      {/* Payment History & Mileage Submissions */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
        <h3 className="text-sm font-extrabold text-slate-900 mb-3">Recent Payment & Mileage Receipts</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-100 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="py-2.5 px-3">Receipt / Voucher</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Period</th>
                <th className="py-2.5 px-3">Amount Paid</th>
                <th className="py-2.5 px-3">Odometer Reading</th>
                <th className="py-2.5 px-3">KM Driven</th>
                <th className="py-2.5 px-3">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {driverPayments.slice(0, 5).map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/60">
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-800">{p.voucherNumber}</td>
                  <td className="py-2.5 px-3 text-slate-500">{p.date}</td>
                  <td className="py-2.5 px-3 font-semibold text-slate-700">{p.periodLabel}</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-emerald-700">
                    {currency} {p.amountPaid.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-800">
                    {p.currentMileage.toLocaleString()} KM
                  </td>
                  <td className="py-2.5 px-3 font-mono font-semibold text-slate-700">
                    +{(p.currentMileage - p.previousMileage).toLocaleString()} KM
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.2 text-[9px] font-bold uppercase">
                      <CheckCircle2 className="h-2.5 w-2.5" /> Verified
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Emergency & Operations Contact Box */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white">
            <Phone className="h-4 w-4" />
          </div>
          <div>
            <div className="font-extrabold text-slate-900">{currentTenant.name} Dispatch Hotline</div>
            <div className="text-slate-500 font-mono">{currentTenant.phone} • Emergency Roadside 24/7</div>
          </div>
        </div>

        <a
          href={`tel:${currentTenant.phone}`}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-1.5 font-bold text-slate-700 hover:bg-slate-100 shadow-2xs self-start sm:self-auto"
        >
          Call Dispatch Office <ArrowUpRight className="h-3 w-3" />
        </a>
      </div>
    </div>
  );
};

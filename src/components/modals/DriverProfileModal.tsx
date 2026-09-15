import React, { useState } from 'react';
import { 
  X, 
  User, 
  Phone, 
  CreditCard, 
  Gauge, 
  AlertTriangle, 
  Calendar, 
  ShieldCheck, 
  Car, 
  Award,
  Sparkles
} from 'lucide-react';
import { useErp } from '../../context/ErpContext';

export const DriverProfileModal: React.FC = () => {
  const { 
    selectedDriverProfileId, 
    setSelectedDriverProfileId, 
    drivers, 
    vehicles, 
    payments, 
    mileageRecords, 
    fines,
    setSelectedReceipt,
    setCheckpointModalOpen,
    setSelectedDriverForCheckpoint
  } = useErp();

  const [activeTab, setActiveTab] = useState<'payments' | 'mileage' | 'fines'>('payments');

  if (!selectedDriverProfileId) return null;

  const driver = drivers.find(d => d.id === selectedDriverProfileId);
  if (!driver) return null;

  const assignedVehicle = vehicles.find(v => v.id === driver.assignedVehicleId);
  const driverPayments = payments.filter(p => p.driverId === driver.id);
  const driverMileage = mileageRecords.filter(m => m.driverId === driver.id);
  const driverFines = fines.filter(f => f.driverId === driver.id);

  const handlePayNow = () => {
    setSelectedDriverProfileId(null);
    setSelectedDriverForCheckpoint(driver);
    setCheckpointModalOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500 text-slate-950 font-black text-base shadow-xs">
              {driver.fullName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-slate-900">{driver.fullName}</h2>
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-200 capitalize">
                  {driver.status}
                </span>
                <span className="flex items-center gap-1 text-xs text-amber-700 font-bold">
                  <Award className="h-3.5 w-3.5" /> {driver.rating}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                <span>QID: <strong className="text-slate-800 font-mono">{driver.qid}</strong></span>
                <span>•</span>
                <span>Mobile: <strong className="text-slate-800">{driver.mobile}</strong></span>
                <span>•</span>
                <span>Nationality: <strong className="text-slate-800">{driver.nationality}</strong></span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePayNow}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition-all active:scale-95"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Record Payment</span>
            </button>
            <button
              onClick={() => setSelectedDriverProfileId(null)}
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-800 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Assigned Vehicle & Agreement Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3.5">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Assigned Vehicle</span>
            <div className="text-sm font-bold text-slate-900 mt-1 flex items-center gap-2">
              <Car className="h-4 w-4 text-amber-700" />
              <span>{assignedVehicle ? `${assignedVehicle.make} ${assignedVehicle.model}` : 'Unassigned'}</span>
            </div>
            {assignedVehicle && (
              <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-100 text-amber-800 border border-amber-200">
                {assignedVehicle.plateNumber}
              </span>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3.5">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">15-Day Rent Cycle</span>
            <div className="text-sm font-mono font-bold text-emerald-700 mt-1">
              QAR {(driver.monthlyRent / 2).toLocaleString()} / 15 Days
            </div>
            <span className="text-[10px] text-slate-500 block mt-0.5">
              QAR {driver.monthlyRent.toLocaleString()} monthly
            </span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3.5">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Outstanding Rent</span>
            <div className={`text-sm font-mono font-extrabold mt-1 ${driver.outstandingBalance > 0 ? 'text-amber-700' : 'text-slate-600'}`}>
              QAR {driver.outstandingBalance.toLocaleString()}
            </div>
            <span className="text-[10px] text-slate-500 block mt-0.5">
              Collected to date: QAR {driver.totalCollected.toLocaleString()}
            </span>
          </div>
        </div>

        {/* License and QID Expiry Bar */}
        <div className="rounded-xl bg-slate-50 p-3 border border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs mb-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-amber-600" />
            <span className="text-slate-700">Qatar Driver License: <strong>{driver.drivingLicenseNo}</strong></span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              new Date(driver.drivingLicenseExpiry) <= new Date('2026-09-25')
                ? 'bg-amber-100 text-amber-800 border border-amber-200'
                : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
            }`}>
              Expires: {driver.drivingLicenseExpiry}
            </span>
          </div>
          <div className="text-slate-500 text-[11px]">
            QID Expiry: <strong className="text-slate-800">{driver.qidExpiry}</strong>
          </div>
        </div>

        {/* Subtabs */}
        <div className="flex gap-2 border-b border-slate-200 pb-2 text-xs">
          <button
            onClick={() => setActiveTab('payments')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'payments' ? 'bg-amber-100 text-amber-800 font-black' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Payment History ({driverPayments.length})
          </button>
          <button
            onClick={() => setActiveTab('mileage')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'mileage' ? 'bg-amber-100 text-amber-800 font-black' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Mileage History ({driverMileage.length})
          </button>
          <button
            onClick={() => setActiveTab('fines')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'fines' ? 'bg-amber-100 text-amber-800 font-black' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Traffic Fines ({driverFines.length})
          </button>
        </div>

        {/* Tab content */}
        <div className="pt-3 max-h-64 overflow-y-auto">
          {activeTab === 'payments' && (
            <div className="space-y-2">
              {driverPayments.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400">No payment records yet.</div>
              ) : (
                driverPayments.map(p => (
                  <div key={p.id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    <div>
                      <div className="font-bold text-slate-900 flex items-center gap-2">
                        <span className="text-emerald-700 font-mono font-bold">{p.receiptNumber}</span>
                        <span>{p.periodLabel}</span>
                        <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase ${
                          p.status === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {p.status}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        Paid: QAR {p.amountPaid.toLocaleString()} • KM Driven: {p.kmDriven.toLocaleString()} KM
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedReceipt(p)}
                      className="rounded-lg bg-slate-200 px-2.5 py-1 text-[10px] font-bold text-slate-800 hover:bg-slate-300"
                    >
                      Receipt
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'mileage' && (
            <div className="space-y-2">
              {driverMileage.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400">No mileage checkpoints recorded.</div>
              ) : (
                driverMileage.map(m => (
                  <div key={m.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex justify-between items-center">
                    <div>
                      <div className="font-bold text-slate-900">{m.recordDate} ({m.paymentCycleLabel})</div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                        {m.startingOdometer.toLocaleString()} KM → {m.endingOdometer.toLocaleString()} KM
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-emerald-700 text-sm">+{m.totalKmDriven.toLocaleString()} KM</span>
                      <span className="text-[9px] text-slate-500 block">{m.verificationStatus}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'fines' && (
            <div className="space-y-2">
              {driverFines.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400">No traffic fines on file. Clean record!</div>
              ) : (
                driverFines.map(f => (
                  <div key={f.id} className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs flex justify-between items-center">
                    <div>
                      <div className="font-bold text-rose-800">{f.violation}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{f.location} • {f.date}</div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-rose-700 text-sm">QAR {f.amount.toLocaleString()}</span>
                      <span className="text-[9px] text-slate-500 block capitalize">{f.status.replace(/_/g, ' ')}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

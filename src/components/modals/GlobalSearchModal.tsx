import React, { useState, useEffect } from 'react';
import { 
  Search, 
  X, 
  Car, 
  User, 
  Receipt, 
  FileCheck, 
  ArrowRight,
  Gauge,
  CreditCard
} from 'lucide-react';
import { useErp } from '../../context/ErpContext';

export const GlobalSearchModal: React.FC = () => {
  const { 
    isSearchOpen, 
    setSearchOpen, 
    vehicles, 
    drivers, 
    payments, 
    customers, 
    rentals,
    setSelectedVehicleProfileId,
    setSelectedDriverProfileId,
    setSelectedReceipt,
    setActiveTab
  } = useErp();

  const [query, setQuery] = useState('');

  // Keyboard shortcut listener (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setSearchOpen]);

  if (!isSearchOpen) return null;

  const cleanQuery = query.trim().toLowerCase();

  // Search matches
  const matchedVehicles = cleanQuery
    ? vehicles.filter(
        v =>
          v.plateNumber.toLowerCase().includes(cleanQuery) ||
          v.make.toLowerCase().includes(cleanQuery) ||
          v.model.toLowerCase().includes(cleanQuery) ||
          v.vin.toLowerCase().includes(cleanQuery)
      ).slice(0, 5)
    : [];

  const matchedDrivers = cleanQuery
    ? drivers.filter(
        d =>
          d.fullName.toLowerCase().includes(cleanQuery) ||
          d.qid.includes(cleanQuery) ||
          d.mobile.includes(cleanQuery)
      ).slice(0, 5)
    : [];

  const matchedPayments = cleanQuery
    ? payments.filter(
        p =>
          p.receiptNumber.toLowerCase().includes(cleanQuery) ||
          p.driverName.toLowerCase().includes(cleanQuery) ||
          p.plateNumber.toLowerCase().includes(cleanQuery)
      ).slice(0, 5)
    : [];

  const totalResults = matchedVehicles.length + matchedDrivers.length + matchedPayments.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/60 backdrop-blur-xs pt-20 px-4">
      <div className="relative w-full max-w-xl rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3 border-b border-slate-100 gap-3">
          <Search className="h-4 w-4 text-amber-600 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search plate (e.g. LIM 3344), driver, QID, receipt number..."
            className="flex-1 bg-transparent text-sm text-slate-900 placeholder-slate-400 focus:outline-none font-medium"
          />
          <button
            onClick={() => setSearchOpen(false)}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-800 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {!cleanQuery && (
            <div className="py-8 text-center text-xs text-slate-500">
              Type a plate number like <span className="text-amber-800 font-mono font-bold">"LIM 3344"</span> or driver name like <span className="text-amber-800 font-bold">"Tariq"</span>
            </div>
          )}

          {cleanQuery && totalResults === 0 && (
            <div className="py-8 text-center text-xs text-slate-500">
              No matching records found for "{query}".
            </div>
          )}

          {/* Vehicles Results */}
          {matchedVehicles.length > 0 && (
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-2 block mb-2">
                Vehicles ({matchedVehicles.length})
              </span>
              <div className="space-y-1.5">
                {matchedVehicles.map(v => (
                  <div
                    key={v.id}
                    onClick={() => {
                      setSelectedVehicleProfileId(v.id);
                      setSearchOpen(false);
                    }}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-amber-400 hover:bg-amber-50/50 cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-800 font-mono font-bold text-xs">
                        <Car className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-xs">{v.make} {v.model}</span>
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-amber-100 text-amber-900 border border-amber-200">
                            {v.plateNumber}
                          </span>
                          <span className="text-[10px] text-slate-500 capitalize">({v.plateType})</span>
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-2">
                          <span>Driver: <strong className="text-slate-800">{v.currentDriverName || 'Unassigned'}</strong></span>
                          <span>•</span>
                          <span>Mileage: <strong className="text-slate-800 font-mono">{v.currentMileage.toLocaleString()} KM</strong></span>
                          <span>•</span>
                          <span>Rent: <strong className="text-emerald-700 font-mono">QAR {v.monthlyRent.toLocaleString()}</strong></span>
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Drivers Results */}
          {matchedDrivers.length > 0 && (
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-2 block mb-2">
                Drivers ({matchedDrivers.length})
              </span>
              <div className="space-y-1.5">
                {matchedDrivers.map(d => (
                  <div
                    key={d.id}
                    onClick={() => {
                      setSelectedDriverProfileId(d.id);
                      setSearchOpen(false);
                    }}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-amber-400 hover:bg-amber-50/50 cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-800 font-bold text-xs">
                        <User className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-xs">{d.fullName}</span>
                          <span className="text-[10px] text-slate-500 font-mono">QID: {d.qid}</span>
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-2">
                          <span>Plate: <strong className="text-amber-800 font-mono">{d.assignedVehiclePlate || 'None'}</strong></span>
                          <span>•</span>
                          <span>Balance: <strong className="text-slate-800 font-mono">QAR {d.outstandingBalance.toLocaleString()}</strong></span>
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Payments & Receipts */}
          {matchedPayments.length > 0 && (
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-2 block mb-2">
                Payments & Receipts ({matchedPayments.length})
              </span>
              <div className="space-y-1.5">
                {matchedPayments.map(p => (
                  <div
                    key={p.id}
                    onClick={() => {
                      setSelectedReceipt(p);
                      setSearchOpen(false);
                    }}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50 cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800 font-mono font-bold text-xs">
                        <Receipt className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-emerald-700 text-xs">{p.receiptNumber}</span>
                          <span className="text-xs text-slate-900 font-semibold">{p.driverName}</span>
                          <span className="text-[10px] font-mono text-amber-800">({p.plateNumber})</span>
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-2">
                          <span>Period: {p.periodLabel}</span>
                          <span>•</span>
                          <span>Paid: <strong className="text-emerald-700 font-mono">QAR {p.amountPaid.toLocaleString()}</strong></span>
                          <span>•</span>
                          <span>KM: <strong className="text-slate-800 font-mono">{p.kmDriven.toLocaleString()}</strong></span>
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

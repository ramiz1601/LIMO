import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Car, 
  Phone, 
  CreditCard, 
  AlertTriangle, 
  CheckCircle2, 
  Award,
  Sparkles,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { useErp } from '../../context/ErpContext';
import { Driver } from '../../types';

export const DriversView: React.FC = () => {
  const { 
    drivers, 
    vehicles, 
    setSelectedDriverProfileId, 
    setCheckpointModalOpen, 
    setSelectedDriverForCheckpoint,
    setQuickActionModal 
  } = useErp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'assigned' | 'unassigned' | 'overdue'>('all');

  const filteredDrivers = drivers.filter(d => {
    if (filterType === 'assigned' && !d.assignedVehicleId) return false;
    if (filterType === 'unassigned' && d.assignedVehicleId) return false;
    if (filterType === 'overdue' && d.outstandingBalance <= 0) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = d.fullName.toLowerCase().includes(q);
      const matchQid = d.qid.includes(q);
      const matchMobile = d.mobile.includes(q);
      const matchPlate = d.assignedVehiclePlate?.toLowerCase().includes(q) || false;
      return matchName || matchQid || matchMobile || matchPlate;
    }
    return true;
  });

  const handleOpenCheckpoint = (driver: Driver) => {
    setSelectedDriverForCheckpoint(driver);
    setCheckpointModalOpen(true);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900">Driver Management</h1>
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-mono font-bold text-emerald-800 border border-emerald-200">
              {drivers.length} Drivers
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage 15-day rental accounts, license validity, mileage tracking, and payments.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setQuickActionModal('add_driver')}
            className="flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-amber-600 transition-all active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span>Register New Driver</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-1.5 text-xs">
            {[
              { id: 'all', label: 'All Drivers', count: drivers.length },
              { id: 'assigned', label: 'With Vehicle', count: drivers.filter(d => d.assignedVehicleId).length },
              { id: 'unassigned', label: 'Without Vehicle', count: drivers.filter(d => !d.assignedVehicleId).length },
              { id: 'overdue', label: 'Pending / Overdue Balance', count: drivers.filter(d => d.outstandingBalance > 0).length },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id as any)}
                className={`rounded-xl px-3 py-1.5 font-bold transition-all flex items-center gap-1.5 ${
                  filterType === tab.id
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] rounded-full px-1.5 py-0.2 ${
                  filterType === tab.id ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search driver name, QID, plate..."
              className="w-72 rounded-xl border border-slate-300 bg-white pl-9 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:outline-none font-medium"
            />
          </div>
        </div>
      </div>

      {/* Empty State */}
      {drivers.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500 space-y-3">
          <Users className="h-10 w-10 text-slate-300 mx-auto" />
          <div className="font-bold text-slate-700 text-base">No drivers registered yet</div>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Register your limousine chauffeurs with Qatar ID, driving license, and agreed rent.
          </p>
          <button
            onClick={() => setQuickActionModal('add_driver')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 text-white font-bold text-xs hover:bg-amber-600 transition-colors shadow-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Register First Driver</span>
          </button>
        </div>
      ) : filteredDrivers.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-xs text-slate-500">
          No drivers match the selected filter.
        </div>
      ) : (
        /* Drivers Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDrivers.map(driver => {
            const vehicle = vehicles.find(v => v.id === driver.assignedVehicleId);
            const isLicenseExpiringSoon = new Date(driver.drivingLicenseExpiry) <= new Date('2026-09-25');

            return (
              <div
                key={driver.id}
                className="group relative rounded-3xl border border-slate-200 bg-white p-5 shadow-xs hover:border-amber-300 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Header */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-900 font-black text-sm shadow-2xs">
                        {driver.fullName.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                          <span>{driver.fullName}</span>
                          <span className="flex items-center text-[10px] text-amber-700 font-bold">
                            <Award className="h-3 w-3" /> {driver.rating}
                          </span>
                        </h3>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                          <span>{driver.nationality}</span>
                          <span>•</span>
                          <span className="font-mono text-slate-700">{driver.mobile}</span>
                        </div>
                      </div>
                    </div>

                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-bold text-emerald-800 border border-emerald-200 capitalize">
                      {driver.status}
                    </span>
                  </div>

                  {/* Assigned Vehicle Card */}
                  <div className="rounded-xl bg-slate-50 p-3 border border-slate-200 mb-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] uppercase font-bold text-slate-500 block">
                        Assigned Limousine
                      </span>
                      {vehicle ? (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-100 text-amber-900 border border-amber-200">
                          {vehicle.plateNumber}
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400 italic">None</span>
                      )}
                    </div>
                    <div className="text-xs font-bold text-slate-800 mt-1">
                      {vehicle ? `${vehicle.make} ${vehicle.model}` : 'Unassigned to any vehicle'}
                    </div>
                    {vehicle && (
                      <div className="text-[10px] text-slate-500 mt-1 flex justify-between">
                        <span>Odometer: <strong className="text-slate-800 font-mono">{vehicle.currentMileage.toLocaleString()} KM</strong></span>
                        <span>Cycle: <strong className="text-emerald-700 font-mono">QAR {(driver.monthlyRent / 2).toLocaleString()}</strong></span>
                      </div>
                    )}
                  </div>

                  {/* Financial Summary */}
                  <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                    <div className="rounded-xl bg-slate-50 p-2 border border-slate-200">
                      <span className="text-[10px] text-slate-500 block">Total Rent Collected</span>
                      <div className="font-mono font-bold text-slate-900 text-xs mt-0.5">
                        QAR {driver.totalCollected.toLocaleString()}
                      </div>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-2 border border-slate-200">
                      <span className="text-[10px] text-slate-500 block">Outstanding Balance</span>
                      <div className={`font-mono font-bold text-xs mt-0.5 ${
                        driver.outstandingBalance > 0 ? 'text-amber-700' : 'text-slate-500'
                      }`}>
                        QAR {driver.outstandingBalance.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* License Alert if expiring */}
                  {isLicenseExpiringSoon && (
                    <div className="flex items-center gap-1.5 rounded-lg bg-amber-50 p-2 text-[10px] text-amber-800 border border-amber-200 mb-2">
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                      <span>Driving License expires: {driver.drivingLicenseExpiry}</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => setSelectedDriverProfileId(driver.id)}
                    className="flex-1 rounded-xl bg-slate-100 px-3 py-2 text-center text-xs font-bold text-slate-700 hover:bg-slate-200 hover:text-slate-900 transition-colors"
                  >
                    Driver Profile
                  </button>

                  {driver.assignedVehicleId && (
                    <button
                      onClick={() => handleOpenCheckpoint(driver)}
                      className="flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-3.5 py-2 text-xs font-bold text-white shadow-2xs transition-all active:scale-95"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Pay Rent</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

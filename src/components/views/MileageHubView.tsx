import React, { useState } from 'react';
import { 
  Gauge, 
  Search, 
  Filter, 
  AlertTriangle, 
  CheckCircle2, 
  Camera, 
  Car, 
  User, 
  Calendar, 
  TrendingUp, 
  ShieldCheck, 
  ArrowRight,
  Plus
} from 'lucide-react';
import { useErp } from '../../context/ErpContext';

export const MileageHubView: React.FC = () => {
  const { 
    vehicles, 
    drivers, 
    payments, 
    mileageRecords, 
    settings,
    setCheckpointModalOpen, 
    setSelectedDriverForCheckpoint, 
    setSelectedVehicleProfileId,
    setQuickActionModal
  } = useErp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'high_mileage' | 'verified' | 'unassigned'>('all');

  // Abnormal threshold from settings (default 4000 KM)
  const threshold = settings.abnormalMileageThresholdKm || 4000;

  const totalFleetMileage = vehicles.reduce((sum, v) => sum + v.currentMileage, 0);
  const totalCycleKm = payments.reduce((sum, p) => sum + (p.kmDriven || 0), 0);

  const vehicleMileageList = vehicles.map(v => {
    const lastPayment = payments.find(p => p.vehicleId === v.id);
    const cycleKm = lastPayment ? lastPayment.kmDriven : 0;
    const isAbnormal = cycleKm > threshold;
    const driver = drivers.find(d => d.id === v.currentDriverId);

    return {
      vehicle: v,
      driver,
      cycleKm,
      isAbnormal,
      lastReadingDate: lastPayment?.paymentDate || (lastPayment as any)?.date || lastPayment?.dueDate || (v as any).createdAt || v.purchaseDate || '2026-09-01',
      odometerPhotoUrl: lastPayment?.odometerPhotoUrl
    };
  });

  const filteredList = vehicleMileageList.filter(item => {
    if (filterType === 'high_mileage' && !item.isAbnormal) return false;
    if (filterType === 'verified' && !item.odometerPhotoUrl) return false;
    if (filterType === 'unassigned' && item.vehicle.currentDriverId) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchPlate = item.vehicle.plateNumber.toLowerCase().includes(q);
      const matchMake = item.vehicle.make.toLowerCase().includes(q);
      const matchModel = item.vehicle.model.toLowerCase().includes(q);
      const matchDriver = item.driver?.fullName.toLowerCase().includes(q) || false;
      return matchPlate || matchMake || matchModel || matchDriver;
    }
    return true;
  });

  const handleOpenCheckpoint = (driver: typeof drivers[0]) => {
    setSelectedDriverForCheckpoint(driver);
    setCheckpointModalOpen(true);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900">Mileage & Odometer Hub</h1>
            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-mono font-bold text-amber-800 border border-amber-200">
              15-Day Cycle Tracking
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Enforce strictly continuous odometer records across driver handovers with photo audit records.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-right shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Abnormal Flag Limit</span>
            <span className="text-xs font-mono font-bold text-rose-700">
              &gt; {threshold.toLocaleString()} KM / 15-Days
            </span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-500 block">Total Cumulative Fleet Odometer</span>
          <div className="text-2xl font-black font-mono text-slate-900 mt-1">
            {totalFleetMileage.toLocaleString()} KM
          </div>
          <span className="text-xs text-slate-500 block mt-1">{vehicles.length} Active Limousines</span>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-emerald-700 block">Current Cycle Fleet Usage</span>
          <div className="text-2xl font-black font-mono text-emerald-700 mt-1">
            {totalCycleKm.toLocaleString()} KM
          </div>
          <span className="text-xs text-slate-500 block mt-1">Logged across recent checkpoints</span>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-rose-700 block">Abnormal Distance Alerts</span>
          <div className="text-2xl font-black font-mono text-rose-700 mt-1">
            {vehicleMileageList.filter(v => v.isAbnormal).length} Vehicles
          </div>
          <span className="text-xs text-slate-500 block mt-1">Exceeding cycle threshold</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search plate, driver, make, model..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white pl-9 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:outline-none font-medium"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {(['all', 'high_mileage', 'verified', 'unassigned'] as const).map(t => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold whitespace-nowrap transition-all ${
                filterType === t
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              {t === 'all'
                ? 'All Vehicles'
                : t === 'high_mileage'
                ? 'Abnormal (>4,000 KM)'
                : t === 'verified'
                ? 'Photo Verified'
                : 'Unassigned Fleet'}
            </button>
          ))}
        </div>
      </div>

      {/* Empty state */}
      {vehicles.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500 space-y-3">
          <Gauge className="h-10 w-10 text-slate-300 mx-auto" />
          <div className="font-bold text-slate-700 text-base">No vehicle odometers to track yet</div>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Once vehicles are registered and assigned, continuous odometer progression will be tracked here.
          </p>
          <button
            onClick={() => setQuickActionModal('add_vehicle')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 text-white font-bold text-xs hover:bg-amber-600 transition-colors shadow-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Vehicle</span>
          </button>
        </div>
      ) : filteredList.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-xs text-slate-500">
          No vehicles match the selected filter.
        </div>
      ) : (
        /* Odometer Table */
        <div className="rounded-3xl border border-slate-200 bg-white p-4 overflow-x-auto shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-100 text-slate-500 uppercase text-[10px] font-bold">
              <tr>
                <th className="pb-3">Vehicle Plate</th>
                <th className="pb-3">Model</th>
                <th className="pb-3">Assigned Driver</th>
                <th className="pb-3 text-right">Current Odometer</th>
                <th className="pb-3 text-right">15-Day Cycle KM</th>
                <th className="pb-3 text-center">Photo Audit</th>
                <th className="pb-3 text-center">Continuity Status</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredList.map(({ vehicle, driver, cycleKm, isAbnormal, lastReadingDate, odometerPhotoUrl }) => (
                <tr key={vehicle.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded font-mono font-bold bg-amber-100 text-amber-900 border border-amber-200 text-[10px]">
                      {vehicle.plateNumber}
                    </span>
                  </td>
                  <td className="py-3 font-bold text-slate-900">
                    {vehicle.make} {vehicle.model} ({vehicle.year})
                  </td>
                  <td className="py-3 text-slate-800">
                    {driver ? driver.fullName : <span className="text-slate-400 italic">Unassigned</span>}
                  </td>
                  <td className="py-3 text-right font-mono font-extrabold text-slate-900 text-sm">
                    {vehicle.currentMileage.toLocaleString()} KM
                  </td>
                  <td className="py-3 text-right font-mono font-bold">
                    <span className={isAbnormal ? 'text-rose-600' : 'text-emerald-700'}>
                      {cycleKm > 0 ? `${cycleKm.toLocaleString()} KM` : '—'}
                    </span>
                  </td>
                  <td className="py-3 text-center">
                    {odometerPhotoUrl ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        <Camera className="h-3 w-3" /> Verified
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400 italic">No photo</span>
                    )}
                  </td>
                  <td className="py-3 text-center">
                    {isAbnormal ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-rose-100 text-rose-800 border border-rose-200">
                        <AlertTriangle className="h-3 w-3" /> Abnormal
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">
                        <CheckCircle2 className="h-3 w-3" /> Continuous
                      </span>
                    )}
                  </td>
                  <td className="py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {driver && (
                        <button
                          onClick={() => handleOpenCheckpoint(driver)}
                          className="rounded-lg bg-amber-100 border border-amber-200 px-2.5 py-1 text-[10px] font-bold text-amber-900 hover:bg-amber-200 transition-colors"
                        >
                          Checkpoint
                        </button>
                      )}
                      <button
                        onClick={() => setSelectedVehicleProfileId(vehicle.id)}
                        className="rounded-lg bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-700 hover:bg-slate-200 transition-colors"
                      >
                        History
                      </button>
                    </div>
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

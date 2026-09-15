import React, { useState } from 'react';
import { 
  Car, 
  Search, 
  Filter, 
  Plus, 
  Gauge, 
  User, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight,
  Sparkles,
  LayoutGrid,
  List
} from 'lucide-react';
import { useErp } from '../../context/ErpContext';
import { VehicleStatus, PlateType } from '../../types';

export const VehiclesView: React.FC = () => {
  const { 
    vehicles, 
    drivers,
    setSelectedVehicleProfileId, 
    setCheckpointModalOpen, 
    setSelectedDriverForCheckpoint,
    setQuickActionModal,
    updateVehicleStatus
  } = useErp();

  const [statusFilter, setStatusFilter] = useState<'all' | VehicleStatus>('all');
  const [plateTypeFilter, setPlateTypeFilter] = useState<'all' | PlateType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const filteredVehicles = vehicles.filter(v => {
    if (statusFilter !== 'all' && v.status !== statusFilter) return false;
    if (plateTypeFilter !== 'all' && v.plateType !== plateTypeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchPlate = v.plateNumber.toLowerCase().includes(q);
      const matchMake = v.make.toLowerCase().includes(q);
      const matchModel = v.model.toLowerCase().includes(q);
      const matchDriver = v.currentDriverName?.toLowerCase().includes(q) || false;
      return matchPlate || matchMake || matchModel || matchDriver;
    }
    return true;
  });

  const getStatusBadge = (status: VehicleStatus) => {
    switch (status) {
      case 'assigned':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'available':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'maintenance':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'accident':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const handleRecordPaymentForVehicle = (v: typeof vehicles[0]) => {
    if (v.currentDriverId) {
      const driver = drivers.find(d => d.id === v.currentDriverId);
      if (driver) {
        setSelectedDriverForCheckpoint(driver);
        setCheckpointModalOpen(true);
      }
    } else {
      setSelectedVehicleProfileId(v.id);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900">Fleet Vehicle Management</h1>
            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-mono font-bold text-amber-800 border border-amber-200">
              {vehicles.length} Vehicles
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Track continuous odometer continuity, 15-day rent cycles, drivers, and Qatar Ministry documents.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setQuickActionModal('add_vehicle')}
            className="flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-amber-600 transition-all active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Vehicle</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex flex-wrap gap-1.5 text-xs">
            {[
              { id: 'all', label: 'All Fleet', count: vehicles.length },
              { id: 'assigned', label: 'Assigned', count: vehicles.filter(v => v.status === 'assigned').length },
              { id: 'available', label: 'Available', count: vehicles.filter(v => v.status === 'available').length },
              { id: 'maintenance', label: 'Maintenance', count: vehicles.filter(v => v.status === 'maintenance').length },
              { id: 'accident', label: 'Accident/Inactive', count: vehicles.filter(v => v.status === 'accident' || v.status === 'inactive').length },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id as any)}
                className={`rounded-xl px-3 py-1.5 font-bold transition-all flex items-center gap-1.5 ${
                  statusFilter === tab.id
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] rounded-full px-1.5 py-0.2 ${
                  statusFilter === tab.id ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search & Mode */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search plate (LIM 3344), model, driver..."
                className="w-64 rounded-xl border border-slate-300 bg-white pl-9 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:outline-none font-medium"
              />
            </div>

            {/* View Mode Toggle */}
            <div className="flex rounded-xl bg-slate-100 border border-slate-200 p-0.5">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg ${viewMode === 'grid' ? 'bg-white text-amber-700 shadow-2xs font-bold' : 'text-slate-500'}`}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg ${viewMode === 'table' ? 'bg-white text-amber-700 shadow-2xs font-bold' : 'text-slate-500'}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {vehicles.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500 space-y-3">
          <Car className="h-10 w-10 text-slate-300 mx-auto" />
          <div className="font-bold text-slate-700 text-base">No vehicles in the fleet yet</div>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Get started by registering your limousine fleet cars with Qatar license plates and mileage.
          </p>
          <button
            onClick={() => setQuickActionModal('add_vehicle')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 text-white font-bold text-xs hover:bg-amber-600 transition-colors shadow-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add First Vehicle</span>
          </button>
        </div>
      ) : filteredVehicles.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-xs text-slate-500">
          No vehicles match the selected filter.
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVehicles.map(vehicle => {
            const isInsuranceUrgent = new Date(vehicle.insuranceExpiry) <= new Date('2026-09-20');

            return (
              <div
                key={vehicle.id}
                className="group relative rounded-3xl border border-slate-200 bg-white p-5 shadow-xs hover:border-amber-300 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Card Top */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-800 font-bold border border-amber-200 group-hover:bg-amber-100 transition-colors">
                        <Car className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm">
                          {vehicle.make} {vehicle.model}
                        </h3>
                        <span className="text-[11px] text-slate-500">
                          {vehicle.year} • {vehicle.color}
                        </span>
                      </div>
                    </div>

                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${getStatusBadge(vehicle.status)}`}>
                      {vehicle.status}
                    </span>
                  </div>

                  {/* Plate Number Showcase */}
                  <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3 border border-slate-200 mb-3">
                    <div>
                      <span className="text-[9px] uppercase font-bold text-slate-500 block">
                        Qatar Registration
                      </span>
                      <span className="px-2 py-0.5 rounded text-xs font-mono font-black bg-amber-100 text-amber-900 border border-amber-200 tracking-wider inline-block mt-0.5">
                        {vehicle.plateNumber}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] uppercase font-bold text-slate-500 block">
                        Plate Category
                      </span>
                      <span className="text-xs font-semibold text-slate-700 capitalize">
                        {vehicle.plateType}
                      </span>
                    </div>
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                    <div className="rounded-xl bg-slate-50 p-2 border border-slate-200">
                      <span className="text-[10px] text-slate-500 block">Current Odometer</span>
                      <div className="font-mono font-bold text-slate-900 text-sm mt-0.5 flex items-center gap-1">
                        <Gauge className="h-3.5 w-3.5 text-amber-700" />
                        <span>{vehicle.currentMileage.toLocaleString()} KM</span>
                      </div>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-2 border border-slate-200">
                      <span className="text-[10px] text-slate-500 block">15-Day Rent</span>
                      <div className="font-mono font-bold text-emerald-700 text-sm mt-0.5">
                        QAR {vehicle.rentPer15Days.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Driver Assignment */}
                  <div className="flex items-center justify-between text-xs py-1 px-1 mb-2">
                    <span className="text-slate-500 flex items-center gap-1">
                      <User className="h-3.5 w-3.5" /> Driver:
                    </span>
                    <span className="font-bold text-slate-900">
                      {vehicle.currentDriverName || <span className="text-slate-400 italic font-normal">Unassigned</span>}
                    </span>
                  </div>

                  {/* Expiry Alert If Applicable */}
                  {isInsuranceUrgent && (
                    <div className="flex items-center gap-1.5 rounded-lg bg-rose-50 p-2 text-[10px] text-rose-800 border border-rose-200 mb-2">
                      <AlertTriangle className="h-3.5 w-3.5 text-rose-600 shrink-0" />
                      <span>Insurance expires: {vehicle.insuranceExpiry}</span>
                    </div>
                  )}
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => setSelectedVehicleProfileId(vehicle.id)}
                    className="flex-1 rounded-xl bg-slate-100 px-3 py-2 text-center text-xs font-bold text-slate-700 hover:bg-slate-200 hover:text-slate-900 transition-colors"
                  >
                    Vehicle History
                  </button>

                  {vehicle.status === 'assigned' && (
                    <button
                      onClick={() => handleRecordPaymentForVehicle(vehicle)}
                      className="rounded-xl bg-emerald-600 hover:bg-emerald-700 px-3 py-2 text-xs font-bold text-white transition-colors flex items-center gap-1 shadow-2xs"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Checkpoint</span>
                    </button>
                  )}

                  {vehicle.status === 'available' && (
                    <button
                      onClick={() => setSelectedVehicleProfileId(vehicle.id)}
                      className="rounded-xl bg-amber-100 hover:bg-amber-200 px-3 py-2 text-xs font-bold text-amber-900 border border-amber-200 transition-colors"
                    >
                      Assign Driver
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="rounded-3xl border border-slate-200 bg-white p-4 overflow-x-auto shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-100 text-slate-500 uppercase text-[10px] font-bold">
              <tr>
                <th className="pb-3">Vehicle</th>
                <th className="pb-3">Plate No</th>
                <th className="pb-3">Type</th>
                <th className="pb-3">Driver</th>
                <th className="pb-3 text-right">Odometer</th>
                <th className="pb-3 text-right">Rent / 15-Days</th>
                <th className="pb-3 text-center">Status</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredVehicles.map(vehicle => (
                <tr key={vehicle.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 font-bold text-slate-900">
                    {vehicle.make} {vehicle.model} ({vehicle.year})
                  </td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded font-mono font-bold bg-amber-100 text-amber-900 border border-amber-200 text-[10px]">
                      {vehicle.plateNumber}
                    </span>
                  </td>
                  <td className="py-3 capitalize text-slate-700">{vehicle.plateType}</td>
                  <td className="py-3 text-slate-900 font-medium">
                    {vehicle.currentDriverName || <span className="text-slate-400 italic">Unassigned</span>}
                  </td>
                  <td className="py-3 text-right font-mono text-slate-800 font-medium">
                    {vehicle.currentMileage.toLocaleString()} KM
                  </td>
                  <td className="py-3 text-right font-mono font-bold text-emerald-700">
                    QAR {vehicle.rentPer15Days.toLocaleString()}
                  </td>
                  <td className="py-3 text-center">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${getStatusBadge(vehicle.status)}`}>
                      {vehicle.status}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => setSelectedVehicleProfileId(vehicle.id)}
                      className="rounded-lg bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-800 hover:bg-slate-200 transition-colors"
                    >
                      Profile
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

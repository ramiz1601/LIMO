import React, { useState } from 'react';
import { 
  Wrench, 
  Search, 
  Plus, 
  AlertTriangle, 
  CheckCircle2, 
  Calendar, 
  Gauge, 
  Car, 
  Clock,
  X
} from 'lucide-react';
import { useErp } from '../../context/ErpContext';

export const MaintenanceView: React.FC = () => {
  const { maintenance, vehicles, addMaintenanceRecord, setSelectedVehicleProfileId, showToast } = useErp();

  const [searchQuery, setSearchQuery] = useState('');
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  // Form state
  const [vehicleId, setVehicleId] = useState(vehicles[0]?.id || '');
  const [serviceType, setServiceType] = useState('10,000 KM Periodic Oil & Filter Service');
  const [mileageAtService, setMileageAtService] = useState(86000);
  const [nextServiceKm, setNextServiceKm] = useState(96000);
  const [garage, setGarage] = useState('Woqod Auto Care - Salwa Road');
  const [invoiceNumber, setInvoiceNumber] = useState(`WOQ-${Math.floor(10000 + Math.random() * 90000)}`);
  const [totalCost, setTotalCost] = useState(450);

  const filteredMaintenance = maintenance.filter(m => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        m.plateNumber.toLowerCase().includes(q) ||
        m.serviceType.toLowerCase().includes(q) ||
        m.garage.toLowerCase().includes(q) ||
        m.invoiceNumber.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    const veh = vehicles.find(v => v.id === vehicleId);
    if (!veh) {
      showToast('Please select a vehicle first', 'error');
      return;
    }

    addMaintenanceRecord({
      vehicleId: veh.id,
      plateNumber: veh.plateNumber,
      serviceType,
      date: new Date().toISOString().split('T')[0],
      mileageAtService,
      nextServiceKm,
      garage,
      invoiceNumber,
      totalCost,
      status: 'completed',
      notes: 'Standard authorized garage servicing completed.'
    });

    showToast('Maintenance service logged successfully!', 'success');
    setIsLogModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900">Fleet Maintenance & Garage Services</h1>
            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-mono font-bold text-amber-800 border border-amber-200">
              {maintenance.length} Service Invoices
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Track periodic oil changes, brake pads, tires, and upcoming service mileage countdowns.
          </p>
        </div>

        <button
          onClick={() => {
            if (vehicles.length > 0) {
              const v = vehicles[0];
              setVehicleId(v.id);
              setMileageAtService(v.currentMileage);
              setNextServiceKm(v.currentMileage + 10000);
            }
            setIsLogModalOpen(true);
          }}
          className="flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition-all active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span>Log Garage Service</span>
        </button>
      </div>

      {/* Maintenance Alert Card */}
      <div className="rounded-3xl border border-amber-200 bg-amber-50/60 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-800 border border-amber-200">
            <Wrench className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Periodic 10,000 KM Interval Safety Monitoring</h3>
            <p className="text-xs text-slate-600">
              Continuous mileage monitoring automatically flags vehicles approaching service thresholds.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="px-3 py-1 rounded-xl bg-white text-amber-900 font-mono font-bold text-xs border border-amber-200 shadow-2xs">
            Standard 10,000 KM Interval
          </span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search garage, plate number, invoice..."
            className="w-full rounded-xl border border-slate-300 bg-white pl-9 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:outline-none font-medium"
          />
        </div>
      </div>

      {/* Empty State */}
      {maintenance.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500 space-y-3">
          <Wrench className="h-10 w-10 text-slate-300 mx-auto" />
          <div className="font-bold text-slate-700 text-base">No maintenance records logged yet</div>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Log garage work orders, periodic oil changes, and parts replacements with invoices.
          </p>
          <button
            onClick={() => setIsLogModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 text-white font-bold text-xs hover:bg-amber-600 transition-colors shadow-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Log First Service</span>
          </button>
        </div>
      ) : filteredMaintenance.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-xs text-slate-500">
          No maintenance records match your search.
        </div>
      ) : (
        /* Maintenance Records Table */
        <div className="rounded-3xl border border-slate-200 bg-white p-4 overflow-x-auto shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-100 text-slate-500 uppercase text-[10px] font-bold">
              <tr>
                <th className="pb-3">Date</th>
                <th className="pb-3">Vehicle & Plate</th>
                <th className="pb-3">Service Details</th>
                <th className="pb-3">Garage / Workshop</th>
                <th className="pb-3 text-right">Service KM</th>
                <th className="pb-3 text-right">Next Service KM</th>
                <th className="pb-3 text-right">Invoice Total</th>
                <th className="pb-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMaintenance.map(m => (
                <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 font-mono text-slate-500">{m.date}</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded font-mono font-bold bg-amber-100 text-amber-900 border border-amber-200 text-[10px]">
                      {m.plateNumber}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="font-bold text-slate-900">{m.serviceType}</div>
                    <span className="text-[10px] text-slate-400 font-mono">Inv: {m.invoiceNumber}</span>
                  </td>
                  <td className="py-3 text-slate-700">{m.garage}</td>
                  <td className="py-3 text-right font-mono text-slate-700">
                    {m.mileageAtService.toLocaleString()} KM
                  </td>
                  <td className="py-3 text-right font-mono text-amber-800 font-bold">
                    {m.nextServiceKm.toLocaleString()} KM
                  </td>
                  <td className="py-3 text-right font-mono font-bold text-rose-600">
                    QAR {m.totalCost.toLocaleString()}
                  </td>
                  <td className="py-3 text-center">
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">
                      {m.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Log Modal */}
      {isLogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Log Workshop Service & Maintenance</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Record garage work order and update the next required service mileage.
                </p>
              </div>
              <button
                onClick={() => setIsLogModalOpen(false)}
                className="rounded-xl p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {vehicles.length === 0 && (
              <div className="p-3 mb-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800">
                Please register a vehicle before logging maintenance records.
              </div>
            )}

            <form onSubmit={handleAddService} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Vehicle</label>
                <select
                  value={vehicleId}
                  onChange={e => {
                    setVehicleId(e.target.value);
                    const v = vehicles.find(veh => veh.id === e.target.value);
                    if (v) {
                      setMileageAtService(v.currentMileage);
                      setNextServiceKm(v.currentMileage + 10000);
                    }
                  }}
                  className="w-full bg-white rounded-xl px-3 py-2 text-slate-900 border border-slate-300 focus:border-amber-500 focus:outline-none"
                  required
                >
                  <option value="">-- Choose Vehicle --</option>
                  {vehicles.map(v => (
                    <option key={v.id} value={v.id}>
                      {v.make} {v.model} ({v.plateNumber}) • {v.currentMileage.toLocaleString()} KM
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Service Type</label>
                <input
                  type="text"
                  value={serviceType}
                  onChange={e => setServiceType(e.target.value)}
                  className="w-full bg-white rounded-xl px-3 py-2 text-slate-900 border border-slate-300 focus:border-amber-500 focus:outline-none font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Mileage at Service (KM)</label>
                  <input
                    type="number"
                    value={mileageAtService}
                    onChange={e => setMileageAtService(Number(e.target.value))}
                    className="w-full bg-white rounded-xl px-3 py-2 font-mono text-slate-900 border border-slate-300 focus:border-amber-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Next Service KM</label>
                  <input
                    type="number"
                    value={nextServiceKm}
                    onChange={e => setNextServiceKm(Number(e.target.value))}
                    className="w-full bg-white rounded-xl px-3 py-2 font-mono font-bold text-amber-800 border border-slate-300 focus:border-amber-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Garage / Workshop Name</label>
                  <input
                    type="text"
                    value={garage}
                    onChange={e => setGarage(e.target.value)}
                    className="w-full bg-white rounded-xl px-3 py-2 text-slate-900 border border-slate-300 focus:border-amber-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Invoice Total (QAR)</label>
                  <input
                    type="number"
                    value={totalCost}
                    onChange={e => setTotalCost(Number(e.target.value))}
                    className="w-full bg-white rounded-xl px-3 py-2 font-mono font-bold text-rose-600 border border-slate-300 focus:border-amber-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsLogModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={vehicles.length === 0}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold disabled:opacity-50"
                >
                  Save Maintenance Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

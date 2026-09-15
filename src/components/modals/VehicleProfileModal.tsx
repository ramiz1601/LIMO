import React, { useState } from 'react';
import { 
  X, 
  Car, 
  User, 
  Gauge, 
  History, 
  Wrench, 
  Receipt, 
  TrendingUp, 
  Calendar, 
  ShieldCheck, 
  FileText,
  AlertCircle
} from 'lucide-react';
import { useErp } from '../../context/ErpContext';

export const VehicleProfileModal: React.FC = () => {
  const { 
    selectedVehicleProfileId, 
    setSelectedVehicleProfileId, 
    vehicles, 
    assignments, 
    mileageRecords, 
    payments, 
    maintenance, 
    expenses,
    setSelectedReceipt
  } = useErp();

  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'drivers' | 'mileage' | 'payments' | 'maintenance' | 'profitability'>('overview');

  if (!selectedVehicleProfileId) return null;

  const vehicle = vehicles.find(v => v.id === selectedVehicleProfileId);
  if (!vehicle) return null;

  // Filter linked data
  const vehicleAssignments = assignments.filter(a => a.vehicleId === vehicle.id);
  const vehicleMileage = mileageRecords.filter(m => m.vehicleId === vehicle.id);
  const vehiclePayments = payments.filter(p => p.vehicleId === vehicle.id);
  const vehicleMaintenance = maintenance.filter(m => m.vehicleId === vehicle.id);
  const vehicleExpenses = expenses.filter(e => e.vehicleId === vehicle.id);

  // Vehicle Profitability calculations
  const totalRevenue = vehiclePayments.reduce((acc, p) => acc + p.amountPaid, 0);
  const maintenanceCost = vehicleMaintenance.reduce((acc, m) => acc + m.totalCost, 0);
  const directExpenseCost = vehicleExpenses.reduce((acc, e) => acc + e.amount, 0);
  const totalVehicleExpenses = maintenanceCost + directExpenseCost;
  const netContribution = totalRevenue - totalVehicleExpenses;

  const getStatusBadge = (status: string) => {
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95">
        {/* Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-800 font-bold border border-amber-200">
              <Car className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-slate-900">
                  {vehicle.make} {vehicle.model}
                </h2>
                <span className="text-xs text-slate-500 font-medium">({vehicle.year})</span>
                <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${getStatusBadge(vehicle.status)}`}>
                  {vehicle.status}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-amber-100 text-amber-900 border border-amber-200">
                  {vehicle.plateNumber}
                </span>
                <span className="text-xs text-slate-500 capitalize">
                  {vehicle.plateType} Plate • {vehicle.color}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Metrics Header */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Current Odometer</span>
              <span className="text-base font-extrabold font-mono text-slate-900">
                {vehicle.currentMileage.toLocaleString()} KM
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Current Driver</span>
              <span className="text-sm font-bold text-amber-800">
                {vehicle.currentDriverName || 'Available / None'}
              </span>
            </div>
            <button
              onClick={() => setSelectedVehicleProfileId(null)}
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-800 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 overflow-x-auto border-b border-slate-100 py-3 text-xs">
          {[
            { id: 'overview', label: 'Overview & Documents', icon: FileText },
            { id: 'drivers', label: 'Driver Handover History', icon: History },
            { id: 'mileage', label: 'Mileage Timeline', icon: Gauge },
            { id: 'payments', label: 'Rent Payments', icon: Receipt },
            { id: 'maintenance', label: 'Maintenance Records', icon: Wrench },
            { id: 'profitability', label: 'Vehicle Profitability', icon: TrendingUp },
          ].map(tab => {
            const Icon = tab.icon;
            const active = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`flex items-center gap-1.5 whitespace-nowrap rounded-xl px-3.5 py-2 font-bold transition-all ${
                  active
                    ? 'bg-amber-100 text-amber-800 border border-amber-200 font-black'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Contents */}
        <div className="pt-4 min-h-[320px]">
          {/* 1. OVERVIEW */}
          {activeSubTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Vehicle Specifications
                </h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[10px]">VIN (Chassis No)</span>
                    <span className="font-mono text-slate-800 font-bold">{vehicle.vin}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Fuel / Powertrain</span>
                    <span className="capitalize font-bold text-slate-800">{vehicle.fuelType}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Monthly Agreed Rent</span>
                    <span className="font-mono font-bold text-emerald-700">QAR {vehicle.monthlyRent.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">15-Day Cycle Rent</span>
                    <span className="font-mono font-bold text-emerald-700">QAR {vehicle.rentPer15Days.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Purchase Date</span>
                    <span className="text-slate-800">{vehicle.purchaseDate}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Asset Purchase Value</span>
                    <span className="font-mono text-slate-800">QAR {vehicle.purchasePrice.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Official Qatar Documents Expiry Status */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Official Qatar Ministry Documents
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                    <div>
                      <div className="font-bold text-slate-800">Vehicle Istimara (Registration)</div>
                      <span className="text-[10px] text-slate-500">Expires: {vehicle.registrationExpiry}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      Valid
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                    <div>
                      <div className="font-bold text-slate-800">Comprehensive Insurance</div>
                      <span className="text-[10px] text-slate-500">Expires: {vehicle.insuranceExpiry}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      Valid
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                    <div>
                      <div className="font-bold text-slate-800">Limousine Transport Operating Card</div>
                      <span className="text-[10px] text-slate-500">Expires: {vehicle.operatingCardExpiry}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      Valid
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. DRIVER HISTORY */}
          {activeSubTab === 'drivers' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Continuous driver assignment history. New driver start mileage matches previous driver end mileage.
                </span>
                <span className="text-xs text-amber-800 font-bold font-mono">Continuous Chain</span>
              </div>

              {vehicleAssignments.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl border border-slate-200">
                  No driver assignments on record for this vehicle yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {vehicleAssignments.map((asg) => (
                    <div key={asg.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900">{asg.driverName}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            asg.status === 'active' 
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                              : 'bg-slate-200 text-slate-700'
                          }`}>
                            {asg.status === 'active' ? 'Current Active Driver' : 'Completed Assignment'}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500">
                          {asg.startDate} {asg.endDate ? `→ ${asg.endDate}` : '(Ongoing)'}
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3 mt-3 pt-3 border-t border-slate-200 text-xs">
                        <div>
                          <span className="text-[10px] text-slate-500 block">Start Odometer</span>
                          <span className="font-mono font-bold text-slate-900">
                            {asg.startingMileage.toLocaleString()} KM
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 block">End Odometer</span>
                          <span className="font-mono font-bold text-slate-900">
                            {asg.endingMileage ? `${asg.endingMileage.toLocaleString()} KM` : 'In Progress'}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 block">Total KM Driven</span>
                          <span className="font-mono font-bold text-emerald-700">
                            {asg.totalKmDriven ? `${asg.totalKmDriven.toLocaleString()} KM` : 'Active'}
                          </span>
                        </div>
                      </div>

                      {asg.handoverCondition && (
                        <div className="mt-2 text-[11px] text-slate-500">
                          Handover Notes: <span className="text-slate-800">{asg.handoverCondition}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 3. MILEAGE TIMELINE */}
          {activeSubTab === 'mileage' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-slate-900">
                  Odometer Verification Log ({vehicle.plateNumber})
                </div>
                <div className="text-xs text-amber-800 font-bold font-mono">
                  Current: {vehicle.currentMileage.toLocaleString()} KM
                </div>
              </div>

              {vehicleMileage.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl border border-slate-200">
                  No mileage checkpoint records logged yet for this vehicle.
                </div>
              ) : (
                <div className="space-y-2">
                  {vehicleMileage.map((mil) => (
                    <div
                      key={mil.id}
                      className="flex flex-wrap items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                    >
                      <div>
                        <div className="font-bold text-slate-900 flex items-center gap-2">
                          <span>{mil.recordDate}</span>
                          <span className="text-[10px] font-normal text-slate-500">({mil.paymentCycleLabel})</span>
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800">
                            {mil.verificationStatus}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-500 mt-1">
                          Driver: <strong className="text-slate-800">{mil.driverName}</strong> • Recorded by: {mil.recordedBy}
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-right">
                        <div>
                          <span className="text-[10px] text-slate-500 block">Odometer Progression</span>
                          <span className="font-mono text-slate-700">
                            {mil.startingOdometer.toLocaleString()} → <strong className="text-amber-800">{mil.endingOdometer.toLocaleString()} KM</strong>
                          </span>
                        </div>
                        <div className="rounded-lg bg-emerald-100 px-2.5 py-1 text-emerald-800 font-mono font-bold">
                          +{mil.totalKmDriven.toLocaleString()} KM
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 4. PAYMENTS */}
          {activeSubTab === 'payments' && (
            <div className="space-y-3">
              {vehiclePayments.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl border border-slate-200">
                  No payment records found for this vehicle.
                </div>
              ) : (
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white">
                  {vehiclePayments.map(p => (
                    <div key={p.id} className="p-3 bg-white hover:bg-slate-50 flex items-center justify-between text-xs transition-colors">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-emerald-700">{p.receiptNumber}</span>
                          <span className="text-slate-900 font-bold">{p.driverName}</span>
                          <span className="text-[10px] text-slate-500">({p.periodLabel})</span>
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          Paid: QAR {p.amountPaid.toLocaleString()} • Outstanding: QAR {p.outstandingBalance.toLocaleString()} • KM: {p.kmDriven.toLocaleString()} KM
                        </div>
                      </div>

                      <button
                        onClick={() => setSelectedReceipt(p)}
                        className="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-800 hover:bg-slate-200 transition-colors"
                      >
                        View Receipt
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 5. MAINTENANCE */}
          {activeSubTab === 'maintenance' && (
            <div className="space-y-3">
              {vehicleMaintenance.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl border border-slate-200">
                  No maintenance records logged for this vehicle.
                </div>
              ) : (
                <div className="space-y-2">
                  {vehicleMaintenance.map(m => (
                    <div key={m.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex justify-between items-center">
                      <div>
                        <div className="font-bold text-slate-900">{m.serviceType}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          Date: {m.date} • Garage: {m.garage} • Invoice: {m.invoiceNumber}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          Service at {m.mileageAtService.toLocaleString()} KM • Next: {m.nextServiceKm.toLocaleString()} KM
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-rose-600 text-sm">
                          QAR {m.totalCost.toLocaleString()}
                        </span>
                        <span className="text-[9px] text-slate-500 block capitalize">{m.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 6. VEHICLE PROFITABILITY */}
          {activeSubTab === 'profitability' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4">
                  <span className="text-[10px] uppercase font-bold text-emerald-800 block">Total Revenue</span>
                  <div className="text-xl font-extrabold font-mono text-emerald-700 mt-1">
                    QAR {totalRevenue.toLocaleString()}
                  </div>
                  <span className="text-[10px] text-slate-500 block mt-1">From driver rents & rentals</span>
                </div>

                <div className="rounded-2xl border border-rose-200 bg-rose-50/60 p-4">
                  <span className="text-[10px] uppercase font-bold text-rose-800 block">Vehicle Expenses</span>
                  <div className="text-xl font-extrabold font-mono text-rose-600 mt-1">
                    QAR {totalVehicleExpenses.toLocaleString()}
                  </div>
                  <span className="text-[10px] text-slate-500 block mt-1">Maintenance & direct costs</span>
                </div>

                <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4">
                  <span className="text-[10px] uppercase font-bold text-amber-900 block">Net Contribution</span>
                  <div className="text-xl font-extrabold font-mono text-amber-800 mt-1">
                    QAR {netContribution.toLocaleString()}
                  </div>
                  <span className="text-[10px] text-slate-500 block mt-1">Net profit generated by vehicle</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

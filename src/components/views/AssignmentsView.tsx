import React, { useState } from 'react';
import { 
  KeyRound, 
  Car, 
  User, 
  Gauge, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Plus, 
  AlertCircle,
  FileText,
  X
} from 'lucide-react';
import { useErp } from '../../context/ErpContext';

export const AssignmentsView: React.FC = () => {
  const { 
    assignments, 
    vehicles, 
    drivers, 
    assignVehicleToDriver, 
    closeVehicleAssignment,
    setSelectedVehicleProfileId,
    showToast
  } = useErp();

  const [isNewAssignmentOpen, setIsNewAssignmentOpen] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const [selectedDriverId, setSelectedDriverId] = useState('');
  const [monthlyRent, setMonthlyRent] = useState(4500);
  const [handoverCondition, setHandoverCondition] = useState('Clean interior, full tank fuel, spare tire & jack inspected.');

  // Handover close modal state
  const [closingAssignmentId, setClosingAssignmentId] = useState<string | null>(null);
  const [returnOdometer, setReturnOdometer] = useState<number>(0);
  const [returnCondition, setReturnCondition] = useState('Returned clean, no exterior scratches.');

  const activeAssignments = assignments.filter(a => a.status === 'active');
  const pastAssignments = assignments.filter(a => a.status === 'completed');

  // Available vehicles
  const availableVehicles = vehicles.filter(v => v.status === 'available');
  // Available drivers
  const unassignedDrivers = drivers.filter(d => !d.assignedVehicleId);

  const handleStartAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVehicleId || !selectedDriverId) return;

    const res = assignVehicleToDriver({
      vehicleId: selectedVehicleId,
      driverId: selectedDriverId,
      monthlyRent,
      startDate: new Date().toISOString().split('T')[0],
      notes: handoverCondition
    });

    if (res.success) {
      showToast('Vehicle assigned successfully with verified continuous odometer!', 'success');
      setIsNewAssignmentOpen(false);
      setSelectedVehicleId('');
      setSelectedDriverId('');
    } else {
      showToast(res.error || 'Failed to assign vehicle', 'error');
    }
  };

  const handleCompleteReturn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!closingAssignmentId) return;

    const res = closeVehicleAssignment({
      assignmentId: closingAssignmentId,
      endDate: new Date().toISOString().split('T')[0],
      endingMileage: returnOdometer,
      handoverCondition: returnCondition
    });

    if (res.success) {
      showToast('Vehicle handover completed & return odometer logged!', 'success');
      setClosingAssignmentId(null);
    } else {
      showToast(res.error || 'Failed to close assignment', 'error');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900">Vehicle Assignments & Handover</h1>
            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-mono font-bold text-amber-800 border border-amber-200">
              {activeAssignments.length} Active Contracts
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Continuous odometer tracking: A new driver begins at the exact mileage the previous driver returned.
          </p>
        </div>

        <button
          onClick={() => setIsNewAssignmentOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-amber-600 transition-all active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span>New Vehicle Handover</span>
        </button>
      </div>

      {/* New Handover Modal */}
      {isNewAssignmentOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">New Driver Vehicle Handover</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Starting odometer locks to the vehicle's last recorded mileage.
                </p>
              </div>
              <button
                onClick={() => setIsNewAssignmentOpen(false)}
                className="rounded-xl p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {availableVehicles.length === 0 && (
              <div className="p-3 mb-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 font-medium">
                No vehicles are currently marked as "Available". Please register a vehicle or return an active one first.
              </div>
            )}

            {unassignedDrivers.length === 0 && (
              <div className="p-3 mb-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 font-medium">
                No drivers are currently available for assignment. All drivers have active cars assigned.
              </div>
            )}

            <form onSubmit={handleStartAssignment} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Select Available Vehicle</label>
                <select
                  value={selectedVehicleId}
                  onChange={(e) => {
                    setSelectedVehicleId(e.target.value);
                    const v = vehicles.find(veh => veh.id === e.target.value);
                    if (v) setMonthlyRent(v.monthlyRent);
                  }}
                  className="w-full bg-white rounded-xl px-3 py-2 text-slate-900 border border-slate-300 focus:border-amber-500 focus:outline-none"
                  required
                >
                  <option value="">-- Choose Vehicle --</option>
                  {availableVehicles.map(v => (
                    <option key={v.id} value={v.id}>
                      {v.make} {v.model} ({v.plateNumber}) • {v.currentMileage.toLocaleString()} KM
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Select Driver</label>
                <select
                  value={selectedDriverId}
                  onChange={(e) => setSelectedDriverId(e.target.value)}
                  className="w-full bg-white rounded-xl px-3 py-2 text-slate-900 border border-slate-300 focus:border-amber-500 focus:outline-none"
                  required
                >
                  <option value="">-- Choose Driver --</option>
                  {unassignedDrivers.map(d => (
                    <option key={d.id} value={d.id}>
                      {d.fullName} (QID: {d.qid})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Monthly Rent (QAR)</label>
                  <input
                    type="number"
                    value={monthlyRent}
                    onChange={(e) => setMonthlyRent(Number(e.target.value))}
                    className="w-full bg-white rounded-xl px-3 py-2 font-mono font-bold text-emerald-700 border border-slate-300 focus:border-amber-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">15-Day Cycle (QAR)</label>
                  <div className="w-full bg-slate-50 rounded-xl px-3 py-2 font-mono font-bold text-slate-700 border border-slate-200">
                    QAR {(monthlyRent / 2).toLocaleString()}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Handover Condition & Remarks</label>
                <textarea
                  value={handoverCondition}
                  onChange={(e) => setHandoverCondition(e.target.value)}
                  rows={3}
                  className="w-full bg-white rounded-xl p-2.5 text-slate-900 border border-slate-300 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewAssignmentOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 font-bold text-slate-600 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={availableVehicles.length === 0 || unassignedDrivers.length === 0}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold disabled:opacity-50"
                >
                  Confirm Handover & Lock Starting Mileage
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Return Assignment Modal */}
      {closingAssignmentId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900 mb-1">Close Assignment & Return Vehicle</h3>
            <p className="text-xs text-slate-500 mb-4">
              Enter final odometer reading. This reading will update the vehicle's current mileage and lock in total KM driven.
            </p>

            <form onSubmit={handleCompleteReturn} className="space-y-4 text-xs">
              <div>
                <label className="block text-amber-800 font-bold mb-1">Final Return Odometer (KM) *</label>
                <input
                  type="number"
                  value={returnOdometer || ''}
                  onChange={(e) => setReturnOdometer(Number(e.target.value))}
                  placeholder="e.g. 88500"
                  className="w-full bg-white rounded-xl px-3 py-2 font-mono font-bold text-slate-900 border border-slate-300 focus:border-amber-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Return Inspection Condition</label>
                <textarea
                  value={returnCondition}
                  onChange={(e) => setReturnCondition(e.target.value)}
                  rows={3}
                  className="w-full bg-white rounded-xl p-2.5 text-slate-900 border border-slate-300 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setClosingAssignmentId(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  Finalize Return
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Active Assignments Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600">
          Active Driver Handover Assignments ({activeAssignments.length})
        </h3>

        {activeAssignments.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500 space-y-3">
            <KeyRound className="h-10 w-10 text-slate-300 mx-auto" />
            <div className="font-bold text-slate-700">No active vehicle assignments</div>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Assign a vehicle to a registered driver to begin tracking 15-day rental cycles and odometer readings.
            </p>
            <button
              onClick={() => setIsNewAssignmentOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 text-white font-bold text-xs"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Create First Handover</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeAssignments.map(asg => {
              const vehicle = vehicles.find(v => v.id === asg.vehicleId);
              const currentKm = vehicle ? vehicle.currentMileage : asg.startingMileage;
              const kmDrivenSoFar = currentKm - asg.startingMileage;

              return (
                <div
                  key={asg.id}
                  className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">
                          Assigned Limousine
                        </span>
                        <h4 className="text-base font-bold text-slate-900">{asg.vehicleName}</h4>
                        <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-amber-100 text-amber-900 border border-amber-200 inline-block mt-1">
                          {asg.plateNumber}
                        </span>
                      </div>

                      <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[9px] font-bold uppercase text-emerald-800 border border-emerald-200">
                        Active
                      </span>
                    </div>

                    {/* Driver & Agreement */}
                    <div className="rounded-xl bg-slate-50 p-3 border border-slate-200 mb-3 text-xs">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-slate-500">Driver</span>
                        <span className="font-bold text-slate-900">{asg.driverName}</span>
                      </div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-slate-500">Handover Date</span>
                        <span className="text-slate-800">{asg.startDate}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Agreed Rent</span>
                        <span className="font-mono font-bold text-emerald-700">
                          QAR {asg.monthlyRent.toLocaleString()} / mo (QAR {(asg.monthlyRent / 2).toLocaleString()} per 15-days)
                        </span>
                      </div>
                    </div>

                    {/* Mileage Continuity Box */}
                    <div className="grid grid-cols-3 gap-2 rounded-xl bg-slate-50 p-2.5 border border-slate-200 text-xs mb-3">
                      <div>
                        <span className="text-[9px] text-slate-500 block uppercase font-bold">Start Odometer</span>
                        <span className="font-mono font-bold text-slate-900 text-xs">
                          {asg.startingMileage.toLocaleString()} KM
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-500 block uppercase font-bold">Current Odometer</span>
                        <span className="font-mono font-bold text-amber-800 text-xs">
                          {currentKm.toLocaleString()} KM
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-500 block uppercase font-bold">Driven by Driver</span>
                        <span className="font-mono font-bold text-emerald-700 text-xs">
                          +{kmDrivenSoFar.toLocaleString()} KM
                        </span>
                      </div>
                    </div>

                    {asg.handoverCondition && (
                      <div className="text-[11px] text-slate-500 italic mb-3">
                        "{asg.handoverCondition}"
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setSelectedVehicleProfileId(asg.vehicleId)}
                      className="text-xs font-bold text-amber-800 hover:underline"
                    >
                      Vehicle History
                    </button>

                    <button
                      onClick={() => {
                        setClosingAssignmentId(asg.id);
                        setReturnOdometer(currentKm + 500);
                      }}
                      className="rounded-xl bg-slate-100 hover:bg-slate-200 px-3 py-1.5 text-xs font-bold text-slate-800 transition-colors"
                    >
                      Close Assignment / Return
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Completed Handover History */}
      <div className="pt-4 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600">
          Handover History & Past Returns ({pastAssignments.length})
        </h3>

        {pastAssignments.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-xs text-slate-400">
            No completed handovers recorded yet.
          </div>
        ) : (
          <div className="rounded-3xl border border-slate-200 bg-white p-4 overflow-x-auto shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-100 text-slate-500 uppercase text-[10px] font-bold">
                <tr>
                  <th className="pb-3">Vehicle</th>
                  <th className="pb-3">Plate</th>
                  <th className="pb-3">Driver</th>
                  <th className="pb-3">Period</th>
                  <th className="pb-3 text-right">Start KM</th>
                  <th className="pb-3 text-right">Return KM</th>
                  <th className="pb-3 text-right">Total KM Driven</th>
                  <th className="pb-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pastAssignments.map(asg => (
                  <tr key={asg.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 font-bold text-slate-900">{asg.vehicleName}</td>
                    <td className="py-3">
                      <span className="px-1.5 py-0.2 rounded font-mono font-bold bg-amber-100 text-amber-900 border border-amber-200 text-[9px]">
                        {asg.plateNumber}
                      </span>
                    </td>
                    <td className="py-3 text-slate-800">{asg.driverName}</td>
                    <td className="py-3 text-slate-500">{asg.startDate} → {asg.endDate}</td>
                    <td className="py-3 text-right font-mono text-slate-700">{asg.startingMileage.toLocaleString()} KM</td>
                    <td className="py-3 text-right font-mono text-slate-700">{asg.endingMileage?.toLocaleString()} KM</td>
                    <td className="py-3 text-right font-mono font-bold text-emerald-700">
                      +{asg.totalKmDriven?.toLocaleString()} KM
                    </td>
                    <td className="py-3 text-center">
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-slate-100 text-slate-600">
                        Returned
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { ShieldAlert, X, Car, User, Calendar, MapPin, DollarSign } from 'lucide-react';
import { useErp } from '../../context/ErpContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const COMMON_VIOLATIONS = [
  { title: 'Radar Speeding (+10 to 20 km/h)', amount: 500 },
  { title: 'Radar Speeding (+20 to 30 km/h)', amount: 700 },
  { title: 'Red Light Signal Violation', amount: 6000 },
  { title: 'Mobile Phone Use While Driving', amount: 500 },
  { title: 'Illegal Parking / Obstructing Traffic', amount: 300 },
  { title: 'Yellow Box Junction Blocking', amount: 500 },
  { title: 'Driving Without Seatbelt', amount: 500 }
];

export const LogTrafficViolationModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { vehicles, drivers, addTrafficFine, showToast } = useErp();

  const [vehicleId, setVehicleId] = useState(vehicles[0]?.id || '');
  const [driverId, setDriverId] = useState('');
  const [violation, setViolation] = useState(COMMON_VIOLATIONS[0].title);
  const [amount, setAmount] = useState(COMMON_VIOLATIONS[0].amount);
  const [location, setLocation] = useState('Corniche Road, Doha');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [fineNumber, setFineNumber] = useState(`MOI-QA-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`);
  const [responsiblePerson, setResponsiblePerson] = useState<'driver' | 'company'>('driver');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const selectedVeh = vehicles.find(v => v.id === vehicleId);

  // Auto set driver when vehicle selected
  const handleVehicleChange = (vId: string) => {
    setVehicleId(vId);
    const v = vehicles.find(item => item.id === vId);
    if (v?.currentDriverId) {
      setDriverId(v.currentDriverId);
    }
  };

  const handleViolationSelect = (vTitle: string) => {
    setViolation(vTitle);
    const found = COMMON_VIOLATIONS.find(c => c.title === vTitle);
    if (found) {
      setAmount(found.amount);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const veh = vehicles.find(v => v.id === vehicleId);
    const drv = drivers.find(d => d.id === (driverId || veh?.currentDriverId));

    addTrafficFine({
      fineNumber,
      vehicleId,
      plateNumber: veh ? veh.plateNumber : 'UNKNOWN',
      driverId: drv ? drv.id : 'drv-none',
      driverName: drv ? drv.fullName : 'Fleet Garage (Unassigned)',
      date,
      violation,
      location,
      amount: Number(amount),
      status: 'pending',
      responsiblePerson,
      notes
    });

    showToast(`Traffic violation ${fineNumber} registered`, 'warning');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-100 text-rose-700 border border-rose-200">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Log MOI Traffic Fine</h2>
              <p className="text-xs text-slate-500">Metrash2 Violation Registration & Driver Attribution</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {vehicles.length === 0 ? (
          <div className="py-8 text-center space-y-3 text-xs text-slate-500">
            <p>No vehicles registered in fleet yet.</p>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-amber-500 text-white font-bold rounded-xl"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Fine Reference No</label>
                <input
                  type="text"
                  value={fineNumber}
                  onChange={e => setFineNumber(e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 font-mono focus:border-rose-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Violation Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-rose-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Vehicle Plate</label>
                <select
                  value={vehicleId}
                  onChange={e => handleVehicleChange(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-rose-500 focus:outline-none"
                >
                  {vehicles.map(v => (
                    <option key={v.id} value={v.id}>
                      {v.plateNumber} - {v.make} {v.model}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Assigned Driver</label>
                <select
                  value={driverId || selectedVeh?.currentDriverId || ''}
                  onChange={e => setDriverId(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-rose-500 focus:outline-none"
                >
                  <option value="">-- Unassigned / Fleet --</option>
                  {drivers.map(d => (
                    <option key={d.id} value={d.id}>
                      {d.fullName} ({d.qid})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Violation Type (Qatar MOI)</label>
              <select
                value={violation}
                onChange={e => handleViolationSelect(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-rose-500 focus:outline-none"
              >
                {COMMON_VIOLATIONS.map(v => (
                  <option key={v.title} value={v.title}>
                    {v.title} — QAR {v.amount}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder="e.g. Corniche Road, Doha"
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-rose-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Fine Amount (QAR)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={e => setAmount(Number(e.target.value))}
                  min="50"
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-rose-600 font-mono font-bold focus:border-rose-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Liability Attribution</label>
              <div className="grid grid-cols-2 gap-2">
                <label className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer ${responsiblePerson === 'driver' ? 'border-amber-400 bg-amber-50 text-amber-900 font-bold' : 'border-slate-200 bg-slate-50 text-slate-600'}`}>
                  <input
                    type="radio"
                    name="responsiblePerson"
                    checked={responsiblePerson === 'driver'}
                    onChange={() => setResponsiblePerson('driver')}
                    className="hidden"
                  />
                  <User className="h-4 w-4 text-amber-700" />
                  <span className="text-xs">Driver Liability</span>
                </label>

                <label className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer ${responsiblePerson === 'company' ? 'border-rose-400 bg-rose-50 text-rose-900 font-bold' : 'border-slate-200 bg-slate-50 text-slate-600'}`}>
                  <input
                    type="radio"
                    name="responsiblePerson"
                    checked={responsiblePerson === 'company'}
                    onChange={() => setResponsiblePerson('company')}
                    className="hidden"
                  />
                  <Car className="h-4 w-4 text-rose-700" />
                  <span className="text-xs">Company Liability</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Notes / Metrash Details</label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={2}
                placeholder="Captured by Metrash radar..."
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-rose-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-rose-600 hover:bg-rose-700 px-5 py-2 font-bold text-white shadow-xs"
              >
                Record Violation
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

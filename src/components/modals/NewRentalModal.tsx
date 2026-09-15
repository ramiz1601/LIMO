import React, { useState } from 'react';
import { FileCheck, X, Car, User, Calendar, DollarSign, Building2 } from 'lucide-react';
import { useErp } from '../../context/ErpContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const NewRentalModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { customers, vehicles, addRentalContract, showToast } = useErp();

  const [customerId, setCustomerId] = useState(customers[0]?.id || '');
  const [vehicleId, setVehicleId] = useState(vehicles.find(v => v.status === 'available')?.id || vehicles[0]?.id || '');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]);
  const [dailyRate, setDailyRate] = useState(450);
  const [securityDeposit, setSecurityDeposit] = useState(2000);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank_transfer' | 'cash'>('card');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const selectedCustomer = customers.find(c => c.id === customerId) || customers[0];
  const selectedVehicle = vehicles.find(v => v.id === vehicleId) || vehicles[0];

  // Calculate days & total
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  const days = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
  const totalAmount = days * dailyRate;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVehicle) {
      showToast('Please add or select a vehicle first', 'warning');
      return;
    }

    const customerName = selectedCustomer ? selectedCustomer.name : 'Walk-in Client';
    const customerType = selectedCustomer ? selectedCustomer.type : 'individual';
    const custId = selectedCustomer ? selectedCustomer.id : 'cust-direct';

    const contractNumber = `RENT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    addRentalContract({
      contractNumber,
      customerId: custId,
      customerName,
      customerType,
      vehicleId: selectedVehicle.id,
      vehicleName: `${selectedVehicle.make} ${selectedVehicle.model} (${selectedVehicle.year})`,
      plateNumber: selectedVehicle.plateNumber,
      startDate,
      endDate,
      dailyRate,
      totalAmount,
      securityDeposit,
      paymentStatus: 'paid',
      contractStatus: 'active',
      pickupMileage: selectedVehicle.currentMileage,
      allowedDailyKm: 250,
      extraKmCharge: 1.5,
      notes
    });

    showToast(`Rental contract ${contractNumber} created for ${customerName}!`, 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-100 text-amber-800 border border-amber-200">
              <FileCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">New Customer Rental Contract</h2>
              <p className="text-xs text-slate-500">Corporate & VIP Chauffeur Booking Agreement</p>
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
            <p>No vehicles registered in the fleet. Please add a vehicle first.</p>
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
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Customer / Client</label>
              <select
                value={customerId}
                onChange={e => setCustomerId(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-amber-500 focus:outline-none"
              >
                {customers.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.type.toUpperCase()}) — {c.mobile}
                  </option>
                ))}
                {customers.length === 0 && <option value="walkin">Direct Walk-in VIP Guest</option>}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Select Fleet Vehicle</label>
              <select
                value={vehicleId}
                onChange={e => setVehicleId(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-amber-500 focus:outline-none"
              >
                {vehicles.map(v => (
                  <option key={v.id} value={v.id}>
                    {v.plateNumber} - {v.make} {v.model} ({v.year}) [{v.status.toUpperCase()}]
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Return Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Daily Rate (QAR)</label>
                <input
                  type="number"
                  value={dailyRate}
                  onChange={e => setDailyRate(Number(e.target.value))}
                  min="50"
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 font-mono font-bold focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Security Deposit (QAR)</label>
                <input
                  type="number"
                  value={securityDeposit}
                  onChange={e => setSecurityDeposit(Number(e.target.value))}
                  min="0"
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 font-mono font-bold focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="rounded-2xl bg-amber-50 border border-amber-200 p-3.5 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-amber-800 font-bold block uppercase tracking-wider">Duration: {days} Days</span>
                <span className="text-xs text-slate-600 font-medium">Total Contract Value</span>
              </div>
              <div className="text-right">
                <span className="text-lg font-black font-mono text-emerald-700">
                  QAR {totalAmount.toLocaleString()}
                </span>
              </div>
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
                className="rounded-xl bg-amber-500 hover:bg-amber-600 px-5 py-2 font-bold text-white shadow-xs"
              >
                Issue Agreement
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Gauge, 
  CreditCard, 
  AlertTriangle, 
  CheckCircle2, 
  Upload, 
  Info,
  Calendar,
  Sparkles,
  ShieldAlert,
  Plus,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useErp } from '../../context/ErpContext';
import { PaymentMethod } from '../../types';

export const PaymentCheckpointModal: React.FC = () => {
  const { 
    isCheckpointModalOpen, 
    setCheckpointModalOpen, 
    selectedDriverForCheckpoint, 
    setSelectedDriverForCheckpoint,
    drivers, 
    vehicles, 
    settings, 
    recordPaymentCheckpoint,
    setSelectedReceipt,
    setQuickActionModal,
    setActiveTab,
    showToast
  } = useErp();

  // Active driver selection
  const [driverId, setDriverId] = useState<string>('');
  const [periodLabel, setPeriodLabel] = useState<string>('01 Sep – 15 Sep 2026');
  const [currentMileage, setCurrentMileage] = useState<number | ''>('');
  const [amountPaid, setAmountPaid] = useState<number | ''>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [notes, setNotes] = useState<string>('');
  const [allowOverride, setAllowOverride] = useState<boolean>(false);
  const [overrideReason, setOverrideReason] = useState<string>('');
  const [photoProof, setPhotoProof] = useState<string | undefined>(undefined);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Initialize selected driver
  useEffect(() => {
    if (selectedDriverForCheckpoint) {
      setDriverId(selectedDriverForCheckpoint.id);
    } else if (drivers.length > 0 && !driverId) {
      const firstWithCar = drivers.find(d => d.assignedVehicleId) || drivers[0];
      setDriverId(firstWithCar.id);
    }
  }, [selectedDriverForCheckpoint, drivers]);

  const selectedDriver = drivers.find(d => d.id === driverId);
  const assignedVehicle = vehicles.find(v => v.id === selectedDriver?.assignedVehicleId);

  const previousMileage = assignedVehicle ? assignedVehicle.currentMileage : 0;
  const cycleAmount = selectedDriver?.monthlyRent ? selectedDriver.monthlyRent / 2 : 2250;

  // Auto set initial values when driver changes
  useEffect(() => {
    if (assignedVehicle) {
      setCurrentMileage(assignedVehicle.currentMileage + 1850);
      setAmountPaid(cycleAmount);
      setAllowOverride(false);
      setOverrideReason('');
      setErrorMessage(null);
    }
  }, [driverId, assignedVehicle?.id]);

  if (!isCheckpointModalOpen) return null;

  const numericCurrentMileage = typeof currentMileage === 'number' ? currentMileage : 0;
  const kmDriven = numericCurrentMileage > 0 ? numericCurrentMileage - previousMileage : 0;
  const isMileageLower = numericCurrentMileage > 0 && numericCurrentMileage < previousMileage;
  const isAbnormallyHigh = kmDriven > settings.abnormalMileageThresholdKm;

  const numericAmountPaid = typeof amountPaid === 'number' ? amountPaid : 0;
  const outstandingBalance = Math.max(0, cycleAmount - numericAmountPaid);

  const handleSimulatePhotoUpload = () => {
    setPhotoProof('https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=400&q=80');
    showToast('Odometer photograph attached and verified!', 'info');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!selectedDriver || !assignedVehicle) {
      setErrorMessage('Please select a driver with an assigned vehicle.');
      return;
    }

    if (numericCurrentMileage <= 0) {
      setErrorMessage('Please enter a valid ending odometer reading.');
      return;
    }

    if (isMileageLower && !allowOverride) {
      setErrorMessage(
        `Invalid odometer reading: (${numericCurrentMileage.toLocaleString()} KM) is lower than previous reading (${previousMileage.toLocaleString()} KM).`
      );
      return;
    }

    if (isMileageLower && allowOverride && !overrideReason.trim()) {
      setErrorMessage('Please provide an official reason for the mileage correction.');
      return;
    }

    const res = recordPaymentCheckpoint({
      driverId: selectedDriver.id,
      vehicleId: assignedVehicle.id,
      periodLabel,
      previousMileage,
      currentMileage: numericCurrentMileage,
      amountDue: cycleAmount,
      amountPaid: numericAmountPaid,
      paymentMethod,
      notes,
      odometerPhotoUrl: photoProof,
      overrideReason: allowOverride ? overrideReason : undefined
    });

    if (!res.success) {
      setErrorMessage(res.error || 'Failed to save payment checkpoint.');
      return;
    }

    // Trigger celebration
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (_) {}

    // Close checkpoint and immediately show official receipt
    setCheckpointModalOpen(false);
    if (res.payment) {
      setSelectedReceipt(res.payment);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800 border border-emerald-200">
              <CreditCard className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-slate-900">15-Day Driver Payment Checkpoint</h2>
                <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold text-amber-800 border border-amber-200">
                  Cycle Checkpoint
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Log 15-day vehicle rent, verify odometer reading, and issue official receipt.
              </p>
            </div>
          </div>
          <button
            onClick={() => setCheckpointModalOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-800 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 font-medium">
            <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {drivers.length === 0 ? (
          <div className="py-10 text-center space-y-3">
            <div className="h-12 w-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
              <CreditCard className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">No Drivers in Fleet System</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You must add drivers and assign vehicles before recording 15-day rent checkpoints and odometer logs.
            </p>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setCheckpointModalOpen(false);
                  setQuickActionModal('add_driver');
                }}
                className="flex items-center gap-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 px-4 py-2 text-xs font-bold text-white shadow-xs"
              >
                <Plus className="h-4 w-4" />
                <span>Add Driver</span>
              </button>
            </div>
          </div>
        ) : (
          /* Form Body */
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            {/* Driver & Vehicle Auto-Lookup Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Select Driver *
                </label>
                <select
                  value={driverId}
                  onChange={(e) => setDriverId(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:border-amber-500 focus:outline-none"
                >
                  {drivers.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.fullName} {d.assignedVehiclePlate ? `(${d.assignedVehiclePlate})` : '(No vehicle)'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Payment Period
                </label>
                <select
                  value={periodLabel}
                  onChange={(e) => setPeriodLabel(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-900 focus:border-amber-500 focus:outline-none"
                >
                  <option value="01 Sep – 15 Sep 2026">01 Sep – 15 Sep 2026 (Cycle 1)</option>
                  <option value="16 Sep – 30 Sep 2026">16 Sep – 30 Sep 2026 (Cycle 2)</option>
                  <option value="01 Oct – 15 Oct 2026">01 Oct – 15 Oct 2026 (Cycle 1)</option>
                  <option value="16 Oct – 31 Oct 2026">16 Oct – 31 Oct 2026 (Cycle 2)</option>
                </select>
              </div>
            </div>

            {/* Assigned Vehicle Auto-Summary */}
            {assignedVehicle ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-amber-100 flex items-center justify-center font-black text-amber-800 text-xs">
                      {assignedVehicle.make.slice(0, 2)}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">
                        {assignedVehicle.make} {assignedVehicle.model} ({assignedVehicle.year})
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-amber-100 text-amber-800 border border-amber-200">
                          {assignedVehicle.plateNumber}
                        </span>
                        <span className="text-[10px] text-slate-500 capitalize">
                          {assignedVehicle.plateType} plate
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 block">Monthly Rate</span>
                    <span className="text-xs font-bold font-mono text-slate-900">
                      QAR {(selectedDriver?.monthlyRent || 4500).toLocaleString()} / mo
                    </span>
                  </div>
                </div>

                {/* Odometer Section */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
                  <div className="rounded-xl bg-white p-3 border border-slate-200 shadow-2xs">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">
                      Previous Odometer
                    </span>
                    <span className="text-base font-extrabold font-mono text-slate-900">
                      {previousMileage.toLocaleString()} KM
                    </span>
                    <span className="text-[9px] text-slate-400 block mt-0.5">Verified on file</span>
                  </div>

                  <div className="rounded-xl bg-white p-3 border border-slate-200 shadow-2xs">
                    <label className="text-[10px] uppercase font-bold text-amber-800 block mb-1">
                      Current Odometer *
                    </label>
                    <input
                      type="number"
                      value={currentMileage}
                      onChange={(e) => setCurrentMileage(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="e.g. 86120"
                      className="w-full bg-slate-50 rounded-lg px-2.5 py-1 text-sm font-mono font-bold text-slate-900 border border-slate-300 focus:border-amber-500 focus:outline-none"
                      required
                    />
                    <span className="text-[9px] text-slate-400 block mt-1">Meter reading today</span>
                  </div>

                  <div className="rounded-xl bg-white p-3 border border-slate-200 shadow-2xs">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">
                      KM Driven (15-Days)
                    </span>
                    <span className={`text-base font-extrabold font-mono ${kmDriven < 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
                      {kmDriven > 0 ? `+${kmDriven.toLocaleString()} KM` : `${kmDriven.toLocaleString()} KM`}
                    </span>
                    <span className="text-[9px] text-slate-400 block mt-0.5">Auto-calculated</span>
                  </div>
                </div>

                {/* Validation Warnings */}
                {isMileageLower && (
                  <div className="mt-3 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
                    <div className="flex items-center gap-2 font-bold mb-1">
                      <ShieldAlert className="h-4 w-4 text-rose-600" />
                      Invalid Odometer Reading
                    </div>
                    <p className="text-[11px] leading-relaxed text-slate-700">
                      This reading ({numericCurrentMileage.toLocaleString()} KM) is lower than previous recorded mileage ({previousMileage.toLocaleString()} KM). 
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="overrideOdometer"
                        checked={allowOverride}
                        onChange={(e) => setAllowOverride(e.target.checked)}
                        className="rounded border-slate-300 text-amber-600 focus:ring-0"
                      />
                      <label htmlFor="overrideOdometer" className="text-xs font-bold text-slate-800">
                        Admin approval to override this odometer entry
                      </label>
                    </div>
                    {allowOverride && (
                      <input
                        type="text"
                        placeholder="Reason (e.g. Speedometer cluster replaced at authorized garage)"
                        value={overrideReason}
                        onChange={(e) => setOverrideReason(e.target.value)}
                        className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 focus:outline-none"
                      />
                    )}
                  </div>
                )}

                {isAbnormallyHigh && !isMileageLower && (
                  <div className="mt-3 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 p-2.5 text-xs text-amber-900">
                    <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
                    <span>
                      High Mileage Warning: Driver logged {kmDriven.toLocaleString()} KM during this 15-day period (threshold: {settings.abnormalMileageThresholdKm.toLocaleString()} KM).
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs text-slate-700 flex items-center justify-between">
                <div>
                  <strong className="text-amber-900">Driver has no assigned vehicle:</strong>
                  <p className="text-[11px] text-slate-600 mt-0.5">Please assign a vehicle to this chauffeur to log 15-day payments and mileage.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setCheckpointModalOpen(false);
                    setActiveTab('assignments');
                  }}
                  className="inline-flex items-center gap-1 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold px-3 py-1.5 text-xs shadow-2xs"
                >
                  <span>Assign Vehicle</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            )}

            {/* Payment Financials Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                Payment Settlement
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-xl bg-slate-50 p-3 border border-slate-200">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">
                    15-Day Rent Due
                  </span>
                  <div className="text-base font-extrabold font-mono text-slate-900 mt-1">
                    QAR {cycleAmount.toLocaleString()}
                  </div>
                </div>

                <div className="rounded-xl bg-emerald-50/60 p-3 border border-emerald-200">
                  <label className="text-[10px] text-emerald-800 uppercase font-bold block mb-1">
                    Amount Paid (QAR) *
                  </label>
                  <input
                    type="number"
                    value={amountPaid}
                    onChange={(e) => setAmountPaid(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-white rounded-lg px-3 py-1.5 text-base font-mono font-bold text-emerald-700 border border-emerald-300 focus:border-emerald-500 focus:outline-none"
                    required
                  />
                </div>

                <div className="rounded-xl bg-slate-50 p-3 border border-slate-200">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">
                    Outstanding Balance
                  </span>
                  <div className={`text-base font-extrabold font-mono mt-1 ${outstandingBalance > 0 ? 'text-amber-700' : 'text-slate-500'}`}>
                    QAR {outstandingBalance.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Payment Method & Photo Proof */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-3 border-t border-slate-100">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Payment Method
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900 focus:border-amber-500 focus:outline-none"
                  >
                    <option value="cash">Cash (Petty Cash Vault)</option>
                    <option value="qnb_transfer">QNB Bank Transfer</option>
                    <option value="card">Card POS Terminal</option>
                    <option value="cheque">Cheque</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Odometer Photo Proof
                  </label>
                  {photoProof ? (
                    <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-2 text-xs text-emerald-800">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      <span className="font-medium">Meter Photo Attached</span>
                      <button
                        type="button"
                        onClick={() => setPhotoProof(undefined)}
                        className="ml-auto text-[10px] font-bold text-slate-500 hover:text-rose-700"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSimulatePhotoUpload}
                      className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 hover:border-amber-500 hover:bg-amber-50 transition-colors"
                    >
                      <Upload className="h-3.5 w-3.5 text-amber-600" />
                      <span>Attach Meter Photo</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Notes */}
              <div className="mt-3">
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Optional notes or remarks on voucher..."
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCheckpointModalOpen(false)}
                className="rounded-xl border border-slate-200 bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={!assignedVehicle || (isMileageLower && !allowOverride)}
                className="flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-5 py-2.5 text-xs font-bold text-white shadow-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Sparkles className="h-4 w-4" />
                <span>Save Checkpoint & Issue Voucher</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

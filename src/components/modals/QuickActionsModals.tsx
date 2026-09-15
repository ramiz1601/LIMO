import React, { useState } from 'react';
import { 
  X, 
  Car, 
  User, 
  Receipt, 
  CheckCircle2, 
  AlertTriangle,
  Plus
} from 'lucide-react';
import { useErp } from '../../context/ErpContext';
import { ExpenseCategory, PlateType } from '../../types';

export const QuickActionsModals: React.FC = () => {
  const { 
    quickActionModal, 
    setQuickActionModal, 
    addVehicle, 
    addDriver, 
    addExpense,
    vehicles, 
    accounts,
    showToast
  } = useErp();

  // Add Vehicle State
  const [make, setMake] = useState('Toyota');
  const [model, setModel] = useState('Camry 2.5 GLX');
  const [year, setYear] = useState(2025);
  const [plateNumber, setPlateNumber] = useState('LIM ');
  const [plateType, setPlateType] = useState<PlateType>('limousine');
  const [color, setColor] = useState('Pearl White');
  const [vin, setVin] = useState('');
  const [currentMileage, setCurrentMileage] = useState(12000);
  const [monthlyRent, setMonthlyRent] = useState(4500);

  // Add Driver State
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('+974 ');
  const [qid, setQid] = useState('');
  const [nationality, setNationality] = useState('Pakistani');
  const [drivingLicenseNo, setDrivingLicenseNo] = useState('');

  // Add Expense State
  const [expCategory, setExpCategory] = useState<ExpenseCategory>('office_admin');
  const [expSubcategory, setExpSubcategory] = useState('Office Rent');
  const [expAmount, setExpAmount] = useState(1200);
  const [expAccount, setExpAccount] = useState('QNB Corporate Main (0012-8849)');
  const [expVendor, setExpVendor] = useState('');
  const [expDesc, setExpDesc] = useState('');
  const [expVehicleId, setExpVehicleId] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);

  if (!quickActionModal) return null;

  const handleAddVehicleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!plateNumber.trim()) {
      showToast('Please enter a valid Qatar plate number', 'warning');
      return;
    }
    addVehicle({
      make,
      model,
      year,
      color,
      plateNumber: plateNumber.trim(),
      plateType,
      vin: vin.trim() || `VIN-${Date.now().toString().slice(-8)}`,
      currentMileage: Number(currentMileage) || 0,
      monthlyRent: Number(monthlyRent) || 4500,
      rentPer15Days: (Number(monthlyRent) || 4500) / 2,
      status: 'available',
      insuranceExpiry: '2027-09-01',
      registrationExpiry: '2027-09-01',
      inspectionExpiry: '2027-09-01',
      operatingCardExpiry: '2027-12-01',
      fuelType: 'petrol',
      purchaseDate: new Date().toISOString().split('T')[0],
      purchasePrice: 85000
    });
    showToast(`Vehicle ${make} ${model} (${plateNumber}) registered successfully!`, 'success');
    setQuickActionModal(null);
  };

  const handleAddDriverSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !qid.trim()) {
      showToast('Please provide driver name and Qatar ID', 'warning');
      return;
    }
    addDriver({
      fullName: fullName.trim(),
      mobile: mobile.trim(),
      qid: qid.trim(),
      nationality,
      position: 'Driver',
      joiningDate: new Date().toISOString().split('T')[0],
      status: 'active',
      monthlyRent: 4500,
      paymentFrequency: 'every_15_days',
      drivingLicenseNo: drivingLicenseNo.trim() || `QA-DRV-${Math.floor(100000 + Math.random() * 900000)}`,
      drivingLicenseExpiry: '2028-09-01',
      qidExpiry: '2028-09-01',
      contractExpiry: '2028-09-01',
      rating: 5.0
    });
    showToast(`Driver ${fullName} added to company roster!`, 'success');
    setQuickActionModal(null);
  };

  const handleAddExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (Number(expAmount) <= 0) {
      showToast('Please enter a valid expense amount', 'warning');
      return;
    }
    addExpense({
      category: expCategory,
      subcategory: expSubcategory,
      date: new Date().toISOString().split('T')[0],
      amount: Number(expAmount),
      paymentAccount: expAccount || (accounts[0]?.name ?? 'QNB Corporate Main (0012-8849)'),
      vendor: expVendor.trim() || 'Official Vendor',
      description: expDesc.trim() || expSubcategory,
      vehicleId: expVehicleId || undefined,
      vehiclePlate: vehicles.find(v => v.id === expVehicleId)?.plateNumber,
      isRecurring,
      recurringFrequency: isRecurring ? 'monthly' : undefined,
      status: 'paid',
      recordedBy: 'Enterprise Finance'
    });
    showToast(`Expense of QAR ${Number(expAmount).toLocaleString()} recorded!`, 'success');
    setQuickActionModal(null);
  };

  const getModalTitle = () => {
    switch (quickActionModal) {
      case 'add_vehicle':
        return 'Register Fleet Vehicle';
      case 'add_driver':
        return 'Add Limousine Driver';
      case 'add_expense':
        return 'Record Company Expense';
      default:
        return quickActionModal.replace('_', ' ');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
              {quickActionModal === 'add_vehicle' && <Car className="h-4 w-4" />}
              {quickActionModal === 'add_driver' && <User className="h-4 w-4" />}
              {quickActionModal === 'add_expense' && <Receipt className="h-4 w-4" />}
            </div>
            <h3 className="text-base font-black text-slate-900 capitalize">
              {getModalTitle()}
            </h3>
          </div>
          <button
            onClick={() => setQuickActionModal(null)}
            className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-400 hover:text-slate-800 hover:bg-slate-200 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal 1: Add Vehicle */}
        {quickActionModal === 'add_vehicle' && (
          <form onSubmit={handleAddVehicleSubmit} className="space-y-3.5 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Make *</label>
                <input
                  type="text"
                  value={make}
                  onChange={e => setMake(e.target.value)}
                  placeholder="e.g. Toyota"
                  className="w-full bg-white rounded-xl px-3 py-2 text-slate-900 border border-slate-300 font-medium focus:border-amber-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Model *</label>
                <input
                  type="text"
                  value={model}
                  onChange={e => setModel(e.target.value)}
                  placeholder="e.g. Camry 2.5 GLX"
                  className="w-full bg-white rounded-xl px-3 py-2 text-slate-900 border border-slate-300 font-medium focus:border-amber-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Year</label>
                <input
                  type="number"
                  value={year}
                  onChange={e => setYear(Number(e.target.value))}
                  className="w-full bg-white rounded-xl px-3 py-2 text-slate-900 border border-slate-300 font-mono focus:border-amber-500 focus:outline-none"
                  required
                />
              </div>
              <div className="col-span-2">
                <label className="block text-slate-700 font-bold mb-1">Color</label>
                <input
                  type="text"
                  value={color}
                  onChange={e => setColor(e.target.value)}
                  placeholder="e.g. Pearl White"
                  className="w-full bg-white rounded-xl px-3 py-2 text-slate-900 border border-slate-300 focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Plate Number *</label>
                <input
                  type="text"
                  value={plateNumber}
                  onChange={e => setPlateNumber(e.target.value)}
                  placeholder="e.g. LIM 3344"
                  className="w-full bg-white rounded-xl px-3 py-2 font-mono font-bold text-amber-800 border border-slate-300 focus:border-amber-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Plate Type</label>
                <select
                  value={plateType}
                  onChange={e => setPlateType(e.target.value as PlateType)}
                  className="w-full bg-white rounded-xl px-3 py-2 text-slate-900 border border-slate-300 focus:border-amber-500 focus:outline-none"
                >
                  <option value="limousine">Limousine (Taxi/Limo)</option>
                  <option value="private">Private (VIP Chauffeur)</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Current Odometer (KM)</label>
                <input
                  type="number"
                  value={currentMileage}
                  onChange={e => setCurrentMileage(Number(e.target.value))}
                  className="w-full bg-white rounded-xl px-3 py-2 font-mono text-slate-900 border border-slate-300 focus:border-amber-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Monthly Rent (QAR)</label>
                <input
                  type="number"
                  value={monthlyRent}
                  onChange={e => setMonthlyRent(Number(e.target.value))}
                  className="w-full bg-white rounded-xl px-3 py-2 font-mono font-bold text-emerald-700 border border-slate-300 focus:border-amber-500 focus:outline-none"
                  required
                />
                <span className="text-[10px] text-slate-500 block mt-0.5">
                  15-day cycle: QAR {(monthlyRent / 2).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setQuickActionModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold shadow-xs transition-colors"
              >
                Save Vehicle
              </button>
            </div>
          </form>
        )}

        {/* Modal 2: Add Driver */}
        {quickActionModal === 'add_driver' && (
          <form onSubmit={handleAddDriverSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Driver Full Name *</label>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="e.g. Tariq Mehmood"
                className="w-full bg-white rounded-xl px-3 py-2 text-slate-900 border border-slate-300 font-medium focus:border-amber-500 focus:outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Qatar ID (QID 11 Digits) *</label>
                <input
                  type="text"
                  value={qid}
                  onChange={e => setQid(e.target.value)}
                  placeholder="2905860..."
                  className="w-full bg-white rounded-xl px-3 py-2 font-mono text-slate-900 border border-slate-300 focus:border-amber-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Mobile (+974)</label>
                <input
                  type="text"
                  value={mobile}
                  onChange={e => setMobile(e.target.value)}
                  className="w-full bg-white rounded-xl px-3 py-2 text-slate-900 border border-slate-300 focus:border-amber-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Nationality</label>
                <select
                  value={nationality}
                  onChange={e => setNationality(e.target.value)}
                  className="w-full bg-white rounded-xl px-3 py-2 text-slate-900 border border-slate-300 focus:border-amber-500 focus:outline-none"
                >
                  <option value="Pakistani">Pakistani</option>
                  <option value="Indian">Indian</option>
                  <option value="Bangladeshi">Bangladeshi</option>
                  <option value="Nepali">Nepali</option>
                  <option value="Sri Lankan">Sri Lankan</option>
                  <option value="Egyptian">Egyptian</option>
                  <option value="Jordanian">Jordanian</option>
                  <option value="Qatari">Qatari</option>
                  <option value="Sudanese">Sudanese</option>
                  <option value="Kenyan">Kenyan</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Driving License No</label>
                <input
                  type="text"
                  value={drivingLicenseNo}
                  onChange={e => setDrivingLicenseNo(e.target.value)}
                  placeholder="QA-DRV-..."
                  className="w-full bg-white rounded-xl px-3 py-2 font-mono text-slate-900 border border-slate-300 focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="rounded-xl bg-amber-50 p-2.5 border border-amber-200 text-amber-900 text-[11px]">
              <strong>Standard Qatar Limousine Contract:</strong> 15-day rent cycles (1st–15th and 16th–End).
            </div>

            <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setQuickActionModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold shadow-xs transition-colors"
              >
                Register Driver
              </button>
            </div>
          </form>
        )}

        {/* Modal 3: Add Expense */}
        {quickActionModal === 'add_expense' && (
          <form onSubmit={handleAddExpenseSubmit} className="space-y-3.5 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Expense Category</label>
                <select
                  value={expCategory}
                  onChange={e => {
                    const cat = e.target.value as ExpenseCategory;
                    setExpCategory(cat);
                    if (cat === 'office_admin') setExpSubcategory('Office Rent');
                    else if (cat === 'fleet') setExpSubcategory('Maintenance & Repairs');
                    else if (cat === 'employees') setExpSubcategory('Salaries');
                    else setExpSubcategory('Marketing');
                  }}
                  className="w-full bg-white rounded-xl px-3 py-2 text-slate-900 border border-slate-300 focus:border-amber-500 focus:outline-none"
                >
                  <option value="office_admin">Office & Administration</option>
                  <option value="fleet">Fleet & Vehicles</option>
                  <option value="employees">Employees & Payroll</option>
                  <option value="operations">Operations & Marketing</option>
                  <option value="other">Other / Miscellaneous</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Subcategory / Title</label>
                <input
                  type="text"
                  value={expSubcategory}
                  onChange={e => setExpSubcategory(e.target.value)}
                  className="w-full bg-white rounded-xl px-3 py-2 text-slate-900 border border-slate-300 font-medium focus:border-amber-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Amount (QAR) *</label>
                <input
                  type="number"
                  value={expAmount}
                  onChange={e => setExpAmount(Number(e.target.value))}
                  className="w-full bg-white rounded-xl px-3 py-2 font-mono font-bold text-rose-600 border border-slate-300 focus:border-amber-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Payment Account</label>
                <select
                  value={expAccount}
                  onChange={e => setExpAccount(e.target.value)}
                  className="w-full bg-white rounded-xl px-3 py-2 text-slate-900 border border-slate-300 focus:border-amber-500 focus:outline-none"
                >
                  {accounts.map(acc => (
                    <option key={acc.id} value={acc.name}>
                      {acc.name} (QAR {acc.balance.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Vendor / Payee</label>
              <input
                type="text"
                value={expVendor}
                onChange={e => setExpVendor(e.target.value)}
                placeholder="e.g. WOQOD, Kahramaa, Ooredoo, Garage..."
                className="w-full bg-white rounded-xl px-3 py-2 text-slate-900 border border-slate-300 focus:border-amber-500 focus:outline-none"
              />
            </div>

            {expCategory === 'fleet' && (
              <div>
                <label className="block text-slate-700 font-bold mb-1">Associated Vehicle (Optional)</label>
                <select
                  value={expVehicleId}
                  onChange={e => setExpVehicleId(e.target.value)}
                  className="w-full bg-white rounded-xl px-3 py-2 text-slate-900 border border-slate-300 focus:border-amber-500 focus:outline-none"
                >
                  <option value="">None / Fleet-wide</option>
                  {vehicles.map(v => (
                    <option key={v.id} value={v.id}>
                      {v.make} {v.model} ({v.plateNumber})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="isRec"
                checked={isRecurring}
                onChange={e => setIsRecurring(e.target.checked)}
                className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
              />
              <label htmlFor="isRec" className="text-slate-700 font-medium">
                Mark as monthly recurring expense (auto-remind)
              </label>
            </div>

            <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setQuickActionModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-xs transition-colors"
              >
                Record Expense
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

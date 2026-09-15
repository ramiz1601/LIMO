import React, { useState } from 'react';
import { 
  X, 
  Building2, 
  Car, 
  Sparkles, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Lock, 
  Globe2, 
  ShieldCheck,
  CreditCard
} from 'lucide-react';
import { useErp } from '../../context/ErpContext';
import { SubscriptionPlanId } from '../../types';

interface OnboardingWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingWizardModal: React.FC<OnboardingWizardModalProps> = ({ isOpen, onClose }) => {
  const { registerOrganization, plans, showToast, addVehicle } = useErp();

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Step 1: Admin Account
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

  // Step 2: Company Setup
  const [companyName, setCompanyName] = useState('');
  const [legalName, setLegalName] = useState('');
  const [industry, setIndustry] = useState<'limousine' | 'chauffeur' | 'car_rental' | 'fleet_logistics' | 'transport'>('limousine');
  const [country, setCountry] = useState('Qatar');
  const [city, setCity] = useState('Doha');
  const [address, setAddress] = useState('');
  const [currency, setCurrency] = useState('QAR');
  const [timezone, setTimezone] = useState('Asia/Qatar');

  // Step 3: Plan Selection
  const [selectedPlanId, setSelectedPlanId] = useState<SubscriptionPlanId>('business');

  // Step 4: Fleet Quickstart
  const [firstVehicleMake, setFirstVehicleMake] = useState('Mercedes-Benz');
  const [firstVehicleModel, setFirstVehicleModel] = useState('S-Class 580');
  const [firstVehiclePlate, setFirstVehiclePlate] = useState('LIM 7788');
  const [firstVehicleRent, setFirstVehicleRent] = useState(5000);
  const [skipFirstVehicle, setSkipFirstVehicle] = useState(false);

  if (!isOpen) return null;

  const handleCountryChange = (selectedCountry: string) => {
    setCountry(selectedCountry);
    if (selectedCountry === 'Qatar') {
      setCurrency('QAR');
      setTimezone('Asia/Qatar');
      setCity('Doha');
    } else if (selectedCountry === 'United States') {
      setCurrency('USD');
      setTimezone('America/New_York');
      setCity('New York');
    } else if (selectedCountry === 'United Arab Emirates') {
      setCurrency('AED');
      setTimezone('Asia/Dubai');
      setCity('Dubai');
    } else if (selectedCountry === 'Saudi Arabia') {
      setCurrency('SAR');
      setTimezone('Asia/Riyadh');
      setCity('Riyadh');
    } else if (selectedCountry === 'United Kingdom') {
      setCurrency('GBP');
      setTimezone('Europe/London');
      setCity('London');
    }
  };

  const handleCompleteSetup = () => {
    if (!companyName.trim()) {
      showToast('Please enter a company name', 'error');
      setStep(2);
      return;
    }
    if (!fullName.trim() || !email.trim()) {
      showToast('Please enter admin name and email', 'error');
      setStep(1);
      return;
    }

    const res = registerOrganization({
      name: companyName,
      legalName: legalName || `${companyName} LLC`,
      industry,
      country,
      city,
      address: address || `${city}, ${country}`,
      phone: phone || '+974 4400 0000',
      email: email,
      currency,
      timezone,
      planId: selectedPlanId,
      ownerName: fullName,
      ownerEmail: email
    });

    if (res.success && res.organization) {
      if (!skipFirstVehicle && firstVehicleMake && firstVehiclePlate) {
        // Add first vehicle to the new organization
        addVehicle({
          make: firstVehicleMake,
          model: firstVehicleModel,
          year: 2025,
          color: 'Black',
          plateNumber: firstVehiclePlate,
          plateType: 'limousine',
          vin: `VIN-${Date.now()}`,
          currentMileage: 1000,
          monthlyRent: Number(firstVehicleRent) || 4500,
          rentPer15Days: (Number(firstVehicleRent) || 4500) / 2,
          status: 'available',
          insuranceExpiry: '2027-12-31',
          registrationExpiry: '2027-12-31',
          inspectionExpiry: '2027-12-31',
          operatingCardExpiry: '2027-12-31',
          fuelType: 'petrol',
          purchaseDate: '2025-01-01',
          purchasePrice: 90000
        });
      }

      showToast(`Welcome to FleetFlow ERP! ${companyName} has been initialized with a 14-day trial.`, 'success');
      onClose();
    } else {
      showToast(res.error || 'Failed to create organization', 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
      <div className="relative flex flex-col max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 text-white font-black shadow-sm">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Start 14-Day Free SaaS Trial</h2>
              <p className="text-xs text-slate-500">FleetFlow Multi-Tenant Transportation ERP</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Step Progress Indicators */}
        <div className="border-b border-slate-100 bg-white px-6 py-3">
          <div className="flex items-center justify-between text-xs font-semibold">
            {[
              { num: 1, label: 'Account' },
              { num: 2, label: 'Company' },
              { num: 3, label: 'Plan' },
              { num: 4, label: 'First Fleet' },
              { num: 5, label: 'Complete' }
            ].map((s) => (
              <div key={s.num} className="flex items-center gap-1.5">
                <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold transition-all ${
                  step === s.num
                    ? 'bg-amber-500 text-white shadow-xs'
                    : step > s.num
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-400'
                }`}>
                  {step > s.num ? <Check className="h-3.5 w-3.5" /> : s.num}
                </span>
                <span className={`hidden sm:inline ${step === s.num ? 'text-slate-900 font-bold' : 'text-slate-500'}`}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Body Steps */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Step 1: Create Organization Admin Account</h3>
                <p className="text-xs text-slate-500">This account will be the master Company Administrator for your organization.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Faisal Al-Hajri"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-amber-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Work Email *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@yourcompany.com"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-amber-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Phone</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+974 5500 1234"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-amber-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Password *</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-amber-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="rounded-xl bg-amber-50 border border-amber-200/80 p-3.5 flex items-start gap-2.5">
                <ShieldCheck className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                <p className="text-xs text-amber-800">
                  <strong>Strict Tenant Isolation:</strong> Your organization will receive a dedicated, isolated database partition. No other tenant will ever see or access your fleet, driver, or financial records.
                </p>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Step 2: Company & Operations Details</h3>
                <p className="text-xs text-slate-500">Configure your company identity, base currency, and location.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Company / Brand Name *</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Al-Rayyan Luxury Limousine"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-amber-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Primary Industry</label>
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-amber-500 focus:outline-hidden"
                  >
                    <option value="limousine">Limousine & Chauffeur Services</option>
                    <option value="car_rental">Car Rental Agency</option>
                    <option value="chauffeur">VIP Executive Chauffeur</option>
                    <option value="fleet_logistics">Fleet & Transport Logistics</option>
                    <option value="transport">Passenger Transport</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Operating Country</label>
                  <select
                    value={country}
                    onChange={(e) => handleCountryChange(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-amber-500 focus:outline-hidden"
                  >
                    <option value="Qatar">Qatar (State of Qatar)</option>
                    <option value="United States">United States</option>
                    <option value="United Arab Emirates">United Arab Emirates (Dubai / Abu Dhabi)</option>
                    <option value="Saudi Arabia">Saudi Arabia (KSA)</option>
                    <option value="United Kingdom">United Kingdom</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">City / Base</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Doha"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-amber-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Operating Currency</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-amber-500 focus:outline-hidden"
                  >
                    <option value="QAR">QAR — Qatari Riyal (QR)</option>
                    <option value="USD">USD — US Dollar ($)</option>
                    <option value="AED">AED — UAE Dirham (AED)</option>
                    <option value="SAR">SAR — Saudi Riyal (SAR)</option>
                    <option value="EUR">EUR — Euro (€)</option>
                    <option value="GBP">GBP — British Pound (£)</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Physical Office Address</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. Lusail Marina Tower, Doha, Qatar"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-amber-500 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Step 3: Choose Your Subscription Plan</h3>
                <p className="text-xs text-slate-500">Every plan begins with a full 14-day free trial. No credit card required to start.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {plans.slice(0, 3).map((p) => {
                  const isSelected = selectedPlanId === p.id;
                  return (
                    <div
                      key={p.id}
                      onClick={() => setSelectedPlanId(p.id)}
                      className={`relative cursor-pointer rounded-2xl p-4 border transition-all ${
                        isSelected
                          ? 'border-amber-500 bg-amber-50/50 shadow-md ring-2 ring-amber-500/20'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      {p.isPopular && (
                        <span className="absolute -top-2.5 right-3 rounded-full bg-amber-500 px-2 py-0.5 text-[9px] font-extrabold uppercase text-white shadow-xs">
                          Popular
                        </span>
                      )}
                      <h4 className="text-sm font-extrabold text-slate-900">{p.name}</h4>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{p.description}</p>
                      
                      <div className="my-3 font-mono">
                        <span className="text-xl font-black text-slate-900">${p.monthlyPriceUSD}</span>
                        <span className="text-[10px] text-slate-500">/mo</span>
                      </div>

                      <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
                        <div className="flex items-center gap-1.5">
                          <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                          <span>Up to <strong>{p.maxVehicles}</strong> vehicles</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                          <span>Up to <strong>{p.maxUsers}</strong> staff users</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                          <span>15-Day Odometer radar</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="rounded-xl bg-emerald-50 border border-emerald-200/80 p-3 text-xs text-emerald-800 flex items-center justify-between">
                <span>Free 14-day trial active for all plans</span>
                <span className="font-bold">Cancel anytime</span>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Step 4: Register Your First Vehicle</h3>
                  <p className="text-xs text-slate-500">Kickstart your fleet inventory right away.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSkipFirstVehicle(!skipFirstVehicle)}
                  className="text-xs font-semibold text-amber-700 hover:underline"
                >
                  {skipFirstVehicle ? 'Add Vehicle Now' : 'Skip for now'}
                </button>
              </div>

              {!skipFirstVehicle ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-xl border border-slate-200 p-4 bg-slate-50/50">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Make</label>
                    <input
                      type="text"
                      value={firstVehicleMake}
                      onChange={(e) => setFirstVehicleMake(e.target.value)}
                      placeholder="e.g. Toyota / Mercedes"
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Model</label>
                    <input
                      type="text"
                      value={firstVehicleModel}
                      onChange={(e) => setFirstVehicleModel(e.target.value)}
                      placeholder="e.g. Camry / S-Class"
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Plate Number</label>
                    <input
                      type="text"
                      value={firstVehiclePlate}
                      onChange={(e) => setFirstVehiclePlate(e.target.value)}
                      placeholder="e.g. LIM 1029"
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Monthly Rent ({currency})</label>
                    <input
                      type="number"
                      value={firstVehicleRent}
                      onChange={(e) => setFirstVehicleRent(Number(e.target.value))}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                    />
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-slate-500 text-xs">
                  You opted to skip initial vehicle creation. You can add vehicles anytime via the Vehicles view.
                </div>
              )}
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4 py-2 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                <Check className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-black text-slate-900">Setup Ready for {companyName || 'Your Company'}</h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                Your isolated organization environment has been prepared. Your 14-day free trial on the <strong>{plans.find(p => p.id === selectedPlanId)?.name}</strong> plan is ready to launch.
              </p>

              <div className="mx-auto max-w-sm rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-left text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Organization:</span>
                  <span className="font-bold text-slate-800">{companyName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Country & Base:</span>
                  <span className="font-semibold text-slate-700">{city}, {country}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Currency:</span>
                  <span className="font-semibold text-slate-700">{currency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Admin Email:</span>
                  <span className="font-semibold text-slate-700">{email}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/80 px-6 py-4">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((prev) => (prev - 1) as any)}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
          ) : (
            <div />
          )}

          {step < 5 ? (
            <button
              type="button"
              onClick={() => {
                if (step === 1 && (!fullName.trim() || !email.trim())) {
                  showToast('Please fill in Admin Name and Email', 'warning');
                  return;
                }
                if (step === 2 && !companyName.trim()) {
                  showToast('Please enter your Company Name', 'warning');
                  return;
                }
                setStep((prev) => (prev + 1) as any);
              }}
              className="flex items-center gap-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 px-5 py-2 text-xs font-bold text-white shadow-sm transition-colors"
            >
              Next <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleCompleteSetup}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-6 py-2.5 text-xs font-extrabold text-white shadow-md shadow-emerald-600/20 transition-all active:scale-95"
            >
              Launch ERP Dashboard <Sparkles className="h-4 w-4" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

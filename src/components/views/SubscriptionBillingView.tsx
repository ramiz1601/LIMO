import React, { useState } from 'react';
import {
  CreditCard,
  Sparkles,
  Check,
  Zap,
  ArrowRight,
  ShieldCheck,
  Download,
  AlertCircle,
  FileText,
  Calendar,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { useErp } from '../../context/ErpContext';
import { SubscriptionPlanId } from '../../types';

export const SubscriptionBillingView: React.FC = () => {
  const {
    currentTenant,
    plans,
    changeTenantPlan,
    vehicles,
    drivers,
    invoices,
    showToast
  } = useErp();

  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const currentPlan = plans.find((p) => p.id === currentTenant.planId) || plans[0];

  const vehiclePercent = Math.min(100, Math.round((vehicles.length / currentPlan.maxVehicles) * 100));
  const driverPercent = Math.min(100, Math.round((drivers.length / currentPlan.maxDrivers) * 100));

  const handlePlanUpgrade = (targetPlanId: SubscriptionPlanId) => {
    changeTenantPlan(currentTenant.id, targetPlanId);
    showToast(`Your subscription has been updated to the ${plans.find(p => p.id === targetPlanId)?.name} plan!`, 'success');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-amber-100 text-amber-900 border border-amber-200 px-2.5 py-0.5 text-[10px] font-extrabold uppercase">
                {currentTenant.name} Subscription
              </span>
              {currentTenant.isTrial && (
                <span className="rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold">
                  {currentTenant.trialDaysRemaining ?? 7} Days Left in Free Trial
                </span>
              )}
            </div>
            <h1 className="text-xl font-black text-slate-900 mt-1">Plan & Billing Architecture</h1>
            <p className="text-xs text-slate-500">
              Manage your FleetFlow enterprise quotas, feature limits, and commercial receipts.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-[10px] font-semibold text-slate-400 uppercase">Current Tier</div>
              <div className="text-base font-extrabold text-amber-700">{currentPlan.name} Plan</div>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 shadow-xs">
              <Zap className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Capacity Utilization Gauges */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-100 pt-5">
          {/* Vehicles Meter */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1.5">
              <span>Fleet Vehicles Allowed</span>
              <span className="font-mono text-amber-700">
                {vehicles.length} / {currentPlan.maxVehicles === 9999 ? '∞' : currentPlan.maxVehicles}
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  vehiclePercent > 85 ? 'bg-rose-500' : 'bg-amber-500'
                }`}
                style={{ width: `${currentPlan.maxVehicles === 9999 ? 15 : vehiclePercent}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-2">
              {currentPlan.maxVehicles === 9999
                ? 'Unlimited vehicles on Enterprise plan'
                : `${Math.max(0, currentPlan.maxVehicles - vehicles.length)} vehicle slots available`}
            </p>
          </div>

          {/* Drivers Meter */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1.5">
              <span>Active Drivers</span>
              <span className="font-mono text-amber-700">
                {drivers.length} / {currentPlan.maxDrivers === 9999 ? '∞' : currentPlan.maxDrivers}
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  driverPercent > 85 ? 'bg-rose-500' : 'bg-amber-500'
                }`}
                style={{ width: `${currentPlan.maxDrivers === 9999 ? 15 : driverPercent}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-2">
              {currentPlan.maxDrivers === 9999
                ? 'Unlimited drivers supported'
                : `${Math.max(0, currentPlan.maxDrivers - drivers.length)} driver slots available`}
            </p>
          </div>

          {/* User Seats Meter */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1.5">
              <span>Staff / Manager Seats</span>
              <span className="font-mono text-amber-700">
                2 / {currentPlan.maxUsers === 9999 ? '∞' : currentPlan.maxUsers}
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
              <div className="h-full rounded-full bg-emerald-500" style={{ width: '35%' }} />
            </div>
            <p className="text-[10px] text-slate-400 mt-2">Multi-role RBAC active for managers & accountants</p>
          </div>
        </div>
      </div>

      {/* Available Plans Selector */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-extrabold text-slate-900">Change or Upgrade Subscription Plan</h2>
            <p className="text-xs text-slate-500">
              Select the tier that best matches your limousine, chauffeur, or car rental fleet size.
            </p>
          </div>

          {/* Monthly / Annual Toggle */}
          <div className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1 text-xs">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`rounded-lg px-3 py-1 font-bold transition-all ${
                billingCycle === 'monthly' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`rounded-lg px-3 py-1 font-bold transition-all flex items-center gap-1 ${
                billingCycle === 'annual' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
              }`}
            >
              Annual <span className="rounded bg-emerald-100 text-emerald-800 text-[9px] px-1 py-0.2">Save 20%</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {plans.map((p) => {
            const isCurrent = currentTenant.planId === p.id;
            const price = billingCycle === 'annual' ? p.annualPriceUSD : p.monthlyPriceUSD;

            return (
              <div
                key={p.id}
                className={`flex flex-col justify-between rounded-2xl p-5 border transition-all ${
                  isCurrent
                    ? 'border-amber-500 bg-gradient-to-b from-amber-50/40 to-white shadow-md ring-2 ring-amber-500/20'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-extrabold uppercase text-slate-600">
                      {p.badge}
                    </span>
                    {isCurrent && (
                      <span className="rounded-full bg-amber-500 px-2 py-0.5 text-[9px] font-extrabold uppercase text-white shadow-2xs">
                        Active Plan
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900 mt-2">{p.name}</h3>
                  <p className="text-xs text-slate-500 mt-1 min-h-[36px]">{p.description}</p>

                  <div className="my-4 font-mono">
                    <span className="text-2xl font-black text-slate-900">${price}</span>
                    <span className="text-xs text-slate-500"> / mo</span>
                  </div>

                  <div className="space-y-2 border-t border-slate-100 pt-3 text-xs text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      <span><strong>{p.maxVehicles === 9999 ? 'Unlimited' : p.maxVehicles}</strong> Fleet Vehicles</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      <span><strong>{p.maxDrivers === 9999 ? 'Unlimited' : p.maxDrivers}</strong> Driver Checkpoints</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      <span><strong>{p.maxUsers === 9999 ? 'Unlimited' : p.maxUsers}</strong> Staff Logins</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      <span>15-Day Continuous Odometer Radar</span>
                    </div>
                    {p.features.advancedFinance && (
                      <div className="flex items-center gap-1.5 font-medium text-slate-800">
                        <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        <span>Corporate P&L & Audited Reports</span>
                      </div>
                    )}
                    {p.features.customBranding && (
                      <div className="flex items-center gap-1.5 font-medium text-slate-800">
                        <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        <span>Custom Logo & White-Label Receipts</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100">
                  {isCurrent ? (
                    <div className="rounded-xl bg-amber-100/70 border border-amber-200 py-2 text-center text-xs font-extrabold text-amber-900">
                      Your Current Plan
                    </div>
                  ) : (
                    <button
                      onClick={() => handlePlanUpgrade(p.id)}
                      className="w-full rounded-xl bg-slate-900 hover:bg-slate-800 py-2 text-center text-xs font-bold text-white transition-colors flex items-center justify-center gap-1"
                    >
                      Switch to {p.name} <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Invoice History */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Subscription Invoices & Receipts</h3>
            <p className="text-xs text-slate-500">Official tax invoices for your ERP subscription.</p>
          </div>
          <span className="text-xs font-bold text-slate-500 font-mono">
            Next Renewal: {currentTenant.currentBillingPeriodEnd}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-100 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="py-2.5 px-3">Invoice Number</th>
                <th className="py-2.5 px-3">Plan Details</th>
                <th className="py-2.5 px-3">Billing Period</th>
                <th className="py-2.5 px-3">Amount</th>
                <th className="py-2.5 px-3">Payment Method</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/60">
                  <td className="py-3 px-3 font-mono font-bold text-slate-800">{inv.invoiceNumber}</td>
                  <td className="py-3 px-3 font-medium text-slate-800">{inv.planName}</td>
                  <td className="py-3 px-3 text-slate-500">{inv.period}</td>
                  <td className="py-3 px-3 font-mono font-bold text-slate-900">
                    ${inv.amount.toLocaleString()} {inv.currency}
                  </td>
                  <td className="py-3 px-3 text-slate-600">{inv.paymentMethod}</td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-extrabold text-emerald-700 uppercase">
                      <CheckCircle2 className="h-2.5 w-2.5" /> Paid
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => showToast(`Downloaded invoice ${inv.invoiceNumber}`, 'success')}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      <Download className="h-3 w-3 text-slate-400" /> PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

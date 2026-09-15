import React from 'react';
import { X, Sparkles, Check, ArrowRight, ShieldAlert, Zap } from 'lucide-react';
import { useErp } from '../../context/ErpContext';
import { SubscriptionPlanId } from '../../types';

export const PlanLimitUpgradeModal: React.FC = () => {
  const {
    isPlanLimitModalOpen,
    setIsPlanLimitModalOpen,
    planLimitResourceType,
    currentTenant,
    plans,
    changeTenantPlan,
    showToast
  } = useErp();

  if (!isPlanLimitModalOpen) return null;

  const currentPlan = plans.find(p => p.id === currentTenant.planId) || plans[0];

  const handleUpgrade = (targetPlanId: SubscriptionPlanId) => {
    changeTenantPlan(currentTenant.id, targetPlanId);
    showToast(`Successfully upgraded ${currentTenant.name} to the ${plans.find(p => p.id === targetPlanId)?.name} plan!`, 'success');
    setIsPlanLimitModalOpen(false);
  };

  const getResourceTitle = () => {
    switch (planLimitResourceType) {
      case 'vehicles':
        return `Vehicles Limit Reached (${currentPlan.maxVehicles}/${currentPlan.maxVehicles})`;
      case 'drivers':
        return `Drivers Limit Reached (${currentPlan.maxDrivers}/${currentPlan.maxDrivers})`;
      case 'users':
        return `Team Members Limit Reached (${currentPlan.maxUsers}/${currentPlan.maxUsers})`;
      default:
        return 'Plan Limit Reached';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
      <div className="relative flex flex-col max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-amber-200/80 bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-white font-bold shadow-sm">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded bg-amber-200/60 px-2 py-0.5 text-[10px] font-bold text-amber-900 uppercase">
                  {currentPlan.name} Plan
                </span>
                <h3 className="text-base font-extrabold text-slate-900">{getResourceTitle()}</h3>
              </div>
              <p className="text-xs text-slate-600">Upgrade your organization plan to expand capacity immediately.</p>
            </div>
          </div>
          <button
            onClick={() => setIsPlanLimitModalOpen(false)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 text-xs text-slate-600 leading-relaxed">
            Your current plan (<strong>{currentPlan.name}</strong>) allows up to{' '}
            <strong>{currentPlan.maxVehicles} vehicles</strong>,{' '}
            <strong>{currentPlan.maxDrivers} drivers</strong>, and{' '}
            <strong>{currentPlan.maxUsers} staff members</strong>. Upgrade now to unlock higher quotas and advanced SaaS capabilities without any service interruption.
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {plans
              .filter(p => p.id !== currentPlan.id)
              .map(targetPlan => (
                <div
                  key={targetPlan.id}
                  className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 hover:border-amber-500 hover:shadow-md transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-extrabold text-slate-900">{targetPlan.name}</h4>
                      {targetPlan.isPopular && (
                        <span className="rounded-full bg-amber-500 px-2 py-0.5 text-[9px] font-bold text-white uppercase">
                          Recommended
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{targetPlan.description}</p>

                    <div className="my-3 font-mono">
                      <span className="text-xl font-black text-slate-900">${targetPlan.monthlyPriceUSD}</span>
                      <span className="text-[10px] text-slate-500">/mo</span>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-2.5">
                      <div className="flex items-center gap-1.5">
                        <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        <span><strong>{targetPlan.maxVehicles}</strong> Vehicles max</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        <span><strong>{targetPlan.maxDrivers}</strong> Drivers max</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        <span><strong>{targetPlan.maxUsers}</strong> Staff seats</span>
                      </div>
                      {targetPlan.features.advancedFinance && (
                        <div className="flex items-center gap-1.5 text-slate-700">
                          <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                          <span>Advanced Finance & P&L</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleUpgrade(targetPlan.id)}
                    className="mt-4 flex items-center justify-center gap-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 px-4 py-2 text-xs font-bold text-white shadow-xs transition-colors"
                  >
                    Upgrade to {targetPlan.name} <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-6 py-3 text-xs text-slate-500">
          <span>Upgrades apply instantly to {currentTenant.name}. Existing data is strictly preserved.</span>
          <button
            onClick={() => setIsPlanLimitModalOpen(false)}
            className="rounded-lg px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

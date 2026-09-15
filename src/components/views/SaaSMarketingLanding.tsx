import React, { useState } from 'react';
import {
  Sparkles,
  Car,
  Gauge,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Building2,
  Zap,
  Globe2,
  DollarSign,
  ChevronDown,
  Lock,
  Layers
} from 'lucide-react';
import { useErp } from '../../context/ErpContext';
import { SubscriptionPlanId } from '../../types';

export const SaaSMarketingLanding: React.FC = () => {
  const {
    plans,
    switchTenant,
    setActiveTab,
    setIsOnboardingOpen,
    organizations
  } = useErp();

  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does the continuous odometer chain of custody work?',
      a: 'When an assignment closes or a 15-day checkpoint is recorded, the ending odometer reading is cryptographically linked to the vehicle record. When the vehicle is assigned to a new chauffeur, the starting odometer reading is auto-populated and locked to prevent mileage fraud or missed billing cycles.'
    },
    {
      q: 'Can we manage multiple brands or subsidiaries within one account?',
      a: 'Yes! FleetFlow is built from the ground up on true multi-tenant architecture. Super Admins can manage distinct companies with their own currencies (QAR, USD, AED, SAR, EUR), tax registrations, and isolated driver/fleet databases.'
    },
    {
      q: 'What happens after the 14-day free trial?',
      a: 'During the trial, you have full access to all features. At the end of 14 days, you can choose any subscription plan. No data is lost or altered when transitioning from trial to paid.'
    },
    {
      q: 'Is driver access secure and mobile-friendly?',
      a: 'Yes. Chauffeurs access a dedicated, streamlined Driver Portal from their smartphones. They only see their assigned limousine, upcoming 15-day payment cycles, and can upload odometer readings directly from the field.'
    }
  ];

  return (
    <div className="space-y-16 py-4 animate-in fade-in duration-300">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl border border-amber-200/80 bg-gradient-to-b from-amber-50/60 via-white to-white p-8 md:p-14 shadow-sm">
        <div className="mx-auto max-w-3xl text-center space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-100/80 px-4 py-1 text-xs font-extrabold text-amber-900 shadow-2xs">
            <Sparkles className="h-3.5 w-3.5 text-amber-600" />
            <span>Next-Gen Multi-Tenant Fleet & Chauffeur SaaS</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            The Enterprise Operating System for <span className="text-amber-600">Limousine & Chauffeur</span> Fleets
          </h1>

          <p className="text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Eliminate odometer fraud, automate 15-day bi-monthly driver rent collection, and manage isolated subsidiaries across Qatar and worldwide with turnkey SaaS architecture.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setIsOnboardingOpen(true)}
              className="flex items-center gap-2 rounded-2xl bg-amber-500 hover:bg-amber-600 px-6 py-3.5 text-sm font-extrabold text-white shadow-md shadow-amber-500/20 transition-all hover:scale-102 active:scale-98"
            >
              Start 14-Day Free Trial <ArrowRight className="h-4 w-4" />
            </button>

            <button
              onClick={() => {
                switchTenant('tenant_prince_limousine');
                setActiveTab('dashboard');
              }}
              className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 px-6 py-3.5 text-sm font-bold text-slate-800 shadow-xs transition-all"
            >
              <Car className="h-4 w-4 text-amber-600" /> Launch Prince Limousine Demo
            </button>
          </div>

          <div className="flex items-center justify-center gap-6 pt-4 text-xs text-slate-500">
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" /> No Credit Card Required
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Multi-Tenant Database
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Full QAR & USD Support
            </span>
          </div>
        </div>

        {/* Live Metrics Row */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-slate-100 pt-8">
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">100%</div>
            <div className="text-xs text-slate-500 mt-0.5">Tenant Data Isolation</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-black text-amber-600 font-mono">15-Day</div>
            <div className="text-xs text-slate-500 mt-0.5">Automated Rent Cycles</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">0.0 KM</div>
            <div className="text-xs text-slate-500 mt-0.5">Odometer Discrepancy</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-black text-emerald-600 font-mono">99.99%</div>
            <div className="text-xs text-slate-500 mt-0.5">High-Availability Uptime</div>
          </div>
        </div>
      </div>

      {/* 3 Core Architecture Pillars */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-black text-slate-900">Engineered for Chauffeur Business Realities</h2>
          <p className="text-xs text-slate-500 mt-1">
            Built specifically to solve the operational headaches of executive limousine operators.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-200">
              <Gauge className="h-6 w-6" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900">15-Day Continuous Odometer Radar</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Enforce continuous odometer handover between drivers. Every 15-day payment checkpoint requires verified odometer entry and flags excessive kilometer wear instantly.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-200">
              <Layers className="h-6 w-6" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900">Complete Multi-Tenant Isolation</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every organization operates within an isolated tenant partition. Super Admins monitor global platform growth, while companies manage their own fleet, drivers, and ledger in private.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-200">
              <DollarSign className="h-6 w-6" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900">Multi-Currency P&L Financials</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Unified double-entry general ledger tracking bank accounts, corporate rental contracts, driver cash receipts, fuel maintenance, and operating expenses.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Live Demo Switcher */}
      <div className="rounded-3xl border border-slate-200 bg-slate-900 text-white p-8 md:p-10 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold text-amber-400">
              <Zap className="h-3.5 w-3.5" /> Interactive Multi-Tenant Demo
            </div>
            <h2 className="text-2xl font-black">Experience Isolated Tenant Switching</h2>
            <p className="text-xs text-slate-400 max-w-xl">
              Switch immediately between our pre-seeded production companies to inspect their isolated vehicles, drivers, currencies, and real-time financial dashboards.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={() => {
                switchTenant('tenant_prince_limousine');
                setActiveTab('dashboard');
              }}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition-colors"
            >
              <Building2 className="h-4 w-4" /> Prince Limousine (QAR)
            </button>

            <button
              onClick={() => {
                switchTenant('tenant_demo_elite');
                setActiveTab('dashboard');
              }}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition-colors"
            >
              <Globe2 className="h-4 w-4" /> Demo Elite (USD)
            </button>

            <button
              onClick={() => setActiveTab('superadmin')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2.5 text-xs font-bold text-amber-300 transition-colors"
            >
              <Lock className="h-4 w-4" /> Super Admin Portal
            </button>
          </div>
        </div>
      </div>

      {/* Pricing Calculator */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl font-black text-slate-900">Simple, Predictable SaaS Pricing</h2>
          <p className="text-xs text-slate-500">
            Choose the plan that fits your limousine fleet. Upgrade, downgrade, or cancel anytime.
          </p>

          <div className="inline-flex rounded-2xl border border-slate-200 bg-slate-100 p-1 text-xs">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`rounded-xl px-4 py-1.5 font-bold transition-all ${
                billingCycle === 'monthly' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`rounded-xl px-4 py-1.5 font-bold transition-all flex items-center gap-1.5 ${
                billingCycle === 'annual' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
              }`}
            >
              Annual Billing <span className="rounded bg-emerald-100 text-emerald-800 text-[10px] px-1.5 py-0.2">Save 20%</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((p) => {
            const price = billingCycle === 'annual' ? p.annualPriceUSD : p.monthlyPriceUSD;

            return (
              <div
                key={p.id}
                className={`flex flex-col justify-between rounded-3xl p-6 border transition-all ${
                  p.isPopular
                    ? 'border-amber-500 bg-gradient-to-b from-amber-50/40 to-white shadow-md ring-2 ring-amber-500/20'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-extrabold uppercase text-slate-600">
                      {p.badge}
                    </span>
                    {p.isPopular && (
                      <span className="rounded-full bg-amber-500 px-2.5 py-0.5 text-[10px] font-black uppercase text-white shadow-2xs">
                        Most Popular
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-black text-slate-900 mt-2">{p.name}</h3>
                  <p className="text-xs text-slate-500 mt-1 min-h-[36px]">{p.description}</p>

                  <div className="my-5 font-mono">
                    <span className="text-3xl font-black text-slate-900">${price}</span>
                    <span className="text-xs text-slate-500"> / month</span>
                  </div>

                  <div className="space-y-2.5 border-t border-slate-100 pt-4 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span><strong>{p.maxVehicles === 9999 ? 'Unlimited' : p.maxVehicles}</strong> Fleet Vehicles</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span><strong>{p.maxDrivers === 9999 ? 'Unlimited' : p.maxDrivers}</strong> Driver Checkpoints</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span><strong>{p.maxUsers === 9999 ? 'Unlimited' : p.maxUsers}</strong> Staff Seats</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>15-Day Continuous Odometer Radar</span>
                    </div>
                    {p.features.advancedFinance && (
                      <div className="flex items-center gap-2 font-medium text-slate-800">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                        <span>Corporate P&L & Audited Reports</span>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => setIsOnboardingOpen(true)}
                  className={`mt-6 w-full rounded-2xl py-3 text-center text-xs font-black transition-all ${
                    p.isPopular
                      ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-500/20'
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  Start 14-Day Free Trial
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto space-y-4">
        <h2 className="text-xl font-black text-slate-900 text-center mb-6">Frequently Asked Questions</h2>
        {faqs.map((faq, idx) => {
          const isOpen = openFaqIndex === idx;
          return (
            <div
              key={idx}
              className="rounded-2xl border border-slate-200 bg-white overflow-hidden transition-all shadow-xs"
            >
              <button
                onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                className="w-full flex items-center justify-between p-4 text-left text-xs font-bold text-slate-900"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </button>
              {isOpen && (
                <div className="p-4 pt-0 text-xs text-slate-600 leading-relaxed border-t border-slate-100">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Final Call to Action */}
      <div className="rounded-3xl border border-amber-300 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 p-8 md:p-12 text-white text-center shadow-lg">
        <h2 className="text-2xl sm:text-3xl font-black">Modernize Your Transportation Business Today</h2>
        <p className="text-xs text-amber-100 max-w-xl mx-auto mt-2">
          Join leading limousine and chauffeur operators across the GCC and internationally. Zero upfront fees, no credit card required.
        </p>

        <button
          onClick={() => setIsOnboardingOpen(true)}
          className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-white text-amber-900 hover:bg-amber-50 px-8 py-3.5 text-xs font-black shadow-md transition-transform active:scale-95"
        >
          Initialize Your Company ERP Now <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

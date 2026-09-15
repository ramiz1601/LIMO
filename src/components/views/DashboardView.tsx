import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Car,
  Users,
  KeyRound,
  FileCheck,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  Calendar,
  Layers,
  CheckCircle2,
  Gauge,
  CreditCard,
  Plus,
  ArrowRight
} from 'lucide-react';
import { useErp } from '../../context/ErpContext';
import heroImage from '../../assets/images/doha_limousine_hero_1789325638658.jpg';

export const DashboardView: React.FC = () => {
  const { 
    vehicles, 
    drivers, 
    rentals, 
    payments, 
    expenses, 
    accounts,
    currentRole,
    setCheckpointModalOpen,
    setSelectedDriverForCheckpoint,
    setSelectedVehicleProfileId,
    setActiveTab,
    setQuickActionModal
  } = useErp();

  const [timeFilter, setTimeFilter] = useState<'7d' | '30d' | '3m' | '6m' | '1y'>('30d');
  const [topSortField, setTopSortField] = useState<'revenue' | 'net'>('revenue');

  // Quick Stats - 100% Real Dynamic State
  const totalVehicles = vehicles.length;
  const assignedVehicles = vehicles.filter(v => v.status === 'assigned').length;
  const availableVehicles = vehicles.filter(v => v.status === 'available').length;
  const maintenanceVehicles = vehicles.filter(v => v.status === 'maintenance').length;
  const inactiveVehicles = vehicles.filter(v => v.status === 'inactive' || v.status === 'accident').length;
  const activeDrivers = drivers.filter(d => d.status === 'active').length;
  const activeRentals = rentals.filter(r => r.contractStatus === 'active').length;

  // Real Financial Figures
  const totalRevenue = payments.reduce((sum, p) => sum + (p.amountPaid || 0), 0) +
                       rentals.reduce((sum, r) => sum + ((r as any).paidAmount ?? (r.paymentStatus === 'paid' ? r.totalRentalAmount : 0)), 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
  const netProfit = totalRevenue - totalExpenses;
  const cashAndBankBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  // Dynamic Chart points
  const chartPoints: Record<'7d' | '30d' | '3m' | '6m' | '1y', { label: string; rev: number; exp: number; net: number }[]> = {
    '7d': [
      { label: 'Mon', rev: 0, exp: 0, net: 0 },
      { label: 'Tue', rev: 0, exp: 0, net: 0 },
      { label: 'Wed', rev: 0, exp: 0, net: 0 },
      { label: 'Thu', rev: 0, exp: 0, net: 0 },
      { label: 'Fri', rev: 0, exp: 0, net: 0 },
      { label: 'Sat', rev: 0, exp: 0, net: 0 },
      { label: 'Sun', rev: totalRevenue, exp: totalExpenses, net: netProfit },
    ],
    '30d': [
      { label: 'Week 1', rev: 0, exp: 0, net: 0 },
      { label: 'Week 2 (Cycle 1)', rev: totalRevenue, exp: totalExpenses, net: netProfit },
      { label: 'Week 3', rev: 0, exp: 0, net: 0 },
      { label: 'Week 4 (Cycle 2)', rev: 0, exp: 0, net: 0 },
    ],
    '3m': [
      { label: 'July', rev: 0, exp: 0, net: 0 },
      { label: 'August', rev: 0, exp: 0, net: 0 },
      { label: 'September', rev: totalRevenue, exp: totalExpenses, net: netProfit },
    ],
    '6m': [
      { label: 'Apr', rev: 0, exp: 0, net: 0 },
      { label: 'May', rev: 0, exp: 0, net: 0 },
      { label: 'Jun', rev: 0, exp: 0, net: 0 },
      { label: 'Jul', rev: 0, exp: 0, net: 0 },
      { label: 'Aug', rev: 0, exp: 0, net: 0 },
      { label: 'Sep', rev: totalRevenue, exp: totalExpenses, net: netProfit },
    ],
    '1y': [
      { label: 'Q4 25', rev: 0, exp: 0, net: 0 },
      { label: 'Q1 26', rev: 0, exp: 0, net: 0 },
      { label: 'Q2 26', rev: 0, exp: 0, net: 0 },
      { label: 'Q3 26', rev: totalRevenue, exp: totalExpenses, net: netProfit },
    ]
  };

  const currentChartData = chartPoints[timeFilter];
  const maxVal = Math.max(1000, ...currentChartData.map(d => Math.max(d.rev, d.exp)));

  // Calculate top vehicles from live vehicles and payments
  const topVehicles = vehicles.map(v => {
    const vPayments = payments.filter(p => p.vehicleId === v.id);
    const vExpenses = expenses.filter(e => e.vehicleId === v.id);
    const rev = vPayments.reduce((s, p) => s + (p.amountPaid || 0), 0);
    const exp = vExpenses.reduce((s, e) => s + (e.amount || 0), 0);
    return {
      id: v.id,
      name: `${v.make} ${v.model}`,
      plate: v.plateNumber,
      driver: v.currentDriverName || 'Unassigned',
      rev,
      exp,
      net: rev - exp
    };
  }).sort((a, b) => (topSortField === 'revenue' ? b.rev - a.rev : b.net - a.net));

  return (
    <div className="space-y-6 pb-12">
      {/* 1. HERO SECTION WITH LUXURY DOHA LIMOUSINE VISUAL */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-md">
        {/* Background Image Overlay with soft light gradient */}
        <div className="absolute inset-0 z-0 opacity-15 mix-blend-multiply">
          <img
            src={heroImage}
            alt="Doha Limousine"
            className="h-full w-full object-cover object-center"
          />
        </div>
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-white via-white/90 to-amber-50/40" />

        {/* Hero Content */}
        <div className="relative z-10 p-6 md:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800 border border-amber-200 mb-3 shadow-2xs">
              <Sparkles className="h-3.5 w-3.5 text-amber-600" />
              <span>Qatar Fleet Operations Center • Fresh System Ready</span>
            </div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tight text-slate-900">
              Welcome, {currentRole === 'owner' ? 'Business Owner' : currentRole === 'accountant' ? 'Chief Accountant' : currentRole === 'fleet_manager' ? 'Fleet Operations Manager' : currentRole === 'hr' ? 'HR Officer' : 'General Manager'} 👋
            </h1>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed max-w-xl">
              Prince Limousine ERP workspace is freshly initialized. Start by registering your fleet vehicles, limousine chauffeurs, and vehicle assignments.
            </p>

            {/* Under Hero Quick Business Statistics */}
            <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-200">
              <div className="rounded-2xl bg-slate-50 p-3 border border-slate-200 shadow-2xs">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Total Vehicles</span>
                <span className="text-xl font-extrabold font-mono text-slate-900">{totalVehicles}</span>
                <span className="text-[10px] text-slate-500 block">Fleet registered</span>
              </div>
              <div className="rounded-2xl bg-slate-50 p-3 border border-slate-200 shadow-2xs">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Active Drivers</span>
                <span className="text-xl font-extrabold font-mono text-emerald-700">{activeDrivers}</span>
                <span className="text-[10px] text-slate-500 block">Chauffeurs</span>
              </div>
              <div className="rounded-2xl bg-slate-50 p-3 border border-slate-200 shadow-2xs">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Active Rentals</span>
                <span className="text-xl font-extrabold font-mono text-blue-700">{activeRentals}</span>
                <span className="text-[10px] text-slate-500 block">Contracts</span>
              </div>
              <div className="rounded-2xl bg-slate-50 p-3 border border-slate-200 shadow-2xs">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Vehicles Available</span>
                <span className="text-xl font-extrabold font-mono text-amber-700">{availableVehicles}</span>
                <span className="text-[10px] text-slate-500 block">Ready to assign</span>
              </div>
            </div>
          </div>

          {/* Quick Action Card */}
          <div className="shrink-0 rounded-2xl border border-amber-200 bg-amber-50/70 p-5 shadow-sm max-w-xs w-full">
            <div className="flex items-center justify-between text-xs font-bold text-amber-900 mb-2">
              <span className="flex items-center gap-1.5">
                <Car className="h-4 w-4 text-amber-700" /> Fast Onboarding
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-200/70 text-amber-800 font-bold">
                Step 1
              </span>
            </div>
            <p className="text-xs text-slate-700 mb-4 leading-relaxed">
              Register vehicles and limousine chauffeurs to kickstart 15-day rent cycles.
            </p>
            <div className="space-y-2">
              <button
                onClick={() => setQuickActionModal('add_vehicle')}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-all active:scale-95"
              >
                <Plus className="h-4 w-4" />
                <span>Add Fleet Vehicle</span>
              </button>
              <button
                onClick={() => setQuickActionModal('add_driver')}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 px-4 py-2 text-xs font-bold text-slate-700 shadow-2xs transition-all active:scale-95"
              >
                <Users className="h-3.5 w-3.5 text-slate-500" />
                <span>Add Driver</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* FRESH START QUICK ONBOARDING CHECKLIST */}
      {totalVehicles === 0 && (
        <div className="rounded-3xl border border-amber-200 bg-gradient-to-r from-amber-50 via-white to-emerald-50/40 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-5 w-5 text-amber-600" />
            <h3 className="text-base font-bold text-slate-900">Fresh System Setup Guide</h3>
          </div>
          <p className="text-xs text-slate-600 mb-4">
            Follow these 4 simple steps to set up your Prince Limousine fleet operations:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div 
              onClick={() => setQuickActionModal('add_vehicle')}
              className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs cursor-pointer hover:border-amber-400 hover:shadow-xs transition-all group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="h-6 w-6 rounded-full bg-amber-100 text-amber-800 text-xs font-bold flex items-center justify-center">1</span>
                <Plus className="h-4 w-4 text-amber-600 group-hover:scale-110 transition-transform" />
              </div>
              <h4 className="text-xs font-bold text-slate-900">Add Vehicles</h4>
              <p className="text-[11px] text-slate-500 mt-1">Register Toyota Camry, Lexus, Mercedes, etc.</p>
            </div>

            <div 
              onClick={() => setQuickActionModal('add_driver')}
              className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs cursor-pointer hover:border-amber-400 hover:shadow-xs transition-all group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center">2</span>
                <Plus className="h-4 w-4 text-emerald-600 group-hover:scale-110 transition-transform" />
              </div>
              <h4 className="text-xs font-bold text-slate-900">Add Drivers</h4>
              <p className="text-[11px] text-slate-500 mt-1">Add limousine chauffeurs with Qatar IDs & licenses.</p>
            </div>

            <div 
              onClick={() => setActiveTab('assignments')}
              className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs cursor-pointer hover:border-amber-400 hover:shadow-xs transition-all group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="h-6 w-6 rounded-full bg-blue-100 text-blue-800 text-xs font-bold flex items-center justify-center">3</span>
                <ArrowRight className="h-4 w-4 text-blue-600 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <h4 className="text-xs font-bold text-slate-900">Assign Vehicles</h4>
              <p className="text-[11px] text-slate-500 mt-1">Pair car to driver with 15-day rent rates.</p>
            </div>

            <div 
              onClick={() => setActiveTab('payments')}
              className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs cursor-pointer hover:border-amber-400 hover:shadow-xs transition-all group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="h-6 w-6 rounded-full bg-purple-100 text-purple-800 text-xs font-bold flex items-center justify-center">4</span>
                <ArrowRight className="h-4 w-4 text-purple-600 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <h4 className="text-xs font-bold text-slate-900">Record Rent & KM</h4>
              <p className="text-[11px] text-slate-500 mt-1">Collect 15-day rents and verify odometer checkpoints.</p>
            </div>
          </div>
        </div>
      )}

      {/* 2. FOUR LARGE FINANCIAL CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* TOTAL REVENUE */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Revenue</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl md:text-3xl font-black font-mono text-slate-900">QAR {totalRevenue.toLocaleString()}</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <span>Collected driver rents & customer contracts</span>
          </div>
        </div>

        {/* TOTAL EXPENSES */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Expenses</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-100 text-rose-700">
              <TrendingDown className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl md:text-3xl font-black font-mono text-slate-900">QAR {totalExpenses.toLocaleString()}</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <span>Operating, maintenance & fleet costs</span>
          </div>
        </div>

        {/* NET PROFIT */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Net Profit</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <Sparkles className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className={`text-2xl md:text-3xl font-black font-mono ${netProfit >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
              QAR {netProfit.toLocaleString()}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <span>Net operational contribution</span>
          </div>
        </div>

        {/* CASH & BANK BALANCE */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Cash & Bank Balance</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
              <Wallet className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl md:text-3xl font-black font-mono text-slate-900">QAR {cashAndBankBalance.toLocaleString()}</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            <span>QNB, CBQ & Cash Vault</span>
          </div>
        </div>
      </div>

      {/* 3. CHARTS ROW: REVENUE VS EXPENSES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Large Revenue vs Expenses Chart */}
        <div className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Revenue vs Expenses</h3>
              <p className="text-xs text-slate-500">Operating performance and cashflow tracking</p>
            </div>

            {/* Time Filter Buttons */}
            <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1 border border-slate-200">
              {(['7d', '30d', '3m', '6m', '1y'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setTimeFilter(f)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-bold uppercase transition-all ${
                    timeFilter === f
                      ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Bar/Area Comparison Chart */}
          <div className="h-64 flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-slate-200">
            {currentChartData.map((d, idx) => {
              const revHeight = Math.max(4, (d.rev / maxVal) * 100);
              const expHeight = Math.max(4, (d.exp / maxVal) * 100);
              const netHeight = Math.max(4, (d.net / maxVal) * 100);

              return (
                <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                  {/* Tooltip on hover */}
                  <div className="absolute -top-16 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 z-20 rounded-xl bg-slate-900 text-white p-2 text-[10px] font-mono shadow-xl whitespace-nowrap">
                    <div className="text-amber-400 font-bold">{d.label}</div>
                    <div className="text-emerald-400">Rev: QAR {d.rev.toLocaleString()}</div>
                    <div className="text-rose-400">Exp: QAR {d.exp.toLocaleString()}</div>
                    <div className="text-sky-300 font-bold">Net: QAR {d.net.toLocaleString()}</div>
                  </div>

                  {/* Bars side-by-side */}
                  <div className="w-full flex items-end justify-center gap-1 h-full pb-1">
                    <div
                      className="w-3 md:w-4 rounded-t-md bg-amber-500 transition-all duration-500"
                      style={{ height: `${revHeight}%` }}
                    />
                    <div
                      className="w-3 md:w-4 rounded-t-md bg-rose-500 transition-all duration-500"
                      style={{ height: `${expHeight}%` }}
                    />
                    <div
                      className="w-3 md:w-4 rounded-t-md bg-emerald-500 transition-all duration-500"
                      style={{ height: `${netHeight}%` }}
                    />
                  </div>

                  <span className="text-[11px] font-semibold text-slate-500 mt-2 block">
                    {d.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Chart Legend */}
          <div className="flex items-center justify-center gap-6 pt-4 text-xs font-bold text-slate-600">
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded bg-amber-500" />
              <span>Revenue</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded bg-rose-500" />
              <span>Expenses</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded bg-emerald-500" />
              <span>Net Profit</span>
            </div>
          </div>
        </div>

        {/* Fleet Distribution / Summary */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Fleet Operations Breakdown</h3>
            <p className="text-xs text-slate-500">Asset utilization across Qatar</p>

            <div className="mt-6 space-y-4">
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>Assigned to Drivers</span>
                  <span>{totalVehicles > 0 ? Math.round((assignedVehicles / totalVehicles) * 100) : 0}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 rounded-full" 
                    style={{ width: `${totalVehicles > 0 ? (assignedVehicles / totalVehicles) * 100 : 0}%` }} 
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>Available in Yard</span>
                  <span>{totalVehicles > 0 ? Math.round((availableVehicles / totalVehicles) * 100) : 0}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 rounded-full" 
                    style={{ width: `${totalVehicles > 0 ? (availableVehicles / totalVehicles) * 100 : 0}%` }} 
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>In Maintenance / Garage</span>
                  <span>{totalVehicles > 0 ? Math.round((maintenanceVehicles / totalVehicles) * 100) : 0}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div 
                    className="h-full bg-amber-500 rounded-full" 
                    style={{ width: `${totalVehicles > 0 ? (maintenanceVehicles / totalVehicles) * 100 : 0}%` }} 
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <button
              onClick={() => setActiveTab('vehicles')}
              className="flex w-full items-center justify-between rounded-xl bg-slate-50 hover:bg-slate-100 p-3 text-xs font-bold text-slate-800 transition-colors"
            >
              <span>Manage Fleet Vehicles</span>
              <ChevronRight className="h-4 w-4 text-slate-400" />
            </button>
          </div>
        </div>
      </div>

      {/* 4. FLEET STATUS & TOP VEHICLES SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Fleet Status Donut & Quick Cards */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900">Fleet Status</h3>
            <span className="text-xs text-slate-500">Total: <strong className="text-slate-900">{totalVehicles} Vehicles</strong></span>
          </div>

          {/* Visual Progress Ring */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
            <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-2.5 text-center">
              <span className="text-[10px] font-bold text-emerald-800 uppercase block">Assigned</span>
              <span className="text-lg font-mono font-extrabold text-emerald-700">{assignedVehicles}</span>
            </div>
            <div className="rounded-xl bg-blue-50 border border-blue-200 p-2.5 text-center">
              <span className="text-[10px] font-bold text-blue-800 uppercase block">Available</span>
              <span className="text-lg font-mono font-extrabold text-blue-700">{availableVehicles}</span>
            </div>
            <div className="rounded-xl bg-amber-50 border border-amber-200 p-2.5 text-center">
              <span className="text-[10px] font-bold text-amber-800 uppercase block">Maintenance</span>
              <span className="text-lg font-mono font-extrabold text-amber-700">{maintenanceVehicles}</span>
            </div>
            <div className="rounded-xl bg-slate-100 border border-slate-200 p-2.5 text-center">
              <span className="text-[10px] font-bold text-slate-600 uppercase block">Inactive</span>
              <span className="text-lg font-mono font-extrabold text-slate-700">{inactiveVehicles}</span>
            </div>
          </div>

          {/* Vehicle Highlights list */}
          <div className="space-y-2.5">
            {vehicles.length === 0 ? (
              <div className="py-6 text-center rounded-2xl bg-slate-50 border border-slate-200">
                <Car className="h-7 w-7 mx-auto mb-2 text-slate-400" />
                <p className="text-xs font-bold text-slate-700">No vehicles in fleet</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Add vehicles to track status and mileage</p>
                <button
                  onClick={() => setQuickActionModal('add_vehicle')}
                  className="mt-3 inline-flex items-center gap-1 rounded-lg bg-amber-500 hover:bg-amber-600 px-3 py-1.5 text-xs font-bold text-white shadow-2xs"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Register Vehicle</span>
                </button>
              </div>
            ) : (
              vehicles.slice(0, 3).map((v) => (
                <div
                  key={v.id}
                  onClick={() => setSelectedVehicleProfileId(v.id)}
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200 hover:border-amber-400 cursor-pointer transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-xl bg-amber-100 flex items-center justify-center font-bold text-xs text-amber-700">
                      <Car className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">{v.make} {v.model}</div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-amber-100 text-amber-800 border border-amber-200">
                          {v.plateNumber}
                        </span>
                        <span className="text-[10px] text-slate-500">{v.plateType}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                      v.status === 'assigned' ? 'bg-emerald-100 text-emerald-800' :
                      v.status === 'available' ? 'bg-blue-100 text-blue-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {v.status}
                    </span>
                    <div className="text-[10px] font-mono text-slate-500 mt-1">
                      {(v.currentMileage ?? (v as any).currentMileageKm ?? 0).toLocaleString()} KM
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <button
            onClick={() => setActiveTab('vehicles')}
            className="mt-4 flex w-full items-center justify-center gap-1 text-xs font-bold text-amber-700 hover:text-amber-800 pt-2"
          >
            <span>View All Fleet Vehicles</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Top Vehicles By Revenue */}
        <div className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Top Vehicles by Revenue & Profitability</h3>
              <p className="text-xs text-slate-500">Net operating contribution per vehicle</p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Sort by:</span>
              <button
                onClick={() => setTopSortField('revenue')}
                className={`rounded-lg px-2.5 py-1 text-xs font-bold ${
                  topSortField === 'revenue' ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                Revenue
              </button>
              <button
                onClick={() => setTopSortField('net')}
                className={`rounded-lg px-2.5 py-1 text-xs font-bold ${
                  topSortField === 'net' ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                Net Contribution
              </button>
            </div>
          </div>

          {topVehicles.length === 0 ? (
            <div className="py-12 text-center rounded-2xl bg-slate-50 border border-slate-200">
              <Car className="h-10 w-10 mx-auto mb-2 text-slate-400" />
              <p className="text-sm font-bold text-slate-800">No vehicle revenue data yet</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                Register vehicles and record driver 15-day cycle payments to generate real-time profitability rankings.
              </p>
              <button
                onClick={() => setQuickActionModal('add_vehicle')}
                className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 px-4 py-2 text-xs font-bold text-white shadow-2xs"
              >
                <Plus className="h-4 w-4" />
                <span>Add First Vehicle</span>
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold bg-slate-50">
                  <tr>
                    <th className="py-2.5 px-3">Vehicle</th>
                    <th className="py-2.5 px-3">Plate</th>
                    <th className="py-2.5 px-3">Driver</th>
                    <th className="py-2.5 px-3 text-right">Revenue</th>
                    <th className="py-2.5 px-3 text-right">Expenses</th>
                    <th className="py-2.5 px-3 text-right">Net Contribution</th>
                    <th className="py-2.5 px-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {topVehicles.map((v) => (
                    <tr key={v.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-3 font-bold text-slate-900">{v.name}</td>
                      <td className="py-3 px-3">
                        <span className="px-1.5 py-0.5 rounded font-mono font-bold bg-amber-100 text-amber-800 border border-amber-200 text-[10px]">
                          {v.plate}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-600">{v.driver}</td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                        QAR {v.rev.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-rose-600 font-bold">
                        QAR {v.exp.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-emerald-700">
                        QAR {v.net.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() => setSelectedVehicleProfileId(v.id)}
                          className="rounded-lg bg-slate-100 px-2 py-1 text-[10px] font-bold text-amber-700 hover:bg-slate-200"
                        >
                          Profile
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

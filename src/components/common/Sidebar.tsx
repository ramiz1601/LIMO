import React from 'react';
import {
  LayoutDashboard,
  Car,
  Users,
  KeyRound,
  CreditCard,
  Building2,
  FileCheck,
  WalletCards,
  Receipt,
  BadgePercent,
  Wrench,
  Gauge,
  AlertTriangle,
  FolderArchive,
  BarChart3,
  Bell,
  Settings,
  ChevronRight,
  Sparkles,
  Crown,
  Layers,
  Shield,
  LifeBuoy,
  Smartphone,
  Globe2,
  TrendingUp
} from 'lucide-react';
import { useErp } from '../../context/ErpContext';

interface SidebarProps {
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, setIsMobileOpen }) => {
  const { 
    activeTab, 
    setActiveTab, 
    vehicles, 
    payments, 
    notifications, 
    documents,
    fines,
    currentRole,
    currentTenant,
    currentUser,
    plans,
    supportTickets,
    setIsPlanLimitModalOpen,
    setPlanLimitResourceType
  } = useErp();

  const unreadNotifs = notifications.filter(n => !n.isRead).length;
  const overduePayments = payments.filter(p => p.status === 'overdue' || p.status === 'partial').length;
  const expiringDocs = documents.filter(d => d.status !== 'valid').length;
  const pendingFines = fines.filter(f => f.status === 'pending').length;
  const openTickets = supportTickets.filter(t => t.status === 'open' || t.status === 'waiting').length;

  const currentPlan = plans.find(p => p.id === currentTenant.planId) || plans[0];
  const vehicleUsagePercent = Math.min(100, Math.round((vehicles.length / currentPlan.maxVehicles) * 100));

  const operationsNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'vehicles', label: 'Vehicles', icon: Car, badge: vehicles.length > 0 ? vehicles.length.toString() : undefined },
    { id: 'drivers', label: 'Drivers & Employees', icon: Users },
    { id: 'assignments', label: 'Vehicle Assignments', icon: KeyRound },
    { 
      id: 'payments', 
      label: 'Driver Payments', 
      icon: CreditCard, 
      badge: overduePayments > 0 ? `${overduePayments}` : undefined,
      badgeColor: 'bg-rose-100 text-rose-700 border-rose-200'
    },
    { id: 'customers', label: 'Customers', icon: Building2 },
    { id: 'rentals', label: 'Rentals & Contracts', icon: FileCheck },
    { id: 'finance', label: 'Finance & Accounts', icon: WalletCards },
    { id: 'expenses', label: 'Company Expenses', icon: Receipt },
    { id: 'payroll', label: 'Payroll & WPS', icon: BadgePercent },
    { id: 'maintenance', label: 'Maintenance & Garages', icon: Wrench },
    { 
      id: 'mileage', 
      label: 'Mileage / Odometer', 
      icon: Gauge, 
      highlight: true 
    },
    { 
      id: 'fines', 
      label: 'Accidents & Fines', 
      icon: AlertTriangle,
      badge: pendingFines > 0 ? `${pendingFines}` : undefined,
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200'
    },
    { 
      id: 'documents', 
      label: 'Documents & Expiry', 
      icon: FolderArchive,
      badge: expiringDocs > 0 ? `${expiringDocs}` : undefined,
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200'
    },
    { id: 'reports', label: 'Reports & P&L', icon: BarChart3 },
    { 
      id: 'notifications', 
      label: 'Alert Center', 
      icon: Bell,
      badge: unreadNotifs > 0 ? `${unreadNotifs}` : undefined,
      badgeColor: 'bg-rose-100 text-rose-700 border-rose-200'
    },
    { id: 'settings', label: 'Settings & Config', icon: Settings },
  ];

  const saasNavItems = [
    { id: 'billing', label: 'Subscription & Billing', icon: Layers },
    { id: 'team', label: 'Team & Permissions', icon: Shield },
    { 
      id: 'support', 
      label: 'Support Tickets', 
      icon: LifeBuoy,
      badge: openTickets > 0 ? `${openTickets}` : undefined,
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-200'
    },
    { id: 'driver_portal', label: 'Chauffeur Portal', icon: Smartphone },
    { id: 'landing', label: 'SaaS Marketing Site', icon: Globe2 },
  ];

  // Role permissions filter
  const isItemVisible = (id: string) => {
    if (currentUser.isSuperAdmin) return true;
    if (currentRole === 'driver') {
      return ['driver_portal', 'support', 'dashboard'].includes(id);
    }
    if (currentRole === 'accountant') {
      return ['dashboard', 'payments', 'finance', 'expenses', 'payroll', 'reports', 'settings', 'billing', 'support'].includes(id);
    }
    if (currentRole === 'fleet_manager' || currentRole === 'fleet_coordinator') {
      return ['dashboard', 'vehicles', 'drivers', 'assignments', 'maintenance', 'mileage', 'fines', 'documents', 'reports', 'support'].includes(id);
    }
    if (currentRole === 'hr') {
      return ['dashboard', 'drivers', 'payroll', 'documents', 'notifications', 'team', 'support'].includes(id);
    }
    return true;
  };

  const handleSelect = (id: string) => {
    setActiveTab(id);
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200/90 bg-white transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 shadow-xs ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Company Live Status Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-slate-200/90">
          <div className="flex items-center gap-2 min-w-0">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></div>
            <div className="truncate">
              <span className="text-xs font-black tracking-wider text-slate-800 uppercase block truncate">
                {currentTenant.name}
              </span>
              <span className="text-[10px] text-slate-400 font-semibold block">
                {currentTenant.currency} • {currentPlan.name}
              </span>
            </div>
          </div>
          <span className="rounded bg-amber-500/10 px-1.5 py-0.5 text-[9px] font-bold text-amber-800 border border-amber-500/30 shrink-0">
            ACTIVE
          </span>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
          {/* Super Admin Section (Only for Alexander Sterling or Super Admin) */}
          {currentUser.isSuperAdmin && (
            <div>
              <div className="px-3 pb-1 text-[10px] font-black uppercase tracking-widest text-purple-700 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Crown className="h-3 w-3 text-purple-600" /> Platform Command
                </span>
                <span className="rounded bg-purple-100 text-purple-800 px-1 text-[9px]">Root</span>
              </div>
              <button
                onClick={() => handleSelect('superadmin')}
                className={`group flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                  activeTab === 'superadmin'
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20 font-bold'
                    : 'text-purple-900 bg-purple-50/80 hover:bg-purple-100 border border-purple-200/80'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Crown className={`h-4 w-4 ${activeTab === 'superadmin' ? 'text-amber-300' : 'text-purple-600'}`} />
                  <span>Super Admin Console</span>
                </div>
                {activeTab === 'superadmin' ? (
                  <ChevronRight className="h-3 w-3 text-white" />
                ) : (
                  <span className="h-2 w-2 rounded-full bg-purple-500"></span>
                )}
              </button>
            </div>
          )}

          {/* Operations & Fleet Section */}
          <div>
            <div className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Operations & Fleet
            </div>
            <div className="space-y-0.5">
              {operationsNavItems.map((item) => {
                if (!isItemVisible(item.id)) return null;
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item.id)}
                    className={`group flex w-full items-center justify-between rounded-xl px-3 py-1.5 text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-amber-50 text-amber-950 font-bold border border-amber-200 shadow-2xs'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon
                        className={`h-4 w-4 transition-colors ${
                          isActive ? 'text-amber-600' : 'text-slate-400 group-hover:text-slate-700'
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {item.badge && (
                        <span
                          className={`rounded-full px-1.5 py-0.2 text-[9px] font-bold border ${
                            item.badgeColor || 'bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                      {isActive && <ChevronRight className="h-3 w-3 text-amber-600" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SaaS & Organization Section */}
          <div>
            <div className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              SaaS & Organization
            </div>
            <div className="space-y-0.5">
              {saasNavItems.map((item) => {
                if (!isItemVisible(item.id)) return null;
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item.id)}
                    className={`group flex w-full items-center justify-between rounded-xl px-3 py-1.5 text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-amber-50 text-amber-950 font-bold border border-amber-200 shadow-2xs'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon
                        className={`h-4 w-4 transition-colors ${
                          isActive ? 'text-amber-600' : 'text-slate-400 group-hover:text-slate-700'
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {item.badge && (
                        <span
                          className={`rounded-full px-1.5 py-0.2 text-[9px] font-bold border ${
                            item.badgeColor || 'bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                      {isActive && <ChevronRight className="h-3 w-3 text-amber-600" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Subscription Plan Quota Gauge Card */}
        <div className="p-3 border-t border-slate-200/90 bg-slate-50/50">
          <div className="rounded-xl bg-white p-3 border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-800 mb-1">
              <span className="flex items-center gap-1 text-slate-800">
                <Sparkles className="h-3 w-3 text-amber-500" />
                {currentPlan.name}
              </span>
              <span className="text-slate-500 font-mono text-[10px]">
                {vehicles.length}/{currentPlan.maxVehicles} Fleet
              </span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all ${
                  vehicleUsagePercent >= 90 ? 'bg-rose-500' : 'bg-gradient-to-r from-amber-500 to-emerald-500'
                }`} 
                style={{ width: `${vehicleUsagePercent}%` }} 
              />
            </div>
            <div className="mt-2.5 flex items-center justify-between">
              <span className="text-[10px] text-slate-500">
                {currentTenant.isTrial ? `${currentTenant.trialDaysRemaining || 14} days trial` : 'Active plan'}
              </span>
              <button
                onClick={() => {
                  setPlanLimitResourceType('vehicles');
                  setIsPlanLimitModalOpen(true);
                }}
                className="text-[10px] font-bold text-amber-600 hover:text-amber-700 transition-colors flex items-center gap-0.5"
              >
                <span>Upgrade</span>
                <TrendingUp className="h-2.5 w-2.5" />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

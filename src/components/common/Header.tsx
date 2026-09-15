import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  Plus, 
  ChevronDown, 
  Car, 
  Calendar, 
  Sparkles, 
  Command, 
  Menu,
  Palette,
  Building2,
  Crown,
  Check,
  User,
  Shield,
  Layers,
  LogOut
} from 'lucide-react';
import { useErp, ErpTheme } from '../../context/ErpContext';
import { UserRole } from '../../types';

export const Header: React.FC<{ onOpenMobileMenu?: () => void }> = ({ onOpenMobileMenu }) => {
  const { 
    theme,
    setTheme,
    setSearchOpen, 
    notifications, 
    setActiveTab, 
    setCheckpointModalOpen, 
    setSelectedDriverForCheckpoint, 
    drivers, 
    setQuickActionModal,
    currentTenant,
    organizations,
    switchTenant,
    users,
    currentUser,
    switchUser,
    setIsOnboardingOpen,
    tenants
  } = useErp();

  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [isTenantDropdownOpen, setIsTenantDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const themes: { id: ErpTheme; name: string; color: string; desc: string }[] = [
    { id: 'bright', name: 'Royal Gold', color: 'bg-amber-500', desc: 'Warm Amber & Gold' },
    { id: 'emerald', name: 'Emerald Fleet', color: 'bg-emerald-500', desc: 'Vibrant Qatar Emerald' },
    { id: 'azure', name: 'Sapphire Sky', color: 'bg-blue-600', desc: 'Electric Royal Azure' },
    { id: 'coral', name: 'Sunset Coral', color: 'bg-rose-500', desc: 'Radiant Warm Coral' },
  ];

  const handleFastCheckpoint = () => {
    const defaultDriver = drivers.find(d => d.assignedVehicleId) || drivers[0];
    if (defaultDriver) {
      setSelectedDriverForCheckpoint(defaultDriver);
      setCheckpointModalOpen(true);
    } else {
      setQuickActionModal('add_driver');
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200/90 bg-white/95 px-4 md:px-6 backdrop-blur-md shadow-xs">
      {/* Left: Branding & Tenant Switcher */}
      <div className="flex items-center gap-3">
        {onOpenMobileMenu && (
          <button
            onClick={onOpenMobileMenu}
            className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 lg:hidden transition-colors"
            title="Toggle Navigation Menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
        
        {/* Dynamic Tenant Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setIsTenantDropdownOpen(!isTenantDropdownOpen);
              setIsUserDropdownOpen(false);
            }}
            className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50/80 p-1.5 pr-3 hover:border-amber-500/50 hover:bg-white transition-all text-left group"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 text-white font-extrabold shadow-sm ring-1 ring-amber-400/40">
              <Car className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black tracking-wide text-slate-900 group-hover:text-amber-700 transition-colors">
                  {currentTenant.name.toUpperCase()}
                </span>
                <span className="rounded bg-amber-100 px-1 py-0.2 text-[9px] font-bold text-amber-800 border border-amber-300">
                  {currentTenant.currency}
                </span>
                {currentTenant.isTrial && (
                  <span className="rounded bg-indigo-50 px-1 py-0.2 text-[9px] font-bold text-indigo-700 border border-indigo-200">
                    Trial
                  </span>
                )}
              </div>
              <p className="text-[10px] font-medium text-slate-500">
                {currentTenant.city}, {currentTenant.country} • {currentTenant.industry}
              </p>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-700 transition-transform ml-1" />
          </button>

          {/* Tenant Switcher Dropdown */}
          {isTenantDropdownOpen && (
            <div className="absolute left-0 mt-1.5 w-80 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between px-3 py-1.5 border-b border-slate-100 text-[10px] uppercase font-bold tracking-wider text-slate-400">
                <span>Select Fleet Organization</span>
                <span className="text-amber-600 font-bold">{tenants.length} Available</span>
              </div>
              <div className="mt-1 space-y-1 max-h-60 overflow-y-auto">
                {tenants.map(org => {
                  const isSelected = org.id === currentTenant.id;
                  return (
                    <button
                      key={org.id}
                      onClick={() => {
                        switchTenant(org.id);
                        setIsTenantDropdownOpen(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-xl p-2.5 text-xs text-left transition-all ${
                        isSelected
                          ? 'bg-amber-50 text-amber-950 font-bold border border-amber-200'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className={`flex h-7 w-7 items-center justify-center rounded-lg font-bold text-[11px] ${
                          isSelected ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}>
                          {org.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="truncate">
                          <p className="truncate text-xs font-semibold leading-tight">{org.name}</p>
                          <p className="text-[10px] text-slate-400 font-normal">
                            {org.city}, {org.country} • {org.currency}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-mono font-medium text-slate-600">
                          {org.planId.toUpperCase()}
                        </span>
                        {isSelected && <Check className="h-3.5 w-3.5 text-amber-600" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-2 pt-2 border-t border-slate-100 space-y-1">
                <button
                  onClick={() => {
                    setIsTenantDropdownOpen(false);
                    setIsOnboardingOpen(true);
                  }}
                  className="flex w-full items-center gap-2 rounded-xl bg-slate-900 text-white hover:bg-black px-3 py-2 text-xs font-bold transition-all shadow-xs"
                >
                  <Plus className="h-3.5 w-3.5 text-amber-400" />
                  <span>Provision New Organization...</span>
                </button>
                {currentUser.isSuperAdmin && (
                  <button
                    onClick={() => {
                      setIsTenantDropdownOpen(false);
                      setActiveTab('superadmin');
                    }}
                    className="flex w-full items-center gap-2 rounded-xl bg-purple-50 text-purple-800 hover:bg-purple-100 border border-purple-200 px-3 py-1.5 text-xs font-semibold transition-all"
                  >
                    <Crown className="h-3.5 w-3.5 text-purple-600" />
                    <span>Open Super Admin Platform Command</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Center: Global Search Bar */}
      <div className="mx-2 sm:mx-4 flex items-center justify-center">
        <button
          onClick={() => setSearchOpen(true)}
          className="flex h-8 w-44 sm:w-56 md:w-64 items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-2.5 text-xs text-slate-500 transition-all hover:border-amber-500/50 hover:bg-white hover:text-slate-800 group shadow-2xs"
          title="Search ERP (Cmd+K)"
        >
          <div className="flex items-center gap-2 min-w-0 overflow-hidden">
            <Search className="h-3.5 w-3.5 text-slate-400 group-hover:text-amber-600 transition-colors shrink-0" />
            <span className="truncate hidden sm:inline text-slate-500 group-hover:text-slate-800">Search ERP...</span>
            <span className="truncate sm:hidden text-slate-500 group-hover:text-slate-800">Search...</span>
          </div>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded bg-white px-1.5 py-0.5 text-[9px] font-mono font-medium text-slate-500 border border-slate-200 shrink-0">
            <Command className="h-2 w-2" />K
          </kbd>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Date Display */}
        <div className="hidden xl:flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200">
          <Calendar className="h-3.5 w-3.5 text-amber-600" />
          <span>{currentTenant.timezone}</span>
        </div>

        {/* Bright Theme Palette Selector */}
        <div className="relative">
          <button
            onClick={() => setIsThemeOpen(!isThemeOpen)}
            className="flex h-9 items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-2.5 text-xs font-semibold text-slate-700 hover:border-amber-500/40 hover:bg-white transition-all shadow-2xs"
            title="Switch Bright Color Palette"
          >
            <Palette className="h-4 w-4 text-amber-600" />
            <span className="hidden sm:inline">Bright</span>
          </button>

          {isThemeOpen && (
            <div className="absolute right-0 mt-1.5 w-52 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl z-50 animate-in fade-in zoom-in-95">
              <div className="px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider text-slate-400 border-b border-slate-100">
                Bright Color Themes
              </div>
              <div className="mt-1 space-y-1">
                {themes.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setTheme(t.id);
                      setIsThemeOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-xs font-medium transition-all ${
                      theme === t.id
                        ? 'bg-amber-50 text-amber-900 font-bold border border-amber-200'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`h-3 w-3 rounded-full ${t.color} shadow-xs`} />
                      <span>{t.name}</span>
                    </div>
                    {theme === t.id && <span className="text-[10px] text-amber-600 font-bold">Active</span>}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 1-Click Driver Payment Button */}
        <button
          onClick={handleFastCheckpoint}
          className="flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-3 py-2 text-xs font-bold text-white shadow-md shadow-emerald-600/20 transition-all active:scale-95"
          title="Record 15-Day Driver Payment and Odometer Checkpoint"
        >
          <Sparkles className="h-3.5 w-3.5 text-emerald-100" />
          <span className="hidden sm:inline">Pay & Checkpoint</span>
          <span className="sm:hidden">Pay</span>
        </button>

        {/* Quick Action Modal Trigger */}
        <button
          onClick={() => setQuickActionModal('add_expense')}
          className="flex items-center gap-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 px-2.5 py-2 text-xs font-semibold text-slate-700 transition-all"
          title="Quick Action"
        >
          <Plus className="h-3.5 w-3.5 text-amber-600" />
          <span className="hidden md:inline">Add</span>
        </button>

        {/* Notifications */}
        <button
          onClick={() => setActiveTab('notifications')}
          className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 hover:bg-white hover:text-slate-900 transition-all"
          title="Notifications"
        >
          <Bell className="h-4 w-4 text-slate-600" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white shadow-sm ring-2 ring-white">
              {unreadCount}
            </span>
          )}
        </button>

        {/* User Profile & Persona Switcher */}
        <div className="relative">
          <button
            onClick={() => {
              setIsUserDropdownOpen(!isUserDropdownOpen);
              setIsTenantDropdownOpen(false);
            }}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-1.5 pr-2.5 hover:border-slate-300 hover:bg-white transition-all shadow-2xs group"
          >
            <div className={`flex h-7 w-7 items-center justify-center rounded-lg font-bold text-xs border ${
              currentUser.isSuperAdmin 
                ? 'bg-purple-100 text-purple-800 border-purple-300' 
                : currentUser.role === 'driver'
                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                : 'bg-amber-500/15 text-amber-800 border-amber-500/30'
            }`}>
              {currentUser.isSuperAdmin ? <Crown className="h-4 w-4" /> : <User className="h-4 w-4" />}
            </div>
            <div className="hidden text-left xl:block">
              <p className="text-xs font-bold text-slate-900 leading-tight truncate max-w-[120px]">
                {currentUser.fullName}
              </p>
              <div className="flex items-center gap-1 text-[10px] text-amber-700 font-medium">
                <span>{currentUser.isSuperAdmin ? 'Super Admin' : currentUser.role.replace('_', ' ')}</span>
              </div>
            </div>
            <ChevronDown className="h-3 w-3 text-slate-400 group-hover:text-slate-600 transition-transform" />
          </button>

          {/* User Persona Switcher Dropdown */}
          {isUserDropdownOpen && (
            <div className="absolute right-0 mt-1.5 w-72 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95">
              <div className="px-3 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900">{currentUser.fullName}</p>
                <p className="text-[11px] text-slate-500">{currentUser.email}</p>
                <div className="mt-1 flex items-center gap-1.5">
                  <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                    {currentUser.role.replace('_', ' ').toUpperCase()}
                  </span>
                  {currentUser.isSuperAdmin && (
                    <span className="rounded bg-purple-100 px-2 py-0.5 text-[10px] font-bold text-purple-700">
                      Super Admin
                    </span>
                  )}
                </div>
              </div>

              <div className="px-3 pt-2 pb-1 text-[10px] uppercase font-bold tracking-wider text-slate-400">
                Switch Live Persona
              </div>

              <div className="space-y-1">
                {users.map(u => {
                  const isCurrent = u.id === currentUser.id;
                  return (
                    <button
                      key={u.id}
                      onClick={() => {
                        switchUser(u.id);
                        setIsUserDropdownOpen(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-xs text-left transition-all ${
                        isCurrent
                          ? 'bg-amber-50 text-amber-950 font-bold border border-amber-200'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div>
                        <p className="font-semibold text-xs leading-tight">{u.fullName}</p>
                        <p className="text-[10px] text-slate-400">
                          {u.isSuperAdmin ? 'Global Platform Admin' : u.role.replace('_', ' ')}
                        </p>
                      </div>
                      {isCurrent && <Check className="h-3.5 w-3.5 text-amber-600" />}
                    </button>
                  );
                })}
              </div>

              <div className="mt-2 pt-2 border-t border-slate-100 space-y-1">
                <button
                  onClick={() => {
                    setIsUserDropdownOpen(false);
                    setActiveTab('team');
                  }}
                  className="flex w-full items-center gap-2 rounded-xl px-2.5 py-1.5 text-xs text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <Shield className="h-3.5 w-3.5 text-slate-500" />
                  <span>Manage Team & Access</span>
                </button>
                <button
                  onClick={() => {
                    setIsUserDropdownOpen(false);
                    setActiveTab('billing');
                  }}
                  className="flex w-full items-center gap-2 rounded-xl px-2.5 py-1.5 text-xs text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <Layers className="h-3.5 w-3.5 text-slate-500" />
                  <span>Subscription & Billing</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

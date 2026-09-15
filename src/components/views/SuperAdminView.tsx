import React, { useState } from 'react';
import {
  Crown,
  Building2,
  Users,
  Car,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ExternalLink,
  Edit,
  Trash2,
  Plus,
  MessageSquare,
  Sparkles,
  RefreshCw,
  Sliders,
  Send,
  Calendar,
  Lock
} from 'lucide-react';
import { useErp } from '../../context/ErpContext';
import { Organization, OrganizationStatus, SubscriptionPlanId, SupportTicket } from '../../types';

export const SuperAdminView: React.FC = () => {
  const {
    organizations,
    currentTenant,
    switchTenant,
    updateOrganization,
    toggleTenantStatus,
    changeTenantPlan,
    deleteTenant,
    plans,
    updateSubscriptionPlan,
    supportTickets,
    replySupportTicket,
    updateTicketStatus,
    platformAnalytics,
    auditLogs,
    showToast,
    setActiveTab,
    setIsOnboardingOpen
  } = useErp();

  const [activeSubTab, setActiveSubTab] = useState<'tenants' | 'plans' | 'support' | 'audit'>('tenants');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | OrganizationStatus>('all');
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(supportTickets[0]?.id || null);
  const [ticketReplyText, setTicketReplyText] = useState('');

  // Edit Plan modal state
  const [editingPlanId, setEditingPlanId] = useState<SubscriptionPlanId | null>(null);
  const [editPriceUSD, setEditPriceUSD] = useState<number>(0);
  const [editMaxVehicles, setEditMaxVehicles] = useState<number>(0);
  const [editMaxUsers, setEditMaxUsers] = useState<number>(0);

  const filteredTenants = organizations.filter((org) => {
    const matchesSearch =
      org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.ownerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || org.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const selectedTicket = supportTickets.find((t) => t.id === selectedTicketId);

  const handleSendTicketReply = () => {
    if (!selectedTicketId || !ticketReplyText.trim()) return;
    replySupportTicket(selectedTicketId, ticketReplyText);
    setTicketReplyText('');
    showToast('Support reply dispatched to tenant.', 'success');
  };

  const handleOpenPlanEdit = (planId: SubscriptionPlanId) => {
    const p = plans.find((pl) => pl.id === planId);
    if (!p) return;
    setEditingPlanId(planId);
    setEditPriceUSD(p.monthlyPriceUSD);
    setEditMaxVehicles(p.maxVehicles);
    setEditMaxUsers(p.maxUsers);
  };

  const handleSavePlanEdit = () => {
    if (!editingPlanId) return;
    updateSubscriptionPlan(editingPlanId, {
      monthlyPriceUSD: Number(editPriceUSD),
      maxVehicles: Number(editMaxVehicles),
      maxUsers: Number(editMaxUsers)
    });
    setEditingPlanId(null);
    showToast('Plan specifications updated across the platform.', 'success');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Super Admin Executive Banner */}
      <div className="rounded-2xl border border-amber-300/80 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 p-6 text-white shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 backdrop-blur-xs ring-1 ring-white/30 shadow-md">
              <Crown className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black tracking-wide">FleetFlow SaaS Command Center</h1>
                <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white">
                  Super Admin
                </span>
              </div>
              <p className="text-xs text-amber-100 font-medium">
                Platform Multi-Tenancy Engine • Real-time Cross-Company Isolation & Fleet Metrics
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsOnboardingOpen(true)}
              className="flex items-center gap-1.5 rounded-xl bg-white px-3.5 py-2 text-xs font-bold text-amber-900 shadow-md hover:bg-amber-50 transition-colors"
            >
              <Plus className="h-4 w-4" /> Provision New Company
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-1.5 rounded-xl border border-white/30 bg-white/10 px-3.5 py-2 text-xs font-semibold text-white hover:bg-white/20 transition-colors"
            >
              <ExternalLink className="h-4 w-4" /> Back to Company ERP
            </button>
          </div>
        </div>

        {/* High-Level Platform KPIs */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="rounded-xl bg-white/10 p-3 backdrop-blur-xs border border-white/15">
            <div className="flex items-center gap-1.5 text-[11px] text-amber-100 font-medium">
              <DollarSign className="h-3.5 w-3.5" /> Platform MRR
            </div>
            <div className="text-lg font-black font-mono mt-1">${platformAnalytics.mrrUSD.toLocaleString()}</div>
            <div className="text-[10px] text-emerald-300 font-semibold flex items-center gap-0.5 mt-0.5">
              <TrendingUp className="h-2.5 w-2.5" /> +{platformAnalytics.revenueGrowthMoMPercent}% MoM
            </div>
          </div>

          <div className="rounded-xl bg-white/10 p-3 backdrop-blur-xs border border-white/15">
            <div className="flex items-center gap-1.5 text-[11px] text-amber-100 font-medium">
              <Building2 className="h-3.5 w-3.5" /> Total Companies
            </div>
            <div className="text-lg font-black font-mono mt-1">{organizations.length}</div>
            <div className="text-[10px] text-amber-200 mt-0.5">Across {new Set(organizations.map(o => o.country)).size} Countries</div>
          </div>

          <div className="rounded-xl bg-white/10 p-3 backdrop-blur-xs border border-white/15">
            <div className="flex items-center gap-1.5 text-[11px] text-amber-100 font-medium">
              <CheckCircle2 className="h-3.5 w-3.5" /> Active Paid
            </div>
            <div className="text-lg font-black font-mono mt-1 text-emerald-200">
              {organizations.filter(o => o.status === 'active').length}
            </div>
            <div className="text-[10px] text-amber-200 mt-0.5">Subscribed</div>
          </div>

          <div className="rounded-xl bg-white/10 p-3 backdrop-blur-xs border border-white/15">
            <div className="flex items-center gap-1.5 text-[11px] text-amber-100 font-medium">
              <Sparkles className="h-3.5 w-3.5" /> Free Trials
            </div>
            <div className="text-lg font-black font-mono mt-1 text-amber-200">
              {organizations.filter(o => o.status === 'trial').length}
            </div>
            <div className="text-[10px] text-amber-200 mt-0.5">14-Day Trials</div>
          </div>

          <div className="rounded-xl bg-white/10 p-3 backdrop-blur-xs border border-white/15">
            <div className="flex items-center gap-1.5 text-[11px] text-amber-100 font-medium">
              <Car className="h-3.5 w-3.5" /> Total Vehicles
            </div>
            <div className="text-lg font-black font-mono mt-1">{platformAnalytics.totalVehiclesMonitored}</div>
            <div className="text-[10px] text-amber-200 mt-0.5">Live On Odometer</div>
          </div>

          <div className="rounded-xl bg-white/10 p-3 backdrop-blur-xs border border-white/15">
            <div className="flex items-center gap-1.5 text-[11px] text-amber-100 font-medium">
              <Users className="h-3.5 w-3.5" /> Active Drivers
            </div>
            <div className="text-lg font-black font-mono mt-1">{platformAnalytics.totalActiveDrivers}</div>
            <div className="text-[10px] text-amber-200 mt-0.5">15-Day Cycles</div>
          </div>
        </div>
      </div>

      {/* Sub-Tab Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveSubTab('tenants')}
            className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
              activeSubTab === 'tenants'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <Building2 className="h-4 w-4" /> Companies Directory ({organizations.length})
          </button>
          <button
            onClick={() => setActiveSubTab('plans')}
            className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
              activeSubTab === 'plans'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <Sliders className="h-4 w-4" /> SaaS Plans & Pricing ({plans.length})
          </button>
          <button
            onClick={() => setActiveSubTab('support')}
            className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
              activeSubTab === 'support'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <MessageSquare className="h-4 w-4" /> Support Desk ({supportTickets.length})
          </button>
          <button
            onClick={() => setActiveSubTab('audit')}
            className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
              activeSubTab === 'audit'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <ShieldCheck className="h-4 w-4" /> Global Audit Logs
          </button>
        </div>

        {activeSubTab === 'tenants' && (
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search companies, country, email..."
                className="rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-1.5 text-xs focus:border-amber-500 focus:outline-hidden w-64 shadow-2xs"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs focus:border-amber-500 focus:outline-hidden shadow-2xs"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Paid</option>
              <option value="trial">Free Trial</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        )}
      </div>

      {/* TAB 1: Companies Directory */}
      {activeSubTab === 'tenants' && (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50 font-bold uppercase tracking-wider text-slate-500 text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Company Name & Legal</th>
                  <th className="py-3.5 px-4">Location & Base</th>
                  <th className="py-3.5 px-4">Current Plan</th>
                  <th className="py-3.5 px-4">Tenant Status</th>
                  <th className="py-3.5 px-4">Currency</th>
                  <th className="py-3.5 px-4">Active Since</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTenants.map((org) => {
                  const isCurrent = currentTenant.id === org.id;
                  const planObj = plans.find((p) => p.id === org.planId);

                  return (
                    <tr key={org.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="flex h-9 w-9 items-center justify-center rounded-xl font-black text-white text-xs shadow-xs"
                            style={{ backgroundColor: org.primaryColor || '#d97706' }}
                          >
                            {org.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-extrabold text-slate-900">{org.name}</span>
                              {isCurrent && (
                                <span className="rounded-full bg-amber-100 text-amber-800 border border-amber-200 px-1.5 py-0.2 text-[9px] font-bold">
                                  Viewing Now
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 font-mono truncate max-w-xs">{org.ownerEmail}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-800">{org.city}, {org.country}</div>
                        <div className="text-[10px] text-slate-400 capitalize">{org.industry.replace('_', ' ')}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <select
                          value={org.planId}
                          onChange={(e) => changeTenantPlan(org.id, e.target.value as SubscriptionPlanId)}
                          className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-bold text-slate-700 shadow-2xs"
                        >
                          {plans.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name} (${p.monthlyPriceUSD}/mo)
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase border ${
                              org.status === 'active'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : org.status === 'trial'
                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                : 'bg-rose-50 text-rose-700 border-rose-200'
                            }`}
                          >
                            {org.status === 'active' && <CheckCircle2 className="h-2.5 w-2.5" />}
                            {org.status === 'trial' && <Sparkles className="h-2.5 w-2.5" />}
                            {org.status === 'suspended' && <XCircle className="h-2.5 w-2.5" />}
                            {org.status}
                          </span>
                          {org.isTrial && (
                            <span className="text-[10px] text-amber-700 font-semibold">
                              {org.trialDaysRemaining ?? 7}d left
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold text-slate-700">
                        {org.currency} ({org.currencySymbol})
                      </td>

                      <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                        {org.createdAt.split('T')[0]}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Impersonate / Switch to Tenant ERP */}
                          <button
                            onClick={() => {
                              switchTenant(org.id);
                              setActiveTab('dashboard');
                              showToast(`Switched into ${org.name} ERP environment.`, 'info');
                            }}
                            className="rounded-lg bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 px-2.5 py-1 text-xs font-bold transition-colors shadow-2xs"
                            title="Open Tenant ERP"
                          >
                            Open ERP
                          </button>

                          {/* Toggle Active / Suspend */}
                          <button
                            onClick={() => {
                              const newStatus = org.status === 'suspended' ? 'active' : 'suspended';
                              toggleTenantStatus(org.id, newStatus);
                            }}
                            className={`rounded-lg px-2 py-1 text-xs font-semibold border transition-colors ${
                              org.status === 'suspended'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-rose-50 hover:text-rose-700'
                            }`}
                            title={org.status === 'suspended' ? 'Re-activate Tenant' : 'Suspend Tenant'}
                          >
                            {org.status === 'suspended' ? 'Activate' : 'Suspend'}
                          </button>

                          {/* Delete */}
                          {organizations.length > 1 && (
                            <button
                              onClick={() => {
                                if (window.confirm(`Are you sure you want to delete company ${org.name}?`)) {
                                  deleteTenant(org.id);
                                }
                              }}
                              className="rounded-lg p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                              title="Delete Tenant"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: SaaS Plans & Pricing */}
      {activeSubTab === 'plans' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {plans.map((p) => (
              <div
                key={p.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between hover:border-amber-400 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-600 uppercase">
                      {p.badge || 'Tier'}
                    </span>
                    {p.isPopular && (
                      <span className="rounded-full bg-amber-500 px-2.5 py-0.5 text-[10px] font-extrabold text-white uppercase">
                        Most Popular
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900 mt-2">{p.name}</h3>
                  <p className="text-xs text-slate-500 mt-1 min-h-[36px]">{p.description}</p>

                  <div className="my-4 font-mono">
                    <span className="text-2xl font-black text-slate-900">${p.monthlyPriceUSD}</span>
                    <span className="text-xs text-slate-500"> / month</span>
                    <div className="text-[10px] text-emerald-600 font-semibold">
                      ${p.annualPriceUSD}/mo billed annually (-20%)
                    </div>
                  </div>

                  <div className="space-y-2 border-t border-slate-100 pt-3 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Fleet Vehicles:</span>
                      <span className="font-bold text-slate-800">{p.maxVehicles === 9999 ? 'Unlimited' : p.maxVehicles}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Drivers:</span>
                      <span className="font-bold text-slate-800">{p.maxDrivers === 9999 ? 'Unlimited' : p.maxDrivers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Staff Seats:</span>
                      <span className="font-bold text-slate-800">{p.maxUsers === 9999 ? 'Unlimited' : p.maxUsers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Finance & P&L:</span>
                      <span className="font-bold text-emerald-700">{p.features.advancedFinance ? 'Included' : 'Basic'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Custom Branding:</span>
                      <span className="font-bold text-slate-800">{p.features.customBranding ? 'Enabled' : 'No'}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleOpenPlanEdit(p.id)}
                  className="mt-4 flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700 transition-colors"
                >
                  <Edit className="h-3.5 w-3.5 text-amber-600" /> Edit Plan Limits & Price
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit Plan Modal */}
      {editingPlanId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <h3 className="text-base font-extrabold text-slate-900 mb-1">
              Edit Plan: {plans.find((p) => p.id === editingPlanId)?.name}
            </h3>
            <p className="text-xs text-slate-500 mb-4">Adjust pricing and feature capacities across the SaaS platform.</p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Monthly Price (USD $)</label>
                <input
                  type="number"
                  value={editPriceUSD}
                  onChange={(e) => setEditPriceUSD(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Max Fleet Vehicles Allowed</label>
                <input
                  type="number"
                  value={editMaxVehicles}
                  onChange={(e) => setEditMaxVehicles(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Max Staff Users</label>
                <input
                  type="number"
                  value={editMaxUsers}
                  onChange={(e) => setEditMaxUsers(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setEditingPlanId(null)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePlanEdit}
                className="rounded-xl bg-amber-500 hover:bg-amber-600 px-5 py-2 text-xs font-bold text-white shadow-xs"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Global Support Desk */}
      {activeSubTab === 'support' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Tickets List */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs space-y-2">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2">
              Tenant Support Tickets ({supportTickets.length})
            </h3>
            {supportTickets.map((ticket) => {
              const isSelected = selectedTicketId === ticket.id;
              return (
                <div
                  key={ticket.id}
                  onClick={() => setSelectedTicketId(ticket.id)}
                  className={`cursor-pointer rounded-xl p-3 border transition-all ${
                    isSelected
                      ? 'border-amber-500 bg-amber-50/60 shadow-xs'
                      : 'border-slate-100 bg-slate-50/50 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-amber-800 uppercase">{ticket.organizationName}</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[9px] font-extrabold uppercase ${
                        ticket.status === 'open'
                          ? 'bg-amber-100 text-amber-800'
                          : ticket.status === 'in_progress'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {ticket.status.replace('_', ' ')}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 mt-1 line-clamp-1">{ticket.subject}</h4>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2">
                    <span>{ticket.userName}</span>
                    <span>{ticket.createdAt.split('T')[0]}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Ticket Conversation View */}
          <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between">
            {selectedTicket ? (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700">
                      {selectedTicket.organizationName} • {selectedTicket.category.replace('_', ' ')}
                    </span>
                    <h3 className="text-sm font-extrabold text-slate-900 mt-0.5">{selectedTicket.subject}</h3>
                    <p className="text-xs text-slate-500">Opened by {selectedTicket.userName} ({selectedTicket.userEmail})</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={selectedTicket.status}
                      onChange={(e) => updateTicketStatus(selectedTicket.id, e.target.value as any)}
                      className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-bold text-slate-700"
                    >
                      <option value="open">Open</option>
                      <option value="in_progress">In Progress</option>
                      <option value="waiting">Waiting for Tenant</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                </div>

                {/* Messages Thread */}
                <div className="my-4 space-y-3 max-h-80 overflow-y-auto pr-1">
                  {selectedTicket.messages.map((msg) => {
                    const isSupport = msg.senderRole === 'super_admin' || msg.senderRole === 'support_agent';
                    return (
                      <div
                        key={msg.id}
                        className={`rounded-xl p-3.5 text-xs max-w-xl ${
                          isSupport
                            ? 'ml-auto bg-amber-50 border border-amber-200 text-amber-950'
                            : 'bg-slate-100 text-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold mb-1 text-[10px]">
                          <span>{msg.senderName} ({isSupport ? 'Super Admin' : 'Tenant'})</span>
                          <span className="text-slate-400 font-normal">{msg.timestamp.split('T')[0]}</span>
                        </div>
                        <p className="leading-relaxed">{msg.message}</p>
                      </div>
                    );
                  })}
                </div>

                {/* Reply Input */}
                <div className="border-t border-slate-100 pt-3 flex gap-2">
                  <input
                    type="text"
                    value={ticketReplyText}
                    onChange={(e) => setTicketReplyText(e.target.value)}
                    placeholder="Type official support reply to tenant..."
                    className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-amber-500 focus:outline-hidden"
                    onKeyDown={(e) => e.key === 'Enter' && handleSendTicketReply()}
                  />
                  <button
                    onClick={handleSendTicketReply}
                    className="flex items-center gap-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 px-4 py-2 text-xs font-bold text-white shadow-xs"
                  >
                    <Send className="h-3.5 w-3.5" /> Send Reply
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex h-64 items-center justify-center text-xs text-slate-400">
                Select a support ticket to review the conversation.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: Global Audit Logs */}
      {activeSubTab === 'audit' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">Platform Security & Activity Trail</h3>
              <p className="text-xs text-slate-500">Immutable ledger of administrative actions, checkpoints, and tenant updates.</p>
            </div>
            <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
              {auditLogs.length} Records Logged
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-100 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">User & Role</th>
                  <th className="py-2.5 px-3">Action</th>
                  <th className="py-2.5 px-3">Module / Entity</th>
                  <th className="py-2.5 px-3">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {auditLogs.slice(0, 25).map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/60">
                    <td className="py-2.5 px-3 font-mono text-slate-400 text-[11px] whitespace-nowrap">
                      {log.timestamp}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-slate-800 whitespace-nowrap">
                      {log.userName}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase text-slate-700">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-amber-700">{log.entity}</td>
                    <td className="py-2.5 px-3 text-slate-600 max-w-md truncate">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

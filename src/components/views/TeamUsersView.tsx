import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Shield,
  Mail,
  CheckCircle2,
  Trash2,
  Lock,
  KeyRound,
  X,
  Sparkles
} from 'lucide-react';
import { useErp } from '../../context/ErpContext';
import { UserRole } from '../../types';

export const TeamUsersView: React.FC = () => {
  const {
    users,
    currentTenant,
    plans,
    inviteTenantUser,
    removeTenantUser,
    currentUser,
    showToast,
    canAddUser,
    setIsPlanLimitModalOpen,
    setPlanLimitResourceType
  } = useErp();

  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<UserRole>('operations_manager');

  const currentPlan = plans.find((p) => p.id === currentTenant.planId) || plans[0];

  // Filter users belonging to current tenant
  const tenantUsers = users.filter((u) =>
    u.memberships.some((m) => m.organizationId === currentTenant.id) || u.isSuperAdmin
  );

  const handleOpenInvite = () => {
    if (!canAddUser()) {
      setPlanLimitResourceType('users');
      setIsPlanLimitModalOpen(true);
      return;
    }
    setIsInviteOpen(true);
  };

  const handleSendInvite = () => {
    if (!inviteName.trim() || !inviteEmail.trim()) {
      showToast('Please enter both name and email', 'warning');
      return;
    }

    const res = inviteTenantUser({
      fullName: inviteName,
      email: inviteEmail,
      role: inviteRole
    });

    if (res.success) {
      showToast(`Invited ${inviteName} as ${inviteRole.replace('_', ' ')}!`, 'success');
      setIsInviteOpen(false);
      setInviteName('');
      setInviteEmail('');
    } else {
      showToast(res.error || 'Failed to invite user', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-amber-100 text-amber-900 border border-amber-200 px-2.5 py-0.5 text-[10px] font-extrabold uppercase">
              {currentTenant.name} Staff
            </span>
            <span className="text-xs text-slate-500">
              {tenantUsers.length} of {currentPlan.maxUsers === 9999 ? 'Unlimited' : currentPlan.maxUsers} seats filled
            </span>
          </div>
          <h1 className="text-xl font-black text-slate-900 mt-1">Team & Access Control</h1>
          <p className="text-xs text-slate-500">
            Invite dispatchers, accountants, and coordinators with fine-grained role permissions.
          </p>
        </div>

        <button
          onClick={handleOpenInvite}
          className="flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-600 px-4 py-2.5 text-xs font-extrabold text-white shadow-sm transition-colors self-start sm:self-auto"
        >
          <UserPlus className="h-4 w-4" /> Invite Team Member
        </button>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-100 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="py-3 px-4">Member Name</th>
                <th className="py-3 px-4">Email Address</th>
                <th className="py-3 px-4">Assigned Role</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Last Active</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tenantUsers.map((u) => {
                const membership = u.memberships.find((m) => m.organizationId === currentTenant.id);
                const role = membership?.role || (u.isSuperAdmin ? 'super_admin' : 'company_admin');
                const isYou = u.id === currentUser.id;

                return (
                  <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 font-bold text-amber-900 text-xs">
                          {u.fullName.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-extrabold text-slate-900">{u.fullName}</span>
                            {isYou && (
                              <span className="rounded bg-amber-100 px-1.5 py-0.2 text-[9px] font-bold text-amber-800">
                                You
                              </span>
                            )}
                          </div>
                          {u.isSuperAdmin && (
                            <span className="text-[10px] font-bold text-amber-600">Platform Super Admin</span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-600">{u.email}</td>

                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 border border-slate-200 px-2.5 py-0.5 text-[10px] font-bold uppercase text-slate-700">
                        <Shield className="h-3 w-3 text-amber-600" />
                        {role.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-extrabold uppercase text-emerald-700">
                        <CheckCircle2 className="h-2.5 w-2.5" />
                        {u.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px]">
                      {u.lastLoginAt ? u.lastLoginAt.split('T')[0] : 'Just now'}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {!isYou && !u.isSuperAdmin && (
                        <button
                          onClick={() => {
                            if (window.confirm(`Remove access for ${u.fullName}?`)) {
                              removeTenantUser(u.id);
                              showToast(`Removed access for ${u.fullName}`, 'info');
                            }
                          }}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                          title="Remove user"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Matrix Overview */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <h3 className="text-sm font-extrabold text-slate-900 mb-1">Role Permissions Breakdown</h3>
        <p className="text-xs text-slate-500 mb-4">How permissions are enforced across your organization.</p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div className="rounded-xl border border-slate-200 p-3 bg-slate-50">
            <h4 className="font-extrabold text-slate-900 flex items-center gap-1.5 mb-1">
              <Shield className="h-3.5 w-3.5 text-amber-600" /> Company Admin
            </h4>
            <p className="text-slate-500 text-[11px]">Full access to all fleet modules, financial accounts, team management, and billing settings.</p>
          </div>

          <div className="rounded-xl border border-slate-200 p-3 bg-slate-50">
            <h4 className="font-extrabold text-slate-900 flex items-center gap-1.5 mb-1">
              <Shield className="h-3.5 w-3.5 text-amber-600" /> Operations Manager
            </h4>
            <p className="text-slate-500 text-[11px]">Fleet tracking, driver assignments, continuous odometer verification, and maintenance records.</p>
          </div>

          <div className="rounded-xl border border-slate-200 p-3 bg-slate-50">
            <h4 className="font-extrabold text-slate-900 flex items-center gap-1.5 mb-1">
              <Shield className="h-3.5 w-3.5 text-amber-600" /> Accountant
            </h4>
            <p className="text-slate-500 text-[11px]">15-Day driver payments, corporate customer invoices, expenses, bank accounts, and P&L reports.</p>
          </div>

          <div className="rounded-xl border border-slate-200 p-3 bg-slate-50">
            <h4 className="font-extrabold text-slate-900 flex items-center gap-1.5 mb-1">
              <Shield className="h-3.5 w-3.5 text-amber-600" /> Driver Portal
            </h4>
            <p className="text-slate-500 text-[11px]">Dedicated mobile view for personal vehicle assignments, payment receipts, and odometer submissions.</p>
          </div>
        </div>
      </div>

      {/* Invite Member Modal */}
      {isInviteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-800 font-bold">
                  <UserPlus className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Invite Team Member</h3>
                  <p className="text-xs text-slate-500">Add staff to {currentTenant.name}</p>
                </div>
              </div>
              <button
                onClick={() => setIsInviteOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  placeholder="e.g. Khalid Mansoor"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-amber-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-amber-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Organizational Role</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as any)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-amber-500 focus:outline-hidden"
                >
                  <option value="operations_manager">Operations Manager</option>
                  <option value="accountant">Accountant</option>
                  <option value="fleet_coordinator">Fleet Coordinator</option>
                  <option value="company_admin">Company Administrator</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setIsInviteOpen(false)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSendInvite}
                className="rounded-xl bg-amber-500 hover:bg-amber-600 px-5 py-2 text-xs font-bold text-white shadow-xs"
              >
                Send Invitation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

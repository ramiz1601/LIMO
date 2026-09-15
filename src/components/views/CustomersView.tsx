import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Building2, 
  User, 
  Phone, 
  Mail, 
  CreditCard, 
  FileText, 
  ShieldCheck, 
  Calendar, 
  X 
} from 'lucide-react';
import { useErp } from '../../context/ErpContext';
import { Customer } from '../../types';

export const CustomersView: React.FC = () => {
  const { customers, rentals, addCustomer, showToast, setActiveTab } = useErp();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'corporate' | 'individual'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Customer Form State
  const [name, setName] = useState('');
  const [type, setType] = useState<'individual' | 'corporate'>('corporate');
  const [contactPerson, setContactPerson] = useState('');
  const [mobile, setMobile] = useState('+974 ');
  const [email, setEmail] = useState('');
  const [qidOrCr, setQidOrCr] = useState('');
  const [address, setAddress] = useState('Doha, Qatar');

  const filteredCustomers = customers.filter(c => {
    if (filterType !== 'all' && c.type !== filterType) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.mobile.includes(q) ||
        c.qidOrCr.toLowerCase().includes(q) ||
        (c.contactPerson && c.contactPerson.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !mobile.trim()) {
      showToast('Please fill in required customer details', 'error');
      return;
    }

    addCustomer({
      name,
      type,
      contactPerson: type === 'corporate' ? contactPerson : undefined,
      mobile,
      email,
      qidOrCr,
      address
    });

    showToast('Customer registered successfully', 'success');
    setIsAddModalOpen(false);
    setName('');
    setContactPerson('');
    setMobile('+974 ');
    setEmail('');
    setQidOrCr('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900">Customers & VIP Corporate Accounts</h1>
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-mono font-bold text-emerald-800 border border-emerald-200">
              {customers.length} Accounts
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage corporate client accounts, executive VIP bookings, Qatar CR numbers, and credit balances.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition-all active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Client</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-500 block">Corporate Accounts</span>
          <div className="text-2xl font-black font-mono text-slate-900 mt-1">
            {customers.filter(c => c.type === 'corporate').length} Companies
          </div>
          <span className="text-xs text-slate-500 block mt-1">Hotels, Embassies & Oil/Gas</span>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-amber-800 block">Individual VIP Clients</span>
          <div className="text-2xl font-black font-mono text-amber-800 mt-1">
            {customers.filter(c => c.type === 'individual').length} Individuals
          </div>
          <span className="text-xs text-slate-500 block mt-1">Direct Chauffeur Service</span>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-emerald-700 block">Total Active Rentals</span>
          <div className="text-2xl font-black font-mono text-emerald-700 mt-1">
            {rentals.length} Active Contracts
          </div>
          <span className="text-xs text-slate-500 block mt-1">
            QAR {rentals.reduce((sum, r) => sum + r.totalAmount, 0).toLocaleString()} Value
          </span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by company, name, phone, CR/QID..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white pl-9 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:outline-none font-medium"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {(['all', 'corporate', 'individual'] as const).map(t => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold whitespace-nowrap transition-all ${
                filterType === t
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              {t === 'all' ? 'All Clients' : t === 'corporate' ? 'Corporate' : 'Individual'}
            </button>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {customers.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500 space-y-3">
          <Users className="h-10 w-10 text-slate-300 mx-auto" />
          <div className="font-bold text-slate-700 text-base">No client accounts created yet</div>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Register corporate partners and VIP individuals to issue rental agreements and invoices.
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 text-white font-bold text-xs hover:bg-amber-600 transition-colors shadow-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add First Client</span>
          </button>
        </div>
      ) : filteredCustomers.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-xs text-slate-500">
          No clients match the search criteria.
        </div>
      ) : (
        /* Customers Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCustomers.map(c => {
            const activeCustomerRentals = rentals.filter(r => r.customerId === c.id);

            return (
              <div
                key={c.id}
                className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50 text-amber-700 border border-amber-200">
                        {c.type === 'corporate' ? <Building2 className="h-5 w-5" /> : <User className="h-5 w-5" />}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm leading-tight">{c.name}</h3>
                        <span className="text-[10px] text-slate-500 capitalize">
                          {c.type} Client
                        </span>
                      </div>
                    </div>

                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${
                      c.type === 'corporate'
                        ? 'bg-blue-50 text-blue-800 border-blue-200'
                        : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    }`}>
                      {c.type}
                    </span>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-3 border border-slate-200 mb-3 space-y-1.5 text-xs">
                    {c.contactPerson && (
                      <div className="flex justify-between">
                        <span className="text-slate-500">Contact Person</span>
                        <span className="text-slate-800 font-bold">{c.contactPerson}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-slate-500">Mobile</span>
                      <span className="text-slate-800 font-mono font-medium">{c.mobile}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Qatar CR / QID</span>
                      <span className="text-amber-800 font-mono font-bold">{c.qidOrCr}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Address</span>
                      <span className="text-slate-700 truncate max-w-[140px]">{c.address}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                    <div className="rounded-xl bg-slate-50 p-2 border border-slate-200">
                      <span className="text-[10px] text-slate-500 block">Total Rentals</span>
                      <span className="font-mono font-bold text-slate-900 text-sm">
                        {activeCustomerRentals.length || c.totalRentals}
                      </span>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-2 border border-slate-200">
                      <span className="text-[10px] text-slate-500 block">Outstanding</span>
                      <span className={`font-mono font-bold text-sm ${c.outstandingBalance > 0 ? 'text-amber-800' : 'text-emerald-700'}`}>
                        QAR {c.outstandingBalance.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => setActiveTab('rentals')}
                    className="rounded-xl bg-slate-100 hover:bg-slate-200 px-3 py-1.5 text-xs font-bold text-slate-800 transition-colors shadow-2xs"
                  >
                    View Rentals ({activeCustomerRentals.length})
                  </button>
                  <a
                    href={`tel:${c.mobile}`}
                    className="rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 px-3 py-1.5 text-xs font-bold transition-colors flex items-center gap-1 shadow-2xs"
                  >
                    <Phone className="h-3 w-3" /> Call
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Client Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h2 className="text-base font-bold text-slate-900">Register Client Account</h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-xl p-1 text-slate-400 hover:text-slate-800 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Client Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setType('corporate')}
                    className={`py-2 rounded-xl font-bold border transition-all ${
                      type === 'corporate'
                        ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Corporate Company
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('individual')}
                    className={`py-2 rounded-xl font-bold border transition-all ${
                      type === 'individual'
                        ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Individual VIP
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  {type === 'corporate' ? 'Company / Establishment Name' : 'Full Legal Name'}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder={type === 'corporate' ? 'e.g. Al-Rayyan Hospitality W.L.L.' : 'e.g. Executive VIP Client'}
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-amber-500 focus:outline-none font-medium"
                />
              </div>

              {type === 'corporate' && (
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Contact Person Title</label>
                  <input
                    type="text"
                    value={contactPerson}
                    onChange={e => setContactPerson(e.target.value)}
                    placeholder="e.g. Corporate Transport Manager"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Qatar Mobile</label>
                  <input
                    type="text"
                    value={mobile}
                    onChange={e => setMobile(e.target.value)}
                    required
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 font-mono focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    {type === 'corporate' ? 'CR Number' : 'Qatar ID (QID)'}
                  </label>
                  <input
                    type="text"
                    value={qidOrCr}
                    onChange={e => setQidOrCr(e.target.value)}
                    placeholder={type === 'corporate' ? 'CR-104928' : '28458600123'}
                    required
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 font-mono focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Official Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="contact@company.qa"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Address in Doha</label>
                <input
                  type="text"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-xl px-4 py-2 font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-amber-500 hover:bg-amber-600 px-5 py-2 font-bold text-white shadow-xs active:scale-95"
                >
                  Save Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

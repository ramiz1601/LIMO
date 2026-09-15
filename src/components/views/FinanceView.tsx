import React, { useState } from 'react';
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  Building2, 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownRight, 
  Receipt, 
  FileText,
  DollarSign,
  PieChart
} from 'lucide-react';
import { useErp } from '../../context/ErpContext';
import { ExpenseCategory } from '../../types';

export const FinanceView: React.FC = () => {
  const { 
    accounts, 
    expenses, 
    transactions, 
    payments, 
    rentals, 
    setQuickActionModal 
  } = useErp();

  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'ledger' | 'expenses'>('overview');
  const [expenseFilter, setExpenseFilter] = useState<'all' | ExpenseCategory>('all');

  const totalBankBalance = accounts.reduce((sum, a) => sum + a.balance, 0);
  
  // Real-time calculation from transactions & records
  const driverRentRevenue = payments.reduce((sum, p) => sum + (p.amountPaid || 0), 0);
  const corporateRentalsRevenue = rentals.reduce((sum, r) => sum + (r.totalRentalAmount || (r as any).totalAmount || 0), 0);
  const totalRevenue = driverRentRevenue + corporateRentalsRevenue;
  const totalExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
  const netProfit = totalRevenue - totalExpenses;

  // Breakdown of expenses
  const fleetExpenses = expenses
    .filter(e => e.category === 'fleet')
    .reduce((sum, e) => sum + e.amount, 0);
  const officeExpenses = expenses
    .filter(e => e.category === 'office_admin')
    .reduce((sum, e) => sum + e.amount, 0);
  const employeeExpenses = expenses
    .filter(e => e.category === 'employees')
    .reduce((sum, e) => sum + e.amount, 0);
  const operationsExpenses = expenses
    .filter(e => e.category === 'operations')
    .reduce((sum, e) => sum + e.amount, 0);

  const filteredExpenses = expenses.filter(e => {
    if (expenseFilter !== 'all' && e.category !== expenseFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900">Financial Management & Accounts</h1>
            <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-mono font-bold text-blue-800 border border-blue-200">
              QAR Currency (State of Qatar)
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            General ledger, QNB/CBQ bank accounts, operating expenses, and driver revenue reconciliation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setQuickActionModal('add_expense')}
            className="flex items-center gap-2 rounded-xl bg-rose-600 hover:bg-rose-700 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition-all active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span>Record New Expense</span>
          </button>
        </div>
      </div>

      {/* Account Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {accounts.map(acc => (
          <div
            key={acc.id}
            className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-xs"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">
                  {acc.bankName}
                </span>
                <h3 className="font-bold text-slate-900 text-sm mt-0.5">{acc.name}</h3>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
                {acc.type === 'bank' ? <Building2 className="h-4 w-4" /> : <Wallet className="h-4 w-4" />}
              </div>
            </div>

            <div className="text-2xl font-black font-mono text-slate-900 mt-1">
              QAR {acc.balance.toLocaleString()}
            </div>

            <div className="text-[10px] font-mono text-slate-400 mt-2 truncate">
              {acc.iban || acc.accountNumber}
            </div>
          </div>
        ))}
      </div>

      {/* Subtabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2 text-xs">
        <button
          onClick={() => setActiveSubTab('overview')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
            activeSubTab === 'overview' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          P&L Overview
        </button>
        <button
          onClick={() => setActiveSubTab('ledger')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
            activeSubTab === 'ledger' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          General Ledger ({transactions.length})
        </button>
        <button
          onClick={() => setActiveSubTab('expenses')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
            activeSubTab === 'expenses' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Operating Expenses ({expenses.length})
        </button>
      </div>

      {/* 1. P&L Overview */}
      {activeSubTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Income Statement Table */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 mb-4">
              Real-Time Profit & Loss Statement (Active Cycle)
            </h3>

            <div className="space-y-4 text-xs">
              <div className="border-b border-slate-100 pb-3">
                <div className="flex justify-between font-bold text-slate-900 text-sm mb-1">
                  <span>Gross Limousine Fleet Revenue</span>
                  <span className="font-mono text-emerald-700">QAR {totalRevenue.toLocaleString()}</span>
                </div>
                <div className="pl-3 space-y-1 text-slate-500 text-[11px]">
                  <div className="flex justify-between">
                    <span>• Driver 15-Day Cycle Vehicle Rent Collected</span>
                    <span className="font-mono text-slate-800">QAR {driverRentRevenue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>• Corporate & VIP Customer Rentals</span>
                    <span className="font-mono text-slate-800">QAR {corporateRentalsRevenue.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="border-b border-slate-100 pb-3">
                <div className="flex justify-between font-bold text-slate-900 text-sm mb-1">
                  <span>Operating Expenses</span>
                  <span className="font-mono text-rose-600">QAR {totalExpenses.toLocaleString()}</span>
                </div>
                <div className="pl-3 space-y-1 text-slate-500 text-[11px]">
                  <div className="flex justify-between">
                    <span>• Employee Salaries & Qatar WPS</span>
                    <span className="font-mono text-slate-800">QAR {employeeExpenses.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>• Fleet Maintenance, Garages & Tires</span>
                    <span className="font-mono text-slate-800">QAR {fleetExpenses.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>• Office Rent & Utilities</span>
                    <span className="font-mono text-slate-800">QAR {officeExpenses.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>• Operations & Commercial Permits</span>
                    <span className="font-mono text-slate-800">QAR {operationsExpenses.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-between items-center text-sm font-black">
                <span className="text-slate-900">Net Operating Margin</span>
                <span className={`font-mono text-lg ${netProfit >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                  QAR {netProfit.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Expense Category Breakdown Card */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 mb-4">
              Core Expense Categories Breakdown
            </h3>

            <div className="space-y-4 text-xs">
              <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-200">
                <div className="flex justify-between font-bold text-slate-900 mb-1">
                  <span>1. Employees & Payroll</span>
                  <span className="font-mono text-amber-800">QAR {employeeExpenses.toLocaleString()}</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Operations manager, fleet dispatcher, accountant, and Qatar Ministry WPS automated payroll compliance.
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-200">
                <div className="flex justify-between font-bold text-slate-900 mb-1">
                  <span>2. Fleet & Vehicles</span>
                  <span className="font-mono text-amber-800">QAR {fleetExpenses.toLocaleString()}</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Garage services, Bridgestone tire replacements, WOQOD fuel card replenishment, annual Istimara fees.
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-200">
                <div className="flex justify-between font-bold text-slate-900 mb-1">
                  <span>3. Office & Administration</span>
                  <span className="font-mono text-amber-800">QAR {officeExpenses.toLocaleString()}</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Includes C-Ring road office rent, Kahramaa water & electricity, Ooredoo fiber internet, office supplies.
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-200">
                <div className="flex justify-between font-bold text-slate-900 mb-1">
                  <span>4. Operations & Commercial</span>
                  <span className="font-mono text-amber-800">QAR {operationsExpenses.toLocaleString()}</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Limousine company digital marketing, municipality signage permits, and miscellaneous courier.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. General Ledger Table */}
      {activeSubTab === 'ledger' && (
        <div className="rounded-3xl border border-slate-200 bg-white p-4 overflow-x-auto shadow-xs">
          {transactions.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No transactions recorded in the general ledger yet.
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-100 text-slate-500 uppercase text-[10px] font-bold">
                <tr>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Type</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Description</th>
                  <th className="pb-3">Account</th>
                  <th className="pb-3 text-right">Amount</th>
                  <th className="pb-3 text-right">Balance After</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.map(entry => {
                  const isIncome = entry.type === 'income';
                  return (
                    <tr key={entry.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 font-mono text-slate-500">{entry.date}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                          isIncome
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-rose-100 text-rose-800 border border-rose-200'
                        }`}>
                          {entry.type}
                        </span>
                      </td>
                      <td className="py-3 text-slate-700">{entry.category}</td>
                      <td className="py-3 text-slate-900 font-bold">{entry.description}</td>
                      <td className="py-3 text-slate-600">{entry.account}</td>
                      <td className="py-3 text-right font-mono font-bold">
                        <span className={isIncome ? 'text-emerald-700' : 'text-rose-600'}>
                          {isIncome ? '+' : '-'}QAR {entry.amount.toLocaleString()}
                        </span>
                      </td>
                      <td className="py-3 text-right font-mono text-slate-800 font-medium">
                        {entry.balanceAfter !== undefined ? `QAR ${entry.balanceAfter.toLocaleString()}` : '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* 3. Operating Expenses Table */}
      {activeSubTab === 'expenses' && (
        <div className="space-y-4">
          <div className="flex gap-2 text-xs">
            {(['all', 'office_admin', 'fleet', 'employees', 'operations'] as const).map(cat => (
              <button
                key={cat}
                onClick={() => setExpenseFilter(cat)}
                className={`px-3 py-1.5 rounded-xl font-bold capitalize transition-all ${
                  expenseFilter === cat ? 'bg-amber-500 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                {cat.replace('_', ' ')}
              </button>
            ))}
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-4 overflow-x-auto shadow-xs">
            {filteredExpenses.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No operating expenses logged in this category.
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-100 text-slate-500 uppercase text-[10px] font-bold">
                  <tr>
                    <th className="pb-3">Date</th>
                    <th className="pb-3">Title / Subcategory</th>
                    <th className="pb-3">Category</th>
                    <th className="pb-3">Vendor</th>
                    <th className="pb-3">Paid From</th>
                    <th className="pb-3 text-right">Amount</th>
                    <th className="pb-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredExpenses.map(exp => (
                    <tr key={exp.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 font-mono text-slate-500">{exp.date}</td>
                      <td className="py-3 font-bold text-slate-900">
                        {exp.subcategory}
                        {exp.vehiclePlate && (
                          <span className="ml-2 px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-amber-100 text-amber-900 border border-amber-200">
                            {exp.vehiclePlate}
                          </span>
                        )}
                      </td>
                      <td className="py-3 capitalize text-slate-700">{exp.category.replace('_', ' ')}</td>
                      <td className="py-3 text-slate-600">{exp.vendor}</td>
                      <td className="py-3 text-slate-600">{exp.paymentAccount}</td>
                      <td className="py-3 text-right font-mono font-bold text-rose-600">
                        QAR {exp.amount.toLocaleString()}
                      </td>
                      <td className="py-3 text-center">
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          {exp.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

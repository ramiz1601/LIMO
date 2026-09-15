import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Download, 
  Printer, 
  TrendingUp, 
  TrendingDown, 
  Car, 
  Users, 
  DollarSign, 
  Calendar,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { useErp } from '../../context/ErpContext';

export const ReportsView: React.FC = () => {
  const { vehicles, drivers, payments, expenses, rentals, settings, showToast } = useErp();
  const [reportPeriod, setReportPeriod] = useState('September 2026');

  const driverRevenue = payments.reduce((sum, p) => sum + (p.amountPaid || 0), 0);
  const corporateRevenue = rentals.reduce((sum, r) => sum + (r.totalRentalAmount || (r as any).totalAmount || 0), 0);
  const totalRevenue = driverRevenue + corporateRevenue;
  const totalExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
  const netMargin = totalRevenue - totalExpenses;

  // Collection efficiency
  const totalDue = payments.reduce((sum, p) => sum + (p.amountDue || 0), 0);
  const collectionRate = totalDue > 0 ? Math.min(100, Math.round((driverRevenue / totalDue) * 100)) : 100;

  const handleExportCsv = () => {
    let csv = 'Report,Period,Category,Amount_QAR\n';
    csv += `Limousine ERP Financial Summary,${reportPeriod},Driver 15-Day Rent,${driverRevenue}\n`;
    csv += `Limousine ERP Financial Summary,${reportPeriod},Corporate Rentals,${corporateRevenue}\n`;
    csv += `Limousine ERP Financial Summary,${reportPeriod},Total Gross Revenue,${totalRevenue}\n`;
    csv += `Limousine ERP Financial Summary,${reportPeriod},Total Operating Expenses,${totalExpenses}\n`;
    csv += `Limousine ERP Financial Summary,${reportPeriod},Net Operating Profit,${netMargin}\n\n`;

    csv += 'Driver_Name,Vehicle_Plate,Period,Amount_Due,Amount_Paid,Status,KM_Driven\n';
    payments.forEach(p => {
      csv += `"${p.driverName}","${p.plateNumber}","${p.periodLabel}",${p.amountDue},${p.amountPaid},"${p.status}",${p.kmDriven}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `FINANCIAL_REPORT_${reportPeriod.replace(/\s+/g, '_')}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Executive report exported to CSV successfully!', 'success');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900">Executive ERP Reports & Analytics</h1>
            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-mono font-bold text-amber-800 border border-amber-200">
              QAR Financials
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Audited financial health, driver collection efficiency, and fleet profit margins.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 px-3.5 py-2 text-xs font-bold text-slate-700 transition-colors shadow-2xs"
          >
            <Printer className="h-4 w-4" />
            <span>Print</span>
          </button>
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 px-4 py-2 text-xs font-bold text-white shadow-xs transition-all active:scale-95"
          >
            <Download className="h-4 w-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-500 block">Total Revenue</span>
          <div className="text-2xl font-black font-mono text-emerald-700 mt-1">
            QAR {totalRevenue.toLocaleString()}
          </div>
          <span className="text-xs text-slate-500 block mt-1">Driver rent & VIP leases</span>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-500 block">Total Expenses</span>
          <div className="text-2xl font-black font-mono text-rose-600 mt-1">
            QAR {totalExpenses.toLocaleString()}
          </div>
          <span className="text-xs text-slate-500 block mt-1">Salaries, rent & garages</span>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-500 block">Net Profit Margin</span>
          <div className={`text-2xl font-black font-mono mt-1 ${netMargin >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
            QAR {netMargin.toLocaleString()}
          </div>
          <span className="text-xs text-slate-500 block mt-1">
            {totalRevenue > 0 ? `${Math.round((netMargin / totalRevenue) * 100)}% profit margin` : '0%'}
          </span>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-amber-800 block">Collection Efficiency</span>
          <div className="text-2xl font-black font-mono text-amber-800 mt-1">
            {collectionRate}%
          </div>
          <span className="text-xs text-slate-500 block mt-1">15-day cycle on-time rate</span>
        </div>
      </div>

      {/* Performance Summary Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Driver Payment Performance */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Driver Payment Compliance ({payments.length} Payments)
            </h3>
            <span className="text-xs font-mono text-emerald-700 font-bold">
              QAR {driverRevenue.toLocaleString()} Collected
            </span>
          </div>

          <div className="space-y-3">
            {payments.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No driver cycle payments recorded yet.
              </div>
            ) : (
              payments.slice(0, 6).map(p => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-900 block">{p.driverName}</span>
                    <span className="text-[10px] text-slate-500">
                      {p.plateNumber} • {p.periodLabel}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="font-mono font-bold text-emerald-700 block">
                      QAR {p.amountPaid.toLocaleString()}
                    </span>
                    <span className={`text-[10px] font-bold uppercase ${
                      p.status === 'paid' ? 'text-emerald-700' : 'text-amber-800'
                    }`}>
                      {p.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Expense Category Audit */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Expense Allocation Breakdown
            </h3>
            <span className="text-xs font-mono text-rose-600 font-bold">
              QAR {totalExpenses.toLocaleString()} Total
            </span>
          </div>

          <div className="space-y-4 text-xs">
            {[
              { label: 'Employees & WPS Payroll', cat: 'employees', desc: 'Staff salaries, dispatchers, accountants' },
              { label: 'Fleet Maintenance & Fuel', cat: 'fleet', desc: 'Garages, tires, Woqod fuel cards, Istimara' },
              { label: 'Office & Administration', cat: 'office_admin', desc: 'C-Ring Road office rent, Kahramaa, internet' },
              { label: 'Operations & Licensing', cat: 'operations', desc: 'MOT limousine permits, municipal trade fees' }
            ].map(item => {
              const amount = expenses
                .filter(e => e.category === item.cat)
                .reduce((sum, e) => sum + e.amount, 0);
              const pct = totalExpenses > 0 ? Math.round((amount / totalExpenses) * 100) : 0;

              return (
                <div key={item.cat} className="space-y-1.5">
                  <div className="flex justify-between font-semibold text-slate-700">
                    <span>{item.label}</span>
                    <span className="font-mono text-slate-900 font-bold">QAR {amount.toLocaleString()} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                    <div
                      className="bg-amber-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-500">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

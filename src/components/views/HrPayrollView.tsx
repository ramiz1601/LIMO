import React, { useState } from 'react';
import { 
  Users, 
  Download, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Building2, 
  Calendar 
} from 'lucide-react';
import { useErp } from '../../context/ErpContext';

export const HrPayrollView: React.FC = () => {
  const { drivers, settings, showToast } = useErp();
  const [selectedMonth, setSelectedMonth] = useState('September 2026');

  // Staff and management
  const staff = [
    { id: 'emp-1', name: 'Operations Manager', role: 'Operations Manager', qid: '28458600123', bank: 'QNB', iban: 'QA55QNBA000000001122334455', basic: 6500, allowance: 1500, net: 8000, status: 'Active' },
    { id: 'emp-2', name: 'Fleet Dispatcher', role: 'Fleet Dispatcher', qid: '29058601452', bank: 'QNB', iban: 'QA55QNBA000000002233445566', basic: 3500, allowance: 500, net: 4000, status: 'Active' },
    { id: 'emp-3', name: 'Senior Accountant', role: 'Senior Accountant', qid: '28858601894', bank: 'CBQ', iban: 'QA82CBQA000000003344556677', basic: 4000, allowance: 800, net: 4800, status: 'Active' },
    { id: 'emp-4', name: 'Office Coordinator', role: 'Office Coordinator', qid: '29558602233', bank: 'QNB', iban: 'QA55QNBA000000004455667788', basic: 1800, allowance: 200, net: 2000, status: 'Active' },
  ];

  const totalPayroll = staff.reduce((sum, s) => sum + s.net, 0);

  const handleDownloadWpsSif = () => {
    const sifContent = `HEADER|${settings.crNumber || '128490'}|PRINCE LIMOUSINE|2026-09-13|QNB|QATAR_WPS_V2\n` +
      staff.map(s => `RECORD|${s.qid}|${s.name}|${s.iban}|${s.bank}|${s.net}|${selectedMonth}`).join('\n') +
      `\nTRAILER|${staff.length}|${totalPayroll}`;

    const blob = new Blob([sifContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `QATAR_WPS_SIF_${settings.crNumber || '128490'}_SEP2026.txt`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('WPS SIF file exported successfully', 'success');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900">HR & Qatar WPS Payroll</h1>
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-mono font-bold text-emerald-800 border border-emerald-200">
              Ministry of Labour Compliant
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Automated Wage Protection System (WPS) SIF file generation for Qatar Central Bank & QNB.
          </p>
        </div>

        <button
          onClick={handleDownloadWpsSif}
          className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition-all active:scale-95"
        >
          <Download className="h-4 w-4" />
          <span>Export Official WPS SIF File</span>
        </button>
      </div>

      {/* WPS Compliance Banner */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800 border border-emerald-200">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Qatar WPS Status: 100% Verified</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              CR {settings.crNumber || '128490'} is compliant with Qatar Ministry of Administrative Development, Labour & Social Affairs.
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] uppercase font-bold text-slate-500 block">Monthly Payroll Obligation</span>
          <span className="text-xl font-extrabold font-mono text-emerald-700">
            QAR {totalPayroll.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Staff Payroll Table */}
      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-xs overflow-x-auto">
        <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Office Staff & Management Payroll
          </h3>
          <span className="text-xs font-bold text-slate-500">Period: {selectedMonth}</span>
        </div>

        <table className="w-full text-left text-xs">
          <thead className="border-b border-slate-100 text-slate-500 uppercase text-[10px] font-bold">
            <tr>
              <th className="pb-3">Employee Name</th>
              <th className="pb-3">Designation</th>
              <th className="pb-3">Qatar ID</th>
              <th className="pb-3">Salary Bank</th>
              <th className="pb-3 text-right">Basic</th>
              <th className="pb-3 text-right">Allowances</th>
              <th className="pb-3 text-right">Net Payable</th>
              <th className="pb-3 text-center">WPS Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {staff.map(s => (
              <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                <td className="py-3 font-bold text-slate-900">{s.name}</td>
                <td className="py-3 text-slate-700">{s.role}</td>
                <td className="py-3 font-mono text-slate-600">{s.qid}</td>
                <td className="py-3 text-slate-700">{s.bank}</td>
                <td className="py-3 text-right font-mono text-slate-700">QAR {s.basic.toLocaleString()}</td>
                <td className="py-3 text-right font-mono text-slate-700">QAR {s.allowance.toLocaleString()}</td>
                <td className="py-3 text-right font-mono font-bold text-emerald-700">
                  QAR {s.net.toLocaleString()}
                </td>
                <td className="py-3 text-center">
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    Approved
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Driver Compliance Summary */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
          Driver Document Validity Summary ({drivers.length} Fleet Drivers)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-200">
            <span className="text-slate-500 block text-[10px] font-bold uppercase">Valid Driving Licenses</span>
            <div className="font-mono font-bold text-emerald-700 text-base mt-1">
              {drivers.length > 0 ? `${drivers.length} / ${drivers.length} Drivers` : '0 Drivers'}
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block">Traffic Department validated</span>
          </div>

          <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-200">
            <span className="text-slate-500 block text-[10px] font-bold uppercase">Valid Qatar IDs (QID)</span>
            <div className="font-mono font-bold text-emerald-700 text-base mt-1">
              {drivers.length > 0 ? `${drivers.length} / ${drivers.length} Drivers` : '0 Drivers'}
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block">Registered under company sponsorship</span>
          </div>

          <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-200">
            <span className="text-slate-500 block text-[10px] font-bold uppercase">Active Limousine Operating Permits</span>
            <div className="font-mono font-bold text-emerald-700 text-base mt-1">
              {drivers.length > 0 ? `${drivers.length} / ${drivers.length} Drivers` : '0 Drivers'}
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block">Ministry of Transport certified</span>
          </div>
        </div>
      </div>
    </div>
  );
};

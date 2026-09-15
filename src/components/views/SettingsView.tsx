import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  ShieldCheck, 
  Building2, 
  Clock, 
  History, 
  Save, 
  RefreshCw,
  AlertTriangle,
  FileSpreadsheet,
  Palette,
  Trash2,
  Sparkles
} from 'lucide-react';
import { useErp, ErpTheme } from '../../context/ErpContext';

export const SettingsView: React.FC = () => {
  const { settings, updateSettings, auditLogs, resetDatabase, theme, setTheme, showToast } = useErp();

  const [companyName, setCompanyName] = useState(settings.companyName);
  const [companyNameArabic, setCompanyNameArabic] = useState(settings.companyNameArabic);
  const [crNumber, setCrNumber] = useState(settings.crNumber);
  const [taxNumber, setTaxNumber] = useState(settings.taxNumber);
  const [address, setAddress] = useState(settings.address);
  const [phone, setPhone] = useState(settings.phone);
  const [abnormalMileageThresholdKm, setAbnormalMileageThresholdKm] = useState(settings.abnormalMileageThresholdKm);
  const [isSaved, setIsSaved] = useState(false);

  const themeOptions: { id: ErpTheme; name: string; color: string; desc: string }[] = [
    { id: 'bright', name: 'Royal Gold', color: 'bg-amber-500', desc: 'Warm amber & royal gold accents' },
    { id: 'emerald', name: 'Emerald Fleet', color: 'bg-emerald-500', desc: 'Vibrant green & Qatar jade accents' },
    { id: 'azure', name: 'Sapphire Sky', color: 'bg-blue-600', desc: 'High-contrast electric royal blue' },
    { id: 'coral', name: 'Sunset Coral', color: 'bg-rose-500', desc: 'Warm energetic coral rose' },
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      companyName,
      companyNameArabic,
      crNumber,
      taxNumber,
      address,
      phone,
      abnormalMileageThresholdKm: Number(abnormalMileageThresholdKm)
    });
    setIsSaved(true);
    showToast('Company configuration saved successfully!');
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleReset = () => {
    if (window.confirm('Delete all data and start completely fresh? This will wipe all vehicles, drivers, contracts, payments, and expenses.')) {
      resetDatabase();
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900">System Settings & Company Profile</h1>
            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-mono font-bold text-amber-800 border border-amber-200">
              CR: {settings.crNumber}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Configure company legal credentials, 15-day cycle parameters, bright color themes, and system reset.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3.5 py-2 text-xs font-bold text-rose-700 transition-colors shadow-2xs"
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span>Wipe & Start Fresh</span>
        </button>
      </div>

      {/* Bright Theme Customization Card */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-2">
          <Palette className="h-5 w-5 text-amber-600" />
          <h3 className="text-base font-bold text-slate-900">Bright Theme Color Palette</h3>
        </div>
        <p className="text-xs text-slate-500 mb-4">
          Choose your favorite vibrant color scheme. All themes are bright, crisp, and high-contrast for daylight readability.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {themeOptions.map((t) => {
            const isSelected = theme === t.id;
            return (
              <button
                key={t.id}
                onClick={() => {
                  setTheme(t.id);
                  showToast(`Theme switched to ${t.name}!`, 'info');
                }}
                className={`p-4 rounded-2xl text-left border transition-all ${
                  isSelected
                    ? 'border-amber-500 bg-amber-50/60 ring-2 ring-amber-500/20 shadow-xs'
                    : 'border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`h-4 w-4 rounded-full ${t.color} shadow-xs`} />
                    <span className="text-xs font-bold text-slate-900">{t.name}</span>
                  </div>
                  {isSelected && (
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                      Active
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500">{t.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings Form */}
        <div className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 mb-4 flex items-center gap-2">
            <Building2 className="h-4 w-4 text-amber-600" />
            <span>Company Legal Registration (Qatar Ministry of Commerce)</span>
          </h3>

          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Company Name (English)</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  className="w-full bg-white rounded-xl px-3 py-2 text-slate-900 border border-slate-300 font-medium"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Company Name (Arabic)</label>
                <input
                  type="text"
                  value={companyNameArabic}
                  onChange={e => setCompanyNameArabic(e.target.value)}
                  className="w-full bg-white rounded-xl px-3 py-2 text-amber-800 border border-slate-300 font-bold"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Commercial Registration (CR No.)</label>
                <input
                  type="text"
                  value={crNumber}
                  onChange={e => setCrNumber(e.target.value)}
                  className="w-full bg-white rounded-xl px-3 py-2 font-mono text-slate-900 border border-slate-300"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Tax Identification Number</label>
                <input
                  type="text"
                  value={taxNumber}
                  onChange={e => setTaxNumber(e.target.value)}
                  className="w-full bg-white rounded-xl px-3 py-2 font-mono text-slate-900 border border-slate-300"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Head Office Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="w-full bg-white rounded-xl px-3 py-2 text-slate-900 border border-slate-300"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Official Telephone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full bg-white rounded-xl px-3 py-2 text-slate-900 border border-slate-300"
                  required
                />
              </div>
            </div>

            {/* 15-Day Cycle Settings */}
            <div className="pt-4 border-t border-slate-200">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                15-Day Payment & Mileage Parameters
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Abnormal Mileage Threshold (KM / 15-Days)
                  </label>
                  <input
                    type="number"
                    value={abnormalMileageThresholdKm}
                    onChange={e => setAbnormalMileageThresholdKm(Number(e.target.value))}
                    className="w-full bg-white rounded-xl px-3 py-2 font-mono text-amber-700 border border-slate-300 font-bold"
                    required
                  />
                  <span className="text-[10px] text-slate-500 block mt-1">
                    Warns office staff if driver logs more than this distance in one 15-day period.
                  </span>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Payment Cycles</label>
                  <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-200 text-slate-700 text-[11px] font-medium space-y-1">
                    <div>• Cycle 1: 1st – 15th of month</div>
                    <div>• Cycle 2: 16th – End of month</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 flex items-center justify-between">
              {isSaved ? (
                <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                  <ShieldCheck className="h-4 w-4" /> Changes saved to enterprise database!
                </span>
              ) : <span></span>}

              <button
                type="submit"
                className="flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm transition-all"
              >
                <Save className="h-4 w-4" />
                <span>Save Configuration</span>
              </button>
            </div>
          </form>
        </div>

        {/* Security & Reset Info */}
        <div className="space-y-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-2">Fresh Start Management</h3>
            <p className="text-xs text-slate-600 mb-3 leading-relaxed">
              All mock test records have been removed so your team can begin operating Prince Limousine with real data.
            </p>
            <button
              onClick={handleReset}
              className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 p-2.5 text-xs font-bold text-rose-700 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Reset to Clean Slate</span>
            </button>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-3">Enterprise Security</h3>
            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex items-center gap-2 text-emerald-700 font-bold">
                <ShieldCheck className="h-4 w-4" />
                <span>Role-Based Access Control (RBAC) Active</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Permissions are enforced by role title: Business Owner, Fleet Operations Manager, Chief Accountant, and HR Officer.
              </p>
              <div className="pt-2 text-[10px] font-mono text-slate-400 border-t border-slate-100">
                Storage: PRINCE_LIMOUSINE_ERP_V2
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3 border-b border-slate-200 pb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
            <History className="h-4 w-4 text-amber-600" />
            <span>Real-time System Audit Trail ({auditLogs.length} events logged)</span>
          </h3>
        </div>

        {auditLogs.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500">
            <span>No audit events recorded in this session yet. System is clean and ready.</span>
          </div>
        ) : (
          <div className="max-h-72 overflow-y-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold bg-slate-50">
                <tr>
                  <th className="py-2 px-3">Timestamp</th>
                  <th className="py-2 px-3">Action</th>
                  <th className="py-2 px-3">User / Role</th>
                  <th className="py-2 px-3">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {auditLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-mono text-slate-500 text-[11px]">{log.timestamp}</td>
                    <td className="py-2.5 px-3 font-bold text-amber-700">{log.action}</td>
                    <td className="py-2.5 px-3 text-slate-700">{log.userName || (log as any).user || 'System'}</td>
                    <td className="py-2.5 px-3 text-slate-600 text-[11px]">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

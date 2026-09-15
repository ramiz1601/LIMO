import React from 'react';
import { FileText, Printer, Download, X, Building2, CheckCircle2 } from 'lucide-react';
import { RentalContract } from '../../types';
import { useErp } from '../../context/ErpContext';

interface Props {
  contract: RentalContract | null;
  onClose: () => void;
}

export const RentalAgreementModal: React.FC<Props> = ({ contract, onClose }) => {
  const { settings, showToast } = useErp();

  if (!contract) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const text = `
========================================================================
             STATE OF QATAR - VEHICLE LEASE AGREEMENT
========================================================================
LESSOR: ${settings.companyName.toUpperCase()}
COMMERCIAL REG: ${settings.crNumber} | TAX ID: ${settings.taxNumber}
ADDRESS: ${settings.address} | PHONE: ${settings.phone}
------------------------------------------------------------------------
CONTRACT NUMBER: ${contract.contractNumber}
DATE OF ISSUE  : ${contract.startDate}

LESSEE DETAILS:
Customer Name  : ${contract.customerName}
Customer Type  : ${contract.customerType.toUpperCase()}

VEHICLE SPECIFICATIONS:
Vehicle Model  : ${contract.vehicleName}
Plate Number   : ${contract.plateNumber}
Pickup Odometer: ${contract.pickupMileage.toLocaleString()} KM
Daily Allowance: ${contract.allowedDailyKm} KM/Day
Excess KM Fee  : QAR ${contract.extraKmCharge} / KM

TERMS & PAYMENT:
Rental Period  : ${contract.startDate} to ${contract.endDate}
Daily Rate     : QAR ${contract.dailyRate.toLocaleString()}
Total Amount   : QAR ${contract.totalAmount.toLocaleString()}
Security Dep.  : QAR ${contract.securityDeposit.toLocaleString()}
Payment Status : ${contract.paymentStatus.toUpperCase()}

TERMS OF AGREEMENT:
1. The Lessee agrees to operate the limousine in accordance with State of Qatar traffic laws.
2. All MOI traffic violations incurred during the lease are the sole liability of the Lessee.
3. Smoking and unauthorized drivers are strictly prohibited.
========================================================================
Authorized Signatory: _____________________    Customer: _____________________
`;

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CONTRACT_${contract.contractNumber}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    showToast(`Contract ${contract.contractNumber} downloaded!`, 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4 print:hidden">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-800 border border-amber-200">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Official Rental Agreement</h2>
              <span className="font-mono text-xs text-amber-800 font-bold">{contract.contractNumber}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 px-3 py-1.5 text-xs font-bold text-slate-800 transition-colors"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download</span>
            </button>
            <button
              onClick={onClose}
              className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Printable Paper Document */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 font-sans text-slate-900 shadow-2xs">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-slate-200 pb-4 mb-4">
            <div>
              <h1 className="text-lg font-black tracking-tight text-slate-900">{settings.companyName.toUpperCase()}</h1>
              <p className="text-xs text-slate-500">{settings.companyNameArabic}</p>
              <p className="text-[11px] text-slate-500 mt-1">
                CR: {settings.crNumber} | Tax: {settings.taxNumber} | Doha, Qatar
              </p>
            </div>
            <div className="text-right">
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold uppercase text-emerald-800 border border-emerald-200">
                Official Contract
              </span>
              <div className="font-mono text-xs font-bold text-amber-800 mt-2">
                {contract.contractNumber}
              </div>
            </div>
          </div>

          {/* Parties */}
          <div className="grid grid-cols-2 gap-4 text-xs mb-4">
            <div className="rounded-xl bg-white p-3 border border-slate-200 shadow-2xs">
              <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Customer / Lessee</span>
              <p className="font-bold text-slate-900 text-sm">{contract.customerName}</p>
              <p className="text-slate-500 capitalize">{contract.customerType} Account</p>
            </div>

            <div className="rounded-xl bg-white p-3 border border-slate-200 shadow-2xs">
              <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Limousine Vehicle</span>
              <p className="font-bold text-slate-900 text-sm">{contract.vehicleName}</p>
              <span className="inline-block mt-1 rounded bg-amber-100 px-2 py-0.5 text-[10px] font-mono font-bold text-amber-900 border border-amber-200">
                Plate: {contract.plateNumber}
              </span>
            </div>
          </div>

          {/* Details Table */}
          <div className="rounded-xl border border-slate-200 overflow-hidden text-xs mb-4 bg-white shadow-2xs">
            <table className="w-full text-left">
              <tbody className="divide-y divide-slate-100">
                <tr className="bg-slate-50/50">
                  <td className="p-2.5 text-slate-500">Lease Period</td>
                  <td className="p-2.5 font-bold text-slate-900 text-right">{contract.startDate} → {contract.endDate}</td>
                </tr>
                <tr>
                  <td className="p-2.5 text-slate-500">Starting Odometer</td>
                  <td className="p-2.5 font-mono text-slate-900 font-bold text-right">{contract.pickupMileage.toLocaleString()} KM</td>
                </tr>
                <tr className="bg-slate-50/50">
                  <td className="p-2.5 text-slate-500">Daily Allowance & Extra KM Rate</td>
                  <td className="p-2.5 text-slate-900 text-right font-medium">{contract.allowedDailyKm} KM/day (Extra: QAR {contract.extraKmCharge}/KM)</td>
                </tr>
                <tr>
                  <td className="p-2.5 text-slate-500">Daily Lease Rate</td>
                  <td className="p-2.5 font-mono text-slate-900 font-bold text-right">QAR {contract.dailyRate.toLocaleString()}</td>
                </tr>
                <tr className="bg-slate-50/50">
                  <td className="p-2.5 text-slate-500">Security Deposit (Refundable)</td>
                  <td className="p-2.5 font-mono text-slate-800 font-bold text-right">QAR {contract.securityDeposit.toLocaleString()}</td>
                </tr>
                <tr className="bg-emerald-50 font-bold">
                  <td className="p-2.5 text-emerald-800">Total Contract Value</td>
                  <td className="p-2.5 font-mono text-emerald-700 text-right text-sm">QAR {contract.totalAmount.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-2 gap-8 pt-4 border-t border-slate-200 text-[11px] text-slate-500">
            <div>
              <p className="mb-8 font-semibold text-slate-800">For {settings.companyName}:</p>
              <div className="border-b border-slate-300 w-36 mb-1"></div>
              <span>Authorized Chauffeur / Dispatch Signatory</span>
            </div>
            <div>
              <p className="mb-8 font-semibold text-slate-800">Customer / Lessee Acceptance:</p>
              <div className="border-b border-slate-300 w-36 mb-1"></div>
              <span>Signature & Qatar ID Verification</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

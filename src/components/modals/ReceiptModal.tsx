import React from 'react';
import { 
  X, 
  Printer, 
  Download, 
  Share2, 
  Car, 
  CheckCircle2, 
  QrCode, 
  ShieldCheck 
} from 'lucide-react';
import { useErp } from '../../context/ErpContext';

export const ReceiptModal: React.FC = () => {
  const { selectedReceipt, setSelectedReceipt, settings, showToast } = useErp();

  if (!selectedReceipt) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const voucherText = `=====================================================
${settings.companyName.toUpperCase()} - DOHA, STATE OF QATAR
CR No: ${settings.crNumber} | Tax: ${settings.taxNumber}
OFFICIAL 15-DAY PAYMENT & ODOMETER RECEIPT VOUCHER
=====================================================
Receipt Number : ${selectedReceipt.receiptNumber}
Date           : ${selectedReceipt.paymentDate || selectedReceipt.date || selectedReceipt.dueDate}
Driver Name    : ${selectedReceipt.driverName}
Vehicle Plate  : ${selectedReceipt.plateNumber} (${selectedReceipt.vehicleName})
Period         : ${selectedReceipt.periodLabel}
Payment Method : ${selectedReceipt.paymentMethod?.toUpperCase() || 'CASH'}

FINANCIAL SUMMARY:
-----------------------------------------------------
Amount Due     : QAR ${selectedReceipt.amountDue.toLocaleString()}
Amount Paid    : QAR ${selectedReceipt.amountPaid.toLocaleString()}
Balance        : QAR ${selectedReceipt.outstandingBalance.toLocaleString()}

ODOMETER & MILEAGE LOG:
-----------------------------------------------------
Previous Odom  : ${selectedReceipt.previousMileage.toLocaleString()} KM
Current Odom   : ${selectedReceipt.currentMileage.toLocaleString()} KM
Kilometers Run : ${selectedReceipt.kmDriven.toLocaleString()} KM

STATUS: ${selectedReceipt.status.toUpperCase()}
=====================================================
Issued by Prince Limousine ERP - Qatar
`;

    const blob = new Blob([voucherText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `VOUCHER_${selectedReceipt.receiptNumber}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    showToast(`Receipt voucher ${selectedReceipt.receiptNumber} downloaded!`, 'success');
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `Prince Limousine Receipt ${selectedReceipt.receiptNumber}\nDriver: ${selectedReceipt.driverName}\nVehicle: ${selectedReceipt.plateNumber}\nPeriod: ${selectedReceipt.periodLabel}\nAmount Paid: QAR ${selectedReceipt.amountPaid.toLocaleString()}\nKM Driven: ${selectedReceipt.kmDriven.toLocaleString()} KM`
      );
      showToast('Receipt copied to clipboard for WhatsApp / SMS sharing!', 'success');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95">
        {/* Action Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4 print:hidden">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Official Payment Voucher
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-200 transition-colors"
            >
              <Printer className="h-3.5 w-3.5 text-amber-600" />
              <span>Print</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-200 transition-colors"
            >
              <Download className="h-3.5 w-3.5 text-blue-600" />
              <span>Download</span>
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-200 transition-colors"
            >
              <Share2 className="h-3.5 w-3.5 text-emerald-600" />
              <span>Share</span>
            </button>
            <button
              onClick={() => setSelectedReceipt(null)}
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-400 hover:text-slate-800 hover:bg-slate-200 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Paper */}
        <div id="printable-receipt" className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 text-slate-900 shadow-xs print:bg-white print:text-black print:p-8 print:border-none">
          {/* Company Branding */}
          <div className="flex items-start justify-between border-b border-slate-200 pb-4 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="h-8 w-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xs shadow-2xs">
                  PL
                </div>
                <h3 className="text-sm font-black tracking-wider uppercase text-slate-900">
                  {settings.companyName}
                </h3>
              </div>
              <p className="text-[11px] font-medium text-amber-800">
                {settings.companyNameArabic}
              </p>
              <p className="text-[10px] text-slate-500 mt-1">
                CR No: {settings.crNumber} • Tax No: {settings.taxNumber} • {settings.address}
              </p>
            </div>

            <div className="text-right">
              <span className="inline-block rounded-md bg-emerald-100 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-widest text-emerald-800 border border-emerald-200">
                PAID RECEIPT
              </span>
              <div className="text-xs font-mono font-bold text-slate-900 mt-1">
                {selectedReceipt.receiptNumber}
              </div>
              <div className="text-[10px] text-slate-500">
                Date: {selectedReceipt.paymentDate || selectedReceipt.date || selectedReceipt.dueDate}
              </div>
            </div>
          </div>

          {/* Driver & Vehicle Details Grid */}
          <div className="grid grid-cols-2 gap-4 rounded-xl bg-white p-4 border border-slate-200 shadow-2xs mb-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">
                Driver Information
              </span>
              <div className="text-xs font-bold text-slate-900 mt-0.5">
                {selectedReceipt.driverName}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5 font-mono">
                Driver ID: {selectedReceipt.driverId}
              </div>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">
                Assigned Fleet Vehicle
              </span>
              <div className="text-xs font-bold text-slate-900 mt-0.5">
                {selectedReceipt.vehicleName}
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-100 text-amber-900 border border-amber-200">
                  {selectedReceipt.plateNumber}
                </span>
                <span className="text-[10px] text-slate-500">Qatar Plate</span>
              </div>
            </div>
          </div>

          {/* 15-Day Cycle & Mileage Checkpoint Table */}
          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-2xs mb-4">
            <div className="bg-slate-100 px-3.5 py-2 text-[10px] uppercase font-bold tracking-wider text-slate-700 flex justify-between">
              <span>Rental Period & Odometer Checkpoint</span>
              <span>15-Day Cycle</span>
            </div>
            <div className="divide-y divide-slate-100 text-xs">
              <div className="flex justify-between px-3.5 py-2">
                <span className="text-slate-500">Payment Period</span>
                <span className="font-semibold text-slate-900">{selectedReceipt.periodLabel}</span>
              </div>
              <div className="flex justify-between px-3.5 py-2">
                <span className="text-slate-500">Previous Verified Odometer</span>
                <span className="font-mono text-slate-700">{selectedReceipt.previousMileage.toLocaleString()} KM</span>
              </div>
              <div className="flex justify-between px-3.5 py-2">
                <span className="text-slate-500">Current Odometer at Checkpoint</span>
                <span className="font-mono font-bold text-amber-800">{selectedReceipt.currentMileage.toLocaleString()} KM</span>
              </div>
              <div className="flex justify-between px-3.5 py-2 bg-emerald-50/50">
                <span className="font-bold text-emerald-900">Total KM Driven in 15 Days</span>
                <span className="font-mono font-extrabold text-emerald-700">{selectedReceipt.kmDriven.toLocaleString()} KM</span>
              </div>
            </div>
          </div>

          {/* Financial Breakdown Table */}
          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-2xs mb-5">
            <div className="bg-slate-100 px-3.5 py-2 text-[10px] uppercase font-bold tracking-wider text-slate-700">
              Payment Settlement
            </div>
            <div className="divide-y divide-slate-100 text-xs">
              <div className="flex justify-between px-3.5 py-2">
                <span className="text-slate-500">Agreed 15-Day Rent</span>
                <span className="font-mono text-slate-800">QAR {selectedReceipt.amountDue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between px-3.5 py-2.5 bg-emerald-50/70">
                <span className="font-bold text-emerald-900">Amount Received & Paid</span>
                <span className="font-mono font-black text-emerald-700 text-sm">
                  QAR {selectedReceipt.amountPaid.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between px-3.5 py-2">
                <span className="text-slate-500">Outstanding Balance Remaining</span>
                <span className={`font-mono font-bold ${selectedReceipt.outstandingBalance > 0 ? 'text-amber-700' : 'text-slate-500'}`}>
                  QAR {selectedReceipt.outstandingBalance.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between px-3.5 py-2">
                <span className="text-slate-500">Payment Method</span>
                <span className="capitalize font-semibold text-slate-800">
                  {selectedReceipt.paymentMethod?.replace('_', ' ') || 'Cash'}
                </span>
              </div>
            </div>
          </div>

          {/* Footer Signature & Digital Verification */}
          <div className="flex items-end justify-between pt-2 border-t border-slate-200">
            <div>
              <div className="flex items-center gap-1.5 text-[10px] text-emerald-700 font-bold">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span>Digitally Verified & Logged in Prince Limousine ERP</span>
              </div>
              <p className="text-[9px] text-slate-500 mt-0.5">
                Recorded by: {selectedReceipt.recordedBy}
              </p>
            </div>

            <div className="text-center">
              <div className="h-9 w-24 border-b border-dashed border-slate-400 mb-1 mx-auto flex items-center justify-center">
                <span className="text-[9px] text-slate-400 italic">Official Stamp</span>
              </div>
              <span className="text-[9px] uppercase font-bold text-slate-600">
                Authorized Signature
              </span>
            </div>
          </div>
        </div>

        {/* Close button bottom */}
        <div className="mt-4 flex justify-end print:hidden">
          <button
            onClick={() => setSelectedReceipt(null)}
            className="rounded-xl bg-slate-900 hover:bg-slate-800 px-5 py-2 text-xs font-bold text-white transition-colors"
          >
            Close Voucher
          </button>
        </div>
      </div>
    </div>
  );
};

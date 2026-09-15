import React, { useState } from 'react';
import { 
  FileCheck, 
  Search, 
  Plus, 
  Calendar, 
  Car, 
  User, 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  Building2,
  Printer
} from 'lucide-react';
import { useErp } from '../../context/ErpContext';
import { RentalContract } from '../../types';
import { NewRentalModal } from '../modals/NewRentalModal';
import { RentalAgreementModal } from '../modals/RentalAgreementModal';

export const RentalsView: React.FC = () => {
  const { rentals } = useErp();
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewRentalOpen, setIsNewRentalOpen] = useState(false);
  const [selectedContractForPrint, setSelectedContractForPrint] = useState<RentalContract | null>(null);

  const filteredRentals = rentals.filter(r => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        r.contractNumber.toLowerCase().includes(q) ||
        r.customerName.toLowerCase().includes(q) ||
        r.plateNumber.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900">Customer Rentals & Corporate Contracts</h1>
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-mono font-bold text-emerald-800 border border-emerald-200">
              {rentals.length} Active Bookings
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            VIP Chauffeur services, corporate executive leases, and luxury event transportation.
          </p>
        </div>

        <button
          onClick={() => setIsNewRentalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition-all active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span>New Customer Contract</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
        <input
          type="text"
          placeholder="Search by contract #, customer name, vehicle plate..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full rounded-2xl border border-slate-300 bg-white pl-9 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:outline-none shadow-xs font-medium"
        />
      </div>

      {/* Empty State */}
      {rentals.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500 space-y-3">
          <FileCheck className="h-10 w-10 text-slate-300 mx-auto" />
          <div className="font-bold text-slate-700 text-base">No customer rental contracts yet</div>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Book VIP airport transfers, hotel chauffeuring, or long-term corporate vehicle leases.
          </p>
          <button
            onClick={() => setIsNewRentalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 text-white font-bold text-xs hover:bg-amber-600 transition-colors shadow-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Create First Contract</span>
          </button>
        </div>
      ) : filteredRentals.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-xs text-slate-500">
          No contracts match the search query.
        </div>
      ) : (
        /* Contracts Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRentals.map(r => (
            <div
              key={r.id}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <span className="font-mono text-xs font-bold text-amber-800">{r.contractNumber}</span>
                    <h3 className="text-base font-bold text-slate-900 mt-0.5">{r.customerName}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                      <Building2 className="h-3.5 w-3.5 text-slate-400" />
                      <span>{r.customerType === 'corporate' ? 'Corporate Account' : 'Individual VIP Client'}</span>
                    </div>
                  </div>

                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold uppercase text-emerald-800 border border-emerald-200">
                    {r.contractStatus}
                  </span>
                </div>

                {/* Vehicle & Duration */}
                <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-200 mb-3 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Assigned Vehicle</span>
                    <div className="text-right">
                      <span className="font-bold text-slate-900 block">{r.vehicleName}</span>
                      <span className="px-1.5 py-0.2 rounded font-mono font-bold bg-amber-100 text-amber-900 border border-amber-200 text-[10px]">
                        {r.plateNumber}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                    <span className="text-slate-500">Rental Period</span>
                    <span className="text-slate-800 font-medium">{r.startDate} → {r.endDate}</span>
                  </div>
                </div>

                {/* Financials */}
                <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                  <div className="rounded-xl bg-slate-50 p-2 border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">Total Agreement</span>
                    <div className="font-mono font-bold text-emerald-700 text-sm mt-0.5">
                      QAR {r.totalAmount.toLocaleString()}
                    </div>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-2 border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">Security Deposit</span>
                    <div className="font-mono font-bold text-slate-900 text-sm mt-0.5">
                      QAR {r.securityDeposit.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">
                  Payment: <strong className="text-slate-900 capitalize">{r.paymentStatus}</strong>
                </span>
                <button
                  onClick={() => setSelectedContractForPrint(r)}
                  className="flex items-center gap-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 px-3 py-1.5 font-bold text-slate-800 transition-colors shadow-2xs"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>Print Agreement</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <NewRentalModal
        isOpen={isNewRentalOpen}
        onClose={() => setIsNewRentalOpen(false)}
      />

      <RentalAgreementModal
        contract={selectedContractForPrint}
        onClose={() => setSelectedContractForPrint(null)}
      />
    </div>
  );
};

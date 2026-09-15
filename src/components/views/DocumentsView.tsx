import React, { useState } from 'react';
import { 
  FileCheck, 
  Search, 
  Plus, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  FileText, 
  Calendar, 
  Building2, 
  Car, 
  User, 
  RefreshCw, 
  X 
} from 'lucide-react';
import { useErp } from '../../context/ErpContext';
import { CompanyDocument } from '../../types';

export const DocumentsView: React.FC = () => {
  const { documents, renewDocument, addDocument, showToast } = useErp();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'expiring_soon' | 'expired' | 'valid'>('all');
  
  // Renew modal state
  const [renewingDoc, setRenewingDoc] = useState<CompanyDocument | null>(null);
  const [newExpiryDate, setNewExpiryDate] = useState('');

  // Upload modal state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [docType, setDocType] = useState<CompanyDocument['type']>('vehicle_registration');
  const [entityType, setEntityType] = useState<CompanyDocument['entityType']>('vehicle');
  const [documentNumber, setDocumentNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');

  const now = new Date().getTime();

  // Dynamically compute expiry status based on real date
  const processedDocs = documents.map(d => {
    const exp = new Date(d.expiryDate).getTime();
    const daysUntilExpiry = Math.ceil((exp - now) / (1000 * 60 * 60 * 24));
    let status: 'valid' | 'expiring_soon' | 'expired' = 'valid';
    if (daysUntilExpiry < 0) {
      status = 'expired';
    } else if (daysUntilExpiry <= 30) {
      status = 'expiring_soon';
    }
    return { ...d, status, daysUntilExpiry };
  });

  const filteredDocs = processedDocs.filter(d => {
    if (filterType !== 'all' && d.status !== filterType) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        d.title.toLowerCase().includes(q) ||
        d.documentNumber.toLowerCase().includes(q) ||
        (d.entityName && d.entityName.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleRenewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!renewingDoc || !newExpiryDate) return;
    renewDocument(renewingDoc.id, newExpiryDate);
    showToast('Document validity updated successfully', 'success');
    setRenewingDoc(null);
    setNewExpiryDate('');
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !documentNumber || !expiryDate) {
      showToast('Please fill all required fields', 'error');
      return;
    }

    addDocument({
      title,
      type: docType,
      entityType,
      documentNumber,
      issueDate: new Date().toISOString().split('T')[0],
      expiryDate,
      fileSize: '1.8 MB',
      fileType: 'application/pdf',
      status: 'valid'
    });

    showToast('Compliance document registered successfully', 'success');
    setIsUploadOpen(false);
    setTitle('');
    setDocumentNumber('');
    setExpiryDate('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900">Qatar Legal Documents & Expiry Radar</h1>
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-mono font-bold text-emerald-800 border border-emerald-200">
              MOT & MOI Compliant
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Automated expiry tracking for Istimara, Limousine Cards, Comprehensive Insurance, and Driver QIDs.
          </p>
        </div>

        <button
          onClick={() => setIsUploadOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition-all active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-emerald-700 block">Active & Verified Documents</span>
          <div className="text-2xl font-black font-mono text-slate-900 mt-1">
            {processedDocs.filter(d => d.status === 'valid').length} Valid
          </div>
          <span className="text-xs text-slate-500 block mt-1">Compliant across Qatar authorities</span>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-amber-800 block">Expiring within 30 Days</span>
          <div className="text-2xl font-black font-mono text-amber-800 mt-1">
            {processedDocs.filter(d => d.status === 'expiring_soon').length} Documents
          </div>
          <span className="text-xs text-slate-500 block mt-1">Requires renewal action</span>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-rose-700 block">Expired Documents</span>
          <div className="text-2xl font-black font-mono text-rose-700 mt-1">
            {processedDocs.filter(d => d.status === 'expired').length} Critical
          </div>
          <span className="text-xs text-slate-500 block mt-1">Ground vehicle or driver immediately</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search document title, number, vehicle/driver..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white pl-9 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:outline-none font-medium"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {(['all', 'expiring_soon', 'expired', 'valid'] as const).map(t => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold whitespace-nowrap transition-all ${
                filterType === t
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              {t === 'all'
                ? 'All Documents'
                : t === 'expiring_soon'
                ? 'Expiring Soon'
                : t === 'expired'
                ? 'Expired'
                : 'Valid'}
            </button>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {documents.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500 space-y-3">
          <FileCheck className="h-10 w-10 text-slate-300 mx-auto" />
          <div className="font-bold text-slate-700 text-base">No legal documents registered yet</div>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Upload vehicle Istimara, Limousine Cards, insurance policies, and driver documents to track renewals.
          </p>
          <button
            onClick={() => setIsUploadOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 text-white font-bold text-xs hover:bg-amber-600 transition-colors shadow-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Upload First Document</span>
          </button>
        </div>
      ) : filteredDocs.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-xs text-slate-500">
          No documents match the search criteria.
        </div>
      ) : (
        /* Documents Table */
        <div className="rounded-3xl border border-slate-200 bg-white p-4 overflow-x-auto shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-100 text-slate-500 uppercase text-[10px] font-bold">
              <tr>
                <th className="pb-3">Document Title</th>
                <th className="pb-3">Category</th>
                <th className="pb-3">Assigned Entity</th>
                <th className="pb-3">Document No</th>
                <th className="pb-3">Issue Date</th>
                <th className="pb-3">Expiry Date</th>
                <th className="pb-3 text-center">Status</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDocs.map(doc => (
                <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3">
                    <div className="font-bold text-slate-900 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-amber-600 shrink-0" />
                      <span>{doc.title}</span>
                    </div>
                  </td>
                  <td className="py-3 capitalize text-slate-700">
                    {doc.type.replace(/_/g, ' ')}
                  </td>
                  <td className="py-3 text-slate-700 font-medium">
                    {doc.entityName || doc.entityType}
                  </td>
                  <td className="py-3 font-mono text-amber-800 font-bold">
                    {doc.documentNumber}
                  </td>
                  <td className="py-3 font-mono text-slate-500">{doc.issueDate}</td>
                  <td className="py-3 font-mono font-bold text-slate-900">
                    {doc.expiryDate}
                  </td>
                  <td className="py-3 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[9px] font-bold uppercase border ${
                        doc.status === 'valid'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                          : doc.status === 'expiring_soon'
                          ? 'bg-amber-100 text-amber-800 border-amber-200'
                          : 'bg-rose-100 text-rose-800 border-rose-200'
                      }`}
                    >
                      {doc.status === 'valid' && <CheckCircle2 className="h-3 w-3" />}
                      {doc.status === 'expiring_soon' && <Clock className="h-3 w-3" />}
                      {doc.status === 'expired' && <AlertTriangle className="h-3 w-3" />}
                      {doc.status === 'expiring_soon'
                        ? `${doc.daysUntilExpiry}d left`
                        : doc.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => {
                        setRenewingDoc(doc);
                        setNewExpiryDate(doc.expiryDate);
                      }}
                      className="inline-flex items-center gap-1 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 px-2.5 py-1 text-[10px] font-bold text-amber-900 transition-colors shadow-2xs"
                    >
                      <RefreshCw className="h-3 w-3" />
                      <span>Renew</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Renew Document Modal */}
      {renewingDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h2 className="text-base font-bold text-slate-900">Renew Document</h2>
              <button
                onClick={() => setRenewingDoc(null)}
                className="rounded-xl p-1 text-slate-400 hover:text-slate-800 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleRenewSubmit} className="space-y-4 text-xs">
              <div>
                <span className="text-slate-500 block text-[11px] font-medium">Document</span>
                <p className="font-bold text-slate-900 text-sm mt-0.5">{renewingDoc.title}</p>
                <span className="text-amber-800 font-mono font-bold text-[11px]">{renewingDoc.documentNumber}</span>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">New Qatar Expiry Date</label>
                <input
                  type="date"
                  value={newExpiryDate}
                  onChange={e => setNewExpiryDate(e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setRenewingDoc(null)}
                  className="rounded-xl px-4 py-2 font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-amber-500 hover:bg-amber-600 px-5 py-2 font-bold text-white shadow-xs"
                >
                  Update Validity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Upload Document Modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h2 className="text-base font-bold text-slate-900">Upload Qatar Compliance Doc</h2>
              <button
                onClick={() => setIsUploadOpen(false)}
                className="rounded-xl p-1 text-slate-400 hover:text-slate-800 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Document Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Istimara LIM 1234 (Toyota Camry)"
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-amber-500 focus:outline-none font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={docType}
                    onChange={e => setDocType(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-amber-500 focus:outline-none"
                  >
                    <option value="vehicle_registration">Vehicle Istimara</option>
                    <option value="limousine_card">Limousine Operating Card</option>
                    <option value="vehicle_insurance">Comprehensive Insurance</option>
                    <option value="driver_qid">Driver Qatar ID (QID)</option>
                    <option value="driver_license">Driver Qatar License</option>
                    <option value="commercial_registration">Company CR</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Assigned Entity</label>
                  <select
                    value={entityType}
                    onChange={e => setEntityType(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-amber-500 focus:outline-none"
                  >
                    <option value="vehicle">Vehicle</option>
                    <option value="driver">Driver</option>
                    <option value="company">Company</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Document Number</label>
                  <input
                    type="text"
                    value={documentNumber}
                    onChange={e => setDocumentNumber(e.target.value)}
                    placeholder="e.g. 2026-IST-9014"
                    required
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 font-mono focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={e => setExpiryDate(e.target.value)}
                    required
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(false)}
                  className="rounded-xl px-4 py-2 font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-amber-500 hover:bg-amber-600 px-5 py-2 font-bold text-white shadow-xs active:scale-95"
                >
                  Save Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

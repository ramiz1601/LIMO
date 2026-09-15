import React, { useState } from 'react';
import {
  MessageSquare,
  Plus,
  Send,
  LifeBuoy,
  CheckCircle2,
  Clock,
  AlertCircle,
  HelpCircle,
  FileQuestion,
  Sparkles,
  X
} from 'lucide-react';
import { useErp } from '../../context/ErpContext';
import { SupportTicketCategory, SupportTicketPriority } from '../../types';

export const SupportCenterView: React.FC = () => {
  const {
    supportTickets,
    currentTenant,
    currentUser,
    createSupportTicket,
    replySupportTicket,
    showToast
  } = useErp();

  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState<SupportTicketCategory>('operations');
  const [priority, setPriority] = useState<SupportTicketPriority>('medium');
  const [initialMessage, setInitialMessage] = useState('');

  // Scoped to current tenant
  const tenantTickets = supportTickets.filter((t) => t.organizationId === currentTenant.id);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(tenantTickets[0]?.id || null);
  const [replyText, setReplyText] = useState('');

  const selectedTicket = tenantTickets.find((t) => t.id === selectedTicketId);

  const handleCreateTicket = () => {
    if (!subject.trim() || !initialMessage.trim()) {
      showToast('Please provide a subject and description', 'warning');
      return;
    }

    createSupportTicket({
      subject,
      category,
      priority,
      initialMessage
    });

    showToast('Support ticket dispatched to FleetFlow engineering team!', 'success');
    setIsNewTicketOpen(false);
    setSubject('');
    setInitialMessage('');
  };

  const handleSendReply = () => {
    if (!selectedTicketId || !replyText.trim()) return;
    replySupportTicket(selectedTicketId, replyText);
    setReplyText('');
    showToast('Reply added to ticket', 'success');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-amber-100 text-amber-900 border border-amber-200 px-2.5 py-0.5 text-[10px] font-extrabold uppercase">
              {currentTenant.name} Helpdesk
            </span>
          </div>
          <h1 className="text-xl font-black text-slate-900 mt-1">Dedicated Support Center</h1>
          <p className="text-xs text-slate-500">
            Direct communication channel with FleetFlow engineers and account specialists.
          </p>
        </div>

        <button
          onClick={() => setIsNewTicketOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-600 px-4 py-2.5 text-xs font-extrabold text-white shadow-sm transition-colors self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" /> Open New Support Ticket
        </button>
      </div>

      {/* Tickets Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ticket List */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs space-y-2">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2">
            Your Support Tickets ({tenantTickets.length})
          </h3>

          {tenantTickets.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center text-xs text-slate-400">
              No tickets submitted yet. Click "Open New Support Ticket" if you need technical assistance.
            </div>
          ) : (
            tenantTickets.map((t) => {
              const isSelected = selectedTicketId === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedTicketId(t.id)}
                  className={`cursor-pointer rounded-xl p-3 border transition-all ${
                    isSelected
                      ? 'border-amber-500 bg-amber-50/60 shadow-xs'
                      : 'border-slate-100 bg-slate-50/50 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">{t.category.replace('_', ' ')}</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[9px] font-extrabold uppercase ${
                        t.status === 'open'
                          ? 'bg-amber-100 text-amber-800'
                          : t.status === 'in_progress'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {t.status.replace('_', ' ')}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 mt-1 line-clamp-1">{t.subject}</h4>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2">
                    <span>Priority: {t.priority}</span>
                    <span>{t.createdAt.split('T')[0]}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Selected Ticket Thread */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between min-h-[400px]">
          {selectedTicket ? (
            <div className="flex flex-col h-full justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700">
                      Ticket #{selectedTicket.id.replace('tick-', '')}
                    </span>
                    <h3 className="text-base font-extrabold text-slate-900 mt-0.5">{selectedTicket.subject}</h3>
                    <p className="text-xs text-slate-500">
                      Category: {selectedTicket.category.replace('_', ' ')} • Priority: {selectedTicket.priority}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-bold capitalize ${
                      selectedTicket.status === 'resolved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {selectedTicket.status.replace('_', ' ')}
                  </span>
                </div>

                {/* Conversation Thread */}
                <div className="my-4 space-y-3 max-h-96 overflow-y-auto pr-1">
                  {selectedTicket.messages.map((msg) => {
                    const isStaff = msg.senderRole === 'super_admin' || msg.senderRole === 'support_agent';

                    return (
                      <div
                        key={msg.id}
                        className={`rounded-xl p-3.5 text-xs max-w-xl ${
                          isStaff
                            ? 'bg-amber-50 border border-amber-200 text-amber-950'
                            : 'ml-auto bg-slate-100 text-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold mb-1 text-[10px]">
                          <span>{msg.senderName} {isStaff && '• FleetFlow Engineer'}</span>
                          <span className="text-slate-400 font-normal">{msg.timestamp.split('T')[0]}</span>
                        </div>
                        <p className="leading-relaxed">{msg.message}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Reply Box */}
              <div className="border-t border-slate-100 pt-3 flex gap-2">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type a response or follow-up question..."
                  className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-amber-500 focus:outline-hidden"
                  onKeyDown={(e) => e.key === 'Enter' && handleSendReply()}
                />
                <button
                  onClick={handleSendReply}
                  className="flex items-center gap-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 px-4 py-2 text-xs font-bold text-white shadow-xs"
                >
                  <Send className="h-3.5 w-3.5" /> Reply
                </button>
              </div>
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-slate-400 p-8 text-center">
              <LifeBuoy className="h-10 w-10 text-slate-300 mb-2" />
              <p className="text-xs font-medium">Select a ticket from the left to view the thread, or submit a new inquiry.</p>
            </div>
          )}
        </div>
      </div>

      {/* New Ticket Modal */}
      {isNewTicketOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-800 font-bold">
                  <LifeBuoy className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">New Technical Inquiry</h3>
                  <p className="text-xs text-slate-500">FleetFlow Support Desk</p>
                </div>
              </div>
              <button
                onClick={() => setIsNewTicketOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Subject *</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Question regarding 15-day cycle calculation"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-amber-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-amber-500 focus:outline-hidden"
                  >
                    <option value="operations">Fleet & Odometer Operations</option>
                    <option value="billing">Billing & Subscription</option>
                    <option value="technical">Technical / Bug Report</option>
                    <option value="feature_request">Feature Request</option>
                    <option value="other">General Inquiry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-amber-500 focus:outline-hidden"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Detailed Description *</label>
                <textarea
                  value={initialMessage}
                  onChange={(e) => setInitialMessage(e.target.value)}
                  rows={4}
                  placeholder="Describe your question, request, or issue with relevant details..."
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-amber-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setIsNewTicketOpen(false)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTicket}
                className="rounded-xl bg-amber-500 hover:bg-amber-600 px-5 py-2 text-xs font-bold text-white shadow-xs"
              >
                Submit Ticket
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

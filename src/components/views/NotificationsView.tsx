import React, { useState } from 'react';
import { 
  Bell, 
  Check, 
  CheckCheck, 
  AlertTriangle, 
  Clock, 
  FileText, 
  Car, 
  User, 
  ShieldAlert, 
  DollarSign, 
  Trash2, 
  Calendar 
} from 'lucide-react';
import { useErp } from '../../context/ErpContext';

export const NotificationsView: React.FC = () => {
  const { 
    notifications, 
    markNotificationRead, 
    markAllNotificationsRead, 
    setActiveTab, 
    setSelectedDriverProfileId, 
    setSelectedVehicleProfileId,
    showToast 
  } = useErp();

  const [filterType, setFilterType] = useState<'all' | 'unread' | 'critical'>('all');

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const filteredNotifications = notifications.filter(n => {
    if (filterType === 'unread' && n.isRead) return false;
    if (filterType === 'critical' && n.severity !== 'critical' && n.severity !== 'warning') return false;
    return true;
  });

  const handleActionClick = (n: typeof notifications[0]) => {
    markNotificationRead(n.id);

    if (n.relatedType === 'driver' && n.relatedId) {
      setSelectedDriverProfileId(n.relatedId);
      setActiveTab('drivers');
    } else if (n.relatedType === 'vehicle' && n.relatedId) {
      setSelectedVehicleProfileId(n.relatedId);
      setActiveTab('fleet');
    } else if (n.type === 'payment_overdue' || n.type === 'payment_received') {
      setActiveTab('payments');
    } else if (n.type === 'insurance_expiry' || n.type === 'license_expiry') {
      setActiveTab('documents');
    } else if (n.type === 'maintenance_due') {
      setActiveTab('maintenance');
    } else {
      setActiveTab('dashboard');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900">System Notifications & Compliance Radar</h1>
            {unreadCount > 0 && (
              <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-mono font-bold text-rose-800 border border-rose-200">
                {unreadCount} Unread
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time alerts for traffic violations, Istimara renewals, payment cycles, and abnormal mileage.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              markAllNotificationsRead();
              showToast('All notifications marked as read', 'info');
            }}
            disabled={unreadCount === 0}
            className="flex items-center gap-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-50 px-3 py-2 text-xs font-bold text-slate-700 transition-colors shadow-2xs"
          >
            <CheckCheck className="h-4 w-4" />
            <span>Mark All Read</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2 text-xs">
        <button
          onClick={() => setFilterType('all')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
            filterType === 'all' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          All Notifications ({notifications.length})
        </button>
        <button
          onClick={() => setFilterType('unread')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
            filterType === 'unread' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Unread ({unreadCount})
        </button>
        <button
          onClick={() => setFilterType('critical')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
            filterType === 'critical' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Critical & High Alerts
        </button>
      </div>

      {/* Notification List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <Bell className="mx-auto h-12 w-12 text-slate-300 mb-3" />
            <p className="text-sm font-bold text-slate-700">No notifications found</p>
            <p className="text-xs text-slate-400 mt-1">All fleet, driver, and legal radar systems are operational.</p>
          </div>
        ) : (
          filteredNotifications.map(n => {
            const isCritical = n.severity === 'critical';
            const isWarning = n.severity === 'warning';

            return (
              <div
                key={n.id}
                className={`relative overflow-hidden rounded-2xl border p-4 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs ${
                  !n.isRead
                    ? 'border-amber-300 bg-amber-50/40'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border ${
                      isCritical
                        ? 'bg-rose-100 text-rose-700 border-rose-200'
                        : isWarning
                        ? 'bg-amber-100 text-amber-800 border-amber-200'
                        : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                    }`}
                  >
                    {isCritical ? <ShieldAlert className="h-5 w-5" /> : <Bell className="h-5 w-5" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className={`text-sm font-bold ${!n.isRead ? 'text-slate-900' : 'text-slate-700'}`}>
                        {n.title}
                      </h3>
                      <span
                        className={`px-2 py-0.2 rounded text-[9px] font-mono font-bold uppercase border ${
                          isCritical
                            ? 'bg-rose-100 text-rose-800 border-rose-200'
                            : isWarning
                            ? 'bg-amber-100 text-amber-800 border-amber-200'
                            : 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        {n.severity}
                      </span>
                      {!n.isRead && (
                        <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 mt-1">{n.message}</p>

                    <span className="text-[10px] text-slate-400 font-mono mt-1.5 block">
                      {n.date}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  {!n.isRead && (
                    <button
                      onClick={() => markNotificationRead(n.id)}
                      className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-800 transition-colors"
                      title="Mark as read"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleActionClick(n)}
                    className="rounded-xl bg-amber-500 hover:bg-amber-600 px-3 py-1.5 text-xs font-bold text-white shadow-2xs transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

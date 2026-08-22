import React from 'react';
import { 
  Bell, CloudRain, TrendingDown, Clock, 
  Check, X, AlertTriangle, Sparkles, CheckCheck 
} from 'lucide-react';
import { useTrip } from '../../context/TripContext.tsx';

export const NotificationsModal: React.FC = () => {
  const { 
    isNotificationsOpen, setIsNotificationsOpen, notifications, 
    markNotificationRead, unreadNotifsCount, setIsRescueOpen 
  } = useTrip();

  if (!isNotificationsOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'weather_alert': return <CloudRain className="w-4 h-4 text-blue-500" />;
      case 'price_drop': return <TrendingDown className="w-4 h-4 text-emerald-500" />;
      case 'disruption': return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      default: return <Sparkles className="w-4 h-4 text-purple-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#0f172a] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Live Trip Alerts
              </h3>
              <p className="text-xs text-slate-500">
                {unreadNotifsCount} unread proactive intelligence updates
              </p>
            </div>
          </div>

          <button
            id="close-notifs-modal-btn"
            onClick={() => setIsNotificationsOpen(false)}
            className="p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs">
              No new alerts. Your itinerary is running smoothly!
            </div>
          ) : (
            notifications.map(n => (
              <div
                key={n.id}
                className={`p-4 rounded-2xl border transition-all ${
                  n.read
                    ? 'bg-slate-50/50 dark:bg-slate-800/20 border-slate-200 dark:border-slate-800/60 opacity-75'
                    : 'bg-white dark:bg-slate-800/70 border-blue-500/30 shadow-md ring-1 ring-blue-500/20'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700/60 shrink-0 mt-0.5">
                    {getIcon(n.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">{n.title}</h4>
                      <span className="text-[10px] text-slate-400 shrink-0">{n.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                      {n.message}
                    </p>

                    {/* Action buttons if disruption */}
                    {n.type === 'disruption' && (
                      <div className="mt-2.5">
                        <button
                          onClick={() => {
                            setIsNotificationsOpen(false);
                            setIsRescueOpen(true);
                          }}
                          className="px-3 py-1 rounded-lg bg-amber-500 text-slate-950 text-[10px] font-extrabold hover:bg-amber-400 transition-colors shadow-xs"
                        >
                          Launch Trip Rescue →
                        </button>
                      </div>
                    )}
                  </div>

                  {!n.read && (
                    <button
                      onClick={() => markNotificationRead(n.id)}
                      title="Mark as read"
                      className="p-1 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-slate-100 dark:hover:bg-slate-700"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};

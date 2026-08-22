import React, { useState } from 'react';
import { Trip, ItineraryItem } from '../../types/index.ts';
import { Clock, MapPin, Sparkles, ChevronLeft, ChevronRight, Calendar as CalIcon } from 'lucide-react';

interface TripCalendarViewProps {
  trip: Trip;
  onSelectActivity?: (item: ItineraryItem) => void;
}

export const TripCalendarView: React.FC<TripCalendarViewProps> = ({ trip, onSelectActivity }) => {
  const [selectedDayIndex, setSelectedDayIndex] = useState(1);

  const days = Array.from({ length: trip.totalDays }).map((_, i) => i + 1);
  const currentDayItems = trip.items.filter(i => i.dayNumber === selectedDayIndex);

  const hours = [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', 
    '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'
  ];

  return (
    <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
      
      {/* Calendar Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <CalIcon className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
              Trip Calendar Schedule
            </h4>
            <p className="text-xs text-slate-400">
              {trip.startDate} to {trip.endDate} ({trip.totalDays} Total Days)
            </p>
          </div>
        </div>

        {/* Day Selector Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {days.map(d => (
            <button
              key={d}
              onClick={() => setSelectedDayIndex(d)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedDayIndex === d
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              Day {d}
            </button>
          ))}
        </div>
      </div>

      {/* Hourly Schedule Grid */}
      <div className="space-y-2 divide-y divide-slate-100 dark:divide-slate-800">
        {hours.map(hour => {
          const matchingItems = currentDayItems.filter(item => {
            const startHour = item.startTime?.split(':')[0];
            return startHour === hour.split(':')[0];
          });

          return (
            <div key={hour} className="pt-2 flex items-start gap-4">
              <span className="w-14 text-xs font-mono font-bold text-slate-400 shrink-0 pt-1">
                {hour}
              </span>

              <div className="flex-1 space-y-2">
                {matchingItems.length === 0 ? (
                  <div className="h-7 border border-dashed border-slate-200 dark:border-slate-800/60 rounded-xl flex items-center px-3 text-[11px] text-slate-400">
                    Open / Flexible buffer
                  </div>
                ) : (
                  matchingItems.map(item => {
                    const bgClass =
                      item.category === 'food' ? 'bg-orange-500/10 border-orange-500/30 text-orange-950 dark:text-orange-200' :
                      item.category === 'culture' ? 'bg-purple-500/10 border-purple-500/30 text-purple-950 dark:text-purple-200' :
                      item.category === 'photography' ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-950 dark:text-cyan-200' :
                      'bg-blue-500/10 border-blue-500/30 text-blue-950 dark:text-blue-200';

                    return (
                      <div
                        key={item.id}
                        onClick={() => onSelectActivity && onSelectActivity(item)}
                        className={`p-3 rounded-2xl border ${bgClass} cursor-pointer hover:shadow-md transition-all`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-extrabold text-xs">{item.title}</span>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/60 dark:bg-black/40">
                            {item.startTime} – {item.endTime}
                          </span>
                        </div>
                        <p className="text-[11px] opacity-80 mt-0.5">{item.description}</p>
                        <div className="mt-1.5 flex items-center justify-between text-[10px] font-bold">
                          <span>📍 {item.locationName}</span>
                          <span>{trip.currency}{item.cost}</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

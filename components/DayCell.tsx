
import React from 'react';
import { DayData, CalendarEvent } from '../types';
import { isSameDay, isSaturday, isSunday } from 'date-fns';
import { INDONESIAN_HOLIDAYS_2026 } from '../constants';

interface DayCellProps {
  day: DayData;
  activeEvents: CalendarEvent[];
  isLastInRow: boolean;
  onClick: () => void;
}

const DayCell: React.FC<DayCellProps> = ({ day, activeEvents, isLastInRow, onClick }) => {
  const isToday = isSameDay(day.date, new Date());
  const isFirstOfMonth = day.isFirstOfMonth;
  const isWeekend = isSaturday(day.date) || isSunday(day.date);
  
  const holiday = INDONESIAN_HOLIDAYS_2026.find(h => isSameDay(h.date, day.date));

  // Background logic: Holiday priority > Weekend priority > Default
  const getBgClass = () => {
    if (holiday) {
      return holiday.isCutiBersama ? 'bg-red-50' : 'bg-red-100/70';
    }
    if (isWeekend) {
      return 'bg-pink-50';
    }
    return 'bg-white';
  };

  return (
    <div 
      onClick={onClick}
      className={`relative flex-1 min-w-[65px] border-r border-slate-200 flex flex-col transition-all hover:bg-indigo-50/30 cursor-pointer group ${getBgClass()}`}
    >
      {/* Month Separator Line */}
      {isFirstOfMonth && (
        <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-slate-300 z-10" />
      )}
      
      {/* Date Header */}
      <div className="flex items-start justify-between p-2 pb-1 relative z-20">
        <div className="flex flex-col">
          {isFirstOfMonth && (
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mb-0.5">
              {day.monthName}
            </span>
          )}
          <span className={`text-[10px] font-bold tracking-tight ${
            holiday ? 'text-red-500' : (isWeekend ? 'text-pink-400' : 'text-slate-500')
          } leading-none`}>
            {day.dayOfWeek}
          </span>
        </div>
        
        <div className="flex flex-col items-end">
          <span className={`text-sm font-bold leading-none ${
            isToday 
              ? 'bg-orange-500 text-white w-6 h-6 flex items-center justify-center rounded-full -mt-1 -mr-1 shadow-sm' 
              : (holiday ? 'text-red-600 font-black' : 'text-slate-900')
          }`}>
            {day.dayOfMonth}
          </span>
          {holiday && !isToday && (
            <div className={`w-1.5 h-1.5 rounded-full mt-1 ${holiday.isCutiBersama ? 'bg-red-300' : 'bg-red-600 animate-pulse'}`} />
          )}
        </div>
      </div>

      {/* Events Container - Full width to allow continuous bars */}
      <div className="mt-auto pb-2 flex flex-col gap-1 relative z-20">
        {activeEvents.map(event => {
          const isStart = isSameDay(day.date, event.startDate);
          const isEnd = isSameDay(day.date, event.endDate);
          
          const isPersonal = event.type === 'Personal';
          
          if (isPersonal && isStart) {
            return (
              <div 
                key={event.id} 
                className="absolute inset-x-0 bottom-10 flex justify-center z-30 pointer-events-none"
              >
                <div className={`${event.color} text-white text-[10px] px-3 py-1 rounded-full font-bold border-2 border-white shadow-md whitespace-nowrap`}>
                  {event.title}
                </div>
              </div>
            );
          }

          // The Ribbon Style
          return (
            <div 
              key={event.id} 
              className={`h-7 ${event.color} relative flex items-center shadow-sm transition-opacity group-hover:opacity-90
                ${isStart ? 'ml-1 rounded-l-full pl-3' : 'ml-0'}
                ${isEnd ? 'mr-1 rounded-r-full pr-3' : 'mr-0'}
              `}
            >
              {isStart && (
                <span className="text-[11px] font-bold text-white truncate drop-shadow-sm whitespace-nowrap">
                  {event.title}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DayCell;

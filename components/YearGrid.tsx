
import React from 'react';
import { isWithinInterval, startOfDay, endOfDay } from 'date-fns';
import { DayData, CalendarEvent } from '../types';
import { GRID_COLUMNS } from '../constants';
import DayCell from './DayCell';

interface YearGridProps {
  days: DayData[];
  events: CalendarEvent[];
  onDateClick: (date: Date) => void;
}

const YearGrid: React.FC<YearGridProps> = ({ days, events, onDateClick }) => {
  const rows = [];
  for (let i = 0; i < days.length; i += GRID_COLUMNS) {
    rows.push(days.slice(i, i + GRID_COLUMNS));
  }

  return (
    <div className="relative border-l border-t border-slate-200 inline-block min-w-full">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex border-b border-slate-200 h-28 min-w-max">
          {row.map((day, colIndex) => {
            const activeEvents = events.filter(event => 
              isWithinInterval(day.date, { 
                start: startOfDay(event.startDate), 
                end: endOfDay(event.endDate) 
              })
            );

            return (
              <DayCell 
                key={day.date.toISOString()}
                day={day}
                activeEvents={activeEvents}
                isLastInRow={colIndex === row.length - 1}
                onClick={() => onDateClick(day.date)}
              />
            );
          })}
          {row.length < GRID_COLUMNS && Array.from({ length: GRID_COLUMNS - row.length }).map((_, i) => (
            <div key={`empty-${i}`} className="flex-1 min-w-[60px] border-r border-slate-200 bg-slate-50/30" />
          ))}
        </div>
      ))}
    </div>
  );
};

export default YearGrid;


import React from 'react';
import { X, Plus, Edit2, Trash2, Info } from 'lucide-react';
import { format, isSameDay } from 'date-fns';
import { CalendarEvent } from '../types';
import { INDONESIAN_HOLIDAYS_2026 } from '../constants';

interface DayActionModalProps {
  date: Date;
  events: CalendarEvent[];
  onClose: () => void;
  onEdit: (event: CalendarEvent) => void;
  onDelete: (id: string) => void;
  onCreateNew: () => void;
}

const DayActionModal: React.FC<DayActionModalProps> = ({ 
  date, 
  events, 
  onClose, 
  onEdit, 
  onDelete, 
  onCreateNew 
}) => {
  const holiday = INDONESIAN_HOLIDAYS_2026.find(h => isSameDay(h.date, date));

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden border border-slate-100 animate-in slide-in-from-bottom-8 duration-300">
        <div className={`p-6 border-b border-slate-50 ${holiday ? (holiday.isCutiBersama ? 'bg-red-50' : 'bg-red-100/50') : 'bg-slate-50/50'}`}>
          <div className="flex items-center justify-between mb-2">
            <h3 className={`text-sm font-bold uppercase tracking-widest ${holiday ? 'text-red-500' : 'text-slate-400'}`}>
              {format(date, 'EEEE, MMM d')}
            </h3>
            <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-full transition-colors text-slate-400">
              <X size={18} />
            </button>
          </div>
          <p className="text-xl font-extrabold text-slate-800">Day Overview</p>
          
          {holiday && (
            <div className={`mt-3 p-3 rounded-2xl flex items-start gap-3 border ${holiday.isCutiBersama ? 'bg-white border-red-100 text-red-600' : 'bg-red-500 text-white border-transparent'}`}>
              <Info size={18} className="mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-bold uppercase tracking-wide opacity-80">
                  {holiday.isCutiBersama ? 'Cuti Bersama' : 'National Holiday'}
                </p>
                <p className="font-bold leading-tight">{holiday.name}</p>
              </div>
            </div>
          )}
        </div>

        <div className="p-6">
          <div className="space-y-3 mb-6">
            {events.length > 0 ? (
              events.map((event) => (
                <div 
                  key={event.id}
                  className="group flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:border-indigo-200 hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-3 h-12 rounded-full ${event.color}`} />
                    <div>
                      <h4 className="font-bold text-slate-800 leading-tight">{event.title}</h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                        {event.startTime || 'All day'} {event.endTime ? ` — ${event.endTime}` : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => onEdit(event)}
                      className="p-2 hover:bg-indigo-50 rounded-xl text-indigo-600 transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => onDelete(event.id)}
                      className="p-2 hover:bg-red-50 rounded-xl text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-slate-400 font-medium">No events scheduled for this day.</p>
              </div>
            )}
          </div>

          <button 
            onClick={onCreateNew}
            className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-slate-900 text-white rounded-2xl font-bold hover:bg-indigo-600 transition-all shadow-lg active:scale-95"
          >
            <Plus size={20} />
            Add Event
          </button>
        </div>
      </div>
    </div>
  );
};

export default DayActionModal;

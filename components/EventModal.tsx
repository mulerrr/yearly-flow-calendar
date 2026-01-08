
import React, { useState, useEffect } from 'react';
import { X, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { CalendarEvent, EventType } from '../types';
import { EVENT_COLORS } from '../constants';

interface EventModalProps {
  isOpen: boolean;
  initialDate: Date;
  editingEvent?: CalendarEvent | null;
  onClose: () => void;
  onSave: (event: CalendarEvent) => void;
}

const CATEGORIES: EventType[] = ['Trip', 'Personal', 'Family', 'Work'];

const TAILWIND_COLORS = [
  { name: 'Teal', class: 'bg-teal-500' },
  { name: 'Pink', class: 'bg-pink-400' },
  { name: 'Blue', class: 'bg-blue-400' },
  { name: 'Purple', class: 'bg-purple-400' },
  { name: 'Indigo', class: 'bg-indigo-500' },
  { name: 'Orange', class: 'bg-orange-500' },
  { name: 'Slate', class: 'bg-slate-400' },
];

const EventModal: React.FC<EventModalProps> = ({ isOpen, initialDate, editingEvent, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState(format(initialDate, 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(initialDate, 'yyyy-MM-dd'));
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [type, setType] = useState<EventType>('Personal');
  const [color, setColor] = useState(EVENT_COLORS['Personal']);

  useEffect(() => {
    if (editingEvent) {
      setTitle(editingEvent.title);
      setStartDate(format(editingEvent.startDate, 'yyyy-MM-dd'));
      setEndDate(format(editingEvent.endDate, 'yyyy-MM-dd'));
      setStartTime(editingEvent.startTime || '');
      setEndTime(editingEvent.endTime || '');
      setType(editingEvent.type);
      setColor(editingEvent.color);
    } else {
      setTitle('');
      setStartDate(format(initialDate, 'yyyy-MM-dd'));
      setEndDate(format(initialDate, 'yyyy-MM-dd'));
      setStartTime('');
      setEndTime('');
      setType('Personal');
      setColor(EVENT_COLORS['Personal']);
    }
  }, [editingEvent, initialDate, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const savedEvent: CalendarEvent = {
      id: editingEvent?.id || Math.random().toString(36).substr(2, 9),
      title,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      type,
      color,
      startTime: startTime || undefined,
      endTime: endTime || undefined,
    };

    onSave(savedEvent);
    onClose();
  };

  const handleCategoryChange = (newType: EventType) => {
    setType(newType);
    setColor(EVENT_COLORS[newType] || TAILWIND_COLORS[0].class);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">{editingEvent ? 'Edit Event' : 'New Event'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Event Name</label>
            <input 
              autoFocus
              required
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's happening?"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:bg-white focus:border-indigo-500 outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Start Date</label>
              <input 
                required
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:bg-white focus:border-indigo-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">End Date</label>
              <input 
                required
                type="date" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:bg-white focus:border-indigo-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Start Time</label>
              <input 
                type="time" 
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:bg-white focus:border-indigo-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">End Time</label>
              <input 
                type="time" 
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:bg-white focus:border-indigo-500 outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Category</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleCategoryChange(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-bold capitalize transition-all border ${
                    type === cat 
                      ? 'bg-slate-900 text-white border-slate-900 shadow-md scale-105' 
                      : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Custom Color</label>
            <div className="flex flex-wrap gap-3 mt-1">
              {TAILWIND_COLORS.map(c => (
                <button
                  key={c.class}
                  type="button"
                  onClick={() => setColor(c.class)}
                  className={`w-9 h-9 rounded-full transition-all flex items-center justify-center ${c.class} ${
                    color === c.class ? 'ring-4 ring-slate-100 scale-110 shadow-lg' : 'hover:scale-105 opacity-80 hover:opacity-100'
                  }`}
                >
                  {color === c.class && <div className="w-2 h-2 bg-white rounded-full shadow-sm" />}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-6 flex gap-3">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3.5 border border-slate-200 text-slate-500 rounded-2xl font-bold hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 px-4 py-3.5 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all transform active:scale-95"
            >
              {editingEvent ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal;

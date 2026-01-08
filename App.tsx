
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Download,
  Upload
} from 'lucide-react';
import { format, startOfYear, endOfYear, eachDayOfInterval, isSameDay, startOfMonth, isWithinInterval, startOfDay, endOfDay } from 'date-fns';
import { CalendarEvent, DayData } from './types';
import { MOCK_EVENTS } from './constants';
import YearGrid from './components/YearGrid';
import EventModal from './components/EventModal';
import DayActionModal from './components/DayActionModal';

const STORAGE_KEY = 'yearly_flow_events';

const App: React.FC = () => {
  const [currentYear, setCurrentYear] = useState(2026);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Initialize state from localStorage if available, otherwise use MOCK_EVENTS
  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // JSON.parse turns Dates into strings, so we must convert them back to Date objects
        return parsed.map((event: any) => ({
          ...event,
          startDate: new Date(event.startDate),
          endDate: new Date(event.endDate)
        }));
      } catch (e) {
        console.error("Failed to parse saved events", e);
        return MOCK_EVENTS;
      }
    }
    return MOCK_EVENTS;
  });
  
  // Effect to persist events to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  }, [events]);
  
  // Modal states
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  
  // Selection states
  const [selectedInitialDate, setSelectedInitialDate] = useState<Date | null>(null);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [dayEvents, setDayEvents] = useState<CalendarEvent[]>([]);

  const daysOfYear = useMemo(() => {
    const start = startOfYear(new Date(currentYear, 0, 1));
    const end = endOfYear(new Date(currentYear, 0, 1));
    const days = eachDayOfInterval({ start, end });

    return days.map(date => ({
      date,
      dayOfMonth: date.getDate(),
      dayOfWeek: format(date, 'EEE').toUpperCase(),
      isFirstOfMonth: isSameDay(date, startOfMonth(date)),
      monthName: format(date, 'MMM').toUpperCase(),
    }));
  }, [currentYear]);

  const handlePrevYear = () => setCurrentYear(prev => prev - 1);
  const handleNextYear = () => setCurrentYear(prev => prev + 1);

  const handleDateClick = (date: Date) => {
    const eventsOnDay = events.filter(event => 
      isWithinInterval(date, { 
        start: startOfDay(event.startDate), 
        end: endOfDay(event.endDate) 
      })
    );

    setSelectedInitialDate(date);
    
    if (eventsOnDay.length > 0) {
      setDayEvents(eventsOnDay);
      setIsActionModalOpen(true);
    } else {
      setEditingEvent(null);
      setIsEventModalOpen(true);
    }
  };

  const handleSaveEvent = (event: CalendarEvent) => {
    setEvents(prev => {
      const exists = prev.find(e => e.id === event.id);
      if (exists) {
        return prev.map(e => e.id === event.id ? event : e);
      }
      return [...prev, event];
    });
    setIsEventModalOpen(false);
    setEditingEvent(null);
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
    setIsActionModalOpen(false);
    setDayEvents(prev => prev.filter(e => e.id !== id));
  };

  const openEditModal = (event: CalendarEvent) => {
    setEditingEvent(event);
    setIsActionModalOpen(false);
    setIsEventModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingEvent(null);
    setIsActionModalOpen(false);
    setIsEventModalOpen(true);
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(events, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `calendar_events_${format(new Date(), 'yyyyMMdd_HHmm')}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed)) {
          const importedEvents = parsed.map((ev: any) => ({
            ...ev,
            startDate: new Date(ev.startDate),
            endDate: new Date(ev.endDate)
          }));
          setEvents(importedEvents);
          alert('Events imported successfully!');
        } else {
          alert('Invalid file format. Expected a JSON array of events.');
        }
      } catch (err) {
        alert('Error parsing JSON file.');
        console.error(err);
      }
    };
    reader.readAsText(file);
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col p-2 md:p-4">
      <header className="flex items-center justify-between mb-6 max-w-[1800px] mx-auto w-full px-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => { setSelectedInitialDate(new Date()); setEditingEvent(null); setIsEventModalOpen(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-full text-sm font-bold shadow-md hover:bg-indigo-700 transition-all active:scale-95"
          >
            <Plus size={18} />
            <span>Add New Event</span>
          </button>
          
          <div className="h-8 w-px bg-slate-200 hidden sm:block" />
          
          <div className="flex items-center gap-1">
            <button 
              onClick={handleExport}
              title="Export events to JSON file"
              className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors"
            >
              <Download size={20} />
            </button>
            <button 
              onClick={handleImportClick}
              title="Import events from JSON file"
              className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors"
            >
              <Upload size={20} />
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept=".json" 
              className="hidden" 
            />
          </div>
        </div>

        <div className="flex items-center gap-2 cursor-pointer group">
          <div className="w-8 h-8 flex items-center justify-center bg-indigo-600 rounded text-white font-bold">Y</div>
          <span className="font-bold text-xl flex items-center gap-1 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">
            Yearly Calendar
          </span>
        </div>

        <div className="hidden md:flex w-[140px] justify-end items-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
            {events.length} Events
          </span>
        </div>
      </header>

      <main className="flex-1 max-w-[1800px] mx-auto w-full border border-slate-200 rounded-2xl shadow-xl overflow-hidden flex flex-col bg-white">
        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100">
          <h1 className="text-3xl font-bold tracking-tight">{currentYear}</h1>
          <div className="flex items-center gap-2">
            <button 
              onClick={handlePrevYear}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors border border-slate-100 shadow-sm"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={handleNextYear}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors border border-slate-100 shadow-sm"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto bg-white p-4">
          <YearGrid days={daysOfYear} events={events} onDateClick={handleDateClick} />
        </div>
      </main>

      {isActionModalOpen && selectedInitialDate && (
        <DayActionModal 
          date={selectedInitialDate}
          events={dayEvents}
          onClose={() => setIsActionModalOpen(false)}
          onEdit={openEditModal}
          onDelete={handleDeleteEvent}
          onCreateNew={openCreateModal}
        />
      )}

      {isEventModalOpen && (
        <EventModal 
          isOpen={isEventModalOpen}
          initialDate={selectedInitialDate || new Date()}
          editingEvent={editingEvent}
          onClose={() => { setIsEventModalOpen(false); setEditingEvent(null); }}
          onSave={handleSaveEvent}
        />
      )}
    </div>
  );
};

export default App;

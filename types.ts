
export type EventType = 'Trip' | 'Personal' | 'Family' | 'Work';

export interface CalendarEvent {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  type: EventType;
  color: string;
  startTime?: string;
  endTime?: string;
}

export interface DayData {
  date: Date;
  dayOfMonth: number;
  dayOfWeek: string;
  isFirstOfMonth: boolean;
  monthName: string;
}

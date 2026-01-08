
export const GRID_COLUMNS = 25;

export const EVENT_COLORS: Record<string, string> = {
  'Trip': 'bg-teal-500',
  'Personal': 'bg-orange-400',
  'Family': 'bg-pink-500',
  'Work': 'bg-indigo-500',
};

export interface Holiday {
  date: Date;
  name: string;
  isCutiBersama: boolean;
}

export const INDONESIAN_HOLIDAYS_2026: Holiday[] = [
  // National Holidays
  { date: new Date(2026, 0, 1), name: 'Tahun Baru 2026 Masehi', isCutiBersama: false },
  { date: new Date(2026, 0, 16), name: 'Isra Mikraj Nabi Muhammad S.A.W.', isCutiBersama: false },
  { date: new Date(2026, 1, 17), name: 'Tahun Baru Imlek 2576 Kongzili', isCutiBersama: false },
  { date: new Date(2026, 2, 19), name: 'Hari Suci Nyepi', isCutiBersama: false },
  { date: new Date(2026, 2, 21), name: 'Idulfitri 1447 Hijriah', isCutiBersama: false },
  { date: new Date(2026, 2, 22), name: 'Idulfitri 1447 Hijriah', isCutiBersama: false },
  { date: new Date(2026, 3, 3), name: 'Wafat Yesus Kristus', isCutiBersama: false },
  { date: new Date(2026, 3, 5), name: 'Paskah', isCutiBersama: false },
  { date: new Date(2026, 4, 1), name: 'Hari Buruh Internasional', isCutiBersama: false },
  { date: new Date(2026, 4, 14), name: 'Kenaikan Yesus Kristus', isCutiBersama: false },
  { date: new Date(2026, 4, 27), name: 'Iduladha 1447 Hijriah', isCutiBersama: false },
  { date: new Date(2026, 4, 31), name: 'Hari Raya Waisak 2570 BE', isCutiBersama: false },
  { date: new Date(2026, 5, 1), name: 'Hari Lahir Pancasila', isCutiBersama: false },
  { date: new Date(2026, 5, 16), name: 'Tahun Baru Islam 1448 Hijriah', isCutiBersama: false },
  { date: new Date(2026, 7, 17), name: 'Proklamasi Kemerdekaan', isCutiBersama: false },
  { date: new Date(2026, 7, 25), name: 'Maulid Nabi Muhammad S.A.W', isCutiBersama: false },
  { date: new Date(2026, 11, 25), name: 'Kelahiran Yesus Kristus', isCutiBersama: false },
  
  // Cuti Bersama
  { date: new Date(2026, 1, 16), name: 'Cuti Bersama Imlek', isCutiBersama: true },
  { date: new Date(2026, 2, 18), name: 'Cuti Bersama Nyepi', isCutiBersama: true },
  { date: new Date(2026, 2, 20), name: 'Cuti Bersama Idulfitri', isCutiBersama: true },
  { date: new Date(2026, 2, 23), name: 'Cuti Bersama Idulfitri', isCutiBersama: true },
  { date: new Date(2026, 2, 24), name: 'Cuti Bersama Idulfitri', isCutiBersama: true },
  { date: new Date(2026, 4, 15), name: 'Cuti Bersama Kenaikan Yesus Kristus', isCutiBersama: true },
  { date: new Date(2026, 4, 28), name: 'Cuti Bersama Iduladha', isCutiBersama: true },
  { date: new Date(2026, 11, 26), name: 'Cuti Bersama Natal', isCutiBersama: true },
];

export const MOCK_EVENTS = []; // Clear all predefined mock events

import { AppState } from './types';

export const INITIAL_STATE: AppState = {
  books: {
    A: { id: 'A', name: 'Book A (Mon/Thu)', pdfUrl: null, audioUrl: null },
    B: { id: 'B', name: 'Book B (Tue/Fri)', pdfUrl: null, audioUrl: null },
    C: { id: 'C', name: 'Book C (Wed/Sat)', pdfUrl: null, audioUrl: null },
  },
  global: {
    posterUrl: null,
    bellAudioUrl: null,
  },
};

// Map JS getDay() (0-6) to Book ID. 
// 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
export const SCHEDULE_MAP: Record<number, 'A' | 'B' | 'C' | null> = {
  0: null, // Sunday - Rest or Fallback
  1: 'A',
  2: 'B',
  3: 'C',
  4: 'A',
  5: 'B',
  6: 'C',
};

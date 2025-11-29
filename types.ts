export type BookType = 'A' | 'B' | 'C';

export interface BookConfig {
  id: BookType;
  name: string;
  pdfUrl: string | null;
  audioUrl: string | null; // The specific classical music for this book
}

export interface GlobalConfig {
  posterUrl: string | null;
  bellAudioUrl: string | null;
}

export interface AppState {
  books: Record<BookType, BookConfig>;
  global: GlobalConfig;
}

export const DAYS_OF_WEEK = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

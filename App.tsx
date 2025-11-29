import React, { useState, useMemo, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { AdminPanel } from './components/AdminPanel';
import { AppState, BookType, DAYS_OF_WEEK } from './types';
import { INITIAL_STATE, SCHEDULE_MAP } from './constants';
import { Image as ImageIcon, FileText } from 'lucide-react';

export default function App() {
  const [state, setState] = useState<AppState>(INITIAL_STATE);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [todayIndex, setTodayIndex] = useState(new Date().getDay());

  // Determine current book based on day
  const currentBookId = SCHEDULE_MAP[todayIndex];
  const currentBook = currentBookId ? state.books[currentBookId] : null;

  // Handler helpers
  const handleUploadBell = (file: File) => {
    const url = URL.createObjectURL(file);
    setState(prev => ({ ...prev, global: { ...prev.global, bellAudioUrl: url } }));
  };

  const handleUploadPoster = (file: File) => {
    const url = URL.createObjectURL(file);
    setState(prev => ({ ...prev, global: { ...prev.global, posterUrl: url } }));
  };

  const handleUpdateBook = (bookId: BookType, field: 'pdfUrl' | 'audioUrl', file: File) => {
    const url = URL.createObjectURL(file);
    setState(prev => ({
      ...prev,
      books: {
        ...prev.books,
        [bookId]: {
          ...prev.books[bookId],
          [field]: url
        }
      }
    }));
  };

  // Helper for debug/demo: If no day selected in dev, toggle through. 
  // For production, this stays fixed to real date.
  // We can add a simple Day override for testing purposes if needed, 
  // but for now we rely on system time.

  return (
    <div className="min-h-screen bg-gray-50 pl-16">
      <Sidebar 
        bellAudioUrl={state.global.bellAudioUrl}
        currentBookAudioUrl={currentBook?.audioUrl || null}
        onUploadBell={handleUploadBell}
        onUploadBookAudio={() => {}} // Not used directly in sidebar, admin handles this structure
        onToggleAdmin={() => setIsAdminOpen(true)}
        isAdminOpen={isAdminOpen}
      />

      <AdminPanel 
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        state={state}
        onUpdateBook={handleUpdateBook}
        onUpdatePoster={handleUploadPoster}
      />

      {/* Main Content Area */}
      <main className="w-full">
        
        {/* 1. Full Size Poster */}
        <section className="h-screen w-full relative bg-gray-200 flex items-center justify-center overflow-hidden group">
            {state.global.posterUrl ? (
                <img 
                    src={state.global.posterUrl} 
                    alt="Event Poster" 
                    className="w-full h-full object-cover"
                />
            ) : (
                <div className="text-center text-gray-400 p-8 border-4 border-dashed border-gray-300 rounded-3xl">
                    <ImageIcon size={64} className="mx-auto mb-4 opacity-50" />
                    <h2 className="text-3xl font-bold mb-2">Poster Placeholder</h2>
                    <p>Upload a poster in the Admin panel to display here.</p>
                </div>
            )}
            
            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-white drop-shadow-md">
                <span className="text-sm font-medium bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm">
                    Scroll for Reading Material
                </span>
            </div>
        </section>

        {/* 2. PDF Reader Section */}
        <section className="min-h-screen w-full bg-white border-t-8 border-slate-900 relative">
            <div className="absolute top-0 left-0 w-full bg-slate-900 text-white p-4 flex justify-between items-center z-10 shadow-md">
                <div>
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <span className="text-blue-400">{DAYS_OF_WEEK[todayIndex]}</span>
                        <span className="text-slate-500">|</span>
                        {currentBook ? currentBook.name : "No Reading Scheduled"}
                    </h2>
                </div>
                {!currentBook?.pdfUrl && (
                    <div className="text-sm text-yellow-400 italic">
                        No PDF assigned. Please configure in Admin.
                    </div>
                )}
            </div>
            
            <div className="w-full h-screen pt-16 bg-gray-100 flex items-center justify-center">
                {currentBook?.pdfUrl ? (
                    <object
                        data={currentBook.pdfUrl}
                        type="application/pdf"
                        className="w-full h-full"
                    >
                         <div className="flex flex-col items-center justify-center h-full text-gray-500">
                             <p className="mb-4">It appears your browser doesn't support embedded PDFs.</p>
                             <a href={currentBook.pdfUrl} target="_blank" rel="noreferrer" className="text-blue-600 underline">
                                 Download PDF
                             </a>
                         </div>
                    </object>
                ) : (
                    <div className="text-center text-gray-400 p-12 max-w-lg border-2 border-dashed border-gray-300 rounded-2xl bg-white">
                        <FileText size={64} className="mx-auto mb-4 opacity-50" />
                        <h3 className="text-xl font-semibold mb-2">Reading Material Area</h3>
                        <p>
                            {currentBook 
                                ? `Please upload the PDF for "${currentBook.name}" in the Admin Panel.` 
                                : "No book is scheduled for today."}
                        </p>
                    </div>
                )}
            </div>
        </section>

      </main>
    </div>
  );
}
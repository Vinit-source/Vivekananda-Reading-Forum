import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { AdminPanel } from './components/AdminPanel';
import { AppState, BookType, DAYS_OF_WEEK } from './types';
import { INITIAL_STATE, SCHEDULE_MAP } from './constants';
import { Image as ImageIcon, FileText, ExternalLink } from 'lucide-react';

export default function App() {
  const [state, setState] = useState<AppState>(INITIAL_STATE);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const todayIndexArray = useState(new Date().getDay());
  const todayIndex = todayIndexArray[0];
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
    setState(prev => {
      const newState = {
        ...prev,
        books: {
          ...prev.books,
          [bookId]: {
            ...prev.books[bookId],
            [field]: url
          }
        }
      };

      // Automatically set the book name from the filename if uploading a PDF
      if (field === 'pdfUrl') {
        // Remove extension from filename
        const name = file.name.replace(/\.[^/.]+$/, "");
        newState.books[bookId].name = name;
      }

      return newState;
    });
  };

  const handleUpdateBookName = (bookId: BookType, name: string) => {
    setState(prev => ({
      ...prev,
      books: {
        ...prev.books,
        [bookId]: {
          ...prev.books[bookId],
          name
        }
      }
    }));
  };

  return (
    <div className="min-h-screen bg-orange-50 pl-16 font-sans">
      <Sidebar 
        bellAudioUrl={state.global.bellAudioUrl}
        currentBookAudioUrl={currentBook?.audioUrl || null}
        onUploadBell={handleUploadBell}
        onUploadBookAudio={() => {}} 
        onToggleAdmin={() => setIsAdminOpen(true)}
        isAdminOpen={isAdminOpen}
      />

      <AdminPanel 
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        state={state}
        onUpdateBook={handleUpdateBook}
        onUpdateBookName={handleUpdateBookName}
        onUpdatePoster={handleUploadPoster}
      />

      {/* Main Content Area */}
      <main className="w-full">
        
        {/* 1. Full Size Poster */}
        <section className="h-screen w-full relative bg-orange-100 flex items-center justify-center overflow-hidden group">
            {state.global.posterUrl ? (
                <img 
                    src={state.global.posterUrl} 
                    alt="Event Poster" 
                    className="w-full h-full object-contain"
                />
            ) : (
                <div className="text-center text-orange-300 p-8 border-4 border-dashed border-orange-200 rounded-3xl bg-orange-50/50">
                    <ImageIcon size={64} className="mx-auto mb-4 opacity-50" />
                    <h2 className="text-3xl font-bold mb-2 text-orange-900">Poster Placeholder</h2>
                    <p className="text-orange-800">Upload a poster in the Admin panel to display here.</p>
                </div>
            )}
        </section>

        {/* 2. PDF Reader Section */}
        <section className="min-h-screen w-full bg-white border-t-8 border-blue-950 relative">
            <div className="absolute top-0 left-0 w-full bg-blue-950 text-white p-4 flex justify-between items-center z-10 shadow-lg border-b border-orange-500">
                <div>
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <span className="text-orange-400 uppercase tracking-widest text-sm">{DAYS_OF_WEEK[todayIndex]}</span>
                        <span className="text-blue-700">|</span>
                        <span className="text-white text-lg">{currentBook ? currentBook.name : "No Reading Scheduled"}</span>
                    </h2>
                </div>
                {currentBook?.pdfUrl ? (
                   <a 
                     href={currentBook.pdfUrl} 
                     target="_blank" 
                     rel="noreferrer"
                     className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-3 py-1.5 rounded-md text-sm transition-colors"
                   >
                     <ExternalLink size={16} />
                     <span>Open in New Tab</span>
                   </a>
                ) : (
                    <div className="text-sm text-orange-300 italic flex items-center gap-2">
                        <span>No PDF assigned. Please configure in Admin.</span>
                    </div>
                )}
            </div>
            
            <div className="w-full h-screen pt-16 bg-orange-50 flex items-center justify-center relative">
                {currentBook?.pdfUrl ? (
                    <iframe
                        src={currentBook.pdfUrl}
                        className="w-full h-full shadow-inner"
                        title="PDF Reader"
                    />
                ) : (
                    <div className="text-center text-gray-400 p-12 max-w-lg border-2 border-dashed border-orange-200 rounded-2xl bg-white shadow-sm">
                        <FileText size={64} className="mx-auto mb-4 text-orange-200" />
                        <h3 className="text-xl font-semibold mb-2 text-blue-950">Reading Material Area</h3>
                        <p className="text-gray-500">
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
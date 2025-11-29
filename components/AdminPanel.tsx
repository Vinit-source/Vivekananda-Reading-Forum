import React from 'react';
import { X, Upload, FileText, Music } from 'lucide-react';
import { AppState, BookType } from '../types';
import { Button } from './Button';

interface AdminPanelProps {
  state: AppState;
  isOpen: boolean;
  onClose: () => void;
  onUpdateBook: (bookId: BookType, field: 'pdfUrl' | 'audioUrl', file: File) => void;
  onUpdatePoster: (file: File) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  state,
  isOpen,
  onClose,
  onUpdateBook,
  onUpdatePoster
}) => {
  if (!isOpen) return null;

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>, callback: (f: File) => void) => {
    if (e.target.files && e.target.files[0]) {
      callback(e.target.files[0]);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Admin Configuration</h2>
            <p className="text-sm text-gray-500">Assign content for weekly reading schedule</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
            
            {/* Global Settings */}
            <section>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    Global Settings
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <span className="font-medium text-gray-700">Main Poster Image</span>
                            <p className="text-xs text-gray-500">Displays at the top of the page</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500 truncate max-w-[150px]">
                                {state.global.posterUrl ? 'Image Loaded' : 'No image'}
                            </span>
                            <label className="cursor-pointer">
                                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e, onUpdatePoster)} />
                                <div className="bg-blue-50 text-blue-600 px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-100 transition-colors flex items-center gap-2">
                                    <Upload size={16} /> Upload Poster
                                </div>
                            </label>
                        </div>
                    </div>
                </div>
            </section>

            {/* Book Schedule */}
            <section>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Weekly Schedule Assignments</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {(['A', 'B', 'C'] as BookType[]).map((bookId) => {
                        const book = state.books[bookId];
                        return (
                            <div key={bookId} className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                                <div className="bg-slate-100 p-3 border-b border-gray-200">
                                    <h4 className="font-bold text-gray-800">{book.name}</h4>
                                </div>
                                <div className="p-4 space-y-4">
                                    {/* PDF Upload */}
                                    <div>
                                        <div className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-600">
                                            <FileText size={16} /> PDF Document
                                        </div>
                                        <div className="flex items-center gap-2">
                                             <label className="w-full cursor-pointer">
                                                <input 
                                                    type="file" 
                                                    accept="application/pdf" 
                                                    className="hidden" 
                                                    onChange={(e) => handleFile(e, (f) => onUpdateBook(bookId, 'pdfUrl', f))} 
                                                />
                                                <div className={`w-full border-2 border-dashed rounded-lg p-3 text-center transition-colors ${
                                                    book.pdfUrl ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-blue-400'
                                                }`}>
                                                    <span className={`text-sm ${book.pdfUrl ? 'text-green-700 font-medium' : 'text-gray-500'}`}>
                                                        {book.pdfUrl ? 'PDF Uploaded' : 'Upload PDF'}
                                                    </span>
                                                </div>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Audio Upload */}
                                    <div>
                                        <div className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-600">
                                            <Music size={16} /> Classical Track
                                        </div>
                                        <div className="flex items-center gap-2">
                                             <label className="w-full cursor-pointer">
                                                <input 
                                                    type="file" 
                                                    accept="audio/*" 
                                                    className="hidden" 
                                                    onChange={(e) => handleFile(e, (f) => onUpdateBook(bookId, 'audioUrl', f))} 
                                                />
                                                 <div className={`w-full border-2 border-dashed rounded-lg p-3 text-center transition-colors ${
                                                    book.audioUrl ? 'border-purple-300 bg-purple-50' : 'border-gray-300 hover:border-purple-400'
                                                }`}>
                                                    <span className={`text-sm ${book.audioUrl ? 'text-purple-700 font-medium' : 'text-gray-500'}`}>
                                                        {book.audioUrl ? 'Audio Uploaded' : 'Upload Audio'}
                                                    </span>
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>
        </div>
      </div>
    </div>
  );
};
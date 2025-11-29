import React, { useState, useRef } from 'react';
import { 
  Bell, 
  Music, 
  Settings, 
  ChevronRight, 
  ChevronLeft, 
  Upload,
  Volume2
} from 'lucide-react';
import { Button } from './Button';

interface SidebarProps {
  bellAudioUrl: string | null;
  currentBookAudioUrl: string | null;
  onUploadBell: (file: File) => void;
  onUploadBookAudio: (file: File) => void; // This uploads/overrides the CURRENT book's audio for temporary playback if needed, or we rely on admin
  onToggleAdmin: () => void;
  isAdminOpen: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  bellAudioUrl,
  currentBookAudioUrl,
  onUploadBell,
  onToggleAdmin,
  isAdminOpen
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const bellInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, callback: (f: File) => void) => {
    if (e.target.files && e.target.files[0]) {
      callback(e.target.files[0]);
    }
  };

  return (
    <div 
      className={`fixed left-0 top-0 h-full bg-slate-900 text-white shadow-xl transition-all duration-300 ease-in-out z-50 flex flex-col ${
        isOpen ? 'w-80' : 'w-16'
      }`}
    >
      {/* Toggle Button */}
      <div className="flex justify-end p-2">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 hover:bg-slate-800 rounded-full transition-colors"
          aria-label="Toggle Sidebar"
        >
          {isOpen ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col gap-6 overflow-y-auto overflow-x-hidden">
        
        {/* Bell Section */}
        <div className={`px-2 py-4 ${isOpen ? 'opacity-100' : 'opacity-100 flex flex-col items-center'}`}>
            <div className="flex items-center gap-3 mb-2 px-2">
                <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0 text-yellow-400">
                    <Bell size={20} />
                </div>
                <span className={`font-semibold whitespace-nowrap transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>
                    Bell Sound
                </span>
            </div>

            {/* Hidden Input */}
            <input 
                type="file" 
                ref={bellInputRef}
                accept="audio/*"
                className="hidden"
                onChange={(e) => handleFileChange(e, onUploadBell)}
            />

            {isOpen && (
                <div className="px-2">
                    <audio 
                        controls 
                        src={bellAudioUrl || undefined} 
                        className="w-full h-8 mb-2 invert-[.9]"
                    />
                    <Button 
                        variant="secondary" 
                        size="sm" 
                        className="w-full text-xs"
                        icon={<Upload size={14} />}
                        onClick={() => bellInputRef.current?.click()}
                    >
                        {bellAudioUrl ? 'Change Bell' : 'Upload Bell'}
                    </Button>
                </div>
            )}
        </div>

        <div className="border-t border-slate-700 mx-4"></div>

        {/* Classical/Book Music Section */}
        <div className={`px-2 py-4 ${isOpen ? 'opacity-100' : 'opacity-100 flex flex-col items-center'}`}>
            <div className="flex items-center gap-3 mb-2 px-2">
                <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 text-purple-400">
                    <Music size={20} />
                </div>
                <span className={`font-semibold whitespace-nowrap transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>
                    Background Music
                </span>
            </div>

            {isOpen && (
                <div className="px-2">
                    {currentBookAudioUrl ? (
                        <>
                             <div className="text-xs text-slate-400 mb-1">Playing scheduled track</div>
                             <audio 
                                controls 
                                src={currentBookAudioUrl} 
                                className="w-full h-8 mb-2 invert-[.9]"
                            />
                        </>
                    ) : (
                        <div className="text-xs text-slate-500 italic mb-2">
                            No audio assigned for today's book. Use Admin to configure.
                        </div>
                    )}
                </div>
            )}
        </div>

      </div>

      {/* Admin Toggle Footer */}
      <div className="p-2 border-t border-slate-800">
        <button
            onClick={onToggleAdmin}
            className={`w-full flex items-center p-2 rounded-lg hover:bg-slate-800 transition-colors ${
                !isOpen ? 'justify-center' : 'justify-start gap-3'
            } ${isAdminOpen ? 'bg-blue-900/50 text-blue-400' : 'text-slate-400'}`}
            title="Admin Panel"
        >
            <Settings size={20} />
            <span className={`whitespace-nowrap transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>
                Admin Panel
            </span>
        </button>
      </div>
    </div>
  );
};
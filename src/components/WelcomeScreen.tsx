import React from 'react';
import { Camera, Sparkles, Maximize, ArrowRight } from 'lucide-react';
import { soundFX } from '../utils/audio';

interface WelcomeScreenProps {
  onStart: () => void;
  onToggleFullscreen?: () => void;
  isFullscreen?: boolean;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onStart,
  onToggleFullscreen,
  isFullscreen
}) => {
  const handleStart = () => {
    soundFX.playButtonClick();
    onStart();
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between items-center p-6 md:p-10 bg-[#121110] text-[#FAF7F2] overflow-hidden select-none">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#E05370]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-[#9381FF]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar */}
      <header className="w-full max-w-6xl flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/15 backdrop-blur-md">
            <Camera className="w-5 h-5 text-[#FAD2E1]" />
          </div>
          <div>
            <span className="font-display font-bold text-lg tracking-wider text-white">AEKONEZT</span>
            <span className="text-xs text-white/50 block tracking-widest uppercase">Digital Photobox</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onToggleFullscreen && (
            <button
              id="welcome-fullscreen-btn"
              onClick={onToggleFullscreen}
              aria-label="Toggle Fullscreen"
              className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 transition-colors"
            >
              <Maximize className="w-5 h-5" />
            </button>
          )}
        </div>
      </header>

      {/* Main Content & Visuals */}
      <main className="w-full max-w-5xl flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-16 my-auto py-8 z-10">
        
        {/* Left: Text & Action */}
        <div className="flex-1 text-center lg:text-left space-y-6 max-w-xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-[#FAD2E1] tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-[#FAD2E1]" />
            <span>INSTANT PHOTO EXPERIENCE</span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08]">
            LET'S MAKE A <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FDE2E4] via-[#FAD2E1] to-[#E2ECE9]">MEMORY.</span>
          </h1>

          <p className="text-lg sm:text-xl text-white/70 font-normal leading-relaxed">
            Strike a pose. We'll handle the rest.
          </p>

          <div className="pt-4 space-y-3">
            <button
              id="start-photo-btn"
              onClick={handleStart}
              className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-gradient-to-r from-[#FAF7F2] to-[#EAE5DF] text-[#121110] font-display font-bold text-xl tracking-wider shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 cursor-pointer group"
            >
              <Camera className="w-6 h-6 text-[#121110] group-hover:rotate-12 transition-transform" />
              <span>START PHOTO</span>
              <ArrowRight className="w-5 h-5 text-[#121110] group-hover:translate-x-1 transition-transform" />
            </button>

            <p className="text-xs text-white/40 tracking-wider">
              Make sure your camera is ready.
            </p>
          </div>
        </div>

        {/* Right: Sample Photostrip Showpiece */}
        <div className="relative flex justify-center items-center">
          {/* Photostrip Card 1 */}
          <div className="w-56 sm:w-64 bg-[#F8F4EF] text-[#1A1817] p-3.5 rounded-2xl shadow-2xl transform -rotate-3 hover:rotate-0 transition-transform duration-300 border border-white/20">
            <div className="text-center py-1.5">
              <span className="font-display text-[10px] tracking-widest font-bold text-[#8C6239] uppercase">A DAY TO REMEMBER</span>
            </div>
            <div className="space-y-2 mt-1">
              <div className="w-full h-24 sm:h-28 rounded-lg bg-[#E8E1D5] overflow-hidden relative">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80" 
                  alt="Sample pose 1"
                  className="w-full h-full object-cover grayscale contrast-125"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="w-full h-24 sm:h-28 rounded-lg bg-[#E8E1D5] overflow-hidden relative">
                <img 
                  src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=80" 
                  alt="Sample pose 2"
                  className="w-full h-full object-cover contrast-110"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="w-full h-24 sm:h-28 rounded-lg bg-[#E8E1D5] overflow-hidden relative">
                <img 
                  src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&auto=format&fit=crop&q=80" 
                  alt="Sample pose 3"
                  className="w-full h-full object-cover sepia-50"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
            <div className="text-center pt-3 pb-1 border-t border-black/10 mt-3">
              <span className="font-mono text-[10px] tracking-wider block font-bold">18.09.2026</span>
              <span className="font-sans text-[8px] tracking-widest uppercase text-black/50">AEKONEZT • STUDIO</span>
            </div>
          </div>

          {/* Secondary Pink Photostrip peek */}
          <div className="hidden sm:block absolute -right-8 -bottom-6 w-52 bg-[#FDE4EA] text-[#87254C] p-3 rounded-2xl shadow-xl transform rotate-6 -z-10 border border-white/20 opacity-80">
            <div className="text-center py-1">
              <span className="font-display text-[9px] font-bold tracking-wider">GOOD VIBES ONLY ♡</span>
            </div>
            <div className="space-y-1.5 mt-1">
              <div className="w-full h-20 rounded-md bg-[#F8D7DA] overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&auto=format&fit=crop&q=80" 
                  alt="Sample 4"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="w-full h-20 rounded-md bg-[#F8D7DA] overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80" 
                  alt="Sample 5"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        </div>

      </main>

      {/* Footer Instructions */}
      <footer className="w-full max-w-6xl flex justify-between items-center text-white/40 text-xs z-10 border-t border-white/5 pt-4">
        <span>Touch or click to operate kiosk</span>
        <span>Tap [SPACE] or Click to Start</span>
      </footer>

    </div>
  );
};

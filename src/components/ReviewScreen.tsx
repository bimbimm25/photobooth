import React from 'react';
import { RefreshCw, ArrowRight, Sparkles, Wand2 } from 'lucide-react';
import { CapturedPhoto, PhotoFilter, PhotoboxTemplate, SessionConfig } from '../types/photobox';
import { PHOTO_FILTERS } from '../utils/filters';
import { soundFX } from '../utils/audio';

interface ReviewScreenProps {
  photos: CapturedPhoto[];
  template: PhotoboxTemplate;
  config: SessionConfig;
  onRetakeAll: () => void;
  onRetakeSingle: (index: number) => void;
  onChangeFilter: (filter: PhotoFilter) => void;
  onCreateFinalPhoto: () => void;
  isGenerating: boolean;
}

export const ReviewScreen: React.FC<ReviewScreenProps> = ({
  photos,
  template,
  config,
  onRetakeAll,
  onRetakeSingle,
  onChangeFilter,
  onCreateFinalPhoto,
  isGenerating
}) => {
  const currentFilterObj = PHOTO_FILTERS.find(f => f.id === config.filter) || PHOTO_FILTERS[0];

  return (
    <div className="min-h-screen w-full flex flex-col justify-between items-center p-4 sm:p-8 bg-[#121110] text-[#FAF7F2] select-none">
      
      {/* Top Header */}
      <header className="w-full max-w-5xl flex justify-between items-center py-2">
        <button
          onClick={() => {
            soundFX.playButtonClick();
            onRetakeAll();
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span className="text-sm font-medium">Retake All</span>
        </button>

        <div className="text-center">
          <span className="font-display font-bold text-xs tracking-widest text-[#FAD2E1] uppercase">STEP 4 OF 5 • REVIEW</span>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            LOOKS GOOD?
          </h2>
        </div>

        <button
          id="create-photo-top-btn"
          onClick={() => {
            soundFX.playButtonClick();
            onCreateFinalPhoto();
          }}
          disabled={isGenerating}
          className="hidden sm:flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white text-[#121110] font-display font-bold text-sm tracking-wide shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
        >
          <span>CREATE MY PHOTO</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </header>

      {/* Main Grid of Captured Photos & Filter Tuning */}
      <main className="w-full max-w-5xl my-auto py-6 flex flex-col items-center gap-8">
        
        {/* Filter Switcher Bar */}
        <div className="w-full max-w-md p-3 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center gap-2">
          <span className="text-[11px] uppercase tracking-widest text-white/60 font-bold flex items-center gap-1.5">
            <Wand2 className="w-3.5 h-3.5 text-[#FAD2E1]" />
            CHOOSE PHOTO FILTER
          </span>
          <div className="flex items-center gap-2 w-full justify-center">
            {PHOTO_FILTERS.map(filter => (
              <button
                key={filter.id}
                onClick={() => {
                  soundFX.playButtonClick();
                  onChangeFilter(filter.id);
                }}
                className={`px-3 sm:px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  config.filter === filter.id
                    ? 'bg-[#FAD2E1] text-[#121110] shadow-md scale-105'
                    : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Photos Grid with Retake Buttons */}
        <div className={`grid gap-4 sm:gap-6 w-full max-w-3xl ${
          config.photoCount === 6 ? 'grid-cols-2 sm:grid-cols-3' :
          config.photoCount === 3 ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-2 sm:grid-cols-4'
        }`}>
          {photos.map((photo, idx) => (
            <div
              key={photo.id || idx}
              className="relative group bg-[#1C1A18] rounded-2xl overflow-hidden border border-white/10 shadow-xl flex flex-col"
            >
              {/* Photo Index Badge */}
              <div className="absolute top-2 left-2 z-20 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-mono font-bold text-white">
                #{idx + 1}
              </div>

              {/* Retake Individual Photo button on hover */}
              <button
                onClick={() => {
                  soundFX.playButtonClick();
                  onRetakeSingle(idx);
                }}
                className="absolute top-2 right-2 z-20 p-2 rounded-full bg-black/70 hover:bg-[#E05370] text-white transition-colors cursor-pointer opacity-80 group-hover:opacity-100"
                title={`Retake Photo #${idx + 1}`}
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>

              {/* Photo Image Display */}
              <div className="w-full aspect-[4/3] overflow-hidden bg-black">
                <img
                  src={photo.dataUrl}
                  alt={`Snap #${idx + 1}`}
                  style={{ filter: currentFilterObj.cssFilter }}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              {/* Retake Label */}
              <button
                onClick={() => {
                  soundFX.playButtonClick();
                  onRetakeSingle(idx);
                }}
                className="w-full py-2 bg-white/5 hover:bg-white/10 text-[11px] font-medium text-white/60 hover:text-white border-t border-white/5 transition-colors text-center"
              >
                Tap to Retake #{idx + 1}
              </button>
            </div>
          ))}
        </div>

      </main>

      {/* Bottom Actions Bar */}
      <footer className="w-full max-w-5xl flex justify-between items-center py-4 border-t border-white/10">
        <button
          onClick={() => {
            soundFX.playButtonClick();
            onRetakeAll();
          }}
          className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium text-sm flex items-center gap-2 border border-white/10 cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>RETAKE ALL</span>
        </button>

        <button
          id="create-my-photo-btn"
          onClick={() => {
            soundFX.playButtonClick();
            onCreateFinalPhoto();
          }}
          disabled={isGenerating}
          className="px-10 py-4 rounded-2xl bg-gradient-to-r from-[#FAF7F2] to-[#FFFFFF] text-[#121110] font-display font-extrabold text-lg tracking-wider shadow-2xl hover:scale-[1.03] active:scale-[0.98] transition-all flex items-center gap-3 cursor-pointer disabled:opacity-50"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin text-[#121110]" />
              <span>COMPOSITING STRIP...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 text-[#121110]" />
              <span>CREATE MY PHOTO</span>
              <ArrowRight className="w-5 h-5 text-[#121110]" />
            </>
          )}
        </button>
      </footer>

    </div>
  );
};

import React from 'react';
import { ArrowRight, ArrowLeft, Calendar, Tag, Check, Sparkles } from 'lucide-react';
import { PhotoboxTemplate, SessionConfig } from '../types/photobox';
import { soundFX } from '../utils/audio';

interface PhotoCountScreenProps {
  selectedTemplate: PhotoboxTemplate;
  config: SessionConfig;
  onChangePhotoCount: (count: 3 | 4 | 6) => void;
  onUpdateConfig: (newConfig: Partial<SessionConfig>) => void;
  onContinue: () => void;
  onBack: () => void;
}

export const PhotoCountScreen: React.FC<PhotoCountScreenProps> = ({
  selectedTemplate,
  config,
  onChangePhotoCount,
  onUpdateConfig,
  onContinue,
  onBack
}) => {
  const counts: Array<{ count: 3 | 4 | 6; label: string; desc: string; badge?: string }> = [
    { count: 3, label: '3 PHOTOS', desc: 'Classic compact strip', badge: 'Quick' },
    { count: 4, label: '4 PHOTOS', desc: 'Standard photobooth strip', badge: 'Most Popular' },
    { count: 6, label: '6 PHOTOS', desc: 'Extended story sequence', badge: 'Party' },
  ];

  const effectiveBg = config.customBgColor || selectedTemplate.background;

  return (
    <div className="min-h-screen w-full flex flex-col justify-between items-center p-4 sm:p-8 bg-[#121110] text-[#FAF7F2] select-none">
      
      {/* Top Header */}
      <header className="w-full max-w-5xl flex justify-between items-center py-2">
        <button
          onClick={() => {
            soundFX.playButtonClick();
            onBack();
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back</span>
        </button>

        <div className="text-center">
          <span className="font-display font-bold text-xs tracking-widest text-[#FAD2E1] uppercase">STEP 3 OF 5</span>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            HOW MANY PHOTOS?
          </h2>
        </div>

        <div className="w-16 sm:w-24" /> {/* Spacer */}
      </header>

      {/* Main Selection & Live Strip Preview */}
      <main className="w-full max-w-5xl my-auto py-6 flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-14">
        
        {/* Left: Options & Customization Controls */}
        <div className="flex-1 w-full max-w-md space-y-6">
          <div className="space-y-3">
            <label className="text-xs uppercase tracking-widest text-white/50 font-bold block">
              SELECT NUMBER OF SHOTS
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {counts.map(opt => {
                const isSelected = config.photoCount === opt.count;
                return (
                  <button
                    key={opt.count}
                    id={`photo-count-btn-${opt.count}`}
                    onClick={() => {
                      soundFX.playButtonClick();
                      onChangePhotoCount(opt.count);
                    }}
                    className={`relative p-4 rounded-2xl flex flex-col items-center text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#FAD2E1] text-[#121110] font-bold shadow-xl scale-[1.03] ring-4 ring-white/20'
                        : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
                    }`}
                  >
                    {opt.badge && (
                      <span className={`absolute -top-2.5 px-2 py-0.5 rounded-full text-[9px] font-extrabold tracking-wide uppercase ${
                        isSelected ? 'bg-[#121110] text-[#FAD2E1]' : 'bg-white/20 text-white'
                      }`}>
                        {opt.badge}
                      </span>
                    )}
                    <span className="font-display text-xl font-extrabold mt-1">
                      {opt.count}
                    </span>
                    <span className="text-xs tracking-wider uppercase opacity-80">
                      PHOTOS
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Customizations */}
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
            <h3 className="text-xs uppercase tracking-widest text-white/60 font-bold flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#FAD2E1]" />
              FRAME CUSTOMIZATION
            </h3>

            {/* Custom Event Title */}
            <div className="space-y-1.5">
              <label className="text-xs text-white/70 block">Event / Strip Title</label>
              <input
                id="custom-event-title-input"
                type="text"
                value={config.customTitle}
                onChange={e => onUpdateConfig({ customTitle: e.target.value })}
                placeholder={selectedTemplate.defaultTitle}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/15 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#FAD2E1]"
                maxLength={40}
              />
            </div>

            {/* Toggle Switches */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              {/* Toggle Date */}
              <button
                id="toggle-date-btn"
                type="button"
                onClick={() => {
                  soundFX.playButtonClick();
                  onUpdateConfig({ showDate: !config.showDate });
                }}
                className={`p-3 rounded-xl flex items-center justify-between text-xs transition-colors border ${
                  config.showDate
                    ? 'bg-white/15 border-white/30 text-white'
                    : 'bg-white/5 border-white/5 text-white/40'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#FAD2E1]" />
                  <span>Show Date</span>
                </span>
                {config.showDate ? <Check className="w-3.5 h-3.5 text-[#FAD2E1]" /> : null}
              </button>

              {/* Toggle Branding */}
              <button
                id="toggle-branding-btn"
                type="button"
                onClick={() => {
                  soundFX.playButtonClick();
                  onUpdateConfig({ showBranding: !config.showBranding });
                }}
                className={`p-3 rounded-xl flex items-center justify-between text-xs transition-colors border ${
                  config.showBranding
                    ? 'bg-white/15 border-white/30 text-white'
                    : 'bg-white/5 border-white/5 text-white/40'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-[#FAD2E1]" />
                  <span>Branding</span>
                </span>
                {config.showBranding ? <Check className="w-3.5 h-3.5 text-[#FAD2E1]" /> : null}
              </button>
            </div>
          </div>
        </div>

        {/* Right: Dynamic Live Miniature Strip Preview */}
        <div className="flex flex-col items-center">
          <span className="text-[11px] uppercase tracking-widest text-white/40 mb-2">LIVE LAYOUT PREVIEW</span>
          
          <div
            style={{ backgroundColor: effectiveBg }}
            className="w-48 sm:w-56 rounded-2xl shadow-2xl p-3 sm:p-4 flex flex-col justify-between border border-black/20 transition-all duration-300 transform hover:scale-105"
          >
            {/* Header Title */}
            {config.showBranding && (
              <div className="text-center py-1 overflow-hidden">
                <span
                  style={{ color: selectedTemplate.textColor }}
                  className="font-display text-[10px] sm:text-[11px] font-bold tracking-wider block truncate uppercase"
                >
                  {config.customTitle || selectedTemplate.defaultTitle}
                </span>
              </div>
            )}

            {/* Photo Slots (3, 4, or 6) */}
            <div className="flex-1 flex flex-col justify-around py-2 gap-1.5">
              {Array.from({ length: config.photoCount }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    borderColor: selectedTemplate.photoBorderColor,
                    borderWidth: Math.min(selectedTemplate.photoBorderWidth, 2),
                    color: selectedTemplate.textColor
                  }}
                  className={`w-full bg-black/15 rounded-md flex items-center justify-center border text-[9px] font-mono font-bold ${
                    config.photoCount === 6 ? 'h-10' : config.photoCount === 4 ? 'h-14' : 'h-18'
                  }`}
                >
                  <span>PHOTO #{i + 1}</span>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="text-center pt-2 border-t border-black/10">
              {config.showDate && (
                <span
                  style={{ color: selectedTemplate.textColor }}
                  className="font-mono text-[9px] block font-bold"
                >
                  {config.eventDate}
                </span>
              )}
              {config.showBranding && (
                <span
                  style={{ color: selectedTemplate.textColor }}
                  className="text-[7px] uppercase tracking-wider block opacity-70"
                >
                  {selectedTemplate.defaultFooter}
                </span>
              )}
            </div>
          </div>
        </div>

      </main>

      {/* Bottom Action Bar */}
      <footer className="w-full max-w-5xl flex justify-between items-center py-4 border-t border-white/10">
        <span className="text-xs text-white/50">
          Template: <strong className="text-white">{selectedTemplate.name}</strong> ({config.photoCount} Photos)
        </span>

        <button
          id="photo-count-lets-go-btn"
          onClick={() => {
            soundFX.playButtonClick();
            onContinue();
          }}
          className="px-10 py-4 rounded-2xl bg-[#FAF7F2] hover:bg-white text-[#121110] font-display font-extrabold text-lg tracking-wider shadow-xl hover:scale-[1.03] active:scale-[0.98] transition-all flex items-center gap-3 cursor-pointer"
        >
          <span>LET'S GO</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </footer>

    </div>
  );
};

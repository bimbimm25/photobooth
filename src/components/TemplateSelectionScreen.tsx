import React from 'react';
import { Check, ArrowRight, ArrowLeft, Palette, Sparkles } from 'lucide-react';
import { PhotoboxTemplate } from '../types/photobox';
import { PHOTOBOX_TEMPLATES, COLOR_PALETTES } from '../data/templates';
import { soundFX } from '../utils/audio';

interface TemplateSelectionScreenProps {
  selectedTemplateId: string;
  onSelectTemplate: (template: PhotoboxTemplate) => void;
  onContinue: () => void;
  onBack: () => void;
  customColor: string;
  onChangeCustomColor: (colorHex: string) => void;
}

export const TemplateSelectionScreen: React.FC<TemplateSelectionScreenProps> = ({
  selectedTemplateId,
  onSelectTemplate,
  onContinue,
  onBack,
  customColor,
  onChangeCustomColor
}) => {
  const selectedTemplate = PHOTOBOX_TEMPLATES.find(t => t.id === selectedTemplateId) || PHOTOBOX_TEMPLATES[0];

  return (
    <div className="min-h-screen w-full flex flex-col justify-between items-center p-3 sm:p-6 md:p-8 bg-[#121110] text-[#FAF7F2] select-none overflow-y-auto">
      
      {/* Top Bar */}
      <header className="w-full max-w-6xl flex justify-between items-center py-2 gap-2">
        <button
          onClick={() => {
            soundFX.playButtonClick();
            onBack();
          }}
          className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-xs sm:text-sm font-medium">Back</span>
        </button>

        <div className="text-center">
          <span className="font-display font-bold text-[10px] sm:text-xs tracking-widest text-[#FAD2E1] uppercase">STEP 2 OF 5</span>
          <h2 className="font-display text-lg sm:text-2xl md:text-3xl font-extrabold tracking-tight text-white">
            CHOOSE YOUR FRAME
          </h2>
        </div>

        <button
          id="template-continue-top-btn"
          onClick={() => {
            soundFX.playButtonClick();
            onContinue();
          }}
          className="flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-6 py-2 sm:py-2.5 rounded-xl bg-white text-[#121110] font-display font-bold text-xs sm:text-sm tracking-wide shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <span>CONTINUE</span>
          <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
      </header>

      {/* Main Grid of Photostrip Frames */}
      <main className="w-full max-w-6xl my-auto py-4 sm:py-6">
        
        {/* Custom Color Palette Bar if custom color template is chosen */}
        {selectedTemplate.id === 'customColor' && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-wrap items-center justify-between gap-3 sm:gap-4 max-w-xl mx-auto animate-fade-in">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-white/80">
              <Palette className="w-4 h-4 text-[#FAD2E1]" />
              <span>Choose Accent Hue:</span>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
              {COLOR_PALETTES.map(col => (
                <button
                  key={col.name}
                  onClick={() => onChangeCustomColor(col.bg)}
                  style={{ backgroundColor: col.bg }}
                  title={col.name}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 transition-transform flex-shrink-0 ${
                    customColor === col.bg ? 'scale-125 border-white shadow-lg' : 'border-black/30 hover:scale-110'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Templates Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {PHOTOBOX_TEMPLATES.map(template => {
            const isSelected = template.id === selectedTemplateId;
            const effectiveBg = template.id === 'customColor' && customColor ? customColor : template.background;

            return (
              <div
                key={template.id}
                id={`template-card-${template.id}`}
                onClick={() => {
                  soundFX.playButtonClick();
                  onSelectTemplate(template);
                }}
                className={`relative flex flex-col items-center p-3 sm:p-4 rounded-2xl cursor-pointer transition-all duration-200 group ${
                  isSelected
                    ? 'ring-4 ring-[#FAD2E1] bg-white/10 scale-[1.02] shadow-2xl shadow-[#FAD2E1]/10'
                    : 'bg-white/5 hover:bg-white/[0.08] hover:scale-[1.01] border border-white/5'
                }`}
              >
                {/* Active Checkmark Badge */}
                {isSelected && (
                  <div className="absolute top-2 right-2 z-20 w-6 h-6 rounded-full bg-[#FAD2E1] text-[#121110] flex items-center justify-center shadow-md">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}

                {/* Badge (e.g. Popular, Vintage) */}
                {template.previewBadge && (
                  <div className="absolute top-2 left-2 z-20 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-bold tracking-wider text-white border border-white/10">
                    {template.previewBadge}
                  </div>
                )}

                {/* Photostrip Realistic Miniature Preview */}
                <div
                  style={{ backgroundColor: effectiveBg }}
                  className="w-full max-w-[140px] sm:max-w-[170px] aspect-[1/2.1] rounded-xl shadow-lg p-2 sm:p-2.5 flex flex-col justify-between border border-black/10 transition-transform group-hover:rotate-1"
                >
                  {/* Miniature Top Title */}
                  <div className="text-center overflow-hidden">
                    <span
                      style={{ color: template.textColor }}
                      className="text-[8px] sm:text-[9px] font-bold tracking-wider block truncate uppercase"
                    >
                      {template.name}
                    </span>
                  </div>

                  {/* 4 Miniature Photo Slots */}
                  <div className="flex-1 flex flex-col justify-around py-1 gap-1">
                    {[1, 2, 3, 4].map(idx => (
                      <div
                        key={idx}
                        style={{
                          borderColor: template.photoBorderColor,
                          borderWidth: Math.min(template.photoBorderWidth, 2)
                        }}
                        className="w-full flex-1 bg-black/10 rounded-sm overflow-hidden relative border"
                      >
                        {/* Sample thumbnail illustration */}
                        <div
                          className="w-full h-full bg-cover bg-center"
                          style={{
                            backgroundImage: `url(https://images.unsplash.com/photo-${
                              idx === 1 ? '1534528741775-53994a69daeb' :
                              idx === 2 ? '1517841905240-472988babdf9' :
                              idx === 3 ? '1524504388940-b1c1722653e1' : '1539571696357-5a69c17a67c6'
                            }?w=150&auto=format&fit=crop&q=70)`
                          }}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Miniature Footer */}
                  <div className="text-center pt-0.5 border-t border-black/10">
                    <span
                      style={{ color: template.textColor }}
                      className="text-[6px] sm:text-[7px] font-mono block tracking-tight font-bold"
                    >
                      18.09.2026 • AEKONEZT
                    </span>
                  </div>
                </div>

                {/* Template Name & Tagline */}
                <div className="mt-3 text-center w-full">
                  <h3 className="font-display font-bold text-sm sm:text-base text-white truncate">
                    {template.name}
                  </h3>
                  <p className="text-xs text-white/50 truncate">
                    {template.tagline}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </main>

      {/* Bottom Action */}
      <footer className="w-full max-w-6xl flex flex-col sm:flex-row justify-between items-center gap-3 py-3 sm:py-4 border-t border-white/10">
        <div className="flex items-center gap-2 text-xs text-white/50">
          <Sparkles className="w-3.5 h-3.5 text-[#FAD2E1]" />
          <span>Selected: <strong className="text-white">{selectedTemplate.name}</strong></span>
        </div>

        <button
          id="template-continue-bottom-btn"
          onClick={() => {
            soundFX.playButtonClick();
            onContinue();
          }}
          className="w-full sm:w-auto min-h-[48px] px-8 py-3.5 rounded-2xl bg-[#FAF7F2] hover:bg-white text-[#121110] font-display font-bold text-sm sm:text-base tracking-wider shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>CONTINUE</span>
          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </footer>

    </div>
  );
};

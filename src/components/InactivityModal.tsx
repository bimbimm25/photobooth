import React, { useEffect, useState } from 'react';
import { AlertCircle, RotateCcw, Play } from 'lucide-react';
import { soundFX } from '../utils/audio';

interface InactivityModalProps {
  isOpen: boolean;
  onContinue: () => void;
  onStartOver: () => void;
}

export const InactivityModal: React.FC<InactivityModalProps> = ({
  isOpen,
  onContinue,
  onStartOver
}) => {
  const [countdown, setCountdown] = useState<number>(15);

  useEffect(() => {
    if (!isOpen) {
      setCountdown(15);
      return;
    }

    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          onStartOver();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, onStartOver]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-sm bg-[#1C1A18] border border-white/20 rounded-3xl p-6 sm:p-8 text-center space-y-6 shadow-2xl animate-fade-in">
        
        <div className="w-16 h-16 mx-auto rounded-full bg-[#E05370]/20 border border-[#E05370]/40 flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-[#E05370]" />
        </div>

        <div className="space-y-2">
          <h3 className="font-display font-bold text-2xl text-white">
            Are you still there?
          </h3>
          <p className="text-sm text-white/60">
            This photobox session will reset in <span className="font-mono font-bold text-[#FAD2E1]">{countdown}s</span> if no activity is detected.
          </p>
        </div>

        <div className="space-y-3 pt-2">
          <button
            id="inactivity-continue-btn"
            onClick={() => {
              soundFX.playButtonClick();
              onContinue();
            }}
            className="w-full py-4 px-6 rounded-2xl bg-[#FAF7F2] hover:bg-white text-[#121110] font-display font-extrabold text-base tracking-wider shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>CONTINUE</span>
          </button>

          <button
            id="inactivity-start-over-btn"
            onClick={() => {
              soundFX.playButtonClick();
              onStartOver();
            }}
            className="w-full py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs font-bold tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>START OVER</span>
          </button>
        </div>

      </div>
    </div>
  );
};

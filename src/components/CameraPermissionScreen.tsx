import React from 'react';
import { Camera, AlertCircle, RefreshCw, Sparkles, ArrowLeft } from 'lucide-react';
import { soundFX } from '../utils/audio';

interface CameraPermissionScreenProps {
  onEnableCamera: () => void;
  onUseDemoCamera: () => void;
  onBackToWelcome: () => void;
  isPermissionDenied: boolean;
  errorMessage?: string;
  isRequesting: boolean;
}

export const CameraPermissionScreen: React.FC<CameraPermissionScreenProps> = ({
  onEnableCamera,
  onUseDemoCamera,
  onBackToWelcome,
  isPermissionDenied,
  errorMessage,
  isRequesting
}) => {
  return (
    <div className="min-h-screen w-full flex flex-col justify-between items-center p-6 md:p-12 bg-[#121110] text-[#FAF7F2] select-none">
      
      {/* Header */}
      <header className="w-full max-w-4xl flex justify-between items-center">
        <button
          onClick={() => {
            soundFX.playButtonClick();
            onBackToWelcome();
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back</span>
        </button>
        <span className="font-display font-bold text-sm tracking-widest text-white/50 uppercase">STEP 1 OF 5 • CAMERA</span>
      </header>

      {/* Main Card */}
      <main className="w-full max-w-lg my-auto py-8">
        <div className="bg-[#1C1A18] border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl text-center space-y-6">
          
          <div className="w-20 h-20 mx-auto rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center relative">
            {isPermissionDenied ? (
              <AlertCircle className="w-10 h-10 text-[#E05370]" />
            ) : (
              <Camera className="w-10 h-10 text-[#FAD2E1]" />
            )}
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#E05370] flex items-center justify-center text-white text-xs font-bold animate-pulse">
              !
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {isPermissionDenied ? 'Camera access is unavailable.' : 'Camera Access Required'}
            </h2>
            <p className="text-white/60 text-sm sm:text-base leading-relaxed">
              {isPermissionDenied
                ? (errorMessage || 'Please enable camera permissions in your browser address bar settings to start taking photos.')
                : 'Allow camera access to start your photo session.'}
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <button
              id="enable-camera-btn"
              onClick={() => {
                soundFX.playButtonClick();
                onEnableCamera();
              }}
              disabled={isRequesting}
              className="w-full py-4 px-6 rounded-2xl bg-[#FAF7F2] hover:bg-white text-[#121110] font-display font-bold text-lg tracking-wider shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
            >
              {isRequesting ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>CONNECTING CAMERA...</span>
                </>
              ) : isPermissionDenied ? (
                <>
                  <RefreshCw className="w-5 h-5" />
                  <span>TRY AGAIN</span>
                </>
              ) : (
                <>
                  <Camera className="w-5 h-5" />
                  <span>ENABLE CAMERA</span>
                </>
              )}
            </button>

            {/* Simulated camera option for testing without physical webcam */}
            <div className="pt-2">
              <button
                id="demo-camera-btn"
                onClick={() => {
                  soundFX.playButtonClick();
                  onUseDemoCamera();
                }}
                className="w-full py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-[#FAD2E1] text-xs font-medium tracking-wide flex items-center justify-center gap-2 border border-white/5 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Or use Virtual Demo Camera Feed</span>
              </button>
            </div>
          </div>

          <p className="text-xs text-white/30">
            Your photos stay safely inside your browser and are never uploaded without your consent.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-4xl text-center text-white/30 text-xs">
        aekonezt Photobooth Kiosk Engine • Real-time getUserMedia
      </footer>

    </div>
  );
};

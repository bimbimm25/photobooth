import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Camera, RefreshCw, FlipHorizontal, Eye, X, Check, Sparkles } from 'lucide-react';
import { CapturedPhoto, PhotoFilter, PhotoboxTemplate, SessionConfig } from '../types/photobox';
import { PHOTO_FILTERS } from '../utils/filters';
import { soundFX } from '../utils/audio';

interface PhotoSessionScreenProps {
  stream: MediaStream | null;
  config: SessionConfig;
  template: PhotoboxTemplate;
  onPhotosCompleted: (photos: CapturedPhoto[]) => void;
  onCancelSession: () => void;
  onUpdateFilter: (filter: PhotoFilter) => void;
}

export const PhotoSessionScreen: React.FC<PhotoSessionScreenProps> = ({
  stream,
  config,
  template,
  onPhotosCompleted,
  onCancelSession,
  onUpdateFilter
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Session progression state
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState<number>(0);
  const [photos, setPhotos] = useState<CapturedPhoto[]>([]);
  const [sessionPhase, setSessionPhase] = useState<'READY' | 'COUNTDOWN' | 'FLASH' | 'RETAKE_CHECK'>('READY');
  const [countdown, setCountdown] = useState<number>(3);
  const [isMirror, setIsMirror] = useState<boolean>(true);
  const [showPoseGuide, setShowPoseGuide] = useState<boolean>(false);
  const [lastCapturedPhoto, setLastCapturedPhoto] = useState<CapturedPhoto | null>(null);

  // Auto-next timer after previewing captured photo
  const autoNextTimerRef = useRef<number | null>(null);
  const countdownIntervalRef = useRef<number | null>(null);

  // Bind video element to media stream
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch(err => {
        console.warn('Video play error:', err);
      });
    }

    return () => {
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
      if (autoNextTimerRef.current) clearTimeout(autoNextTimerRef.current);
    };
  }, [stream]);

  // Actual Frame Grabber using HTML Canvas API
  const captureFrame = useCallback((): CapturedPhoto | null => {
    const video = videoRef.current;
    if (!video) return null;

    const width = video.videoWidth || 1280;
    const height = video.videoHeight || 720;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Apply live mirroring if configured
    if (config.mirrorOutput) {
      ctx.translate(width, 0);
      ctx.scale(-1, 1);
    }

    // Draw raw video frame
    ctx.drawImage(video, 0, 0, width, height);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
    const captured: CapturedPhoto = {
      id: `photo_${Date.now()}_${currentPhotoIndex}`,
      dataUrl,
      timestamp: Date.now(),
      filter: config.filter
    };

    return captured;
  }, [config.filter, config.mirrorOutput, currentPhotoIndex]);

  // Handle Photo Capture Trigger after countdown reaches 0
  const triggerCapture = useCallback(() => {
    // 1. Play Shutter Sound & Flash
    soundFX.playShutterSound();
    setSessionPhase('FLASH');

    // 2. Grab frame
    const newPhoto = captureFrame();

    setTimeout(() => {
      if (newPhoto) {
        setLastCapturedPhoto(newPhoto);
        setPhotos(prev => {
          const updated = [...prev];
          updated[currentPhotoIndex] = newPhoto;
          return updated;
        });
        setSessionPhase('RETAKE_CHECK');
      } else {
        setSessionPhase('READY');
      }
    }, 450); // After flash fades
  }, [captureFrame, currentPhotoIndex]);

  // Start the 3-2-1 Countdown
  const startCountdown = useCallback(() => {
    if (sessionPhase === 'COUNTDOWN' || sessionPhase === 'FLASH') return;

    setSessionPhase('COUNTDOWN');
    setCountdown(3);
    soundFX.playCountdownBeep(false);

    let count = 3;
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);

    countdownIntervalRef.current = window.setInterval(() => {
      count -= 1;
      if (count > 0) {
        setCountdown(count);
        soundFX.playCountdownBeep(count === 1);
      } else {
        if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
        triggerCapture();
      }
    }, 1000);
  }, [sessionPhase, triggerCapture]);

  // Action: Accept current photo and move to next or review
  const handleUsePhoto = useCallback(() => {
    if (autoNextTimerRef.current) clearTimeout(autoNextTimerRef.current);

    const nextIndex = currentPhotoIndex + 1;
    if (nextIndex < config.photoCount) {
      setCurrentPhotoIndex(nextIndex);
      setSessionPhase('READY');
      setLastCapturedPhoto(null);
      // Auto-start next countdown after a brief 1.2s pose interval!
      setTimeout(() => {
        startCountdown();
      }, 1200);
    } else {
      // All photos finished! Proceed to Review
      soundFX.playCelebrationChime();
      onPhotosCompleted(photos);
    }
  }, [config.photoCount, currentPhotoIndex, onPhotosCompleted, photos, startCountdown]);

  // Action: Retake current photo
  const handleRetakeCurrent = () => {
    if (autoNextTimerRef.current) clearTimeout(autoNextTimerRef.current);
    soundFX.playButtonClick();
    setLastCapturedPhoto(null);
    setSessionPhase('READY');
    setTimeout(() => {
      startCountdown();
    }, 400);
  };

  // Keyboard shortcut listener (Space = Capture / Use Photo, R = Retake, Esc = Cancel)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (sessionPhase === 'READY') {
          startCountdown();
        } else if (sessionPhase === 'RETAKE_CHECK') {
          handleUsePhoto();
        }
      } else if (e.code === 'KeyR' && sessionPhase === 'RETAKE_CHECK') {
        e.preventDefault();
        handleRetakeCurrent();
      } else if (e.code === 'Escape') {
        onCancelSession();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUsePhoto, onCancelSession, sessionPhase, startCountdown]);

  // Active filter CSS to style the live camera preview
  const currentFilterOption = PHOTO_FILTERS.find(f => f.id === config.filter) || PHOTO_FILTERS[0];

  return (
    <div className="relative h-screen w-full bg-[#0A0A0A] text-white flex flex-col justify-between overflow-hidden select-none">
      
      {/* 1. Camera Flash Overlay */}
      {sessionPhase === 'FLASH' && (
        <div className="fixed inset-0 z-50 bg-white animate-flash pointer-events-none" />
      )}

      {/* 2. Top Kiosk Navigation & Status Bar */}
      <header className="relative z-30 w-full p-4 sm:p-6 flex items-center justify-between bg-gradient-to-b from-black/80 via-black/40 to-transparent">
        
        {/* Brand & Exit */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              soundFX.playButtonClick();
              onCancelSession();
            }}
            className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
            title="Cancel Session (ESC)"
          >
            <X className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-display font-black text-base sm:text-lg tracking-wider text-white">
              AEKONEZT
            </h1>
            <span className="text-[10px] tracking-widest text-[#FAD2E1] block uppercase">
              {template.name}
            </span>
          </div>
        </div>

        {/* Progress Counter Pill: PHOTO 1 OF 4 */}
        <div className="px-5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/15 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#E05370] animate-pulse" />
          <span className="font-display font-extrabold text-sm sm:text-base tracking-widest text-white">
            PHOTO {currentPhotoIndex + 1} OF {config.photoCount}
          </span>
        </div>

        {/* Camera Tools (Mirror toggle, Pose guide) */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMirror(!isMirror)}
            className={`p-2.5 rounded-xl border transition-colors ${
              isMirror ? 'bg-white/20 border-white/30 text-white' : 'bg-white/5 border-white/10 text-white/50'
            }`}
            title="Toggle Selfie Mirror"
          >
            <FlipHorizontal className="w-4 h-4" />
          </button>

          <button
            onClick={() => setShowPoseGuide(!showPoseGuide)}
            className={`p-2.5 rounded-xl border transition-colors ${
              showPoseGuide ? 'bg-white/20 border-white/30 text-[#FAD2E1]' : 'bg-white/5 border-white/10 text-white/50'
            }`}
            title="Toggle Pose Alignment Guide"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 3. Live Video Viewport */}
      <div className="absolute inset-0 z-10 w-full h-full flex items-center justify-center bg-black overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{
            transform: isMirror ? 'scaleX(-1)' : 'none',
            filter: currentFilterOption.cssFilter
          }}
          className="w-full h-full object-cover"
        />

        {/* Pose Alignment Guide Overlay */}
        {showPoseGuide && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="w-[320px] sm:w-[400px] h-[460px] sm:h-[540px] rounded-[180px] border-2 border-dashed border-white/30 flex flex-col items-center justify-center">
              <span className="text-xs text-white/40 font-bold tracking-widest uppercase bg-black/40 px-3 py-1 rounded-full mb-2">
                Pose Here
              </span>
            </div>
          </div>
        )}

        {/* Active Countdown Big Screen Graphic */}
        {sessionPhase === 'COUNTDOWN' && (
          <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/25 pointer-events-none">
            <div
              key={countdown}
              className="w-40 h-40 sm:w-56 sm:h-56 rounded-full bg-black/60 border-4 border-[#FAD2E1] backdrop-blur-md flex items-center justify-center shadow-2xl animate-ping-once transform transition-transform"
            >
              <span className="font-display text-7xl sm:text-9xl font-black text-white drop-shadow-2xl">
                {countdown}
              </span>
            </div>
          </div>
        )}

        {/* Retake Check Overlay (Quick Inspection after each snap) */}
        {sessionPhase === 'RETAKE_CHECK' && lastCapturedPhoto && (
          <div className="absolute inset-0 z-40 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center p-6 animate-fade-in">
            <div className="w-full max-w-sm sm:max-w-md bg-[#1C1A18] rounded-3xl p-4 sm:p-6 border border-white/15 shadow-2xl space-y-4 text-center">
              <div className="flex items-center justify-between text-xs text-white/60 pb-1">
                <span>PHOTO {currentPhotoIndex + 1} CAPTURED</span>
                <span className="text-[#FAD2E1] font-bold">LOOKS GREAT!</span>
              </div>

              {/* Photo Preview Thumbnail */}
              <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-black border border-white/10 shadow-inner">
                <img
                  src={lastCapturedPhoto.dataUrl}
                  alt="Last capture"
                  style={{ filter: currentFilterOption.cssFilter }}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Action Buttons: USE PHOTO or RETAKE */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  id="retake-current-btn"
                  onClick={handleRetakeCurrent}
                  className="py-3.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-display font-bold text-sm tracking-wider flex items-center justify-center gap-2 border border-white/15 cursor-pointer transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>RETAKE (R)</span>
                </button>

                <button
                  id="use-photo-btn"
                  onClick={handleUsePhoto}
                  className="py-3.5 px-4 rounded-xl bg-[#FAF7F2] hover:bg-white text-[#121110] font-display font-extrabold text-sm tracking-wider flex items-center justify-center gap-2 shadow-lg cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>USE PHOTO</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. Bottom Controls: Filter Pills & Big Capture Button */}
      <footer className="relative z-30 w-full p-4 sm:p-6 flex flex-col items-center gap-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
        
        {/* Live Filter Selector Bar */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-black/60 border border-white/15 backdrop-blur-md overflow-x-auto max-w-full">
          {PHOTO_FILTERS.map(f => (
            <button
              key={f.id}
              onClick={() => {
                soundFX.playButtonClick();
                onUpdateFilter(f.id);
              }}
              className={`px-3 sm:px-4 py-1.5 rounded-xl text-xs font-bold tracking-wider transition-all whitespace-nowrap ${
                config.filter === f.id
                  ? 'bg-white text-[#121110] shadow-md scale-105'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Capture Shutter Button */}
        {sessionPhase === 'READY' && (
          <div className="flex flex-col items-center gap-2">
            <button
              id="capture-shutter-btn"
              onClick={startCountdown}
              className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer group"
            >
              {/* Outer pulsing ring */}
              <div className="absolute inset-0 rounded-full border-4 border-white/40 animate-ring-pulse pointer-events-none" />
              {/* Inner red ring button */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-[#FAF7F2] to-[#FFFFFF] border-4 border-[#121110] flex items-center justify-center group-hover:bg-[#FAD2E1] transition-colors">
                <Camera className="w-7 h-7 sm:w-8 sm:h-8 text-[#121110]" />
              </div>
            </button>
            <span className="text-[11px] font-bold tracking-widest uppercase text-white/60">
              Press [SPACE] or Tap to Snap
            </span>
          </div>
        )}

      </footer>

    </div>
  );
};

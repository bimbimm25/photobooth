import React, { useState, useEffect } from 'react';
import { Download, Printer, RotateCcw, QrCode, Share2, Sparkles, Check, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { downloadImage, generateQRCode } from '../utils/download';
import { soundFX } from '../utils/audio';

interface ResultScreenProps {
  finalImageUrl: string;
  onStartAgain: () => void;
  eventDate: string;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  finalImageUrl,
  onStartAgain,
  eventDate
}) => {
  const [showQRModal, setShowQRModal] = useState<boolean>(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Trigger celebration confetti on mount
  useEffect(() => {
    soundFX.playCelebrationChime();

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#E05370', '#FAD2E1', '#FAF7F2', '#FBBF24', '#9381FF']
      });
    } catch {
      // ignore
    }

    // Generate QR Code for sharing/saving
    // In browser environment, we can encode current URL with session anchor or data URL summary
    const shareTarget = window.location.href;
    generateQRCode(shareTarget).then(code => {
      setQrCodeUrl(code);
    });
  }, []);

  const handleDownload = () => {
    soundFX.playButtonClick();
    const cleanDate = eventDate.replace(/\./g, '-');
    downloadImage(finalImageUrl, `aekonezt-photo-${cleanDate}.png`);
  };

  const handlePrint = () => {
    soundFX.playButtonClick();
    window.print();
  };

  const handleShare = async () => {
    soundFX.playButtonClick();
    if (navigator.share) {
      try {
        // Convert dataUrl to File for native Web Share if supported
        const res = await fetch(finalImageUrl);
        const blob = await res.blob();
        const file = new File([blob], `aekonezt-photo-${eventDate}.png`, { type: 'image/png' });
        await navigator.share({
          title: 'My aekonezt Photostrip',
          text: 'Check out our photostrip from aekonezt Photobooth!',
          files: [file]
        });
      } catch {
        setShowQRModal(true);
      }
    } else {
      setShowQRModal(true);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-between items-center p-4 sm:p-8 bg-[#121110] text-[#FAF7F2] select-none">
      
      {/* Printable Photostrip Element (Strictly isolated by @media print) */}
      <img
        src={finalImageUrl}
        alt="Printable Photostrip"
        className="printable-photostrip hidden print:block"
      />

      {/* Screen Top Header (Hidden on Print) */}
      <header className="no-print w-full max-w-5xl flex justify-between items-center py-2 z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center border border-white/15">
            <Sparkles className="w-4 h-4 text-[#FAD2E1]" />
          </div>
          <span className="font-display font-black text-sm tracking-wider text-white">AEKONEZT PHOTOBOOTH</span>
        </div>

        <button
          id="start-again-top-btn"
          onClick={() => {
            soundFX.playButtonClick();
            onStartAgain();
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="text-sm font-medium">Start Again</span>
        </button>
      </header>

      {/* Main Strip Showcase (Hidden on Print) */}
      <main className="no-print w-full max-w-5xl my-auto py-6 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-14 z-10">
        
        {/* Photostrip High-Res Display Frame */}
        <div className="relative group max-h-[72vh] flex items-center justify-center">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-black/80 border-4 border-white/10 max-h-[72vh] transition-transform duration-300 group-hover:scale-[1.01]">
            <img
              src={finalImageUrl}
              alt="Final Photostrip"
              className="max-h-[72vh] w-auto object-contain rounded-xl"
            />
          </div>
        </div>

        {/* Action Panel */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-6 max-w-md">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-[#FAD2E1] tracking-wider uppercase">
              <Check className="w-3.5 h-3.5 text-[#4ADE80]" />
              HIGH RESOLUTION EXPORT READY
            </div>
            <h1 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              YOUR MEMORY IS READY.
            </h1>
            <p className="text-white/60 text-sm sm:text-base leading-relaxed">
              Take home your digital keepsake or print a physical photostrip immediately.
            </p>
          </div>

          {/* Core Action Buttons: Download & Print */}
          <div className="w-full space-y-3 pt-2">
            {/* Download Button */}
            <button
              id="download-photo-btn"
              onClick={handleDownload}
              className="w-full py-4 px-6 rounded-2xl bg-[#FAF7F2] hover:bg-white text-[#121110] font-display font-extrabold text-lg tracking-wider shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 cursor-pointer"
            >
              <Download className="w-5 h-5 text-[#121110]" />
              <span>DOWNLOAD PHOTO</span>
            </button>

            {/* Print Button */}
            <button
              id="print-photo-btn"
              onClick={handlePrint}
              className="w-full py-4 px-6 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-display font-bold text-lg tracking-wider border border-white/20 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <Printer className="w-5 h-5 text-white" />
              <span>PRINT PHOTO</span>
            </button>

            {/* Scan / QR Code & Share */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                id="scan-qr-btn"
                onClick={() => {
                  soundFX.playButtonClick();
                  setShowQRModal(true);
                }}
                className="py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-xs font-bold tracking-wider flex items-center justify-center gap-2 border border-white/10 transition-colors cursor-pointer"
              >
                <QrCode className="w-4 h-4 text-[#FAD2E1]" />
                <span>SCAN QR CODE</span>
              </button>

              <button
                id="share-btn"
                onClick={handleShare}
                className="py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-xs font-bold tracking-wider flex items-center justify-center gap-2 border border-white/10 transition-colors cursor-pointer"
              >
                <Share2 className="w-4 h-4 text-[#FAD2E1]" />
                <span>SHARE STRIP</span>
              </button>
            </div>
          </div>

          {/* Reset / Start Again */}
          <div className="pt-2 w-full">
            <button
              id="start-again-bottom-btn"
              onClick={() => {
                soundFX.playButtonClick();
                onStartAgain();
              }}
              className="w-full py-3 text-xs tracking-widest text-white/50 hover:text-white uppercase font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>START AGAIN FOR NEXT GUEST</span>
            </button>
          </div>
        </div>

      </main>

      {/* Screen Bottom Footer (Hidden on Print) */}
      <footer className="no-print w-full max-w-5xl flex justify-between items-center text-xs text-white/30 py-2 border-t border-white/5">
        <span>aekonezt Digital Photobox • Output: 1200 × 2400px</span>
        <span>Date: {eventDate}</span>
      </footer>

      {/* QR Code Modal for Phone Transfer */}
      {showQRModal && (
        <div className="no-print fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#1C1A18] border border-white/15 rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center space-y-4 shadow-2xl relative animate-fade-in">
            <button
              onClick={() => setShowQRModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <h3 className="font-display font-bold text-xl text-white">
                Scan / Save your memory
              </h3>
              <p className="text-xs text-white/60">
                Point your phone camera at this QR code to access your photobox strip.
              </p>
            </div>

            {/* QR Image */}
            <div className="p-4 bg-white rounded-2xl mx-auto w-56 h-56 flex items-center justify-center shadow-inner">
              {qrCodeUrl ? (
                <img src={qrCodeUrl} alt="QR Code" className="w-full h-full object-contain" />
              ) : (
                <div className="text-black text-xs font-mono">Generating QR...</div>
              )}
            </div>

            <button
              onClick={() => {
                soundFX.playButtonClick();
                navigator.clipboard.writeText(window.location.href);
                setCopiedLink(true);
                setTimeout(() => setCopiedLink(false), 2000);
              }}
              className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-colors"
            >
              {copiedLink ? 'Link Copied!' : 'Copy Kiosk Link'}
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

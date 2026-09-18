import React, { useState, useEffect, useCallback, useRef } from 'react';
import { WelcomeScreen } from './components/WelcomeScreen';
import { CameraPermissionScreen } from './components/CameraPermissionScreen';
import { TemplateSelectionScreen } from './components/TemplateSelectionScreen';
import { PhotoCountScreen } from './components/PhotoCountScreen';
import { PhotoSessionScreen } from './components/PhotoSessionScreen';
import { ReviewScreen } from './components/ReviewScreen';
import { ResultScreen } from './components/ResultScreen';
import { InactivityModal } from './components/InactivityModal';

import { CapturedPhoto, PhotoFilter, PhotoboxTemplate, SessionConfig, SessionStatus } from './types/photobox';
import { PHOTOBOX_TEMPLATES } from './data/templates';
import { cameraManager } from './utils/camera';
import { generatePhotostrip } from './utils/canvas';

export default function App() {
  // Session status state
  const [sessionStatus, setSessionStatus] = useState<SessionStatus>('WELCOME');
  
  // Camera & Stream
  const [activeStream, setActiveStream] = useState<MediaStream | null>(null);
  const [isCameraRequesting, setIsCameraRequesting] = useState<boolean>(false);
  const [isPermissionDenied, setIsPermissionDenied] = useState<boolean>(false);
  const [cameraErrorMessage, setCameraErrorMessage] = useState<string>('');

  // Selected Template
  const [selectedTemplate, setSelectedTemplate] = useState<PhotoboxTemplate>(PHOTOBOX_TEMPLATES[0]);

  // Session Configuration
  const [config, setConfig] = useState<SessionConfig>({
    photoCount: 4,
    selectedTemplateId: 'classic',
    filter: 'normal',
    mirrorOutput: true,
    showDate: true,
    showBranding: true,
    customTitle: '',
    customBgColor: '',
    eventDate: '18.09.2026'
  });

  // Photos & Final Result
  const [photos, setPhotos] = useState<CapturedPhoto[]>([]);
  const [finalImageUrl, setFinalImageUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Fullscreen Kiosk Mode
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Inactivity Detection
  const [showInactivityModal, setShowInactivityModal] = useState<boolean>(false);
  const inactivityTimerRef = useRef<number | null>(null);

  // Reset inactivity countdown on any user touch/click/keypress
  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }

    // Only activate inactivity check when in active flow (not on welcome screen or during active countdown)
    if (sessionStatus !== 'WELCOME' && sessionStatus !== 'COUNTDOWN' && sessionStatus !== 'CAPTURE') {
      inactivityTimerRef.current = window.setTimeout(() => {
        setShowInactivityModal(true);
      }, 60000); // 60 seconds
    }
  }, [sessionStatus]);

  useEffect(() => {
    const handleActivity = () => resetInactivityTimer();
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('mousedown', handleActivity);
    window.addEventListener('touchstart', handleActivity);
    window.addEventListener('keydown', handleActivity);

    resetInactivityTimer();

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('mousedown', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    };
  }, [resetInactivityTimer]);

  // Handle Fullscreen Toggle for Kiosk Experience
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(() => {
        // Fullscreen may be restricted in some iframes, proceed gracefully
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => {
          setIsFullscreen(false);
        }).catch(() => {});
      }
    }
  };

  // Attempt Camera Access
  const handleConnectCamera = async () => {
    setIsCameraRequesting(true);
    setIsPermissionDenied(false);
    setCameraErrorMessage('');

    try {
      const { stream } = await cameraManager.requestCamera();
      setActiveStream(stream);
      setIsCameraRequesting(false);
      setSessionStatus('TEMPLATE_SELECTION');
    } catch (err: unknown) {
      setIsCameraRequesting(false);
      setIsPermissionDenied(true);
      const message = err instanceof Error ? err.message : 'Camera access was denied or not found.';
      setCameraErrorMessage(message);
      setSessionStatus('CAMERA_PERMISSION');
    }
  };

  // Virtual Demo Camera Feed (Ensures full testing without physical camera)
  const handleUseDemoCamera = () => {
    const demoStream = cameraManager.createDemoStream();
    setActiveStream(demoStream);
    setSessionStatus('TEMPLATE_SELECTION');
  };

  // Start Photo Session from Welcome Screen
  const handleStartPhotoFromWelcome = async () => {
    // Attempt fullscreen if allowed
    try {
      if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
    } catch {}

    // Check if camera is already active
    if (activeStream && activeStream.active) {
      setSessionStatus('TEMPLATE_SELECTION');
    } else {
      // Try to acquire camera
      try {
        setIsCameraRequesting(true);
        const { stream } = await cameraManager.requestCamera();
        setActiveStream(stream);
        setIsCameraRequesting(false);
        setSessionStatus('TEMPLATE_SELECTION');
      } catch {
        setIsCameraRequesting(false);
        setIsPermissionDenied(true);
        setSessionStatus('CAMERA_PERMISSION');
      }
    }
  };

  // Session Reset (START AGAIN / START OVER)
  const handleResetSession = useCallback(() => {
    cameraManager.stopCamera();
    setActiveStream(null);
    setPhotos([]);
    setFinalImageUrl('');
    setIsGenerating(false);
    setShowInactivityModal(false);
    setConfig(prev => ({
      ...prev,
      photoCount: 4,
      filter: 'normal',
      customTitle: ''
    }));
    setSessionStatus('WELCOME');
  }, []);

  // When all photos are completed in PhotoSessionScreen
  const handlePhotosCompleted = (capturedPhotos: CapturedPhoto[]) => {
    setPhotos(capturedPhotos);
    setSessionStatus('REVIEW');
  };

  // Retake individual photo from Review screen
  const handleRetakeSingle = (index: number) => {
    // Return to photo session focused on that slot or whole set
    setSessionStatus('READY');
  };

  // Master Final Compositing Trigger
  const handleCreateFinalPhoto = async () => {
    setIsGenerating(true);
    try {
      const finalStrip = await generatePhotostrip(photos, selectedTemplate, config);
      setFinalImageUrl(finalStrip);
      setIsGenerating(false);
      setSessionStatus('RESULT');
    } catch (err) {
      console.error('Error generating photostrip:', err);
      setIsGenerating(false);
    }
  };

  // Clean up media streams when unmounting
  useEffect(() => {
    return () => {
      cameraManager.stopCamera();
    };
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#121110] text-[#FAF7F2] relative">
      
      {/* 1. WELCOME SCREEN */}
      {sessionStatus === 'WELCOME' && (
        <WelcomeScreen
          onStart={handleStartPhotoFromWelcome}
          onToggleFullscreen={handleToggleFullscreen}
          isFullscreen={isFullscreen}
        />
      )}

      {/* 2. CAMERA PERMISSION SCREEN */}
      {sessionStatus === 'CAMERA_PERMISSION' && (
        <CameraPermissionScreen
          onEnableCamera={handleConnectCamera}
          onUseDemoCamera={handleUseDemoCamera}
          onBackToWelcome={() => setSessionStatus('WELCOME')}
          isPermissionDenied={isPermissionDenied}
          errorMessage={cameraErrorMessage}
          isRequesting={isCameraRequesting}
        />
      )}

      {/* 3. TEMPLATE SELECTION SCREEN */}
      {sessionStatus === 'TEMPLATE_SELECTION' && (
        <TemplateSelectionScreen
          selectedTemplateId={selectedTemplate.id}
          onSelectTemplate={(tmpl) => {
            setSelectedTemplate(tmpl);
            setConfig(prev => ({
              ...prev,
              selectedTemplateId: tmpl.id,
              customBgColor: tmpl.id === 'customColor' ? (prev.customBgColor || '#EAE6F8') : ''
            }));
          }}
          onContinue={() => setSessionStatus('PHOTO_COUNT')}
          onBack={() => setSessionStatus('WELCOME')}
          customColor={config.customBgColor || '#EAE6F8'}
          onChangeCustomColor={(colorHex) => {
            setConfig(prev => ({ ...prev, customBgColor: colorHex }));
          }}
        />
      )}

      {/* 4. PHOTO COUNT & FRAME CUSTOMIZATION SCREEN */}
      {sessionStatus === 'PHOTO_COUNT' && (
        <PhotoCountScreen
          selectedTemplate={selectedTemplate}
          config={config}
          onChangePhotoCount={(count) => setConfig(prev => ({ ...prev, photoCount: count }))}
          onUpdateConfig={(newCfg) => setConfig(prev => ({ ...prev, ...newCfg }))}
          onContinue={() => setSessionStatus('READY')}
          onBack={() => setSessionStatus('TEMPLATE_SELECTION')}
        />
      )}

      {/* 5. PHOTO CAPTURE SESSION SCREEN */}
      {(sessionStatus === 'READY' || sessionStatus === 'COUNTDOWN' || sessionStatus === 'CAPTURE') && (
        <PhotoSessionScreen
          stream={activeStream}
          config={config}
          template={selectedTemplate}
          onPhotosCompleted={handlePhotosCompleted}
          onCancelSession={() => setSessionStatus('PHOTO_COUNT')}
          onUpdateFilter={(filter: PhotoFilter) => setConfig(prev => ({ ...prev, filter }))}
        />
      )}

      {/* 6. PHOTO REVIEW SCREEN */}
      {sessionStatus === 'REVIEW' && (
        <ReviewScreen
          photos={photos}
          template={selectedTemplate}
          config={config}
          onRetakeAll={() => {
            setPhotos([]);
            setSessionStatus('READY');
          }}
          onRetakeSingle={handleRetakeSingle}
          onChangeFilter={(filter: PhotoFilter) => setConfig(prev => ({ ...prev, filter }))}
          onCreateFinalPhoto={handleCreateFinalPhoto}
          isGenerating={isGenerating}
        />
      )}

      {/* 7. FINAL RESULT SCREEN */}
      {sessionStatus === 'RESULT' && finalImageUrl && (
        <ResultScreen
          finalImageUrl={finalImageUrl}
          onStartAgain={handleResetSession}
          eventDate={config.eventDate}
        />
      )}

      {/* 8. INACTIVITY TIMEOUT MODAL */}
      <InactivityModal
        isOpen={showInactivityModal}
        onContinue={() => {
          setShowInactivityModal(false);
          resetInactivityTimer();
        }}
        onStartOver={handleResetSession}
      />

    </div>
  );
}

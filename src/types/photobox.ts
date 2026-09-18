export type SessionStatus =
  | 'WELCOME'
  | 'CAMERA_PERMISSION'
  | 'TEMPLATE_SELECTION'
  | 'PHOTO_COUNT'
  | 'READY'
  | 'COUNTDOWN'
  | 'CAPTURE'
  | 'RETAKE_CHECK'
  | 'REVIEW'
  | 'GENERATING'
  | 'RESULT';

export type PhotoFilter = 'normal' | 'warm' | 'cool' | 'bw' | 'vintage';

export interface TemplateDecoration {
  type: 'heart' | 'star' | 'filmHoles' | 'ribbon' | 'sparkle' | 'confetti' | 'botanical' | 'dots';
  color?: string;
  position?: 'top' | 'bottom' | 'corners' | 'borders' | 'all';
}

export interface PhotoboxTemplate {
  id: string;
  name: string;
  tagline: string;
  background: string; // Hex color or CSS gradient
  textColor: string;
  accentColor: string;
  photoBorderColor: string;
  photoBorderWidth: number;
  styleCategory: 'classic' | 'minimal' | 'pinkParty' | 'retroFilm' | 'graduation' | 'birthday' | 'wedding' | 'custom';
  fontFamily: 'serif' | 'mono' | 'sans' | 'display';
  defaultTitle: string;
  defaultFooter: string;
  decorations?: TemplateDecoration[];
  previewBadge?: string;
}

export interface CapturedPhoto {
  id: string;
  dataUrl: string;
  blob?: Blob;
  timestamp: number;
  filter: PhotoFilter;
}

export interface SessionConfig {
  photoCount: 3 | 4 | 6;
  selectedTemplateId: string;
  filter: PhotoFilter;
  mirrorOutput: boolean;
  showDate: boolean;
  showBranding: boolean;
  customTitle: string;
  customBgColor?: string;
  eventDate: string; // e.g. "18.09.2026"
}

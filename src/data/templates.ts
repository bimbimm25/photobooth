import { PhotoboxTemplate } from '../types/photobox';

export const PHOTOBOX_TEMPLATES: PhotoboxTemplate[] = [
  {
    id: 'classic',
    name: 'Classic Cream',
    tagline: 'Timeless studio elegance',
    background: '#F8F4EF',
    textColor: '#1A1817',
    accentColor: '#8C6239',
    photoBorderColor: '#1A1817',
    photoBorderWidth: 2,
    styleCategory: 'classic',
    fontFamily: 'serif',
    defaultTitle: 'A DAY TO REMEMBER',
    defaultFooter: 'AEKONEZT • STUDIO EDITION',
    previewBadge: 'Timeless'
  },
  {
    id: 'pinkParty',
    name: 'Pink Party',
    tagline: 'Cute, playful & sparkly',
    background: '#FDE4EA',
    textColor: '#87254C',
    accentColor: '#E64980',
    photoBorderColor: '#FFFFFF',
    photoBorderWidth: 4,
    styleCategory: 'pinkParty',
    fontFamily: 'display',
    defaultTitle: 'GOOD VIBES ONLY ♡',
    defaultFooter: 'SWEET MEMORIES • 2026',
    decorations: [
      { type: 'heart', color: '#E64980' },
      { type: 'sparkle', color: '#F783AC' }
    ],
    previewBadge: 'Popular'
  },
  {
    id: 'retroFilm',
    name: 'Retro 35mm Film',
    tagline: 'Vintage analog canister strip',
    background: '#181716',
    textColor: '#F5ECE3',
    accentColor: '#E09F3E',
    photoBorderColor: '#2B2927',
    photoBorderWidth: 1,
    styleCategory: 'retroFilm',
    fontFamily: 'mono',
    defaultTitle: 'KODAK EXP • 400 ISO',
    defaultFooter: 'AEKONEZT FILM LAB • NO. 2026',
    decorations: [
      { type: 'filmHoles', color: '#FAF7F2' }
    ],
    previewBadge: 'Vintage'
  },
  {
    id: 'minimal',
    name: 'Nordic Minimal',
    tagline: 'Clean, monochrome perfection',
    background: '#FFFFFF',
    textColor: '#0A0A0A',
    accentColor: '#555555',
    photoBorderColor: '#ECECEC',
    photoBorderWidth: 1,
    styleCategory: 'minimal',
    fontFamily: 'sans',
    defaultTitle: 'MOMENTS THAT MATTER',
    defaultFooter: 'AEKONEZT PHOTO ARCHIVE',
    previewBadge: 'Modern'
  },
  {
    id: 'graduation',
    name: 'Graduation Gala',
    tagline: 'Proud milestone achievement',
    background: '#0F172A',
    textColor: '#F8FAFC',
    accentColor: '#F59E0B',
    photoBorderColor: '#D97706',
    photoBorderWidth: 3,
    styleCategory: 'graduation',
    fontFamily: 'serif',
    defaultTitle: 'CLASS OF 2026 • CONGRATULATIONS',
    defaultFooter: 'FUTURE STARTS TODAY ★ AEKONEZT',
    decorations: [
      { type: 'star', color: '#FBBF24' }
    ],
    previewBadge: 'Milestone'
  },
  {
    id: 'birthday',
    name: 'Birthday Bash',
    tagline: 'Celebrate another fabulous year',
    background: '#FEF3C7',
    textColor: '#78350F',
    accentColor: '#F97316',
    photoBorderColor: '#FFFFFF',
    photoBorderWidth: 4,
    styleCategory: 'birthday',
    fontFamily: 'display',
    defaultTitle: 'HAPPY BIRTHDAY! ✦',
    defaultFooter: 'WISHES COME TRUE • 2026',
    decorations: [
      { type: 'confetti', color: '#F43F5E' }
    ],
    previewBadge: 'Celebration'
  },
  {
    id: 'wedding',
    name: 'Eternal Wedding',
    tagline: 'Romantic champagne & ivory',
    background: '#FAF5EE',
    textColor: '#4A3B32',
    accentColor: '#B08968',
    photoBorderColor: '#E6D7C3',
    photoBorderWidth: 2,
    styleCategory: 'wedding',
    fontFamily: 'serif',
    defaultTitle: 'FOREVER & ALWAYS',
    defaultFooter: 'TWO HEARTS • ONE JOURNEY',
    decorations: [
      { type: 'botanical', color: '#B08968' }
    ],
    previewBadge: 'Romantic'
  },
  {
    id: 'customColor',
    name: 'Pastel Lavender',
    tagline: 'Soft dreamy aesthetic',
    background: '#EAE6F8',
    textColor: '#3A2E59',
    accentColor: '#7C3AED',
    photoBorderColor: '#FFFFFF',
    photoBorderWidth: 4,
    styleCategory: 'custom',
    fontFamily: 'sans',
    defaultTitle: 'LAVENDER DREAMS',
    defaultFooter: 'CAPTURED LIVE • AEKONEZT',
    decorations: [
      { type: 'sparkle', color: '#8B5CF6' }
    ],
    previewBadge: 'Custom'
  }
];

export const COLOR_PALETTES = [
  { name: 'Lavender', bg: '#EAE6F8', text: '#3A2E59', accent: '#7C3AED' },
  { name: 'Matcha Green', bg: '#E6F0E6', text: '#273B28', accent: '#406A42' },
  { name: 'Butter Cream', bg: '#FFF7D6', text: '#5C4813', accent: '#D97706' },
  { name: 'Sky Breeze', bg: '#E0F2FE', text: '#0C4A6E', accent: '#0284C7' },
  { name: 'Pitch Black', bg: '#121212', text: '#FAF7F2', accent: '#E05370' },
  { name: 'Rose Petal', bg: '#FCE7F3', text: '#831843', accent: '#DB2777' },
];

import { PhotoFilter } from '../types/photobox';

export interface FilterOption {
  id: PhotoFilter;
  label: string;
  cssFilter: string;
  description: string;
}

export const PHOTO_FILTERS: FilterOption[] = [
  {
    id: 'normal',
    label: 'Normal',
    cssFilter: 'none',
    description: 'Natural, crisp true colors'
  },
  {
    id: 'warm',
    label: 'Warm',
    cssFilter: 'sepia(0.18) saturate(1.15) brightness(1.02) contrast(1.04)',
    description: 'Golden hour glow'
  },
  {
    id: 'cool',
    label: 'Cool',
    cssFilter: 'hue-rotate(185deg) saturate(0.9) brightness(1.04) contrast(1.02)',
    description: 'Modern clean daylight'
  },
  {
    id: 'bw',
    label: 'B & W',
    cssFilter: 'grayscale(1) contrast(1.2) brightness(0.98)',
    description: 'Classic monochrome film'
  },
  {
    id: 'vintage',
    label: 'Vintage',
    cssFilter: 'sepia(0.4) contrast(0.95) brightness(1.05) saturate(1.1)',
    description: 'Nostalgic analog vibe'
  }
];

// Apply filter directly to an HTMLCanvasElement context
export function applyFilterToContext(ctx: CanvasRenderingContext2D, filter: PhotoFilter) {
  switch (filter) {
    case 'warm':
      ctx.filter = 'sepia(0.2) saturate(1.15) brightness(1.02) contrast(1.05)';
      break;
    case 'cool':
      // Canvas supports filter string matching CSS filter syntax
      ctx.filter = 'saturate(0.9) brightness(1.05) contrast(1.05)';
      break;
    case 'bw':
      ctx.filter = 'grayscale(100%) contrast(120%) brightness(98%)';
      break;
    case 'vintage':
      ctx.filter = 'sepia(45%) contrast(95%) brightness(105%) saturate(110%)';
      break;
    case 'normal':
    default:
      ctx.filter = 'none';
      break;
  }
}

// Fallback pixel manipulation if ctx.filter is not supported in older browsers
export function applyPixelFilter(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, filter: PhotoFilter) {
  if (filter === 'normal') return;

  const imgData = ctx.getImageData(x, y, width, height);
  const data = imgData.data;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    if (filter === 'bw') {
      const gray = 0.299 * r + 0.587 * g + 0.114 * b;
      // High contrast B&W
      const contrast = 1.15;
      const factored = (gray - 128) * contrast + 128;
      const finalVal = Math.min(255, Math.max(0, factored));
      data[i] = finalVal;
      data[i + 1] = finalVal;
      data[i + 2] = finalVal;
    } else if (filter === 'warm') {
      data[i] = Math.min(255, r * 1.08);     // more red
      data[i + 1] = Math.min(255, g * 1.02); // slight green
      data[i + 2] = Math.max(0, b * 0.92);   // less blue
    } else if (filter === 'cool') {
      data[i] = Math.max(0, r * 0.94);
      data[i + 1] = Math.min(255, g * 1.01);
      data[i + 2] = Math.min(255, b * 1.12);
    } else if (filter === 'vintage') {
      // Sepia calculation
      const tr = 0.393 * r + 0.769 * g + 0.189 * b;
      const tg = 0.349 * r + 0.686 * g + 0.168 * b;
      const tb = 0.272 * r + 0.534 * g + 0.131 * b;
      data[i] = Math.min(255, tr * 0.7 + r * 0.3);
      data[i + 1] = Math.min(255, tg * 0.7 + g * 0.3);
      data[i + 2] = Math.min(255, tb * 0.7 + b * 0.3);
    }
  }

  ctx.putImageData(imgData, x, y);
}

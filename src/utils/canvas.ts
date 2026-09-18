import { CapturedPhoto, PhotoboxTemplate, SessionConfig } from '../types/photobox';
import { applyFilterToContext } from './filters';

export interface CanvasSlot {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface PhotostripLayout {
  canvasWidth: number;
  canvasHeight: number;
  slots: CanvasSlot[];
  headerArea: { y: number; height: number };
  footerArea: { y: number; height: number };
}

// Calculate dynamic slot coordinates based on photo count and canvas size
export function calculateLayout(
  photoCount: 3 | 4 | 6,
  isRetroFilm: boolean
): PhotostripLayout {
  const canvasWidth = 1200;
  let canvasHeight = 2400;

  if (photoCount === 3) {
    canvasHeight = 2000;
  } else if (photoCount === 4) {
    canvasHeight = 2450;
  } else if (photoCount === 6) {
    canvasHeight = 3300;
  }

  // Margin adjustments (retro film leaves space for 35mm sprocket holes on left & right)
  const sideMargin = isRetroFilm ? 150 : 100;
  const slotWidth = canvasWidth - sideMargin * 2;
  
  const headerHeight = 160;
  const footerHeight = 280;
  const availableContentHeight = canvasHeight - headerHeight - footerHeight;

  // Spacing between photo frames
  const gap = photoCount === 6 ? 36 : 48;
  const totalGaps = gap * (photoCount - 1);
  const slotHeight = Math.floor((availableContentHeight - totalGaps) / photoCount);

  const slots: CanvasSlot[] = [];
  for (let i = 0; i < photoCount; i++) {
    const y = headerHeight + i * (slotHeight + gap);
    slots.push({
      x: sideMargin,
      y,
      width: slotWidth,
      height: slotHeight
    });
  }

  return {
    canvasWidth,
    canvasHeight,
    slots,
    headerArea: { y: 0, height: headerHeight },
    footerArea: { y: canvasHeight - footerHeight, height: footerHeight }
  };
}

// Center-crop cover math: draws source image into target rect maintaining aspect ratio
export function drawImageProp(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement,
  x: number,
  y: number,
  w: number,
  h: number,
  mirror = false
) {
  const iw = (img as HTMLVideoElement).videoWidth || (img as HTMLImageElement).naturalWidth || img.width;
  const ih = (img as HTMLVideoElement).videoHeight || (img as HTMLImageElement).naturalHeight || img.height;

  if (!iw || !ih) return;

  const r = Math.min(w / iw, h / ih);
  let nw = iw * r;
  let nh = ih * r;
  let cx = 1;
  let cy = 1;
  let cw = 1;
  let ch = 1;
  let ar = 1;

  // Cover calculation
  if (nw < w) ar = w / nw;
  if (Math.abs(ar - 1) < 1e-14 && nh < h) ar = h / nh;
  nw *= ar;
  nh *= ar;

  cw = iw / (nw / w);
  ch = ih / (nh / h);

  cx = (iw - cw) * 0.5;
  cy = (ih - ch) * 0.5;

  if (cx < 0) cx = 0;
  if (cy < 0) cy = 0;
  if (cw > iw) cw = iw;
  if (ch > ih) ch = ih;

  ctx.save();

  if (mirror) {
    ctx.translate(x + w, y);
    ctx.scale(-1, 1);
    ctx.drawImage(img, cx, cy, cw, ch, 0, 0, w, h);
  } else {
    ctx.drawImage(img, cx, cy, cw, ch, x, y, w, h);
  }

  ctx.restore();
}

// Helper to draw cute hearts
function drawHeart(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  const topCurveHeight = size * 0.3;
  ctx.moveTo(x, y + topCurveHeight);
  // top left curve
  ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + topCurveHeight);
  // bottom left curve
  ctx.bezierCurveTo(x - size / 2, y + (size + topCurveHeight) / 2, x, y + (size + topCurveHeight) / 2, x, y + size);
  // bottom right curve
  ctx.bezierCurveTo(x, y + (size + topCurveHeight) / 2, x + size / 2, y + (size + topCurveHeight) / 2, x + size / 2, y + topCurveHeight);
  // top right curve
  ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + topCurveHeight);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

// Helper to draw sparkles / stars
function drawStar(ctx: CanvasRenderingContext2D, cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number, color: string) {
  ctx.save();
  ctx.fillStyle = color;
  let rot = (Math.PI / 2) * 3;
  let x = cx;
  let y = cy;
  const step = Math.PI / spikes;

  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);
  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius;
    y = cy + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;

    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }
  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

// Draw 35mm film perforation holes
function draw35mmFilmPerforations(ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number) {
  ctx.save();
  const holeWidth = 48;
  const holeHeight = 32;
  const holeCornerRadius = 8;
  const spacing = 52;
  const leftX = 40;
  const rightX = canvasWidth - 40 - holeWidth;

  ctx.fillStyle = '#0D0D0D';

  const totalHoles = Math.floor(canvasHeight / spacing);
  for (let i = 0; i < totalHoles; i++) {
    const y = 30 + i * spacing;
    if (y + holeHeight < canvasHeight - 20) {
      // Left hole
      ctx.beginPath();
      ctx.roundRect(leftX, y, holeWidth, holeHeight, holeCornerRadius);
      ctx.fill();

      // Right hole
      ctx.beginPath();
      ctx.roundRect(rightX, y, holeWidth, holeHeight, holeCornerRadius);
      ctx.fill();

      // Frame text numbers along film edges every 4 holes
      if (i % 4 === 0) {
        ctx.save();
        ctx.fillStyle = '#D97706';
        ctx.font = 'bold 16px "Courier Prime", monospace';
        ctx.fillText(`▶ ${20 + i}`, leftX + 54, y + 22);
        ctx.fillText(`ISO 400`, rightX - 70, y + 22);
        ctx.restore();
      }
    }
  }
  ctx.restore();
}

// Master Canvas Compositing Function
export async function generatePhotostrip(
  photos: CapturedPhoto[],
  template: PhotoboxTemplate,
  config: SessionConfig
): Promise<string> {
  const isRetro = template.styleCategory === 'retroFilm';
  const layout = calculateLayout(config.photoCount, isRetro);

  const canvas = document.createElement('canvas');
  canvas.width = layout.canvasWidth;
  canvas.height = layout.canvasHeight;
  const ctx = canvas.getContext('2d', { alpha: false })!;

  // 1. Draw Background
  const bgColor = config.customBgColor || template.background;
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, layout.canvasWidth, layout.canvasHeight);

  // Subtle border around entire strip
  ctx.strokeStyle = template.textColor + '20';
  ctx.lineWidth = 4;
  ctx.strokeRect(6, 6, layout.canvasWidth - 12, layout.canvasHeight - 12);

  // 2. Retro Film Perforations
  if (isRetro) {
    draw35mmFilmPerforations(ctx, layout.canvasWidth, layout.canvasHeight);
  }

  // 3. Top Header / Event Title
  if (config.showBranding) {
    ctx.save();
    ctx.fillStyle = template.textColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Set font family
    let headerFont = 'bold 36px "Plus Jakarta Sans", sans-serif';
    if (template.fontFamily === 'serif') {
      headerFont = 'bold 40px "DM Serif Display", serif';
    } else if (template.fontFamily === 'mono') {
      headerFont = 'bold 32px "Courier Prime", monospace';
    } else if (template.fontFamily === 'display') {
      headerFont = 'bold 42px "Syne", sans-serif';
    }
    ctx.font = headerFont;

    const title = config.customTitle || template.defaultTitle;
    const headerY = layout.headerArea.height / 2 + 10;
    ctx.fillText(title, layout.canvasWidth / 2, headerY);

    // Decorative line or dots below title
    ctx.strokeStyle = template.accentColor;
    ctx.lineWidth = 3;
    const textMetrics = ctx.measureText(title);
    const lineW = Math.min(textMetrics.width * 0.7, 400);
    ctx.beginPath();
    ctx.moveTo(layout.canvasWidth / 2 - lineW / 2, headerY + 30);
    ctx.lineTo(layout.canvasWidth / 2 + lineW / 2, headerY + 30);
    ctx.stroke();

    ctx.restore();
  }

  // 4. Load & Composite Each Photo Slot
  for (let i = 0; i < layout.slots.length; i++) {
    const slot = layout.slots[i];
    const photo = photos[i];

    // Background behind photo (card matting)
    ctx.save();
    ctx.fillStyle = '#000000';
    ctx.fillRect(slot.x - 4, slot.y - 4, slot.width + 8, slot.height + 8);
    ctx.restore();

    if (photo && photo.dataUrl) {
      // Load photo image
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const image = new Image();
        image.crossOrigin = 'anonymous';
        image.onload = () => resolve(image);
        image.onerror = reject;
        image.src = photo.dataUrl;
      });

      // Render into a temporary offscreen canvas to apply filters and mirroring cleanly
      const offCanvas = document.createElement('canvas');
      offCanvas.width = slot.width;
      offCanvas.height = slot.height;
      const offCtx = offCanvas.getContext('2d')!;

      // Apply selected filter to the photo only
      const effectiveFilter = photo.filter || config.filter || 'normal';
      applyFilterToContext(offCtx, effectiveFilter);

      // Draw photo with cover crop and optional mirroring
      drawImageProp(offCtx, img, 0, 0, slot.width, slot.height, config.mirrorOutput);

      // Reset filter before blitting to main canvas
      offCtx.filter = 'none';

      // Draw offscreen photo into main canvas
      ctx.drawImage(offCanvas, slot.x, slot.y);

      // Draw photo border
      if (template.photoBorderWidth > 0) {
        ctx.save();
        ctx.strokeStyle = template.photoBorderColor;
        ctx.lineWidth = template.photoBorderWidth * 2;
        ctx.strokeRect(slot.x, slot.y, slot.width, slot.height);
        ctx.restore();
      }
    } else {
      // Empty slot placeholder
      ctx.fillStyle = '#E5E5E5';
      ctx.fillRect(slot.x, slot.y, slot.width, slot.height);
      ctx.fillStyle = '#888888';
      ctx.font = '24px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`PHOTO ${i + 1}`, slot.x + slot.width / 2, slot.y + slot.height / 2);
    }

    // Number tag badge (e.g. 01, 02) for retro film
    if (isRetro) {
      ctx.save();
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(slot.x + 16, slot.y + 16, 52, 28);
      ctx.fillStyle = '#F59E0B';
      ctx.font = 'bold 16px "Courier Prime", monospace';
      ctx.fillText(`0${i + 1}`, slot.x + 28, slot.y + 36);
      ctx.restore();
    }
  }

  // 5. Template Specific Accents & Decorations
  if (template.decorations && template.decorations.length > 0) {
    for (const dec of template.decorations) {
      const decColor = dec.color || template.accentColor;
      if (dec.type === 'heart') {
        drawHeart(ctx, 160, layout.headerArea.height / 2 + 10, 28, decColor);
        drawHeart(ctx, layout.canvasWidth - 160, layout.headerArea.height / 2 + 10, 28, decColor);
        drawHeart(ctx, layout.canvasWidth / 2 - 140, layout.footerArea.y + 80, 24, decColor);
        drawHeart(ctx, layout.canvasWidth / 2 + 140, layout.footerArea.y + 80, 24, decColor);
      } else if (dec.type === 'sparkle' || dec.type === 'star') {
        drawStar(ctx, 160, layout.headerArea.height / 2 + 10, 4, 24, 8, decColor);
        drawStar(ctx, layout.canvasWidth - 160, layout.headerArea.height / 2 + 10, 4, 24, 8, decColor);
        drawStar(ctx, 140, layout.footerArea.y + 110, 4, 18, 6, decColor);
        drawStar(ctx, layout.canvasWidth - 140, layout.footerArea.y + 110, 4, 18, 6, decColor);
      } else if (dec.type === 'confetti') {
        // Festive confetti sprinkles in corners
        const colors = ['#F43F5E', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'];
        for (let k = 0; k < 18; k++) {
          const rx = 80 + (k % 4) * 50 + (k > 8 ? layout.canvasWidth - 280 : 0);
          const ry = 40 + (k % 3) * 35;
          ctx.fillStyle = colors[k % colors.length];
          ctx.beginPath();
          ctx.arc(rx, ry, 6, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  }

  // 6. Footer Information (Event Date + Brand Logo + Serial Code)
  const footerY = layout.footerArea.y;
  ctx.save();
  ctx.textAlign = 'center';

  // Date
  if (config.showDate && config.eventDate) {
    ctx.fillStyle = template.textColor;
    ctx.font = 'bold 28px "Courier Prime", monospace';
    ctx.fillText(config.eventDate, layout.canvasWidth / 2, footerY + 65);
  }

  // Footer Tagline / Branding
  if (config.showBranding) {
    ctx.fillStyle = template.textColor;
    let footerFont = 'bold 30px "Plus Jakarta Sans", sans-serif';
    if (template.fontFamily === 'serif') {
      footerFont = 'bold 32px "DM Serif Display", serif';
    } else if (template.fontFamily === 'mono') {
      footerFont = '26px "Courier Prime", monospace';
    } else if (template.fontFamily === 'display') {
      footerFont = 'bold 32px "Syne", sans-serif';
    }
    ctx.font = footerFont;
    ctx.fillText(template.defaultFooter, layout.canvasWidth / 2, footerY + 120);

    // Decorative simulated barcode / stamp
    const stampY = footerY + 160;
    ctx.fillStyle = template.textColor;
    ctx.globalAlpha = 0.4;

    // Mini authentic photobox barcode lines
    const startX = layout.canvasWidth / 2 - 160;
    const barcodeWidths = [3, 1, 4, 2, 1, 3, 2, 4, 1, 2, 3, 1, 4, 2, 1, 3, 2, 4, 1, 3, 2, 1, 4, 2];
    let curX = startX;
    for (const bw of barcodeWidths) {
      ctx.fillRect(curX, stampY, bw * 2, 40);
      curX += bw * 2 + 5;
    }

    ctx.font = '16px "Courier Prime", monospace';
    ctx.fillText(`AEKONEZT • NO. ${Math.floor(100000 + Math.random() * 900000)} • 2026`, layout.canvasWidth / 2, stampY + 62);
    ctx.globalAlpha = 1.0;
  }

  ctx.restore();

  // Return high-quality Data URL
  return canvas.toDataURL('image/png', 1.0);
}

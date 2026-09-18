import QRCode from 'qrcode';

export function downloadImage(dataUrl: string, filename?: string) {
  const dateStr = new Date().toISOString().slice(0, 10);
  const actualFilename = filename || `aekonezt-photo-${dateStr}.png`;

  // Use Blob download for maximum memory efficiency and browser compatibility
  fetch(dataUrl)
    .then(res => res.blob())
    .then(blob => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = actualFilename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    })
    .catch(err => {
      console.error('Download failed, using direct anchor:', err);
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = actualFilename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
}

// Generate QR Code data URL for client-side scanning/preview
export async function generateQRCode(textOrUrl: string): Promise<string> {
  try {
    return await QRCode.toDataURL(textOrUrl, {
      width: 320,
      margin: 2,
      color: {
        dark: '#11100F',
        light: '#FFFFFF'
      }
    });
  } catch (err) {
    console.error('Failed to generate QR Code:', err);
    return '';
  }
}

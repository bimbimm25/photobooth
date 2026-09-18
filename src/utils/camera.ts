// Camera and media stream utility for Photobox

export interface CameraDevice {
  deviceId: string;
  label: string;
}

export class CameraManager {
  private activeStream: MediaStream | null = null;
  private isDemoMode = false;
  private demoInterval: number | null = null;

  async requestCamera(deviceId?: string): Promise<{ stream: MediaStream; isDemo: boolean }> {
    this.stopCamera();

    // Check if mediaDevices is supported
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.warn('getUserMedia not supported, activating demo camera mode');
      const demo = this.createDemoStream();
      return { stream: demo, isDemo: true };
    }

    try {
      const constraints: MediaStreamConstraints = {
        audio: false,
        video: deviceId
          ? { deviceId: { exact: deviceId } }
          : {
              facingMode: 'user',
              width: { ideal: 1920, min: 1280 },
              height: { ideal: 1080, min: 720 }
            }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      this.activeStream = stream;
      this.isDemoMode = false;
      return { stream, isDemo: false };
    } catch (err: unknown) {
      console.warn('Real camera error:', err);
      // Re-throw if caller wants to handle permission denial explicitly
      throw err;
    }
  }

  // Fallback demo video stream (Canvas animated feed for sandboxes or devices without webcam)
  createDemoStream(): MediaStream {
    this.stopCamera();
    this.isDemoMode = true;

    const canvas = document.createElement('canvas');
    canvas.width = 1280;
    canvas.height = 720;
    const ctx = canvas.getContext('2d')!;

    let frame = 0;

    const drawDemoFeed = () => {
      frame++;
      // Background gradient
      const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      grad.addColorStop(0, '#2D1B36');
      grad.addColorStop(0.5, '#1A1829');
      grad.addColorStop(1, '#110E1B');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Studio studio light effect
      const spotGrad = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2 - 20, 20,
        canvas.width / 2, canvas.height / 2, 400
      );
      spotGrad.addColorStop(0, 'rgba(255, 230, 240, 0.25)');
      spotGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = spotGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Animated person silhouette / portrait pose
      const bounce = Math.sin(frame * 0.05) * 6;
      const headX = canvas.width / 2;
      const headY = canvas.height / 2 - 50 + bounce;

      // Shoulders
      ctx.fillStyle = '#FAF0CA';
      ctx.beginPath();
      ctx.ellipse(headX, headY + 220, 180, 100, 0, 0, Math.PI * 2);
      ctx.fill();

      // Head
      ctx.fillStyle = '#FFE0B2';
      ctx.beginPath();
      ctx.arc(headX, headY, 90, 0, Math.PI * 2);
      ctx.fill();

      // Hair
      ctx.fillStyle = '#4A2810';
      ctx.beginPath();
      ctx.arc(headX, headY - 20, 95, Math.PI, Math.PI * 2);
      ctx.fill();

      // Sunglasses / party glasses
      ctx.fillStyle = '#1A1A1A';
      ctx.beginPath();
      ctx.roundRect(headX - 60, headY - 10, 45, 25, 6);
      ctx.roundRect(headX + 15, headY - 10, 45, 25, 6);
      ctx.fill();
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Smile
      ctx.strokeStyle = '#C44536';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.arc(headX, headY + 30, 30, 0.2 * Math.PI, 0.8 * Math.PI, false);
      ctx.stroke();

      // Photobooth simulation badge
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.roundRect(40, 40, 280, 48, 10);
      ctx.fill();
      ctx.fillStyle = '#4ADE80';
      ctx.beginPath();
      ctx.arc(65, 64, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 15px sans-serif';
      ctx.fillText('DEMO CAMERA FEED', 84, 70);

      // Timer overlay
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.font = '13px monospace';
      ctx.fillText(`FRAME #${frame}`, canvas.width - 150, 68);
    };

    drawDemoFeed();
    this.demoInterval = window.setInterval(drawDemoFeed, 1000 / 30);

    const stream = canvas.captureStream(30);
    this.activeStream = stream;
    return stream;
  }

  async getAvailableDevices(): Promise<CameraDevice[]> {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      return [];
    }
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      return devices
        .filter(d => d.kind === 'videoinput')
        .map((d, index) => ({
          deviceId: d.deviceId,
          label: d.label || `Camera ${index + 1}`
        }));
    } catch {
      return [];
    }
  }

  stopCamera() {
    if (this.demoInterval !== null) {
      clearInterval(this.demoInterval);
      this.demoInterval = null;
    }

    if (this.activeStream) {
      this.activeStream.getTracks().forEach(track => {
        try {
          track.stop();
        } catch {
          // ignore
        }
      });
      this.activeStream = null;
    }
  }

  getActiveStream(): MediaStream | null {
    return this.activeStream;
  }

  getIsDemo(): boolean {
    return this.isDemoMode;
  }
}

export const cameraManager = new CameraManager();

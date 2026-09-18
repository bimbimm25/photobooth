import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory / file-persisted storage file
const DB_FILE = path.join(process.cwd(), 'server-db.json');

const INITIAL_DATA = {
  packages: [
    {
      id: 'pkg-essential',
      name: 'Essential',
      price: 1500000,
      durationHours: 2,
      description: 'Pilihan tepat untuk intimate birthday party, bridal shower, atau gathering keluarga.',
      features: [
        '2 Jam Durasi Operasional',
        'Unlimited Photo Sessions',
        'Unlimited Instant Prints (Strip 2x6)',
        '1 Professional Booth Attendant',
        'Standard Premium Backdrop (Pilihan Warna)',
        'Curated Fun Props & Signboards',
        'QR Code Live Digital Download',
        'High Resolution Cloud Folder Drive'
      ],
      isPopular: false,
      isActive: true,
      imageUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'pkg-signature',
      name: 'Signature',
      price: 2500000,
      durationHours: 3,
      description: 'Paket favorit untuk resepsi pernikahan, sweet seventeen, dan corporate gathering.',
      features: [
        '3 Jam Durasi Operasional',
        'Unlimited Photo Sessions',
        'Unlimited Instant Prints (4R Portrait & 2x6 Strip)',
        '2 Professional Booth Attendants',
        'Velvet / Sequin Glam Backdrop & Studio Lighting',
        'Custom Photo Frame Overlay Design (2 Revisi)',
        'Premium Thematic Props & Sunglasses',
        'Magnetic Frame Strips untuk Tamu',
        'Live Slideshow Screen Sync',
        'Full Digital Master Gallery di Google Drive'
      ],
      isPopular: true,
      isActive: true,
      imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'pkg-premium',
      name: 'Premium',
      price: 3500000,
      durationHours: 4,
      description: 'Pengalaman photobooth termewah dengan 360 video option atau dual printing stations.',
      features: [
        '4 Jam Durasi Operasional Penuh',
        'Unlimited Instant Prints + Magnetic Stickers',
        'Pilihan 360 Video Booth / Glam Studio Setup',
        '2 Dedicated Attendants & 1 Tech Operator',
        'Customized Neon Sign & Floral Backdrop',
        'Exclusive Hardcover Leather Photo Guestbook',
        'Custom Animated Digital GIF & Boomerang',
        'Priority Fast Sublimation Printer (7 detik/cetak)',
        'VIP Props Box & Red Carpet Runner',
        'Exclusive Wooden Flashdisk + Online Gallery 1 Tahun'
      ],
      isPopular: false,
      isActive: true,
      imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80'
    }
  ],
  bookings: [
    {
      id: 'book-1',
      bookingCode: 'FB-2609-01',
      packageId: 'pkg-signature',
      packageName: 'Signature',
      eventType: 'Wedding',
      eventDate: '2026-09-20',
      durationHours: 3,
      durationLabel: '3 Hours',
      customerName: 'Sarah & Kevin',
      customerPhone: '081234889900',
      customerEmail: 'sarah.kevin@gmail.com',
      eventLocation: 'Grand City Ballroom, Surabaya',
      additionalNotes: 'Perlu backdrop nuansa champagne gold & custom frame nama.',
      estimatedTotal: 2500000,
      status: 'CONFIRMED',
      createdAt: '2026-09-01T10:00:00Z'
    },
    {
      id: 'book-2',
      bookingCode: 'FB-2609-02',
      packageId: 'pkg-essential',
      packageName: 'Essential',
      eventType: 'Birthday',
      eventDate: '2026-09-22',
      durationHours: 2,
      durationLabel: '2 Hours',
      customerName: 'Raka Pratama',
      customerPhone: '085712345678',
      customerEmail: 'raka.pratama@gmail.com',
      eventLocation: 'Pondok Mutiara Hall, Sidoarjo',
      additionalNotes: 'Tema neon purple cyberpunk.',
      estimatedTotal: 1500000,
      status: 'CONFIRMED',
      createdAt: '2026-09-05T14:30:00Z'
    },
    {
      id: 'book-3',
      bookingCode: 'FB-2609-03',
      packageId: 'pkg-premium',
      packageName: 'Premium',
      eventType: 'Corporate',
      eventDate: '2026-09-29',
      durationHours: 4,
      durationLabel: '4 Hours',
      customerName: 'Bima Santoso (PT Nusantara)',
      customerPhone: '081198765432',
      customerEmail: 'bima@nusantaradigital.co.id',
      eventLocation: 'Vasa Hotel, Surabaya',
      additionalNotes: 'Request 360 Video Booth setup + instant printing station.',
      estimatedTotal: 3500000,
      status: 'PENDING',
      createdAt: '2026-09-12T09:15:00Z'
    },
    {
      id: 'book-4',
      bookingCode: 'FB-2610-04',
      packageId: 'pkg-signature',
      packageName: 'Signature',
      eventType: 'Graduation',
      eventDate: '2026-10-05',
      durationHours: 3,
      durationLabel: '3 Hours',
      customerName: 'Dewi Anggraeni',
      customerPhone: '087811223344',
      customerEmail: 'dewi.anggraeni@gmail.com',
      eventLocation: 'Airlangga Convention Center (ACC), Surabaya',
      additionalNotes: 'Acara syukuran wisuda dokter spesialis.',
      estimatedTotal: 2500000,
      status: 'CONFIRMED',
      createdAt: '2026-09-14T16:00:00Z'
    }
  ],
  gallery: [
    {
      id: 'gal-1',
      title: 'Sarah & Kevin Wedding Day',
      category: 'WEDDING',
      imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
      format: 'portrait',
      isFeatured: true,
      eventDate: '2026-08-15'
    },
    {
      id: 'gal-2',
      title: 'Adit & Vania Romantic Nuptials',
      category: 'WEDDING',
      imageUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80',
      format: 'landscape',
      isFeatured: true,
      eventDate: '2026-08-20'
    },
    {
      id: 'gal-3',
      title: 'Alana Sweet 17 Glamour Party',
      category: 'BIRTHDAY',
      imageUrl: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1200&q=80',
      format: 'portrait',
      isFeatured: true,
      eventDate: '2026-09-02'
    },
    {
      id: 'gal-4',
      title: 'PT Nusantara Digital Annual Gala',
      category: 'CORPORATE',
      imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
      format: 'landscape',
      isFeatured: true,
      eventDate: '2026-08-28'
    },
    {
      id: 'gal-5',
      title: 'Universitas Airlangga Graduation Class',
      category: 'GRADUATION',
      imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
      format: 'portrait',
      isFeatured: true,
      eventDate: '2026-08-10'
    },
    {
      id: 'gal-6',
      title: 'Chic Black & White Photostrip Duo',
      category: 'WEDDING',
      imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1200&q=80',
      format: 'photostrip',
      isFeatured: false,
      eventDate: '2026-07-24'
    }
  ],
  testimonials: [
    {
      id: 'test-1',
      name: 'Sarah & Kevin',
      event: 'Wedding Reception',
      location: 'Grand City Convention Surabaya',
      review: 'aekonezt made our wedding reception so much more fun! Cetakannya cepet banget, tim attendantnya ramah banget bantuin tamu-tamu kami yang sepuh, dan hasil fotonya jernih parah.',
      rating: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      isDemoSample: true
    },
    {
      id: 'test-2',
      name: 'Raka Pratama & Alana',
      event: 'Sweet 17th Birthday Celebration',
      location: 'Hotel Majapahit Surabaya',
      review: 'Props-nya lucu dan up-to-date banget! Custom template-nya disesuaikan persis sama tema pesta aku. Semua temen sekolah antri berkali-kali karena fotonya estetik.',
      rating: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      isDemoSample: true
    },
    {
      id: 'test-3',
      name: 'Dian Permata - HR Manager',
      event: 'PT Nusantara Digital Annual Gala',
      location: 'Vasa Hotel Surabaya',
      review: 'Sangat profesional dari awal dealing sampai hari H. Sistem antriannya rapi, live QR download jalan mulus, dan laporan file digital lengkap dikirim H+1.',
      rating: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      isDemoSample: true
    }
  ],
  blockedDates: [
    { id: 'blk-1', date: '2026-09-25', reason: 'Internal Studio Equipment Maintenance', createdAt: '2026-09-01' },
    { id: 'blk-2', date: '2026-10-17', reason: 'Private Exclusive Booking VIP', createdAt: '2026-09-10' }
  ],
  settings: {
    brandName: 'AEKONEZT PHOTOBOOTH',
    tagline: 'Capture the moment. Keep the memory.',
    whatsappNumber: '6281234567890',
    displayPhone: '+62 812-3456-7890',
    email: 'hello@aekonezt.id',
    coverageArea: 'Surabaya & Sidoarjo (Tersedia untuk luar kota Jawa Timur)',
    studioAddress: 'Jl. Raya Darmo No. 48, Surabaya, Jawa Timur',
    instagramHandle: '@aekonezt.photobooth',
    tiktokHandle: '@aekonezt.id',
    noticeBanner: 'Pemesanan untuk weekend Q4 2026 telah dibuka. Slot terbatas!'
  }
};

function loadDb() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (e) {
    console.error('Error reading db file:', e);
  }
  return INITIAL_DATA;
}

function saveDb(data: any) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error writing db file:', e);
  }
}

let db = loadDb();

// --- REST API ENDPOINTS ---

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'aekonezt REST API is healthy', timestamp: new Date().toISOString() });
});

// Packages
app.get('/api/packages', (req, res) => {
  res.json({ success: true, message: 'Packages retrieved successfully', data: db.packages });
});

app.get('/api/packages/:id', (req, res) => {
  const pkg = db.packages.find((p: any) => p.id === req.params.id);
  if (!pkg) {
    return res.status(404).json({ success: false, message: 'Package not found' });
  }
  res.json({ success: true, data: pkg });
});

app.post('/api/packages', (req, res) => {
  const newPkg = { ...req.body, id: req.body.id || `pkg-${Date.now()}` };
  db.packages.push(newPkg);
  saveDb(db);
  res.status(201).json({ success: true, message: 'Package created successfully', data: newPkg });
});

app.put('/api/packages/:id', (req, res) => {
  const index = db.packages.findIndex((p: any) => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Package not found' });
  }
  db.packages[index] = { ...db.packages[index], ...req.body };
  saveDb(db);
  res.json({ success: true, message: 'Package updated successfully', data: db.packages[index] });
});

app.delete('/api/packages/:id', (req, res) => {
  db.packages = db.packages.filter((p: any) => p.id !== req.params.id);
  saveDb(db);
  res.json({ success: true, message: 'Package deleted successfully' });
});

// Gallery
app.get('/api/gallery', (req, res) => {
  const { category } = req.query;
  if (category && typeof category === 'string' && category.toUpperCase() !== 'ALL') {
    const filtered = db.gallery.filter((item: any) => item.category.toUpperCase() === category.toUpperCase());
    return res.json({ success: true, data: filtered });
  }
  res.json({ success: true, data: db.gallery });
});

app.post('/api/gallery', (req, res) => {
  const newItem = { ...req.body, id: `gal-${Date.now()}` };
  db.gallery.unshift(newItem);
  saveDb(db);
  res.status(201).json({ success: true, message: 'Photo added to gallery', data: newItem });
});

app.delete('/api/gallery/:id', (req, res) => {
  db.gallery = db.gallery.filter((g: any) => g.id !== req.params.id);
  saveDb(db);
  res.json({ success: true, message: 'Photo removed from gallery' });
});

// Availability Checker
app.get('/api/availability', (req, res) => {
  const dateStr = req.query.date as string;
  if (!dateStr) {
    return res.status(400).json({ success: false, message: 'Date parameter is required (YYYY-MM-DD)' });
  }

  const isBlocked = db.blockedDates.find((b: any) => b.date === dateStr);
  if (isBlocked) {
    return res.json({ success: true, data: { status: 'UNAVAILABLE', reason: isBlocked.reason } });
  }

  const bookingsOnDate = db.bookings.filter((b: any) => b.eventDate === dateStr && b.status !== 'CANCELLED');
  const confirmed = bookingsOnDate.filter((b: any) => b.status === 'CONFIRMED' || b.status === 'COMPLETED');
  if (confirmed.length >= 2) {
    return res.json({ success: true, data: { status: 'UNAVAILABLE', reason: 'Jadwal penuh untuk tanggal ini' } });
  }

  const pending = bookingsOnDate.filter((b: any) => b.status === 'PENDING');
  if (pending.length > 0) {
    return res.json({ success: true, data: { status: 'PENDING', reason: 'Ada booking tentatif' } });
  }

  res.json({ success: true, data: { status: 'AVAILABLE' } });
});

app.get('/api/availability/month', (req, res) => {
  const yearMonth = (req.query.yearMonth as string) || new Date().toISOString().slice(0, 7);
  const result: Record<string, string> = {};

  db.blockedDates.forEach((b: any) => {
    if (b.date.startsWith(yearMonth)) {
      result[b.date] = 'UNAVAILABLE';
    }
  });

  db.bookings.forEach((b: any) => {
    if (b.eventDate.startsWith(yearMonth)) {
      if (b.status === 'CONFIRMED' || b.status === 'COMPLETED') {
        result[b.eventDate] = 'UNAVAILABLE';
      } else if (b.status === 'PENDING' && result[b.eventDate] !== 'UNAVAILABLE') {
        result[b.eventDate] = 'PENDING';
      }
    }
  });

  res.json({ success: true, data: result });
});

// Bookings
app.post('/api/bookings', (req, res) => {
  const body = req.body;
  if (!body.customerName || !body.customerPhone || !body.eventDate || !body.packageId) {
    return res.status(400).json({ success: false, message: 'Data booking tidak lengkap. Harap periksa kembali form.' });
  }

  const bookingCode = `FB-${body.eventDate.replace(/-/g, '').slice(2, 6)}-${Math.floor(100 + Math.random() * 900)}`;
  const newBooking = {
    ...body,
    id: `book-${Date.now()}`,
    bookingCode,
    status: 'PENDING',
    createdAt: new Date().toISOString()
  };

  db.bookings.unshift(newBooking);
  saveDb(db);

  res.status(201).json({
    success: true,
    message: 'Booking berhasil dibuat! Tim aekonezt akan segera memverifikasi ketersediaan.',
    data: newBooking
  });
});

app.get('/api/bookings', (req, res) => {
  const { status, search, date } = req.query;
  let list = [...db.bookings];

  if (status && typeof status === 'string' && status !== 'ALL') {
    list = list.filter((b: any) => b.status.toUpperCase() === status.toUpperCase());
  }

  if (date && typeof date === 'string') {
    list = list.filter((b: any) => b.eventDate === date);
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    list = list.filter((b: any) => 
      b.customerName.toLowerCase().includes(q) ||
      b.bookingCode.toLowerCase().includes(q) ||
      b.customerPhone.includes(q) ||
      b.eventLocation.toLowerCase().includes(q)
    );
  }

  res.json({ success: true, data: list });
});

app.put('/api/bookings/:id/status', (req, res) => {
  const { status, notes } = req.body;
  const booking = db.bookings.find((b: any) => b.id === req.params.id);
  if (!booking) {
    return res.status(404).json({ success: false, message: 'Booking not found' });
  }

  booking.status = status;
  booking.updatedAt = new Date().toISOString();
  if (notes) {
    booking.additionalNotes = `${booking.additionalNotes || ''}\n[Catatan Admin]: ${notes}`;
  }
  saveDb(db);

  res.json({ success: true, message: `Status booking diubah menjadi ${status}`, data: booking });
});

app.delete('/api/bookings/:id', (req, res) => {
  db.bookings = db.bookings.filter((b: any) => b.id !== req.params.id);
  saveDb(db);
  res.json({ success: true, message: 'Booking deleted successfully' });
});

// Admin Auth (demo login)
app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body;
  if (email === 'admin@aekonezt.id' && (password === 'admin123' || password === 'admin')) {
    return res.json({
      success: true,
      message: 'Login berhasil',
      data: {
        token: 'fb_admin_jwt_demo_token_secure_hash',
        user: {
          id: 'usr-1',
          name: 'Bima Administrator',
          email: 'admin@aekonezt.id',
          role: 'SUPER_ADMIN'
        }
      }
    });
  }
  res.status(401).json({ success: false, message: 'Email atau password admin salah. Gunakan admin@aekonezt.id / admin123' });
});

// Admin Dashboard Stats
app.get('/api/admin/dashboard', (req, res) => {
  const totalBookings = db.bookings.length;
  const pendingBookings = db.bookings.filter((b: any) => b.status === 'PENDING').length;
  const confirmedBookings = db.bookings.filter((b: any) => b.status === 'CONFIRMED').length;
  const completedBookings = db.bookings.filter((b: any) => b.status === 'COMPLETED').length;
  const cancelledBookings = db.bookings.filter((b: any) => b.status === 'CANCELLED').length;

  const totalRevenue = db.bookings
    .filter((b: any) => b.status === 'CONFIRMED' || b.status === 'COMPLETED')
    .reduce((sum: number, b: any) => sum + (b.estimatedTotal || 0), 0);

  const upcomingEvents = db.bookings
    .filter((b: any) => b.status !== 'CANCELLED')
    .sort((a: any, b: any) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime())
    .slice(0, 6)
    .map((b: any) => {
      const d = new Date(b.eventDate);
      return {
        id: b.id,
        date: b.eventDate,
        dayNum: String(d.getDate()).padStart(2, '0'),
        monthShort: d.toLocaleString('id-ID', { month: 'short' }).toUpperCase(),
        title: `${b.eventType} — ${b.customerName}`,
        customer: b.customerName,
        packageName: `${b.packageName} Package`,
        location: b.eventLocation,
        status: b.status
      };
    });

  res.json({
    success: true,
    data: {
      totalBookings,
      pendingBookings,
      confirmedBookings,
      completedBookings,
      cancelledBookings,
      totalRevenue,
      monthlyTrends: [
        { month: 'Mei', bookings: 6, revenue: 13500000 },
        { month: 'Jun', bookings: 9, revenue: 21000000 },
        { month: 'Jul', bookings: 12, revenue: 28500000 },
        { month: 'Ags', bookings: 15, revenue: 36000000 },
        { month: 'Sep', bookings: 18, revenue: 43500000 },
        { month: 'Okt (Proj)', bookings: 14, revenue: 34000000 },
      ],
      upcomingEvents
    }
  });
});

// Blocked Dates
app.get('/api/blocked-dates', (req, res) => {
  res.json({ success: true, data: db.blockedDates });
});

app.post('/api/blocked-dates', (req, res) => {
  const newEntry = {
    id: `blk-${Date.now()}`,
    date: req.body.date,
    reason: req.body.reason || 'Blocked by Admin',
    createdAt: new Date().toISOString()
  };
  db.blockedDates.push(newEntry);
  saveDb(db);
  res.status(201).json({ success: true, message: 'Tanggal berhasil diblokir', data: newEntry });
});

app.delete('/api/blocked-dates/:id', (req, res) => {
  db.blockedDates = db.blockedDates.filter((b: any) => b.id !== req.params.id && b.date !== req.params.id);
  saveDb(db);
  res.json({ success: true, message: 'Blokir tanggal dicabut' });
});

// Testimonials
app.get('/api/testimonials', (req, res) => {
  res.json({ success: true, data: db.testimonials });
});

// Settings
app.get('/api/settings', (req, res) => {
  res.json({ success: true, data: db.settings });
});

app.put('/api/settings', (req, res) => {
  db.settings = { ...db.settings, ...req.body };
  saveDb(db);
  res.json({ success: true, message: 'Pengaturan berhasil diperbarui', data: db.settings });
});

// --- VITE / STATIC SERVING ---
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[AEKONEZT SERVER] Running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });
}

startServer();

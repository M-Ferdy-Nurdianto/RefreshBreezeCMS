# 🌬️ Refresh Breeze - Website Penjualan Cheki

> [!IMPORTANT]
> **COPYRIGHT NOTICE**: Repositori ini bersifat **PUBLIC** hanya untuk tujuan transparansi, namun lisensi kode adalah **PRIVATE**. Kode ini hanya diperbolehkan untuk digunakan oleh tim resmi **Refresh Breeze**. Pihak lain dilarang keras menggandakan atau menggunakan kode ini tanpa izin.

Website fullstack untuk penjualan Cheki (foto polaroid) dengan member Refresh Breeze. Dibangun dengan **React.js**, **Tailwind CSS**, **Express.js**, **Supabase**, dan **Supabase Storage** untuk manajemen file.

[![Deployment](https://img.shields.io/badge/Deploy-Vercel-black?style=flat&logo=vercel)](https://vercel.com)
[![Database](https://img.shields.io/badge/Database-Supabase-3ECF8E?style=flat&logo=supabase)](https://supabase.com)
[![License](https://img.shields.io/badge/License-Private-red)](LICENSE)

---

## 🌟 Fitur Utama

### 🛍️ Customer Features

- ✅ **Shopping Cart System** - Tambah/kurangi item dengan smooth animations
- ✅ **Event-Based Orders** - Pilih event terlebih dahulu sebelum checkout
- ✅ **Simplified Checkout** - Hanya 2 field: Nama + Kontak (IG/WA)
- ✅ **Auto-Detect Contact** - Backend otomatis detect phone number vs Instagram username
- ✅ **Image Auto-Compression** - Upload bukti bayar auto-compress (60-80% size reduction)
- ✅ **Responsive Design** - Mobile-first dengan Tailwind breakpoints
- ✅ **Toast Notifications** - Centered, non-blocking feedback
- ✅ **Dynamic Pricing** - 25k per member, 30k group member

### 🔐 Admin CMS Features

- ✅ **JWT Authentication** - Secure login dengan bcrypt password hashing
- ✅ **Dashboard Overview** - Real-time order statistics
- ✅ **Multi-Filter System**:
  - Status (Unchecked/Pending, Checked/Lunas, Completed/Selesai)
  - Type (All, OTS, PO, Special, Merch)
  - Event (filter by specific event)
  - Date Range (week/month/custom)
  - Search (nama/order number)
- ✅ **OTS Orders** - Create manual orders untuk on-the-spot sales (with member selector, event selection & auto pricing)
- ✅ **Export Data (Excel & PDF)** - Download filtered orders atau per-event lengkap dengan detail item dan total revenue
- ✅ **Bulk Delete** - Hapus order secara massal (berdasarkan event, rentang minggu/bulan, atau semua)
- ✅ **Event Management** - Tambah/Edit/Hapus event regular & event bertema spesial dengan custom lineup member
- ✅ **Merchandise Management** - Tambah/Edit/Hapus merch, upload foto & size chart, variasi ukuran (S-4XL), dan toggle status aktif
- ✅ **Dynamic Price Settings** - Pengaturan harga Cheki PO dan OTS (Per Member & Group) langsung dari dashboard
- ✅ **Payment Proof Viewer & Digital Receipt** - Modal detail order dengan preview bukti transfer & generator nota digital canvas
- ✅ **Sales Recap & Chart** - Rekap penjualan per member/group (PO vs OTS) dan grafik visual otomatis
- ✅ **Status Color Coding**:
  - ⚪ **Putih** = Pending / Unchecked (order baru masuk)
  - 🔵 **Biru** = Checked (pembayaran diverifikasi / lunas)
  - 🟢 **Hijau** = Completed (cheki/item telah diambil customer)

---

## 📖 Panduan Lengkap Admin CMS (Admin Guide)

Panduan praktis penggunaan seluruh tombol, modal, dan fitur operasional di halaman Admin CMS.

```
Admin Dashboard Navigation:
├── 📋 Orders Tab (All Reg, OTS, PO, Special, Merch)
├── 🎫 Events Tab (Event Regular & Event Spesial)
├── 🛍️ Merch Tab (Katalog & Stok Merchandise)
├── ⚙️ Settings Tab (Konfigurasi Harga PO & OTS)
└── 📊 Rekap Tab (Statistik & Grafik Penjualan)
```

---

### 1. 📋 Tab Orders (Manajemen Pesanan)

Tab ini digunakan untuk memonitor, memfilter, mengubah status pesanan, serta input pesanan langsung di lokasi (OTS).

#### A. Sub-Tab Filter Tipe Order
* **`All (Reg)`**: Menampilkan seluruh pesanan regular (gabungan OTS dan PO biasa).
* **`OTS`**: Khusus pesanan On-The-Spot yang diinput langsung oleh admin di venue.
* **`PO`**: Khusus pesanan Pre-Order yang di-checkout customer melalui website.
* **`Special`**: Khusus pesanan dari event bertema spesial (misal: Cheki Valentine, Halloween, dsb).
* **`Merch`**: Khusus pesanan produk fisik merchandise (kaos, gantungan kunci, dll).

#### B. Filter & Pencarian
* **Input Cari**: Ketik nama customer atau nomor order (contoh: `#RB-12345` atau `Budi`).
* **Dropdown Status**: Filter pesanan `Semua Status`, `Unchecked`, `Checked`, atau `Completed`.
* **Dropdown Event**: Filter data order khusus pada event tertentu.
* **Dropdown Waktu & Tanggal**: Filter pesanan `Semua Waktu`, `Minggu Ini`, `Bulan Ini`, atau `Custom Range` (memilih tanggal *From* dan *To*).

#### C. Tombol-Tombol Aksi Utama
* **`+ Order OTS` (Tombol Hijau)**:
  * Membuka **Modal Input OTS**. Digunakan saat ada pembeli langsung di venue event.
  * **Cara Pakai**:
    1. Pilih event yang sedang berlangsung.
    2. Masukkan **Nama Lengkap** pembeli.
    3. Pilih **Metode Pembayaran** (Cash / Transfer / QRIS).
    4. Klik kartu member atau All Member (Group) untuk menambah kuantitas cheki. Harga akan terkalkulasi otomatis.
    5. Klik **Simpan Order** → Pesanan otomatis tersimpan sebagai status *Checked* (Lunas).
* **`📊 Export Data` (Tombol Gradien Emerald)**:
  * Mengunduh rekap order ke format **Excel (.xlsx)** atau dokumen **PDF**.
  * **Langkah Export**:
    1. Klik tombol **Export Data**.
    2. Pilih format: **Excel** atau **PDF**.
    3. Pilih cakupan data: **Sesuai Filter di Layar** atau pilih **Event Tertentu**.
    4. Klik **Download** → File akan otomatis terunduh lengkap dengan daftar pesanan, rincian item, dan total nominal pendapatan.
* **`🗑️ Hapus Data` (Tombol Merah Bulk Delete)**:
  * Membuka modal pembersihan data order massal.
  * **Pilihan Scope Penghapusan**:
    * Berdasarkan event tertentu.
    * Pesanan lebih dari 1 minggu / 1 bulan lalu.
    * Hapus seluruh data order (memerlukan konfirmasi keamanan).

#### D. Tindakan pada Tabel Order (Per Baris)
* **Dropdown Ubah Status**:
  * Ganti ke **Unchecked** (belum dicek).
  * Ganti ke **Checked** (pembayaran valid/lunas).
  * Ganti ke **Completed** (cheki/barang sudah diambil oleh fan).
* **👁️ Tombol Lihat / Detail Order (Modal Detail)**:
  * **Lihat Bukti Transfer**: Klik gambar/link bukti transfer untuk preview atau membuka di Google Drive/Supabase Storage.
  * **Download Nota Digital**: Klik tombol **`Nota`** di header modal untuk menghasilkan struk receipt berformat gambar digital (Canvas) yang siap dibagikan ke customer.
  * **Detail Item & Catatan**: Melihat list member yang dibeli, kuantitas, harga subtotal, serta pesan/catatan khusus customer.
* **🗑️ Tombol Hapus Baris**: Menghapus satu order spesifik dengan konfirmasi SweetAlert2.

---

### 2. 🎫 Tab Events (Manajemen Event Regular & Spesial)

Mengelola jadwal pertunjukan, lokasi, lineup member, dan status aktif event.

* **`+ Tambah Event`**:
  * Membuka modal formulir event.
  * **Tipe Event**:
    * **Regular**: Event pertunjukan standar dengan harga cheki regular.
    * **Special Event**: Event bertema khusus (misal: *Summer Festival*, *Halloween Party*). Admin dapat memilih **Warna Tema** dan **Nama Tema**. Order dari event ini akan otomatis masuk ke tab *Special Orders*.
  * **Lineup Member**: Klik foto/nama member yang tampil di event tersebut untuk mengikutsertakan mereka ke dalam lineup penjualan cheki.
  * **Tanggal & Waktu**: Masukkan tanggal, bulan, tahun, jam open gate, dan jam sesi cheki.
* **Tindakan Baris Event**:
  * **Tombol Status (Aktif / Selesai)**: Menandai event sudah berakhir secara manual (event yang sudah lewat tanggal otomatis berstatus selesai).
  * **✏️ Edit**: Mengubah nama, lokasi, tanggal, tema, atau lineup member.
  * **🗑️ Hapus**: Menghapus data event.

---

### 3. 🛍️ Tab Merch (Manajemen Merchandise)

Mengelola katalog produk merchandise fisik yang dijual di toko online.

* **`+ Tambah Merch`**:
  * **Nama & Deskripsi**: Isi nama produk dan keterangan detail barang.
  * **Harga Produk**: Mendukung format fleksibel (contoh: ketik `135k`, `150rb`, `1.5jt`, atau angka langsung `150000`).
  * **Stok**: Isi jumlah persediaan stok barang, atau kosongkan jika sistem Pre-Order (PO).
  * **Ukuran Tersedia**: Klik badge ukuran (`S`, `M`, `L`, `XL`, `XXL`, `3XL`, `4XL`) untuk mengaktifkan/menonaktifkan variasi ukuran produk.
  * **Upload Foto Utama**: Upload foto produk (mendukung kompresi otomatis).
  * **Upload Size Chart**: Upload foto panduan ukuran/size chart.
  * **Toggle Tampilkan di Shop**: Centang untuk menampilkan produk ke customer, atau uncheck jika produk ingin di-draft/disembunyikan.
* **Aksi Daftar Merch**:
  * **Toggle Status Aktif/Nonaktif**: Sakelar instan untuk menyembunyikan/menampilkan produk dari katalog publik.
  * **✏️ Edit**: Mengubah info produk, harga, stok, atau mengganti gambar.
  * **🗑️ Hapus**: Menghapus produk dari database.

---

### 4. ⚙️ Tab Settings (Pengaturan Harga Dinamis)

Pusat kendali konfigurasi harga Cheki tanpa perlu mengubah kode program:

* **Harga Pre-Order (PO)**:
  * *Harga Cheki Per Member*: Tarif satuan cheki per-member untuk pemesanan online website (Default: Rp 25.000).
  * *Harga Cheki Grup*: Tarif cheki bersama seluruh member (All Member) untuk pemesanan online (Default: Rp 30.000).
* **Harga On The Spot (OTS)**:
  * *Harga OTS Per Member*: Tarif satuan cheki per-member untuk pembelian langsung di lokasi (Default: Rp 25.000).
  * *Harga OTS Grup*: Tarif cheki grup langsung di lokasi (Default: Rp 30.000).
* **`Simpan Perubahan`**: Menyimpan konfigurasi ke database. Harga di halaman customer dan modal OTS admin akan otomatis ter-update seketika.

---

### 5. 📊 Tab Rekap (Laporan & Grafik Statistik)

Menyajikan analisa data performa penjualan secara visual:

* **Filter Event**: Memilih data performa untuk seluruh event atau satu event tertentu.
* **Card Ringkasan**:
  * **Total Pendapatan (Revenue)**: Akumulasi nominal uang dari pesanan berstatus *Checked* dan *Completed*.
  * **Total Cheki Terjual**: Jumlah total lembar cheki/polaroid yang selesai diambil.
* **Grafik Penjualan per Member**: Diagram batang (Bar Chart) interaktif yang membandingkan total penjualan cheki Pre-Order (Biru) vs OTS (Oranye) untuk masing-masing member dan grup.
* **Tabel Rincian Member**: Menampilkan rincian kuantitas PO, kuantitas OTS, total quantity, dan total kontribusi revenue per member.

---

## 🛠️ Tech Stack

### Frontend

- **React 18** + **Vite** - Fast build tool and modern React
- **Tailwind CSS** - Utility-first responsive design
- **Framer Motion** - Smooth animations
- **SweetAlert2** - Beautiful modals and alerts
- **React Router v6** - Client-side routing
- **Axios** - HTTP requests
- **React Toastify** - Toast notifications
- **React Icons** - Icon library

### Backend

- **Node.js** + **Express** - RESTful API server
- **Supabase** - PostgreSQL database with real-time features
- **Supabase Storage** - File storage for payment proofs
- **Sharp** - High-performance image compression
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **ExcelJS** - Excel file generation
- **Multer** - Multipart form-data handling

### Infrastructure

- **Vercel** - Frontend & Backend hosting
- **Supabase** - Database & Storage
- **GitHub** - Version control

---

## 📁 Project Structure

```
RB Remake/
├── frontend/                # React frontend
│   ├── public/
│   │   ├── data/           # Member data (JSON)
│   │   │   └── members.json
│   │   └── images/         # Static images
│   │       ├── members/    # Member photos (HARDCODED)
│   │       ├── events/     # Event photos
│   │       └── logos/      # Logo & branding
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── lib/            # API & Supabase clients
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── backend/                 # Express backend
│   ├── config/             # Database & Google Drive config
│   ├── routes/             # API routes
│   ├── middleware/         # Auth middleware
│   ├── server.js
│   └── package.json
│
├── database/                # Database schema
│   ├── schema.sql          # Supabase schema
│   └── README.md
│
├── scripts/                 # Helper scripts
│   ├── generate-placeholders.ps1
│   └── README.md
│
├── IMAGES_GUIDE.md         # Image management guide
└── README.md
```

## 🚀 Quick Start

### 1. Setup Database (Supabase)

1. Buat project di [Supabase](https://supabase.com)
2. Jalankan SQL di `database/schema.sql` di SQL Editor
3. Copy URL dan Service Key

### 2. Setup Google Drive API

1. Buat project di [Google Cloud Console](https://console.cloud.google.com)
2. Enable Google Drive API
3. Buat Service Account → Download credentials JSON
4. Buat folder di Google Drive → Share dengan email service account
5. Copy Folder ID dari URL

### 3. Setup Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env dengan credentials Anda
npm run dev
```

**Backend .env:**

```env
PORT=5000
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_service_key
JWT_SECRET=your_random_secret_string
GOOGLE_DRIVE_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_DRIVE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY\n-----END PRIVATE KEY-----\n"
GOOGLE_DRIVE_FOLDER_ID=your_folder_id
FRONTEND_URL=http://localhost:3000
```

### 4. Setup Frontend

```bash
cd frontend
npm install
cp .env.example .env
# Edit .env dengan Supabase URL & Anon Key
npm run dev
```

**Frontend .env:**

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_API_URL=http://localhost:5000/api
```

### 4. Setup Member Photos (NEW!)

```bash
# Generate placeholder SVG images
.\scripts\generate-placeholders.ps1

# Or manually:
# 1. Prepare photos (800x1000px, 4:5 ratio, JPG format)
# 2. Rename: sinta.jpg, cally.jpg, naomi.jpg, amel.jpg, luna.jpg, bella.jpg, zara.jpg, group.jpg
# 3. Copy to: frontend/public/images/members/
# 4. Refresh browser (Ctrl+F5)
```

**📸 See detailed guide:** [IMAGES_GUIDE.md](IMAGES_GUIDE.md)

### 5. Create Admin User

Gunakan API endpoint untuk membuat admin pertama kali:

```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "username": "admin",
  "password": "your_password",
  "full_name": "Admin Refresh Breeze",
  "secret": "REFRESH_BREEZE_SETUP_2026"
}
```

Atau gunakan Postman/Thunder Client.

## 📱 Cara Menggunakan

### Customer Flow:

1. Buka homepage → pilih member
2. Add to cart
3. Scroll ke "Konfirmasi Pembayaran"
4. Transfer sesuai nominal
5. Simpan bukti transfer & Order ID
6. Tunggu konfirmasi admin

### Admin Flow:

1. Login di `/admin/login`
2. **Lihat semua pesanan** di tab Orders
3. **Filter berdasarkan**:
   - Status (Pending/Checked/Completed)
   - Periode (Minggu/Bulan/Custom)
   - Search nama
4. **Ubah status** dengan dropdown di setiap row
5. **Klik "Detail"** untuk lihat bukti pembayaran
6. **Export Excel** untuk rekap periode tertentu
7. **Order OTS** untuk input manual di venue
8. **Manage Events** di tab Events

## 🎨 Fitur Status Warna

### Sistem Warna Otomatis:

- **🟦 PENDING (Putih)**: Pesanan baru masuk, belum diproses
- **🟦 CHECKED (Biru)**: Admin sudah cek pembayaran, validasi OK
- **🟢 COMPLETED (Hijau)**: Customer sudah ambil tiket fisik di venue

Admin tinggal ubah dropdown status di tabel.

## 📊 Export Excel

Fitur export menghasilkan file `.xlsx` dengan kolom:

- Order Number
- Nama Lengkap (Required)
- WhatsApp (Required)
- Instagram (Optional)
- Items (detail cheki yang dibeli)
- Total Harga (Auto)
- Status
- Tanggal Order

Filter by date range sebelum export untuk rekap bulanan/minggu.

## 🔐 Security

- JWT authentication untuk admin
- Google Drive service account (bukan user credentials)
- Image compression sebelum upload (max 200KB)
- Row Level Security (optional di Supabase)
- CORS protection
- Environment variables untuk semua secrets

## 🎯 API Endpoints## 🚀 Quick Start

### Prerequisites

- Node.js 16+
- Supabase account
- Git

### 1️⃣ Clone & Install

```bash
git clone https://github.com/your-username/rb-remake.git
cd rb-remake

# Install dependencies
npm install

# Setup backend
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials

# Setup frontend
cd ../frontend
npm install
cp .env.example .env
# Edit .env with your credentials
```

### 2️⃣ Setup Supabase Database

```bash
# Login to Supabase Dashboard
# Go to SQL Editor
# Run database/schema.sql
# Run database/dummy-data.sql (optional)
# Create admin: Run generate-hash.js then use output in SQL Editor
```

### 3️⃣ Setup Supabase Storage

```bash
# In Supabase Dashboard > Storage
# Create bucket: payment-proofs
# Set Public Access: ON
# Create policy for authenticated write, public read
```

### 4️⃣ Run Development Server

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

Open http://localhost:3000 for customer site  
Open http://localhost:3000/admin/login for admin (staffERBE / hijauERBE)

---

## 📖 API Endpoints

### Public Endpoints

- `GET /api/events` - Get all events (upcoming & past)
- `GET /api/members` - Get member data from JSON
- `GET /api/config` - Get payment config (rekening, prices)
- `GET /api/faqs` - Get FAQ list
- `POST /api/orders` - Create customer order (requires event_id, payment_proof)
- `POST /api/upload/payment-proof` - Upload & compress payment image

### Admin Protected Endpoints (Requires JWT)

- `POST /api/auth/login` - Admin login (returns JWT token)
- `GET /api/orders` - Get filtered orders (status, type, event, date, search)
- `GET /api/orders/:id` - Get single order detail
- `PATCH /api/orders/:id/status` - Update order status
- `GET /api/orders/export/excel` - Export orders to Excel with totals
- `POST /api/orders/ots` - Create OTS order (requires event_id)
- `POST /api/orders/bulk-delete` - Bulk delete orders (all/event/weeks/months)
- `GET /api/events` - Get all events
- `POST /api/events` - Create new event
- `PATCH /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

---

## 🔐 Security Features

✅ **Environment Variables** - All secrets in `.env` files  
✅ **JWT Authentication** - Secure admin access  
✅ **Password Hashing** - bcrypt with 10 rounds  
✅ **Input Validation** - All endpoints validate input  
✅ **CORS Protection** - Whitelist frontend domain  
✅ **SQL Injection Safe** - Supabase client parameterized queries  
✅ **File Upload Security** - Size limits, type validation, compression  
✅ **Row Level Security** - Supabase RLS ready  
✅ **No Secrets in Code** - All credentials via env vars

**Full details:** [SECURITY.md](SECURITY.md)

---

## 📱 Responsive Design

✅ **Mobile-First** - Tailwind breakpoints (sm: 640px, md: 768px, lg: 1024px)  
✅ **Touch-Friendly** - Buttons ≥ 44x44px  
✅ **Hamburger Menu** - Mobile navigation  
✅ **Responsive Grids** - Auto-adjust columns  
✅ **Scrollable Tables** - Horizontal scroll on mobile  
✅ **Adaptive Modals** - Full-width on mobile  
✅ **Centered Toasts** - Non-blocking notifications

**Tested on:** iPhone SE, iPhone 12, iPad, iPad Pro, Desktop, Ultra-wide

**Full report:** [PERFORMANCE.md](PERFORMANCE.md)

---

## ⚡ Performance Optimizations

✅ **Image Compression** - Sharp library (60-80% size reduction)  
✅ **Vite Build** - Tree-shaking, minification, code splitting  
✅ **Database Indexes** - Fast queries on foreign keys  
✅ **Lazy Loading** - Components loaded on-demand  
✅ **No Sourcemaps** - Production builds lightweight  
✅ **Progressive JPEG** - Faster image loading  
✅ **CDN Ready** - Vercel automatic CDN

---

## 🌐 Deployment Guide

### Deploy to Vercel (Recommended)

1. **Push to GitHub**

   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Import to Vercel**
   - Login to vercel.com
   - Import repository
   - Framework: Vite
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Set Environment Variables**
   Add in Vercel Dashboard > Settings > Environment Variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_API_URL`
   - All backend env vars

4. **Deploy Backend Separately**
   - Create new Vercel project
   - Root Directory: `backend`
   - Framework: Node.js

**Detailed guide:** [DEPLOY.md](DEPLOY.md)

---

## 📚 Documentation

- 📖 [SETUP.md](SETUP.md) - Detailed setup instructions
- 🚀 [DEPLOY.md](DEPLOY.md) - Deployment to Vercel/production
- 🔐 [SECURITY.md](SECURITY.md) - Security checklist & best practices
- ⚡ [PERFORMANCE.md](PERFORMANCE.md) - Responsiveness & optimization report
- 🧪 [TESTING.md](TESTING.md) - Testing checklist (if exists)

---

- **Project Summary:** [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)

## 🤝 Contributing

Untuk development lokal:

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 License

© 2026 Refresh Breeze. All rights reserved.

## 💬 Contact

- Instagram: [@refresh.breeze](https://instagram.com/refresh.breeze)

---

**Made with ❤️ for Refresh Breeze**

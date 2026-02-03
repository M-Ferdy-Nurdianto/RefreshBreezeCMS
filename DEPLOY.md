# 🚀 Deployment Guide - Refresh Breeze

## 📋 Checklist Sebelum Deploy

### ✅ Keamanan
- [x] Semua credentials ada di `.env` files
- [x] `.gitignore` sudah include `.env`
- [x] Tidak ada hardcoded secrets di code
- [x] JWT_SECRET menggunakan random string yang kuat
- [x] Supabase RLS (Row Level Security) aktif
- [x] CORS configured dengan whitelist domain

### ✅ Optimasi
- [x] Image auto-compression dengan Sharp (resize 1920x1920, 80% quality)
- [x] Vite build optimization (tree-shaking, minification)
- [x] No sourcemaps di production
- [x] Lazy loading untuk images
- [x] Toast notifications centered (tidak mengganggu UI)

### ✅ Responsivitas
- [x] Mobile-first design dengan Tailwind breakpoints
- [x] Hamburger menu untuk mobile
- [x] Grid responsif (grid-cols-1 md:grid-cols-2 lg:grid-cols-3)
- [x] Touch-friendly buttons dan forms
- [x] Tested di berbagai screen sizes

## 🔐 Environment Variables Setup

### 1. Backend (.env)
```bash
PORT=5000
NODE_ENV=production

SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key-here

JWT_SECRET=generate-random-32-character-string-here

FRONTEND_URL=https://your-vercel-app.vercel.app
```

### 2. Frontend (.env)
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key-here
VITE_API_URL=https://your-vercel-app.vercel.app/api
```

## 📦 Deployment ke Vercel

### Option 1: Via Vercel Dashboard (RECOMMENDED)

1. **Push ke GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Import Project di Vercel**
   - Login ke [vercel.com](https://vercel.com)
   - Klik "Add New Project"
   - Import repository dari GitHub
   - Framework Preset: **Vite** (auto-detected)

3. **Configure Build Settings**
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Environment Variables**
   
   Tambahkan di Vercel Dashboard > Settings > Environment Variables:
   
   **Frontend:**
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_API_URL` (gunakan URL Vercel Anda)

   **Backend:**
   - `PORT`
   - `NODE_ENV`
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_KEY`
   - `JWT_SECRET`
   - `FRONTEND_URL`

5. **Deploy Backend Separately** (Optional)
   
   Jika ingin backend terpisah:
   - Buat project baru di Vercel
   - Root Directory: `backend`
   - Framework: **Node.js**

### Option 2: Via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy frontend
cd frontend
vercel --prod

# Deploy backend (optional)
cd ../backend
vercel --prod
```

## 🗄️ Database Setup (Supabase)

### 1. Create Tables

Run SQL di Supabase Dashboard > SQL Editor:

```sql
-- Copy dari database/schema.sql
-- Pastikan semua tabel, foreign keys, dan indexes terbuat
```

### 2. Enable Row Level Security (RLS)

```sql
-- Aktifkan RLS untuk keamanan
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;

-- Policy untuk admin (via service role key)
-- Akses dari backend menggunakan service role key otomatis bypass RLS
```

### 3. Setup Storage Bucket

- Buka Storage di Supabase Dashboard
- Create bucket: `payment-proofs`
- Set Public Access: ON
- Policy: Allow public read, authenticated write

### 4. Create Admin User

```sql
-- Generate hash dulu dengan script generate-hash.js
-- Lalu run SQL ini:
INSERT INTO admin_users (username, password_hash, full_name) 
VALUES ('superadmin', '$2b$10$your_generated_hash_here', 'Super Admin');
```

## 🔒 Security Best Practices

### 1. Protect Sensitive Files
- Jangan commit `.env` files
- Jangan commit `node_modules/`
- Review `.gitignore` sebelum commit

### 2. Strong Credentials
- JWT_SECRET minimal 32 karakter random
- Admin password minimal 12 karakter
- Ganti default credentials setelah deploy

### 3. CORS Configuration
- Hanya allow domain production di CORS
- Update `FRONTEND_URL` di backend `.env`

### 4. Rate Limiting (TODO)
- Consider add rate limiting di backend
- Protect login endpoint dari brute force

## 📱 Mobile Optimization

### Tested Breakpoints:
- **Mobile**: 320px - 639px
- **Tablet**: 640px - 1023px
- **Desktop**: 1024px+

### Features:
- ✅ Touch-friendly buttons (min 44x44px)
- ✅ Responsive images with object-fit
- ✅ Mobile menu dengan hamburger icon
- ✅ Toast notifications di top-center
- ✅ Modal scrollable di mobile
- ✅ Grid auto-responsive

## 🎨 Toast Animation Config

Toast sudah dikonfigurasi dengan posisi center:

```javascript
toast.success('Message', {
  position: 'top-center',  // Semua toast di tengah
  autoClose: 2000-5000,     // Duration bervariasi
})
```

## 📊 Performance Checklist

- [x] Image compression (Sharp library)
- [x] Vite production build (minified)
- [x] No console.log di production (optional cleanup)
- [x] Lazy loading components (Framer Motion)
- [x] Database indexes on foreign keys
- [x] Optimized queries (select specific columns)

## 🧪 Testing Before Deploy

```bash
# Test production build locally
cd frontend
npm run build
npm run preview  # Test built version

# Test backend
cd backend
NODE_ENV=production node server.js
```

## 🔄 Post-Deployment

1. **Test All Features:**
   - [ ] Homepage loading
   - [ ] Add to cart
   - [ ] Checkout form (event dropdown, upload image)
   - [ ] Admin login
   - [ ] Create OTS order
   - [ ] Filter orders
   - [ ] Export Excel
   - [ ] Bulk delete
   - [ ] Edit/Delete events

2. **Monitor Errors:**
   - Check Vercel Logs untuk errors
   - Monitor Supabase Dashboard untuk slow queries

3. **Update DNS (Optional):**
   - Add custom domain di Vercel
   - Update CORS di backend

## 🆘 Troubleshooting

### Error: "CORS Policy Error"
- Check `FRONTEND_URL` di backend `.env`
- Pastikan match dengan Vercel domain Anda

### Error: "Failed to fetch"
- Check `VITE_API_URL` di frontend `.env`
- Pastikan backend deployed dan accessible

### Images tidak upload
- Check Supabase Storage bucket `payment-proofs` exists
- Verify public access policy
- Check bucket name di code

### Excel export 0 KB
- Check Authorization header di frontend
- Verify admin_token di localStorage
- Check network tab untuk error response

## 📚 Additional Resources

- [Vercel Docs](https://vercel.com/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Vite Deployment](https://vitejs.dev/guide/static-deploy.html)

---

**Ready to Deploy! 🎉**

Jika ada pertanyaan atau error saat deployment, check error logs dan troubleshooting guide di atas.

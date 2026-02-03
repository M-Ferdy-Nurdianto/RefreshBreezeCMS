# Setup Supabase Storage untuk Payment Proofs

## 📦 Langkah-langkah Setup Bucket

### 1. Buka Supabase Dashboard
- Login ke https://supabase.com
- Pilih project Anda

### 2. Buat Storage Bucket
1. Klik **Storage** di sidebar kiri
2. Klik tombol **New Bucket**
3. Isi form:
   - **Name**: `payment-proofs`
   - **Public bucket**: ✅ **Centang** (agar bisa diakses public)
   - **File size limit**: Kosongkan (gunakan default)
4. Klik **Create bucket**

### 3. Setup Policies (Opsional, jika ingin kontrol akses)
Jika Anda ingin kontrol akses lebih ketat, buat policies:

```sql
-- Allow public read access
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'payment-proofs' );

-- Allow authenticated uploads
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'payment-proofs' AND auth.role() = 'authenticated' );
```

## 🔧 Fitur Auto-Compression

Upload route sudah dilengkapi dengan **automatic image compression** menggunakan library `sharp`:

### Fitur Kompresi:
- ✅ **Resize otomatis**: Max 1920x1920px (maintain aspect ratio)
- ✅ **Format conversion**: Semua image dikonversi ke JPEG
- ✅ **Quality optimization**: 80% quality (balance antara size & quality)
- ✅ **Progressive JPEG**: Loading bertahap untuk UX yang lebih baik
- ✅ **Size reduction**: Rata-rata 60-80% pengurangan ukuran file

### Library yang Digunakan:
- `sharp` - High-performance image processing
- `multer` - File upload middleware
- `@supabase/supabase-js` - Supabase client

### Contoh Log Output:
```
📸 Original file: { name: 'payment.png', size: '2.5 MB', mimetype: 'image/png' }
✅ Compressed: { originalSize: '2.5 MB', compressedSize: '450 KB', reduction: '82.0%' }
```

## 📝 Testing Upload

Gunakan form Pre-Order di website atau test dengan curl:

```bash
curl -X POST http://localhost:5000/api/upload/payment-proof \
  -F "file=@/path/to/image.jpg" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Response:
```json
{
  "success": true,
  "data": {
    "fileId": "payment_1234567890_image.jpg",
    "url": "https://your-project.supabase.co/storage/v1/object/public/payment-proofs/payment_1234567890_image.jpg",
    "originalSize": 2621440,
    "compressedSize": 460800
  }
}
```

## ⚠️ Catatan Penting

1. **Bucket harus PUBLIC** agar gambar bisa ditampilkan di admin dashboard
2. **Sharp hanya jalan di server**, tidak bisa di browser
3. **Max upload size**: 10MB (sebelum kompresi)
4. **Supported formats**: JPG, PNG, WEBP, GIF, SVG (output selalu JPEG)

## 🔐 Environment Variables

Pastikan file `.env` backend sudah ada:
```env
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_service_role_key
```

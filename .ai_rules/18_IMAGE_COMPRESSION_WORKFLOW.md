# Image Compression Workflow

Setiap gambar yang diunggah oleh user (Bukti Bayar) atau Admin (Produk/Member) wajib melewati pipeline kompresi.

## Client-Side Pipeline
Sebelum melakukan `supabase.storage.upload()`, jalankan proses berikut:
1. **Format Conversion**: Ubah gambar (JPEG/PNG) menjadi **WebP**.
2. **Resolution Limit**: Batasi lebar maksimal gambar (e.g., 1080px). Pertahankan aspek rasio.
3. **Quality Tuning**: Atur kualitas WebP ke rentang `0.7 - 0.8` (seimbang antara ketajaman dan ukuran file).

## Storage Structure
Organisasikan file di Supabase Storage sebagai berikut:
- `/receipts/[order_id].webp`
- `/products/[product_id].webp`
- `/members/[member_id].webp`

## Implementation Example
Gunakan library seperti `browser-image-compression` atau fungsi Canvas manual.

```javascript
const compressedFile = await imageCompression(file, {
  maxSizeMB: 0.5,
  maxWidthOrHeight: 1080,
  useWebWorker: true,
  fileType: 'image/webp'
});
```

## Rules
1. **Naming**: Jangan gunakan nama file asli user. Selalu rename menjadi UUID atau ID entitas terkait.
2. **Cleanup**: Sediakan fungsi untuk menghapus gambar lama jika ada update (untuk menghindari sampah di storage).
3. **Lazy Loading**: Gunakan atribut `loading="lazy"` pada tag `<img>` di frontend.

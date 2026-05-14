# Error Handling & Toast Notifications

Memberikan feedback yang jelas adalah kunci user experience yang baik, terutama saat terjadi kegagalan sistem.

## Global Toast System
Gunakan utilitas di `src/lib/toast.jsx`. Hindari penggunaan `alert()` bawaan browser.

- **Success**: Untuk aksi yang berhasil (e.g., "Order berhasil dibuat!"). Warna: Hijau/Teal.
- **Error**: Untuk kegagalan (e.g., "Gagal mengunggah gambar"). Warna: Merah/Pink.
- **Loading**: Untuk proses asinkron panjang (e.g., "Sedang memproses pembayaran...").

## HTTP & DB Error Handling
Setiap panggilan API Supabase harus dibungkus dalam blok try-catch atau pengecekan objek `error`.

```javascript
const { error } = await supabase.from('orders').insert(data);
if (error) {
  showToast.error(`Kesalahan: ${error.message}`);
  // Log error secara internal jika perlu
  return;
}
```

## Error Boundaries
- Gunakan React Error Boundary untuk menangkap crash di level komponen agar tidak merusak seluruh aplikasi.
- Tampilkan halaman "Oops!" yang estetik dengan tombol "Muat Ulang Halaman".

## Rules
1. **User Friendly**: Jangan tampilkan kode error teknis yang membingungkan user (e.g., "PostgreSQL Error 42P01"). Terjemahkan menjadi bahasa yang dimengerti (e.g., "Terjadi masalah pada server kami").
2. **Persistence**: Toast sukses boleh menghilang otomatis dalam 3 detik. Toast error sebaiknya bertahan lebih lama atau memiliki tombol "Close" manual.
3. **Accessibility**: Pastikan notifikasi terbaca oleh screen reader.
4. **Validation**: Berikan pesan error spesifik pada tiap field form daripada satu pesan umum di atas halaman.

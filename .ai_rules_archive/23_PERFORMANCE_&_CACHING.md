# Performance & Caching Strategy

Kecepatan aplikasi sangat mempengaruhi kepuasan user, terutama di perangkat mobile dengan koneksi tidak stabil.

## Asset Optimization
1. **Images**: Selalu gunakan WebP. Gunakan `srcset` untuk gambar yang berbeda ukuran.
2. **Lazy Loading**: Tunda pemuatan gambar yang tidak terlihat di viewport pertama kali (`loading="lazy"`).
3. **Icons**: Gunakan `lucide-react` secara modular agar tree-shaking berjalan maksimal (jangan impor seluruh library).

## Code Level Optimization
1. **Memoization**: Gunakan `useMemo` dan `useCallback` untuk perhitungan berat atau fungsi yang sering dipassing ke child components guna menghindari re-render yang tidak perlu.
2. **Bundle Splitting**: Gunakan `React.lazy` untuk mengimpor halaman yang besar (e.g., Dashboard Admin) sehingga tidak membebani load awal public shop.
3. **Dependency Cleanup**: Cek `package.json` secara berkala. Hapus library yang tidak digunakan.

## Caching Strategy
1. **LocalStorage**: Cache data statis yang jarang berubah (e.g., Daftar Member) untuk mempercepat load berikutnya.
2. **Supabase Cache**: Gunakan header cache yang tepat jika ada API custom.
3. **Vercel Edge Caching**: Optimasi deployment di Vercel agar asset statis dilayani dari CDN terdekat user.

## Rules
1. **Keep it Light**: Ukuran bundle JavaScript diusahakan tetap kecil.
2. **First Paint**: Prioritaskan memunculkan konten utama (First Contentful Paint) dalam waktu kurang dari 2 detik.
3. **Network Resilience**: Pastikan aplikasi tidak crash saat offline. Gunakan Service Worker jika diperlukan untuk fungsi PWA.

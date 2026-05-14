# Realtime Monitoring System

Refresh Breeze mengandalkan Supabase Realtime untuk meminimalkan jeda operasional.

## Use Cases
1. **Order Notifications**: Dashboard Admin akan "berbunyi" atau memunculkan toast setiap ada pesanan baru yang masuk ke tabel `orders`.
2. **Inventory Sync**: Jika stok produk habis dibeli seorang user, tampilan stok di user lain harus otomatis berubah tanpa refresh.
3. **Event Updates**: Jika status event berubah menjadi "Completed", pendaftaran/pembelian terkait event tersebut harus otomatis tertutup di semua client.

## Technical Setup
```javascript
const channel = supabase
  .channel('public:orders')
  .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'orders' }, 
      payload => handleOrderChange(payload))
  .subscribe();
```

## Rules
1. **Performance**: Jangan melakukan `subscribe` pada terlalu banyak tabel sekaligus dalam satu halaman.
2. **Fallback**: Realtime hanyalah "pelengkap". Pastikan sistem tetap bisa berfungsi dengan fetching data manual jika koneksi WebSocket terputus.
3. **Visual Feedback**: Berikan indikasi visual (e.g., baris tabel yang berkedip pelan) saat ada data yang terupdate secara realtime agar admin sadar ada perubahan.

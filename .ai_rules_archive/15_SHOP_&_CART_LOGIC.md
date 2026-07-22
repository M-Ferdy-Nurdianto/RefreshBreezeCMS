# Shop & Cart Logic

## State Management
Data keranjang belanja (cart) dikelola menggunakan React State dan dipertahankan di **LocalStorage**.

### Cart Structure
Setiap item dalam cart memiliki format:
```javascript
{
  id: "uuid",
  type: "merchandise" | "cheki",
  name: "Nama Produk",
  price: 50000,
  quantity: 1,
  details: {
    memberId: "uuid", // Khusus Cheki
    poseRequest: "...",
    note: "..."
  }
}
```

## Inventory Logic
- Sebelum menambah ke cart, sistem harus mengecek `stock` dari tabel `merchandise`.
- Jika `stock <= 0`, tombol "Add to Cart" harus disabled.
- Khusus Cheki, stok biasanya tidak terbatas kecuali ada batasan slot per member per event.

## Persistence
- Setiap kali cart berubah, simpan ke `localStorage.setItem('rb_cart', JSON.stringify(cart))`.
- Saat aplikasi dimuat, ambil data dari storage di `useEffect`.

## Rules
1. **Realtime Update**: Jika admin mengubah stok di dashboard, shop page harus mengupdate tampilan stok tanpa refresh (menggunakan Realtime Subscription).
2. **Validation**: Jangan biarkan user checkout dengan keranjang kosong.
3. **Calculations**: Semua perhitungan total harga harus dilakukan di client untuk UI, namun divalidasi ulang oleh server saat transaksi final.

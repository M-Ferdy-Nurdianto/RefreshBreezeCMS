# Checkout Pipeline Flow

Proses Checkout dibagi menjadi 4 tahap utama untuk memastikan validitas data dan pengalaman user yang lancar.

## Tahap 1: Pengisian Data Customer
- User mengisi Nama dan Instagram Handle.
- Validasi: Field tidak boleh kosong. Nama minimal 3 karakter.

## Tahap 2: Review Pesanan
- Menampilkan ringkasan item (Cheki & Merchandise).
- Menghitung Total Harga + Kode Unik (jika ada).
- Menampilkan detail rekening pembayaran.

## Tahap 3: Upload Bukti Pembayaran
- User mengunggah foto bukti transfer.
- **Sistem Otomatis**: Gambar dikompres ke format WebP di sisi client sebelum dikirim ke server untuk menghemat bandwidth.
- Status Order diset ke `Pending`.

## Tahap 4: Konfirmasi & Selesai
- Data disimpan ke tabel `orders` dan `order_items`.
- User diarahkan ke halaman "Success".
- Link Struk Digital (Receipt) ditampilkan untuk didownload atau dishare.

## Rules
1. **Concurrency**: Gunakan `loading state` pada tombol "Submit" untuk mencegah double-submission (klik berkali-kali).
2. **Transaction Integrity**: Jika penyimpanan data gagal di tengah jalan, sistem harus memberikan feedback yang jelas dan tidak memotong saldo user (jika ada sistem saldo).
3. **Privacy**: Masking data sensitif di layar konfirmasi jika perlu.
4. **Mobile Experience**: Pastikan form input tidak tertutup keyboard virtual di mobile.

# Digital Receipt Engine

Struk digital adalah fitur kebanggaan Refresh Breeze yang harus terlihat estetik.

## Technical Components
- **Template**: Menggunakan HTML/CSS yang dikonversi menjadi gambar (Canvas) atau PDF.
- **Dynamic Data**: Mengambil data dari tabel `orders` dan `order_items`.
- **Branding**: Warna struk mengikuti `theme_color` dari tabel `events`.

## Sharing Features
1. **Download**: Menyimpan struk sebagai file `.png` ke galeri user.
2. **Share to IG Story**: Format struk harus dioptimasi untuk aspek rasio `9:16` (Story) dengan background yang menarik.
3. **Masking Contact**: Opsi untuk menyembunyikan nomor telepon atau detail pribadi pada gambar struk agar aman saat diposting di sosial media.

## Rules
1. **Typography**: Gunakan font monospaced (e.g., `Courier New` atau `Roboto Mono`) untuk bagian detail harga agar sejajar dan rapi.
2. **Logo**: Pastikan logo Refresh Breeze selalu ada di bagian header struk.
3. **High Resolution**: Gambar struk yang digenerate harus cukup tajam (minimal 2x scaling dari ukuran layar) agar tidak pecah saat dishare.
4. **Fallback**: Jika gambar gagal digenerate, sediakan tampilan HTML yang rapi sebagai cadangan.

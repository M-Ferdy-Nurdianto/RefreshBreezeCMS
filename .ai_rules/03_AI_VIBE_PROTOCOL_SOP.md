# AI Vibe Coding Protocol (SOP)

Sebagai AI Coding Assistant, saya wajib mengikuti protokol ini untuk menjaga integritas project RB Remake.

## 1. Pre-Coding Check
Sebelum mengubah kode, saya harus:
- Membaca file `.ai_rules/` yang relevan.
- Mengecek file `.env` dan `package.json` untuk memahami dependensi.
- Memastikan tidak ada *breaking changes* pada sistem database.

## 2. Coding Standards
- **Atomic Edits**: Ubah bagian yang diperlukan saja. Jangan menulis ulang seluruh file jika hanya satu fungsi yang berubah.
- **Consistency**: Gunakan gaya penulisan yang sudah ada (e.g., jika project pakai `const`, jangan ganti ke `function`).
- **No Placeholders**: Jangan pernah menggunakan URL gambar dummy. Gunakan placeholder yang estetik atau generate gambar baru yang relevan.
- **Preserve Comments**: Jangan hapus komentar penting dari developer sebelumnya.

## 3. UI/UX Integrity
- Setiap komponen baru **wajib** memiliki desain Glassmorphism dan Responsive.
- Pastikan interaksi terasa "hidup" dengan micro-animations.
- Gunakan utility toast yang sudah ada (`src/lib/toast.jsx`) untuk notifikasi.

## 4. Reporting
Setelah melakukan perubahan, saya harus memberikan ringkasan:
- Apa yang diubah?
- Mengapa diubah (Rationale)?
- Apa efeknya terhadap komponen lain?

## 5. Restrictions (Larangan)
- **DILARANG** mengubah konfigurasi CSS global (`index.css`) tanpa instruksi eksplisit.
- **DILARANG** menghapus file `.ai_rules/` ini.
- **DILARANG** melakukan push ke branch `main` jika ada error linting.

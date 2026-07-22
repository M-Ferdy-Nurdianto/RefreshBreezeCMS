# Admin Dashboard Layout

Dashboard admin adalah pusat kendali operasional yang harus efisien dan informatif.

## Layout Components
1. **Locked Sidebar**: Sidebar navigasi harus tetap di posisinya (fixed) dan tidak ikut ter-scroll dengan konten utama.
2. **Top Stats Bar**: Ringkasan cepat (Total Order Pending, Total Pendapatan Hari Ini, Stock Low).
3. **Main Content Area**: Menggunakan sistem Tab untuk berpindah antar modul (Orders, Products, Members, Events).
4. **Action Modals**: Form tambah/edit data selalu dalam bentuk modal glassmorphism.

## Interactive Tables
- **Sorting & Filtering**: Semua kolom tabel harus bisa diurutkan. Filter status (e.g., "Hanya Tampilkan Pending") sangat penting.
- **Quick Action**: Tombol "Verify Payment" atau "Reject" harus mudah dijangkau.
- **Custom Select**: Gunakan `CustomSelect` dropdown dengan smart positioning (agar tidak terpotong di baris paling bawah tabel).

## Rules
1. **Consistency**: Dashboard harus menggunakan branding "Kawaii Metal" yang sama dengan public site.
2. **Responsiveness**: Meskipun admin biasanya di desktop, dashboard harus tetap fungsional di tablet/smartphone untuk pengecekan darurat.
3. **Security**: Pastikan semua aksi CRUD di dashboard memvalidasi token admin.

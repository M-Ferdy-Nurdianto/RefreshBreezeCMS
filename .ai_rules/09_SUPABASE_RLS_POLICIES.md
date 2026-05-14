# Supabase RLS Policies

Keamanan data di Refresh Breeze diatur melalui **Row Level Security (RLS)** di PostgreSQL.

## Aturan Umum
- **Public**: Hanya memiliki akses `SELECT` pada tabel yang bersifat publik (Members, Events, Merchandise).
- **Authenticated (Admin)**: Memiliki akses penuh (`ALL`) untuk manajemen data.
- **Anon**: Tidak boleh melakukan `DELETE` atau `UPDATE` pada tabel apapun tanpa token khusus.

## Detail Kebijakan Per Tabel

### `members`, `events`, `merchandise`
- `SELECT`: `true` (Semua orang bisa lihat).
- `INSERT/UPDATE/DELETE`: `auth.role() == 'authenticated'`.

### `orders`
- `INSERT`: `true` (User bisa kirim pesanan tanpa login).
- `SELECT`: `auth.role() == 'authenticated'` (Hanya admin yang bisa lihat semua order).
- *Catatan*: User bisa melihat order sendiri jika diimplementasikan sistem `order_token`.

### `settings`
- `SELECT`: `true`.
- `UPDATE`: `auth.role() == 'authenticated'`.

## Penting
Setiap kali menambahkan tabel baru, AI **wajib** menyarankan pembuatan kebijakan RLS untuk menghindari kebocoran data.

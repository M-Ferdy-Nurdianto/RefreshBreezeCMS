# 🔧 FIX: Tambahkan Kolom event_id ke Database

## ❌ Error yang Terjadi:
```
Error creating order: {
  code: 'PGRST204',
  message: "Could not find the 'event_id' column of 'orders' in the schema cache"
}
```

## ✅ Solusi: Run Migration SQL

### Opsi 1: Via Supabase Dashboard (RECOMMENDED)

1. **Login ke Supabase Dashboard**
   - Buka https://supabase.com
   - Pilih project Anda

2. **Buka SQL Editor**
   - Klik **SQL Editor** di sidebar kiri
   - Klik **New query**

3. **Copy & Paste SQL Migration**
   ```sql
   -- Add event_id column to orders table
   ALTER TABLE orders 
   ADD COLUMN event_id UUID REFERENCES events(id) ON DELETE SET NULL;

   -- Add index for better performance
   CREATE INDEX idx_orders_event_id ON orders(event_id);
   ```

4. **Run Query**
   - Klik tombol **Run** (atau Ctrl + Enter)
   - Tunggu sampai muncul "Success. No rows returned"

5. **Verify**
   ```sql
   SELECT column_name, data_type, is_nullable
   FROM information_schema.columns
   WHERE table_name = 'orders' AND column_name = 'event_id';
   ```
   Harusnya muncul 1 row dengan kolom `event_id`, type `uuid`, nullable `YES`

### Opsi 2: Via Supabase CLI

Jika Anda install Supabase CLI:

```bash
# Login (jika belum)
supabase login

# Link project
supabase link --project-ref your-project-ref

# Run migration
psql -h db.your-project.supabase.co -p 5432 -d postgres -U postgres -f database/migration-add-event-id.sql
```

### Opsi 3: Via pgAdmin / SQL Client

Connect ke database Supabase dengan credentials dari dashboard, lalu run:
```sql
ALTER TABLE orders 
ADD COLUMN event_id UUID REFERENCES events(id) ON DELETE SET NULL;

CREATE INDEX idx_orders_event_id ON orders(event_id);
```

## 🎯 Setelah Migration Berhasil:

1. **Refresh browser** (Ctrl + Shift + R)
2. **Test order baru:**
   - Pilih event dari dropdown
   - Isi form
   - Upload bukti bayar
   - Submit ✅

## 📝 Penjelasan Kolom Baru:

- **Column:** `event_id`
- **Type:** UUID
- **Nullable:** YES (agar order lama tanpa event_id tidak error)
- **Foreign Key:** References `events(id)`
- **On Delete:** SET NULL (jika event dihapus, order tetap ada tapi event_id jadi NULL)
- **Index:** Ada index untuk query cepat

## ⚠️ Catatan:

- Order lama yang belum punya `event_id` akan bernilai `NULL`
- Order baru **wajib** punya `event_id` (validasi di backend)
- Filter by event di admin dashboard akan skip orders dengan `event_id = NULL`

## 🔍 Troubleshooting:

Jika masih error setelah migration:

1. **Clear Supabase cache:**
   ```sql
   NOTIFY pgrst, 'reload schema';
   ```

2. **Restart server** (kill terminal dan run `npm run dev` lagi)

3. **Hard refresh browser** (Ctrl + Shift + R)

## ✅ Verification Checklist:

- [ ] Migration SQL berhasil dirun
- [ ] Kolom `event_id` muncul di tabel `orders`
- [ ] Index `idx_orders_event_id` terbuat
- [ ] Dropdown event muncul di form checkout
- [ ] Bisa submit order baru tanpa error 500

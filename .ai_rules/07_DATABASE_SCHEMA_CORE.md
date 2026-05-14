# Database Schema: Core Tables

## 1. `members`
Menyimpan data member idol/staff.
- `id`: UUID (Primary Key)
- `name`: Text
- `role`: Text (Member, Staff)
- `image_url`: Text
- `is_active`: Boolean

## 2. `events`
Data event yang sedang berlangsung atau mendatang.
- `id`: UUID
- `title`: Text
- `date`: Timestamp
- `location`: Text
- `theme_color`: Text (Hex/HSL untuk UI dinamis)
- `status`: Text (Active, Completed, Cancelled)

## 3. `merchandise`
Katalog produk non-cheki.
- `id`: UUID
- `name`: Text
- `price`: BigInt (Simpan dalam satuan terkecil, e.g., Rupiah)
- `stock`: Integer
- `image_url`: Text
- `category`: Text

## 4. `orders`
Data transaksi user.
- `id`: UUID
- `customer_name`: Text
- `customer_ig`: Text
- `total_price`: BigInt
- `payment_proof_url`: Text
- `status`: Text (Pending, Verified, Rejected)
- `created_at`: Timestamp

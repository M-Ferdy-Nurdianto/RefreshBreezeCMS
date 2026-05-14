# Database Schema: Metadata & Utilities

## 1. `settings`
Konfigurasi global aplikasi.
- `key`: Text (Unique)
- `value`: JSONB (Menyimpan konfigurasi fleksibel)
- `description`: Text

## 2. `order_items`
Detail produk dalam satu order.
- `id`: UUID
- `order_id`: UUID (FK to `orders`)
- `item_type`: Text (Cheki, Merchandise)
- `item_id`: UUID
- `quantity`: Integer
- `price_at_purchase`: BigInt

## 3. `cheki_details`
Data spesifik untuk pesanan Cheki.
- `id`: UUID
- `order_item_id`: UUID
- `member_id`: UUID
- `pose_request`: Text
- `note`: Text

## 4. `system_logs`
Tracking aktivitas admin untuk audit.
- `id`: BigInt
- `admin_id`: UUID
- `action`: Text
- `details`: JSONB
- `created_at`: Timestamp

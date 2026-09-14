# System Architecture & Technical Specifications

## 1. System Overview

Refresh Breeze implements a decoupled client-server architecture. The frontend handles interactive customer ordering and administrative management, while an Express.js intermediary backend secures database mutations, processes authentication tokens, and compresses media before committing files to Supabase Storage.

```
                    +-----------------------------+
                    |        Client Browser       |
                    |  (React 18 + Vite Frontend) |
                    +--------------+--------------+
                                   |
                  +----------------+----------------+
                  |                                 |
         HTTP Queries / Uploads             Supabase Realtime
                  |                                 |
                  v                                 |
    +---------------------------+                   |
    |    Express.js API Layer   |                   |
    |  - JWT Authentication     |                   |
    |  - Sharp Image Processing |                   |
    |  - Supabase Service Role  |                   |
    +-------------+-------------+                   |
                  |                                 |
                  +----------------+----------------+
                                   |
                                   v
                    +-----------------------------+
                    |    Supabase Cloud Backend   |
                    |  - PostgreSQL Database      |
                    |  - Storage Buckets          |
                    |  - Row Level Security (RLS) |
                    +-----------------------------+
```

---

## 2. Core Modules

### Public Customer Application
- Shop & Checkout Engine (`frontend/src/pages/ShopPage.jsx`, `frontend/src/hooks/useShopCart.jsx`):
  - Calculates items, discounts, and order totals.
  - Validates contact information (phone vs. Instagram handle).
  - Handles client-side proof-of-payment image compression.
- Digital Receipt Engine:
  - Generates downloadable and shareable canvases containing transaction summaries and member badges.
- Member Showcase (`frontend/src/pages/MembersPage.jsx`):
  - Fetches idol rosters, group banners, catchphrases, and 3-slot photo galleries dynamically.

### Admin Command Center
- Orders Tab: Realtime feed subscribing to the `orders` PostgreSQL table. Provides status toggling (Pending, Verified, Completed), bulk deletion, and PDF/Excel export.
- Members CMS: Full-page editor (modal-free) for managing:
  - Stage names, member slugs, and sort orders.
  - Dual images: Member Profile photo (`image_url`) vs. Shop Cheki photo (`shop_image_url`).
  - Idol identity color (HEX) with preset palette integration.
  - 3-slot gallery photos synchronized with the `member_gallery` table.
- Events Tab: Creation and scheduling of regular and special events with member lineups.
- Merchandise Tab: SKU, price, size variant, and photo management.

---

## 3. Database Schema Design

### `members` Table
Stores idol member profiles and branding details.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | Primary Key, default `gen_random_uuid()` | Unique record identifier |
| `member_id` | `VARCHAR(50)` | Unique, Not Null | Clean slug (e.g. `cissi`, `group`) |
| `nama_panggung`| `VARCHAR(100)` | Not Null | Display stage name |
| `tagline` | `VARCHAR(255)` | Nullable | Catchy title or member role |
| `jikoshoukai` | `TEXT` | Nullable | Signature stage introduction |
| `tanggal_lahir`| `VARCHAR(50)` | Nullable | Member birthday |
| `hobi` | `VARCHAR(255)` | Nullable | Member hobbies |
| `instagram` | `VARCHAR(100)` | Nullable | Instagram handle |
| `hadir` | `BOOLEAN` | Default `true` | Active status toggle |
| `image_url` | `TEXT` | Nullable | Main profile portrait / banner |
| `shop_image_url`| `TEXT` | Nullable | Vertical Cheki ticket store photo |
| `color` | `VARCHAR(50)` | Default `#10B981` | Primary identity HEX color |
| `gradient` | `VARCHAR(100)` | Nullable | Optional secondary gradient style |
| `order_index` | `INT` | Default `0` | Sort order on public pages |
| `created_at` | `TIMESTAMPTZ` | Default `NOW()` | Creation timestamp |

### `member_gallery` Table
Maintains the 3-slot supplementary photo gallery per idol.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | Primary Key, default `gen_random_uuid()` | Unique gallery item identifier |
| `member_id` | `UUID` | Foreign Key (`members.id` ON DELETE CASCADE) | Referenced member |
| `image_url` | `TEXT` | Not Null | Gallery image resource URL |
| `created_at` | `TIMESTAMPTZ` | Default `NOW()` | Creation timestamp |

### `orders` & `order_items` Tables
Captures customer transaction records and Cheki/merchandise details.

---

## 4. Image Processing & Storage Pipeline

All photo uploads pass through `backend/routes/upload.js` before persistence:

1. Upload validation: Supported MIME types (`image/jpeg`, `image/png`, `image/webp`), 50MB incoming payload limit.
2. Optimization: Sharp resizes the image to maximum bounds (1200x1200px for member photos, 1920x1920px for payment proofs) and converts output to WebP at 85% quality.
3. Supabase Storage Dispatch:
   - `members/avatars/`: Member profile portraits.
   - `members/shop/`: Shop 2-Shot Cheki vertical card photos.
   - `members/gallery/`: Member detail gallery slots.
   - `receipts/`: Customer payment receipts.
4. Fallback Handling: Client components gracefully fallback to local vector graphics (`/images/members/placeholder.svg`) if remote assets are unreachable.

---

## 5. Security & Authentication

- Admin Authentication: Uses signed JSON Web Tokens (JWT) verified on protected endpoints (`/api/members`, `/api/events`, `/api/orders`, `/api/upload`).
- Password Storage: Admin credentials stored with bcrypt salt hashing.
- Row Level Security: Public read policies enabled on `members`, `events`, and active `merchandise`. Mutation policies restricted to service role or authenticated admins.

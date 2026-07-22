# Directory Structure Rules

## Root Directory
- `/frontend`: Seluruh kode aplikasi React.
- `/backend` / `/api`: Serverless functions (Vercel/Supabase).
- `/database`: Migration files dan script SQL.
- `/.ai_rules`: Dokumentasi konteks untuk AI (folder ini).

## Frontend Structure (`/frontend/src`)
- `/components`: Komponen UI yang reusable.
    - `/common`: Button, Input, Modal, Toast (UI Dasar).
    - `/shop`: Komponen spesifik untuk alur belanja (Cart, Checkout, Receipt).
    - `/admin`: Komponen khusus dashboard management.
- `/pages`: Halaman utama aplikasi (Shop, Admin, Home).
- `/lib`: Inisialisasi library pihak ketiga (supabaseClient.js, toast.js).
- `/hooks`: Custom React hooks untuk logic (useCart, useAuth).
- `/assets`: Gambar, icon, dan file statis.
- `/styles`: Global CSS dan tema.

## Rules for New Files
1. **Components**: Gunakan PascalCase (e.g., `DigitalReceipt.jsx`). Setiap komponen harus punya file `.css` sendiri jika logic stylingnya kompleks.
2. **Utilities**: Gunakan camelCase (e.g., `imageCompression.js`).
3. **Styles**: Preferensi CSS Modules untuk menghindari konflik nama class.
4. **Icons**: Selalu impor dari `lucide-react`.

# Core Tech Stack Inventory

## Frontend
- **Framework**: React 18+
- **Build Tool**: Vite
- **Styling**: Vanilla CSS (CSS Modules preferred for isolation) / Tailwind (jika diminta).
- **Icons**: `lucide-react`
- **Animations**: `framer-motion`
- **State Management**: React Hooks (Context API jika diperlukan).
- **HTTP Client**: Supabase JS Client

## Backend & Services
- **Backend-as-a-Service**: Supabase
- **Database**: PostgreSQL (Supabase DB)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage (Buckets: `receipts`, `members`, `products`)
- **Realtime**: Supabase Realtime (untuk monitoring order).

## Image Processing
- **Format**: WebP (Mandatory for all uploads).
- **Compression**: Client-side compression menggunakan `canvas` atau library terkait sebelum upload.

## Deployment
- **Platform**: Vercel
- **Environment**: Node.js 18+

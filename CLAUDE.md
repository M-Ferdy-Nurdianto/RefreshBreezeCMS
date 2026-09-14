# Claude Code & AI Assistant Development Guidelines

This document serves as the primary configuration and instruction guide for Claude Code, Gemini, and all AI coding assistants working on the Refresh Breeze (RB Remake) codebase.

## 1. Project Overview

Refresh Breeze is a fullstack idol merchandise and Cheki ecommerce platform with a comprehensive realtime Admin Command Center.

- Architecture: Decoupled React frontend (Vite) with an Express.js backend API and Supabase (PostgreSQL, Realtime, Storage, Auth).
- Core Brand Style: "Kawaii Metal" (combination of vibrant idol color accents with sharp, industrial dark surfaces and glassmorphism).

## 2. Core Development Rules

### Rule 1: Zero Emojis Policy
- Do not use emojis in UI buttons, tabs, titles, badges, headers, or alerts.
- Use vector icons exclusively (via `react-icons/fa` or `lucide-react`).
- Keep documentation, commit messages, and UI typography clean, professional, and developer-grade.

### Rule 2: UI Design Standards & Full Page Editors
- Do not use floating modal popups for primary CMS entity management (Members, Events, Merch). Always use Full Page Editor views within the tab, featuring:
  - Return button ("Kembali ke Daftar ...")
  - Top and bottom action buttons
  - Multi-column responsive layout
  - Realtime preview for images and colors
- Dual-Theme Specification:
  - Light Mode: 100% clean white cards (`#ffffff`, `bg-white`), dark slate text (`#0f172a`), light borders (`border-gray-200`). Never use dark surfaces or washed gray text in Light Mode.
  - Dark Mode: Deep metal dark background (`#090d16` / `#060911`), glassmorphism card surfaces (`#111726` / `#161f33`), crisp light text (`#f4f4f5`), subtle borders (`border-white/10`).

### Rule 3: Dual-Photo Architecture for Members
Every idol member maintains two distinct primary photos:
1. `image_url`: Member profile photo used in the public Members page (`/members`), member detail popup, and general avatars.
2. `shop_image_url`: Shop photo used specifically for the vertical 2-Shot Cheki ticket cards in `/shop`.
Both must be independently viewable, editable, and uploadable in the Member CMS.

### Rule 4: Dynamic CMS Integrity
- Never reintroduce hardcoded arrays or static dictionary fallbacks for members, merchandise, or events.
- All public consumer components must read dynamic data from the backend API / Supabase database.
- Always include fallbacks to local SVGs (`placeholder.svg`) if image loading fails.

### Rule 5: Image Processing & Storage
- All user-uploaded photos must be processed client-side or server-side via Sharp to WebP format.
- Storage buckets:
  - `members`: Subfolders `avatars/`, `gallery/`, and `shop/`
  - `receipts`: Customer payment proof uploads
  - `merchandise`: Product photos and size charts

### Rule 6: Admin Cache Invalidation
- When making administrative requests, bypass in-memory metadata caching in `frontend/src/lib/api.js` to ensure the admin view always displays the latest database state.

## 3. Common Commands

```bash
# Development (starts both backend on :5000 and frontend on :3000)
npm run dev

# Frontend only
cd frontend && npm run dev

# Backend only
cd backend && npm run dev

# Production Build
cd frontend && npm run build

# Seed Initial Database Data
npm run seed

# Run Test Suite
npm test
```

## 4. Key Directory Structure

```
d:/Githab/RB Remake/
├── backend/
│   ├── config/          # Supabase client & Google Drive service account
│   ├── middleware/      # Auth & JWT verification
│   ├── routes/          # Express route handlers (auth, members, events, orders, upload, settings)
│   └── server.js        # Express server entry point
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable UI components (Navbar, Footer, Cart, Modals)
│   │   ├── hooks/       # Custom React hooks (useAuth, useCart, useShopCart)
│   │   ├── lib/         # API client, path utilities, toast helpers
│   │   ├── pages/       # Route pages (HomePage, ShopPage, MembersPage, AdminPage)
│   │   │   └── admin/   # Admin tabs (OrdersTab, MembersTab, EventsTab, MerchTab, SettingsTab)
│   │   └── styles/      # Global CSS and themes
│   └── vite.config.js
├── supabase/
│   └── migrations/      # Version-controlled SQL migration scripts
├── ARCHITECTURE.md      # Detailed system architecture and schema design
├── CHANGELOG.md         # Version history
├── README.md            # Repository introduction and setup guide
└── TODO.md              # Current roadmap and backlog
```

## 5. Environment Variables Checklist

Backend (`backend/.env`):
- `PORT` (default: 5000)
- `SUPABASE_URL`
- `SUPABASE_SERVICE_KEY`
- `JWT_SECRET`
- `FRONTEND_URL` (default: http://localhost:3000)

Frontend (`frontend/.env`):
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_API_URL` (default: http://localhost:5000/api)

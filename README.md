# Refresh Breeze - Idol Merchandise & Cheki Ecommerce Platform

Refresh Breeze is a fullstack web platform engineered for idol fan communities, featuring a high-conversion Cheki and merchandise shop, digital collectible receipts, and an Admin Command Center.

## Architecture & Technology Stack

### Frontend
- Framework: React 18
- Build Tool: Vite
- Styling: Vanilla CSS with custom design tokens, Glassmorphism, and Tailwind utility classes
- Icons: `react-icons` and `lucide-react`
- Animations: `framer-motion`
- Notifications: Custom toast notification system (`src/lib/toast.jsx`)

### Backend & Database
- Runtime: Node.js with Express.js
- Database: PostgreSQL hosted on Supabase
- Authentication: Supabase Auth and custom JWT middleware
- Storage: Supabase Storage with automated WebP compression via Sharp
- Realtime: Supabase Realtime for order notifications

---

## Core Features

### Public Portal
- Dynamic Member Showcase: Complete idol profiles, stage names, catchphrases, birthdates, social links, custom neon color branding, and 3-photo galleries loaded dynamically from the database.
- Cheki & Merchandise Store: Event-based ordering, dynamic quantity calculators, bundle discounts, and cart management.
- Simplified Checkout Flow: Two-field checkout (Customer Name and Contact info), proof-of-payment upload with automated WebP image compression.
- Digital Collectibles & Receipts: Client-side HTML5 canvas receipt generator suitable for saving and Instagram Story sharing.

### Admin Command Center
- Live Order Management: Realtime order tracking, multi-criteria filtering (status, event, OTS, PO, merch), search, and bulk actions.
- Full CMS Member Management: Full-page editor (no modal popups) for creating and updating idol profiles, group banners, custom HEX color pickers, 3-slot photo galleries, and sort ordering.
- Dual-Photo Management: Independent photo upload workflows for member profile portraits and vertical 2-Shot Cheki store displays.
- Event Scheduling: Management of regular and special event lineups.
- Merchandise Inventory: Size variants, stock controls, and dimension charts.
- Export Capabilities: Excel and PDF order export per event.

---

## Getting Started

### Prerequisites
- Node.js version 18 or later
- npm or yarn package manager
- A Supabase project with database and storage initialized

### Installation

1. Clone the repository:
```bash
git clone https://github.com/NobodySandJ/RefreshBreezeCMS.git
cd RefreshBreezeCMS
```

2. Install all dependencies across workspaces:
```bash
npm run install:all
```

3. Configure environment variables:
Create `.env` files in both the `backend` and `frontend` directories using `.env.example` as a reference.

4. Apply database migrations:
```bash
npx supabase migration up
```

5. Run development servers:
```bash
npm run dev
```

The frontend will run at `http://localhost:3000` and the backend API at `http://localhost:5000`.

---

## Project Structure

```
RefreshBreezeCMS/
├── backend/
│   ├── config/              # Supabase and storage service accounts
│   ├── middleware/          # JWT authentication and upload filters
│   ├── routes/              # RESTful API endpoints
│   └── server.js            # API server entrypoint
├── frontend/
│   ├── public/              # Static assets and images
│   ├── src/
│   │   ├── components/      # Shared components
│   │   ├── hooks/           # Business logic hooks
│   │   ├── lib/             # API client and utility functions
│   │   ├── pages/           # Customer pages and Admin dashboard
│   │   └── styles/          # Global tokens and CSS
│   └── vite.config.js
├── supabase/
│   └── migrations/          # SQL database schema definitions
├── ARCHITECTURE.md          # System architecture documentation
├── CHANGELOG.md             # Version history and releases
├── CLAUDE.md                # AI coding assistant guidelines
├── CONTRIBUTING.md          # Contribution guidelines
├── TODO.md                  # Development backlog and roadmap
└── README.md                # Project documentation
```

---

## License & Intellectual Property

This repository is maintained for transparent deployment and review. Source code and brand assets are reserved exclusively for the official Refresh Breeze production operations.

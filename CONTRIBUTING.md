# Contributing to Refresh Breeze

Thank you for your interest in contributing to the Refresh Breeze platform. To ensure consistency, code quality, and brand integrity, please follow these guidelines.

## 1. Development Workflow

1. Create a descriptive feature branch from `main`:
   ```bash
   git checkout -b feature/member-dual-photo-cms
   ```
2. Ensure both the frontend and backend run locally without errors:
   ```bash
   npm run dev
   ```
3. Test your changes in both Light Mode and Dark Mode.
4. Verify production builds before submitting:
   ```bash
   npm run build
   ```

## 2. Commit Message Standards

This project follows Conventional Commits:
- `feat:` for new capabilities or user-facing additions
- `fix:` for bug fixes
- `refactor:` for code restructuring without behavioral change
- `docs:` for documentation updates
- `style:` for CSS, formatting, or UI polish
- `chore:` for dependency updates or build tooling

Examples:
- `feat(members): add dual photo upload for profile and shop cheki`
- `fix(shop): prevent undefined reference error on member render`
- `docs: standardize markdown documentation without emojis`

## 3. Coding Guidelines

### UI & Styling
- Do not use emojis in UI buttons, titles, or headers. Use vector icons from `react-icons` or `lucide-react`.
- Maintain the Dual-Theme specification:
  - Light Mode surfaces must remain 100% clean white (`#ffffff`).
  - Dark Mode surfaces must adhere to deep metal tones (`#090d16`, `#111726`).
- Do not introduce floating modal windows for core CMS workflows; use dedicated Full Page Editor views.

### Database & Migrations
- Write versioned SQL migration scripts in `supabase/migrations/` using timestamp prefixes (`YYYYMMDDHHMMSS_description.sql`).
- Never delete or rename active production columns without an accompanying migration strategy.

### Image Assets
- Process all uploaded photos through the Sharp WebP pipeline.
- Maintain responsive aspect ratios: portrait 1:1 or 3:4 for idol photography.

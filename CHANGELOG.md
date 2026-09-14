# Changelog

All notable changes to the Refresh Breeze project are documented in this file.
The format is based on Keep a Changelog, and this project adheres to Semantic Versioning.

## [1.2.0] - 2026-09-13

### Added
- Full CMS Member Management: Replaced static/hybrid idol configuration with dynamic database-driven member editing directly in the Admin Command Center.
- Full Page CMS Editor: Transitioned from floating modal dialogs to a spacious multi-column full-page editor within the tab.
- Dual-Photo Architecture: Independent upload controls and database columns for Member Profile photos (`image_url`) and Shop Cheki 2-Shot photos (`shop_image_url`).
- Dynamic Color Branding: Integrated idol color palette picker and HEX input with live preview on member cards and public pages.
- 3-Slot Photo Gallery: Dedicated upload and removal controls for idol showcase galleries in the member detail view.
- Dual Thumbnail Cards: Admin member cards now present both Profile and Shop Cheki previews side-by-side.

### Changed
- Converted image upload pipeline in Express backend to route through Sharp WebP optimization into distinct Supabase Storage directories (`avatars`, `gallery`, `shop`).
- Removed legacy `foto/...` broken file references and restored valid `/images/shop/` and `/images/members/` assets.
- Cleaned up UI components to eliminate all emojis in favor of vector icons from React Icons (`FaUsers`, `FaCamera`, `FaSave`, etc.).
- Bypassed in-memory client API cache for authenticated admin requests to guarantee realtime fresh data.

### Removed
- Removed legacy `.ai_rules_archive/` containing 23 obsolete documentation files.
- Removed deprecated floating `MemberModal.jsx`.

---

## [1.1.0] - 2026-09-10

### Added
- Modern Minimalist Dark Admin: Comprehensive dark mode redesign using deep metal surfaces (`#090d16`, `#111726`) and border styling.
- Realtime Orders Subscription: WebSocket listener for instant order status notifications on the admin dashboard.
- Export Capabilities: Excel and PDF transaction reports grouped by event.

### Fixed
- Fixed Light Mode surface consistency: enforced 100% white cards (`#ffffff`) and dark slate typography (`#0f172a`).
- Corrected undefined reference error on `groupMember` in `ShopPage.jsx`.

---

## [1.0.0] - 2026-08-01

### Added
- Initial release of Refresh Breeze Cheki and Merchandise shopping portal.
- Event-based ordering workflow.
- Simplified two-field checkout form.
- Automated client-side receipt generator with Instagram Story sharing capabilities.
- Express.js API backend and Supabase database integration.

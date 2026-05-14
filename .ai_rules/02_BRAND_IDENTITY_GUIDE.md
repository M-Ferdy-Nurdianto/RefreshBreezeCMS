# Brand Identity Guide

## Color Palette (HSL Focused)
Gunakan format HSL untuk fleksibilitas opacity dan glassmorphism.

| Role | HSL / Value | Usage |
| :--- | :--- | :--- |
| **Primary** | `hsl(330, 100%, 70%)` | Accent color, buttons, highlights (Pink Kawaii). |
| **Secondary** | `hsl(180, 100%, 45%)` | Secondary accents, success states (Teal Breeze). |
| **Background** | `hsl(240, 10%, 4%)` | Deep dark background (Metal). |
| **Surface** | `hsla(240, 10%, 10%, 0.7)` | Glassmorphism base layer. |
| **Border** | `hsla(0, 0%, 100%, 0.1)` | Subtle borders for glass effect. |

## Typography
- **Primary Font**: `Outfit` atau `Inter` (Sans-serif) untuk kejelasan dan kesan modern.
- **Accent Font**: `Syne` atau `Space Grotesk` (untuk headline yang berkarakter "Metal").
- **Rules**:
    - Headline selalu `font-weight: 700` atau lebih.
    - Body text minimal `14px` di mobile.

## Glassmorphism Rules
Untuk menjaga kesan premium, gunakan aturan berikut:
- `backdrop-filter: blur(12px) saturate(180%)`.
- `background: rgba(255, 255, 255, 0.05)`.
- `border: 1px solid rgba(255, 255, 255, 0.1)`.
- `box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.8)`.

## Visual Elements
- **Icons**: Gunakan `Lucide React` dengan stroke thin (1.5px).
- **Gradients**: Gunakan gradient halus, jangan terlalu kontras (e.g., Deep Purple to Black).
- **Animations**: Gunakan `framer-motion` untuk setiap transisi halaman dan hover button.

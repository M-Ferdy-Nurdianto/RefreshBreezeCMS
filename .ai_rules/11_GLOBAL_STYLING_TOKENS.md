# Global Styling Tokens

## Color Variables (CSS)
Simpan variabel ini di `:root` dalam `index.css` atau `variables.css`.

```css
:root {
  /* Brand Colors */
  --color-primary: hsl(330, 100%, 70%); /* Pink Kawaii */
  --color-secondary: hsl(180, 100%, 45%); /* Teal Breeze */
  --color-accent: hsl(280, 80%, 60%); /* Purple Metal */

  /* Neutral Colors */
  --bg-deep: hsl(240, 10%, 4%);
  --bg-surface: hsla(240, 10%, 12%, 0.6);
  --text-main: hsl(0, 0%, 95%);
  --text-dim: hsl(0, 0%, 70%);

  /* Border & Glass */
  --glass-border: hsla(0, 0%, 100%, 0.1);
  --glass-reflection: hsla(0, 0%, 100%, 0.05);

  /* Spacing */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 2rem;
  --space-xl: 4rem;

  /* Shadows */
  --shadow-neon-pink: 0 0 15px hsla(330, 100%, 70%, 0.3);
  --shadow-neon-teal: 0 0 15px hsla(180, 100%, 45%, 0.3);
}
```

## Typography Rules
- **Headline**: `font-family: 'Space Grotesk', sans-serif; text-transform: uppercase; letter-spacing: 0.05em;`
- **Body**: `font-family: 'Inter', sans-serif; line-height: 1.6;`

## UI Constants
- **Border Radius**: `12px` (Standard), `24px` (Buttons), `50%` (Circular).
- **Default Transition**: `all 0.3s cubic-bezier(0.4, 0, 0.2, 1)`.

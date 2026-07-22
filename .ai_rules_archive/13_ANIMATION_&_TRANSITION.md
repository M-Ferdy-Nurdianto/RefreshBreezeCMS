# Animation & Transition Guidelines

Refresh Breeze menggunakan `framer-motion` untuk menghidupkan antarmuka.

## Page Transitions
Setiap pergantian halaman harus terasa halus.

```javascript
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

// Usage
<motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
  {content}
</motion.div>
```

## Micro-Interactions
1. **Buttons**:
   - Hover: `scale: 1.05`, `brightness: 1.1`.
   - Tap: `scale: 0.95`.
2. **Lists (Stagger)**:
   - Item dalam list harus muncul satu per satu dengan delay singkat (`staggerChildren`).
3. **Modals**:
   - Muncul dari tengah dengan efek `spring` (damping: 20, stiffness: 300).

## Rules
- **Duration**: Gunakan durasi singkat (`0.2s` - `0.4s`). Animasi yang terlalu lambat akan membuat aplikasi terasa berat.
- **Easing**: Selalu gunakan `easeOut` atau `easeInOut`. Hindari linear animation kecuali untuk loader.
- **Accessibility**: Jika user mengaktifkan "Reduce Motion" di OS, pastikan aplikasi tetap berfungsi tanpa animasi yang mengganggu.

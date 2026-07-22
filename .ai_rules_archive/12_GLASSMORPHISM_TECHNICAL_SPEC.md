# Glassmorphism Technical Spec

Efek Glassmorphism adalah kunci dari estetika "Premium Metal" di Refresh Breeze.

## Core CSS Recipe
Setiap panel atau kartu utama harus menggunakan kombinasi berikut:

```css
.glass-panel {
  background: var(--bg-surface);
  backdrop-filter: blur(12px) saturate(180%);
  -webkit-backdrop-filter: blur(12px) saturate(180%);
  border: 1px solid var(--glass-border);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  border-radius: 12px;
}
```

## Advanced Effects
1. **Inner Glow**:
   Gunakan `inset shadow` untuk memberikan kesan kedalaman pada border.
   `box-shadow: inset 0 0 0 1px hsla(0, 0%, 100%, 0.05);`

2. **Gradient Border**:
   Untuk tombol premium, gunakan border yang memudar.
   `border-image: linear-gradient(to right, var(--color-primary), transparent) 1;`

3. **Noise Texture**:
   Opsional: Tambahkan overlay texture noise (opacity 2-3%) di atas background gelap untuk kesan industrial/metal yang lebih kuat.

## Rules
- **Layering**: Jangan menumpuk lebih dari 2 lapisan blur karena akan menurunkan performa (FPS drop) di perangkat mobile lama.
- **Contrast**: Pastikan text di atas panel glass memiliki kontras yang cukup (selalu gunakan text putih/light untuk background gelap).
- **Consistency**: Jangan gunakan border radius yang berbeda-beda dalam satu halaman.

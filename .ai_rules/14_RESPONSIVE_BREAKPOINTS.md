# Responsive Breakpoints

Aplikasi ini wajib mendukung berbagai ukuran layar dengan pendekatan **Mobile-First**.

## Breakpoints (Standard)
- **Mobile**: `< 640px` (Default)
- **Tablet**: `640px - 1024px`
- **Desktop**: `> 1024px`
- **Ultra-Wide**: `> 1536px`

## Implementation Rules
1. **CSS Media Queries**:
   ```css
   /* Mobile Default */
   .container { padding: 1rem; }

   /* Desktop */
   @media (min-width: 1024px) {
     .container { padding: 2rem; }
   }
   ```

2. **Mobile-Specific Tweaks**:
   - **Touch Targets**: Semua tombol minimal berukuran `44x44px`.
   - **Sidebar**: Di mobile, sidebar harus berubah menjadi drawer atau bottom navigation.
   - **Font Size**: Hindari penggunaan font di bawah `12px` agar tetap terbaca.

3. **Scaling Strategy**:
   - Gunakan unit `rem` atau `em` daripada `px` untuk font dan spacing agar mengikuti pengaturan zoom browser.
   - Gunakan `flexbox` dan `grid` untuk layout yang fleksibel.

4. **Digital Receipt Scaling**:
   - Khusus komponen Receipt, gunakan `transform: scale()` atau `container queries` untuk memastikan struk selalu muat di layar mobile tanpa terpotong.

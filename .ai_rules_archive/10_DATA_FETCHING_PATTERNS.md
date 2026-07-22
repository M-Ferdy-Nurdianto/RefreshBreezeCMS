# Data Fetching Patterns

## Standard Fetching (Supabase Client)
Gunakan pola asinkron yang konsisten dengan penanganan error yang jelas.

```javascript
const fetchData = async () => {
  const { data, error } = await supabase
    .from('table_name')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    showToast.error('Gagal mengambil data');
    console.error(error);
    return;
  }
  return data;
};
```

## Realtime Subscriptions
Untuk Dashboard Admin, gunakan channel Realtime untuk mendengarkan perubahan data.

```javascript
const subscription = supabase
  .channel('orders_channel')
  .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, (payload) => {
    console.log('Order baru masuk:', payload.new);
    showToast.success('Pesanan baru diterima!');
    // Update state atau refresh data
  })
  .subscribe();
```

## Rules
1. **Loading States**: Selalu sediakan skeleton atau spinner saat data sedang diambil.
2. **Error Handling**: Gunakan `src/lib/toast.jsx` untuk memberikan feedback visual ke user.
3. **Filtering**: Lakukan filtering di sisi server (Supabase) daripada di sisi client untuk efisiensi memory.
4. **Security**: Jangan pernah melakukan select `*` pada tabel yang mengandung data sensitif jika dikirim ke client publik.

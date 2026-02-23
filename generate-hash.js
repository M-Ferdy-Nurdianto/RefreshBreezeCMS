// Generate bcrypt hash untuk password - Jalankan dari folder backend
// cd backend && node ../generate-hash.js

const bcrypt = require('bcrypt');

const password = 'hijausegar';
const saltRounds = 10;

const run = async () => {
  try {
    const hash = await bcrypt.hash(password, saltRounds);
    console.log('\n=== BCRYPT HASH GENERATED ===');
    console.log('Password:', password);
    console.log('Hash:', hash);
    console.log('\n=== COPY SQL INI KE SUPABASE ===\n');
    console.log(`INSERT INTO admin_users (username, password_hash, full_name) 
VALUES (
  'superadmin',
  '${hash}',
  'Super Admin Refresh Breeze'
)
ON CONFLICT (username) DO UPDATE 
SET password_hash = EXCLUDED.password_hash;`);
    console.log('\n===============================\n');
  } catch (err) {
    console.error('Error:', err);
  }
};

run();

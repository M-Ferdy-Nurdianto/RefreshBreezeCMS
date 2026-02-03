-- Buat Admin User: superadmin
-- Password: hijausegar
-- 
-- Copy dan paste SQL ini di Supabase SQL Editor, lalu RUN
-- Hash bcrypt valid untuk password 'hijausegar':

INSERT INTO admin_users (username, password_hash, full_name) 
VALUES (
  'superadmin',
  '$2b$10$CT/umVetXw27cNT7SoryWOdHcJfT.UvDVAT8z3eJoIyXJzXbk72SO',
  'Super Admin Refresh Breeze'
)
ON CONFLICT (username) DO UPDATE 
SET password_hash = EXCLUDED.password_hash,
    full_name = EXCLUDED.full_name;

-- Verify
SELECT id, username, full_name, created_at 
FROM admin_users 
WHERE username = 'superadmin';

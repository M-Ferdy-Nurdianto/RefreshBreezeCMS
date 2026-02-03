-- Create Admin User untuk Refresh Breeze
-- Username: admin@breeze:superadmin
-- Password: hijausegar

-- CARA TERBAIK: Via API POST (password auto-hashed dengan bcrypt)
-- Jalankan command ini di terminal PowerShell:
-- 
-- Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"username":"admin@breeze:superadmin","password":"hijausegar","full_name":"Super Admin Refresh Breeze"}'
--
-- Atau gunakan Postman/Thunder Client:
-- POST http://localhost:5000/api/auth/register
-- Body JSON:
-- {
--   "username": "admin@breeze:superadmin",
--   "password": "hijausegar",
--   "full_name": "Super Admin Refresh Breeze"
-- }

-- Verify admin created
SELECT id, username, full_name, created_at 
FROM admin_users 
WHERE username = 'admin@breeze:superadmin';

-- Insert Local Admin User
INSERT INTO admin_users (username, password_hash, full_name) 
VALUES (
  'staff123',
  '$2b$10$TjlmVrhJxPqN4MDp1PFuF.Igml6oft49WsvHBtRoMxJajTNGV1Xmy',
  'Local Staff Admin'
)
ON CONFLICT (username) DO UPDATE 
SET password_hash = EXCLUDED.password_hash;

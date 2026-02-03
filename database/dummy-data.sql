-- ============================================
-- DUMMY DATA UNTUK TESTING FILTER
-- ============================================
-- Event 1: Utsuru x November (PO: 10, OTS: 5)
-- Event 2: Chibicon Desember (PO: 10, OTS: 10)
-- Event 3: Idolcon Next (PO: 5, OTS: 10)

-- ============================================
-- INSERT EVENTS & LINK ORDERS TO EVENTS
-- ============================================
INSERT INTO events (nama, tanggal, bulan, tahun, lokasi, event_time, cheki_time, is_past)
VALUES 
  ('Utsuru x Refresh Breeze', 15, 'November', 2025, 'Tulungagung Square', '19:00', '17:00-18:30', true),
  ('Chibicon', 20, 'Desember', 2025, 'Gedung Serbaguna', '14:00', '12:00-13:30', true),
  ('Idolcon 2026', 10, 'Februari', 2026, 'Convention Hall Jakarta', '18:00', '16:00-17:30', false);

-- Get event IDs (will be used in orders)
DO $$
DECLARE
  event_utsuru_id UUID;
  event_chibicon_id UUID;
  event_idolcon_id UUID;
BEGIN
  -- Get event IDs
  SELECT id INTO event_utsuru_id FROM events WHERE nama = 'Utsuru x Refresh Breeze' LIMIT 1;
  SELECT id INTO event_chibicon_id FROM events WHERE nama = 'Chibicon' LIMIT 1;
  SELECT id INTO event_idolcon_id FROM events WHERE nama = 'Idolcon 2026' LIMIT 1;

-- ============================================
-- EVENT 1: UTSURU x NOVEMBER
-- Pre-Order: 10 orders
-- ============================================
INSERT INTO orders (order_number, event_id, nama_lengkap, whatsapp, email, instagram, total_harga, payment_proof_url, status, is_ots, created_by, created_at)
VALUES
  ('RB-UTR-001', event_utsuru_id, 'Budi Santoso', '081234567890', 'budi@email.com', '@budisantoso', 50000, 'https://placeholder.com/payment001.jpg', 'completed', false, 'customer', '2025-11-10 10:00:00+07'),
  ('RB-UTR-002', event_utsuru_id, 'Ani Wijaya', '081234567891', 'ani@email.com', '@aniwijaya', 75000, 'https://placeholder.com/payment002.jpg', 'completed', false, 'customer', '2025-11-10 11:30:00+07'),
  ('RB-UTR-003', event_utsuru_id, 'Citra Dewi', '081234567892', 'citra@email.com', '@citradewi', 50000, 'https://placeholder.com/payment003.jpg', 'completed', false, 'customer', '2025-11-11 09:15:00+07'),
  ('RB-UTR-004', event_utsuru_id, 'Doni Prakoso', '081234567893', 'doni@email.com', '@doniprakoso', 100000, 'https://placeholder.com/payment004.jpg', 'completed', false, 'customer', '2025-11-11 14:20:00+07'),
  ('RB-UTR-005', event_utsuru_id, 'Eka Putri', '081234567894', 'eka@email.com', '@ekaputri', 25000, 'https://placeholder.com/payment005.jpg', 'completed', false, 'customer', '2025-11-12 08:45:00+07'),
  ('RB-UTR-006', event_utsuru_id, 'Fajar Ramadan', '081234567895', 'fajar@email.com', '@fajarr', 75000, 'https://placeholder.com/payment006.jpg', 'completed', false, 'customer', '2025-11-12 16:30:00+07'),
  ('RB-UTR-007', event_utsuru_id, 'Gita Sari', '081234567896', 'gita@email.com', '@gitasari', 25000, 'https://placeholder.com/payment007.jpg', 'completed', false, 'customer', '2025-11-13 10:00:00+07'),
  ('RB-UTR-008', event_utsuru_id, 'Hendra Kusuma', '081234567897', 'hendra@email.com', '@hendrak', 125000, 'https://placeholder.com/payment008.jpg', 'completed', false, 'customer', '2025-11-13 13:15:00+07'),
  ('RB-UTR-009', event_utsuru_id, 'Indah Permata', '081234567898', 'indah@email.com', '@indahpermata', 25000, 'https://placeholder.com/payment009.jpg', 'completed', false, 'customer', '2025-11-14 09:30:00+07'),
  ('RB-UTR-010', event_utsuru_id, 'Joko Widodo', '081234567899', 'joko@email.com', '@jokowid', 50000, 'https://placeholder.com/payment010.jpg', 'completed', false, 'customer', '2025-11-14 15:45:00+07');

-- OTS: 5 orders (no payment proof)
INSERT INTO orders (order_number, event_id, nama_lengkap, whatsapp, email, instagram, total_harga, status, is_ots, created_by, created_at)
VALUES
  ('RB-UTR-OTS01', event_utsuru_id, 'Kiara OTS', '', '', '', 25000, 'completed', true, 'admin', '2025-11-15 17:00:00+07'),
  ('RB-UTR-OTS02', event_utsuru_id, 'Luna OTS', '', '', '', 50000, 'completed', true, 'admin', '2025-11-15 17:15:00+07'),
  ('RB-UTR-OTS03', event_utsuru_id, 'Maya OTS', '', '', '', 25000, 'completed', true, 'admin', '2025-11-15 17:30:00+07'),
  ('RB-UTR-OTS04', event_utsuru_id, 'Nina OTS', '', '', '', 75000, 'completed', true, 'admin', '2025-11-15 17:45:00+07'),
  ('RB-UTR-OTS05', event_utsuru_id, 'Olivia OTS', '', '', '', 25000, 'completed', true, 'admin', '2025-11-15 18:00:00+07');

-- ============================================
-- EVENT 2: CHIBICON DESEMBER
-- Pre-Order: 10 orders
-- ============================================
INSERT INTO orders (order_number, event_id, nama_lengkap, whatsapp, email, instagram, total_harga, payment_proof_url, status, is_ots, created_by, created_at)
VALUES
  ('RB-CHI-001', event_chibicon_id, 'Putri Andini', '081234560001', 'putri@email.com', '@putriandini', 25000, 'https://placeholder.com/paymentCHI01.jpg', 'completed', false, 'customer', '2025-12-15 10:00:00+07'),
  ('RB-CHI-002', event_chibicon_id, 'Qori Rahman', '081234560002', 'qori@email.com', '@qorirahman', 50000, 'https://placeholder.com/paymentCHI02.jpg', 'completed', false, 'customer', '2025-12-15 11:00:00+07'),
  ('RB-CHI-003', event_chibicon_id, 'Rina Safitri', '081234560003', 'rina@email.com', '@rinasafitri', 25000, 'https://placeholder.com/paymentCHI03.jpg', 'completed', false, 'customer', '2025-12-16 09:00:00+07'),
  ('RB-CHI-004', event_chibicon_id, 'Sandi Wijaya', '081234560004', 'sandi@email.com', '@sandiwijaya', 75000, 'https://placeholder.com/paymentCHI04.jpg', 'completed', false, 'customer', '2025-12-16 14:00:00+07'),
  ('RB-CHI-005', event_chibicon_id, 'Tari Lestari', '081234560005', 'tari@email.com', '@tarilestari', 25000, 'https://placeholder.com/paymentCHI05.jpg', 'completed', false, 'customer', '2025-12-17 08:00:00+07'),
  ('RB-CHI-006', event_chibicon_id, 'Umar Hasan', '081234560006', 'umar@email.com', '@umarhasan', 50000, 'https://placeholder.com/paymentCHI06.jpg', 'completed', false, 'customer', '2025-12-17 16:00:00+07'),
  ('RB-CHI-007', event_chibicon_id, 'Vera Amalia', '081234560007', 'vera@email.com', '@veraamalia', 25000, 'https://placeholder.com/paymentCHI07.jpg', 'completed', false, 'customer', '2025-12-18 10:00:00+07'),
  ('RB-CHI-008', event_chibicon_id, 'Wawan Setiawan', '081234560008', 'wawan@email.com', '@wawanset', 100000, 'https://placeholder.com/paymentCHI08.jpg', 'completed', false, 'customer', '2025-12-18 13:00:00+07'),
  ('RB-CHI-009', event_chibicon_id, 'Xena Putri', '081234560009', 'xena@email.com', '@xenaputri', 25000, 'https://placeholder.com/paymentCHI09.jpg', 'completed', false, 'customer', '2025-12-19 09:00:00+07'),
  ('RB-CHI-010', event_chibicon_id, 'Yudi Pratama', '081234560010', 'yudi@email.com', '@yudipratama', 50000, 'https://placeholder.com/paymentCHI10.jpg', 'completed', false, 'customer', '2025-12-19 15:00:00+07');

-- OTS: 10 orders (no payment proof)
INSERT INTO orders (order_number, event_id, nama_lengkap, whatsapp, email, instagram, total_harga, status, is_ots, created_by, created_at)
VALUES
  ('RB-CHI-OTS01', event_chibicon_id, 'Andi OTS', '', '', '', 25000, 'completed', true, 'admin', '2025-12-20 12:00:00+07'),
  ('RB-CHI-OTS02', event_chibicon_id, 'Bima OTS', '', '', '', 50000, 'completed', true, 'admin', '2025-12-20 12:15:00+07'),
  ('RB-CHI-OTS03', event_chibicon_id, 'Candra OTS', '', '', '', 25000, 'completed', true, 'admin', '2025-12-20 12:30:00+07'),
  ('RB-CHI-OTS04', event_chibicon_id, 'Dimas OTS', '', '', '', 75000, 'completed', true, 'admin', '2025-12-20 12:45:00+07'),
  ('RB-CHI-OTS05', event_chibicon_id, 'Edo OTS', '', '', '', 25000, 'completed', true, 'admin', '2025-12-20 13:00:00+07'),
  ('RB-CHI-OTS06', event_chibicon_id, 'Fandi OTS', '', '', '', 50000, 'completed', true, 'admin', '2025-12-20 13:15:00+07'),
  ('RB-CHI-OTS07', event_chibicon_id, 'Gilang OTS', '', '', '', 25000, 'completed', true, 'admin', '2025-12-20 13:30:00+07'),
  ('RB-CHI-OTS08', event_chibicon_id, 'Heri OTS', '', '', '', 75000, 'completed', true, 'admin', '2025-12-20 13:45:00+07'),
  ('RB-CHI-OTS09', event_chibicon_id, 'Irfan OTS', '', '', '', 25000, 'completed', true, 'admin', '2025-12-20 14:00:00+07'),
  ('RB-CHI-OTS10', event_chibicon_id, 'Jaka OTS', '', '', '', 50000, 'completed', true, 'admin', '2025-12-20 14:15:00+07');

-- ============================================
-- EVENT 3: IDOLCON 2026 (NEXT EVENT)
-- Pre-Order: 5 orders
-- ============================================
INSERT INTO orders (order_number, event_id, nama_lengkap, whatsapp, email, instagram, total_harga, payment_proof_url, status, is_ots, created_by, created_at)
VALUES
  ('RB-IDL-001', event_idolcon_id, 'Zahra Amelia', '081234570001', 'zahra@email.com', '@zahraamelia', 25000, 'https://placeholder.com/paymentIDL01.jpg', 'pending', false, 'customer', '2026-02-01 10:00:00+07'),
  ('RB-IDL-002', event_idolcon_id, 'Aji Nugroho', '081234570002', 'aji@email.com', '@ajinugroho', 50000, 'https://placeholder.com/paymentIDL02.jpg', 'checked', false, 'customer', '2026-02-01 14:00:00+07'),
  ('RB-IDL-003', event_idolcon_id, 'Bella Sari', '081234570003', 'bella@email.com', '@bellasari', 25000, 'https://placeholder.com/paymentIDL03.jpg', 'pending', false, 'customer', '2026-02-02 09:00:00+07'),
  ('RB-IDL-004', event_idolcon_id, 'Cahyo Wibowo', '081234570004', 'cahyo@email.com', '@cahyowibowo', 75000, 'https://placeholder.com/paymentIDL04.jpg', 'checked', false, 'customer', '2026-02-02 11:00:00+07'),
  ('RB-IDL-005', event_idolcon_id, 'Diana Putri', '081234570005', 'diana@email.com', '@dianaputri', 25000, 'https://placeholder.com/paymentIDL05.jpg', 'pending', false, 'customer', '2026-02-03 08:00:00+07');

-- OTS: 10 orders (future, status pending karena belum event, no payment proof)
INSERT INTO orders (order_number, event_id, nama_lengkap, whatsapp, email, instagram, total_harga, status, is_ots, created_by, created_at)
VALUES
  ('RB-IDL-OTS01', event_idolcon_id, 'Krisna OTS', '', '', '', 25000, 'pending', true, 'admin', '2026-02-10 16:00:00+07'),
  ('RB-IDL-OTS02', event_idolcon_id, 'Lina OTS', '', '', '', 50000, 'pending', true, 'admin', '2026-02-10 16:15:00+07'),
  ('RB-IDL-OTS03', event_idolcon_id, 'Marta OTS', '', '', '', 25000, 'pending', true, 'admin', '2026-02-10 16:30:00+07'),
  ('RB-IDL-OTS04', event_idolcon_id, 'Nanda OTS', '', '', '', 75000, 'pending', true, 'admin', '2026-02-10 16:45:00+07'),
  ('RB-IDL-OTS05', event_idolcon_id, 'Oscar OTS', '', '', '', 25000, 'pending', true, 'admin', '2026-02-10 17:00:00+07'),
  ('RB-IDL-OTS06', event_idolcon_id, 'Pandu OTS', '', '', '', 50000, 'pending', true, 'admin', '2026-02-10 17:15:00+07'),
  ('RB-IDL-OTS07', event_idolcon_id, 'Qila OTS', '', '', '', 25000, 'pending', true, 'admin', '2026-02-10 17:30:00+07'),
  ('RB-IDL-OTS08', event_idolcon_id, 'Rafi OTS', '', '', '', 75000, 'pending', true, 'admin', '2026-02-10 17:45:00+07'),
  ('RB-IDL-OTS09', event_idolcon_id, 'Sari OTS', '', '', '', 25000, 'pending', true, 'admin', '2026-02-10 18:00:00+07'),
  ('RB-IDL-OTS10', event_idolcon_id, 'Tomi OTS', '', '', '', 50000, 'pending', true, 'admin', '2026-02-10 18:15:00+07');

END $$;

-- ============================================
-- DUMMY ORDER ITEMS
-- Harga sesuai dengan quantity: 25k/item
-- ============================================
DO $$
DECLARE
  first_member_id UUID;
  order_record RECORD;
  item_quantity INT;
BEGIN
  -- Get first member id
  SELECT id INTO first_member_id FROM members LIMIT 1;
  
  -- Insert order_items for all orders (quantity based on total_harga)
  FOR order_record IN 
    SELECT id, order_number, total_harga FROM orders WHERE order_number LIKE 'RB-%' 
  LOOP
    -- Calculate quantity: total_harga / 25000
    item_quantity := (order_record.total_harga / 25000)::INT;
    
    INSERT INTO order_items (order_id, member_id, item_name, price, quantity)
    VALUES 
      (order_record.id, first_member_id, 'Cheki YanYee', 25000, item_quantity);
  END LOOP;
END $$;

-- ============================================
-- SUMMARY
-- ============================================
-- Event 1: Utsuru x November - 10 PO + 5 OTS = 15 total
-- Event 2: Chibicon Desember - 10 PO + 10 OTS = 20 total  
-- Event 3: Idolcon 2026 - 5 PO + 10 OTS = 15 total
-- TOTAL: 50 orders

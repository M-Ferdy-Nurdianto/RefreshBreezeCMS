-- Enable RLS on all tables
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_lineup ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE config ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Allow public read access (SELECT) for frontend displays
CREATE POLICY "Allow public read access" ON members FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON member_gallery FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON events FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON event_lineup FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON event_gallery FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON config FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON faqs FOR SELECT USING (true);

-- Orders: public can insert (to create orders) and select (if they need to see receipt/tracking)
CREATE POLICY "Allow public insert" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select" ON orders FOR SELECT USING (true);

-- Order Items: public can insert and select
CREATE POLICY "Allow public insert" ON order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select" ON order_items FOR SELECT USING (true);

-- Note: admin_users is strictly protected, no public policy.
-- The backend uses the SUPABASE_SERVICE_KEY which automatically bypasses RLS,
-- so all backend admin operations (INSERT/UPDATE/DELETE/SELECT admin_users) will continue to work.

-- Insert Storage Buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
('receipts', 'receipts', true),
('members', 'members', true),
('products', 'products', true)
ON CONFLICT (id) DO NOTHING;

-- Receipts Bucket Policies
-- Allow public to upload receipts (payment proofs)
CREATE POLICY "Allow public upload to receipts" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'receipts');

-- Allow public to read receipts
CREATE POLICY "Allow public read receipts" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'receipts');

-- Members Bucket Policies
-- Allow public to read members images
CREATE POLICY "Allow public read members" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'members');

-- Products Bucket Policies
-- Allow public to read products images
CREATE POLICY "Allow public read products" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'products');

-- Admin backend uses service_role key so it can upload/delete to any bucket.

-- Add CMS fields to members table
ALTER TABLE members ADD COLUMN IF NOT EXISTS color VARCHAR(50) DEFAULT '#079108';
ALTER TABLE members ADD COLUMN IF NOT EXISTS gradient VARCHAR(100);
ALTER TABLE members ADD COLUMN IF NOT EXISTS order_index INT DEFAULT 0;

-- Update existing members with their brand colors and order indices
UPDATE members SET color = '#FBBF24', gradient = 'from-amber-400 to-yellow-500', order_index = 1 WHERE member_id = 'cissi';
UPDATE members SET color = '#3B82F6', gradient = 'from-blue-500 to-blue-600', order_index = 2 WHERE member_id = 'acaa';
UPDATE members SET color = '#6D28D9', gradient = 'from-purple-600 to-indigo-600', order_index = 3 WHERE member_id = 'channie';
UPDATE members SET color = '#2DD4BF', gradient = 'from-teal-400 to-cyan-500', order_index = 4 WHERE member_id = 'cally';
UPDATE members SET color = '#10B981', gradient = 'from-green-400 to-emerald-500', order_index = 5 WHERE member_id = 'sinta';
UPDATE members SET color = '#9E1527', gradient = 'from-red-600 to-rose-800', order_index = 6 WHERE member_id = 'rara';
UPDATE members SET color = '#F472B6', gradient = 'from-pink-400 to-rose-500', order_index = 7 WHERE member_id = 'piya';
UPDATE members SET color = '#079108', gradient = 'from-emerald-500 to-teal-600', order_index = 8 WHERE member_id = 'yanyee';
UPDATE members SET color = '#079108', gradient = 'from-emerald-600 to-teal-700', order_index = 0 WHERE member_id = 'group';

-- Storage policies for members bucket
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' AND policyname = 'Allow authenticated upload members'
    ) THEN
        CREATE POLICY "Allow authenticated upload members" 
        ON storage.objects FOR INSERT 
        WITH CHECK (bucket_id = 'members');
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' AND policyname = 'Allow authenticated update members'
    ) THEN
        CREATE POLICY "Allow authenticated update members" 
        ON storage.objects FOR UPDATE 
        USING (bucket_id = 'members');
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' AND policyname = 'Allow authenticated delete members'
    ) THEN
        CREATE POLICY "Allow authenticated delete members" 
        ON storage.objects FOR DELETE 
        USING (bucket_id = 'members');
    END IF;
END $$;

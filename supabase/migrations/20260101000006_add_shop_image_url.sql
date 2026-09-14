-- Add shop_image_url column to members table for dedicated Cheki shop ticket photos
ALTER TABLE members ADD COLUMN IF NOT EXISTS shop_image_url TEXT;

-- Seed existing member shop photos
UPDATE members SET shop_image_url = '/images/shop/cissi.webp' WHERE member_id = 'cissi';
UPDATE members SET shop_image_url = '/images/shop/aca.webp' WHERE member_id = 'acaa';
UPDATE members SET shop_image_url = '/images/shop/channie.webp' WHERE member_id = 'channie';
UPDATE members SET shop_image_url = '/images/shop/cally.webp' WHERE member_id = 'cally';
UPDATE members SET shop_image_url = '/images/shop/sinta.webp' WHERE member_id = 'sinta';
UPDATE members SET shop_image_url = '/images/shop/rara.webp' WHERE member_id = 'rara';
UPDATE members SET shop_image_url = '/images/shop/piya.webp' WHERE member_id = 'piya';
UPDATE members SET shop_image_url = '/images/shop/yanyee.webp' WHERE member_id = 'yanyee';
UPDATE members SET shop_image_url = '/images/members/group.webp' WHERE member_id = 'group';

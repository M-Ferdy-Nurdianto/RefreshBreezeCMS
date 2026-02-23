-- 1. Tambah kolom ke tabel merchandise
ALTER TABLE merchandise 
ADD COLUMN sizes JSONB DEFAULT '[]',
ADD COLUMN size_chart_urls JSONB DEFAULT '[]';

-- 2. Tambah kolom ke tabel merch_order_items
ALTER TABLE merch_order_items
ADD COLUMN size TEXT;

-- ============================================
-- REFRESH BREEZE - MIGRATION: MERCHANDISE
-- ============================================

-- TABLE: merchandise (produk yang dijual)
CREATE TABLE IF NOT EXISTS merchandise (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nama VARCHAR(255) NOT NULL,
    deskripsi TEXT,
    harga INT NOT NULL,
    stok INT DEFAULT 0,
    gambar_url TEXT,
    available BOOLEAN DEFAULT true,
    urutan INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- TABLE: merch_orders (pesanan merch)
CREATE TABLE IF NOT EXISTS merch_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    nama_lengkap VARCHAR(255),
    whatsapp VARCHAR(100) NOT NULL,
    instagram VARCHAR(100),
    catatan TEXT,
    total_harga INT NOT NULL DEFAULT 0,
    payment_proof_url TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- TABLE: merch_order_items (item per pesanan)
CREATE TABLE IF NOT EXISTS merch_order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    merch_order_id UUID REFERENCES merch_orders(id) ON DELETE CASCADE,
    merchandise_id UUID REFERENCES merchandise(id) ON DELETE SET NULL,
    item_name VARCHAR(255) NOT NULL,
    harga INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_merch_available ON merchandise(available);
CREATE INDEX IF NOT EXISTS idx_merch_orders_status ON merch_orders(status);
CREATE INDEX IF NOT EXISTS idx_merch_orders_created ON merch_orders(created_at DESC);

-- Triggers for updated_at
CREATE TRIGGER update_merchandise_updated_at BEFORE UPDATE ON merchandise
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_merch_orders_updated_at BEFORE UPDATE ON merch_orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

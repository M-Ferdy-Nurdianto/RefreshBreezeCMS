-- ============================================
-- MIGRATION: Add event_id column to orders table
-- Date: 2026-02-03
-- ============================================

-- Add event_id column to orders table
ALTER TABLE orders 
ADD COLUMN event_id UUID REFERENCES events(id) ON DELETE SET NULL;

-- Add index for better query performance
CREATE INDEX idx_orders_event_id ON orders(event_id);

-- Comment for documentation
COMMENT ON COLUMN orders.event_id IS 'Foreign key to events table - links order to specific event';

-- Verify the column was added
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'orders' AND column_name = 'event_id';

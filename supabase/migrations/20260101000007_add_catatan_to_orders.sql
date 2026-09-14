-- Migration: Add catatan column to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS catatan TEXT;

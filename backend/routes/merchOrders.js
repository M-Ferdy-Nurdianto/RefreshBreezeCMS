import express from 'express'
import { supabase } from '../config/supabase.js'
import { authMiddleware } from '../middleware/auth.js'

const router = express.Router()

// ───────────────────────────────────────────
// MERCH ORDERS
// ───────────────────────────────────────────

// GET all merch orders (admin only)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { status, search, dateFrom, dateTo } = req.query

    let query = supabase
      .from('merch_orders')
      .select(`
        *,
        merch_order_items (
          id,
          item_name,
          harga,
          quantity,
          merchandise_id
        )
      `)
      .order('created_at', { ascending: false })

    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    if (search) {
      query = query.or(`nama_lengkap.ilike.%${search}%,whatsapp.ilike.%${search}%,order_number.ilike.%${search}%`)
    }

    if (dateFrom) query = query.gte('created_at', dateFrom)
    if (dateTo) query = query.lte('created_at', dateTo)

    const { data, error } = await query
    if (error) throw error

    res.json({ success: true, data })
  } catch (error) {
    console.error('Error fetching merch orders:', error)
    res.status(500).json({ error: error.message })
  }
})

// GET single merch order (admin only)
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('merch_orders')
      .select(`
        *,
        merch_order_items (
          id,
          item_name,
          harga,
          quantity,
          merchandise_id
        )
      `)
      .eq('id', req.params.id)
      .single()

    if (error) throw error
    res.json({ success: true, data })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// POST create merch order (public)
router.post('/', async (req, res) => {
  try {
    const { nama_lengkap, whatsapp, instagram, catatan, items, payment_proof_url } = req.body

    if (!whatsapp) {
      return res.status(400).json({ error: 'No. WhatsApp wajib diisi' })
    }
    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Tidak ada item di keranjang' })
    }

    const orderNumber = `MERCH${Date.now()}`
    const total_harga = items.reduce((sum, item) => sum + (item.harga * item.quantity), 0)

    const { data: order, error: orderError } = await supabase
      .from('merch_orders')
      .insert({
        order_number: orderNumber,
        nama_lengkap: nama_lengkap || null,
        whatsapp,
        instagram: instagram || null,
        catatan: catatan || null,
        total_harga,
        payment_proof_url: payment_proof_url || null,
        status: 'pending'
      })
      .select()
      .single()

    if (orderError) throw orderError

    // Insert order items
    const orderItems = items.map(item => ({
      merch_order_id: order.id,
      merchandise_id: item.merchandise_id || null,
      item_name: item.nama,
      harga: item.harga,
      quantity: item.quantity
    }))

    const { error: itemsError } = await supabase
      .from('merch_order_items')
      .insert(orderItems)

    if (itemsError) throw itemsError

    // Update stock if available
    for (const item of items) {
      if (item.merchandise_id) {
        const { data: merch } = await supabase
          .from('merchandise')
          .select('stok')
          .eq('id', item.merchandise_id)
          .single()

        if (merch && merch.stok > 0) {
          const newStok = Math.max(0, merch.stok - item.quantity)
          await supabase
            .from('merchandise')
            .update({ stok: newStok })
            .eq('id', item.merchandise_id)
        }
      }
    }

    res.json({ success: true, order })
  } catch (error) {
    console.error('Error creating merch order:', error)
    res.status(500).json({ error: error.message })
  }
})

// PATCH update merch order status (admin only)
router.patch('/:id/status', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body

    const validStatuses = ['pending', 'checked', 'completed', 'cancelled']
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Status tidak valid' })
    }

    const { data, error } = await supabase
      .from('merch_orders')
      .update({ status })
      .eq('id', req.params.id)
      .select()
      .single()

    if (error) throw error
    res.json({ success: true, data })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// DELETE merch order (admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { error } = await supabase
      .from('merch_orders')
      .delete()
      .eq('id', req.params.id)

    if (error) throw error
    res.json({ success: true, message: 'Merch order berhasil dihapus' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router

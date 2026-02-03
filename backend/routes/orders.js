import express from 'express'
import { supabase } from '../config/supabase.js'
import { authMiddleware } from '../middleware/auth.js'
import ExcelJS from 'exceljs'

const router = express.Router()

// GET: Fetch all orders with filters
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { status, dateFrom, dateTo, search, is_ots, event_id } = req.query

    console.log('📊 Orders filter params:', { status, is_ots, event_id, search, dateFrom, dateTo })

    let query = supabase
      .from('orders')
      .select(`
        *,
        order_items (
          id,
          item_name,
          price,
          quantity,
          member_id
        )
      `)
      .order('created_at', { ascending: false })

    // Filter by status
    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    // Filter by OTS
    if (is_ots !== undefined && is_ots !== 'all') {
      query = query.eq('is_ots', is_ots === 'true')
    }

    // Filter by event_id
    if (event_id && event_id !== 'all') {
      console.log('🎯 Filtering by event_id:', event_id)
      query = query.eq('event_id', event_id)
    }

    // Filter by date range
    if (dateFrom) {
      query = query.gte('created_at', dateFrom)
    }
    if (dateTo) {
      query = query.lte('created_at', dateTo)
    }

    // Search by name, email, or order number
    if (search) {
      query = query.or(`nama_lengkap.ilike.%${search}%,email.ilike.%${search}%,order_number.ilike.%${search}%`)
    }

    const { data, error } = await query

    if (error) throw error

    console.log('✅ Orders fetched:', data?.length || 0, 'orders')

    res.json({ success: true, data })
  } catch (error) {
    console.error('Error fetching orders:', error)
    res.status(500).json({ error: error.message })
  }
})

// GET: Fetch single order by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params

    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          id,
          item_name,
          price,
          quantity,
          member_id
        )
      `)
      .eq('id', id)
      .single()

    if (error) throw error

    res.json({ success: true, data })
  } catch (error) {
    console.error('Error fetching order:', error)
    res.status(500).json({ error: error.message })
  }
})

// POST: Create new order (from customer)
router.post('/', async (req, res) => {
  try {
    const { event_id, nama_lengkap, kontak, items, payment_proof_url } = req.body

    // Validate event_id
    if (!event_id) {
      return res.status(400).json({ error: 'Event ID is required' })
    }

    // Generate order number
    const orderNumber = `RB${Date.now()}`

    // Generate auto email from timestamp
    const autoEmail = `order-${Date.now()}@refreshbreeze.com`

    // Determine if kontak is phone or instagram
    const isPhone = /^[0-9+\-\s()]+$/.test(kontak)
    const whatsapp = isPhone ? kontak : '-'
    const instagram = !isPhone ? kontak : '-'

    // Calculate total
    const total_harga = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)

    // Insert order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        event_id,
        nama_lengkap,
        whatsapp,
        email: autoEmail,
        instagram,
        total_harga,
        payment_proof_url,
        status: 'pending',
        created_by: 'customer'
      })
      .select()
      .single()

    if (orderError) throw orderError

    // Insert order items
    const orderItems = items.map(item => {
      // Handle group member (member_id is string "group" not UUID)
      const memberId = (item.member_id === 'group' || typeof item.member_id === 'string' && !item.member_id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i))
        ? null
        : item.member_id

      return {
        order_id: order.id,
        member_id: memberId,
        item_name: item.name,
        price: item.price,
        quantity: item.quantity
      }
    })

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) throw itemsError

    res.json({ success: true, order })
  } catch (error) {
    console.error('Error creating order:', error)
    res.status(500).json({ error: error.message })
  }
})

// POST: Create OTS (On The Spot) order by admin
router.post('/ots', authMiddleware, async (req, res) => {
  try {
    const { event_id, nama_lengkap, whatsapp, email, instagram, items } = req.body

    if (!event_id) {
      return res.status(400).json({ error: 'Event ID is required' })
    }

    const orderNumber = `RB-OTS${Date.now()}`
    const total_harga = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        event_id,
        nama_lengkap,
        whatsapp: whatsapp || '-',
        email: email || `ots-${Date.now()}@refreshbreeze.com`,
        instagram: instagram || '-',
        total_harga,
        status: 'completed',
        is_ots: true,
        created_by: 'admin'
      })
      .select()
      .single()

    if (orderError) throw orderError

    // Handle group member ID (convert to NULL if not valid UUID)
    const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    const orderItems = items.map(item => {
      const memberId = (item.member_id === 'group' || !UUID_REGEX.test(item.member_id))
        ? null
        : item.member_id
      
      return {
        order_id: order.id,
        member_id: memberId,
        item_name: item.name,
        price: item.price,
        quantity: item.quantity
      }
    })

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) throw itemsError

    res.json({ success: true, order })
  } catch (error) {
    console.error('Error creating OTS order:', error)
    res.status(500).json({ error: error.message })
  }
})

// PATCH: Update order status
router.patch('/:id/status', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body

    if (!['pending', 'checked', 'completed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' })
    }

    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    res.json({ success: true, data })
  } catch (error) {
    console.error('Error updating order status:', error)
    res.status(500).json({ error: error.message })
  }
})

// GET: Export orders to Excel
router.get('/export/excel', authMiddleware, async (req, res) => {
  try {
    const { dateFrom, dateTo, status, is_ots, search, event_id } = req.query

    let query = supabase
      .from('orders')
      .select(`
        *,
        order_items (
          item_name,
          price,
          quantity
        )
      `)
      .order('created_at', { ascending: false })

    // Apply same filters as GET /orders
    if (status && status !== 'all') query = query.eq('status', status)
    if (is_ots !== undefined && is_ots !== 'all') query = query.eq('is_ots', is_ots === 'true')
    if (event_id && event_id !== 'all') query = query.eq('event_id', event_id)
    if (dateFrom) query = query.gte('created_at', dateFrom)
    if (dateTo) query = query.lte('created_at', dateTo)
    if (search) query = query.or(`nama_lengkap.ilike.%${search}%,email.ilike.%${search}%,order_number.ilike.%${search}%`)

    const { data: orders, error } = await query

    if (error) throw error

    // Create Excel workbook
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('Orders')

    // Define columns
    worksheet.columns = [
      { header: 'Order Number', key: 'order_number', width: 20 },
      { header: 'Tipe', key: 'tipe', width: 12 },
      { header: 'Nama Lengkap', key: 'nama_lengkap', width: 25 },
      { header: 'WhatsApp', key: 'whatsapp', width: 15 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Instagram', key: 'instagram', width: 20 },
      { header: 'Items', key: 'items', width: 40 },
      { header: 'Total Harga', key: 'total_harga', width: 15 },
      { header: 'Status', key: 'status', width: 12 },
      { header: 'Tanggal Order', key: 'created_at', width: 20 },
    ]

    // Add rows
    orders.forEach(order => {
      const itemsText = order.order_items
        .map(item => `${item.item_name} (${item.quantity}x)`)
        .join(', ')

      worksheet.addRow({
        order_number: order.order_number,
        tipe: order.is_ots ? 'OTS' : 'Pre-Order',
        nama_lengkap: order.nama_lengkap,
        whatsapp: order.whatsapp,
        email: order.email,
        instagram: order.instagram || '-',
        items: itemsText,
        total_harga: order.total_harga,
        status: order.status,
        created_at: new Date(order.created_at).toLocaleString('id-ID'),
      })
    })

    // Style header row
    worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } }
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF079108' }
    }
    worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' }

    // Add borders to all cells
    worksheet.eachRow((row, rowNumber) => {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        }
        // Center align status and tipe columns
        if (rowNumber > 1) {
          cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true }
        }
      })
    })

    // Calculate total revenue
    const totalRevenue = orders.reduce((sum, order) => sum + (order.total_harga || 0), 0)
    const totalOrders = orders.length

    // Add summary section
    worksheet.addRow([]) // Empty row
    const summaryStartRow = worksheet.rowCount + 1
    
    worksheet.addRow(['RINGKASAN', '', '', '', '', '', '', '', '', ''])
    worksheet.addRow(['Total Orders:', totalOrders, '', '', '', '', '', '', '', ''])
    worksheet.addRow(['Total Pendapatan:', `Rp ${totalRevenue.toLocaleString('id-ID')}`, '', '', '', '', '', '', '', ''])

    // Style summary section
    const summaryHeaderRow = worksheet.getRow(summaryStartRow)
    summaryHeaderRow.font = { bold: true, size: 12 }
    summaryHeaderRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE8F5E9' }
    }

    // Bold summary labels
    worksheet.getRow(summaryStartRow + 1).getCell(1).font = { bold: true }
    worksheet.getRow(summaryStartRow + 2).getCell(1).font = { bold: true }
    worksheet.getRow(summaryStartRow + 2).getCell(2).font = { bold: true, color: { argb: 'FF079108' }, size: 12 }

    // Set response headers
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=RefreshBreeze_Orders_${Date.now()}.xlsx`
    )

    // Write to response
    await workbook.xlsx.write(res)
    res.end()
  } catch (error) {
    console.error('Error exporting to Excel:', error)
    res.status(500).json({ error: error.message })
  }
})

// DELETE: Delete order
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params

    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', id)

    if (error) throw error

    res.json({ success: true, message: 'Order deleted' })
  } catch (error) {
    console.error('Error deleting order:', error)
    res.status(500).json({ error: error.message })
  }
})

// DELETE: Bulk delete orders with filters
router.post('/bulk-delete', authMiddleware, async (req, res) => {
  try {
    const { deleteType, eventId, weeks, months } = req.body
    
    console.log('🗑️ Bulk delete request:', { deleteType, eventId, weeks, months })

    let query = supabase.from('orders').select('id')

    // Apply filters based on delete type
    if (deleteType === 'event' && eventId) {
      query = query.eq('event_id', eventId)
    } else if (deleteType === 'weeks' && weeks) {
      const weeksAgo = new Date()
      weeksAgo.setDate(weeksAgo.getDate() - (weeks * 7))
      query = query.gte('created_at', weeksAgo.toISOString())
    } else if (deleteType === 'months' && months) {
      const monthsAgo = new Date()
      monthsAgo.setMonth(monthsAgo.getMonth() - months)
      query = query.gte('created_at', monthsAgo.toISOString())
    } else if (deleteType !== 'all') {
      return res.status(400).json({ error: 'Invalid delete type' })
    }

    // Get orders to delete
    const { data: ordersToDelete, error: selectError } = await query
    
    if (selectError) throw selectError

    if (!ordersToDelete || ordersToDelete.length === 0) {
      return res.json({ success: true, message: 'No orders to delete', count: 0 })
    }

    const orderIds = ordersToDelete.map(o => o.id)

    // Delete order_items first (foreign key constraint)
    const { error: itemsError } = await supabase
      .from('order_items')
      .delete()
      .in('order_id', orderIds)

    if (itemsError) throw itemsError

    // Delete orders
    const { error: ordersError } = await supabase
      .from('orders')
      .delete()
      .in('id', orderIds)

    if (ordersError) throw ordersError

    console.log(`✅ Deleted ${ordersToDelete.length} orders`)

    res.json({ 
      success: true, 
      message: `Successfully deleted ${ordersToDelete.length} orders`,
      count: ordersToDelete.length 
    })
  } catch (error) {
    console.error('Error bulk deleting orders:', error)
    res.status(500).json({ error: error.message })
  }
})

export default router

import express from 'express'
import { supabase } from '../config/supabase.js'
import { authMiddleware } from '../middleware/auth.js'

const router = express.Router()

// GET: Fetch all members
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('members')
      .select(`
        *,
        member_gallery (
          id,
          image_url
        )
      `)
      .order('created_at', { ascending: true })

    if (error) throw error

    res.json({ success: true, data })
  } catch (error) {
    console.error('Error fetching members:', error)
    res.status(500).json({ error: error.message })
  }
})

// GET: Fetch single member by member_id
router.get('/:member_id', async (req, res) => {
  try {
    const { member_id } = req.params

    const { data, error } = await supabase
      .from('members')
      .select(`
        *,
        member_gallery (
          id,
          image_url
        )
      `)
      .eq('member_id', member_id)
      .single()

    if (error) throw error

    res.json({ success: true, data })
  } catch (error) {
    console.error('Error fetching member:', error)
    res.status(500).json({ error: error.message })
  }
})

// POST: Create new member (admin only)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { member_id, nama_panggung, tagline, hadir, image_url, jikoshoukai, tanggal_lahir, hobi, instagram } = req.body

    const { data, error } = await supabase
      .from('members')
      .insert({
        member_id,
        nama_panggung,
        tagline,
        hadir,
        image_url,
        jikoshoukai,
        tanggal_lahir,
        hobi,
        instagram
      })
      .select()
      .single()

    if (error) throw error

    res.json({ success: true, data })
  } catch (error) {
    console.error('Error creating member:', error)
    res.status(500).json({ error: error.message })
  }
})

// PATCH: Update member
router.patch('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params
    const updates = req.body

    const { data, error } = await supabase
      .from('members')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    res.json({ success: true, data })
  } catch (error) {
    console.error('Error updating member:', error)
    res.status(500).json({ error: error.message })
  }
})

// DELETE: Delete member
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params

    const { error } = await supabase
      .from('members')
      .delete()
      .eq('id', id)

    if (error) throw error

    res.json({ success: true, message: 'Member deleted' })
  } catch (error) {
    console.error('Error deleting member:', error)
    res.status(500).json({ error: error.message })
  }
})

export default router

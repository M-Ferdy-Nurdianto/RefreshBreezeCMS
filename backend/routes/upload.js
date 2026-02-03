import express from 'express'
import multer from 'multer'
import sharp from 'sharp'
import { uploadToSupabaseStorage } from '../config/googleDrive.js'

const router = express.Router()

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit (before compression)
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Only image files are allowed'))
    }
  }
})

// POST: Upload payment proof to Supabase Storage with auto-compression
router.post('/payment-proof', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    console.log('📸 Original file:', {
      name: req.file.originalname,
      size: `${(req.file.size / 1024).toFixed(2)} KB`,
      mimetype: req.file.mimetype
    })

    // Compress image using sharp
    const compressedBuffer = await sharp(req.file.buffer)
      .resize(1920, 1920, { // Max 1920x1920, maintain aspect ratio
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality: 80, progressive: true }) // Convert to JPEG with 80% quality
      .toBuffer()

    console.log('✅ Compressed:', {
      originalSize: `${(req.file.size / 1024).toFixed(2)} KB`,
      compressedSize: `${(compressedBuffer.length / 1024).toFixed(2)} KB`,
      reduction: `${(((req.file.size - compressedBuffer.length) / req.file.size) * 100).toFixed(1)}%`
    })

    const fileName = `payment_${Date.now()}_${req.file.originalname.replace(/\.[^/.]+$/, '')}.jpg`
    const result = await uploadToSupabaseStorage(
      compressedBuffer,
      fileName,
      'image/jpeg'
    )

    res.json({
      success: true,
      data: {
        fileId: result.fileId,
        url: result.url,
        originalSize: req.file.size,
        compressedSize: compressedBuffer.length
      }
    })
  } catch (error) {
    console.error('Error uploading file:', error)
    res.status(500).json({ error: error.message })
  }
})

export default router

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

// Multer error handler middleware
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Max 10MB allowed.' })
    }
    return res.status(400).json({ error: `Upload error: ${err.message}` })
  } else if (err) {
    return res.status(400).json({ error: err.message })
  }
  next()
}

// POST: Upload payment proof to Supabase Storage with auto-compression
router.post('/payment-proof', upload.single('file'), handleMulterError, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded. Please select an image file.',
        debug: {
          contentType: req.headers['content-type'],
          bodyKeys: Object.keys(req.body || {})
        }
      })
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
    res.status(500).json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    })
  }
})

// POST: Upload merch image to Supabase Storage with auto-compression
router.post('/merch-image', upload.single('file'), handleMulterError, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded.' })
    }

    console.log('🛍️ Merch image upload:', {
      name: req.file.originalname,
      size: `${(req.file.size / 1024).toFixed(2)} KB`,
      mimetype: req.file.mimetype
    })

    // Compress image
    const compressedBuffer = await sharp(req.file.buffer)
      .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 85, progressive: true })
      .toBuffer()

    console.log('✅ Merch image compressed:', {
      originalSize: `${(req.file.size / 1024).toFixed(2)} KB`,
      compressedSize: `${(compressedBuffer.length / 1024).toFixed(2)} KB`,
    })

    const fileName = `merch_${Date.now()}_${req.file.originalname.replace(/\.[^/.]+$/, '')}.jpg`
    const result = await uploadToSupabaseStorage(
      compressedBuffer,
      fileName,
      'image/jpeg'
    )

    res.json({
      success: true,
      data: { url: result.url }
    })
  } catch (error) {
    console.error('Error uploading merch image:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

export default router


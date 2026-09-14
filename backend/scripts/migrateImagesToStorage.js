import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { supabase } from '../config/supabase.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const publicImagesDir = path.resolve(__dirname, '../../frontend/public/images')

const mimeTypes = {
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg'
}

async function uploadFile(filePath, remoteKey) {
  const fileBuffer = fs.readFileSync(filePath)
  const ext = path.extname(filePath).toLowerCase()
  const contentType = mimeTypes[ext] || 'application/octet-stream'

  const { data, error } = await supabase.storage
    .from('members')
    .upload(remoteKey, fileBuffer, {
      contentType,
      upsert: true
    })

  if (error) {
    console.error(`Error uploading ${remoteKey}:`, error.message)
    return null
  }

  const { data: publicUrlData } = supabase.storage
    .from('members')
    .getPublicUrl(remoteKey)

  return publicUrlData.publicUrl
}

async function getAllFiles(dir, baseDir = dir) {
  let results = []
  const list = fs.readdirSync(dir)
  for (const item of list) {
    const fullPath = path.join(dir, item)
    const stat = fs.statSync(fullPath)
    if (stat.isDirectory()) {
      results = results.concat(await getAllFiles(fullPath, baseDir))
    } else {
      if (item !== '.gitkeep') {
        const relPath = path.relative(baseDir, fullPath).replace(/\\/g, '/')
        results.push({ fullPath, relPath })
      }
    }
  }
  return results
}

async function run() {
  console.log('=== Step 1: Uploading Images to Supabase Storage (bucket: members) ===')
  const files = await getAllFiles(publicImagesDir)
  console.log(`Found ${files.length} image files to upload.`)

  const urlMap = new Map() // relPath (e.g. 'members/cissi.webp') -> publicUrl

  for (const file of files) {
    const remoteKey = file.relPath
    process.stdout.write(`Uploading: ${remoteKey}... `)
    const publicUrl = await uploadFile(file.fullPath, remoteKey)
    if (publicUrl) {
      console.log('OK')
      urlMap.set(`/images/${remoteKey}`, publicUrl)
    }
  }

  console.log('\n=== Step 2: Updating members table in DB with Supabase Storage URLs ===')
  const { data: members, error: memErr } = await supabase.from('members').select('*')
  if (memErr) {
    console.error('Error fetching members:', memErr)
  } else {
    for (const m of members) {
      const updates = {}
      if (m.image_url && urlMap.has(m.image_url)) {
        updates.image_url = urlMap.get(m.image_url)
      }
      if (m.shop_image_url && urlMap.has(m.shop_image_url)) {
        updates.shop_image_url = urlMap.get(m.shop_image_url)
      }

      if (Object.keys(updates).length > 0) {
        const { error: updErr } = await supabase
          .from('members')
          .update(updates)
          .eq('id', m.id)
        if (updErr) {
          console.error(`Failed to update member ${m.member_id}:`, updErr.message)
        } else {
          console.log(`Updated member ${m.member_id} (${m.nama_panggung}) with Supabase Storage URLs.`)
        }
      }
    }
  }

  console.log('\n=== Step 3: Updating member_gallery table in DB ===')
  const { data: galleries, error: galErr } = await supabase.from('member_gallery').select('*')
  if (galErr) {
    console.error('Error fetching member_gallery:', galErr)
  } else {
    for (const g of galleries) {
      if (g.image_url && urlMap.has(g.image_url)) {
        const newUrl = urlMap.get(g.image_url)
        const { error: updErr } = await supabase
          .from('member_gallery')
          .update({ image_url: newUrl })
          .eq('id', g.id)
        if (updErr) {
          console.error(`Failed to update gallery ${g.id}:`, updErr.message)
        } else {
          console.log(`Updated gallery ${g.id} -> ${newUrl}`)
        }
      }
    }
  }

  console.log('\n=== Step 4: Updating hero_settings config in DB ===')
  const { data: configRow, error: cfgErr } = await supabase.from('config').select('*').eq('key', 'hero_settings').single()
  if (cfgErr) {
    console.error('Error fetching config hero_settings:', cfgErr)
  } else if (configRow?.value) {
    let hero = typeof configRow.value === 'string' 
      ? JSON.parse(configRow.value) 
      : configRow.value

    if (Array.isArray(hero.members)) {
      let changed = false
      hero.members = hero.members.map(hm => {
        if (hm.photo) {
          const cleanPhotoPath = hm.photo.split('?')[0] // remove ?v=33
          if (urlMap.has(cleanPhotoPath)) {
            hm.photo = urlMap.get(cleanPhotoPath)
            changed = true
          }
        }
        return hm
      })

      if (changed) {
        const { error: cfgUpdErr } = await supabase
          .from('config')
          .update({ value: JSON.stringify(hero) })
          .eq('key', 'hero_settings')
        if (cfgUpdErr) {
          console.error('Error updating config hero_settings:', cfgUpdErr.message)
        } else {
          console.log('Updated config.hero_settings with Supabase Storage URLs.')
        }
      }
    }
  }

  console.log('\n=== DONE: All photos successfully uploaded and DB references updated! ===')
  process.exit(0)
}

run().catch(err => {
  console.error('Fatal error during migration:', err)
  process.exit(1)
})

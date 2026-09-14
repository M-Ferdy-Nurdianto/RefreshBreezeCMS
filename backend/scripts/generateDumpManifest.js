import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const dumpDir = path.resolve(__dirname, '../../dump')

const mapping = {
  version: '1.0.0',
  description: 'Manifest pemetaan dan deskripsi fungsi seluruh file asset foto di folder dump untuk upload otomatis ke Supabase Storage (bucket: members) dan pembaruan database RB Remake.',
  target_bucket: 'members',
  stats: {
    total_files: 0,
    categories: {}
  },
  assets: []
}

// 1. Members profile & group
const memberFiles = fs.readdirSync(path.join(dumpDir, 'members')).filter(f => f.endsWith('.webp') || f.endsWith('.svg'))
for (const file of memberFiles) {
  const name = path.parse(file).name
  let usage = ''
  let target_table = 'members'
  let target_column = 'image_url'
  let target_id = name

  if (file === 'placeholder.svg') {
    usage = 'Default fallback image untuk member atau produk yang belum memiliki foto'
    target_table = null
    target_column = null
    target_id = null
  } else if (file === 'group.webp') {
    usage = 'Foto profil bersama / Group Profile Refresh Breeze'
    target_id = 'group'
  } else {
    usage = `Foto profil utama member: ${name} (tampil di halaman Member Profile dan Card)`
  }

  mapping.assets.push({
    file_name: file,
    relative_path: `dump/members/${file}`,
    storage_path: `members/${file}`,
    content_type: file.endsWith('.svg') ? 'image/svg+xml' : 'image/webp',
    category: 'member_profile',
    purpose: usage,
    db_mapping: target_table ? {
      table: target_table,
      column: target_column,
      match_column: 'member_id',
      match_value: target_id
    } : null
  })
}

// 2. Shop 2-shot Cheki
const shopFiles = fs.readdirSync(path.join(dumpDir, 'shop')).filter(f => f.endsWith('.webp'))
for (const file of shopFiles) {
  const name = path.parse(file).name
  mapping.assets.push({
    file_name: file,
    relative_path: `dump/shop/${file}`,
    storage_path: `shop/${file}`,
    content_type: 'image/webp',
    category: 'shop_cheki_card',
    purpose: `Foto kartu tiket 2-Shot Cheki member: ${name} (tampil di halaman Shop / Katalog Cheki)`,
    db_mapping: {
      table: 'members',
      column: 'shop_image_url',
      match_column: 'member_id',
      match_value: name
    }
  })
}

// 3. Hero Slides
const heroFiles = fs.readdirSync(path.join(dumpDir, 'hero')).filter(f => f.endsWith('.webp'))
for (const file of heroFiles) {
  const name = path.parse(file).name
  mapping.assets.push({
    file_name: file,
    relative_path: `dump/hero/${file}`,
    storage_path: `hero/${file}`,
    content_type: 'image/webp',
    category: 'hero_slide',
    purpose: `Foto carousel Hero Banner di Beranda untuk member: ${name}`,
    db_mapping: {
      table: 'config',
      key: 'hero_settings',
      match_member_id: name
    }
  })
}

// 4. Gallery files
function getGalleryFiles(dir, base) {
  let list = []
  const entries = fs.readdirSync(dir)
  for (const entry of entries) {
    const full = path.join(dir, entry)
    if (fs.statSync(full).isDirectory()) {
      list = list.concat(getGalleryFiles(full, base))
    } else if (entry.endsWith('.webp')) {
      list.push(path.relative(base, full).replace(/\\/g, '/'))
    }
  }
  return list
}

const galFiles = getGalleryFiles(path.join(dumpDir, 'gallery'), path.join(dumpDir, 'gallery'))
for (const rel of galFiles) {
  const parts = rel.split('/')
  const subFolder = parts[0]
  mapping.assets.push({
    file_name: path.basename(rel),
    relative_path: `dump/gallery/${rel}`,
    storage_path: `gallery/${rel}`,
    content_type: 'image/webp',
    category: 'member_gallery',
    purpose: `Foto Galeri koleksi foto untuk kategori/member: ${subFolder}`,
    db_mapping: {
      table: 'member_gallery',
      column: 'image_url',
      tag: subFolder
    }
  })
}

mapping.stats.total_files = mapping.assets.length
mapping.assets.forEach(a => {
  mapping.stats.categories[a.category] = (mapping.stats.categories[a.category] || 0) + 1
})

const outputPath = path.join(dumpDir, 'manifest.json')
fs.writeFileSync(outputPath, JSON.stringify(mapping, null, 2), 'utf-8')
console.log(`Manifest created successfully at ${outputPath} with ${mapping.stats.total_files} items.`)

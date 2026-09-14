import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import fs from 'fs'
import path from 'path'

// Middleware to serve static public member landing pages (/aca/, /cally/, etc.)
const staticMemberLandingPlugin = () => ({
  name: 'static-member-landing-plugin',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      const url = req.url ? req.url.split('?')[0] : ''
      const memberFolders = ['aca', 'cally', 'channie', 'cissi', 'piya', 'rara', 'sinta', 'yanyee']
      const matched = memberFolders.find(f => url === `/${f}` || url === `/${f}/`)
      if (matched) {
        const filePath = path.join(__dirname, 'public', matched, 'index.html')
        if (fs.existsSync(filePath)) {
          res.statusCode = 200
          res.setHeader('Content-Type', 'text/html')
          return res.end(fs.readFileSync(filePath, 'utf-8'))
        }
      }
      next()
    })
  }
})

export default defineConfig({
  base: '/',
  plugins: [
    staticMemberLandingPlugin(),
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['images/logos/logo.webp'],
      manifest: {
        name: 'Refresh Breeze Official',
        short_name: 'RB Official',
        description: 'Official website of Refresh Breeze Idol Group',
        theme_color: '#079108',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'images/logos/logo.webp',
            sizes: '192x192',
            type: 'image/webp',
            purpose: 'any maskable'
          },
          {
            src: 'images/logos/logo.webp',
            sizes: '512x512',
            type: 'image/webp',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ],
  server: {
    host: true,
    allowedHosts: true,
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  }
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'FlashLingo',
        short_name: 'FlashLingo',
        start_url: '/',
        display: 'standalone',
        orientation: 'portrait-primary',
        background_color: '#18181b',
        theme_color: '#2563eb',
        description: 'Learn English vocabulary with interactive flashcards.',
        icons: [
          {
            src: '/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: ['any', 'maskable']
          },
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: ['any', 'maskable']
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,webp,mp3}'],
      },
      devOptions: {
        enabled: true
      }
    })
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    host: '0.0.0.0',
    port: 5174,
    strictPort: true,
    hmr: {
      host: '0.0.0.0',
      port: 5173,
      protocol: 'ws'
    },
    watch: {
      usePolling: true
    }
  }
})

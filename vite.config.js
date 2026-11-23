import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
  },
  build: {
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
    // Disable source maps in production for smaller bundles
    sourcemap: false,
    // Use esbuild for minification (faster than terser, no extra dependency)
    minify: 'esbuild',
    rollupOptions: {
      output: {
        // Manual chunk splitting for better caching
        manualChunks: {
          // Separate React core libraries
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],

          // Separate large chart library (1.2MB)
          'recharts-vendor': ['recharts'],

          // Separate icon library (649KB)
          'icons-vendor': ['lucide-react'],

          // Group utility libraries
          'utils-vendor': ['clsx', 'tailwind-merge'],
        },
        // Optimize asset file names
        assetFileNames: (assetInfo) => {
          const name = assetInfo.fileName || assetInfo['name'] || '';
          if (/\.(woff2?|ttf|otf|eot)$/i.test(name)) {
            return `assets/fonts/[name]-[hash][extname]`;
          }
          if (/\.(png|jpe?g|svg|gif|webp|avif)$/i.test(name)) {
            return `assets/images/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
      },
    },
    // CSS code splitting
    cssCodeSplit: true,
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
  // Esbuild options for better minification
  esbuild: {
    drop: ['console', 'debugger'], // Remove console.logs and debuggers in production
  },
})

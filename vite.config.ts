import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  // Deployments under a sub-path (GitHub Pages project sites) set BASE_PATH, e.g. /data-systems-lab/.
  base: process.env.BASE_PATH ?? '/',
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    include: ['src/**/*.test.{ts,tsx}', 'scripts/**/*.test.ts'],
    // Script tests spawn node and git; they need real file URLs, not jsdom's.
    environmentMatchGlobs: [['scripts/**', 'node']],
  },
})

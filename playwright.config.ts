import { defineConfig, devices } from '@playwright/test'

const base = process.env.BASE_PATH ?? '/'
// Its own port, so the tests run while a preview server (4173) is up.
const port = 4174

export default defineConfig({
  testDir: 'e2e',
  fullyParallel: true,
  reporter: 'list',
  use: { baseURL: `http://127.0.0.1:${port}` },
  webServer: {
    command: `PORT=${port} node scripts/serve-dist.mjs`,
    url: `http://127.0.0.1:${port}${base}`,
    reuseExistingServer: false,
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
})

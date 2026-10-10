const fs = require('fs');
const path = require('path');

const configContent = `import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e-tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1, // Single worker locally for zero CPU lag and smooth video playback
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    video: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: true,
  },
});
`;

const targetPath = path.join(__dirname, '../../../frontend/playwright.config.ts');
fs.writeFileSync(targetPath, configContent, 'utf8');
console.log('Successfully updated playwright.config.ts with speed optimizations!');

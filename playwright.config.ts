import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;
const baseURL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: "list",
  use: {
    baseURL,
    trace: "retain-on-failure",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],
  webServer: {
    command: `rm -f cms.test.db cms.test.db-shm cms.test.db-wal && DB_PATH=cms.test.db PORT=${PORT} bun index.tsx`,
    url: `${baseURL}/login`,
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
});

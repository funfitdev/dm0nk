import { defineConfig, devices } from "@playwright/test";
import { readFileSync } from "node:fs";

// Bun auto-loads .env, but Playwright's TS config loader runs under Node.
// Read .env manually so TEST_DATABASE_URL is available here.
try {
  const env = readFileSync(".env", "utf8");
  for (const line of env.split("\n")) {
    const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)\s*$/i);
    if (!m) continue;
    const [, key, rawVal] = m;
    if (process.env[key]) continue;
    const val = rawVal.replace(/^["'](.*)["']$/, "$1");
    process.env[key] = val;
  }
} catch {
  // .env is optional
}

const testDbUrl = process.env.TEST_DATABASE_URL;
if (!testDbUrl) {
  throw new Error("TEST_DATABASE_URL must be set in .env");
}

const PORT = 3100;
const baseURL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./tests",
  testIgnore: ["**/global-setup.ts", "**/reset-test-db.ts"],
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: "list",
  globalSetup: "./tests/global-setup.ts",
  use: {
    baseURL,
    trace: "retain-on-failure",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],
  webServer: {
    command: `bun index.tsx`,
    cwd: ".",
    env: {
      ...process.env,
      DATABASE_URL: testDbUrl,
      PORT: String(PORT),
    },
    url: `${baseURL}/login`,
    reuseExistingServer: false,
    timeout: 30_000,
    stdout: "pipe",
    stderr: "pipe",
  },
});

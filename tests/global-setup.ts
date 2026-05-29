import { execFileSync } from "node:child_process";

export default async function globalSetup() {
  const url = process.env.TEST_DATABASE_URL;
  if (!url) {
    throw new Error(
      "TEST_DATABASE_URL is not set. Add it to .env and run: createdb dm0nk_test",
    );
  }

  execFileSync("bun", ["tests/reset-test-db.ts"], {
    stdio: "inherit",
    env: { ...process.env, TEST_DATABASE_URL: url },
  });
}

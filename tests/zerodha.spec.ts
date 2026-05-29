import { test, expect } from "@playwright/test";

test.describe("zerodha oauth endpoints", () => {
  async function loginAsAdmin(context: import("@playwright/test").BrowserContext) {
    const page = await context.newPage();
    await page.goto("/login");
    await page.fill('input[name="username"]', "admin");
    await page.fill('input[name="password"]', "admin");
    await page.getByRole("button", { name: "Sign In" }).click();
    await expect(page).toHaveURL(/\/admin\/posts$/);
    await page.close();
  }

  test("unauthenticated /zerodha/access-token redirects to /login", async ({
    request,
  }) => {
    const r = await request.get("/zerodha/access-token", {
      maxRedirects: 0,
    });
    expect(r.status()).toBe(303);
    expect(r.headers()["location"]).toBe("/login");
  });

  test("authenticated /zerodha/access-token redirects to kite.trade with api_key", async ({
    context,
  }) => {
    await loginAsAdmin(context);
    const r = await context.request.get("/zerodha/access-token", {
      maxRedirects: 0,
    });
    expect(r.status()).toBe(303);
    const loc = r.headers()["location"] ?? "";
    expect(loc).toMatch(/^https:\/\/kite\.trade\/connect\/login\?/);
    expect(loc).toContain("v=3");
    expect(loc).toMatch(/api_key=[^&]+/);
  });

  test("/zerodha/callback without request_token shows error page", async ({
    context,
  }) => {
    await loginAsAdmin(context);
    const page = await context.newPage();
    const resp = await page.goto("/zerodha/callback");
    expect(resp?.status()).toBe(200);
    await expect(page).toHaveTitle(/Login Failed/);
    await expect(page.locator("body")).toContainText(
      /Missing request_token/i,
    );
  });

  test("/zerodha/callback with status=failed shows error page", async ({
    context,
  }) => {
    await loginAsAdmin(context);
    const page = await context.newPage();
    const resp = await page.goto("/zerodha/callback?status=failed");
    expect(resp?.status()).toBe(200);
    await expect(page).toHaveTitle(/Login Failed/);
    await expect(page.locator("body")).toContainText(/status=failed/);
  });

  test("unauthenticated POST /zerodha/instruments/sync redirects to /login", async ({
    request,
  }) => {
    const r = await request.post("/zerodha/instruments/sync", {
      maxRedirects: 0,
    });
    expect(r.status()).toBe(303);
    expect(r.headers()["location"]).toBe("/login");
  });

  test("authenticated POST /zerodha/instruments/sync without token returns 412", async ({
    context,
  }) => {
    await loginAsAdmin(context);
    const r = await context.request.post("/zerodha/instruments/sync");
    expect(r.status()).toBe(412);
    const body = await r.json();
    expect(body.error).toMatch(/No valid Zerodha access token/);
  });
});

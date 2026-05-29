import { test, expect } from "@playwright/test";

test.describe("auth and admin posts", () => {
  test("unauthenticated /admin/posts redirects to /login", async ({ page }) => {
    const resp = await page.goto("/admin/posts");
    expect(resp?.status()).toBe(200);
    await expect(page).toHaveURL(/\/login$/);
    await expect(page).toHaveTitle(/Login/);
  });

  async function login(page: import("@playwright/test").Page) {
    await page.goto("/login");
    await page.fill('input[name="username"]', "admin");
    await page.fill('input[name="password"]', "admin");
    await page.getByRole("button", { name: "Sign In" }).click();
    await expect(page).toHaveURL(/\/admin\/posts$/);
  }

  test("invalid credentials show an error", async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[name="username"]', "admin");
    await page.fill('input[name="password"]', "wrong");
    await page.getByRole("button", { name: "Sign In" }).click();
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.locator("body")).toContainText(
      "Invalid username or password",
    );
  });

  test("admin/admin logs in and lands on /admin/posts", async ({ page }) => {
    await login(page);
    await expect(page).toHaveTitle(/Posts/);
    await expect(page.getByRole("heading", { name: "Posts" })).toBeVisible();
    await expect(page.getByRole("link", { name: /New Post/i })).toBeVisible();
  });

  test("create a post via /admin/posts/new and see it in the list", async ({
    page,
  }) => {
    await login(page);

    await page.getByRole("link", { name: /New Post/i }).click();
    await expect(page).toHaveURL(/\/admin\/posts\/new$/);

    const slug = `e2e-${Date.now()}`;
    await page.fill('input[name="title"]', "E2E Test Post");
    await page.fill('input[name="slug"]', slug);
    await page.fill('textarea[name="content"]', "Hello from Playwright");
    await page.getByRole("button", { name: "Create" }).click();

    await expect(page).toHaveURL(/\/admin\/posts$/);
    await expect(page.locator("body")).toContainText("E2E Test Post");
  });

  test("logout clears session and protects /admin/posts again", async ({
    page,
  }) => {
    await login(page);

    await page.evaluate(async () => {
      await fetch("/logout", { method: "POST" });
    });

    const resp = await page.goto("/admin/posts");
    expect(resp?.status()).toBe(200);
    await expect(page).toHaveURL(/\/login$/);
  });
});

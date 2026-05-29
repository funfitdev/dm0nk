import type { ZerodhaToken } from "@/db/zerodha-tokens.ts";

function Shell({
  title,
  theme,
  children,
}: {
  title: string;
  theme?: "light" | "dark";
  children: JSX.Children;
}) {
  const isDark = theme === "dark";
  return (
    <html class={isDark ? "dark" : ""}>
      <head>
        <title>{title} — CMS</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body class="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-950">
        <div class="w-full max-w-lg rounded-lg bg-white p-8 shadow dark:bg-gray-800">
          {children}
        </div>
      </body>
    </html>
  );
}

function fmt(d: Date | null): string {
  if (!d) return "—";
  return d.toISOString().replace("T", " ").slice(0, 19) + " UTC";
}

export function CallbackOk({
  theme,
  token,
}: {
  theme?: "light" | "dark";
  token: ZerodhaToken;
}) {
  return (
    <Shell title="Zerodha — Token Saved" theme={theme}>
      <h1 class="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">
        Zerodha access token saved
      </h1>
      <div class="mb-6 rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-800 dark:border-green-800 dark:bg-green-900/30 dark:text-green-200">
        Token persisted to <code>zerodha_tokens</code>. The trading agent can
        read it from the database — no .env edit needed.
      </div>
      <dl class="grid grid-cols-1 gap-y-3 text-sm sm:grid-cols-2">
        <div>
          <dt class="font-medium text-gray-500 dark:text-gray-400">
            Kite user
          </dt>
          <dd class="text-gray-900 dark:text-gray-100">
            {token.kite_user_id}
            {token.user_name && ` (${token.user_name})`}
          </dd>
        </div>
        <div>
          <dt class="font-medium text-gray-500 dark:text-gray-400">Email</dt>
          <dd class="text-gray-900 dark:text-gray-100">
            {token.email ?? "—"}
          </dd>
        </div>
        <div>
          <dt class="font-medium text-gray-500 dark:text-gray-400">Broker</dt>
          <dd class="text-gray-900 dark:text-gray-100">
            {token.broker ?? "—"}
          </dd>
        </div>
        <div>
          <dt class="font-medium text-gray-500 dark:text-gray-400">
            Login time
          </dt>
          <dd class="text-gray-900 dark:text-gray-100">
            {fmt(token.login_time)}
          </dd>
        </div>
        <div>
          <dt class="font-medium text-gray-500 dark:text-gray-400">
            Expires at
          </dt>
          <dd class="text-gray-900 dark:text-gray-100">
            {fmt(token.expires_at)}
          </dd>
        </div>
        <div>
          <dt class="font-medium text-gray-500 dark:text-gray-400">
            Exchanges
          </dt>
          <dd class="text-gray-900 dark:text-gray-100">
            {token.exchanges?.join(", ") ?? "—"}
          </dd>
        </div>
      </dl>
      <div class="mt-6">
        <a
          href="/admin/posts"
          class="inline-block rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Back to admin
        </a>
      </div>
    </Shell>
  );
}

export function CallbackError({
  theme,
  message,
}: {
  theme?: "light" | "dark";
  message: string;
}) {
  return (
    <Shell title="Zerodha — Login Failed" theme={theme}>
      <h1 class="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">
        Zerodha login failed
      </h1>
      <div class="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-900/30 dark:text-red-200">
        {message}
      </div>
      <div class="mt-6 flex gap-3">
        <a
          href="/zerodha/access-token"
          class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Try again
        </a>
        <a
          href="/admin/posts"
          class="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Back to admin
        </a>
      </div>
    </Shell>
  );
}

export function Login({
  theme,
  error,
}: {
  theme?: "light" | "dark";
  error?: string;
}) {
  const isDark = theme === "dark";
  return (
    <html class={isDark ? "dark" : ""}>
      <head>
        <title>Login — CMS</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body class="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-950">
        <div class="w-full max-w-sm rounded-lg bg-white p-8 shadow dark:bg-gray-800">
          <h1 class="mb-6 text-2xl font-bold text-gray-900 dark:text-gray-100">
            Sign In
          </h1>
          {error && (
            <div class="mb-4 rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700 dark:bg-red-900/30 dark:border-red-800 dark:text-red-300">
              {error}
            </div>
          )}
          <form method="post" action="/login" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Username
              </label>
              <input
                type="text"
                name="username"
                required
                autocomplete="username"
                class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <input
                type="password"
                name="password"
                required
                autocomplete="current-password"
                class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
              />
            </div>
            <button
              type="submit"
              class="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Sign In
            </button>
          </form>
        </div>
      </body>
    </html>
  );
}

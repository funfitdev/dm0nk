import {
  Users,
  Settings,
  FileText,
  Menu,
  Plus,
  Sun,
  Moon,
} from "@/components/icons.tsx";

export function AdminLayout({
  title,
  children,
  search,
  sheetContent,
  confirmState,
  theme,
}: {
  title: string;
  children: JSX.Children;
  search?: string;
  sheetContent?: JSX.Children;
  confirmState?: { name: string; url: string };
  theme?: "light" | "dark";
}) {
  const isDark = theme === "dark";
  return (
    <html class={isDark ? "dark" : ""}>
      <head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="/styles.css" />
        <script src="https://unpkg.com/htmx.org@2.0.4"></script>
      </head>
      <body class="h-screen overflow-hidden bg-gray-100 dark:bg-gray-950">
        <div class="flex h-screen">
          {/* Mobile sidebar overlay */}
          <div id="sidebar-overlay" class="fixed inset-0 z-30 hidden">
            <div data-sidebar-backdrop class="absolute inset-0 bg-black/50" />
          </div>

          {/* Sidebar */}
          <aside
            id="sidebar"
            class="fixed inset-y-0 left-0 z-30 flex w-[70%] max-w-64 -translate-x-full flex-col bg-gray-900 text-gray-300 transition-transform md:static md:translate-x-0 dark:bg-gray-900"
          >
            <div class="flex h-14 items-center px-6 text-lg font-bold text-white">
              Admin
            </div>
            <nav class="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
              <a
                href="/admin/users"
                hx-get="/admin/users"
                hx-target="#content"
                hx-swap="innerHTML"
                hx-push-url="/admin/users"
                class="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-gray-800 hover:text-white"
                data-sidebar-link
              >
                <Users class="h-4 w-4" />
                Users
              </a>
              <a
                href="#"
                class="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-gray-800 hover:text-white"
                data-sidebar-link
              >
                <Settings class="h-4 w-4" />
                Settings
              </a>
              <a
                href="#"
                class="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-gray-800 hover:text-white"
                data-sidebar-link
              >
                <FileText class="h-4 w-4" />
                Reports
              </a>
            </nav>
            <div class="border-t border-gray-700 px-6 py-4 text-xs text-gray-500">
              v1.0.0
            </div>
          </aside>

          {/* Right panel */}
          <div class="flex flex-1 flex-col overflow-hidden">
            {/* Header */}
            <header class="flex h-14 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 md:px-6 dark:border-gray-700 dark:bg-gray-900">
              <div class="flex items-center gap-3">
                <button
                  data-sidebar-toggle
                  class="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700 md:hidden dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                >
                  <Menu class="h-5 w-5" />
                </button>
                <h1 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {title}
                </h1>
              </div>
              <div class="flex items-center gap-2 md:gap-4">
                <input
                  type="search"
                  name="search"
                  placeholder="Search..."
                  value={search}
                  hx-get="/admin/users"
                  hx-trigger="input changed delay:300ms, search"
                  hx-target="#content"
                  hx-swap="innerHTML"
                  class="hidden w-40 rounded-md border border-gray-300 px-3 py-1.5 text-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:block md:w-auto dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-500"
                />
                <button
                  hx-get="/admin/users/new"
                  hx-target="#sheet-content"
                  hx-swap="innerHTML"
                  class="rounded-md bg-blue-600 p-2 text-sm font-medium text-white hover:bg-blue-700 sm:px-4 sm:py-2"
                  data-sheet-open
                >
                  <Plus class="h-4 w-4 sm:hidden" />
                  <span class="hidden sm:inline">Add</span>
                </button>
                <form method="post" action="/theme" class="flex">
                  <button
                    type="submit"
                    class="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                    title="Toggle theme"
                  >
                    {isDark ? (
                      <Sun class="h-5 w-5" />
                    ) : (
                      <Moon class="h-5 w-5" />
                    )}
                  </button>
                </form>
                <span class="hidden text-sm text-gray-500 md:inline dark:text-gray-400">
                  admin@example.com
                </span>
                <a
                  href="/users"
                  class="hidden text-sm text-blue-600 hover:text-blue-800 md:inline dark:text-blue-400 dark:hover:text-blue-300"
                >
                  View site
                </a>
              </div>
            </header>

            {/* Scrollable content */}
            <main
              id="content"
              class="flex-1 overflow-y-auto p-4 md:p-6 dark:bg-gray-950"
            >
              {children}
            </main>

            {/* Footer */}
            <footer class="flex h-10 shrink-0 items-center justify-between border-t border-gray-200 bg-white px-4 text-xs text-gray-500 md:px-6 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">
              <span>&copy; 2026 Admin Panel</span>
              <span>Bun SSR</span>
            </footer>
          </div>
        </div>
        {/* Confirm dialog */}
        <div
          id="confirm-overlay"
          class={`fixed inset-0 z-50${confirmState ? "" : " hidden"}`}
        >
          <div data-confirm-backdrop class="absolute inset-0 bg-black/50" />
          <div class="absolute inset-0 flex items-center justify-center p-4">
            <div
              id="confirm-dialog"
              class="relative w-full max-w-sm rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800"
            >
              <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Confirm Delete
              </h3>
              <p
                id="confirm-message"
                class="mt-2 text-sm text-gray-600 dark:text-gray-300"
              >
                {confirmState
                  ? `Are you sure you want to delete "${confirmState.name}"?`
                  : "Are you sure?"}
              </p>
              <div class="mt-6 flex justify-end gap-3">
                <button
                  data-confirm-cancel
                  class="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  id="confirm-action"
                  data-delete-url={confirmState?.url}
                  class="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sheet overlay */}
        <div
          id="sheet-overlay"
          class={`fixed inset-0 z-40${sheetContent ? "" : " hidden"}`}
        >
          <div data-sheet-backdrop class="absolute inset-0 bg-black/50" />
          <div
            id="sheet-panel"
            class={`absolute right-0 top-0 h-full w-full bg-white shadow-xl transition-transform md:max-w-md dark:bg-gray-900${sheetContent ? " translate-x-0" : " translate-x-full"}`}
          >
            <div id="sheet-content" class="h-full">
              {sheetContent}
            </div>
          </div>
        </div>
        {/* Toast container */}
        <div
          id="toast-container"
          class="fixed bottom-4 right-4 z-50 flex flex-col gap-2"
        />
        <script src="/client.js" />
      </body>
    </html>
  );
}

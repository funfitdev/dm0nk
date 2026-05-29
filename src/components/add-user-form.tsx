import { X, AlertCircle } from "@/components/icons.tsx";

export function AddUserForm({ errorMessage }: { errorMessage?: string } = {}) {
  return (
    <div class="flex h-full flex-col">
      <div class="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Add User
        </h2>
        <button
          data-sheet-close
          class="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
        >
          <X class="h-5 w-5" />
        </button>
      </div>
      <div class="flex-1 overflow-y-auto p-6">
        {errorMessage && (
          <div class="rounded-md bg-red-50 border border-red-200 p-4 mb-4 dark:bg-red-900/30 dark:border-red-800">
            <div class="flex items-center gap-2">
              <AlertCircle class="h-5 w-5 text-red-600 dark:text-red-400" />
              <p class="text-sm font-medium text-red-800 dark:text-red-300">
                {errorMessage}
              </p>
            </div>
          </div>
        )}
        <form
          id="add-user-form"
          hx-post="/admin/users"
          hx-target="#sheet-content"
          hx-swap="innerHTML"
          class="space-y-4"
        >
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
              Name
            </label>
            <input
              type="text"
              name="name"
              required
              class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
              placeholder="Enter name"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
              placeholder="Enter email"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
              Role
            </label>
            <select
              name="role"
              class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
            >
              <option value="User">User</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
        </form>
      </div>
      <div class="border-t border-gray-200 px-6 py-4 flex justify-end gap-3 dark:border-gray-700">
        <button
          data-sheet-close
          class="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Cancel
        </button>
        <button
          type="submit"
          form="add-user-form"
          class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Save
        </button>
      </div>
    </div>
  );
}

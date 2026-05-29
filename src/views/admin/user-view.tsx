import { AdminLayout } from "@/components/admin-layout.tsx";
import { AdminUsersTable } from "@/components/admin-users-table.tsx";
import { AddUserForm } from "@/components/add-user-form.tsx";
import { X, Check, AlertCircle } from "@/components/icons.tsx";

type User = { id: number; name: string; email: string; role: "Admin" | "User" };

export async function Index({
  users,
  search,
  sheetContent,
  confirmState,
  theme,
}: {
  users: User[];
  search?: string;
  sheetContent?: JSX.Children;
  confirmState?: { name: string; url: string };
  theme?: "light" | "dark";
}) {
  return (
    <AdminLayout
      title="Users"
      search={search}
      sheetContent={sheetContent}
      confirmState={confirmState}
      theme={theme}
    >
      <AdminUsersTable users={users} />
    </AdminLayout>
  );
}

export function List({ users }: { users: User[] }) {
  return <AdminUsersTable users={users} />;
}

export function Show({
  user,
  successMessage,
  errorMessage,
}: {
  user: User;
  successMessage?: string;
  errorMessage?: string;
}) {
  return (
    <div class="flex h-full flex-col">
      <div class="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {user.name}
        </h2>
        <button
          data-sheet-close
          class="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
        >
          <X class="h-5 w-5" />
        </button>
      </div>
      <div class="flex-1 overflow-y-auto p-6 space-y-4">
        {successMessage && (
          <div class="rounded-md bg-green-50 border border-green-200 p-4 dark:bg-green-900/30 dark:border-green-800">
            <div class="flex items-center gap-2">
              <Check class="h-5 w-5 text-green-600 dark:text-green-400" />
              <p class="text-sm font-medium text-green-800 dark:text-green-300">
                {successMessage}
              </p>
            </div>
          </div>
        )}
        {errorMessage && (
          <div class="rounded-md bg-red-50 border border-red-200 p-4 dark:bg-red-900/30 dark:border-red-800">
            <div class="flex items-center gap-2">
              <AlertCircle class="h-5 w-5 text-red-600 dark:text-red-400" />
              <p class="text-sm font-medium text-red-800 dark:text-red-300">
                {errorMessage}
              </p>
            </div>
          </div>
        )}
        <div>
          <span class="text-xs uppercase text-gray-500 dark:text-gray-400">
            ID
          </span>
          <p class="text-gray-900 dark:text-gray-100">{user.id}</p>
        </div>
        <div>
          <span class="text-xs uppercase text-gray-500 dark:text-gray-400">
            Name
          </span>
          <p class="text-gray-900 font-medium dark:text-gray-100">
            {user.name}
          </p>
        </div>
        <div>
          <span class="text-xs uppercase text-gray-500 dark:text-gray-400">
            Email
          </span>
          <p class="text-gray-900 dark:text-gray-100">{user.email}</p>
        </div>
        <div>
          <span class="text-xs uppercase text-gray-500 dark:text-gray-400">
            Role
          </span>
          <p>
            <span
              class={`rounded-full px-2 py-1 text-xs ${
                user.role === "Admin"
                  ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                  : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
              }`}
            >
              {user.role}
            </span>
          </p>
        </div>
      </div>
      <div class="border-t border-gray-200 px-6 py-4 flex justify-end gap-3 dark:border-gray-700">
        <button
          data-confirm-delete={user.name}
          data-delete-url={`/admin/users/${user.id}`}
          class="rounded-md border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/30"
        >
          Delete
        </button>
        <button
          hx-get={`/admin/users/${user.id}/edit`}
          hx-target="#sheet-content"
          hx-swap="innerHTML"
          class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Edit
        </button>
      </div>
    </div>
  );
}

export function New({ errorMessage }: { errorMessage?: string } = {}) {
  return <AddUserForm errorMessage={errorMessage} />;
}

export function Edit({
  user,
  errorMessage,
}: {
  user: User;
  errorMessage?: string;
}) {
  return (
    <div class="flex h-full flex-col">
      <div class="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Edit User
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
          id="edit-user-form"
          hx-put={`/admin/users/${user.id}`}
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
              value={user.name}
              class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
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
              value={user.email}
              class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
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
              <option value="User" selected={user.role === "User"}>
                User
              </option>
              <option value="Admin" selected={user.role === "Admin"}>
                Admin
              </option>
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
          form="edit-user-form"
          class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Save
        </button>
      </div>
    </div>
  );
}

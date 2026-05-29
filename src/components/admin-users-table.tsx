type User = { id: number; name: string; email: string; role: "Admin" | "User" };

export function AdminUsersTable({ users }: { users: User[] }) {
  return (
    <div class="bg-white rounded-lg shadow overflow-hidden dark:bg-gray-800">
      {/* Desktop table */}
      <table class="hidden w-full text-sm text-left text-gray-700 md:table dark:text-gray-300">
        <thead class="bg-gray-50 text-xs uppercase text-gray-500 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th class="px-6 py-3">ID</th>
            <th class="px-6 py-3">Name</th>
            <th class="px-6 py-3">Email</th>
            <th class="px-6 py-3">Role</th>
          </tr>
        </thead>
        <tbody
          id="users-table"
          class="divide-y divide-gray-200 dark:divide-gray-700"
        >
          {users.length === 0 ? (
            <tr>
              <td
                colspan={4}
                class="px-6 py-8 text-center text-gray-400 dark:text-gray-500"
              >
                No users found
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr id={`user-${user.id}`} class="dark:hover:bg-gray-750">
                <td class="px-6 py-4">{user.id}</td>
                <td class="px-6 py-4 font-medium">
                  <button
                    hx-get={`/admin/users/${user.id}`}
                    hx-target="#sheet-content"
                    hx-swap="innerHTML"
                    data-sheet-open
                    class="text-blue-600 hover:underline text-left dark:text-blue-400"
                  >
                    {user.name}
                  </button>
                </td>
                <td class="px-6 py-4">{user.email}</td>
                <td class="px-6 py-4">
                  <span
                    class={`rounded-full px-2 py-1 text-xs ${
                      user.role === "Admin"
                        ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                        : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Mobile card list */}
      <div class="divide-y divide-gray-200 md:hidden dark:divide-gray-700">
        {users.length === 0 ? (
          <div class="px-4 py-8 text-center text-gray-400 dark:text-gray-500">
            No users found
          </div>
        ) : (
          users.map((user) => (
            <button
              hx-get={`/admin/users/${user.id}`}
              hx-target="#sheet-content"
              hx-swap="innerHTML"
              data-sheet-open
              class="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <div>
                <p class="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {user.name}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  {user.email}
                </p>
              </div>
              <span
                class={`rounded-full px-2 py-1 text-xs ${
                  user.role === "Admin"
                    ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                    : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                }`}
              >
                {user.role}
              </span>
            </button>
          ))
        )}
      </div>
    </div>
  );
}

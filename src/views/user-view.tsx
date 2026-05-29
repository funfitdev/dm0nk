import { Dropdown } from "@/components/dropdown.tsx";

type User = { id: number; name: string };

export function Index({ users }: { users: User[] }) {
  return (
    <>
      {{ __html: "<!DOCTYPE html>" }}
      <html>
        <head>
          <title>Users</title>
          <link rel="stylesheet" href="/styles.css" />
        </head>
        <body class="bg-gray-100 min-h-screen p-8">
          <div class="max-w-2xl mx-auto">
            <h1 class="text-3xl font-bold text-gray-900 mb-6">Users</h1>
            <div class="mb-6">
              <Dropdown
                trigger="Actions"
                items={[
                  { label: "Sort by name", href: "/users?sort=name" },
                  { label: "Sort by ID", href: "/users?sort=id" },
                  { label: "Export CSV", href: "/users/export" },
                ]}
              />
            </div>
            <ul class="space-y-2">
              {users.map((user) => (
                <li class="flex items-center justify-between bg-white rounded-lg shadow px-4 py-3 text-gray-700">
                  <span>{user.name}</span>
                  <Dropdown
                    trigger="..."
                    items={[
                      { label: "Edit", href: `/users/${user.id}/edit` },
                      { label: "Delete", href: `/users/${user.id}/delete` },
                    ]}
                  />
                </li>
              ))}
            </ul>
          </div>
          <script src="/client.js" />
        </body>
      </html>
    </>
  );
}

import { ChevronDown } from "@/components/icons.tsx";

export function Dropdown({
  trigger,
  items,
  align,
}: {
  trigger: string;
  items: { label: string; href?: string; value?: string }[];
  align?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}) {
  return (
    <details data-dropdown={align ?? ""} class="relative inline-block">
      <summary class="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 cursor-pointer list-none">
        {trigger}
        <ChevronDown class="h-4 w-4 text-gray-500" />
      </summary>
      <div
        data-dropdown-menu
        class="absolute z-10 min-w-[12rem] rounded-md border border-gray-200 bg-white py-1 shadow-lg"
      >
        {items.map((item) => (
          <a
            href={item.href ?? "#"}
            data-dropdown-item
            data-value={item.value}
            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
          >
            {item.label}
          </a>
        ))}
      </div>
    </details>
  );
}

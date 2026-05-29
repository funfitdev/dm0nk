// Enhances <details data-dropdown> elements:
// - Auto-position menu based on available viewport space
// - Close when clicking outside
// - Close when pressing Escape
// - Close when selecting an item (via [data-dropdown-item])

function positionDropdown(details: HTMLDetailsElement) {
  const menu = details.querySelector("[data-dropdown-menu]") as HTMLElement;
  if (!menu) return;

  const prefer = (details.getAttribute("data-dropdown") || "").trim();
  const triggerRect = details.getBoundingClientRect();
  const menuRect = menu.getBoundingClientRect();
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  // Vertical: prefer below, flip to above if not enough space
  const spaceBelow = vh - triggerRect.bottom;
  const spaceAbove = triggerRect.top;
  let vertical: "below" | "above" = "below";
  if (prefer.includes("top")) vertical = "above";
  else if (prefer.includes("bottom")) vertical = "below";
  else if (spaceBelow < menuRect.height && spaceAbove > spaceBelow)
    vertical = "above";

  // Horizontal: prefer left-aligned, flip to right-aligned if not enough space
  const spaceRight = vw - triggerRect.left;
  const spaceLeft = triggerRect.right;
  let horizontal: "left" | "right" = "left";
  if (prefer.includes("right")) horizontal = "right";
  else if (prefer.includes("left")) horizontal = "left";
  else if (spaceRight < menuRect.width && spaceLeft > spaceRight)
    horizontal = "right";

  // Apply position
  if (vertical === "above") {
    menu.style.bottom = "100%";
    menu.style.top = "auto";
    menu.style.marginBottom = "4px";
    menu.style.marginTop = "0";
  } else {
    menu.style.top = "100%";
    menu.style.bottom = "auto";
    menu.style.marginTop = "4px";
    menu.style.marginBottom = "0";
  }

  if (horizontal === "right") {
    menu.style.right = "0";
    menu.style.left = "auto";
  } else {
    menu.style.left = "0";
    menu.style.right = "auto";
  }
}

document.addEventListener("click", (e) => {
  const target = e.target as HTMLElement;

  // Close other open dropdowns when opening a new one
  const currentDropdown = target.closest(
    "details[data-dropdown]",
  ) as HTMLDetailsElement | null;
  if (currentDropdown) {
    document.querySelectorAll("details[data-dropdown][open]").forEach((el) => {
      if (!el.contains(target)) el.removeAttribute("open");
    });
  } else {
    // Click outside — close all
    document.querySelectorAll("details[data-dropdown][open]").forEach((el) => {
      el.removeAttribute("open");
    });
  }

  // Handle item selection
  const item = target.closest("[data-dropdown-item]");
  if (item) {
    const dropdown = item.closest("details[data-dropdown]");
    dropdown?.removeAttribute("open");
  }
});

document.addEventListener(
  "toggle",
  (e) => {
    const details = e.target as HTMLDetailsElement;
    if (!details.matches("details[data-dropdown]")) return;
    const menu = details.querySelector("[data-dropdown-menu]") as HTMLElement;
    if (!menu) return;

    if (details.open) {
      positionDropdown(details);
      menu.setAttribute("data-positioned", "");
    } else {
      menu.removeAttribute("data-positioned");
    }
  },
  true,
);

// ── Sidebar (mobile) ─────────────────────────────────────────────────

function openSidebar() {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebar-overlay");
  if (!sidebar || !overlay) return;
  overlay.classList.remove("hidden");
  requestAnimationFrame(() => {
    sidebar.classList.remove("-translate-x-full");
    sidebar.classList.add("translate-x-0");
  });
}

function closeSidebar() {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebar-overlay");
  if (!sidebar || !overlay) return;
  sidebar.classList.remove("translate-x-0");
  sidebar.classList.add("-translate-x-full");
  let settled = false;
  const cleanup = () => {
    if (!settled) {
      settled = true;
      overlay.classList.add("hidden");
    }
  };
  sidebar.addEventListener("transitionend", cleanup, { once: true });
  setTimeout(cleanup, 350);
}

document.addEventListener("click", (e) => {
  const target = e.target as HTMLElement;
  if (target.closest("[data-sidebar-toggle]")) {
    const sidebar = document.getElementById("sidebar");
    if (sidebar?.classList.contains("-translate-x-full")) {
      openSidebar();
    } else {
      closeSidebar();
    }
  }
  if (target.closest("[data-sidebar-backdrop]")) {
    closeSidebar();
  }
  if (target.closest("[data-sidebar-link]")) {
    // Close sidebar on mobile after clicking a link
    const sidebar = document.getElementById("sidebar");
    if (sidebar && !sidebar.classList.contains("md:static")) return;
    if (window.innerWidth < 768) closeSidebar();
  }
});

// ── URL State Management ─────────────────────────────────────────────

function updateUrlState(params: Record<string, string | undefined>) {
  const url = new URL(window.location.href);
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === "") url.searchParams.delete(key);
    else url.searchParams.set(key, value);
  }
  history.replaceState({}, "", url.toString());
}

function setSheetState(sheet: string, id?: string) {
  updateUrlState({ sheet, id });
}

function clearSheetState() {
  updateUrlState({ sheet: undefined, id: undefined });
}

function sheetStateFromPath(path: string) {
  const editMatch = path.match(/\/admin\/users\/(\d+)\/edit/);
  if (editMatch) return { sheet: "edit", id: editMatch[1] };
  if (path.includes("/admin/users/new")) return { sheet: "new" };
  const showMatch = path.match(/\/admin\/users\/(\d+)$/);
  if (showMatch) return { sheet: "show", id: showMatch[1] };
  return null;
}

// ── Sheet ────────────────────────────────────────────────────────────

function openSheet() {
  const overlay = document.getElementById("sheet-overlay");
  const panel = document.getElementById("sheet-panel");
  if (!overlay || !panel) return;
  overlay.classList.remove("hidden");
  requestAnimationFrame(() => {
    panel.classList.remove("translate-x-full");
    panel.classList.add("translate-x-0");
  });
}

function closeSheet() {
  const overlay = document.getElementById("sheet-overlay");
  const panel = document.getElementById("sheet-panel");
  if (!overlay || !panel) return;

  const cleanup = () => {
    overlay.classList.add("hidden");
    const content = document.getElementById("sheet-content");
    if (content) content.innerHTML = "";
  };

  // If the panel is not currently visible, clean up immediately
  if (!panel.classList.contains("translate-x-0")) {
    cleanup();
  } else {
    panel.classList.remove("translate-x-0");
    panel.classList.add("translate-x-full");
    let settled = false;
    panel.addEventListener(
      "transitionend",
      () => {
        if (!settled) {
          settled = true;
          cleanup();
        }
      },
      { once: true },
    );
    // Fallback in case transitionend doesn't fire
    setTimeout(() => {
      if (!settled) {
        settled = true;
        cleanup();
      }
    }, 350);
  }
  clearSheetState();
}

// Open sheet when [data-sheet-open] is clicked
document.addEventListener("click", (e) => {
  const trigger = (e.target as HTMLElement).closest("[data-sheet-open]");
  if (trigger) openSheet();
});

// Close sheet when [data-sheet-close] or backdrop is clicked
document.addEventListener("click", (e) => {
  const target = e.target as HTMLElement;
  if (
    target.closest("[data-sheet-close]") ||
    target.closest("[data-sheet-backdrop]")
  ) {
    closeSheet();
  }
});

// Open sheet when htmx loads content into #sheet-content + sync URL
document.addEventListener("htmx:afterSwap", ((e: CustomEvent) => {
  const target = e.detail.target as HTMLElement;
  const elt = e.detail.elt as HTMLElement;
  const xhr = e.detail.xhr as XMLHttpRequest | undefined;

  if (target.id === "sheet-content") {
    openSheet();
    // Derive sheet state from the request path
    const requestPath =
      elt?.getAttribute("hx-get") ||
      (xhr?.responseURL ? new URL(xhr.responseURL).pathname : null);
    if (requestPath) {
      const state = sheetStateFromPath(requestPath);
      if (state) setSheetState(state.sheet, state.id);
    }
  }

  // Sync search param when search input swaps content
  if (target.id === "content") {
    const searchInput = document.querySelector<HTMLInputElement>(
      'input[name="search"]',
    );
    if (xhr?.responseURL) {
      const respUrl = new URL(xhr.responseURL);
      const search = respUrl.searchParams.get("search") || undefined;
      updateUrlState({ search });
      if (searchInput) searchInput.value = search ?? "";
    }
  }
}) as EventListener);

// Close sheet after a form with [data-sheet-dismiss] completes its htmx request
document.addEventListener("htmx:afterSettle", ((e: CustomEvent) => {
  const elt = e.detail.elt as HTMLElement;
  if (elt.hasAttribute("data-sheet-dismiss")) {
    closeSheet();
  }
}) as EventListener);

// Refresh table when server sends HX-Trigger: refreshTable
document.addEventListener("refreshTable", () => {
  const search = new URL(window.location.href).searchParams.get("search");
  const refreshUrl = search
    ? `/admin/users?search=${encodeURIComponent(search)}`
    : "/admin/users";
  (window as any).htmx.ajax("GET", refreshUrl, {
    target: "#content",
    swap: "innerHTML",
  });
});

// ── Confirm Modal ────────────────────────────────────────────────────

let pendingDeleteUrl: string | null = null;
let previousSheetState: { sheet: string; id?: string } | null = null;

function openConfirm(name: string, url: string) {
  const overlay = document.getElementById("confirm-overlay");
  const message = document.getElementById("confirm-message");
  if (!overlay || !message) return;
  message.textContent = `Are you sure you want to delete "${name}"?`;
  pendingDeleteUrl = url;
  overlay.classList.remove("hidden");

  // Remember current sheet state so we can restore on cancel
  const cur = new URL(window.location.href);
  const curSheet = cur.searchParams.get("sheet");
  const curId = cur.searchParams.get("id") || undefined;
  if (curSheet && curSheet !== "delete") {
    previousSheetState = { sheet: curSheet, id: curId };
  }

  // Reflect delete-confirm in URL
  const idMatch = url.match(/\/admin\/users\/(\d+)/);
  if (idMatch) setSheetState("delete", idMatch[1]);
}

function closeConfirm() {
  const overlay = document.getElementById("confirm-overlay");
  if (!overlay) return;
  overlay.classList.add("hidden");
  pendingDeleteUrl = null;
}

function dismissConfirm() {
  closeConfirm();
  if (previousSheetState) {
    setSheetState(previousSheetState.sheet, previousSheetState.id);
    previousSheetState = null;
  } else {
    clearSheetState();
  }
}

// Open confirm when [data-confirm-delete] is clicked
document.addEventListener("click", (e) => {
  const trigger = (e.target as HTMLElement).closest(
    "[data-confirm-delete]",
  ) as HTMLElement | null;
  if (trigger) {
    e.preventDefault();
    const name = trigger.getAttribute("data-confirm-delete") || "";
    const url = trigger.getAttribute("data-delete-url") || "";
    openConfirm(name, url);
  }
});

// Cancel confirm
document.addEventListener("click", (e) => {
  const target = e.target as HTMLElement;
  if (
    target.closest("[data-confirm-cancel]") ||
    target.closest("[data-confirm-backdrop]")
  ) {
    dismissConfirm();
  }
});

// Confirm delete action — close modal + sheet immediately, then refresh table
document.getElementById("confirm-action")?.addEventListener("click", () => {
  if (!pendingDeleteUrl) return;
  const url = pendingDeleteUrl;
  closeConfirm();
  previousSheetState = null;
  // Force-close sheet immediately (no transition wait)
  const sheetOverlay = document.getElementById("sheet-overlay");
  const sheetPanel = document.getElementById("sheet-panel");
  const sheetContent = document.getElementById("sheet-content");
  if (sheetOverlay) sheetOverlay.classList.add("hidden");
  if (sheetPanel) {
    sheetPanel.classList.remove("translate-x-0");
    sheetPanel.classList.add("translate-x-full");
  }
  if (sheetContent) sheetContent.innerHTML = "";
  clearSheetState();

  // Use htmx to perform the DELETE and refresh the table
  (window as any).htmx.ajax("DELETE", url, {
    target: "#content",
    swap: "innerHTML",
  });
});

// Initialize confirm state from SSR (page loaded with ?sheet=delete&id=...)
(function initFromUrl() {
  const confirmOverlay = document.getElementById("confirm-overlay");
  if (confirmOverlay && !confirmOverlay.classList.contains("hidden")) {
    const btn = document.getElementById("confirm-action");
    const url = btn?.getAttribute("data-delete-url");
    if (url) pendingDeleteUrl = url;
  }
})();

// ── Toast ────────────────────────────────────────────────────────────

function showToast(message: string) {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className =
    "flex items-center gap-3 rounded-lg bg-gray-900 px-4 py-3 text-sm text-white shadow-lg transition-all duration-300 translate-y-2 opacity-0";
  toast.innerHTML = `
    <svg class="h-5 w-5 shrink-0 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
    </svg>
    <span>${message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</span>
  `;
  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.remove("translate-y-2", "opacity-0");
  });

  setTimeout(() => {
    toast.classList.add("translate-y-2", "opacity-0");
    toast.addEventListener("transitionend", () => toast.remove(), {
      once: true,
    });
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}

// Listen for HX-Trigger: closeSheet
document.addEventListener("closeSheet", () => {
  closeSheet();
});

// Listen for HX-Trigger: showToast
document.addEventListener("showToast", ((e: CustomEvent) => {
  const message = e.detail?.message || "Done";
  showToast(message);
}) as EventListener);

// Listen for HX-Trigger: setSheetState
document.addEventListener("setSheetState", ((e: CustomEvent) => {
  const { sheet, id } = e.detail || {};
  if (sheet) setSheetState(sheet, id);
}) as EventListener);

// Close on Escape
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (pendingDeleteUrl) {
      dismissConfirm();
    } else {
      closeSheet();
    }
    closeSidebar();
    document.querySelectorAll("details[data-dropdown][open]").forEach((el) => {
      el.removeAttribute("open");
    });
  }
});

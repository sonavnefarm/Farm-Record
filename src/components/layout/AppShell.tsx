"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, LogOut } from "lucide-react";
import { NAV_ITEMS } from "@/lib/nav-items";
import { cn } from "@/lib/utils/cn";
import { logoutAction } from "@/lib/actions/auth";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

function NavLinks({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <nav className="flex flex-1 flex-col gap-1 px-3" aria-label="Main navigation">
      {NAV_ITEMS.map((item) => {
        const active = isActive(pathname, item.href);
        const Icon = item.icon;
        return (
          <div key={item.label}>
            <Link
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-[var(--color-accent-soft)] text-[var(--color-accent-hover)]"
                  : "text-[var(--color-text-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text)]",
              )}
            >
              <Icon size={18} strokeWidth={1.75} aria-hidden="true" />
              {item.label}
            </Link>
            {item.children && active && (
              <div className="mt-1 ml-[1.85rem] flex flex-col gap-0.5 border-l border-[var(--color-border)] pl-3">
                {item.children.map((child) => {
                  const childActive = pathname === child.href;
                  return (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={onNavigate}
                      aria-current={childActive ? "page" : undefined}
                      className={cn(
                        "rounded-md px-2 py-1.5 text-sm transition-colors",
                        childActive
                          ? "font-medium text-[var(--color-accent-hover)]"
                          : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]",
                      )}
                    >
                      {child.label}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}

function LogoutButton({ className }: { className?: string }) {
  return (
    <form action={logoutAction}>
      <button
        type="submit"
        className={cn(
          "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface)] hover:text-[var(--color-text)]",
          className,
        )}
      >
        <LogOut size={18} strokeWidth={1.75} aria-hidden="true" />
        Log out
      </button>
    </form>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // The login page has no nav shell — it's the one page a signed-out
  // visitor can reach (see src/middleware.ts), so there's nothing to
  // navigate to yet.
  if (pathname === "/login") {
    return (
      <main id="main-content" className="flex min-h-screen items-center justify-center bg-[var(--color-bg)] px-4">
        {children}
      </main>
    );
  }

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-[var(--color-accent)] focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
      >
        Skip to content
      </a>
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-[var(--color-border)] bg-[var(--color-bg)] lg:flex lg:flex-col">
        <div className="flex h-16 items-center gap-2 px-5">
          <span className="text-[15px] font-semibold tracking-tight">
            Farm Manager
          </span>
        </div>
        <NavLinks pathname={pathname} />
        <div className="border-t border-[var(--color-border)] px-3 py-3">
          <LogoutButton />
        </div>
        <div className="px-5 py-4 text-xs text-[var(--color-text-faint)]">
          Livestock Management
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="flex h-14 items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-surface)] px-4 lg:hidden">
        <span className="text-[15px] font-semibold tracking-tight">
          Farm Manager
        </span>
        <button
          type="button"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileOpen((v) => !v)}
          className="flex h-9 w-9 items-center justify-center rounded-md text-[var(--color-text-muted)] hover:bg-[var(--color-bg)]"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="border-b border-[var(--color-border)] bg-[var(--color-bg)] pb-3 lg:hidden">
          <NavLinks pathname={pathname} onNavigate={() => setMobileOpen(false)} />
          <div className="mt-1 border-t border-[var(--color-border)] px-3 pt-3">
            <LogoutButton />
          </div>
        </div>
      )}

      {/* Main content */}
      <main id="main-content" className="flex-1 bg-[var(--color-bg)]">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </div>
      </main>
    </div>
  );
}

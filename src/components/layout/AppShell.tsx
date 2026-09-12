"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { NAV_ITEMS } from "@/lib/nav-items";
import { cn } from "@/lib/utils/cn";

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
    <nav className="flex flex-1 flex-col gap-1 px-3">
      {NAV_ITEMS.map((item) => {
        const active = isActive(pathname, item.href);
        const Icon = item.icon;
        return (
          <div key={item.label}>
            <Link
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-[var(--color-accent-soft)] text-[var(--color-accent-hover)]"
                  : "text-[var(--color-text-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text)]",
              )}
            >
              <Icon size={18} strokeWidth={1.75} />
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

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-[var(--color-border)] bg-[var(--color-bg)] lg:flex lg:flex-col">
        <div className="flex h-16 items-center gap-2 px-5">
          <span className="text-[15px] font-semibold tracking-tight">
            Farm Manager
          </span>
        </div>
        <NavLinks pathname={pathname} />
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
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 bg-[var(--color-bg)]">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </div>
      </main>
    </div>
  );
}

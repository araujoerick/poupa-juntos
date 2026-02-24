"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, Plus, BookOpen } from "lucide-react";
import { UserButton } from "@clerk/nextjs";

const navItems = [
  { href: "/dashboard", icon: Home, label: "Início", exact: true },
  { href: "/dashboard/groups", icon: Users, label: "Grupos", exact: false },
  { href: "/dashboard/groups/new", icon: Plus, label: "Novo", isFab: true },
  { href: "/dashboard/learn", icon: BookOpen, label: "Aprender", exact: false },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border pb-safe"
      style={{ paddingBottom: `max(env(safe-area-inset-bottom), 0px)` }}
    >
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {navItems.map((item) => {
          const isActive =
            "exact" in item && item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);

          if ("isFab" in item) {
            return (
              <Link
                key="fab"
                href={item.href}
                aria-label="Novo grupo"
                className="flex items-center justify-center w-13 h-13 -mt-5 rounded-full bg-coral shadow-lg shadow-coral/40 transition-transform active:scale-95"
              >
                <item.icon className="w-6 h-6 text-white" strokeWidth={2.5} />
              </Link>
            );
          }

          return (
            <Link
              key={item.label}
              href={item.href}
              className="flex flex-col items-center gap-0.5 px-4 py-2 transition-colors"
              aria-label={item.label}
            >
              <item.icon
                className={`w-5 h-5 transition-colors ${
                  isActive ? "text-coral" : "text-muted-foreground"
                }`}
                strokeWidth={isActive ? 2.5 : 1.75}
              />
              <span
                className={`text-[10px] font-medium transition-colors ${
                  isActive ? "text-coral" : "text-muted-foreground"
                }`}
              >
                {item.label}
              </span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-coral mt-0.5" />
              )}
            </Link>
          );
        })}

        {/* Perfil — Clerk UserButton */}
        <div className="flex flex-col items-center gap-0.5 px-4 py-2">
          <UserButton afterSignOutUrl="/" />
          <span className="text-[10px] font-medium text-muted-foreground">
            Perfil
          </span>
        </div>
      </div>
    </nav>
  );
}

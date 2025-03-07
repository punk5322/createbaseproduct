import { Home, FileText, DollarSign, Split, Settings } from "lucide-react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import type { ReactNode } from 'react';

type NavItem = {
  icon: React.ComponentType;
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { icon: Home, label: "Dashboard", href: "/" },
  { icon: FileText, label: "Reporting", href: "/reporting" },
  { icon: DollarSign, label: "Payments", href: "/payments" },
  { icon: Split, label: "Splits", href: "/splits" },
  { icon: Settings, label: "Settings", href: "/settings" }
];

export function Sidebar() {
  const [location] = useLocation();

  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-background border-r flex flex-col">
      <div className="p-6">
        <Logo />
      </div>

      <nav className="flex-1 p-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href;

          return (
            <Link key={item.href} href={item.href}>
              <a
                className={cn(
                  "flex items-center gap-3 px-4 py-3 mb-1",
                  "text-sm font-medium rounded-lg",
                  "transition-colors duration-200",
                  "hover:bg-gradient-to-r hover:from-primary/5 hover:to-transparent",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  isActive && "bg-gradient-to-r from-primary/10 to-transparent text-primary"
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </a>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

// Minimal required exports for layout compatibility
export const SidebarContent = Sidebar;
export const SidebarInset = ({ className, children }: { className?: string; children: ReactNode }) => (
  <main className={cn("ml-64 min-h-screen bg-background p-8", className)}>
    {children}
  </main>
);
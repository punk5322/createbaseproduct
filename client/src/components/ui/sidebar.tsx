import { Home, FileText, DollarSign, Split, Settings } from "lucide-react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import type { ReactNode } from 'react';
import { Button } from "./button";

const navItems = [
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
                  "transition-colors duration-200 ease-in-out",
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

// Required exports for layout compatibility
export const SidebarContent = Sidebar;
export const SidebarInset = ({ className, children }: { className?: string; children: ReactNode }) => (
  <main className={cn("ml-64 min-h-screen bg-background p-8", className)}>
    {children}
  </main>
);

// Compatibility exports for existing codebase
export const SidebarMenuItem = ({ children, className, ...props }: React.HTMLProps<HTMLLIElement>) => (
  <li className={cn("relative transition-transform duration-200 ease-in-out hover:translate-x-1", className)} {...props}>
    {children}
  </li>
);

export const SidebarMenuButton = Button;
export const SidebarMenu = ({ className, ...props }: React.HTMLProps<HTMLUListElement>) => (
  <ul className={cn("flex w-full min-w-0 flex-col gap-1", className)} {...props} />
);

// Additional compatibility exports that might be needed
export const SidebarHeader = ({ className, ...props }: React.HTMLProps<HTMLDivElement>) => (
  <div className={cn("flex flex-col gap-2 p-4", className)} {...props} />
);

export const SidebarGroup = ({ className, ...props }: React.HTMLProps<HTMLDivElement>) => (
  <div className={cn("flex flex-col gap-2", className)} {...props} />
);

export const SidebarProvider = ({ children }: { children: ReactNode }) => <>{children}</>;
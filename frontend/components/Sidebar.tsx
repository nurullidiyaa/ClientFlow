
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { label: "Dashboard", href: "/" },
    { label: "Clients", href: "/clients" },
    { label: "Projects", href: "/projects" },
    { label: "Tasks", href: "/tasks" },
    { label: "Invoices", href: "/invoices" },
    { label: "Payments", href: "/payments" },
    { label: "Settings", href: "/settings" },
  ];

  return (
    <aside className="flex min-h-screen w-64 shrink-0 flex-col bg-slate-900 p-6 text-white">
      <div>
        <h1 className="text-2xl font-bold">ClientFlow</h1>
        <p className="mt-1 text-sm text-slate-400">
          Manage your business
        </p>
      </div>

      <nav className="mt-10 flex flex-col gap-2">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname === item.href ||
                pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-slate-800 text-white"
                  : "text-slate-300 hover:bg-slate-800"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

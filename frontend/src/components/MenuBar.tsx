"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  label: string;
  href: string;
  moduleColorVar?: string;
};

const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Employee Profile", href: "/employee-profile", moduleColorVar: "--employee-profile" },
  { label: "Leaves", href: "/leaves", moduleColorVar: "--leaves" },
  { label: "Organization", href: "/organization-structure", moduleColorVar: "--org-structure" },
  { label: "Performance", href: "/performance", moduleColorVar: "--performance" },
  { label: "Time", href: "/time-management", moduleColorVar: "--time-management" },
  { label: "Recruitment", href: "/recruitment", moduleColorVar: "--recruitment" },
  { label: "Payroll", href: "/payroll-tracking", moduleColorVar: "--payroll" },
];

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function MenuBar() {
  const pathname = usePathname();

  return (
    <header className="navbar sticky top-0 z-50">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-6">
        <Link
          href="/"
          className="text-lg font-semibold"
          style={{ color: "var(--text-primary)" }}
        >
          HR System
        </Link>

        <div className="flex flex-wrap items-center gap-2">
          {navItems.map((item) => {
            const active = isActivePath(pathname, item.href);
            const activeColor = item.moduleColorVar
              ? `var(${item.moduleColorVar})`
              : "var(--primary-700)";

            return (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-2 text-sm font-medium transition-colors"
                style={{
                  color: active ? activeColor : "var(--text-secondary)",
                  backgroundColor: active ? "var(--bg-selected)" : "transparent",
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}

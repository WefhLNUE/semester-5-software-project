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
    <header
      className="navbar"
      style={{ position: "sticky", top: 0, zIndex: 50 }}
    >
      <nav
        style={{
          maxWidth: "80rem",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1.5rem",
        }}
      >
        <Link
          href="/"
          style={{
            color: "var(--text-primary)",
            fontSize: "1.125rem",
            fontWeight: 600,
            textDecoration: "none",
            whiteSpace: "nowrap",
          }}
        >
          HR System
        </Link>

        <div
          style={{
            display: "flex",
            flexWrap: "nowrap",
            alignItems: "center",
            gap: "0.5rem",
            overflowX: "auto",
            maxWidth: "100%",
            whiteSpace: "nowrap",
          }}
        >
          {navItems.map((item) => {
            const active = isActivePath(pathname, item.href);
            const activeColor = item.moduleColorVar
              ? `var(${item.moduleColorVar})`
              : "var(--primary-700)";

            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  textDecoration: "none",
                  borderRadius: "0.375rem",
                  padding: "0.5rem 0.75rem",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  transition: "background-color 0.2s ease, color 0.2s ease",
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

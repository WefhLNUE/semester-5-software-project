"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type NavItem = {
  label: string;
  href: string;
  moduleColorVar?: string;
  requiresAuth?: boolean;
};

const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "Employee Profile",
    href: "/employee-profile",
    moduleColorVar: "--employee-profile",
    requiresAuth: true,
  },
  { label: "Leaves", href: "/leaves", moduleColorVar: "--leaves", requiresAuth: true },
  {
    label: "Organization",
    href: "/organization-structure",
    moduleColorVar: "--org-structure",
    requiresAuth: true,
  },
  { label: "Performance", href: "/performance", moduleColorVar: "--performance", requiresAuth: true },
  { label: "Time", href: "/time-management", moduleColorVar: "--time-management", requiresAuth: true },
  { label: "Recruitment", href: "/recruitment", moduleColorVar: "--recruitment", requiresAuth: true },
  { label: "Payroll", href: "/payroll-tracking", moduleColorVar: "--payroll", requiresAuth: true },
];

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function MenuBar() {
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(Boolean(localStorage.getItem("token")));

    const onStorage = (e: StorageEvent) => {
      if (e.key === "token") {
        setIsAuthenticated(Boolean(localStorage.getItem("token")));
      }
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [pathname]);

  const visibleNavItems = isAuthenticated ? navItems : navItems.filter((item) => !item.requiresAuth);

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
          {visibleNavItems.map((item) => {
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

          {!isAuthenticated && (
            <Link
              href="/login"
              style={{
                textDecoration: "none",
                borderRadius: "0.5rem",
                padding: "0.5rem 0.9rem",
                fontSize: "0.875rem",
                fontWeight: 600,
                backgroundColor: "var(--primary-700)",
                color: "white",
              }}
            >
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}

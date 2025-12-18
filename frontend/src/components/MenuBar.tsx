"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { User } from "lucide-react";
import { jwtDecode } from "jwt-decode";

type NavItem = {
  label: string;
  href: string;
  moduleColorVar?: string;
  requiresAuth?: boolean;
};

interface UserPayload {
  id: string;
  workEmail?: string;
  personalEmail?: string;
  roles?: string[];
}

const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Careers", href: "/recruitment/jobs/careers", moduleColorVar: "--recruitment", requiresAuth: false },
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
  { label: "Payroll", href: "/payroll-dashboard", moduleColorVar: "--payroll", requiresAuth: true },
];

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function MenuBar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ id: string; role: string; name?: string } | null>(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUser(null);
    router.replace("/login");
  };

  useEffect(() => {
    // 1. Optimistic UI Check
    // Prevent UI flicker by assuming logged-in if any token marker persists.
    const tokenMarker = localStorage.getItem("token");
    if (tokenMarker) {
      setIsAuthenticated(true);
      if (!user) {
        setUser({
          id: "placeholder",
          role: "EMPLOYEE",
          name: "Loading..."
        });
      }
    }

    // 2. Fetch User Data (Source of Truth)
    // Verify session with backend cookie and get actual user details.
    const API_URL = "http://localhost:5000";

    const fetchUser = async (retryCount = 0) => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const res = await fetch(`${API_URL}/auth/me?t=${Date.now()}`, {
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          cache: 'no-store',
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (res.ok) {
          const text = await res.text();
          if (text && text.length > 0) {
            try {
              const userData = JSON.parse(text);
              const roleSource = userData.roles || userData.systemRole?.roles || [];
              const userRole = Array.isArray(roleSource) && roleSource.length > 0 ? roleSource[0] : 'Candidate';

              setUser({
                id: userData.id || userData._id || userData.sub,
                role: userRole,
                name: userData.name || userData.workEmail || userData.username || "User"
              });
              setIsAuthenticated(true);
              return;
            } catch (e) {
              console.error("JSON Parse Error", e);
            }
          }
        }

        // Handle Explicit Logout
        if (res.status === 401 || res.status === 403) {
          console.warn("Session expired");
          setIsAuthenticated(false);
          setUser(null);
          localStorage.removeItem("token");
          return;
        }

        throw new Error(`Fetch failed: ${res.status}`);

      } catch (error) {
        // Retry logic for network resilience
        if (retryCount < 3) {
          setTimeout(() => fetchUser(retryCount + 1), 1000);
        } else {
          // Final Fallback: Ensure UI resolves
          setUser((prev) => prev ? { ...prev, name: "Employee" } : { id: "fallback", role: "EMPLOYEE", name: "Employee" });
        }
      }
    };

    if (tokenMarker) {
      fetchUser();
    }
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

          {isAuthenticated && (
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <button
                type="button"
                onClick={handleLogout}
                style={{
                  border: "none",
                  cursor: "pointer",
                  borderRadius: "0.5rem",
                  padding: "0.5rem 0.9rem",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  backgroundColor: "transparent",
                  color: "var(--text-secondary)",
                }}
              >
                Logout
              </button>

              {/* User Profile Badge */}
              {user && (
                <div
                  className="animate-fade-in hover-lift"
                  onClick={() => router.push("/employee-profile")}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    background: "white",
                    padding: "0.5rem 0.75rem 0.5rem 0.5rem",
                    borderRadius: "2rem",
                    boxShadow: "var(--shadow-sm)",
                    border: "1px solid var(--border-light)",
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                >
                  {/* Generic Professional Icon */}
                  <div style={{
                    width: "36px",
                    height: "36px",
                    background: "var(--primary-100)",
                    color: "var(--primary-600)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.05)"
                  }}>
                    <User size={20} strokeWidth={2.5} />
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.2 }}>
                    <span style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--text-primary)" }}>{user.name || "User"}</span>
                    <span style={{
                      fontSize: "0.65rem",
                      color: "var(--primary-600)",
                      textTransform: "uppercase",
                      fontWeight: 700,
                      letterSpacing: "0.05em",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.25rem"
                    }}>
                      {user.role}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}

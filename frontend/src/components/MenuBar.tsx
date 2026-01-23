"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { User } from "lucide-react";
import { Bell } from "lucide-react";
import { jwtDecode } from "jwt-decode";

type NavItem = {
  label: string;
  href: string;
  moduleColorVar?: string;
  requiresAuth?: boolean;
  candidateOnly?: boolean;
  employeeOnly?: boolean;
};

interface UserPayload {
  id: string;
  workEmail?: string;
  personalEmail?: string;
  roles?: string[];
  userType?: string;
}

const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Careers", href: "/recruitment/jobs/careers", moduleColorVar: "--recruitment", requiresAuth: false },
  { label: "Applications", href: "/recruitment/my-applications", moduleColorVar: "--recruitment", requiresAuth: true, candidateOnly: true },
  {
    label: "Employee Profile",
    href: "/employee-profile",
    moduleColorVar: "--employee-profile",
    requiresAuth: true,
    employeeOnly: true,
  },
  { label: "Leaves", href: "/leaves", moduleColorVar: "--leaves", requiresAuth: true, employeeOnly: true },
  {
    label: "Organization",
    href: "/organization-structure",
    moduleColorVar: "--org-structure",
    requiresAuth: true,
    employeeOnly: true,
  },
  { label: "Performance", href: "/performance", moduleColorVar: "--performance", requiresAuth: true, employeeOnly: true },
  { label: "Time", href: "/time-management", moduleColorVar: "--time-management", requiresAuth: true, employeeOnly: true },
  { label: "Recruitment", href: "/recruitment", moduleColorVar: "--recruitment", requiresAuth: true, employeeOnly: true },
  { label: "Payroll", href: "/payroll-dashboard", moduleColorVar: "--payroll", requiresAuth: true, employeeOnly: true },
];

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function MenuBar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCandidate, setIsCandidate] = useState(false);
  const [user, setUser] = useState<{ id: string; role: string; name?: string; userType?: string; profilePictureUrl?: string | null } | null>(null);

  const [unreadCount, setUnreadCount] = useState(0);
  const [lastCheck, setLastCheck] = useState(Date.now());

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setIsCandidate(false);
    setUser(null);
    setUnreadCount(0);
    router.replace("/login");
  };

  useEffect(() => {
    // 1. Optimistic UI Check
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

    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    const fetchUnreadCount = async () => {
      try {
        const res = await fetch(`${API_URL}/notifications/unread-count`, {
          credentials: 'include',
          cache: 'no-store',
        });
        if (res.ok) {
          const data = await res.json();
          setUnreadCount(data.count || 0);
        }
      } catch (err) {
        console.warn("[MenuBar] Failed to fetch unread count", err);
      }
    };

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
              const isCandidateUser = userData.userType === 'candidate' ||
                (Array.isArray(roleSource) && roleSource.length === 0);
              setIsCandidate(isCandidateUser);

              setUser({
                id: userData.id || userData._id || userData.sub,
                role: userRole,
                name: userData.name || userData.workEmail || userData.personalEmail || userData.username || "User",
                userType: userData.userType,
                profilePictureUrl: userData.profilePictureUrl || null
              });
              setIsAuthenticated(true);

              // Only employees have notifications system active
              if (userData.userType !== 'candidate') {
                fetchUnreadCount();
              }
              return;
            } catch (e) {
              console.error("JSON Parse Error", e);
            }
          }
        }

        if (res.status === 401 || res.status === 403) {
          setIsAuthenticated(false);
          setIsCandidate(false);
          setUser(null);
          localStorage.removeItem("token");
          return;
        }

        throw new Error(`Fetch failed: ${res.status}`);

      } catch (error) {
        if (retryCount < 3) {
          setTimeout(() => fetchUser(retryCount + 1), 1000);
        } else {
          setUser((prev) => prev ? { ...prev, name: "Employee" } : { id: "fallback", role: "EMPLOYEE", name: "Employee" });
        }
      }
    };

    if (tokenMarker) {
      fetchUser();
    }

    // Set up polling for unread notifications every 60 seconds
    const interval = setInterval(() => {
      if (isAuthenticated && !isCandidate) {
        fetchUnreadCount();
      }
    }, 60000);

    const handleUpdateEvent = () => {
      if (isAuthenticated && !isCandidate) {
        fetchUnreadCount();
      }
    };
    window.addEventListener('notifications-updated', handleUpdateEvent);

    return () => {
      clearInterval(interval);
      window.removeEventListener('notifications-updated', handleUpdateEvent);
    };
  }, [pathname, isAuthenticated, isCandidate]);

  // Filter nav items based on authentication status and user type
  const visibleNavItems = navItems.filter((item) => {
    // Always show non-auth items
    if (!item.requiresAuth) return true;

    // Must be authenticated for auth-required items
    if (!isAuthenticated) return false;

    // Candidate-only items
    if (item.candidateOnly && !isCandidate) return false;

    // Employee-only items (hide from candidates)
    if (item.employeeOnly && isCandidate) return false;

    return true;
  });

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
          gap: "1rem",
        }}
      >
        <Link
          href="/"
          style={{
            color: "var(--text-primary)",
            fontSize: "1.05rem",
            fontWeight: 700,
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
            gap: "0.4rem",
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
                  padding: "0.45rem 0.65rem",
                  fontSize: "0.825rem",
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

          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Link
              href="/time-management/notifications"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                backgroundColor: "var(--bg-selected)",
                color: "var(--primary-700)",
                textDecoration: "none",
                position: "relative"
              }}
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span style={{
                  position: "absolute",
                  top: "2px",
                  right: "2px",
                  minWidth: "16px",
                  height: "16px",
                  backgroundColor: "#ef4444", // Tailwind red-500
                  borderRadius: "10px",
                  border: "2px solid white",
                  color: "white",
                  fontSize: "9px",
                  fontWeight: 800,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  lineHeight: 1,
                  padding: unreadCount >= 9 ? "0 3px" : "0"
                }}>
                  {unreadCount >= 9 ? "9+" : unreadCount}
                </span>
              )}
            </Link>

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
                onClick={() => router.push(isCandidate ? "/recruitment/my-applications" : "/employee-profile?view=my-profile")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  background: "white",
                  padding: "0.4rem 0.6rem 0.4rem 0.4rem",
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
                  background: user.profilePictureUrl ? "transparent" : "var(--primary-100)",
                  color: "var(--primary-600)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.05)",
                  overflow: "hidden"
                }}>
                  {user.profilePictureUrl ? (
                    <img
                      src={user.profilePictureUrl}
                      alt={user.name || "Profile"}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover"
                      }}
                      onError={(e) => {
                        // Fallback to icon if image fails to load
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement!.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>';
                      }}
                    />
                  ) : (
                    <User size={20} strokeWidth={2.5} />
                  )}
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
        </div>
      </nav>
    </header>
  );
}

// src/admin/components/ui/AdminSidebar.tsx
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useAdminAuth } from "../../hooks/useAdminAuth";
import { Logo } from "@/components/atoms";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
}

interface NavSection {
  section: string;
  items: NavItem[];
}

// ── Icons ────────────────────────────────────────────────────────────────────
const BookIcon = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.9}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);
const GridIcon = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.9}>
    <rect x="3" y="3" width="7" height="7" rx="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const TagIcon = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.9}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
  </svg>
);
const UsersIcon = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.9}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
const PenIcon = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.9}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
  </svg>
);
const ShoppingBagIcon = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.9}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  </svg>
);
const ImageIcon = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.9}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);
const CreditCardIcon = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.9}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
);
const SettingsIcon = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.9}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
const MailIcon = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.9}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);
const HeartIcon = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.9}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);
const ChevronLeftIcon = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
);
const ChevronRightIcon = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);
const LogoutIcon = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.9}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);
const BellIcon = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.9}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

// ── Navigation definition ────────────────────────────────────────────────────
const NAV: NavSection[] = [
  {
    section: "Overview",
    items: [
      { label: "Dashboard", href: "/admin/dashboard", icon: <GridIcon /> },
    ],
  },
  {
    section: "Catalogue",
    items: [
      { label: "Books",      href: "/admin/books",      icon: <BookIcon />  },
      { label: "Categories", href: "/admin/categories", icon: <TagIcon />   },
      { label: "Authors",    href: "/admin/authors",    icon: <PenIcon />   },
    ],
  },
  {
    section: "Commerce",
    items: [
      { label: "Orders",       href: "/admin/orders",       icon: <ShoppingBagIcon /> },
      { label: "Transactions", href: "/admin/transactions", icon: <CreditCardIcon /> },
      { label: "Wishlists",    href: "/admin/wishlists",    icon: <HeartIcon />       },
    ],
  },
  {
    section: "Content",
    items: [
      { label: "Banners", href: "/admin/banners", icon: <ImageIcon /> },
    ],
  },
  {
    section: "Audience",
    items: [
      { label: "Users",       href: "/admin/users",       icon: <UsersIcon /> },
      { label: "Contacts",    href: "/admin/contacts",    icon: <MailIcon />  },
      { label: "Subscribers", href: "/admin/subscribers", icon: <BellIcon />  },
    ],
  },
  {
    section: "System",
    items: [
      { label: "Settings", href: "/admin/settings", icon: <SettingsIcon /> },
    ],
  },
];

// ── Props ────────────────────────────────────────────────────────────────────
interface AdminSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

// ── Component ─────────────────────────────────────────────────────────────────
export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onMobileClose,
}) => {
  const router = useRouter();
  const { logout, user } = useAdminAuth();

  // Close mobile drawer on navigation
  useEffect(() => {
    onMobileClose();
  }, [router.pathname]);

  const isActive = (href: string) =>
    router.pathname === href || router.pathname.startsWith(href + "/");

  const initials = user
    ? `${user.first_name?.charAt(0) ?? ""}${user.last_name?.charAt(0) ?? ""}`.toUpperCase()
    : "AD";
  const fullName = user ? `${user.first_name} ${user.last_name}` : "Admin";

  // ── NavLink ────────────────────────────────────────────────────────────────
  const NavLink = ({ item }: { item: NavItem }) => {
    const active = isActive(item.href);
    return (
      <Link
        href={item.href}
        title={isCollapsed ? item.label : undefined}
        className={active ? "bw-nav-item active" : "bw-nav-item"}
        style={{
          display: "flex",
          alignItems: "center",
          gap: isCollapsed ? 0 : 10,
          padding: isCollapsed ? "10px 0" : "8px 16px",
          justifyContent: isCollapsed ? "center" : "flex-start",
          textDecoration: "none",
          position: "relative",
        }}
      >
        <span
          style={{
            color: active ? "#f75454" : "#7b7b7f",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 18,
            height: 18,
            transition: "color 0.15s ease",
          }}
        >
          {item.icon}
        </span>
        {!isCollapsed && (
          <span style={{ whiteSpace: "nowrap", overflow: "hidden", flex: 1 }}>{item.label}</span>
        )}
        {!isCollapsed && item.badge && (
          <span
            style={{
              fontSize: "0.65rem",
              fontWeight: 700,
              padding: "1px 6px",
              borderRadius: 0,
              background: "#f75454",
              color: "#fff",
              lineHeight: "14px",
              marginLeft: "auto",
            }}
          >
            {item.badge}
          </span>
        )}
      </Link>
    );
  };

  // ── Sidebar body ──────────────────────────────────────────────────────────
  const SidebarContent = () => (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#ffffff" }}>

      {/* ── Brand header ── */}
      <div
        style={{
          padding: isCollapsed ? "16px 0" : "16px 16px",
          borderBottom: "1px solid rgba(0,0,0,0.05)",
          display: "flex",
          alignItems: "center",
          justifyContent: isCollapsed ? "center" : "space-between",
          minHeight: 64,
          background: "#ffffff",
        }}
      >
        {!isCollapsed && (
          <Link href="/admin/dashboard" style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
            <Logo />
          </Link>
        )}
        {isCollapsed && (
          <Link href="/admin/dashboard" style={{ textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="20" viewBox="0 11 14 18">
              <path
                fillRule="evenodd"
                fill="#161619"
                d="M11.672,27.367 C10.736,28.250 9.361,28.691 7.546,28.691 L0.283,28.691 L0.283,11.052 L5.996,11.052 C7.875,11.052 9.314,11.478 10.311,12.328 C11.308,13.178 11.806,14.365 11.806,15.886 C11.806,16.676 11.633,17.374 11.287,17.980 C10.941,18.586 10.431,19.052 9.755,19.377 C11.969,19.988 13.076,21.445 13.076,23.748 C13.076,25.278 12.608,26.484 11.672,27.367 ZM7.827,14.647 C7.420,14.277 6.821,14.092 6.032,14.092 L3.811,14.092 L3.811,18.242 L6.191,18.242 C6.940,18.242 7.501,18.047 7.875,17.656 C8.250,17.266 8.437,16.118 8.437,16.118 C8.437,15.508 8.233,15.018 7.827,14.647 ZM8.876,21.709 C8.445,21.278 7.749,21.062 6.789,21.062 L3.811,21.062 L3.811,25.554 L6.862,25.554 C7.782,25.554 8.455,25.347 8.883,24.932 C9.310,24.517 9.523,23.988 9.523,23.345 C9.523,22.686 9.308,22.140 8.876,21.709 Z"
              />
            </svg>
          </Link>
        )}
        {/* Collapse toggle (desktop only) */}
        <button
          onClick={onToggleCollapse}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 24,
            height: 24,
            background: "#ffffff",
            border: "1px solid rgba(0,0,0,0.08)",
            borderRadius: 0,
            cursor: "pointer",
            color: "#71717a",
            flexShrink: 0,
            padding: 0,
            boxShadow: "none",
            transition: "all 0.15s ease",
          }}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="hidden lg:flex"
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "#161619";
            (e.currentTarget as HTMLButtonElement).style.color = "#ffffff";
            (e.currentTarget as HTMLButtonElement).style.borderColor = "#161619";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "#ffffff";
            (e.currentTarget as HTMLButtonElement).style.color = "#71717a";
            (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(0,0,0,0.08)";
          }}
        >
          {isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </button>
      </div>

      {/* ── Navigation ── */}
      <nav style={{ flex: 1, overflowY: "auto", overflowX: "hidden", paddingTop: 12, paddingBottom: 12 }}>
        {NAV.map((section) => (
          <div key={section.section} style={{ marginBottom: 14 }}>
            {!isCollapsed ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "0 20px 6px",
                }}
              >
                <span
                  style={{
                    fontSize: "0.68rem",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: "#a1a1aa",
                  }}
                >
                  {section.section}
                </span>
              </div>
            ) : (
              <div style={{ height: 12 }} />
            )}
            {section.items.map((item) => (
              <NavLink key={item.href} item={item} />
            ))}
          </div>
        ))}
      </nav>

      {/* ── Footer: user card + logout ── */}
      <div
        style={{
          borderTop: "1px solid rgba(0,0,0,0.05)",
          padding: isCollapsed ? "12px 8px" : "16px 14px",
          background: "#ffffff",
        }}
      >
        {!isCollapsed && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 12,
              padding: "10px 12px",
              borderRadius: 0,
              background: "#f8f9fa",
              border: "1px solid rgba(0,0,0,0.08)",
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                background: "#161619",
                borderRadius: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: "0.72rem",
                fontWeight: 800,
                flexShrink: 0,
                boxShadow: "none",
              }}
            >
              {initials}
            </div>
            <div style={{ overflow: "hidden", flex: 1 }}>
              <p
                style={{
                  margin: 0,
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  color: "#161619",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {fullName}
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: "0.68rem",
                  color: "#71717a",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {user?.email || "admin@bookworm.com"}
              </p>
            </div>
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: 0,
                background: "#22c55e",
                flexShrink: 0,
                boxShadow: "none",
              }}
            />
          </div>
        )}
        <button
          onClick={() => logout()}
          title={isCollapsed ? "Sign out" : undefined}
          style={{
            display: "flex",
            alignItems: "center",
            gap: isCollapsed ? 0 : 8,
            justifyContent: isCollapsed ? "center" : "flex-start",
            width: "100%",
            padding: isCollapsed ? "8px 0" : "8px 12px",
            background: "transparent",
            border: "1px solid rgba(0,0,0,0.08)",
            borderRadius: 0,
            cursor: "pointer",
            color: "#71717a",
            fontSize: "0.8rem",
            fontWeight: 500,
            transition: "all 0.15s ease",
          }}
          onMouseEnter={(e) => {
            const btn = e.currentTarget;
            btn.style.background = "#fff5f5";
            btn.style.color = "#f75454";
            btn.style.borderColor = "rgba(247,84,84,0.15)";
          }}
          onMouseLeave={(e) => {
            const btn = e.currentTarget;
            btn.style.background = "transparent";
            btn.style.color = "#71717a";
            btn.style.borderColor = "rgba(0,0,0,0.08)";
          }}
        >
          <LogoutIcon />
          {!isCollapsed && <span>Sign out</span>}
        </button>
      </div>
    </div>
  );

  const sidebarStyle: React.CSSProperties = {
    width: isCollapsed ? 56 : 240,
    minWidth: isCollapsed ? 56 : 240,
    background: "#ffffff",
    borderRight: "1px solid rgba(0,0,0,0.07)",
    flexDirection: "column",
    transition: "width 0.22s cubic-bezier(.4,0,.2,1), min-width 0.22s cubic-bezier(.4,0,.2,1)",
    overflow: "hidden",
    position: "sticky",
    top: 0,
    height: "100vh",
    zIndex: 30,
    boxShadow: "1px 0 0 rgba(0,0,0,0.04)",
  };

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:flex" style={sidebarStyle}>
        <SidebarContent />
      </div>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <>
          <div
            className="lg:hidden"
            onClick={onMobileClose}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(22,22,25,0.5)",
              zIndex: 40,
              backdropFilter: "blur(3px)",
            }}
          />
          <div
            className="lg:hidden"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              bottom: 0,
              width: 260,
              background: "#ffffff",
              borderRight: "1px solid rgba(0,0,0,0.07)",
              zIndex: 50,
              display: "flex",
              flexDirection: "column",
              boxShadow: "6px 0 32px rgba(0,0,0,0.15)",
            }}
          >
            <SidebarContent />
          </div>
        </>
      )}
    </>
  );
};

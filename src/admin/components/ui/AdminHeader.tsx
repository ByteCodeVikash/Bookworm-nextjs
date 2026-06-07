// src/admin/components/ui/AdminHeader.tsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useAdminAuth } from "../../hooks/useAdminAuth";
import { useRouter } from "next/router";
import Link from "next/link";

const QUICK_LINKS = [
  { label: "Dashboard",    href: "/admin/dashboard",    cat: "Overview"  },
  { label: "Books",        href: "/admin/books",        cat: "Catalogue" },
  { label: "Categories",   href: "/admin/categories",   cat: "Catalogue" },
  { label: "Authors",      href: "/admin/authors",      cat: "Catalogue" },
  { label: "Orders",       href: "/admin/orders",       cat: "Commerce"  },
  { label: "Transactions", href: "/admin/transactions", cat: "Commerce"  },
  { label: "Wishlists",    href: "/admin/wishlists",    cat: "Commerce"  },
  { label: "Banners",      href: "/admin/banners",      cat: "Content"   },
  { label: "Users",        href: "/admin/users",        cat: "Audience"  },
  { label: "Contacts",     href: "/admin/contacts",     cat: "Audience"  },
  { label: "Subscribers",  href: "/admin/subscribers",  cat: "Audience"  },
  { label: "Settings",     href: "/admin/settings",     cat: "System"    },
];

interface AdminHeaderProps {
  onToggleSidebar: () => void;
}

interface NotificationItem {
  id: number;
  type: "order" | "stock" | "message" | "system";
  text: string;
  time: string;
  unread: boolean;
}

const MOCK_NOTIFICATIONS: NotificationItem[] = [
  { id: 1, type: "order",   text: "New Order #ORD-2894 received from Sarah Connor",       time: "5m ago",  unread: true  },
  { id: 2, type: "stock",   text: "Low stock alert: 'React 19 & Next.js 15 Guide' (1 left)", time: "2h ago",  unread: true  },
  { id: 3, type: "message", text: "Message from John Doe: 'Inquiry on bulk discounts'",  time: "4h ago",  unread: false },
  { id: 4, type: "system",  text: "System backup completed successfully",                  time: "1d ago",  unread: false },
];

const PAGE_TITLES: Record<string, string> = {
  "/admin/dashboard":    "Dashboard",
  "/admin/books":        "Books",
  "/admin/categories":   "Categories",
  "/admin/authors":      "Authors",
  "/admin/orders":       "Orders",
  "/admin/transactions": "Transactions",
  "/admin/banners":      "Banners",
  "/admin/users":        "Users",
  "/admin/contacts":     "Contacts",
  "/admin/wishlists":    "Wishlists",
  "/admin/settings":     "Settings",
};

export const AdminHeader: React.FC<AdminHeaderProps> = ({ onToggleSidebar }) => {
  const { user, logout } = useAdminAuth();
  const router = useRouter();

  const [isProfileOpen,       setIsProfileOpen]       = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications,       setNotifications]       = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);
  const [searchQuery,         setSearchQuery]         = useState("");
  const [isSearchOpen,        setIsSearchOpen]        = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const filteredLinks = QUICK_LINKS.filter(
    (l) =>
      searchQuery.trim() === "" ||
      l.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.cat.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setIsProfileOpen(false);
      if (notifRef.current   && !notifRef.current.contains(e.target as Node))   setIsNotificationsOpen(false);
      if (searchRef.current  && !searchRef.current.contains(e.target as Node))  setIsSearchOpen(false);
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const handleSearchNav = useCallback((href: string) => {
    setIsSearchOpen(false);
    setSearchQuery("");
    router.push(href);
  }, [router]);

  const getPageTitle = () => {
    // Exact match first
    if (PAGE_TITLES[router.pathname]) return PAGE_TITLES[router.pathname];
    // Book edit/new routes
    if (router.pathname.startsWith("/admin/books/")) return "Book Form";
    if (router.pathname.startsWith("/admin/orders/")) return "Order Detail";
    const segs = router.pathname.split("/").filter(Boolean);
    return segs[1] ? segs[1].charAt(0).toUpperCase() + segs[1].slice(1) : "Dashboard";
  };

  const unreadCount = notifications.filter((n) => n.unread).length;
  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));

  // Type icon for notification
  const typeColor = (type: NotificationItem["type"]) => {
    if (type === "order")   return "#161619";
    if (type === "stock")   return "#f75454";
    if (type === "message") return "#7c6e65";
    return "#7f7f83";
  };

  return (
    <header
      className="shrink-0 flex items-center justify-between px-4 sm:px-6 sticky top-0 bg-white"
      style={{
        height: 60,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#ffffff",
        borderBottom: "1px solid rgba(0,0,0,0.08)",
        boxShadow: "none",
        zIndex: 30,
        isolation: "auto",
        position: "sticky",
        top: 0,
        width: "100%",
      }}
    >
      {/* Left — Hamburger + Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-md transition-colors cursor-pointer shrink-0"
          style={{ color: "#7c6e65" }}
          aria-label="Open navigation"
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#f8f9fa"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="min-w-0">
          <h1
            className="text-base sm:text-lg font-bold tracking-tight truncate"
            style={{ color: "#161619", letterSpacing: "-0.01em" }}
          >
            {getPageTitle()}
          </h1>
          <p className="hidden sm:block text-[10px] font-medium uppercase tracking-widest" style={{ color: "#7f7f83" }}>
            Bookworm Admin Console
          </p>
        </div>
      </div>

      {/* Centre — Global Search (desktop) */}
      <div ref={searchRef} className="hidden md:block relative" style={{ width: 260 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "0 12px",
            height: 36,
            border: `1px solid ${isSearchOpen ? "#f75454" : "rgba(0,0,0,0.1)"}`,
            borderRadius: 0,
            background: isSearchOpen ? "#fff" : "#f8f9fa",
            transition: "all 0.15s ease",
            boxShadow: "none",
          }}
        >
          <svg width="14" height="14" fill="none" stroke="#9e9aa8" viewBox="0 0 24 24" strokeWidth={2} style={{ flexShrink: 0 }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search pages…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchOpen(true)}
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              background: "transparent",
              fontSize: "0.8rem",
              color: "#161619",
              fontFamily: "inherit",
            }}
            aria-label="Search admin pages"
          />
          <kbd
            style={{
              fontSize: "0.6rem",
              fontWeight: 700,
              color: "#b0aab6",
              background: "rgba(0,0,0,0.05)",
              border: "1px solid rgba(0,0,0,0.08)",
              borderRadius: 0,
              padding: "1px 5px",
              fontFamily: "monospace",
              flexShrink: 0,
            }}
          >
            /
          </kbd>
        </div>

        {/* Search dropdown */}
        {isSearchOpen && (
          <div
            style={{
              position: "absolute",
              top: "calc(100% + 6px)",
              left: 0,
              right: 0,
              background: "#fff",
              border: "1px solid rgba(0,0,0,0.09)",
              borderRadius: 0,
              boxShadow: "none",
              zIndex: 50,
              overflow: "hidden",
              maxHeight: 300,
              overflowY: "auto",
            }}
          >
            {filteredLinks.length === 0 ? (
              <div style={{ padding: "16px", textAlign: "center", fontSize: "0.8rem", color: "#b0aab6" }}>
                No pages found
              </div>
            ) : (
              filteredLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleSearchNav(link.href)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    padding: "9px 14px",
                    border: "none",
                    borderBottom: "1px solid rgba(0,0,0,0.04)",
                    background: "transparent",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "background 0.12s",
                    fontFamily: "inherit",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#f8f9fa"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
                >
                  <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "#161619" }}>{link.label}</span>
                  <span
                    style={{
                      fontSize: "0.6rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.07em",
                      color: "#9e9aa8",
                      background: "#f5f4f8",
                      padding: "2px 6px",
                      borderRadius: 0,
                    }}
                  >
                    {link.cat}
                  </span>
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {/* Right — Notifications + Profile */}
      <div className="flex items-center gap-2 sm:gap-3">

        {/* Visit Store — always visible on sm+ */}
        <Link
          href="/"
          target="_blank"
          className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-none transition-all shrink-0"
          style={{
            color: "#161619",
            border: "1px solid rgba(0,0,0,0.12)",
            textDecoration: "none",
            whiteSpace: "nowrap",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "#f8f9fa"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; }}
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          View Store
        </Link>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotificationsOpen((p) => !p)}
            className="relative p-2 rounded-none transition-colors cursor-pointer"
            style={{ color: "#7c6e65", border: "1px solid rgba(0,0,0,0.08)" }}
            aria-label="Notifications"
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#f8f9fa"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
          >
            <svg className="w-4.5 h-4.5 w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {unreadCount > 0 && (
              <span
                className="absolute -top-1 -right-1 min-w-[18px] h-[18px] text-[9px] font-black text-white rounded-none flex items-center justify-center px-1"
                style={{ background: "#f75454", border: "2px solid #fff" }}
              >
                {unreadCount}
              </span>
            )}
          </button>

          {isNotificationsOpen && (
            <div
              className="absolute right-0 mt-2 w-80 bg-white overflow-hidden z-30"
              style={{
                border: "1px solid rgba(0,0,0,0.09)",
                borderRadius: 0,
                boxShadow: "none",
              }}
            >
              <div
                className="flex items-center justify-between px-4 py-2.5"
                style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}
              >
                <span className="text-xs font-bold" style={{ color: "#161619" }}>Notifications</span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-[10px] font-bold cursor-pointer transition-colors"
                    style={{ color: "#f75454" }}
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="overflow-y-auto" style={{ maxHeight: 260 }}>
                {notifications.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start gap-3 px-4 py-3 cursor-default"
                    style={{
                      background: item.unread ? "#fff9f9" : "#fff",
                      borderBottom: "1px solid rgba(0,0,0,0.05)",
                    }}
                  >
                    <div
                      className="w-1.5 h-1.5 rounded-none mt-1.5 shrink-0"
                      style={{ background: item.unread ? typeColor(item.type) : "transparent" }}
                    />
                    <div className="flex-1">
                      <p className="text-xs font-medium leading-snug" style={{ color: "#161619" }}>{item.text}</p>
                      <p className="text-[10px] mt-0.5 font-semibold" style={{ color: "#7f7f83" }}>{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="px-4 py-2.5 text-center" style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}>
                <Link
                  href="/admin/contacts"
                  onClick={() => setIsNotificationsOpen(false)}
                  className="text-[10px] font-bold uppercase tracking-wider transition-colors"
                  style={{ color: "#7c6e65", textDecoration: "none" }}
                >
                  View All Inquiries →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        {user && (
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileOpen((p) => !p)}
              className="flex items-center gap-2 p-1 sm:pr-2.5 rounded-none transition-all cursor-pointer"
              style={{
                border: "1px solid rgba(0,0,0,0.08)",
                background: isProfileOpen ? "#f8f9fa" : "transparent",
              }}
              aria-label="Profile"
            >
              {/* Avatar */}
              <div
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-none flex items-center justify-center text-xs font-black text-white shrink-0"
                style={{ background: "#161619", letterSpacing: "0.02em" }}
              >
                {user.first_name.charAt(0)}{user.last_name.charAt(0)}
              </div>
              <div className="hidden sm:flex flex-col text-left leading-none">
                <span className="text-xs font-bold" style={{ color: "#161619" }}>
                  {user.first_name} {user.last_name}
                </span>
                <span className="text-[10px] font-medium mt-0.5" style={{ color: "#7f7f83" }}>
                  Administrator
                </span>
              </div>
              <svg
                className="w-3.5 h-3.5 hidden sm:block transition-transform duration-150"
                style={{ color: "#7c6e65", transform: isProfileOpen ? "rotate(180deg)" : "none" }}
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isProfileOpen && (
              <div
                className="absolute right-0 mt-2 w-52 bg-white z-30 overflow-hidden"
                style={{
                  border: "1px solid rgba(0,0,0,0.09)",
                  borderRadius: 0,
                  boxShadow: "none",
                }}
              >
                {/* Mobile only full name */}
                <div className="sm:hidden px-4 py-3" style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                  <p className="text-xs font-bold" style={{ color: "#161619" }}>{user.first_name} {user.last_name}</p>
                  <p className="text-[10px] mt-0.5" style={{ color: "#7f7f83" }}>{user.email}</p>
                </div>

                {[
                  { href: "/admin/settings", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z", label: "Settings" },
                  { href: "/admin/users", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z", label: "Manage Users" },
                ].map(({ href, icon, label }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold transition-colors"
                    style={{ color: "#7c6e65", textDecoration: "none" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "#f8f9fa"; (e.currentTarget as HTMLAnchorElement).style.color = "#161619"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; (e.currentTarget as HTMLAnchorElement).style.color = "#7c6e65"; }}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
                    </svg>
                    {label}
                  </Link>
                ))}

                <div style={{ borderTop: "1px solid rgba(0,0,0,0.06)", margin: "4px 0" }} />

                <button
                  onClick={logout}
                  className="flex items-center gap-2.5 w-full text-left px-4 py-2.5 text-xs font-bold transition-colors cursor-pointer"
                  style={{ color: "#f75454", background: "transparent" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#fff5f5"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign Out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

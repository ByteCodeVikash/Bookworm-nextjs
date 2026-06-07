// src/admin/layouts/AdminLayout.tsx
import React from "react";
import { useRouter } from "next/router";
import { AdminAuthProvider, useAdminAuth } from "../hooks/useAdminAuth";
import { AdminSidebar } from "../components/ui/AdminSidebar";
import { AdminHeader } from "../components/ui/AdminHeader";

const GuardedContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAdminAuth();
  const router = useRouter();

  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const isLoginPage = router.pathname === "/admin/login";

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#f8f9fa" }}>
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
            style={{ borderColor: "#161619", borderTopColor: "transparent" }}
          />
          <span className="text-sm font-medium" style={{ color: "#7c6e65" }}>Loading...</span>
        </div>
      </div>
    );
  }

  // If we are on the login page, render without the admin panel grid shell
  if (isLoginPage) {
    return <>{children}</>;
  }

  // If not authenticated and not on login page, render nothing (effect handles redirect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen font-sans overflow-hidden" style={{ background: "#f8f9fa" }}>
      {/* Sidebar navigation */}
      <AdminSidebar
        isCollapsed={isCollapsed}
        isMobileOpen={isSidebarOpen}
        onMobileClose={() => setIsSidebarOpen(false)}
        onToggleCollapse={() => setIsCollapsed((prev) => !prev)}
      />

      {/* Main viewport */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto overflow-x-hidden" style={{ isolation: "isolate" }}>
        <AdminHeader onToggleSidebar={() => setIsSidebarOpen(true)} />
        <main
          className="p-4 sm:p-6 lg:p-8 flex-1 w-full mx-auto"
          style={{ maxWidth: 1280, isolation: "isolate", position: "relative", zIndex: 0 }}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AdminAuthProvider>
      <GuardedContent>{children}</GuardedContent>
    </AdminAuthProvider>
  );
};

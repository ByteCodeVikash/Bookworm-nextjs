import React, { useState } from "react";
import { SidebarCart, SidebarAccount, SidebarCategories } from "@/components/organisms";

import { useSiteConfig } from "@/contexts/ConfigContext";
import { resolveHeader, resolveFooter } from "../resolvers";

interface DynamicLayoutShellProps {
  children: React.ReactNode;
}

export const DynamicLayoutShell: React.FC<DynamicLayoutShellProps> = ({ children }) => {
  const { config } = useSiteConfig();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);

  const closeAll = () => {
    setIsCartOpen(false);
    setIsAccountOpen(false);
    setIsCategoriesOpen(false);
  };

  const isAnyOpen = isCartOpen || isAccountOpen || isCategoriesOpen;

  // Resolve header and footer components based on config using resolvers
  const HeaderComponent = resolveHeader(config.headerVersion);
  const FooterComponent = resolveFooter(config.footerVersion);

  return (
    <div className="main-layout position-relative">
      {/* Dynamic Header Section */}
      <header id="header" className="u-header u-header--static bg-white">
        {React.createElement(HeaderComponent, {
          onToggleCart: () => setIsCartOpen(true),
          onToggleAccount: () => setIsAccountOpen(true),
          onToggleCategories: () => setIsCategoriesOpen(true)
        })}
      </header>

      {/* Main Content Area */}
      <main id="content" role="main">
        {children}
      </main>

      {/* Dynamic Footer Section */}
      {React.createElement(FooterComponent)}

      {/* Interactive Customizer Drawer removed to match reference site */}

      {/* Sidebars off-canvas Drawers */}
      <SidebarCart isOpen={isCartOpen} onClose={closeAll} />
      <SidebarAccount isOpen={isAccountOpen} onClose={closeAll} />
      <SidebarCategories isOpen={isCategoriesOpen} onClose={closeAll} />

      {/* Global Sidebar Overlay */}
      {isAnyOpen && (
        <div
          className="u-sidebar-bg-overlay active"
          onClick={closeAll}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            zIndex: 9990,
            cursor: "pointer",
            transition: "opacity 0.3s ease"
          }}
        />
      )}
    </div>
  );
};

export default DynamicLayoutShell;


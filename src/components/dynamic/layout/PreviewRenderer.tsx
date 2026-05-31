import React, { useState } from "react";
import { resolveHeader, resolveFooter, resolveLayout } from "../resolvers";
import { SidebarCart, SidebarAccount, SidebarCategories } from "@/components/organisms";

export interface PreviewConfig {
  header: string;
  footer: string;
  layout: string;
}

interface PreviewRendererProps {
  config: PreviewConfig;
}

export const PreviewRenderer: React.FC<PreviewRendererProps> = ({ config }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);

  const closeAll = () => {
    setIsCartOpen(false);
    setIsAccountOpen(false);
    setIsCategoriesOpen(false);
  };

  const isAnyOpen = isCartOpen || isAccountOpen || isCategoriesOpen;

  // Resolve components dynamically using resolvers
  const HeaderComponent = resolveHeader(config.header);
  const LayoutComponent = resolveLayout(config.layout);
  const FooterComponent = resolveFooter(config.footer);

  return (
    <div className="preview-renderer main-layout position-relative">
      {/* Header resolved element */}
      <header id="header" className="u-header u-header--static bg-white">
        {React.createElement(HeaderComponent, {
          onToggleCart: () => setIsCartOpen(true),
          onToggleAccount: () => setIsAccountOpen(true),
          onToggleCategories: () => setIsCategoriesOpen(true)
        })}
      </header>

      {/* Homepage layout resolved element */}
      <main id="content" role="main">
        {React.createElement(LayoutComponent)}
      </main>

      {/* Footer resolved element */}
      {React.createElement(FooterComponent)}

      {/* Sidebar Overlays */}
      <SidebarCart isOpen={isCartOpen} onClose={closeAll} />
      <SidebarAccount isOpen={isAccountOpen} onClose={closeAll} />
      <SidebarCategories isOpen={isCategoriesOpen} onClose={closeAll} />

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

export default PreviewRenderer;

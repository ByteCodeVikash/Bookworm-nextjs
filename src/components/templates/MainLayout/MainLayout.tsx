"use client";

import React, { useState } from "react";
import { MainLayoutProps } from "./types";
import { TopHeader, MainHeader, SidebarCart, SidebarAccount, SidebarCategories, Footer } from "@/components/organisms";

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);

  const closeAll = () => {
    setIsCartOpen(false);
    setIsAccountOpen(false);
    setIsCategoriesOpen(false);
  };

  const isAnyOpen = isCartOpen || isAccountOpen || isCategoriesOpen;

  return (
    <div className="main-layout position-relative">
      {/* Header Pipeline */}
      <header id="header" className="u-header u-header--static">
        <TopHeader
          onToggleCart={() => setIsCartOpen(true)}
          onToggleAccount={() => setIsAccountOpen(true)}
        />
        <MainHeader
          onToggleCategories={() => setIsCategoriesOpen(true)}
          onToggleCart={() => setIsCartOpen(true)}
          onToggleAccount={() => setIsAccountOpen(true)}
        />
      </header>

      {/* Main Content Area */}
      <main id="content" role="main">
        {children}
      </main>

      {/* Footer Component */}
      <Footer />

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
export default MainLayout;

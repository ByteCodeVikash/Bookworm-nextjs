"use client";

import React from "react";
import { SidebarCategoriesProps } from "./types";
import { Icon } from "@/components/atoms";

export const SidebarCategories: React.FC<SidebarCategoriesProps> = ({ isOpen, onClose }) => {
  const categoriesList = [
    { name: "Arts & Photography", icon: "flaticon-gallery" },
    { name: "Biographies", icon: "flaticon-resume" },
    { name: "Business & Money", icon: "flaticon-calculator" },
    { name: "Children's Books", icon: "flaticon-boy" },
    { name: "Computers & Technology", icon: "flaticon-laptop" },
    { name: "Cookbooks, Food & Wine", icon: "flaticon-cook" },
    { name: "Crafts, Hobbies & Home", icon: "flaticon-house" },
    { name: "Education & Teaching", icon: "flaticon-graduation-cap" },
    { name: "Health, Fitness & Dieting", icon: "flaticon-doctor" },
    { name: "History", icon: "flaticon-compass" }
  ];

  return (
    <aside
      className={`u-sidebar u-sidebar__md u-sidebar--left transition-all ${isOpen ? "active" : ""}`}
      style={{
        display: "block",
        transform: isOpen ? "translate3d(0, 0, 0)" : "translate3d(-100%, 0, 0)",
        visibility: isOpen ? "visible" : "hidden",
        transition: "transform 0.3s ease, visibility 0.3s ease",
        zIndex: 9999
      }}
    >
      <div className="u-sidebar__scroller">
        <div className="u-sidebar__container">
          <div className="u-header-sidebar__footer-offset">
            {/* Header */}
            <header className="border-bottom px-4 px-md-5 py-4 d-flex align-items-center justify-content-between">
              <h2 className="font-size-3 mb-0">SHOP BY CATEGORY</h2>
              <button
                onClick={onClose}
                type="button"
                className="close"
                aria-label="Close Sidebar"
              >
                <span><Icon name="fas fa-times" /></span>
              </button>
            </header>

            {/* Body */}
            <div className="u-sidebar__body">
              <div className="u-sidebar__content u-header-sidebar__content">
                <nav className="js-scrollbar">
                  <ul className="list-unstyled mb-0 px-4 px-md-5 py-3">
                    {categoriesList.map((cat, idx) => (
                      <li key={idx} className="py-2 border-bottom" style={{ listStyleType: "none" }}>
                        <a href="#" className="text-dark d-flex align-items-center justify-content-between h-primary py-2 text-decoration-none">
                          <span className="d-flex align-items-center">
                            <Icon name={`${cat.icon} mr-3 font-size-5`} />
                            {cat.name}
                          </span>
                          <Icon name="fas fa-chevron-right font-size-1 text-gray-400" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
export default SidebarCategories;

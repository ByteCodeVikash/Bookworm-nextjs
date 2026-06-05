"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SidebarCategoriesProps } from "./types";
import { Icon } from "@/components/atoms";

export const SidebarCategories: React.FC<SidebarCategoriesProps> = ({ isOpen, onClose }) => {
  const [isPagesExpanded, setIsPagesExpanded] = useState(false);

  const categoriesList = [
    { name: "Arts & Photography", icon: "flaticon-gallery" },
    { name: "Biographies", icon: "flaticon-resume" },
    { name: "Business & Money", icon: "flaticon-credit" },
    { name: "Children's Books", icon: "flaticon-baby-boy" },
    { name: "Computers & Technology", icon: "fas fa-laptop" },
    { name: "Cookbooks, Food & Wine", icon: "flaticon-cook" },
    { name: "Crafts, Hobbies & Home", icon: "fas fa-home" },
    { name: "Education & Teaching", icon: "fas fa-graduation-cap" },
    { name: "Health, Fitness & Dieting", icon: "flaticon-doctor" },
    { name: "History", icon: "flaticon-history" }
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
              <h2 className="font-size-3 mb-0">NAVIGATION &amp; CATEGORIES</h2>
              <button
                onClick={onClose}
                type="button"
                className="close text-dark border-0 bg-transparent"
                aria-label="Close Sidebar"
                style={{ fontSize: "1.5rem", outline: "none" }}
              >
                <span><Icon name="fas fa-times" /></span>
              </button>
            </header>

            {/* Body */}
            <div className="u-sidebar__body">
              <div className="u-sidebar__content u-header-sidebar__content">
                <nav className="js-scrollbar">
                  {/* Section 1: Main Navigation Links */}
                  <div className="border-bottom pb-3 mb-3">
                    <h5 className="font-size-1 text-gray-500 text-uppercase px-4 px-md-5 pt-3 mb-2 font-weight-bold">Menu</h5>
                    <ul className="list-unstyled mb-0 px-4 px-md-5">
                      <li className="py-2" style={{ listStyleType: "none" }}>
                        <Link href="/" onClick={onClose} className="text-dark d-flex align-items-center h-primary py-1 text-decoration-none font-weight-medium">
                          <Icon name="fas fa-home mr-3 font-size-3 text-gray-500" />
                          Home
                        </Link>
                      </li>
                      <li className="py-2" style={{ listStyleType: "none" }}>
                        <Link href="/" onClick={onClose} className="text-dark d-flex align-items-center h-primary py-1 text-decoration-none font-weight-medium">
                          <Icon name="fas fa-shopping-bag mr-3 font-size-3 text-gray-500" />
                          Shop
                        </Link>
                      </li>
                      <li className="py-2" style={{ listStyleType: "none" }}>
                        <Link href="/my-account" onClick={onClose} className="text-dark d-flex align-items-center h-primary py-1 text-decoration-none font-weight-medium">
                          <Icon name="fas fa-user mr-3 font-size-3 text-gray-500" />
                          My Account
                        </Link>
                      </li>
                      <li className="py-2" style={{ listStyleType: "none" }}>
                        <button
                          onClick={() => setIsPagesExpanded(!isPagesExpanded)}
                          className="btn btn-link p-0 text-dark w-100 d-flex align-items-center justify-content-between h-primary py-1 text-decoration-none font-weight-medium"
                          style={{ border: "none", background: "none", boxShadow: "none", textAlign: "left" }}
                        >
                          <span className="d-flex align-items-center">
                            <Icon name="fas fa-file-alt mr-3 font-size-3 text-gray-500" />
                            Pages
                          </span>
                          <Icon name={`fas fa-chevron-${isPagesExpanded ? "down" : "right"} font-size-1 text-gray-400`} />
                        </button>
                        {isPagesExpanded && (
                          <ul className="list-unstyled pl-4 mt-2 mb-0 bg-light border-left py-2">
                            <li className="py-1" style={{ listStyleType: "none" }}>
                              <Link href="/about" onClick={onClose} className="text-gray-700 d-block py-1 px-3 h-primary text-decoration-none font-size-2">
                                About Us
                              </Link>
                            </li>
                            <li className="py-1" style={{ listStyleType: "none" }}>
                              <Link href="/contact" onClick={onClose} className="text-gray-700 d-block py-1 px-3 h-primary text-decoration-none font-size-2">
                                Contact Us
                              </Link>
                            </li>
                            <li className="py-1" style={{ listStyleType: "none" }}>
                              <Link href="/faq" onClick={onClose} className="text-gray-700 d-block py-1 px-3 h-primary text-decoration-none font-size-2">
                                FAQ
                              </Link>
                            </li>
                          </ul>
                        )}
                      </li>
                    </ul>
                  </div>

                  {/* Section 2: Shop by Category */}
                  <div>
                    <h5 className="font-size-1 text-gray-500 text-uppercase px-4 px-md-5 mb-2 font-weight-bold">Shop By Category</h5>
                    <ul className="list-unstyled mb-0 px-4 px-md-5">
                      {categoriesList.map((cat, idx) => (
                        <li key={idx} className="py-2 border-bottom" style={{ listStyleType: "none" }}>
                          <Link href="/" onClick={onClose} className="text-dark d-flex align-items-center justify-content-between h-primary py-2 text-decoration-none">
                            <span className="d-flex align-items-center">
                              <Icon name={`${cat.icon} mr-3 font-size-5`} />
                              {cat.name}
                            </span>
                            <Icon name="fas fa-chevron-right font-size-1 text-gray-400" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
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

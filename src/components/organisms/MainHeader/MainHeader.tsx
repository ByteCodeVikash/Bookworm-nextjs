"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MainHeaderProps } from "./types";
import { Logo, Icon } from "@/components/atoms";
import { SearchBar } from "@/components/molecules";
import { useCart } from "@/contexts/CartContext";
import { useStoreSettings } from "@/contexts/StoreSettingsContext";

export const MainHeader: React.FC<MainHeaderProps> = ({
  onToggleCategories,
  onToggleCart,
  onToggleAccount
}) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { cartItems } = useCart();
  const { categories } = useStoreSettings();
  const totalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const toggleDropdown = (menuName: string) => {
    if (activeDropdown === menuName) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(menuName);
    }
  };

  return (
    <div className="masthead border-bottom position-relative" style={{ marginBottom: "-1px" }}>
      <div className="container-fluid px-3 px-md-5 px-xl-8d75 py-2 py-md-0">
        <div className="d-flex align-items-center position-relative flex-wrap">
          {/* Categories Toggler */}
          <div className="offcanvas-toggler mr-4 mr-lg-8">
            <a
              id="offcanvasNavToggler"
              href="javascript:;"
              role="button"
              onClick={(e) => {
                e.preventDefault();
                onToggleCategories();
              }}
              className="cat-menu text-dark d-block"
              aria-label="Toggle Categories Menu"
            >
              <svg width="20px" height="18px">
                <path fillRule="evenodd" fill="rgb(25, 17, 11)" d="M-0.000,-0.000 L20.000,-0.000 L20.000,2.000 L-0.000,2.000 L-0.000,-0.000 Z" />
                <path fillRule="evenodd" fill="rgb(25, 17, 11)" d="M-0.000,8.000 L15.000,8.000 L15.000,10.000 L-0.000,10.000 L-0.000,8.000 Z" />
                <path fillRule="evenodd" fill="rgb(25, 17, 11)" d="M-0.000,16.000 L20.000,16.000 L20.000,18.000 L-0.000,18.000 L-0.000,16.000 Z" />
              </svg>
            </a>
          </div>

          {/* Branding Logo */}
          <div className="site-branding pr-md-4">
            <Link href="/" className="d-block mb-1">
              <Logo />
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="site-navigation mr-auto d-none d-xl-block">
            <ul className="nav">
              <li className="nav-item" style={{ listStyleType: "none" }}>
                <Link
                  href="/"
                  className="nav-link link-black-100 mx-4 px-0 py-5 font-weight-medium d-flex align-items-center"
                >
                  Home
                </Link>
              </li>

              <li
                className={`nav-item dropdown ${activeDropdown === "categories" ? "show" : ""}`}
                onMouseEnter={() => setActiveDropdown("categories")}
                onMouseLeave={() => setActiveDropdown(null)}
                style={{ listStyleType: "none" }}
              >
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleDropdown("categories");
                  }}
                  className="dropdown-toggle nav-link link-black-100 mx-4 px-0 py-5 font-weight-medium d-flex align-items-center"
                >
                  Categories
                </a>
                <ul
                  className={`dropdown-unfold dropdown-menu font-size-2 rounded-0 border-gray-900 ${
                    activeDropdown === "categories" ? "show" : ""
                  }`}
                  style={{
                    listStyleType: "none",
                    minWidth: "270px",
                    padding: "15px 0",
                    margin: 0,
                    top: "100%",
                    left: 0,
                    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.08)",
                  }}
                >
                  {categories.length > 0 ? (
                    categories.map((cat) => (
                      <li key={cat.id} style={{ listStyleType: "none" }}>
                        <Link
                          href={`/shop?category=${encodeURIComponent(cat.name)}`}
                          className="dropdown-item link-black-100 d-flex align-items-center py-2 px-4"
                          style={{ transition: "all 0.2s ease" }}
                        >
                          <span>{cat.name}</span>
                          {cat.booksCount !== undefined && (
                            <span className="ml-auto text-gray-500 font-size-1">({cat.booksCount})</span>
                          )}
                        </Link>
                      </li>
                    ))
                  ) : (
                    // Skeleton placeholders while loading
                    Array.from({ length: 5 }).map((_, i) => (
                      <li key={i} style={{ listStyleType: "none" }}>
                        <span className="dropdown-item py-2 px-4">
                          <span className="d-inline-block bg-gray-200" style={{ width: "60%", height: "14px", borderRadius: "2px" }}></span>
                        </span>
                      </li>
                    ))
                  )}
                </ul>
              </li>

              <li className="nav-item" style={{ listStyleType: "none" }}>
                <Link
                  href="/shop"
                  className="nav-link link-black-100 mx-4 px-0 py-5 font-weight-medium d-flex align-items-center"
                >
                  Shop
                </Link>
              </li>

              <li className="nav-item" style={{ listStyleType: "none" }}>
                <Link
                  href="/about"
                  className="nav-link link-black-100 mx-4 px-0 py-5 font-weight-medium d-flex align-items-center"
                >
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* SearchBar Input Section */}
          <div className="site-search ml-xl-0 ml-md-auto w-r-100">
            <SearchBar variant="v1" />
          </div>

          {/* Mobile Actions toggler */}
          <div className="d-flex d-xl-none align-items-center ml-auto">
            <button
              onClick={onToggleAccount}
              className="btn btn-link link-black-100 border-0 p-2"
              aria-label="Toggle Account"
            >
              <Icon name="flaticon-user" className="font-size-5" />
            </button>
            <button
              onClick={onToggleCart}
              className="btn btn-link link-black-100 border-0 p-2 position-relative"
              aria-label="Toggle Cart"
            >
              <span className="position-absolute bg-dark width-16 height-16 rounded-circle d-flex align-items-center justify-content-center text-white font-size-n9 right-0" style={{ top: "0" }}>
                {totalCount}
              </span>
              <Icon name="flaticon-icon-126515" className="font-size-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default MainHeader;

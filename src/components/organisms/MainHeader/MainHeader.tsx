"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MainHeaderProps } from "./types";
import { Logo, Icon } from "@/components/atoms";
import { SearchBar } from "@/components/molecules";
import { useCart } from "@/contexts/CartContext";

export const MainHeader: React.FC<MainHeaderProps> = ({
  onToggleCategories,
  onToggleCart,
  onToggleAccount
}) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { cartItems } = useCart();
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
              <li
                className={`nav-item dropdown ${activeDropdown === "home" ? "show" : ""}`}
                onMouseEnter={() => setActiveDropdown("home")}
                onMouseLeave={() => setActiveDropdown(null)}
                style={{ listStyleType: "none" }}
              >
                <Link
                  href="/"
                  className="dropdown-toggle nav-link link-black-100 mx-4 px-0 py-5 font-weight-medium d-flex align-items-center"
                >
                  Home
                </Link>
                <ul className={`dropdown-unfold dropdown-menu font-size-2 rounded-0 border-gray-900 ${activeDropdown === "home" ? "show" : ""}`} style={{ listStyleType: "none" }}>
                  <li style={{ listStyleType: "none" }}><Link href="/" className="dropdown-item link-black-100">Home v1</Link></li>
                  <li style={{ listStyleType: "none" }}><Link href="/" className="dropdown-item link-black-100">Home v2</Link></li>
                  <li style={{ listStyleType: "none" }}><Link href="/" className="dropdown-item link-black-100">Home v3</Link></li>
                </ul>
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
                  {[
                    { name: "Arts & Photography", icon: "flaticon-gallery" },
                    { name: "Biographies", icon: "flaticon-resume" },
                    { name: "Business & Money", icon: "flaticon-credit" },
                    { name: "Children's Books", icon: "flaticon-baby-boy" },
                    { name: "Computers & Technology", icon: "fas fa-laptop" },
                    { name: "Cookbooks, Food & Wine", icon: "flaticon-cook" },
                    { name: "Crafts, Hobbies & Home", icon: "fas fa-home" },
                    { name: "Education & Teaching", icon: "fas fa-graduation-cap" },
                    { name: "Health, Fitness & Dieting", icon: "flaticon-doctor" },
                    { name: "History", icon: "flaticon-history" },
                  ].map((cat, idx) => (
                    <li key={idx} style={{ listStyleType: "none" }}>
                      <Link
                        href={`/shop?category=${encodeURIComponent(cat.name)}`}
                        className="dropdown-item link-black-100 d-flex align-items-center py-2 px-4"
                        style={{
                          transition: "all 0.2s ease",
                        }}
                      >
                        <Icon name={`${cat.icon} mr-3 font-size-4 text-gray-500`} />
                        <span>{cat.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>

              <li
                className={`nav-item dropdown ${activeDropdown === "shop" ? "show" : ""}`}
                onMouseEnter={() => setActiveDropdown("shop")}
                onMouseLeave={() => setActiveDropdown(null)}
                style={{ listStyleType: "none" }}
              >
                <Link
                  href="/shop"
                  className="dropdown-toggle nav-link link-black-100 mx-4 px-0 py-5 font-weight-medium d-flex align-items-center"
                >
                  Shop
                </Link>
                <ul className={`dropdown-unfold dropdown-menu font-size-2 rounded-0 border-gray-900 ${activeDropdown === "shop" ? "show" : ""}`} style={{ listStyleType: "none" }}>
                  <li style={{ listStyleType: "none" }}><Link href="/shop" className="dropdown-item link-black-100">Shop List v1</Link></li>
                  <li style={{ listStyleType: "none" }}><Link href="/shop" className="dropdown-item link-black-100">Shop List v2</Link></li>
                  <li style={{ listStyleType: "none" }}><Link href="/product" className="dropdown-item link-black-100">Single Product</Link></li>
                  <li style={{ listStyleType: "none" }}><Link href="/cart" className="dropdown-item link-black-100">Shop cart</Link></li>
                  <li style={{ listStyleType: "none" }}><Link href="/checkout" className="dropdown-item link-black-100">Shop checkout</Link></li>
                </ul>
              </li>

              <li
                className={`nav-item dropdown ${activeDropdown === "pages" ? "show" : ""}`}
                onMouseEnter={() => setActiveDropdown("pages")}
                onMouseLeave={() => setActiveDropdown(null)}
                style={{ listStyleType: "none" }}
              >
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleDropdown("pages");
                  }}
                  className="dropdown-toggle nav-link link-black-100 mx-4 px-0 py-5 font-weight-medium d-flex align-items-center"
                >
                  Pages
                </a>
                <ul className={`dropdown-unfold dropdown-menu font-size-2 rounded-0 border-gray-900 ${activeDropdown === "pages" ? "show" : ""}`} style={{ listStyleType: "none" }}>
                  <li style={{ listStyleType: "none" }}><Link href="/about" className="dropdown-item link-black-100">About Us</Link></li>
                  <li style={{ listStyleType: "none" }}><Link href="/contact" className="dropdown-item link-black-100">Contact Us</Link></li>
                  <li style={{ listStyleType: "none" }}><Link href="/faq" className="dropdown-item link-black-100">FAQ</Link></li>
                </ul>
              </li>

              <li
                className={`nav-item dropdown ${activeDropdown === "blog" ? "show" : ""}`}
                onMouseEnter={() => setActiveDropdown("blog")}
                onMouseLeave={() => setActiveDropdown(null)}
                style={{ listStyleType: "none" }}
              >
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleDropdown("blog");
                  }}
                  className="dropdown-toggle nav-link link-black-100 mx-4 px-0 py-5 font-weight-medium d-flex align-items-center"
                >
                  Blog
                </a>
                <ul className={`dropdown-unfold dropdown-menu font-size-2 rounded-0 border-gray-900 ${activeDropdown === "blog" ? "show" : ""}`} style={{ listStyleType: "none" }}>
                  <li style={{ listStyleType: "none" }}><Link href="/" className="dropdown-item link-black-100">Blog Grid</Link></li>
                  <li style={{ listStyleType: "none" }}><Link href="/" className="dropdown-item link-black-100">Blog List</Link></li>
                  <li style={{ listStyleType: "none" }}><Link href="/" className="dropdown-item link-black-100">Blog Single</Link></li>
                </ul>
              </li>

              <li
                className={`nav-item dropdown ${activeDropdown === "others" ? "show" : ""}`}
                onMouseEnter={() => setActiveDropdown("others")}
                onMouseLeave={() => setActiveDropdown(null)}
                style={{ listStyleType: "none" }}
              >
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleDropdown("others");
                  }}
                  className="dropdown-toggle nav-link link-black-100 mx-4 px-0 py-5 font-weight-medium d-flex align-items-center"
                >
                  Others
                </a>
                <ul className={`dropdown-unfold dropdown-menu font-size-2 rounded-0 border-gray-900 ${activeDropdown === "others" ? "show" : ""}`} style={{ listStyleType: "none" }}>
                  <li style={{ listStyleType: "none" }}><Link href="/my-account" className="dropdown-item link-black-100">My Account</Link></li>
                  <li style={{ listStyleType: "none" }}><Link href="/checkout" className="dropdown-item link-black-100">Checkout</Link></li>
                  <li style={{ listStyleType: "none" }}><Link href="/cart" className="dropdown-item link-black-100">Cart</Link></li>
                </ul>
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

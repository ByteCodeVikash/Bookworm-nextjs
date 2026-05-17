"use client";

import React, { useState } from "react";
import { MainHeaderProps } from "./types";
import { Logo, Icon } from "../../atoms";
import { SearchBar } from "../../molecules";

export const MainHeader: React.FC<MainHeaderProps> = ({
  onToggleCategories,
  onToggleCart,
  onToggleAccount
}) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

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
            <button
              onClick={onToggleCategories}
              className="cat-menu btn btn-link border-0 p-0"
              aria-label="Toggle Categories Menu"
              style={{ color: "inherit" }}
            >
              <svg width="20px" height="18px">
                <path fillRule="evenodd" fill="rgb(25, 17, 11)" d="M-0.000,-0.000 L20.000,-0.000 L20.000,2.000 L-0.000,2.000 L-0.000,-0.000 Z" />
                <path fillRule="evenodd" fill="rgb(25, 17, 11)" d="M-0.000,8.000 L15.000,8.000 L15.000,10.000 L-0.000,10.000 L-0.000,8.000 Z" />
                <path fillRule="evenodd" fill="rgb(25, 17, 11)" d="M-0.000,16.000 L20.000,16.000 L20.000,18.000 L-0.000,18.000 L-0.000,16.000 Z" />
              </svg>
            </button>
          </div>

          {/* Branding Logo */}
          <div className="site-branding pr-md-4">
            <a href="#" className="d-block mb-1">
              <Logo />
            </a>
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
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleDropdown("home");
                  }}
                  className="dropdown-toggle nav-link link-black-100 mx-4 px-0 py-5 font-weight-medium d-flex align-items-center"
                >
                  Home
                </a>
                <ul className={`dropdown-unfold dropdown-menu font-size-2 rounded-0 border-gray-900 ${activeDropdown === "home" ? "show" : ""}`} style={{ listStyleType: "none" }}>
                  <li style={{ listStyleType: "none" }}><a href="#" className="dropdown-item link-black-100">Home v1</a></li>
                  <li style={{ listStyleType: "none" }}><a href="#" className="dropdown-item link-black-100">Home v2</a></li>
                  <li style={{ listStyleType: "none" }}><a href="#" className="dropdown-item link-black-100">Home v3</a></li>
                </ul>
              </li>

              <li className="nav-item" style={{ listStyleType: "none" }}>
                <a href="#" className="nav-link link-black-100 mx-4 px-0 py-5 font-weight-medium active border-bottom border-primary border-width-2">
                  Categories
                </a>
              </li>

              <li
                className={`nav-item dropdown ${activeDropdown === "shop" ? "show" : ""}`}
                onMouseEnter={() => setActiveDropdown("shop")}
                onMouseLeave={() => setActiveDropdown(null)}
                style={{ listStyleType: "none" }}
              >
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleDropdown("shop");
                  }}
                  className="dropdown-toggle nav-link link-black-100 mx-4 px-0 py-5 font-weight-medium d-flex align-items-center"
                >
                  Shop
                </a>
                <ul className={`dropdown-unfold dropdown-menu font-size-2 rounded-0 border-gray-900 ${activeDropdown === "shop" ? "show" : ""}`} style={{ listStyleType: "none" }}>
                  <li style={{ listStyleType: "none" }}><a href="#" className="dropdown-item link-black-100">Shop List v1</a></li>
                  <li style={{ listStyleType: "none" }}><a href="#" className="dropdown-item link-black-100">Shop List v2</a></li>
                  <li style={{ listStyleType: "none" }}><a href="#" className="dropdown-item link-black-100">Single Product</a></li>
                  <li style={{ listStyleType: "none" }}><a href="#" className="dropdown-item link-black-100">Shop cart</a></li>
                  <li style={{ listStyleType: "none" }}><a href="#" className="dropdown-item link-black-100">Shop checkout</a></li>
                </ul>
              </li>

              <li className="nav-item" style={{ listStyleType: "none" }}>
                <a href="#" className="nav-link link-black-100 mx-4 px-0 py-5 font-weight-medium">
                  Blog
                </a>
              </li>

              <li className="nav-item" style={{ listStyleType: "none" }}>
                <a href="#" className="nav-link link-black-100 mx-4 px-0 py-5 font-weight-medium">
                  Others
                </a>
              </li>
            </ul>
          </div>

          {/* SearchBar Input Section */}
          <div className="site-search ml-auto d-none d-md-block mr-4 mr-xl-0" style={{ width: "320px" }}>
            <SearchBar />
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
                3
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

import React from "react";
import { TopHeaderProps } from "./types";
import { Icon } from "@/components/atoms";
import { useCart } from "@/contexts/CartContext";

export const TopHeader: React.FC<TopHeaderProps> = ({ onToggleCart, onToggleAccount }) => {
  const { cartItems } = useCart();
  const totalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="topbar border-bottom d-none d-md-block">
      <div className="container-fluid px-2 px-md-5 px-xl-8d75">
        <div className="topbar__nav d-md-flex justify-content-between align-items-center">
          {/* Topbar Left */}
          <ul id="menu-topbar-left-v1" className="topbar__nav--left nav ml-md-n3 d-none d-md-flex">
            <li id="topbar-left-menu-item-338" className="glph-icon mr-2 menu-item nav-item" style={{ listStyleType: "none" }}>
              <a title="Can we help you?" href="/contact" className="nav-link link-black-100 h-100">
                <i className="flaticon-question mr-2 glph-icon" aria-hidden="true"></i> Can we help you?
              </a>
            </li>
            <li id="topbar-left-menu-item-337" className="glph-icon mr-2 menu-item nav-item" style={{ listStyleType: "none" }}>
              <a title="+1 246-345-0695" href="tel:+1246-345-0695" className="nav-link link-black-100 h-100">
                <i className="flaticon-phone mr-2 glph-icon" aria-hidden="true"></i> +1 246-345-0695
              </a>
            </li>
          </ul>

          {/* Topbar Right */}
          <div className="topbar__nav--right nav mr-md-n3">
            <ul className="header-icons-links nav justify-content-end">
              <li className="nav-item d-none d-md-block" style={{ listStyleType: "none" }}>
                <a href="/contact" className="nav-link link-black-100 font-size-3 px-3">
                  <i className="flaticon-pin font-size-3"></i>
                </a>
              </li>
              <li className="nav-item d-none d-md-block" style={{ listStyleType: "none" }}>
                <a className="nav-link link-black-100 font-size-3 px-3" href="/">
                  <i className="flaticon-switch yith-compare-open font-size-3"></i>
                </a>
              </li>
              <li className="nav-item d-none d-md-block font-size-4" style={{ listStyleType: "none" }}>
                <a href="/" className="nav-link link-black-100 font-size-3 px-3">
                  <i className="flaticon-heart font-size-3"></i>
                </a>
              </li>
              <li className="nav-item" style={{ listStyleType: "none" }}>
                <a
                  id="sidebarNavToggler-my_account"
                  href="#"
                  role="button"
                  onClick={(e) => {
                    e.preventDefault();
                    onToggleAccount();
                  }}
                  className="nav-link link-black-100 font-size-3 px-3"
                >
                  <i className="flaticon-user font-size-3"></i>
                </a>
              </li>
              <li className="nav-item d-block" style={{ listStyleType: "none" }}>
                <a
                  id="sidebarNavToggler-my_cart"
                  href="#"
                  role="button"
                  onClick={(e) => {
                    e.preventDefault();
                    onToggleCart();
                  }}
                  className="d-block nav-link text-dark pr-0 position-relative"
                  style={{ textDecoration: "none" }}
                >
                  <i className="flaticon-icon-126515 font-size-3"></i>
                  <span
                    className="position-absolute rounded-circle d-flex align-items-center justify-content-center font-size-n9 text-white"
                    style={{
                      top: "-4px",
                      right: "-4px",
                      width: "16px",
                      height: "16px",
                      backgroundColor: "#19110b"
                    }}
                  >
                    {totalCount}
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
export default TopHeader;

import React from "react";
import { TopHeaderProps } from "./types";
import { Icon } from "@/components/atoms";

export const TopHeader: React.FC<TopHeaderProps> = ({ onToggleCart, onToggleAccount }) => {
  return (
    <div className="topbar border-bottom d-none d-md-block">
      <div className="container-fluid px-2 px-md-5 px-xl-8d75">
        <div className="topbar__nav d-md-flex justify-content-between align-items-center">
          <ul className="topbar__nav--left nav ml-md-n3">
            <li className="nav-item" style={{ listStyleType: "none" }}>
              <a href="#" className="nav-link link-black-100">
                <Icon name="flaticon-question" className="mr-2" />
                Can we help you?
              </a>
            </li>
            <li className="nav-item" style={{ listStyleType: "none" }}>
              <a href="tel:+1246-345-0695" className="nav-link link-black-100">
                <Icon name="flaticon-phone" className="mr-2" />
                +1 246-345-0695
              </a>
            </li>
          </ul>
          <ul className="topbar__nav--right nav mr-md-n3">
            <li className="nav-item" style={{ listStyleType: "none" }}>
              <a href="#" className="nav-link link-black-100">
                <Icon name="flaticon-pin" />
              </a>
            </li>
            <li className="nav-item" style={{ listStyleType: "none" }}>
              <a href="#" className="nav-link link-black-100">
                <Icon name="flaticon-switch" />
              </a>
            </li>
            <li className="nav-item" style={{ listStyleType: "none" }}>
              <a href="#" className="nav-link link-black-100">
                <Icon name="flaticon-heart" />
              </a>
            </li>
            <li className="nav-item" style={{ listStyleType: "none" }}>
              <button
                onClick={onToggleAccount}
                className="nav-link link-black-100 btn btn-link border-0 p-0"
                style={{ background: "none", boxShadow: "none" }}
              >
                <Icon name="flaticon-user" />
              </button>
            </li>
            <li className="nav-item" style={{ listStyleType: "none" }}>
              <button
                onClick={onToggleCart}
                className="nav-link link-black-100 position-relative btn btn-link border-0 p-0"
                style={{ background: "none", boxShadow: "none" }}
              >
                <span className="position-absolute bg-dark width-16 height-16 rounded-circle d-flex align-items-center justify-content-center text-white font-size-n9 right-0" style={{ top: "-8px" }}>
                  3
                </span>
                <Icon name="flaticon-icon-126515" />
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
export default TopHeader;

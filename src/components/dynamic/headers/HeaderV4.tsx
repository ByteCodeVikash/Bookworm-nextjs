import React from "react";
import Link from "next/link";
import { Logo, Icon } from "@/components/atoms";
import { SearchBar } from "@/components/molecules";

interface HeaderProps {
  onToggleCart: () => void;
  onToggleAccount: () => void;
  onToggleCategories: () => void;
}

export const HeaderV4: React.FC<HeaderProps> = ({
  onToggleCart,
  onToggleAccount,
  onToggleCategories,
}) => {
  return (
    <div className="header-v4 bg-white border-bottom py-3 shadow-sm">
      <div className="container-fluid px-3 px-md-5">
        <div className="row align-items-center justify-content-between">
          
          {/* Logo & Slogan Column */}
          <div className="col-lg-3 col-md-4 col-12 mb-3 mb-md-0 d-flex align-items-center justify-content-between justify-content-md-start">
            <Link href="/" className="d-block mr-3">
              <Logo />
            </Link>
            <span className="text-gray-500 font-size-1 d-none d-xl-inline-block border-left pl-3" style={{ height: "20px", lineHeight: "20px" }}>
              Explore the World of Books
            </span>
          </div>

          {/* Large Search Bar Column */}
          <div className="col-lg-6 col-md-5 col-12 mb-3 mb-md-0">
            <div className="w-100 pr-md-4">
              <SearchBar />
            </div>
          </div>

          {/* Actions & Category Selector Column */}
          <div className="col-lg-3 col-md-3 col-12 d-flex align-items-center justify-content-end gap-3 flex-wrap">
            
            {/* Direct Category Toggler */}
            <button
              onClick={onToggleCategories}
              className="btn btn-outline-dark rounded-0 px-3 py-2 font-size-2 d-flex align-items-center mr-2"
              aria-label="Shop categories list"
            >
              <i className="fa fa-th-large mr-2"></i> Shop Categories
            </button>

            {/* Account & Cart Icons */}
            <div className="d-flex align-items-center">
              <button
                onClick={onToggleAccount}
                className="btn btn-link text-dark p-2 border-0"
                aria-label="Account settings"
              >
                <Icon name="flaticon-user" className="font-size-5" />
              </button>
              <button
                onClick={onToggleCart}
                className="btn btn-link text-dark p-2 border-0 position-relative"
                aria-label="Cart panel"
              >
                <span
                  className="position-absolute bg-dark text-white rounded-circle d-flex align-items-center justify-content-center"
                  style={{
                    top: "2px",
                    right: "2px",
                    width: "16px",
                    height: "16px",
                    fontSize: "9px"
                  }}
                >
                  3
                </span>
                <Icon name="flaticon-icon-126515" className="font-size-5" />
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default HeaderV4;

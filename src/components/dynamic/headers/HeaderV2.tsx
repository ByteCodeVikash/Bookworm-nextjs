import React from "react";
import Link from "next/link";
import { Logo, Icon } from "@/components/atoms";
import { SearchBar } from "@/components/molecules";

interface HeaderProps {
  onToggleCart: () => void;
  onToggleAccount: () => void;
  onToggleCategories: () => void;
}

export const HeaderV2: React.FC<HeaderProps> = ({
  onToggleCart,
  onToggleAccount,
  onToggleCategories,
}) => {
  return (
    <div className="masthead border-bottom bg-white py-3 shadow-sm">
      <div className="container-fluid px-3 px-md-5">
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
          
          {/* Logo & Category Button Group */}
          <div className="d-flex align-items-center">
            <button
              onClick={onToggleCategories}
              className="btn btn-outline-dark rounded-0 mr-3 px-3 py-2 font-size-2 d-flex align-items-center"
              aria-label="Toggle Categories Menu"
            >
              <i className="fa fa-bars mr-2"></i> Categories
            </button>
            <Link href="/" className="d-block">
              <Logo />
            </Link>
          </div>

          {/* Inline Navigation Links for Desktop */}
          <div className="d-none d-lg-flex align-items-center gap-4">
            <Link href="/" className="text-dark font-weight-medium font-size-2 hover-text-primary transition mx-2">
              Home
            </Link>
            <Link href="/about" className="text-dark font-weight-medium font-size-2 hover-text-primary transition mx-2">
              About
            </Link>
            <Link href="/shop" className="text-dark font-weight-medium font-size-2 hover-text-primary transition mx-2">
              Shop
            </Link>
            <Link href="/contact" className="text-dark font-weight-medium font-size-2 hover-text-primary transition mx-2">
              Contact
            </Link>
          </div>

          {/* SearchBar Input */}
          <div className="flex-grow-1 mx-md-4 max-width-360 d-none d-md-block" style={{ maxWidth: "320px" }}>
            <SearchBar />
          </div>

          {/* Action icons */}
          <div className="d-flex align-items-center gap-3">
            <button
              onClick={onToggleAccount}
              className="btn btn-link text-dark p-2 border-0"
              aria-label="Account"
            >
              <Icon name="flaticon-user" className="font-size-5" />
            </button>
            <button
              onClick={onToggleCart}
              className="btn btn-link text-dark p-2 border-0 position-relative"
              aria-label="Cart"
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
  );
};

export default HeaderV2;

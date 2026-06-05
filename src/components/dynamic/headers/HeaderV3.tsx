import React from "react";
import Link from "next/link";
import { Logo, Icon } from "@/components/atoms";
import { SearchBar } from "@/components/molecules";
import { useSiteConfig } from "@/contexts/ConfigContext";

interface HeaderProps {
  onToggleCart: () => void;
  onToggleAccount: () => void;
  onToggleCategories: () => void;
}

export const HeaderV3: React.FC<HeaderProps> = ({
  onToggleCart,
  onToggleAccount,
  onToggleCategories,
}) => {
  const { config } = useSiteConfig();
  const { phone, email, socials } = config.businessDetails;

  return (
    <div className="header-v3 bg-white border-bottom">
      {/* 1. Top Utility Info Bar */}
      <div className="bg-light py-2 border-bottom d-none d-md-block">
        <div className="container-fluid px-3 px-md-5">
          <div className="d-flex justify-content-between align-items-center font-size-1 text-gray-600">
            <div>
              <span className="mr-3"><i className="fa fa-phone mr-1"></i> {phone}</span>
              <span><i className="fa fa-envelope mr-1"></i> {email}</span>
            </div>
            <div className="d-flex gap-3">
              {socials.instagram && <a href={socials.instagram} className="text-gray-600 mx-1" aria-label="Instagram"><Icon name="fab fa-instagram" /></a>}
              {socials.facebook && <a href={socials.facebook} className="text-gray-600 mx-1" aria-label="Facebook"><Icon name="fab fa-facebook-f" /></a>}
              {socials.youtube && <a href={socials.youtube} className="text-gray-600 mx-1" aria-label="Youtube"><Icon name="fab fa-youtube" /></a>}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Middle Logo & Action Bar */}
      <div className="py-3">
        <div className="container-fluid px-3 px-md-5">
          <div className="row align-items-center">
            
            {/* Search Input (Left) */}
            <div className="col-md-4 col-3 d-none d-md-block">
              <div style={{ maxWidth: "300px" }}>
                <SearchBar />
              </div>
            </div>

            {/* Centered Logo */}
            <div className="col-md-4 col-6 text-center">
              <Link href="/" className="d-inline-block">
                <Logo />
              </Link>
            </div>

            {/* Actions (Right) */}
            <div className="col-md-4 col-6 d-flex align-items-center justify-content-end gap-2">
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

      {/* 3. Bottom Centered Links Bar */}
      <div className="border-top py-2 bg-white d-none d-lg-block">
        <div className="container text-center">
          <div className="d-flex align-items-center justify-content-center gap-4">
            <button
              onClick={onToggleCategories}
              className="btn btn-link text-dark font-weight-medium font-size-2 p-0 mr-3 border-0 d-flex align-items-center"
            >
              <i className="fa fa-bars mr-2"></i> Shop By Categories
            </button>
            <Link href="/" className="text-dark font-weight-bold font-size-2 hover-text-primary transition mx-2">
              Home
            </Link>
            <Link href="/about" className="text-dark font-weight-bold font-size-2 hover-text-primary transition mx-2">
              About
            </Link>
            <Link href="/shop" className="text-dark font-weight-bold font-size-2 hover-text-primary transition mx-2">
              Shop
            </Link>
            <Link href="/contact" className="text-dark font-weight-bold font-size-2 hover-text-primary transition mx-2">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderV3;

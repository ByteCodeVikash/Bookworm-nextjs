import React from "react";
import Link from "next/link";
import { Logo, Icon } from "@/components/atoms";
import { useSiteConfig } from "@/contexts/ConfigContext";

export const FooterV2: React.FC = () => {
  const { config } = useSiteConfig();
  const { storeName, socials } = config.businessDetails;

  return (
    <footer className="bg-white border-top py-5">
      <div className="container">
        <div className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-4">
          
          {/* Logo & Slogan */}
          <div className="text-center text-md-left">
            <Link href="/" className="d-inline-block mb-2">
              <Logo />
            </Link>
            <p className="text-gray-500 font-size-1 mb-0">Your online bookstore oasis.</p>
          </div>

          {/* Simple Inline Navigation */}
          <div className="d-flex flex-wrap justify-content-center gap-3">
            <Link href="/about" className="text-gray-600 font-size-2 hover-text-primary transition mx-2">
              About Us
            </Link>
            <Link href="/contact" className="text-gray-600 font-size-2 hover-text-primary transition mx-2">
              Contact Us
            </Link>
            <Link href="/faq" className="text-gray-600 font-size-2 hover-text-primary transition mx-2">
              FAQ
            </Link>
            <Link href="/my-account" className="text-gray-600 font-size-2 hover-text-primary transition mx-2">
              My Account
            </Link>
          </div>

          {/* Copyright & Social Icons */}
          <div className="text-center text-md-right">
            <div className="d-flex justify-content-center justify-content-md-end mb-2">
              {socials.instagram && <a href={socials.instagram} className="text-gray-600 mx-2 font-size-4" aria-label="Instagram"><Icon name="fab fa-instagram" /></a>}
              {socials.facebook && <a href={socials.facebook} className="text-gray-600 mx-2 font-size-4" aria-label="Facebook"><Icon name="fab fa-facebook-f" /></a>}
              {socials.youtube && <a href={socials.youtube} className="text-gray-600 mx-2 font-size-4" aria-label="Youtube"><Icon name="fab fa-youtube" /></a>}
              {socials.twitter && <a href={socials.twitter} className="text-gray-600 mx-2 font-size-4" aria-label="Twitter"><Icon name="fab fa-twitter" /></a>}
            </div>
            <p className="text-gray-500 font-size-1 mb-0">&copy; 2026 {storeName || "Bookworm"}. {config.content?.footerText || "All rights reserved."}</p>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default FooterV2;

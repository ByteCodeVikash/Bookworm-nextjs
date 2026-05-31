import React from "react";
import Link from "next/link";
import { Logo, Icon } from "@/components/atoms";
import { useSiteConfig } from "@/contexts/ConfigContext";

export const FooterV4: React.FC = () => {
  const { config } = useSiteConfig();
  const { storeName, socials } = config.businessDetails;

  return (
    <footer className="bg-dark text-white py-6">
      <div className="container text-center">
        
        {/* Logo and Slogan */}
        <div className="mb-4">
          <Link href="/" className="d-inline-block mb-2 bg-white p-2 rounded">
            <Logo />
          </Link>
          <p className="text-gray-400 font-size-2 mb-0">Delivering Knowledge to Your Doorstep</p>
        </div>

        {/* Centered Social Channels Grid */}
        <div className="d-flex justify-content-center mb-4 gap-4 flex-wrap">
          {socials.instagram && (
            <a href={socials.instagram} className="text-gray-400 hover-text-white d-flex align-items-center font-size-3 transition" aria-label="Instagram">
              <Icon name="fab fa-instagram" className="mr-2 font-size-5" /> Instagram
            </a>
          )}
          {socials.facebook && (
            <a href={socials.facebook} className="text-gray-400 hover-text-white d-flex align-items-center font-size-3 transition" aria-label="Facebook">
              <Icon name="fab fa-facebook-f" className="mr-2 font-size-5" /> Facebook
            </a>
          )}
          {socials.youtube && (
            <a href={socials.youtube} className="text-gray-400 hover-text-white d-flex align-items-center font-size-3 transition" aria-label="Youtube">
              <Icon name="fab fa-youtube" className="mr-2 font-size-5" /> YouTube
            </a>
          )}
          {socials.twitter && (
            <a href={socials.twitter} className="text-gray-400 hover-text-white d-flex align-items-center font-size-3 transition" aria-label="Twitter">
              <Icon name="fab fa-twitter" className="mr-2 font-size-5" /> Twitter
            </a>
          )}
        </div>

        {/* Minimal Navigation Grid */}
        <div className="d-flex justify-content-center mb-4 gap-3 flex-wrap font-size-2 border-top border-gray-700 pt-4" style={{ borderColor: "#373b3e" }}>
          <Link href="/about" className="text-gray-400 hover-text-white mx-2">
            About Us
          </Link>
          <Link href="/product" className="text-gray-400 hover-text-white mx-2">
            Shop Catalog
          </Link>
          <Link href="/contact" className="text-gray-400 hover-text-white mx-2">
            Contact
          </Link>
          <Link href="/faq" className="text-gray-400 hover-text-white mx-2">
            FAQs
          </Link>
        </div>

        {/* Copyright notice */}
        <p className="text-gray-500 font-size-1 mb-0 mt-2">
          &copy; 2026 {storeName || "Bookworm"}. {config.content?.footerText || "All rights reserved."}
        </p>

      </div>
    </footer>
  );
};

export default FooterV4;

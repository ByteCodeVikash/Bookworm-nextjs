import React from "react";
import Link from "next/link";
import { Logo, Icon } from "@/components/atoms";
import { useSiteConfig } from "@/contexts/ConfigContext";

export const FooterV3: React.FC = () => {
  const { config } = useSiteConfig();
  const { address, email, phone, socials, storeName } = config.businessDetails;

  return (
    <footer className="bg-white border-top">
      {/* Widgets & Links */}
      <div className="space-top-3 space-bottom-2 container">
        <div className="row">
          {/* Logo & Contact details */}
          <div className="col-lg-4 mb-6 mb-lg-0">
            <div className="pb-4">
              <Link href="/" className="d-inline-block mb-4">
                <Logo />
              </Link>
              <p className="text-gray-600 font-size-2 mb-4">
                {address}
              </p>
              <div className="font-size-2 text-dark font-weight-medium mb-1">
                Email: <span className="text-gray-600 font-weight-normal">{email}</span>
              </div>
              <div className="font-size-2 text-dark font-weight-medium">
                Phone: <span className="text-gray-600 font-weight-normal">{phone}</span>
              </div>
            </div>
          </div>

          {/* Explore column */}
          <div className="col-lg-2 col-md-4 mb-6 mb-lg-0">
            <h4 className="font-size-3 font-weight-medium mb-3">Explore</h4>
            <ul className="list-unstyled mb-0 font-size-2" style={{ paddingLeft: 0 }}>
              <li className="py-1" style={{ listStyleType: "none" }}><Link href="/about" className="text-gray-600 h-primary">About Us</Link></li>
              <li className="py-1" style={{ listStyleType: "none" }}><Link href="/" className="text-gray-600 h-primary">Sitemap</Link></li>
              <li className="py-1" style={{ listStyleType: "none" }}><Link href="/" className="text-gray-600 h-primary">Bookmarks</Link></li>
              <li className="py-1" style={{ listStyleType: "none" }}><Link href="/my-account" className="text-gray-600 h-primary">Sign in/Join</Link></li>
            </ul>
          </div>

          {/* Customer Service column */}
          <div className="col-lg-2 col-md-4 mb-6 mb-lg-0">
            <h4 className="font-size-3 font-weight-medium mb-3">Customer Service</h4>
            <ul className="list-unstyled mb-0 font-size-2" style={{ paddingLeft: 0 }}>
              <li className="py-1" style={{ listStyleType: "none" }}><Link href="/faq" className="text-gray-600 h-primary">Help Center</Link></li>
              <li className="py-1" style={{ listStyleType: "none" }}><Link href="/" className="text-gray-600 h-primary">Returns</Link></li>
              <li className="py-1" style={{ listStyleType: "none" }}><Link href="/" className="text-gray-600 h-primary">Product Recalls</Link></li>
              <li className="py-1" style={{ listStyleType: "none" }}><Link href="/" className="text-gray-600 h-primary">Accessibility</Link></li>
              <li className="py-1" style={{ listStyleType: "none" }}><Link href="/contact" className="text-gray-600 h-primary">Contact Us</Link></li>
            </ul>
          </div>

          {/* Policy column */}
          <div className="col-lg-2 col-md-4 mb-6 mb-lg-0">
            <h4 className="font-size-3 font-weight-medium mb-3">Policy</h4>
            <ul className="list-unstyled mb-0 font-size-2" style={{ paddingLeft: 0 }}>
              <li className="py-1" style={{ listStyleType: "none" }}><Link href="/faq" className="text-gray-600 h-primary">Return Policy</Link></li>
              <li className="py-1" style={{ listStyleType: "none" }}><Link href="/faq" className="text-gray-600 h-primary">Terms of Use</Link></li>
              <li className="py-1" style={{ listStyleType: "none" }}><Link href="/faq" className="text-gray-600 h-primary">Security</Link></li>
              <li className="py-1" style={{ listStyleType: "none" }}><Link href="/faq" className="text-gray-600 h-primary">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Categories column */}
          <div className="col-lg-2 col-md-4">
            <h4 className="font-size-3 font-weight-medium mb-3">Categories</h4>
            <ul className="list-unstyled mb-0 font-size-2" style={{ paddingLeft: 0 }}>
              <li className="py-1" style={{ listStyleType: "none" }}><Link href="/" className="text-gray-600 h-primary">Action & Adventure</Link></li>
              <li className="py-1" style={{ listStyleType: "none" }}><Link href="/" className="text-gray-600 h-primary">Arts & Photography</Link></li>
              <li className="py-1" style={{ listStyleType: "none" }}><Link href="/" className="text-gray-600 h-primary">Biographies</Link></li>
              <li className="py-1" style={{ listStyleType: "none" }}><Link href="/" className="text-gray-600 h-primary">Business & Money</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Socials & Copyright Bar */}
      <div className="bg-gray-200 py-4 border-top">
        <div className="container d-md-flex justify-content-between align-items-center font-size-2 text-gray-600">
          <div className="mb-2 mb-md-0 text-center text-md-left">
            &copy; 2026 {storeName || "Bookworm"}. {config.content?.footerText || "All rights reserved."}
          </div>
          <div className="d-flex justify-content-center">
            {socials.instagram && <a href={socials.instagram} className="text-gray-600 mx-2 font-size-4" aria-label="Instagram"><Icon name="fab fa-instagram" /></a>}
            {socials.facebook && <a href={socials.facebook} className="text-gray-600 mx-2 font-size-4" aria-label="Facebook"><Icon name="fab fa-facebook-f" /></a>}
            {socials.youtube && <a href={socials.youtube} className="text-gray-600 mx-2 font-size-4" aria-label="Youtube"><Icon name="fab fa-youtube" /></a>}
            {socials.twitter && <a href={socials.twitter} className="text-gray-600 mx-2 font-size-4" aria-label="Twitter"><Icon name="fab fa-twitter" /></a>}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterV3;

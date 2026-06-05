import React from "react";
import Link from "next/link";
import { Logo, Icon } from "@/components/atoms";
import { NewsletterForm } from "@/components/molecules";
import { useSiteConfig } from "@/contexts/ConfigContext";

export const FooterV1: React.FC = () => {
  const { config } = useSiteConfig();
  const { address, email, phone, socials } = config.businessDetails;

  return (
    <footer className="bg-white border-top">
      {/* Newsletter Bar */}
      <div className="space-top-2 space-bottom-2 border-bottom">
        <div className="container">
          <div className="text-center mb-5">
            <h5 className="font-size-7 font-weight-bold mb-2">Join Our Newsletter</h5>
            <p className="text-gray-600 font-size-2">Signup to be the first to hear about exclusive deals, special offers and upcoming collections</p>
          </div>
          <NewsletterForm />
        </div>
      </div>

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
              <div className="font-size-2 text-gray-600 mb-1">
                {email}
              </div>
              <div className="font-size-2 text-gray-600">
                {phone}
              </div>
              <ul className="list-inline mb-0 mt-5">
                {socials.instagram && (
                  <li className="list-inline-item mr-3">
                    <a href={socials.instagram} className="text-gray-600 font-size-4" aria-label="Instagram">
                      <Icon name="fab fa-instagram" />
                    </a>
                  </li>
                )}
                {socials.facebook && (
                  <li className="list-inline-item mr-3">
                    <a href={socials.facebook} className="text-gray-600 font-size-4" aria-label="Facebook">
                      <Icon name="fab fa-facebook-f" />
                    </a>
                  </li>
                )}
                {socials.youtube && (
                  <li className="list-inline-item mr-3">
                    <a href={socials.youtube} className="text-gray-600 font-size-4" aria-label="Youtube">
                      <Icon name="fab fa-youtube" />
                    </a>
                  </li>
                )}
                {socials.twitter && (
                  <li className="list-inline-item mr-3">
                    <a href={socials.twitter} className="text-gray-600 font-size-4" aria-label="Twitter">
                      <Icon name="fab fa-twitter" />
                    </a>
                  </li>
                )}
                {socials.pinterest && (
                  <li className="list-inline-item mr-3">
                    <a href={socials.pinterest} className="text-gray-600 font-size-4" aria-label="Pinterest">
                      <Icon name="fab fa-pinterest" />
                    </a>
                  </li>
                )}
              </ul>
            </div>
          </div>

          {/* Explore column */}
          <div className="col-lg-2 col-md-4 mb-6 mb-lg-0">
            <h4 className="font-size-3 font-weight-medium mb-3">Explore</h4>
            <ul className="list-unstyled mb-0 font-size-2" style={{ paddingLeft: 0 }}>
              <li className="py-1" style={{ listStyleType: "none" }}><Link href="/about" className="text-gray-600 h-primary">About Us</Link></li>
              <li className="py-1" style={{ listStyleType: "none" }}><Link href="/contact" className="text-gray-600 h-primary">Contact Us</Link></li>
              <li className="py-1" style={{ listStyleType: "none" }}><Link href="/faq" className="text-gray-600 h-primary">FAQ</Link></li>
              <li className="py-1" style={{ listStyleType: "none" }}><Link href="/" className="text-gray-600 h-primary">Sitemap</Link></li>
              <li className="py-1" style={{ listStyleType: "none" }}><Link href="/" className="text-gray-600 h-primary">Bookmarks</Link></li>
              <li className="py-1" style={{ listStyleType: "none" }}><Link href="/my-account" className="text-gray-600 h-primary">Sign in/Join</Link></li>
            </ul>
          </div>

          {/* Customer Service column */}
          <div className="col-lg-2 col-md-4 mb-6 mb-lg-0">
            <h4 className="font-size-3 font-weight-medium mb-3">Customer Service</h4>
            <ul className="list-unstyled mb-0 font-size-2" style={{ paddingLeft: 0 }}>
              <li className="py-1" style={{ listStyleType: "none" }}><Link href="/faq" className="text-gray-600 h-primary">FAQ</Link></li>
              <li className="py-1" style={{ listStyleType: "none" }}><Link href="/" className="text-gray-600 h-primary">Returns</Link></li>
              <li className="py-1" style={{ listStyleType: "none" }}><Link href="/" className="text-gray-600 h-primary">Product Recalls</Link></li>
              <li className="py-1" style={{ listStyleType: "none" }}><Link href="/" className="text-gray-600 h-primary">Accessibility</Link></li>
              <li className="py-1" style={{ listStyleType: "none" }}><Link href="/contact" className="text-gray-600 h-primary">Contact Us</Link></li>
              <li className="py-1" style={{ listStyleType: "none" }}><Link href="/" className="text-gray-600 h-primary">Store Pickup</Link></li>
            </ul>
          </div>

          {/* Policy column */}
          <div className="col-lg-2 col-md-4 mb-6 mb-lg-0">
            <h4 className="font-size-3 font-weight-medium mb-3">Policy</h4>
            <ul className="list-unstyled mb-0 font-size-2" style={{ paddingLeft: 0 }}>
              <li className="py-1" style={{ listStyleType: "none" }}><Link href="/faq" className="text-gray-600 h-primary">Return Policy</Link></li>
              <li className="py-1" style={{ listStyleType: "none" }}><Link href="/faq" className="text-gray-600 h-primary">Terms of Use</Link></li>
              <li className="py-1" style={{ listStyleType: "none" }}><Link href="/faq" className="text-gray-600 h-primary">Security</Link></li>
              <li className="py-1" style={{ listStyleType: "none" }}><Link href="/faq" className="text-gray-600 h-primary">Privacy</Link></li>
            </ul>
          </div>

          {/* Categories column */}
          <div className="col-lg-2 col-md-4">
            <h4 className="font-size-3 font-weight-medium mb-3">Categories</h4>
            <ul className="list-unstyled mb-0 font-size-2" style={{ paddingLeft: 0 }}>
              <li className="py-1" style={{ listStyleType: "none" }}><Link href="/" className="text-gray-600 h-primary">Action</Link></li>
              <li className="py-1" style={{ listStyleType: "none" }}><Link href="/" className="text-gray-600 h-primary">Comedy</Link></li>
              <li className="py-1" style={{ listStyleType: "none" }}><Link href="/" className="text-gray-600 h-primary">Drama</Link></li>
              <li className="py-1" style={{ listStyleType: "none" }}><Link href="/" className="text-gray-600 h-primary">Horror</Link></li>
              <li className="py-1" style={{ listStyleType: "none" }}><Link href="/" className="text-gray-600 h-primary">Kids</Link></li>
              <li className="py-1" style={{ listStyleType: "none" }}><Link href="/" className="text-gray-600 h-primary">Romantic Comedy</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="bg-gray-200 py-4 border-top">
        <div className="container d-md-flex justify-content-between align-items-center font-size-2 text-gray-600">
          <div className="mb-3 mb-md-0 text-center text-md-left">
            &copy;2020 Book Worm. All rights reserved
          </div>
          
          {/* Language & Currency Dropdowns */}
          <div className="d-flex justify-content-center justify-content-md-end align-items-center">
            <div className="position-relative mr-5">
              <a id="footerLanguageInvoker" href="#" className="dropdown-nav-link text-gray-600" style={{ textDecoration: "none" }}>
                English <i className="fa fa-chevron-down font-size-1 ml-1" style={{ fontSize: "10px" }}></i>
              </a>
            </div>
            <div className="position-relative">
              <a id="footerCurrencyInvoker" href="#" className="dropdown-nav-link text-gray-600" style={{ textDecoration: "none" }}>
                $ USD <i className="fa fa-chevron-down font-size-1 ml-1" style={{ fontSize: "10px" }}></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterV1;

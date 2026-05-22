"use client";

import React from "react";
import { SidebarCartProps } from "./types";
import { Icon } from "@/components/atoms";

export const SidebarCart: React.FC<SidebarCartProps> = ({ isOpen, onClose }) => {
  return (
    <aside
      className={`u-sidebar u-sidebar__xl transition-all ${isOpen ? "active" : ""}`}
      style={{
        display: "block",
        transform: isOpen ? "translate3d(0, 0, 0)" : "translate3d(100%, 0, 0)",
        visibility: isOpen ? "visible" : "hidden",
        transition: "transform 0.3s ease, visibility 0.3s ease",
        zIndex: 9999
      }}
    >
      <div className="u-sidebar__scroller">
        <div className="u-sidebar__container">
          <div className="u-header-sidebar__footer-offset">
            {/* Close Button */}
            <div className="d-flex align-items-center position-absolute top-0 right-0 z-index-2 mt-5 mr-md-6 mr-4">
              <button
                onClick={onClose}
                type="button"
                className="close ml-auto"
                aria-label="Close Sidebar"
              >
                <span>Close <Icon name="fas fa-times ml-2" /></span>
              </button>
            </div>

            {/* Body */}
            <div className="u-sidebar__body">
              <div className="u-sidebar__content u-header-sidebar__content">
                <header className="border-bottom px-4 px-md-6 py-4">
                  <h2 className="font-size-3 mb-0 d-flex align-items-center">
                    <Icon name="flaticon-icon-126515 mr-3 font-size-5" />Your shopping bag (3)
                  </h2>
                </header>

                <div className="px-4 py-5 px-md-6 border-bottom">
                  {/* Cart Item 1 */}
                  <div className="media mb-4">
                    <div className="mr-3">
                      <img src="https://placehold.it/120x180" alt="Book thumbnail" width="80" className="img-fluid" />
                    </div>
                    <div className="media-body">
                      <h4 className="font-size-2 mb-1"><a href="#">Think Like a Monk</a></h4>
                      <div className="text-gray-600 font-size-1 mb-1">1 × $29.00</div>
                      <button className="btn btn-link text-danger p-0 font-size-1">Remove</button>
                    </div>
                  </div>

                  {/* Cart Item 2 */}
                  <div className="media">
                    <div className="mr-3">
                      <img src="https://placehold.it/120x180" alt="Book thumbnail" width="80" className="img-fluid" />
                    </div>
                    <div className="media-body">
                      <h4 className="font-size-2 mb-1"><a href="#">Atomic Habits</a></h4>
                      <div className="text-gray-600 font-size-1 mb-1">2 × $22.00</div>
                      <button className="btn btn-link text-danger p-0 font-size-1">Remove</button>
                    </div>
                  </div>
                </div>

                {/* Subtotal & Checkout Actions */}
                <div className="px-4 py-5 px-md-6">
                  <div className="d-flex justify-content-between mb-4">
                    <span className="font-weight-medium text-dark">Subtotal:</span>
                    <span className="font-weight-medium text-dark">$73.00</span>
                  </div>
                  <a href="#" className="btn btn-block btn-dark rounded-0 py-3 mb-2 font-weight-medium">
                    View Cart
                  </a>
                  <a href="#" className="btn btn-block btn-outline-dark rounded-0 py-3 font-weight-medium">
                    Checkout
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
export default SidebarCart;

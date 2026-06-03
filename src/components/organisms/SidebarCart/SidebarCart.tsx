import React from "react";
import { SidebarCartProps } from "./types";
import { Icon } from "@/components/atoms";
import { useCart } from "@/contexts/CartContext";
import Link from "next/link";

export const SidebarCart: React.FC<SidebarCartProps> = ({ isOpen, onClose }) => {
  const { cartItems, removeFromCart, subtotal } = useCart();
  const totalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

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
                    <Icon name="flaticon-icon-126515 mr-3 font-size-5" />Your shopping bag ({totalCount})
                  </h2>
                </header>

                <div className="px-4 py-5 px-md-6 border-bottom" style={{ maxHeight: "450px", overflowY: "auto" }}>
                  {cartItems.length === 0 ? (
                    <div className="text-center py-5 text-gray-600">Your bag is empty.</div>
                  ) : (
                    cartItems.map((item) => (
                      <div className="media mb-4" key={item.id}>
                        <div className="mr-3" style={{ width: "60px" }}>
                          <img src={item.image} alt={item.name} className="img-fluid" />
                        </div>
                        <div className="media-body">
                          <h4 className="font-size-2 mb-1 text-truncate" style={{ maxWidth: "180px" }}>
                            <Link href="/product" onClick={onClose} className="text-dark">{item.name}</Link>
                          </h4>
                          <div className="text-gray-600 font-size-1 mb-1">
                            {item.quantity} × ${item.price.toFixed(2)}
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="btn btn-link text-danger p-0 font-size-1 border-0"
                            style={{ background: "none", textDecoration: "none" }}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Subtotal & Checkout Actions */}
                <div className="px-4 py-5 px-md-6">
                  <div className="d-flex justify-content-between mb-4">
                    <span className="font-weight-medium text-dark">Subtotal:</span>
                    <span className="font-weight-medium text-dark">${subtotal.toFixed(2)}</span>
                  </div>
                  <Link href="/cart" onClick={onClose} className="btn btn-block btn-dark rounded-0 py-3 mb-2 font-weight-medium text-center">
                    View Cart
                  </Link>
                  <Link href="/checkout" onClick={onClose} className="btn btn-block btn-outline-dark rounded-0 py-3 font-weight-medium text-center">
                    Checkout
                  </Link>
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

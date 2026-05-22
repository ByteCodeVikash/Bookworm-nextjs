import React, { useState } from "react";
import Link from "next/link";
import { MainLayout } from "@/components";

interface CartItem {
  id: string;
  name: string;
  author: string;
  price: number;
  quantity: number;
  image: string;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: "amy-byler",
      name: "The Overdue Life of Amy Byler",
      author: "Kelly Harms",
      price: 79.99,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=160&h=240&q=80",
    },
    {
      id: "ever-know",
      name: "All You Can Ever Know: A Memoir",
      author: "Nicole Chung",
      price: 49.99,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=160&h=240&q=80",
    },
    {
      id: "winter-garden",
      name: "Winter Garden",
      author: "Kristin Hannah",
      price: 59.99,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=160&h=240&q=80",
    },
  ]);

  const [shippingMethod, setShippingMethod] = useState<"free" | "flat" | "pickup">("flat");
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);

  // Shipping cost map
  const shippingCosts = {
    free: 0,
    flat: 15,
    pickup: 8,
  };

  const handleQtyChange = (id: string, delta: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          const newQty = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const handleRemove = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const applyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.toUpperCase() === "BOOKWORM20") {
      setDiscount(0.2); // 20% discount
      alert("Coupon applied successfully! 20% discount has been credited.");
    } else {
      alert("Invalid coupon code. Try BOOKWORM20!");
    }
  };

  // Subtotal calculation
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = subtotal * discount;
  const shippingCost = shippingCosts[shippingMethod];
  const grandTotal = subtotal - discountAmount + shippingCost;

  return (
    <MainLayout>
      <div className="page-header border-bottom">
        <div className="container">
          <div className="d-md-flex justify-content-between align-items-center py-4">
            <h1 className="page-title font-size-3 font-weight-medium m-0 text-lh-lg">Cart</h1>
            <nav className="woocommerce-breadcrumb font-size-2">
              <Link href="/" className="h-primary">Home</Link>
              <span className="breadcrumb-separator mx-1"><i className="fas fa-angle-right"></i></span>
              <Link href="/shop" className="h-primary">Shop</Link>
              <span className="breadcrumb-separator mx-1"><i className="fas fa-angle-right"></i></span>Cart
            </nav>
          </div>
        </div>
      </div>

      <div className="site-content bg-punch-light overflow-hidden" id="content">
        <div className="container">
          <header className="entry-header space-top-2 space-bottom-1 mb-2">
            <h1 className="entry-title font-size-7">
              Your cart: {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
            </h1>
          </header>

          {cartItems.length === 0 ? (
            <div className="text-center py-8 bg-white border mb-8">
              <div className="mb-4">
                <i className="fa fa-shopping-basket font-size-10 text-gray-400"></i>
              </div>
              <h3 className="font-weight-medium font-size-5 mb-3">Your cart is currently empty.</h3>
              <p className="text-gray-600 mb-5">Add items to your cart to see them listed here.</p>
              <Link href="/shop" className="btn btn-dark rounded-0 px-6 py-3 font-weight-medium">
                Return to Shop
              </Link>
            </div>
          ) : (
            <div className="row pb-8">
              {/* Cart Items Table */}
              <div id="primary" className="content-area col-lg-8 mb-5 mb-lg-0">
                <main id="main" className="site-main">
                  <div className="page type-page status-publish hentry bg-white p-4 border">
                    <div className="entry-content">
                      <div className="woocommerce">
                        <div className="table-responsive">
                          <table className="shop_table shop_table_responsive cart woocommerce-cart-form__contents w-100">
                            <thead>
                              <tr className="border-bottom text-uppercase font-size-1 text-gray-600 font-weight-bold">
                                <th className="product-name pb-3 text-left">Product</th>
                                <th className="product-price pb-3 text-left">Price</th>
                                <th className="product-quantity pb-3 text-left">Quantity</th>
                                <th className="product-subtotal pb-3 text-left">Total</th>
                                <th className="product-remove pb-3">&nbsp;</th>
                              </tr>
                            </thead>

                            <tbody>
                              {cartItems.map((item) => (
                                <tr key={item.id} className="woocommerce-cart-form__cart-item cart_item border-bottom py-3">
                                  <td className="product-name py-4" data-title="Product">
                                    <div className="d-flex align-items-center">
                                      <Link href={`/shop/${item.id}`}>
                                        <img
                                          src={item.image}
                                          className="attachment-shop_thumbnail size-shop_thumbnail wp-post-image rounded-0"
                                          alt={item.name}
                                          style={{ width: "60px", height: "90px", objectFit: "cover" }}
                                        />
                                      </Link>
                                      <div className="ml-3 m-w-200-lg-down">
                                        <Link href={`/shop/${item.id}`} className="font-weight-medium text-dark d-block">
                                          {item.name}
                                        </Link>
                                        <span className="text-gray-600 font-size-2 d-block">
                                          {item.author}
                                        </span>
                                      </div>
                                    </div>
                                  </td>

                                  <td className="product-price py-4" data-title="Price">
                                    <span className="woocommerce-Price-amount amount">
                                      £{item.price.toFixed(2)}
                                    </span>
                                  </td>

                                  <td className="product-quantity py-4" data-title="Quantity">
                                    <div className="quantity d-flex align-items-center">
                                      <div className="border px-2 py-1 d-inline-block">
                                        <div className="d-flex align-items-center justify-content-between" style={{ width: "90px" }}>
                                          <button
                                            type="button"
                                            className="btn btn-link p-0 text-dark border-0 shadow-none font-weight-bold"
                                            onClick={() => handleQtyChange(item.id, -1)}
                                          >
                                            <i className="fa fa-minus font-size-1"></i>
                                          </button>
                                          <span className="font-weight-medium font-size-2">{item.quantity}</span>
                                          <button
                                            type="button"
                                            className="btn btn-link p-0 text-dark border-0 shadow-none font-weight-bold"
                                            onClick={() => handleQtyChange(item.id, 1)}
                                          >
                                            <i className="fa fa-plus font-size-1"></i>
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  </td>

                                  <td className="product-subtotal py-4" data-title="Total">
                                    <span className="woocommerce-Price-amount amount font-weight-medium">
                                      £{(item.price * item.quantity).toFixed(2)}
                                    </span>
                                  </td>

                                  <td className="product-remove py-4 text-center">
                                    <a
                                      href="#"
                                      className="remove text-gray-400 hover-dark"
                                      onClick={(e) => handleRemove(item.id, e)}
                                      aria-label={`Remove ${item.name} from cart`}
                                    >
                                      <i className="fa fa-times"></i>
                                    </a>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </main>
              </div>

              {/* Sidebar / Cart Totals */}
              <div id="secondary" className="sidebar cart-collaterals col-lg-4" role="complementary">
                <div id="cartAccordion" className="border border-gray-900 bg-white mb-5">
                  
                  {/* Cart Totals */}
                  <div className="p-4 border-bottom">
                    <div id="cartHeadingOne" className="cart-head">
                      <h3 className="cart-title mb-0 font-weight-medium font-size-3 text-uppercase">Cart Totals</h3>
                    </div>

                    <div className="mt-4 cart-content">
                      <table className="shop_table shop_table_responsive w-100">
                        <tbody>
                          <tr className="cart-subtotal d-flex justify-content-between py-2">
                            <th className="font-weight-normal text-gray-600">Subtotal</th>
                            <td className="font-weight-medium">£{subtotal.toFixed(2)}</td>
                          </tr>

                          {discount > 0 && (
                            <tr className="cart-discount d-flex justify-content-between py-2 text-danger">
                              <th className="font-weight-normal">Discount (20%)</th>
                              <td className="font-weight-medium">-£{discountAmount.toFixed(2)}</td>
                            </tr>
                          )}

                          <tr className="order-shipping d-flex justify-content-between py-2">
                            <th className="font-weight-normal text-gray-600">Shipping</th>
                            <td className="font-weight-medium">
                              {shippingMethod === "free" ? "Free Shipping" : `£${shippingCost.toFixed(2)}`}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Shipping Selector */}
                  <div className="p-4 border-bottom">
                    <div id="cartHeadingTwo" className="cart-head">
                      <h3 className="cart-title mb-0 font-weight-medium font-size-3 text-uppercase">Shipping Methods</h3>
                    </div>

                    <div className="mt-4 cart-content">
                      <ul id="shipping_method" className="list-unstyled p-0 m-0">
                        <li className="d-flex align-items-center mb-2">
                          <input
                            type="radio"
                            name="shipping_method"
                            id="shipping_free"
                            value="free"
                            checked={shippingMethod === "free"}
                            onChange={() => setShippingMethod("free")}
                            className="mr-2"
                          />
                          <label htmlFor="shipping_free" className="mb-0 font-size-2 cursor-pointer">Free shipping</label>
                        </li>

                        <li className="d-flex align-items-center mb-2">
                          <input
                            type="radio"
                            name="shipping_method"
                            id="shipping_flat"
                            value="flat"
                            checked={shippingMethod === "flat"}
                            onChange={() => setShippingMethod("flat")}
                            className="mr-2"
                          />
                          <label htmlFor="shipping_flat" className="mb-0 font-size-2 cursor-pointer">
                            Flat rate: <span className="font-weight-medium">£15.00</span>
                          </label>
                        </li>

                        <li className="d-flex align-items-center mb-2">
                          <input
                            type="radio"
                            name="shipping_method"
                            id="shipping_pickup"
                            value="pickup"
                            checked={shippingMethod === "pickup"}
                            onChange={() => setShippingMethod("pickup")}
                            className="mr-2"
                          />
                          <label htmlFor="shipping_pickup" className="mb-0 font-size-2 cursor-pointer">
                            Local pickup: <span className="font-weight-medium">£8.00</span>
                          </label>
                        </li>
                      </ul>
                      <div className="mt-3">
                        <span className="font-size-2 text-gray-600">Shipping to Turkey.</span>
                        <a href="#" className="font-weight-medium text-dark ml-2 font-size-2 text-decoration-underline" onClick={(e) => e.preventDefault()}>
                          Change Address
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Coupon Block */}
                  <div className="p-4 border-bottom">
                    <div id="cartHeadingThree" className="cart-head">
                      <h3 className="cart-title mb-0 font-weight-medium font-size-3 text-uppercase">Coupon Code</h3>
                    </div>

                    <div className="mt-3 cart-content">
                      <form onSubmit={applyCoupon} className="d-flex gap-2">
                        <input
                          type="text"
                          name="coupon_code"
                          className="form-control rounded-0 font-size-2 pl-3 height-40 shadow-none border-dark"
                          id="coupon_code"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          placeholder="Coupon code"
                        />
                        <button
                          type="submit"
                          className="btn btn-outline-dark rounded-0 px-3 font-weight-medium font-size-2 height-40 text-nowrap"
                        >
                          Apply
                        </button>
                      </form>
                      <p className="font-size-1 text-gray-500 mt-2 mb-0">Use "BOOKWORM20" for 20% off!</p>
                    </div>
                  </div>

                  {/* Grand Total */}
                  <div className="p-4 bg-light">
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="font-weight-bold text-uppercase font-size-3">Total</span>
                      <span className="font-weight-bold font-size-5 text-dark">
                        £{grandTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="wc-proceed-to-checkout">
                  <Link
                    href="/checkout"
                    className="checkout-button button alt wc-forward btn btn-dark btn-block rounded-0 py-4 font-weight-medium text-uppercase tracking-wide"
                  >
                    Proceed to checkout
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

import React, { useState } from "react";
import Link from "next/link";
import { MainLayout } from "@/components";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

export default function CheckoutPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    companyName: "",
    country: "GB",
    streetAddress: "",
    apartment: "",
    city: "",
    county: "",
    postcode: "",
    phone: "",
    email: "",
    orderNotes: "",
  });

  const [orderItems] = useState<OrderItem[]>([
    { name: "The Overdue Life of Amy Byler", quantity: 1, price: 79.99 },
    { name: "All You Can Ever Know: A Memoir", quantity: 1, price: 49.99 },
    { name: "Winter Garden", quantity: 1, price: 59.99 },
  ]);

  const [shippingMethod, setShippingMethod] = useState<"free" | "flat" | "pickup">("flat");
  const [paymentMethod, setPaymentMethod] = useState<"bacs" | "cheque" | "cod">("cod");
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);

  // Accordion open states
  const [openSections, setOpenSections] = useState({
    order: true,
    totals: true,
    shipping: true,
    coupon: false,
    payment: true,
  });

  const toggleSection = (section: keyof typeof openSections, e: React.MouseEvent) => {
    e.preventDefault();
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const applyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.toUpperCase() === "BOOKWORM20") {
      setDiscount(0.2); // 20% discount
      alert("Coupon applied! 20% discount has been calculated.");
    } else {
      alert("Invalid coupon code.");
    }
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.streetAddress || !formData.city || !formData.postcode || !formData.phone || !formData.email) {
      alert("Please fill in all required billing fields (*) before placing order.");
      return;
    }
    alert("Thank you! Your order has been placed successfully.");
    window.location.href = "/my-account";
  };

  // Pricing calculations
  const subtotal = orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = subtotal * discount;
  const shippingCosts = { free: 0, flat: 15, pickup: 8 };
  const shippingCost = shippingCosts[shippingMethod];
  const grandTotal = subtotal - discountAmount + shippingCost;

  return (
    <MainLayout>
      <div className="page-header border-bottom">
        <div className="container">
          <div className="d-md-flex justify-content-between align-items-center py-4">
            <h1 className="page-title font-size-3 font-weight-medium m-0 text-lh-lg">Checkout</h1>
            <nav className="woocommerce-breadcrumb font-size-2">
              <Link href="/" className="h-primary">Home</Link>
              <span className="breadcrumb-separator mx-1"><i className="fas fa-angle-right"></i></span>
              <Link href="/cart" className="h-primary">Cart</Link>
              <span className="breadcrumb-separator mx-1"><i className="fas fa-angle-right"></i></span>Checkout
            </nav>
          </div>
        </div>
      </div>

      <div className="site-content bg-punch-light space-bottom-3" id="content">
        <div className="container">
          <article className="post-6 page type-page status-publish hentry">
            <header className="entry-header space-top-2 space-bottom-1 mb-2">
              <h1 className="entry-title font-size-7 text-center">Checkout</h1>
            </header>

            <div className="entry-content">
              <div className="woocommerce">
                {/* Coupon Info Header Toggle */}
                <div className="woocommerce-info p-4 bg-white border d-flex justify-content-between align-items-center">
                  <span>
                    Have a coupon?{" "}
                    <a
                      href="#"
                      className="font-weight-medium text-dark text-decoration-underline"
                      onClick={(e) => toggleSection("coupon", e)}
                    >
                      Click here to enter your code
                    </a>
                  </span>
                </div>

                {openSections.coupon && (
                  <form onSubmit={applyCoupon} className="checkout_coupon mt-4 p-4 bg-white border">
                    <div className="row">
                      <div className="col-md-4 mb-3 mb-md-0">
                        <input
                          type="text"
                          name="coupon_code"
                          className="form-control rounded-0 font-size-2 border-dark"
                          placeholder="Coupon code"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                        />
                      </div>
                      <div className="col-md-3">
                        <button type="submit" className="btn btn-dark rounded-0 w-100 height-4 font-weight-medium font-size-2">
                          Apply coupon
                        </button>
                      </div>
                    </div>
                  </form>
                )}

                {/* Main Checkout Form */}
                <form onSubmit={handlePlaceOrder} className="checkout woocommerce-checkout row mt-8">
                  
                  {/* Left Column: Billing Details */}
                  <div className="col-md-6 col-lg-7 col-xl-8 mb-6 mb-md-0" id="customer_details">
                    <div className="px-4 py-5 bg-white border">
                      <h3 className="mb-4 font-size-3 text-uppercase font-weight-bold">Billing details</h3>

                      <div className="row">
                        <div className="col-lg-6 mb-4">
                          <label className="form-label font-size-2 text-gray-600">
                            First name <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            name="firstName"
                            className="form-control rounded-0"
                            required
                            value={formData.firstName}
                            onChange={handleInputChange}
                          />
                        </div>

                        <div className="col-lg-6 mb-4">
                          <label className="form-label font-size-2 text-gray-600">
                            Last name <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            name="lastName"
                            className="form-control rounded-0"
                            required
                            value={formData.lastName}
                            onChange={handleInputChange}
                          />
                        </div>

                        <div className="col-12 mb-4">
                          <label className="form-label font-size-2 text-gray-600">Company name (optional)</label>
                          <input
                            type="text"
                            name="companyName"
                            className="form-control rounded-0"
                            value={formData.companyName}
                            onChange={handleInputChange}
                          />
                        </div>

                        <div className="col-12 mb-4">
                          <label className="form-label font-size-2 text-gray-600">
                            Country <span className="text-danger">*</span>
                          </label>
                          <select
                            name="country"
                            className="form-control rounded-0 custom-select"
                            value={formData.country}
                            onChange={handleInputChange}
                          >
                            <option value="GB">United Kingdom (UK)</option>
                            <option value="US">United States (US)</option>
                            <option value="TR">Turkey</option>
                            <option value="IN">India</option>
                          </select>
                        </div>

                        <div className="col-12 mb-2">
                          <label className="form-label font-size-2 text-gray-600">
                            Street address <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            name="streetAddress"
                            placeholder="House number and street name"
                            className="form-control rounded-0 mb-3"
                            required
                            value={formData.streetAddress}
                            onChange={handleInputChange}
                          />
                          <input
                            type="text"
                            name="apartment"
                            placeholder="Apartment, suite, unit etc. (optional)"
                            className="form-control rounded-0"
                            value={formData.apartment}
                            onChange={handleInputChange}
                          />
                        </div>

                        <div className="col-12 mb-4">
                          <label className="form-label font-size-2 text-gray-600">
                            Town / City <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            name="city"
                            className="form-control rounded-0"
                            required
                            value={formData.city}
                            onChange={handleInputChange}
                          />
                        </div>

                        <div className="col-12 mb-4">
                          <label className="form-label font-size-2 text-gray-600">County (optional)</label>
                          <input
                            type="text"
                            name="county"
                            className="form-control rounded-0"
                            value={formData.county}
                            onChange={handleInputChange}
                          />
                        </div>

                        <div className="col-12 mb-4">
                          <label className="form-label font-size-2 text-gray-600">
                            Postcode <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            name="postcode"
                            className="form-control rounded-0"
                            required
                            value={formData.postcode}
                            onChange={handleInputChange}
                          />
                        </div>

                        <div className="col-12 mb-4">
                          <label className="form-label font-size-2 text-gray-600">
                            Phone <span className="text-danger">*</span>
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            className="form-control rounded-0"
                            required
                            value={formData.phone}
                            onChange={handleInputChange}
                          />
                        </div>

                        <div className="col-12 mb-4">
                          <label className="form-label font-size-2 text-gray-600">
                            Email address <span className="text-danger">*</span>
                          </label>
                          <input
                            type="email"
                            name="email"
                            className="form-control rounded-0"
                            required
                            value={formData.email}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="px-4 py-5 bg-white border border-top-0">
                      <h3 className="mb-4 font-size-3 text-uppercase font-weight-bold">Additional information</h3>
                      <div>
                        <label className="form-label font-size-2 text-gray-600">Order notes (optional)</label>
                        <textarea
                          name="orderNotes"
                          rows={4}
                          className="form-control rounded-0"
                          placeholder="Notes about your order, e.g. special notes for delivery."
                          value={formData.orderNotes}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Checkout Accordion & Order Summary */}
                  <div className="col-md-6 col-lg-5 col-xl-4 woocommerce-checkout-review-order">
                    <div id="checkoutAccordion" className="border border-gray-900 bg-white mb-5">
                      
                      {/* Section 1: Your Order */}
                      <div className="border-bottom">
                        <div className="p-4">
                          <a
                            href="#"
                            className="text-dark d-flex align-items-center justify-content-between text-uppercase font-weight-medium font-size-3"
                            onClick={(e) => toggleSection("order", e)}
                          >
                            <span>Your Order</span>
                            <i className={`fas fa-${openSections.order ? "minus" : "plus"} font-size-1`}></i>
                          </a>
                        </div>

                        {openSections.order && (
                          <div className="px-4 pb-4">
                            <table className="shop_table w-100 font-size-2">
                              <tbody>
                                {orderItems.map((item, idx) => (
                                  <tr key={idx} className="border-bottom py-2 d-flex justify-content-between">
                                    <td className="product-name py-2 pr-2 text-gray-600">
                                      {item.name} <strong className="product-quantity font-size-1">× {item.quantity}</strong>
                                    </td>
                                    <td className="product-total py-2 text-right font-weight-medium text-dark">
                                      £{(item.price * item.quantity).toFixed(2)}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>

                      {/* Section 2: Cart Totals */}
                      <div className="border-bottom">
                        <div className="p-4">
                          <a
                            href="#"
                            className="text-dark d-flex align-items-center justify-content-between text-uppercase font-weight-medium font-size-3"
                            onClick={(e) => toggleSection("totals", e)}
                          >
                            <span>Cart Totals</span>
                            <i className={`fas fa-${openSections.totals ? "minus" : "plus"} font-size-1`}></i>
                          </a>
                        </div>

                        {openSections.totals && (
                          <div className="px-4 pb-4">
                            <table className="shop_table w-100 font-size-2">
                              <tbody>
                                <tr className="d-flex justify-content-between py-2 border-bottom">
                                  <th className="font-weight-normal text-gray-600">Subtotal</th>
                                  <td className="font-weight-medium text-dark">£{subtotal.toFixed(2)}</td>
                                </tr>
                                {discount > 0 && (
                                  <tr className="d-flex justify-content-between py-2 border-bottom text-danger">
                                    <th className="font-weight-normal">Discount (20%)</th>
                                    <td className="font-weight-medium">-£{discountAmount.toFixed(2)}</td>
                                  </tr>
                                )}
                                <tr className="d-flex justify-content-between py-2">
                                  <th className="font-weight-normal text-gray-600">Shipping</th>
                                  <td className="font-weight-medium text-dark">
                                    {shippingMethod === "free" ? "Free Shipping" : `£${shippingCost.toFixed(2)}`}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>

                      {/* Section 3: Shipping Rates */}
                      <div className="border-bottom">
                        <div className="p-4">
                          <a
                            href="#"
                            className="text-dark d-flex align-items-center justify-content-between text-uppercase font-weight-medium font-size-3"
                            onClick={(e) => toggleSection("shipping", e)}
                          >
                            <span>Shipping</span>
                            <i className={`fas fa-${openSections.shipping ? "minus" : "plus"} font-size-1`}></i>
                          </a>
                        </div>

                        {openSections.shipping && (
                          <div className="px-4 pb-4 font-size-2">
                            <ul className="list-unstyled p-0 m-0">
                              <li className="d-flex align-items-center mb-2">
                                <input
                                  type="radio"
                                  name="shipping_opt"
                                  id="ship_free"
                                  checked={shippingMethod === "free"}
                                  onChange={() => setShippingMethod("free")}
                                  className="mr-2"
                                />
                                <label htmlFor="ship_free" className="mb-0 cursor-pointer">Free shipping</label>
                              </li>

                              <li className="d-flex align-items-center mb-2">
                                <input
                                  type="radio"
                                  name="shipping_opt"
                                  id="ship_flat"
                                  checked={shippingMethod === "flat"}
                                  onChange={() => setShippingMethod("flat")}
                                  className="mr-2"
                                />
                                <label htmlFor="ship_flat" className="mb-0 cursor-pointer">
                                  Flat rate: <span className="font-weight-medium">£15.00</span>
                                </label>
                              </li>

                              <li className="d-flex align-items-center">
                                <input
                                  type="radio"
                                  name="shipping_opt"
                                  id="ship_pickup"
                                  checked={shippingMethod === "pickup"}
                                  onChange={() => setShippingMethod("pickup")}
                                  className="mr-2"
                                />
                                <label htmlFor="ship_pickup" className="mb-0 cursor-pointer">
                                  Local pickup: <span className="font-weight-medium">£8.00</span>
                                </label>
                              </li>
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* Grand Total Display */}
                      <div className="border-bottom p-4 bg-light d-flex justify-content-between align-items-center">
                        <span className="font-weight-bold text-uppercase font-size-3">Total</span>
                        <span className="font-weight-bold font-size-5 text-dark">
                          £{grandTotal.toFixed(2)}
                        </span>
                      </div>

                      {/* Section 4: Payment Methods */}
                      <div>
                        <div className="p-4">
                          <a
                            href="#"
                            className="text-dark d-flex align-items-center justify-content-between text-uppercase font-weight-medium font-size-3"
                            onClick={(e) => toggleSection("payment", e)}
                          >
                            <span>Payment Methods</span>
                            <i className={`fas fa-${openSections.payment ? "minus" : "plus"} font-size-1`}></i>
                          </a>
                        </div>

                        {openSections.payment && (
                          <div className="px-4 pb-4 font-size-2">
                            <ul className="list-unstyled p-0 m-0">
                              
                              {/* Direct Bank Transfer */}
                              <li className="border-bottom py-2">
                                <div className="d-flex align-items-center mb-2">
                                  <input
                                    type="radio"
                                    name="payment_opt"
                                    id="pay_bacs"
                                    checked={paymentMethod === "bacs"}
                                    onChange={() => setPaymentMethod("bacs")}
                                    className="mr-2"
                                  />
                                  <label htmlFor="pay_bacs" className="mb-0 font-weight-medium cursor-pointer text-dark">
                                    Direct bank transfer
                                  </label>
                                </div>
                                {paymentMethod === "bacs" && (
                                  <p className="text-gray-500 mb-0 font-size-1 pl-4 leading-normal">
                                    Make your payment directly into our bank account. Please use your Order ID as the payment reference. Your order won’t be shipped until the funds have cleared in our account.
                                  </p>
                                )}
                              </li>

                              {/* Check Payments */}
                              <li className="border-bottom py-2">
                                <div className="d-flex align-items-center mb-2">
                                  <input
                                    type="radio"
                                    name="payment_opt"
                                    id="pay_cheque"
                                    checked={paymentMethod === "cheque"}
                                    onChange={() => setPaymentMethod("cheque")}
                                    className="mr-2"
                                  />
                                  <label htmlFor="pay_cheque" className="mb-0 font-weight-medium cursor-pointer text-dark">
                                    Check payments
                                  </label>
                                </div>
                                {paymentMethod === "cheque" && (
                                  <p className="text-gray-500 mb-0 font-size-1 pl-4 leading-normal">
                                    Please send a check to Store Name, Store Street, Store Town, Store State / County, Store Postcode.
                                  </p>
                                )}
                              </li>

                              {/* Cash on Delivery */}
                              <li className="py-2">
                                <div className="d-flex align-items-center mb-2">
                                  <input
                                    type="radio"
                                    name="payment_opt"
                                    id="pay_cod"
                                    checked={paymentMethod === "cod"}
                                    onChange={() => setPaymentMethod("cod")}
                                    className="mr-2"
                                  />
                                  <label htmlFor="pay_cod" className="mb-0 font-weight-medium cursor-pointer text-dark">
                                    Cash on delivery
                                  </label>
                                </div>
                                {paymentMethod === "cod" && (
                                  <p className="text-gray-500 mb-0 font-size-1 pl-4 leading-normal">
                                    Pay with cash upon delivery.
                                  </p>
                                )}
                              </li>
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-dark btn-block rounded-0 py-4 font-weight-medium text-uppercase tracking-wider font-size-3"
                    >
                      Place Order
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </article>
        </div>
      </div>
    </MainLayout>
  );
}

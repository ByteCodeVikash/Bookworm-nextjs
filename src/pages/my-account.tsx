import React, { useEffect, useState } from "react";
import Link from "next/link";
import { MainLayout } from "@/components";
import { fetchApi } from "@/utils/api";

type TabName = "dashboard" | "orders" | "downloads" | "addresses" | "details" | "wishlist";

interface Order {
  id: string;
  date: string;
  status: string;
  total: number;
  itemsCount: number;
}

interface WishlistItem {
  id: string;
  name: string;
  author: string;
  price: number;
  image: string;
  inStock: boolean;
}

export default function MyAccountPage() {
  const [activeTab, setActiveTab] = useState<TabName>("dashboard");

  // Form states
  const [profile, setProfile] = useState({
    firstName: "Ali",
    lastName: "Tufan",
    displayName: "alitfn58",
    email: "ali.tufan@example.com",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [billingAddress, setBillingAddress] = useState({
    name: "Ali Tufan",
    street: "Bedford St, Covent Garden",
    city: "London WC2E 9ED",
    country: "United Kingdom",
  });

  const [shippingAddress, setShippingAddress] = useState({
    name: "Ali Tufan",
    street: "Bedford St, Covent Garden",
    city: "London WC2E 9ED",
    country: "United Kingdom",
  });

  const [isEditingBilling, setIsEditingBilling] = useState(false);
  const [isEditingShipping, setIsEditingShipping] = useState(false);

  // Dynamic Orders from database
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    let active = true;
    const loadOrders = async () => {
      try {
        const data = await fetchApi<Order[]>("/api/orders.php?userId=1");
        if (active) {
          setOrders(data);
        }
      } catch (err) {
        console.error("Failed to load orders:", err);
      }
    };
    loadOrders();
    return () => { active = false; };
  }, []);

  // Wishlist mock data
  const [wishlist, setWishlist] = useState<WishlistItem[]>([
    {
      id: "amy-byler",
      name: "The Overdue Life of Amy Byler",
      author: "Kelly Harms",
      price: 79.99,
      image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=120&h=180&q=80",
      inStock: true,
    },
    {
      id: "winter-garden",
      name: "Winter Garden",
      author: "Kristin Hannah",
      price: 59.99,
      image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=120&h=180&q=80",
      inStock: true,
    },
  ]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const saveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (profile.newPassword && profile.newPassword !== profile.confirmPassword) {
      alert("New passwords do not match!");
      return;
    }
    alert("Profile details updated successfully!");
  };

  const removeWishlistItem = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    setWishlist((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <MainLayout>
      <div className="page-header border-bottom">
        <div className="container">
          <div className="d-md-flex justify-content-between align-items-center py-4">
            <h1 className="page-title font-size-3 font-weight-medium m-0 text-lh-lg">My Account</h1>
            <nav className="woocommerce-breadcrumb font-size-2">
              <Link href="/" className="h-primary">Home</Link>
              <span className="breadcrumb-separator mx-1"><i className="fas fa-angle-right"></i></span>
              My Account
            </nav>
          </div>
        </div>
      </div>

      <main id="content" className="bg-punch-light py-5 py-lg-8">
        <div className="container">
          <div className="row bg-white border p-4 p-md-5">
            {/* Sidebar Navigation */}
            <div className="col-md-3 border-right border-md-bottom-0 mb-4 mb-md-0">
              <h6 className="font-weight-medium font-size-7 mb-4 mb-lg-6">My Account</h6>
              <div className="tab-wrapper">
                <ul className="my__account-nav nav flex-column mb-0" role="tablist">
                  <li className="nav-item mx-0">
                    <button
                      onClick={() => setActiveTab("dashboard")}
                      className={`nav-link text-left d-flex align-items-center px-0 py-2 border-0 bg-transparent w-100 ${
                        activeTab === "dashboard" ? "font-weight-bold text-dark" : "text-gray-600"
                      }`}
                    >
                      Dashboard
                    </button>
                  </li>
                  <li className="nav-item mx-0">
                    <button
                      onClick={() => setActiveTab("orders")}
                      className={`nav-link text-left d-flex align-items-center px-0 py-2 border-0 bg-transparent w-100 ${
                        activeTab === "orders" ? "font-weight-bold text-dark" : "text-gray-600"
                      }`}
                    >
                      Orders
                    </button>
                  </li>
                  <li className="nav-item mx-0">
                    <button
                      onClick={() => setActiveTab("downloads")}
                      className={`nav-link text-left d-flex align-items-center px-0 py-2 border-0 bg-transparent w-100 ${
                        activeTab === "downloads" ? "font-weight-bold text-dark" : "text-gray-600"
                      }`}
                    >
                      Downloads
                    </button>
                  </li>
                  <li className="nav-item mx-0">
                    <button
                      onClick={() => setActiveTab("addresses")}
                      className={`nav-link text-left d-flex align-items-center px-0 py-2 border-0 bg-transparent w-100 ${
                        activeTab === "addresses" ? "font-weight-bold text-dark" : "text-gray-600"
                      }`}
                    >
                      Addresses
                    </button>
                  </li>
                  <li className="nav-item mx-0">
                    <button
                      onClick={() => setActiveTab("details")}
                      className={`nav-link text-left d-flex align-items-center px-0 py-2 border-0 bg-transparent w-100 ${
                        activeTab === "details" ? "font-weight-bold text-dark" : "text-gray-600"
                      }`}
                    >
                      Account details
                    </button>
                  </li>
                  <li className="nav-item mx-0">
                    <button
                      onClick={() => setActiveTab("wishlist")}
                      className={`nav-link text-left d-flex align-items-center px-0 py-2 border-0 bg-transparent w-100 ${
                        activeTab === "wishlist" ? "font-weight-bold text-dark" : "text-gray-600"
                      }`}
                    >
                      Wishlist
                    </button>
                  </li>
                  <li className="nav-item mx-0 pt-2 border-top">
                    <Link href="/" className="nav-link text-left d-flex align-items-center px-0 py-2 text-danger">
                      Logout
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Tab Contents */}
            <div className="col-md-9 pl-md-4 pl-lg-5">
              
              {/* PANEL 1: DASHBOARD */}
              {activeTab === "dashboard" && (
                <div>
                  <h3 className="font-weight-medium font-size-6 mb-4">Dashboard</h3>
                  <div className="mb-4">
                    <span className="font-size-22 font-weight-medium">Hello {profile.displayName}</span>
                    <span className="font-size-2 text-gray-500">
                      {" "}
                      (not {profile.displayName}?{" "}
                      <Link href="/" className="text-dark font-weight-medium text-decoration-underline">
                        Log out
                      </Link>
                      )
                    </span>
                  </div>
                  <div className="mb-5">
                    <p className="mb-0 font-size-2 text-gray-600 leading-relaxed">
                      From your account dashboard you can view your{" "}
                      <span className="text-dark font-weight-medium">recent orders</span>, manage your{" "}
                      <span className="text-dark font-weight-medium">shipping and billing addresses</span>, and edit your{" "}
                      <span className="text-dark font-weight-medium">password and account details</span>.
                    </p>
                  </div>

                  <div className="row no-gutters row-cols-1 row-cols-sm-2 row-cols-lg-3 gap-3">
                    <div className="col p-2">
                      <div className="border py-5 text-center cursor-pointer hover-bg-light transition" onClick={() => setActiveTab("orders")}>
                        <div className="mb-2 text-primary font-size-8"><i className="fa fa-shopping-bag"></i></div>
                        <div className="font-weight-medium font-size-3">Orders</div>
                      </div>
                    </div>
                    <div className="col p-2">
                      <div className="border py-5 text-center cursor-pointer hover-bg-light transition" onClick={() => setActiveTab("downloads")}>
                        <div className="mb-2 text-primary font-size-8"><i className="fa fa-download"></i></div>
                        <div className="font-weight-medium font-size-3">Downloads</div>
                      </div>
                    </div>
                    <div className="col p-2">
                      <div className="border py-5 text-center cursor-pointer hover-bg-light transition" onClick={() => setActiveTab("addresses")}>
                        <div className="mb-2 text-primary font-size-8"><i className="fa fa-map-marker-alt"></i></div>
                        <div className="font-weight-medium font-size-3">Addresses</div>
                      </div>
                    </div>
                    <div className="col p-2">
                      <div className="border py-5 text-center cursor-pointer hover-bg-light transition" onClick={() => setActiveTab("details")}>
                        <div className="mb-2 text-primary font-size-8"><i className="fa fa-user"></i></div>
                        <div className="font-weight-medium font-size-3">Account Details</div>
                      </div>
                    </div>
                    <div className="col p-2">
                      <div className="border py-5 text-center cursor-pointer hover-bg-light transition" onClick={() => setActiveTab("wishlist")}>
                        <div className="mb-2 text-primary font-size-8"><i className="fa fa-heart"></i></div>
                        <div className="font-weight-medium font-size-3">Wishlist</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* PANEL 2: ORDERS */}
              {activeTab === "orders" && (
                <div>
                  <h3 className="font-weight-medium font-size-6 mb-4">Orders</h3>
                  <div className="table-responsive">
                    <table className="table border">
                      <thead>
                        <tr className="bg-light">
                          <th className="py-3 font-weight-medium border-0 pl-3">Order</th>
                          <th className="py-3 font-weight-medium border-0">Date</th>
                          <th className="py-3 font-weight-medium border-0">Status</th>
                          <th className="py-3 font-weight-medium border-0">Total</th>
                          <th className="py-3 font-weight-medium border-0 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => (
                          <tr key={order.id} className="border-bottom">
                            <td className="py-4 align-middle pl-3 font-weight-bold">{order.id}</td>
                            <td className="py-4 align-middle text-gray-600">{order.date}</td>
                            <td className="py-4 align-middle">
                              <span className={`badge px-2 py-1 ${order.status === "Completed" ? "badge-success" : "badge-warning"}`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="py-4 align-middle font-weight-medium">
                              £{order.total.toFixed(2)} <span className="text-gray-500 font-size-1">for {order.itemsCount} items</span>
                            </td>
                            <td className="py-4 align-middle text-center">
                              <button className="btn btn-dark rounded-0 px-3 py-1 font-size-2" onClick={() => alert(`Viewing details for ${order.id}`)}>
                                View
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* PANEL 3: DOWNLOADS */}
              {activeTab === "downloads" && (
                <div>
                  <h3 className="font-weight-medium font-size-6 mb-4">Downloads</h3>
                  <div className="text-center py-5 border bg-light">
                    <div className="mb-3 text-gray-400 font-size-8"><i className="fa fa-cloud-download-alt"></i></div>
                    <p className="text-gray-600 mb-0 font-size-2">No digital downloads available yet.</p>
                  </div>
                </div>
              )}

              {/* PANEL 4: ADDRESSES */}
              {activeTab === "addresses" && (
                <div>
                  <h3 className="font-weight-medium font-size-6 mb-4">Addresses</h3>
                  <p className="text-gray-600 font-size-2 mb-4">
                    The following addresses will be used on the checkout page by default.
                  </p>

                  <div className="row">
                    {/* Billing Address Card */}
                    <div className="col-md-6 mb-4 mb-md-0">
                      <div className="border p-4 h-100 d-flex flex-column justify-content-between">
                        <div>
                          <h4 className="font-size-4 font-weight-bold mb-3 border-bottom pb-2">Billing Address</h4>
                          {isEditingBilling ? (
                            <div>
                              <input
                                type="text"
                                className="form-control rounded-0 mb-2 font-size-2"
                                value={billingAddress.name}
                                onChange={(e) => setBillingAddress({ ...billingAddress, name: e.target.value })}
                                placeholder="Name"
                              />
                              <input
                                type="text"
                                className="form-control rounded-0 mb-2 font-size-2"
                                value={billingAddress.street}
                                onChange={(e) => setBillingAddress({ ...billingAddress, street: e.target.value })}
                                placeholder="Street"
                              />
                              <input
                                type="text"
                                className="form-control rounded-0 mb-2 font-size-2"
                                value={billingAddress.city}
                                onChange={(e) => setBillingAddress({ ...billingAddress, city: e.target.value })}
                                placeholder="City"
                              />
                              <input
                                type="text"
                                className="form-control rounded-0 mb-3 font-size-2"
                                value={billingAddress.country}
                                onChange={(e) => setBillingAddress({ ...billingAddress, country: e.target.value })}
                                placeholder="Country"
                              />
                            </div>
                          ) : (
                            <address className="font-size-2 text-gray-600 leading-relaxed mb-4">
                              <strong className="text-dark d-block mb-1">{billingAddress.name}</strong>
                              {billingAddress.street}
                              <br />
                              {billingAddress.city}
                              <br />
                              {billingAddress.country}
                            </address>
                          )}
                        </div>
                        <div>
                          <button
                            onClick={() => setIsEditingBilling(!isEditingBilling)}
                            className="btn btn-dark rounded-0 px-4 py-2 font-size-2"
                          >
                            {isEditingBilling ? "Save Address" : "Edit"}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Shipping Address Card */}
                    <div className="col-md-6">
                      <div className="border p-4 h-100 d-flex flex-column justify-content-between">
                        <div>
                          <h4 className="font-size-4 font-weight-bold mb-3 border-bottom pb-2">Shipping Address</h4>
                          {isEditingShipping ? (
                            <div>
                              <input
                                type="text"
                                className="form-control rounded-0 mb-2 font-size-2"
                                value={shippingAddress.name}
                                onChange={(e) => setShippingAddress({ ...shippingAddress, name: e.target.value })}
                                placeholder="Name"
                              />
                              <input
                                type="text"
                                className="form-control rounded-0 mb-2 font-size-2"
                                value={shippingAddress.street}
                                onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                                placeholder="Street"
                              />
                              <input
                                type="text"
                                className="form-control rounded-0 mb-2 font-size-2"
                                value={shippingAddress.city}
                                onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                                placeholder="City"
                              />
                              <input
                                type="text"
                                className="form-control rounded-0 mb-3 font-size-2"
                                value={shippingAddress.country}
                                onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                                placeholder="Country"
                              />
                            </div>
                          ) : (
                            <address className="font-size-2 text-gray-600 leading-relaxed mb-4">
                              <strong className="text-dark d-block mb-1">{shippingAddress.name}</strong>
                              {shippingAddress.street}
                              <br />
                              {shippingAddress.city}
                              <br />
                              {shippingAddress.country}
                            </address>
                          )}
                        </div>
                        <div>
                          <button
                            onClick={() => setIsEditingShipping(!isEditingShipping)}
                            className="btn btn-dark rounded-0 px-4 py-2 font-size-2"
                          >
                            {isEditingShipping ? "Save Address" : "Edit"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* PANEL 5: ACCOUNT DETAILS */}
              {activeTab === "details" && (
                <div>
                  <h3 className="font-weight-medium font-size-6 mb-4">Account details</h3>
                  <form onSubmit={saveProfile}>
                    <div className="row mb-4">
                      <div className="col-md-6 mb-3 mb-md-0">
                        <label className="form-label font-size-2 text-gray-600">First name *</label>
                        <input
                          type="text"
                          name="firstName"
                          className="form-control rounded-0"
                          required
                          value={profile.firstName}
                          onChange={handleProfileChange}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label font-size-2 text-gray-600">Last name *</label>
                        <input
                          type="text"
                          name="lastName"
                          className="form-control rounded-0"
                          required
                          value={profile.lastName}
                          onChange={handleProfileChange}
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="form-label font-size-2 text-gray-600">Display name *</label>
                      <input
                        type="text"
                        name="displayName"
                        className="form-control rounded-0"
                        required
                        value={profile.displayName}
                        onChange={handleProfileChange}
                      />
                      <small className="text-gray-500 font-size-1 mt-1 d-block">
                        This will be how your name will be displayed in the account section and in reviews.
                      </small>
                    </div>

                    <div className="mb-5">
                      <label className="form-label font-size-2 text-gray-600">Email address *</label>
                      <input
                        type="email"
                        name="email"
                        className="form-control rounded-0"
                        required
                        value={profile.email}
                        onChange={handleProfileChange}
                      />
                    </div>

                    {/* Password Change Subblock */}
                    <div className="border-top pt-5">
                      <h4 className="font-size-4 font-weight-bold mb-4">Password change</h4>
                      <div className="mb-4">
                        <label className="form-label font-size-2 text-gray-600">Current password (leave blank to leave unchanged)</label>
                        <input
                          type="password"
                          name="currentPassword"
                          className="form-control rounded-0"
                          value={profile.currentPassword}
                          onChange={handleProfileChange}
                        />
                      </div>

                      <div className="mb-4">
                        <label className="form-label font-size-2 text-gray-600">New password (leave blank to leave unchanged)</label>
                        <input
                          type="password"
                          name="newPassword"
                          className="form-control rounded-0"
                          value={profile.newPassword}
                          onChange={handleProfileChange}
                        />
                      </div>

                      <div className="mb-5">
                        <label className="form-label font-size-2 text-gray-600">Confirm new password</label>
                        <input
                          type="password"
                          name="confirmPassword"
                          className="form-control rounded-0"
                          value={profile.confirmPassword}
                          onChange={handleProfileChange}
                        />
                      </div>
                    </div>

                    <button type="submit" className="btn btn-dark rounded-0 px-5 py-3 font-weight-medium">
                      Save Changes
                    </button>
                  </form>
                </div>
              )}

              {/* PANEL 6: WISHLIST */}
              {activeTab === "wishlist" && (
                <div>
                  <h3 className="font-weight-medium font-size-6 mb-4">Wishlist</h3>
                  {wishlist.length === 0 ? (
                    <div className="text-center py-5 border bg-light">
                      <div className="mb-3 text-gray-400 font-size-8"><i className="fa fa-heart-broken"></i></div>
                      <p className="text-gray-600 mb-0 font-size-2">Your wishlist is currently empty.</p>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table border">
                        <thead>
                          <tr className="bg-light">
                            <th className="py-3 font-weight-medium border-0 pl-3">Product</th>
                            <th className="py-3 font-weight-medium border-0">Price</th>
                            <th className="py-3 font-weight-medium border-0">Stock Status</th>
                            <th className="py-3 font-weight-medium border-0 text-center">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {wishlist.map((item) => (
                            <tr key={item.id} className="border-bottom">
                              <td className="py-4 align-middle pl-3">
                                <div className="d-flex align-items-center">
                                  <Link href="/product">
                                    <img
                                      src={item.image}
                                      alt={item.name}
                                      className="rounded-0"
                                      style={{ width: "50px", height: "75px", objectFit: "cover" }}
                                    />
                                  </Link>
                                  <div className="ml-3">
                                    <Link href="/product" className="font-weight-bold text-dark d-block">
                                      {item.name}
                                    </Link>
                                    <span className="text-gray-500 font-size-1">{item.author}</span>
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 align-middle font-weight-medium">£{item.price.toFixed(2)}</td>
                              <td className="py-4 align-middle font-weight-medium text-success">
                                {item.inStock ? "In Stock" : "Out of Stock"}
                              </td>
                              <td className="py-4 align-middle text-center">
                                <div className="d-flex justify-content-center gap-2">
                                  <button
                                    onClick={() => alert(`Added ${item.name} to Cart!`)}
                                    className="btn btn-dark rounded-0 px-3 py-1 font-size-2 text-uppercase font-weight-bold"
                                  >
                                    Add to cart
                                  </button>
                                  <a
                                    href="#"
                                    onClick={(e) => removeWishlistItem(item.id, e)}
                                    className="btn btn-outline-danger btn-sm rounded-0 d-inline-flex align-items-center justify-content-center"
                                    style={{ width: "32px", height: "32px" }}
                                  >
                                    <i className="fa fa-times"></i>
                                  </a>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>
      </main>
    </MainLayout>
  );
}

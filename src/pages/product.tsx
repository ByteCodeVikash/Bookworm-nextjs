import React, { useState } from "react";
import Link from "next/link";
import { MainLayout } from "@/components";
import { useCart } from "@/contexts/CartContext";

export default function ProductPage() {
  const { addToCart } = useCart();
  const [selectedFormat, setSelectedFormat] = useState<string>("Paperback");
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<"Description" | "ProductDetails" | "ProductVideos" | "ProductReviews">("Description");

  const handleQtyChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  const handleAddToCart = (e: React.FormEvent) => {
    e.preventDefault();
    addToCart({
      id: "where-the-crawdads-sing",
      name: "Where the Crawdads Sing",
      author: "Anna Banks",
      price: 29.95,
      image: "https://placehold.co/300x452",
      quantity
    });
    alert(`Added ${quantity} of "Where the Crawdads Sing" (${selectedFormat}) to your cart.`);
  };

  return (
    <MainLayout>
      <div className="page-header border-bottom">
        <div className="container">
          <div className="d-md-flex justify-content-between align-items-center py-4">
            <h1 className="page-title font-size-3 font-weight-medium m-0 text-lh-lg">Shop Single</h1>
            <nav className="woocommerce-breadcrumb font-size-2">
              <Link href="/" className="h-primary">Home</Link>
              <span className="breadcrumb-separator mx-1"><i className="fas fa-angle-right"></i></span>
              <Link href="/shop" className="h-primary">Shop</Link>
              <span className="breadcrumb-separator mx-1"><i className="fas fa-angle-right"></i></span>Shop Single
            </nav>
          </div>
        </div>
      </div>

      <div id="primary" className="content-area">
        <main id="main" className="site-main">
          <div className="product">
            <div className="container">
              <div className="row">
                
                {/* Product Cover/Gallery Column */}
                <div className="col-md-5 woocommerce-product-gallery woocommerce-product-gallery--with-images images">
                  <figure className="woocommerce-product-gallery__wrapper pt-8 mb-0">
                    <div className="js-slick-carousel u-slick">
                      <div className="js-slide">
                        <img
                          src="https://placehold.co/300x452"
                          alt="Where the Crawdads Sing Cover"
                          className="mx-auto img-fluid"
                        />
                      </div>
                    </div>
                  </figure>
                </div>

                {/* Product Details & Summary Column */}
                <div className="col-md-7 pl-0 summary entry-summary border-left">
                  <div className="space-top-2 px-4 px-xl-7 border-bottom pb-5">
                    <h1 className="product_title entry-title font-size-7 mb-3">Where the Crawdads Sing</h1>
                    
                    <div className="font-size-2 mb-4">
                      <span className="text-yellow-darker">
                        <span className="fas fa-star"></span>
                        <span className="fas fa-star"></span>
                        <span className="fas fa-star"></span>
                        <span className="fas fa-star"></span>
                        <span className="fas fa-star"></span>
                      </span>
                      <span className="ml-3">(3,714)</span>
                      <span className="ml-3 font-weight-medium">By (author)</span>
                      <span className="ml-2 text-gray-600">Anna Banks</span>
                    </div>

                    <p className="price font-size-22 font-weight-medium mb-3">
                      <span className="woocommerce-Price-amount amount">
                        <span className="woocommerce-Price-currencySymbol">$</span>29.95
                      </span> –{" "}
                      <span className="woocommerce-Price-amount amount">
                        <span className="woocommerce-Price-currencySymbol">$</span>59.95
                      </span>
                    </p>

                    <div className="mb-2 font-size-2">
                      <span className="font-weight-medium">Book Format:</span>
                      <span className="ml-2 text-gray-600">{selectedFormat}</span>
                    </div>

                    {/* Radio Checkbox Group */}
                    <div className="row mx-gutters-2 mb-4">
                      <div className="col-6 col-md-3 mb-3 mb-md-0">
                        <div className="position-relative">
                          <input
                            type="radio"
                            id="typeOfListingRadio1"
                            name="bookFormat"
                            className="custom-control-input checkbox-outline__input"
                            checked={selectedFormat === "Hardcover"}
                            onChange={() => setSelectedFormat("Hardcover")}
                          />
                          <label
                            className="border-bottom d-block checkbox-outline__label py-3 px-1 mb-0 cursor-pointer"
                            htmlFor="typeOfListingRadio1"
                          >
                            <span className="d-block">Hardcover</span>
                            <span className="">$9.59</span>
                          </label>
                        </div>
                      </div>

                      <div className="col-6 col-md-3 mb-3 mb-md-0">
                        <div className="position-relative">
                          <input
                            type="radio"
                            id="typeOfListingRadio2"
                            name="bookFormat"
                            className="custom-control-input checkbox-outline__input"
                            checked={selectedFormat === "Paperback"}
                            onChange={() => setSelectedFormat("Paperback")}
                          />
                          <label
                            className="border-bottom d-block checkbox-outline__label py-3 px-1 mb-0 cursor-pointer"
                            htmlFor="typeOfListingRadio2"
                          >
                            <span className="d-block">Paperback</span>
                            <span className="">$9.59</span>
                          </label>
                        </div>
                      </div>

                      <div className="col-6 col-md-3">
                        <div className="position-relative">
                          <input
                            type="radio"
                            id="typeOfListingRadio3"
                            name="bookFormat"
                            className="custom-control-input checkbox-outline__input"
                            checked={selectedFormat === "Kindle"}
                            onChange={() => setSelectedFormat("Kindle")}
                          />
                          <label
                            className="border-bottom d-block checkbox-outline__label py-3 px-1 mb-0 cursor-pointer"
                            htmlFor="typeOfListingRadio3"
                          >
                            <span className="d-block">Kindle</span>
                            <span className="">$9.59</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="woocommerce-product-details__short-description font-size-2 mb-5">
                      <p className="m-0">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Excepteur sint occaecat.
                      </p>
                    </div>

                    {/* Quantity & Add to Cart form */}
                    <form onSubmit={handleAddToCart} className="cart d-md-flex align-items-center">
                      <div className="quantity mb-4 mb-md-0 d-flex align-items-center">
                        <div className="border px-3 width-120">
                          <div className="js-quantity">
                            <div className="d-flex align-items-center justify-content-between py-2">
                              <label className="screen-reader-text sr-only">Quantity</label>
                              <a
                                className="js-minus text-dark font-weight-bold"
                                href="javascript:;"
                                onClick={() => handleQtyChange(-1)}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="10px" height="1px">
                                  <path fillRule="evenodd" fill="rgb(22, 22, 25)" d="M-0.000,-0.000 L10.000,-0.000 L10.000,1.000 L-0.000,1.000 L-0.000,-0.000 Z" />
                                </svg>
                              </a>
                              <span className="font-weight-medium font-size-2 px-2">{quantity}</span>
                              <a
                                className="js-plus text-dark font-weight-bold"
                                href="javascript:;"
                                onClick={() => handleQtyChange(1)}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="10px" height="10px">
                                  <path fillRule="evenodd" fill="rgb(22, 22, 25)" d="M10.000,5.000 L6.000,5.000 L6.000,10.000 L5.000,10.000 L5.000,5.000 L-0.000,5.000 L-0.000,4.000 L5.000,4.000 L5.000,-0.000 L6.000,-0.000 L6.000,4.000 L10.000,4.000 L10.000,5.000 Z" />
                                </svg>
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="btn btn-dark border-0 rounded-0 p-3 min-width-250 ml-md-4 single_add_to_cart_button button alt"
                      >
                        Add to cart
                      </button>
                    </form>
                  </div>

                  {/* Wishlist & Share footer */}
                  <div className="px-4 px-xl-7 py-5 d-flex align-items-center">
                    <ul className="list-unstyled nav">
                      <li className="mr-6 mb-4 mb-md-0">
                        <a href="#" className="h-primary" onClick={(e) => { e.preventDefault(); alert("Added to Wishlist"); }}>
                          <i className="flaticon-heart mr-2"></i> Add to Wishlist
                        </a>
                      </li>
                      <li className="mr-6">
                        <a href="#" className="h-primary" onClick={(e) => { e.preventDefault(); alert("Share this book!"); }}>
                          <i className="flaticon-share mr-2"></i> Share
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>

              </div>
            </div>

            {/* Scroll Nav Tabs */}
            <div className="js-scroll-nav mb-10">
              <div className="woocommerce-tabs wc-tabs-wrapper 2 mx-lg-auto">
                
                {/* Tab Header list */}
                <div className="border-top border-bottom">
                  <ul className="container tabs wc-tabs nav justify-content-md-center flex-nowrap flex-md-wrap overflow-auto overflow-md-visble">
                    <li className={`flex-shrink-0 flex-md-shrink-1 nav-item ${activeTab === "Description" ? "active" : ""}`}>
                      <a
                        className={`nav-link py-4 font-weight-medium ${activeTab === "Description" ? "active" : ""}`}
                        href="#Description"
                        onClick={(e) => { e.preventDefault(); setActiveTab("Description"); }}
                      >
                        Description
                      </a>
                    </li>
                    <li className={`flex-shrink-0 flex-md-shrink-1 nav-item ${activeTab === "ProductDetails" ? "active" : ""}`}>
                      <a
                        className={`nav-link py-4 font-weight-medium ${activeTab === "ProductDetails" ? "active" : ""}`}
                        href="#ProductDetails"
                        onClick={(e) => { e.preventDefault(); setActiveTab("ProductDetails"); }}
                      >
                        Product Details
                      </a>
                    </li>
                    <li className={`flex-shrink-0 flex-md-shrink-1 nav-item ${activeTab === "ProductVideos" ? "active" : ""}`}>
                      <a
                        className={`nav-link py-4 font-weight-medium ${activeTab === "ProductVideos" ? "active" : ""}`}
                        href="#ProductVideos"
                        onClick={(e) => { e.preventDefault(); setActiveTab("ProductVideos"); }}
                      >
                        Videos
                      </a>
                    </li>
                    <li className={`flex-shrink-0 flex-md-shrink-1 nav-item ${activeTab === "ProductReviews" ? "active" : ""}`}>
                      <a
                        className={`nav-link py-4 font-weight-medium ${activeTab === "ProductReviews" ? "active" : ""}`}
                        href="#ProductReviews"
                        onClick={(e) => { e.preventDefault(); setActiveTab("ProductReviews"); }}
                      >
                        Reviews (3,714)
                      </a>
                    </li>
                  </ul>
                </div>

                {/* Tab Panel Content */}
                <div className="tab-content font-size-2 container pt-8">
                  
                  {/* DESCRIPTION TAB */}
                  {activeTab === "Description" && (
                    <div className="row">
                      <div className="col-xl-8 offset-xl-2">
                        <div className="woocommerce-Tabs-panel panel entry-content wc-tab">
                          <p className="mb-0">We aim to show you accurate product information. Manufacturers, suppliers and others provide what you see here, and we have not verified it. See our disclaimer</p>
                          <p className="mb-0">#1 New York Times Bestseller</p>
                          <p className="mb-0">A Reese Witherspoon x Hello Sunshine Book Club Pick</p>
                          <br />
                          <p className="mb-4">&quot;I can&apos;t even express how much I love this book! I didn&apos;t want this story to end!&quot;--Reese Witherspoon</p>
                          <p className="mb-4">&quot;Painfully beautiful.&quot;--The New York Times Book Review</p>
                          <p>&quot;Perfect for fans of Barbara Kingsolver.&quot;--Bustle</p>
                          <br />
                          <p className="mb-4">For years, rumors of the &quot;Marsh Girl&quot; have haunted Barkley Cove, a quiet town on the North Carolina coast. So in late 1969, when handsome Chase Andrews is found dead, the locals immediately suspect Kya Clark, the so-called Marsh Girl. But Kya is not what they say. Sensitive and intelligent, she has survived for years alone in the marsh that she calls home, finding friends in the gulls and lessons in the sand. Then the time comes when she yearns to be touched and loved. When two young men from town become intrigued by her wild beauty, Kya opens herself to a new life--until the unthinkable happens.</p>
                          <p className="mb-4">Perfect for fans of Barbara Kingsolver and Karen Russell, Where the Crawdads Sing is at once an exquisite ode to the natural world, a heartbreaking coming-of-age story, and a surprising tale of possible murder. Owens reminds us that we are forever shaped by the children we once were, and that we are all subject to the beautiful and violent secrets that nature keeps</p>
                          <p>WHERE THE CRAWDADS LP</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* PRODUCT DETAILS TAB */}
                  {activeTab === "ProductDetails" && (
                    <div className="row">
                      <div className="col-xl-8 offset-xl-2">
                        <div className="woocommerce-Tabs-panel panel entry-content wc-tab">
                          <div className="table-responsive mb-4">
                            <table className="table table-hover table-borderless">
                              <tbody>
                                <tr>
                                  <th className="px-4 px-xl-5" style={{ width: "250px" }}>Format:</th>
                                  <td>Paperback | 384 pages</td>
                                </tr>
                                <tr>
                                  <th className="px-4 px-xl-5">Dimensions:</th>
                                  <td>9126 x 194 x 28mm | 301g</td>
                                </tr>
                                <tr>
                                  <th className="px-4 px-xl-5">Publication date:</th>
                                  <td>20 Dec 2020</td>
                                </tr>
                                <tr>
                                  <th className="px-4 px-xl-5">Publisher:</th>
                                  <td>Little, Brown Book Group</td>
                                </tr>
                                <tr>
                                  <th className="px-4 px-xl-5">Imprint:</th>
                                  <td>Corsair</td>
                                </tr>
                                <tr>
                                  <th className="px-4 px-xl-5">Publication City/Country:</th>
                                  <td>London, United Kingdom</td>
                                </tr>
                                <tr>
                                  <th className="px-4 px-xl-5">Language:</th>
                                  <td>English</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* PRODUCT VIDEOS TAB */}
                  {activeTab === "ProductVideos" && (
                    <div className="row">
                      <div className="col-xl-8 offset-xl-2">
                        <div className="woocommerce-Tabs-panel panel entry-content wc-tab">
                          <div className="d-flex mb-8 justify-content-center gap-4">
                            <a
                              href="https://www.youtube.com/watch?v=u-0Z0iVBxUY"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="product__video d-block p-4 border position-relative max-width-234"
                            >
                              <span className="position-absolute-center text-dark font-size-10">
                                <i className="flaticon-multimedia"></i>
                              </span>
                              <div className="hover-area text-center">
                                <img
                                  src="https://placehold.co/120x180"
                                  className="img-fluid d-block mx-auto mb-3"
                                  alt="Video description cover"
                                />
                                <h2 className="woocommerce-loop-product__title product__title h6 text-lh-md mb-1 text-dark">
                                  Where The Crawdads Sing Overview
                                </h2>
                                <div className="font-size-2 text-gray-700">Solomon</div>
                              </div>
                              <span className="text-white bg-dark px-3 py-1 position-absolute bottom-0 right-0">1:45</span>
                            </a>

                            <a
                              href="https://www.youtube.com/watch?v=F7yO1tYCYxQ"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="product__video d-block p-4 border position-relative max-width-234"
                            >
                              <span className="position-absolute-center text-dark font-size-10">
                                <i className="flaticon-multimedia"></i>
                              </span>
                              <div className="hover-area text-center">
                                <img
                                  src="https://placehold.co/120x180"
                                  className="img-fluid d-block mx-auto mb-3"
                                  alt="Video description cover"
                                />
                                <h2 className="woocommerce-loop-product__title product__title h6 text-lh-md mb-1 text-dark">
                                  Where The Crawdads Sing Overview
                                </h2>
                                <div className="font-size-2 text-gray-700">Solomon</div>
                              </div>
                              <span className="text-white bg-dark px-3 py-1 position-absolute bottom-0 right-0">2:21</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* PRODUCT REVIEWS TAB */}
                  {activeTab === "ProductReviews" && (
                    <div className="row">
                      <div className="col-xl-8 offset-xl-2">
                        <div className="woocommerce-Tabs-panel panel entry-content wc-tab">
                          
                          <h4 className="font-size-3 mb-4">Customer Reviews</h4>
                          <div className="row mb-8">
                            <div className="col-md-6 mb-6 mb-md-0">
                              <div className="d-flex align-items-center mb-4">
                                <span className="font-size-15 font-weight-bold">4.6</span>
                                <div className="ml-3 h6 mb-0">
                                  <span className="font-weight-normal">3,714 reviews</span>
                                  <div className="text-yellow-darker">
                                    <small className="fas fa-star"></small>
                                    <small className="fas fa-star"></small>
                                    <small className="fas fa-star"></small>
                                    <small className="fas fa-star"></small>
                                    <small className="far fa-star"></small>
                                  </div>
                                </div>
                              </div>

                              <div className="d-md-flex gap-2">
                                <button type="button" className="btn btn-outline-dark rounded-0 px-5 mb-3 mb-md-0">See all reviews</button>
                                <button type="button" className="btn btn-dark rounded-0 px-5">Write a review</button>
                              </div>
                            </div>

                            <div className="col-md-6">
                              {/* Ratings list */}
                              <ul className="list-unstyled pl-xl-4 m-0">
                                <li className="py-2">
                                  <a className="row align-items-center mx-gutters-2 font-size-2 text-decoration-none" href="javascript:;">
                                    <div className="col-auto"><span className="text-dark">5 stars</span></div>
                                    <div className="col px-0">
                                      <div className="progress bg-white-100" style={{ height: "7px" }}>
                                        <div className="progress-bar bg-yellow-darker" style={{ width: "100%" }}></div>
                                      </div>
                                    </div>
                                    <div className="col-2"><span className="text-secondary">205</span></div>
                                  </a>
                                </li>
                                <li className="py-2">
                                  <a className="row align-items-center mx-gutters-2 font-size-2 text-decoration-none" href="javascript:;">
                                    <div className="col-auto"><span className="text-dark">4 stars</span></div>
                                    <div className="col px-0">
                                      <div className="progress bg-white-100" style={{ height: "7px" }}>
                                        <div className="progress-bar bg-yellow-darker" style={{ width: "53%" }}></div>
                                      </div>
                                    </div>
                                    <div className="col-2"><span className="text-secondary">55</span></div>
                                  </a>
                                </li>
                                <li className="py-2">
                                  <a className="row align-items-center mx-gutters-2 font-size-2 text-decoration-none" href="javascript:;">
                                    <div className="col-auto"><span className="text-dark">3 stars</span></div>
                                    <div className="col px-0">
                                      <div className="progress bg-white-100" style={{ height: "7px" }}>
                                        <div className="progress-bar bg-yellow-darker" style={{ width: "20%" }}></div>
                                      </div>
                                    </div>
                                    <div className="col-2"><span className="text-secondary">23</span></div>
                                  </a>
                                </li>
                                <li className="py-2">
                                  <a className="row align-items-center mx-gutters-2 font-size-2 text-decoration-none" href="javascript:;">
                                    <div className="col-auto"><span className="text-dark">2 stars</span></div>
                                    <div className="col px-0">
                                      <div className="progress bg-white-100" style={{ height: "7px" }}>
                                        <div className="progress-bar bg-yellow-darker" style={{ width: "0%" }}></div>
                                      </div>
                                    </div>
                                    <div className="col-2"><span className="text-secondary">0</span></div>
                                  </a>
                                </li>
                                <li className="py-2">
                                  <a className="row align-items-center mx-gutters-2 font-size-2 text-decoration-none" href="javascript:;">
                                    <div className="col-auto"><span className="text-dark">1 stars</span></div>
                                    <div className="col px-0">
                                      <div className="progress bg-white-100" style={{ height: "7px" }}>
                                        <div className="progress-bar bg-yellow-darker" style={{ width: "1%" }}></div>
                                      </div>
                                    </div>
                                    <div className="col-2"><span className="text-secondary">4</span></div>
                                  </a>
                                </li>
                              </ul>
                            </div>
                          </div>

                          <h4 className="font-size-3 mb-8">1-3 of 3 reviews</h4>
                          
                          {/* Review Lists */}
                          <ul className="list-unstyled mb-8 p-0">
                            <li className="mb-4 pb-5 border-bottom">
                              <div className="d-flex align-items-center mb-3">
                                <h6 className="mb-0">Amazing Story! You will LOVE it</h6>
                                <div className="text-yellow-darker ml-3">
                                  <small className="fas fa-star"></small>
                                  <small className="fas fa-star"></small>
                                  <small className="fas fa-star"></small>
                                  <small className="fas fa-star"></small>
                                  <small className="far fa-star"></small>
                                </div>
                              </div>
                              <p className="mb-4 text-lh-md">Such an incredibly complex story! I had to buy it because there was a waiting list of 30+ at the local library for this book. Thrilled that I made the purchase</p>
                              <div className="text-gray-600 mb-4">Staci, February 22, 2020</div>
                              <ul className="nav gap-3">
                                <li className="mr-7">
                                  <a href="#" className="text-gray-600 d-flex align-items-center text-decoration-none" onClick={(e) => e.preventDefault()}>
                                    <i className="text-dark font-size-5 flaticon-like-1"></i>
                                    <span className="ml-2">90</span>
                                  </a>
                                </li>
                                <li className="mr-7">
                                  <a href="#" className="text-gray-600 d-flex align-items-center text-decoration-none" onClick={(e) => e.preventDefault()}>
                                    <i className="text-dark font-size-5 flaticon-dislike"></i>
                                    <span className="ml-2">10</span>
                                  </a>
                                </li>
                                <li className="mr-7">
                                  <a href="#" className="text-gray-600 d-flex align-items-center text-decoration-none" onClick={(e) => e.preventDefault()}>
                                    <i className="text-dark font-size-5 flaticon-flag"></i>
                                  </a>
                                </li>
                              </ul>
                            </li>

                            <li className="mb-4 pb-5 border-bottom">
                              <div className="d-flex align-items-center mb-3">
                                <h6 className="mb-0">Get the best seller at a great price.</h6>
                                <div className="text-yellow-darker ml-3">
                                  <small className="fas fa-star"></small>
                                  <small className="fas fa-star"></small>
                                  <small className="fas fa-star"></small>
                                  <small className="fas fa-star"></small>
                                  <small className="far fa-star"></small>
                                </div>
                              </div>
                              <p className="mb-4 text-lh-md">Awesome book, great price, fast delivery. Thanks so much.</p>
                              <div className="text-gray-600 mb-4">Staci, February 22, 2020</div>
                              <ul className="nav gap-3">
                                <li className="mr-7">
                                  <a href="#" className="text-gray-600 d-flex align-items-center text-decoration-none" onClick={(e) => e.preventDefault()}>
                                    <i className="text-dark font-size-5 flaticon-like-1"></i>
                                    <span className="ml-2">90</span>
                                  </a>
                                </li>
                                <li className="mr-7">
                                  <a href="#" className="text-gray-600 d-flex align-items-center text-decoration-none" onClick={(e) => e.preventDefault()}>
                                    <i className="text-dark font-size-5 flaticon-dislike"></i>
                                    <span className="ml-2">10</span>
                                  </a>
                                </li>
                                <li className="mr-7">
                                  <a href="#" className="text-gray-600 d-flex align-items-center text-decoration-none" onClick={(e) => e.preventDefault()}>
                                    <i className="text-dark font-size-5 flaticon-flag"></i>
                                  </a>
                                </li>
                              </ul>
                            </li>

                            <li className="mb-4 pb-5 border-bottom">
                              <div className="d-flex align-items-center mb-3">
                                <h6 className="mb-0">I read this book short...</h6>
                                <div className="text-yellow-darker ml-3">
                                  <small className="fas fa-star"></small>
                                  <small className="fas fa-star"></small>
                                  <small className="fas fa-star"></small>
                                  <small className="fas fa-star"></small>
                                  <small className="far fa-star"></small>
                                </div>
                              </div>
                              <p className="mb-4 text-lh-md">I read this book shortly after I got it and didn&apos;t just put it on my TBR shelf mainly because I saw it on Reese Witherspoon&apos;s bookclub September read. It was one of the best books I&apos;ve read this year, and reminded me some of Kristen Hannah&apos;s The Great Alone.</p>
                              <div className="text-gray-600 mb-4">Staci, February 22, 2020</div>
                              <ul className="nav gap-3">
                                <li className="mr-7">
                                  <a href="#" className="text-gray-600 d-flex align-items-center text-decoration-none" onClick={(e) => e.preventDefault()}>
                                    <i className="text-dark font-size-5 flaticon-like-1"></i>
                                    <span className="ml-2">90</span>
                                  </a>
                                </li>
                                <li className="mr-7">
                                  <a href="#" className="text-gray-600 d-flex align-items-center text-decoration-none" onClick={(e) => e.preventDefault()}>
                                    <i className="text-dark font-size-5 flaticon-dislike"></i>
                                    <span className="ml-2">10</span>
                                  </a>
                                </li>
                                <li className="mr-7">
                                  <a href="#" className="text-gray-600 d-flex align-items-center text-decoration-none" onClick={(e) => e.preventDefault()}>
                                    <i className="text-dark font-size-5 flaticon-flag"></i>
                                  </a>
                                </li>
                              </ul>
                            </li>
                          </ul>

                          {/* Write a review form */}
                          <h4 className="font-size-3 mb-4">Write a Review</h4>
                          <form onSubmit={(e) => { e.preventDefault(); alert("Review submitted for approval!"); }}>
                            <div className="d-flex align-items-center mb-6">
                              <h6 className="mb-0">Select a rating (required)</h6>
                              <div className="text-yellow-darker ml-3 font-size-4 cursor-pointer">
                                <small className="fas fa-star"></small>
                                <small className="fas fa-star"></small>
                                <small className="fas fa-star"></small>
                                <small className="fas fa-star"></small>
                                <small className="far fa-star"></small>
                              </div>
                            </div>
                            
                            <div className="js-form-message form-group mb-4">
                              <label htmlFor="descriptionTextarea" className="form-label text-dark h6 mb-3">
                                Details please! Your review helps other shoppers.
                              </label>
                              <textarea
                                className="form-control rounded-0 p-4"
                                rows={7}
                                id="descriptionTextarea"
                                placeholder="What did you like or dislike? What should other shoppers know before buying?"
                                required
                              />
                            </div>

                            <div className="form-group mb-5">
                              <label htmlFor="inputCompanyName" className="form-label text-dark h6 mb-3">Add a title</label>
                              <input
                                type="text"
                                className="form-control rounded-0 px-4"
                                name="reviewTitle"
                                id="inputCompanyName"
                                placeholder="3000 characters remaining"
                                required
                              />
                            </div>

                            <div className="d-flex">
                              <button type="submit" className="btn btn-dark btn-wide rounded-0 transition-3d-hover">
                                Submit Review
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  )}

                </div>

              </div>
            </div>

            {/* Related Products / Customers Also Considered Section */}
            <section className="space-bottom-3 border-top pt-8">
              <div className="container">
                <header className="mb-5 d-md-flex justify-content-between align-items-center">
                  <h2 className="font-size-7 mb-3 mb-md-0">Customers Also Considered</h2>
                </header>

                <div className="row row-cols-2 row-cols-md-3 row-cols-lg-5 gap-0 products border-top border-left border-right">
                  
                  {/* Item 1 */}
                  <div className="product col border-bottom border-right p-3 p-md-4d875">
                    <div className="woocommerce-LoopProduct-link woocommerce-loop-product__link d-block position-relative">
                      <div className="woocommerce-loop-product__thumbnail">
                        <Link href="/product" className="d-block">
                          <img src="https://placehold.co/120x180" className="img-fluid d-block mx-auto" alt="Think Like a Monk" />
                        </Link>
                      </div>
                      <div className="woocommerce-loop-product__body product__body pt-3 bg-white">
                        <div className="text-uppercase font-size-1 mb-1 text-truncate">
                          <Link href="/product">Paperback</Link>
                        </div>
                        <h2 className="woocommerce-loop-product__title product__title h6 text-lh-md mb-1 text-height-2 crop-text-2 h-dark">
                          <Link href="/product">Think Like a Monk: Train Your Mind for Peace and Purpose Everyday</Link>
                        </h2>
                        <div className="font-size-2 mb-1 text-truncate">
                          <a href="#" className="text-gray-700">Jay Shetty</a>
                        </div>
                        <div className="price d-flex align-items-center font-weight-medium font-size-3">
                          <span className="woocommerce-Price-amount amount">
                            <span className="woocommerce-Price-currencySymbol">$</span>29
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Item 2 */}
                  <div className="product col border-bottom border-right p-3 p-md-4d875">
                    <div className="woocommerce-LoopProduct-link woocommerce-loop-product__link d-block position-relative">
                      <div className="woocommerce-loop-product__thumbnail">
                        <Link href="/product" className="d-block">
                          <img src="https://placehold.co/120x180" className="img-fluid d-block mx-auto" alt="All You Can Ever Know" />
                        </Link>
                      </div>
                      <div className="woocommerce-loop-product__body product__body pt-3 bg-white">
                        <div className="text-uppercase font-size-1 mb-1 text-truncate">
                          <Link href="/product">Paperback</Link>
                        </div>
                        <h2 className="woocommerce-loop-product__title product__title h6 text-lh-md mb-1 text-height-2 crop-text-2 h-dark">
                          <Link href="/product">All You Can Ever Know: A Memoir</Link>
                        </h2>
                        <div className="font-size-2 mb-1 text-truncate">
                          <a href="#" className="text-gray-700">Nicole Chung</a>
                        </div>
                        <div className="price d-flex align-items-center font-weight-medium font-size-3">
                          <span className="woocommerce-Price-amount amount">
                            <span className="woocommerce-Price-currencySymbol">$</span>49
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Item 3 */}
                  <div className="product col border-bottom border-right p-3 p-md-4d875">
                    <div className="woocommerce-LoopProduct-link woocommerce-loop-product__link d-block position-relative">
                      <div className="woocommerce-loop-product__thumbnail">
                        <Link href="/product" className="d-block">
                          <img src="https://placehold.co/120x180" className="img-fluid d-block mx-auto" alt="Winter Garden" />
                        </Link>
                      </div>
                      <div className="woocommerce-loop-product__body product__body pt-3 bg-white">
                        <div className="text-uppercase font-size-1 mb-1 text-truncate">
                          <Link href="/product">Hardcover</Link>
                        </div>
                        <h2 className="woocommerce-loop-product__title product__title h6 text-lh-md mb-1 text-height-2 crop-text-2 h-dark">
                          <Link href="/product">Winter Garden</Link>
                        </h2>
                        <div className="font-size-2 mb-1 text-truncate">
                          <a href="#" className="text-gray-700">Kristin Hannah</a>
                        </div>
                        <div className="price d-flex align-items-center font-weight-medium font-size-3">
                          <span className="woocommerce-Price-amount amount">
                            <span className="woocommerce-Price-currencySymbol">$</span>59
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Item 4 */}
                  <div className="product col border-bottom border-right p-3 p-md-4d875">
                    <div className="woocommerce-LoopProduct-link woocommerce-loop-product__link d-block position-relative">
                      <div className="woocommerce-loop-product__thumbnail">
                        <Link href="/product" className="d-block">
                          <img src="https://placehold.co/120x180" className="img-fluid d-block mx-auto" alt="The Overdue Life of Amy Byler" />
                        </Link>
                      </div>
                      <div className="woocommerce-loop-product__body product__body pt-3 bg-white">
                        <div className="text-uppercase font-size-1 mb-1 text-truncate">
                          <Link href="/product">Paperback</Link>
                        </div>
                        <h2 className="woocommerce-loop-product__title product__title h6 text-lh-md mb-1 text-height-2 crop-text-2 h-dark">
                          <Link href="/product">The Overdue Life of Amy Byler</Link>
                        </h2>
                        <div className="font-size-2 mb-1 text-truncate">
                          <a href="#" className="text-gray-700">Kelly Harms</a>
                        </div>
                        <div className="price d-flex align-items-center font-weight-medium font-size-3">
                          <span className="woocommerce-Price-amount amount">
                            <span className="woocommerce-Price-currencySymbol">$</span>79
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Item 5 */}
                  <div className="product col border-bottom border-right p-3 p-md-4d875">
                    <div className="woocommerce-LoopProduct-link woocommerce-loop-product__link d-block position-relative">
                      <div className="woocommerce-loop-product__thumbnail">
                        <Link href="/product" className="d-block">
                          <img src="https://placehold.co/120x180" className="img-fluid d-block mx-auto" alt="Think Like a Monk" />
                        </Link>
                      </div>
                      <div className="woocommerce-loop-product__body product__body pt-3 bg-white">
                        <div className="text-uppercase font-size-1 mb-1 text-truncate">
                          <Link href="/product">Paperback</Link>
                        </div>
                        <h2 className="woocommerce-loop-product__title product__title h6 text-lh-md mb-1 text-height-2 crop-text-2 h-dark">
                          <Link href="/product">Think Like a Monk</Link>
                        </h2>
                        <div className="font-size-2 mb-1 text-truncate">
                          <a href="#" className="text-gray-700">Jay Shetty</a>
                        </div>
                        <div className="price d-flex align-items-center font-weight-medium font-size-3">
                          <span className="woocommerce-Price-amount amount">
                            <span className="woocommerce-Price-currencySymbol">$</span>29
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </section>

          </div>
        </main>
      </div>
    </MainLayout>
  );
}

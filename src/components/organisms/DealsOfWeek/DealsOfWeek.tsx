"use client";

import React, { useState } from "react";
import { DealsOfWeekProps } from "./types";

export const DealsOfWeek: React.FC<DealsOfWeekProps> = ({ books }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const numSlides = Math.ceil(books.length / 2);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + numSlides) % numSlides);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % numSlides);
  };

  const startIndex = currentSlide * 2;
  const activeBooks = books.slice(startIndex, startIndex + 2);

  return (
    <section className="space-bottom-3">
      <div className="space-top-3 space-bottom-4" style={{ backgroundColor: "#fff5f4" }}>
        <div className="container">
          <header className="mb-4 d-flex justify-content-between align-items-baseline">
            <h2 className="font-size-7 mb-0 font-weight-bold" style={{ color: "#161619" }}>
              Deals of the Week
            </h2>
            <a
              href="#"
              className="d-flex align-items-center text-dark font-size-2 font-weight-medium text-decoration-none"
            >
              <span className="mr-2">View All</span>
              <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 9L5 5L1 1" stroke="#161619" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </header>

          <div className="position-relative">
            <div className="row row-cols-1 row-cols-md-2 bg-white border no-gutters">
              {activeBooks.map((book, idx) => (
                <div
                  key={book.id}
                  className={`col product product__card ${idx === 0 ? "deals-card-0" : ""}`}
                  style={{ listStyleType: "none" }}
                >
                  <div className="media p-4 p-md-5 d-block d-md-flex align-items-center">
                    <div
                      className="woocommerce-loop-product__thumbnail mb-4 mb-md-0 text-center mx-auto mx-md-0"
                      style={{ width: "150px", flexShrink: 0 }}
                    >
                      <a href="#" className="d-block">
                        <img
                          src={book.imageUrl}
                          className="attachment-shop_catalog size-shop_catalog wp-post-image img-fluid"
                          alt={book.title}
                          width="150"
                          height="225"
                          style={{ objectFit: "contain", maxHeight: "225px" }}
                        />
                      </a>
                    </div>
                    <div className="woocommerce-loop-product__body media-body ml-md-5">
                      <div className="mb-0">
                        <div
                          className="text-uppercase font-size-1 font-weight-medium mb-1"
                          style={{ color: "#f75454", letterSpacing: "1px" }}
                        >
                          {book.format}
                        </div>
                        <h2 className="woocommerce-loop-product__title font-size-3 font-weight-bold text-lh-md mb-2 text-height-2 h-dark">
                          <a href="#" className="font-weight-bold text-dark">
                            {book.title}
                          </a>
                        </h2>
                        <div className="font-size-2 text-gray-700 mb-3 text-truncate">
                          <a href="#" className="text-gray-700">
                            {book.author}
                          </a>
                        </div>
                        <div className="price d-flex align-items-center font-weight-medium font-size-3">
                          <ins className="text-decoration-none mr-2">
                            <span className="woocommerce-Price-amount amount text-dark font-weight-bold">
                              <span className="woocommerce-Price-currencySymbol">$</span>
                              {book.price.toFixed(2)}
                            </span>
                          </ins>
                          {book.originalPrice && (
                            <del className="font-size-1 font-weight-regular text-gray-500">
                              <span className="woocommerce-Price-amount amount">
                                <span className="woocommerce-Price-currencySymbol">$</span>
                                {book.originalPrice.toFixed(2)}
                              </span>
                            </del>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Left navigation arrow */}
            <button
              onClick={handlePrev}
              className="position-absolute bg-white border d-flex align-items-center justify-content-center"
              style={{
                left: "-12px",
                top: "50%",
                transform: "translateY(-50%)",
                width: "24px",
                height: "44px",
                zIndex: 10,
                cursor: "pointer",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                borderColor: "#eaeaea",
                outline: "none"
              }}
              aria-label="Previous slide"
            >
              <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 9L1 5L5 1" stroke="#161619" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {/* Right navigation arrow */}
            <button
              onClick={handleNext}
              className="position-absolute bg-white border d-flex align-items-center justify-content-center"
              style={{
                right: "-12px",
                top: "50%",
                transform: "translateY(-50%)",
                width: "24px",
                height: "44px",
                zIndex: 10,
                cursor: "pointer",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                borderColor: "#eaeaea",
                outline: "none"
              }}
              aria-label="Next slide"
            >
              <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 9L5 5L1 1" stroke="#161619" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          {/* Pagination Dot Indicators */}
          <div className="d-flex justify-content-center align-items-center mt-5">
            {Array.from({ length: numSlides }).map((_, idx) => {
              const isActive = idx === currentSlide;
              return (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className="d-flex align-items-center justify-content-center border-0 p-0 pointer bg-transparent"
                  style={{
                    width: "20px",
                    height: "20px",
                    cursor: "pointer",
                    outline: "none"
                  }}
                  aria-label={`Go to slide ${idx + 1}`}
                >
                  <div
                    className="d-flex align-items-center justify-content-center"
                    style={{
                      width: "16px",
                      height: "16px",
                      border: isActive ? "1.5px solid #161619" : "1.5px solid transparent",
                      borderRadius: "50%",
                      transition: "all 0.2s ease"
                    }}
                  >
                    <div
                      style={{
                        width: "6px",
                        height: "6px",
                        backgroundColor: isActive ? "#161619" : "#d5d5d5",
                        borderRadius: "50%",
                        transition: "all 0.2s ease"
                      }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DealsOfWeek;

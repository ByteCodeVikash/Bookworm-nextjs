"use client";

import React, { useState, useEffect } from "react";
import { DealsOfWeekProps } from "./types";
import { Badge, Icon } from "../../atoms";

export const DealsOfWeek: React.FC<DealsOfWeekProps> = ({ books }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 114,
    hours: 3,
    minutes: 59,
    seconds: 59
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="space-bottom-3">
      <div className="space-top-3 space-bottom-4 bg-gray-200">
        <div className="container">
          <header className="mb-5 d-md-flex justify-content-between align-items-center">
            <h2 className="font-size-7 mb-3 mb-md-0">Deals of the Week</h2>
            <a href="#" className="h-primary d-block">
              View All <Icon name="glyph-icon flaticon-next" />
            </a>
          </header>
          <div className="row row-cols-1 row-cols-lg-2 bg-white border no-gutters">
            {books.slice(0, 2).map((book, idx) => (
              <div key={book.id} className="col product product__card border-right" style={{ listStyleType: "none" }}>
                <div className="media p-4 p-md-6 d-block d-md-flex">
                  <div className="woocommerce-loop-product__thumbnail mb-4 mb-md-0 text-center">
                    <a href="#" className="d-block">
                      <img
                        src={book.imageUrl}
                        className="attachment-shop_catalog size-shop_catalog wp-post-image img-fluid"
                        alt={book.title}
                        width="200"
                        height="327"
                      />
                    </a>
                  </div>
                  <div className="woocommerce-loop-product__body media-body ml-md-5d25">
                    <div className="mb-3">
                      <Badge text={book.format} />
                      <h2 className="woocommerce-loop-product__title font-size-3 text-lh-md mb-2 text-height-2 crop-text-2 h-dark">
                        <a href="#">{book.title}</a>
                      </h2>
                      <div className="font-size-2 text-gray-700 mb-1 text-truncate">
                        <a href="#" className="text-gray-700">{book.author}</a>
                      </div>
                      <div className="price d-flex align-items-center font-weight-medium font-size-3">
                        <ins className="text-decoration-none mr-2">
                          <span className="woocommerce-Price-amount amount">
                            <span className="woocommerce-Price-currencySymbol">$</span>
                            {book.price}
                          </span>
                        </ins>
                        {book.originalPrice && (
                          <del className="font-size-1 font-weight-regular text-gray-700">
                            <span className="woocommerce-Price-amount amount">
                              <span className="woocommerce-Price-currencySymbol">$</span>
                              {book.originalPrice}
                            </span>
                          </del>
                        )}
                      </div>
                    </div>
                    {/* Countdown Timer */}
                    <div className="countdown-timer mb-5">
                      <h5 className="countdown-timer__title font-size-3 mb-3 font-weight-bold">
                        Hurry Up! <span className="font-weight-regular">Offer ends in:</span>
                      </h5>
                      <div className="d-flex align-items-stretch justify-content-between">
                        <div className="py-2d75">
                          <span className="font-weight-medium font-size-3">{timeLeft.days}</span>
                          <span className="font-size-2 ml-md-2 ml-xl-0 ml-wd-2 d-xl-block d-wd-inline"> Days</span>
                        </div>
                        <div className="border-left pr-3 pr-md-0">&nbsp;</div>
                        <div className="py-2d75">
                          <span className="font-weight-medium font-size-3">
                            {String(timeLeft.hours).padStart(2, "0")}
                          </span>
                          <span className="font-size-2 ml-md-2 ml-xl-0 ml-wd-2 d-xl-block d-wd-inline"> Hours</span>
                        </div>
                        <div className="border-left pr-3 pr-md-0">&nbsp;</div>
                        <div className="py-2d75">
                          <span className="font-weight-medium font-size-3">
                            {String(timeLeft.minutes).padStart(2, "0")}
                          </span>
                          <span className="font-size-2 ml-md-2 ml-xl-0 ml-wd-2 d-xl-block d-wd-inline"> Mins</span>
                        </div>
                        <div className="border-left pr-3 pr-md-0">&nbsp;</div>
                        <div className="py-2d75">
                          <span className="font-weight-medium font-size-3">
                            {String(timeLeft.seconds).padStart(2, "0")}
                          </span>
                          <span className="font-size-2 ml-md-2 ml-xl-0 ml-wd-2 d-xl-block d-wd-inline"> Secs</span>
                        </div>
                      </div>
                    </div>
                    {/* Deal Progress Inventory */}
                    <div className="deal-progress">
                      <div className="d-flex justify-content-between font-size-2 mb-2d75">
                        <span>Already Sold: {10 + idx * 4}</span>
                        <span>Available: {7 - idx * 2}</span>
                      </div>
                      <div className="progress">
                        <div
                          className="progress-bar bg-primary"
                          role="progressbar"
                          style={{ width: `${idx === 0 ? 82 : 64}%` }}
                          aria-valuenow={14}
                          aria-valuemin={0}
                          aria-valuemax={17}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
export default DealsOfWeek;

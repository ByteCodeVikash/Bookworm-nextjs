"use client";

import React, { useState, useEffect } from "react";
import { HeroSliderProps } from "./types";

export const HeroSlider: React.FC<HeroSliderProps> = ({ slides }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="space-bottom-3">
      <div
        className="bg-gray-200 space-2 space-lg-0 bg-img-hero transition-all"
        style={{
          backgroundImage: "url(/assets/img/1920x588/img1.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container position-relative">
          <div className="overflow-hidden">
            {slides.map((slide, index) => {
              if (index !== currentSlide) return null;
              return (
                <div key={slide.id} className="js-slide animated fadeIn">
                  <div className="hero row min-height-588 align-items-center">
                    <div className="col-lg-7 col-wd-6 mb-4 mb-lg-0">
                      <div className="media-body mr-wd-4 align-self-center mb-4 mb-md-0">
                        <p className="hero__pretitle text-uppercase font-weight-bold text-gray-400 mb-2">
                          {slide.titlePrefix}
                        </p>
                        <h2 className="hero__title font-size-14 mb-4">
                          <span className="hero__title-line-1 font-weight-regular d-block">
                            {slide.titleSuffix}
                          </span>
                          <span className="hero__title-line-2 font-weight-bold d-block">
                            {slide.titleHighlighted}
                          </span>
                        </h2>
                        <a
                          href={slide.actionUrl}
                          className="btn btn-dark btn-wide rounded-0 hero__btn py-3 px-5 font-weight-medium"
                        >
                          See More
                        </a>
                      </div>
                    </div>
                    <div className="col-lg-5 col-wd-6 text-center">
                      <img
                        className="img-fluid mx-auto"
                        src={slide.imageUrl}
                        alt={slide.titleHighlighted}
                        width="800"
                        height="420"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Slider Pagination Dot Indicators */}
          <div className="text-center position-absolute right-0 left-0 mb-n8 mb-lg-4 bottom-0 z-index-2">
            <ul className="list-inline mb-0">
              {slides.map((_, index) => (
                <li key={index} className="list-inline-item mx-1" style={{ listStyleType: "none" }}>
                  <button
                    onClick={() => setCurrentSlide(index)}
                    className="border-0 p-0 rounded-circle"
                    style={{
                      width: "12px",
                      height: "12px",
                      backgroundColor: index === currentSlide ? "#19110b" : "#b3b3b3",
                      cursor: "pointer",
                      transition: "background-color 0.3s"
                    }}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
export default HeroSlider;

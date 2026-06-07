import React, { useState, useEffect } from "react";
import { ProductSectionProps } from "./types";
import { ProductCard } from "@/components/molecules";
import { Icon } from "@/components/atoms";
import { fetchApi } from "@/utils/api";
import { Book } from "@/types";

export const ProductSection: React.FC<ProductSectionProps> = ({
  title,
  books,
  layout = "grid",
  viewAllLink = "#",
  className = ""
}) => {
  const [localBooks, setLocalBooks] = useState<Book[]>(books || []);
  const [visibleSlides, setVisibleSlides] = useState(5);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    let active = true;
    const loadData = async () => {
      try {
        let endpoint = "";
        const lowerTitle = title.toLowerCase();
        if (lowerTitle.includes("biography") || lowerTitle.includes("biographies")) {
          endpoint = "/api/books.php?group=biographies";
        } else {
          endpoint = "/api/books.php?group=bestsellers";
        }
        const data = await fetchApi<Book[]>(endpoint);
        if (active) {
          setLocalBooks(data);
        }
      } catch (err) {
        console.error("Failed to load product section books:", err);
      }
    };
    loadData();
    return () => { active = false; };
  }, [title]);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 1200) {
        setVisibleSlides(5);
      } else if (width >= 992) {
        setVisibleSlides(4);
      } else if (width >= 768) {
        setVisibleSlides(3);
      } else {
        setVisibleSlides(2);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Safe clamping of index when visibleSlides changes
  useEffect(() => {
    const maxIndex = Math.max(0, localBooks.length - visibleSlides);
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  }, [visibleSlides, localBooks.length, currentIndex]);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    const maxIndex = Math.max(0, localBooks.length - visibleSlides);
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  const maxIndex = Math.max(0, localBooks.length - visibleSlides);
  const showArrows = localBooks.length > visibleSlides;

  return (
    <section className={`space-bottom-3 ${className}`}>
      <div className="container">
        <header className="mb-5 d-md-flex justify-content-between align-items-center">
          <h2 className="font-size-7 mb-3 mb-md-0 font-weight-medium text-dark">{title}</h2>
          <a href={viewAllLink} className="h-primary d-flex align-items-center font-size-2 font-weight-medium text-gray-700 hover-coral text-decoration-none">
            View All <i className="fas fa-chevron-right ml-2 font-size-1"></i>
          </a>
        </header>

        {layout === "card" ? (
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 bg-white border no-gutters" style={{ borderRadius: "4px" }}>
            {localBooks.map((book) => (
              <div key={book.id} className="col border-right border-bottom">
                <ProductCard book={book} layout="card" showBorder={false} />
              </div>
            ))}
          </div>
        ) : (
          <div className="position-relative bestselling-carousel-container">
            {/* Left Navigation Arrow */}
            {showArrows && (
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className={`carousel-nav-btn prev-btn ${currentIndex === 0 ? "disabled" : ""}`}
                aria-label="Previous books"
              >
                <i className="fas fa-chevron-left"></i>
              </button>
            )}

            {/* Viewport */}
            <div className="carousel-viewport border bg-white overflow-hidden" style={{ borderRadius: "4px" }}>
              <div
                className="d-flex carousel-track"
                style={{
                  transform: `translateX(-${(currentIndex * 100) / visibleSlides}%)`,
                  transition: "transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)",
                }}
              >
                {localBooks.map((book, index) => (
                  <div
                    key={book.id}
                    className="bestselling-carousel-item flex-shrink-0"
                    style={{
                      flex: `0 0 ${100 / visibleSlides}%`,
                      maxWidth: `${100 / visibleSlides}%`,
                      borderRight: index === localBooks.length - 1 ? "none" : "1px solid #eaeaea",
                    }}
                  >
                    <ProductCard book={book} layout="grid" showBorder={false} />
                  </div>
                ))}
              </div>
            </div>

            {/* Right Navigation Arrow */}
            {showArrows && (
              <button
                onClick={handleNext}
                disabled={currentIndex === maxIndex}
                className={`carousel-nav-btn next-btn ${currentIndex === maxIndex ? "disabled" : ""}`}
                aria-label="Next books"
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductSection;

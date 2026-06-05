"use client";

import React, { useState } from "react";
import { FeaturedBooksTabProps } from "./types";
import { ProductCard } from "@/components/molecules";

export const FeaturedBooksTab: React.FC<FeaturedBooksTabProps> = ({
  featured,
  onsale,
  mostviewed
}) => {
  const [activeTab, setActiveTab] = useState<"featured" | "onsale" | "mostviewed">("featured");

  const booksToRender = activeTab === "featured" ? featured : activeTab === "onsale" ? onsale : mostviewed;

  return (
    <section className="space-bottom-3">
      <header className="mb-4 container">
        <h2 className="font-size-7 text-center font-weight-bold text-dark">Featured Books</h2>
      </header>
      <div className="container-fluid px-3 px-md-5">
        
        {/* Navigation Tabs Centered */}
        <ul className="nav justify-content-center mb-6 flex-nowrap flex-md-wrap overflow-auto overflow-md-visible" role="tablist" style={{ borderBottom: "1px solid #eaeaea" }}>
          <li className="nav-item mx-4 mb-0 flex-shrink-0 flex-md-shrink-1" style={{ listStyleType: "none" }}>
            <button
              onClick={() => setActiveTab("featured")}
              className={`nav-link px-0 btn btn-link font-size-2 ${activeTab === "featured" ? "font-weight-bold text-dark" : "text-gray-500"}`}
              style={{
                background: "none",
                boxShadow: "none",
                outline: "none",
                textDecoration: "none",
                borderBottom: activeTab === "featured" ? "3px solid #161619" : "3px solid transparent",
                paddingBottom: "12px",
                borderRadius: 0,
                marginBottom: "-1px"
              }}
            >
              Featured
            </button>
          </li>
          <li className="nav-item mx-4 mb-0 flex-shrink-0 flex-md-shrink-1" style={{ listStyleType: "none" }}>
            <button
              onClick={() => setActiveTab("onsale")}
              className={`nav-link px-0 btn btn-link font-size-2 ${activeTab === "onsale" ? "font-weight-bold text-dark" : "text-gray-500"}`}
              style={{
                background: "none",
                boxShadow: "none",
                outline: "none",
                textDecoration: "none",
                borderBottom: activeTab === "onsale" ? "3px solid #161619" : "3px solid transparent",
                paddingBottom: "12px",
                borderRadius: 0,
                marginBottom: "-1px"
              }}
            >
              On Sale
            </button>
          </li>
          <li className="nav-item mx-4 mb-0 flex-shrink-0 flex-md-shrink-1" style={{ listStyleType: "none" }}>
            <button
              onClick={() => setActiveTab("mostviewed")}
              className={`nav-link px-0 btn btn-link font-size-2 ${activeTab === "mostviewed" ? "font-weight-bold text-dark" : "text-gray-500"}`}
              style={{
                background: "none",
                boxShadow: "none",
                outline: "none",
                textDecoration: "none",
                borderBottom: activeTab === "mostviewed" ? "3px solid #161619" : "3px solid transparent",
                paddingBottom: "12px",
                borderRadius: 0,
                marginBottom: "-1px"
              }}
            >
              Most Viewed
            </button>
          </li>
        </ul>

        {/* Dynamic Grid Tab Content with Single Borders */}
        <div className="tab-content">
          <div className="tab-pane fade show active" role="tabpanel">
            <ul 
              className="products list-unstyled row no-gutters row-cols-2 row-cols-md-3 row-cols-lg-4 row-cols-wd-6 border-top border-left my-0"
              style={{ borderColor: "#eaeaea" }}
            >
              {booksToRender.map((book) => (
                <li 
                  key={book.id} 
                  className="product col border-bottom border-right" 
                  style={{ listStyleType: "none", borderColor: "#eaeaea" }}
                >
                  <ProductCard book={book} layout="grid" showBorder={false} />
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>
    </section>
  );
};

export default FeaturedBooksTab;

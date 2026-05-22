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
        <h2 className="font-size-7 text-center">Featured Books</h2>
      </header>
      <div className="container">
        <ul className="nav justify-content-md-center nav-gray-700 mb-5 flex-nowrap flex-md-wrap overflow-auto overflow-md-visible" role="tablist">
          <li className="nav-item mx-5 mb-1 flex-shrink-0 flex-md-shrink-1" style={{ listStyleType: "none" }}>
            <button
              onClick={() => setActiveTab("featured")}
              className={`nav-link px-0 btn btn-link font-weight-medium ${activeTab === "featured" ? "active border-bottom border-primary border-width-2" : ""}`}
              style={{ background: "none", boxShadow: "none", color: "inherit", textDecoration: "none" }}
            >
              Featured
            </button>
          </li>
          <li className="nav-item mx-5 mb-1 flex-shrink-0 flex-md-shrink-1" style={{ listStyleType: "none" }}>
            <button
              onClick={() => setActiveTab("onsale")}
              className={`nav-link px-0 btn btn-link font-weight-medium ${activeTab === "onsale" ? "active border-bottom border-primary border-width-2" : ""}`}
              style={{ background: "none", boxShadow: "none", color: "inherit", textDecoration: "none" }}
            >
              On Sale
            </button>
          </li>
          <li className="nav-item mx-5 mb-1 flex-shrink-0 flex-md-shrink-1" style={{ listStyleType: "none" }}>
            <button
              onClick={() => setActiveTab("mostviewed")}
              className={`nav-link px-0 btn btn-link font-weight-medium ${activeTab === "mostviewed" ? "active border-bottom border-primary border-width-2" : ""}`}
              style={{ background: "none", boxShadow: "none", color: "inherit", textDecoration: "none" }}
            >
              Most Viewed
            </button>
          </li>
        </ul>
        <div className="tab-content">
          <div className="tab-pane fade show active" role="tabpanel">
            <ul className="products list-unstyled row no-gutters row-cols-2 row-cols-md-3 row-cols-lg-4 row-cols-wd-6 border-top border-left my-0">
              {booksToRender.map((book) => (
                <li key={book.id} className="product col" style={{ listStyleType: "none" }}>
                  <ProductCard book={book} layout="grid" />
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

import React from "react";
import {
  HeroSlider,
  ProductSection,
  DealsOfWeek,
  CategorySection,
  FavoriteAuthors
} from "@/components";
import {
  promoSlides,
  bestsellingBooks,
  dealsOfWeekBooks,
  featuredCategories,
  favoriteAuthors
} from "@/data/mockData";

export const HomepageV2: React.FC = () => {
  return (
    <div className="homepage-v2 py-4">
      {/* 1. Hero Promo Slides Carousel */}
      <div className="mb-5">
        <HeroSlider slides={promoSlides} />
      </div>

      {/* 2. Bestselling Books Slider Grid */}
      <div className="mb-6 container">
        <ProductSection title="Featured Hot Releases" books={bestsellingBooks} layout="grid" />
      </div>

      {/* 3. Countdown Special Weekly Deals Block */}
      <div className="mb-6 bg-light py-5">
        <div className="container">
          <DealsOfWeek books={dealsOfWeekBooks} />
        </div>
      </div>

      {/* 4. Highlighted Categories Grid */}
      <div className="mb-6 container">
        <CategorySection categories={featuredCategories} />
      </div>

      {/* 5. Favorite Authors Circular Profiles Loop */}
      <div className="mb-5 container">
        <FavoriteAuthors authors={favoriteAuthors} />
      </div>
    </div>
  );
};

export default HomepageV2;

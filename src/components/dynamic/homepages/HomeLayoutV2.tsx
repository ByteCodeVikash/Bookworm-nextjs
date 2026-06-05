import React from "react";
import {
  HeroSlider,
  DealsOfWeek,
  NewReleases,
  ProductSection,
  FavoriteAuthors
} from "@/components";
import {
  promoSlides,
  dealsOfWeekBooks,
  newReleasesBooks,
  bestsellingBooks,
  favoriteAuthors
} from "@/data/mockData";

export const HomeLayoutV2: React.FC = () => {
  return (
    <div className="home-layout-v2 py-4">
      {/* 1. Hero Promo Slides Carousel */}
      <div className="mb-5">
        <HeroSlider slides={promoSlides} />
      </div>

      {/* 2. Highlight DealsOfWeek countdown block early for conversion */}
      <div className="mb-6 bg-light py-5">
        <div className="container">
          <DealsOfWeek books={dealsOfWeekBooks} />
        </div>
      </div>

      {/* 4. Tabbed New Releases Column with Promo Banner */}
      <div className="mb-6 container">
        <NewReleases
          history={newReleasesBooks.history}
          science={newReleasesBooks.science}
          romance={newReleasesBooks.romance}
          travel={newReleasesBooks.travel}
        />
      </div>

      {/* 5. Bestselling Books Slider Grid */}
      <div className="mb-6 container">
        <ProductSection title="Featured Hot Releases" books={bestsellingBooks} layout="grid" />
      </div>

      {/* 6. Favorite Authors Circular Profiles Loop */}
      <div className="mb-5 container">
        <FavoriteAuthors authors={favoriteAuthors} />
      </div>
    </div>
  );
};

export default HomeLayoutV2;

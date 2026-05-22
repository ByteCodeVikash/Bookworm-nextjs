import React from "react";
import {
  MainLayout,
  HeroSlider,
  CategorySection,
  ProductSection,
  FeaturedBooksTab,
  DealsOfWeek,
  NewReleases,
  FavoriteAuthors
} from "@/components";
import {
  promoSlides,
  featuredCategories,
  bestsellingBooks,
  featuredBooks,
  dealsOfWeekBooks,
  newReleasesBooks,
  biographiesBooks,
  favoriteAuthors
} from "@/data/mockData";

const HomeVersion1 = () => {
  return (
    <MainLayout>
      <div className="home-template">
        {/* 1. Hero Promo Slides Carousel */}
        <HeroSlider slides={promoSlides} />

        {/* 2. Highlighted Categories Grid */}
        <CategorySection categories={featuredCategories} />

        {/* 3. Bestselling Books Slider Grid */}
        <ProductSection title="Bestselling Books" books={bestsellingBooks} layout="grid" />

        {/* 4. Tabbed Featured/On-Sale/Most-Viewed Books Loop */}
        <FeaturedBooksTab
          featured={featuredBooks.featured}
          onsale={featuredBooks.onsale}
          mostviewed={featuredBooks.mostviewed}
        />

        {/* 5. Countdown Special Weekly Deals Block */}
        <DealsOfWeek books={dealsOfWeekBooks} />

        {/* 6. Multi-tabbed New Releases Column with Promo Banner */}
        <NewReleases
          history={newReleasesBooks.history}
          science={newReleasesBooks.science}
          romance={newReleasesBooks.romance}
          travel={newReleasesBooks.travel}
        />

        {/* 7. Biography Books Horizontal Media Card Grid */}
        <ProductSection title="Biography Books" books={biographiesBooks} layout="card" />

        {/* 8. Favorite Authors Circular Profiles Loop */}
        <FavoriteAuthors authors={favoriteAuthors} />
      </div>
    </MainLayout>
  );
};

export default HomeVersion1;

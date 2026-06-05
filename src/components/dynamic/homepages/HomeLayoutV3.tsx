import React from "react";
import {
  FeaturedBooksTab,
  NewReleases,
  ProductSection,
  FavoriteAuthors
} from "@/components";
import {
  featuredBooks,
  newReleasesBooks,
  biographiesBooks,
  favoriteAuthors
} from "@/data/mockData";

export const HomeLayoutV3: React.FC = () => {
  return (
    <div className="home-layout-v3 container py-5">
      {/* 2. Large Tabbed Featured/On-Sale/Most-Viewed Books Loop */}
      <div className="mb-6">
        <FeaturedBooksTab
          featured={featuredBooks.featured}
          onsale={featuredBooks.onsale}
          mostviewed={featuredBooks.mostviewed}
        />
      </div>

      {/* 3. Multi-tabbed New Releases Column with Promo Banner */}
      <div className="mb-6">
        <NewReleases
          history={newReleasesBooks.history}
          science={newReleasesBooks.science}
          romance={newReleasesBooks.romance}
          travel={newReleasesBooks.travel}
        />
      </div>

      {/* 4. Biography Books Horizontal Media Card Grid */}
      <div className="mb-6">
        <ProductSection title="Trending Biographies" books={biographiesBooks} layout="card" />
      </div>

      {/* 5. Favorite Authors Circular Profiles Loop */}
      <div className="mb-4">
        <FavoriteAuthors authors={favoriteAuthors} />
      </div>
    </div>
  );
};

export default HomeLayoutV3;

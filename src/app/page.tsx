import React from "react";
import { MainLayout, HomeTemplate } from "../components/templates";
import {
  promoSlides,
  featuredCategories,
  bestsellingBooks,
  featuredBooks,
  dealsOfWeekBooks,
  newReleasesBooks,
  biographiesBooks,
  favoriteAuthors
} from "../data/mockData";

export default function Home() {
  return (
    <MainLayout>
      <HomeTemplate
        promoSlides={promoSlides}
        featuredCategories={featuredCategories}
        bestsellingBooks={bestsellingBooks}
        featuredBooks={featuredBooks}
        dealsOfWeekBooks={dealsOfWeekBooks}
        newReleasesBooks={newReleasesBooks}
        biographiesBooks={biographiesBooks}
        favoriteAuthors={favoriteAuthors}
      />
    </MainLayout>
  );
}

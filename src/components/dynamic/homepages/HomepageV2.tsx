import React, { useEffect, useState } from "react";
import {
  HeroSlider,
  ProductSection,
  DealsOfWeek,
  FavoriteAuthors
} from "@/components";
import { fetchBanners, fetchBooks, fetchAuthors } from "@/utils/storeApi";
import { Book, Author, PromoSlide } from "@/types";

export const HomepageV2: React.FC = () => {
  const [slides, setSlides] = useState<PromoSlide[]>([]);
  const [bestsellers, setBestsellers] = useState<Book[]>([]);
  const [deals, setDeals] = useState<Book[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);

  useEffect(() => {
    let active = true;
    Promise.all([
      fetchBanners(),
      fetchBooks("bestsellers"),
      fetchBooks("deal_of_week"),
      fetchAuthors(),
    ]).then(([b, bs, d, a]) => {
      if (!active) return;
      setSlides(b); setBestsellers(bs); setDeals(d); setAuthors(a);
    });
    return () => { active = false; };
  }, []);

  return (
    <div className="homepage-v2 py-4">
      <div className="mb-5">
        <HeroSlider slides={slides} />
      </div>
      <div className="mb-6 container">
        <ProductSection title="Featured Hot Releases" books={bestsellers} layout="grid" />
      </div>
      <div className="mb-6 bg-light py-5">
        <div className="container">
          <DealsOfWeek books={deals} />
        </div>
      </div>
      <div className="mb-5 container">
        <FavoriteAuthors authors={authors} />
      </div>
    </div>
  );
};

export default HomepageV2;

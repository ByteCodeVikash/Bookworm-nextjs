import React, { useEffect, useState } from "react";
import {
  HeroSlider,
  DealsOfWeek,
  NewReleases,
  ProductSection,
  FavoriteAuthors
} from "@/components";
import { fetchBanners, fetchBooks, fetchAuthors } from "@/utils/storeApi";
import { Book, Author, PromoSlide } from "@/types";

export const HomeLayoutV2: React.FC = () => {
  const [slides, setSlides] = useState<PromoSlide[]>([]);
  const [bestsellers, setBestsellers] = useState<Book[]>([]);
  const [deals, setDeals] = useState<Book[]>([]);
  const [nrHistory, setNrHistory] = useState<Book[]>([]);
  const [nrScience, setNrScience] = useState<Book[]>([]);
  const [nrRomance, setNrRomance] = useState<Book[]>([]);
  const [nrTravel, setNrTravel] = useState<Book[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);

  useEffect(() => {
    let active = true;
    Promise.all([
      fetchBanners(),
      fetchBooks("deal_of_week"),
      fetchBooks("new_release", "history"),
      fetchBooks("new_release", "science"),
      fetchBooks("new_release", "romance"),
      fetchBooks("new_release", "travel"),
      fetchBooks("bestsellers"),
      fetchAuthors(),
    ]).then(([b, d, nrH, nrS, nrR, nrT, bs, a]) => {
      if (!active) return;
      setSlides(b); setDeals(d); setNrHistory(nrH); setNrScience(nrS);
      setNrRomance(nrR); setNrTravel(nrT); setBestsellers(bs); setAuthors(a);
    });
    return () => { active = false; };
  }, []);

  return (
    <div className="home-layout-v2 py-4">
      <div className="mb-5">
        <HeroSlider slides={slides} />
      </div>
      <div className="mb-6 bg-light py-5">
        <div className="container">
          <DealsOfWeek books={deals} />
        </div>
      </div>
      <div className="mb-6 container">
        <NewReleases history={nrHistory} science={nrScience} romance={nrRomance} travel={nrTravel} />
      </div>
      <div className="mb-6 container">
        <ProductSection title="Featured Hot Releases" books={bestsellers} layout="grid" />
      </div>
      <div className="mb-5 container">
        <FavoriteAuthors authors={authors} />
      </div>
    </div>
  );
};

export default HomeLayoutV2;

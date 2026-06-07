import React, { useEffect, useState } from "react";
import {
  HeroSlider,
  ProductSection,
  FeaturedBooksTab,
  DealsOfWeek,
  NewReleases,
  FavoriteAuthors
} from "@/components";
import { fetchBanners, fetchBooks, fetchAuthors } from "@/utils/storeApi";
import { Book, Author, PromoSlide } from "@/types";

export const HomepageV1: React.FC = () => {
  const [slides, setSlides] = useState<PromoSlide[]>([]);
  const [bestsellers, setBestsellers] = useState<Book[]>([]);
  const [featured, setFeatured] = useState<Book[]>([]);
  const [onsale, setOnsale] = useState<Book[]>([]);
  const [mostviewed, setMostviewed] = useState<Book[]>([]);
  const [deals, setDeals] = useState<Book[]>([]);
  const [nrHistory, setNrHistory] = useState<Book[]>([]);
  const [nrScience, setNrScience] = useState<Book[]>([]);
  const [nrRomance, setNrRomance] = useState<Book[]>([]);
  const [nrTravel, setNrTravel] = useState<Book[]>([]);
  const [biographies, setBiographies] = useState<Book[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);

  useEffect(() => {
    let active = true;
    Promise.all([
      fetchBanners(),
      fetchBooks("bestsellers"),
      fetchBooks("featured"),
      fetchBooks("onsale"),
      fetchBooks("mostviewed"),
      fetchBooks("deal_of_week"),
      fetchBooks("new_release", "history"),
      fetchBooks("new_release", "science"),
      fetchBooks("new_release", "romance"),
      fetchBooks("new_release", "travel"),
      fetchBooks("biographies"),
      fetchAuthors(),
    ]).then(([b, bs, f, os, mv, d, nrH, nrS, nrR, nrT, bio, a]) => {
      if (!active) return;
      setSlides(b); setBestsellers(bs); setFeatured(f); setOnsale(os);
      setMostviewed(mv); setDeals(d); setNrHistory(nrH); setNrScience(nrS);
      setNrRomance(nrR); setNrTravel(nrT); setBiographies(bio); setAuthors(a);
    });
    return () => { active = false; };
  }, []);

  return (
    <div className="homepage-v1">
      <HeroSlider slides={slides} />
      <ProductSection title="Bestselling Books" books={bestsellers} layout="grid" viewAllLink="/shop" />
      <FeaturedBooksTab featured={featured} onsale={onsale} mostviewed={mostviewed} />
      <DealsOfWeek books={deals} />
      <NewReleases history={nrHistory} science={nrScience} romance={nrRomance} travel={nrTravel} />
      <ProductSection title="Biography Books" books={biographies} layout="card" />
      <FavoriteAuthors authors={authors} />
    </div>
  );
};

export default HomepageV1;

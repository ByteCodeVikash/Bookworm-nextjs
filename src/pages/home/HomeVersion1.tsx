import React, { useEffect, useState } from "react";
import {
  MainLayout,
  HeroSlider,
  ProductSection,
  FeaturedBooksTab,
  DealsOfWeek,
  NewReleases,
  FavoriteAuthors
} from "@/components";
import {
  fetchBanners,
  fetchBooks,
  fetchAuthors,
} from "@/utils/storeApi";
import { Book, Author, PromoSlide } from "@/types";

const HomeVersion1 = () => {
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

    const load = async () => {
      const [
        bannersData,
        bestsellersData,
        featuredData,
        onsaleData,
        mostviewedData,
        dealsData,
        nrHistoryData,
        nrScienceData,
        nrRomanceData,
        nrTravelData,
        biographiesData,
        authorsData,
      ] = await Promise.all([
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
      ]);

      if (!active) return;
      setSlides(bannersData);
      setBestsellers(bestsellersData);
      setFeatured(featuredData);
      setOnsale(onsaleData);
      setMostviewed(mostviewedData);
      setDeals(dealsData);
      setNrHistory(nrHistoryData);
      setNrScience(nrScienceData);
      setNrRomance(nrRomanceData);
      setNrTravel(nrTravelData);
      setBiographies(biographiesData);
      setAuthors(authorsData);
    };

    load();
    return () => { active = false; };
  }, []);

  return (
    <MainLayout>
      <div className="home-template">
        {/* 1. Hero Promo Slides Carousel */}
        <HeroSlider slides={slides} />

        {/* 2. Bestselling Books Slider Grid */}
        <ProductSection title="Bestselling Books" books={bestsellers} layout="grid" viewAllLink="/shop" />

        {/* 3. Tabbed Featured/On-Sale/Most-Viewed Books */}
        <FeaturedBooksTab
          featured={featured}
          onsale={onsale}
          mostviewed={mostviewed}
        />

        {/* 4. Countdown Special Weekly Deals Block */}
        <DealsOfWeek books={deals} />

        {/* 5. Multi-tabbed New Releases Column with Promo Banner */}
        <NewReleases
          history={nrHistory}
          science={nrScience}
          romance={nrRomance}
          travel={nrTravel}
        />

        {/* 6. Biography Books Horizontal Media Card Grid */}
        <ProductSection title="Biography Books" books={biographies} layout="card" />

        {/* 7. Favorite Authors Circular Profiles Loop */}
        <FavoriteAuthors authors={authors} />
      </div>
    </MainLayout>
  );
};

export default HomeVersion1;

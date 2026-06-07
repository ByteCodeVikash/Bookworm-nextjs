import React, { useEffect, useState } from "react";
import {
  FeaturedBooksTab,
  NewReleases,
  ProductSection
} from "@/components";
import { fetchBooks } from "@/utils/storeApi";
import { Book } from "@/types";

export const HomepageV3: React.FC = () => {
  const [featured, setFeatured] = useState<Book[]>([]);
  const [onsale, setOnsale] = useState<Book[]>([]);
  const [mostviewed, setMostviewed] = useState<Book[]>([]);
  const [nrHistory, setNrHistory] = useState<Book[]>([]);
  const [nrScience, setNrScience] = useState<Book[]>([]);
  const [nrRomance, setNrRomance] = useState<Book[]>([]);
  const [nrTravel, setNrTravel] = useState<Book[]>([]);
  const [biographies, setBiographies] = useState<Book[]>([]);

  useEffect(() => {
    let active = true;
    Promise.all([
      fetchBooks("featured"),
      fetchBooks("onsale"),
      fetchBooks("mostviewed"),
      fetchBooks("new_release", "history"),
      fetchBooks("new_release", "science"),
      fetchBooks("new_release", "romance"),
      fetchBooks("new_release", "travel"),
      fetchBooks("biographies"),
    ]).then(([f, os, mv, nrH, nrS, nrR, nrT, bio]) => {
      if (!active) return;
      setFeatured(f); setOnsale(os); setMostviewed(mv);
      setNrHistory(nrH); setNrScience(nrS); setNrRomance(nrR); setNrTravel(nrT);
      setBiographies(bio);
    });
    return () => { active = false; };
  }, []);

  return (
    <div className="homepage-v3 container py-5">
      <div className="mb-6">
        <FeaturedBooksTab featured={featured} onsale={onsale} mostviewed={mostviewed} />
      </div>
      <div className="mb-6">
        <NewReleases history={nrHistory} science={nrScience} romance={nrRomance} travel={nrTravel} />
      </div>
      <div className="mb-4">
        <ProductSection title="Trending Biographies" books={biographies} layout="card" />
      </div>
    </div>
  );
};

export default HomepageV3;

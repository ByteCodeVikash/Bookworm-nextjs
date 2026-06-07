import React, { useEffect, useState } from "react";
import { SectionConfig, SectionType } from "@/config/siteConfig";
import {
  HeroSlider,
  CategorySection,
  ProductSection,
  FeaturedBooksTab,
  DealsOfWeek,
  NewReleases,
  FavoriteAuthors
} from "@/components";
import {
  fetchBanners,
  fetchBooks,
  fetchCategories,
  fetchAuthors,
} from "@/utils/storeApi";
import { Book, Author, Category, PromoSlide } from "@/types";

// Registry of dynamic section components
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SectionComponentMap: Record<SectionType, React.ComponentType<any>> = {
  HeroSlider: HeroSlider,
  CategorySection: CategorySection,
  ProductSection: ProductSection,
  FeaturedBooksTab: FeaturedBooksTab,
  DealsOfWeek: DealsOfWeek,
  NewReleases: NewReleases,
  FavoriteAuthors: FavoriteAuthors,
};

interface AbstractLayoutRendererProps {
  sections: SectionConfig[];
}

export const AbstractLayoutRenderer: React.FC<AbstractLayoutRendererProps> = ({ sections }) => {
  const [slides, setSlides] = useState<PromoSlide[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [bestsellers, setBestsellers] = useState<Book[]>([]);
  const [featured, setFeatured] = useState<Book[]>([]);
  const [onsale, setOnsale] = useState<Book[]>([]);
  const [mostviewed, setMostviewed] = useState<Book[]>([]);
  const [deals, setDeals] = useState<Book[]>([]);
  const [biographies, setBiographies] = useState<Book[]>([]);
  const [nrHistory, setNrHistory] = useState<Book[]>([]);
  const [nrScience, setNrScience] = useState<Book[]>([]);
  const [nrRomance, setNrRomance] = useState<Book[]>([]);
  const [nrTravel, setNrTravel] = useState<Book[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);

  useEffect(() => {
    let active = true;
    Promise.all([
      fetchBanners(),
      fetchCategories(),
      fetchBooks("bestsellers"),
      fetchBooks("featured"),
      fetchBooks("onsale"),
      fetchBooks("mostviewed"),
      fetchBooks("deal_of_week"),
      fetchBooks("biographies"),
      fetchBooks("new_release", "history"),
      fetchBooks("new_release", "science"),
      fetchBooks("new_release", "romance"),
      fetchBooks("new_release", "travel"),
      fetchAuthors(),
    ]).then(([b, cats, bs, f, os, mv, d, bio, nrH, nrS, nrR, nrT, a]) => {
      if (!active) return;
      setSlides(b); setCategories(cats); setBestsellers(bs); setFeatured(f);
      setOnsale(os); setMostviewed(mv); setDeals(d); setBiographies(bio);
      setNrHistory(nrH); setNrScience(nrS); setNrRomance(nrR); setNrTravel(nrT);
      setAuthors(a);
    });
    return () => { active = false; };
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getSectionDefaultProps = (type: SectionType, customProps?: Record<string, any>) => {
    switch (type) {
      case "HeroSlider":
        return { slides, ...customProps };
      case "CategorySection":
        return { categories, ...customProps };
      case "ProductSection":
        if (customProps?.title === "Biography Books") {
          return { title: "Biography Books", books: biographies, layout: "card", ...customProps };
        }
        return { title: "Bestselling Books", books: bestsellers, layout: "grid", viewAllLink: "/shop", ...customProps };
      case "FeaturedBooksTab":
        return { featured, onsale, mostviewed, ...customProps };
      case "DealsOfWeek":
        return { books: deals, ...customProps };
      case "NewReleases":
        return { history: nrHistory, science: nrScience, romance: nrRomance, travel: nrTravel, ...customProps };
      case "FavoriteAuthors":
        return { authors, ...customProps };
      default:
        return { ...customProps };
    }
  };

  return (
    <div className="abstract-layout-sections">
      {sections
        .filter((section) => section.visible)
        .map((section) => {
          const Component = SectionComponentMap[section.type];
          if (!Component) return null;
          const componentProps = getSectionDefaultProps(section.type, section.props);
          return <Component key={section.id} {...componentProps} />;
        })}
    </div>
  );
};

export default AbstractLayoutRenderer;

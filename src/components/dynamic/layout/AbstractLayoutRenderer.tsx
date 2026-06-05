import React from "react";
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
  promoSlides,
  featuredCategories,
  bestsellingBooks,
  featuredBooks,
  dealsOfWeekBooks,
  newReleasesBooks,
  biographiesBooks,
  favoriteAuthors
} from "@/data/mockData";

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

// Standard mock data injector for abstract layouts
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getSectionDefaultProps = (type: SectionType, customProps?: Record<string, any>) => {
  switch (type) {
    case "HeroSlider":
      return { slides: promoSlides, ...customProps };
    case "CategorySection":
      return { categories: featuredCategories, ...customProps };
    case "ProductSection":
      if (customProps?.title === "Biography Books") {
        return { title: "Biography Books", books: biographiesBooks, layout: "card", ...customProps };
      }
      return { title: "Bestselling Books", books: bestsellingBooks, layout: "grid", viewAllLink: "/shop", ...customProps };
    case "FeaturedBooksTab":
      return {
        featured: featuredBooks.featured,
        onsale: featuredBooks.onsale,
        mostviewed: featuredBooks.mostviewed,
        ...customProps
      };
    case "DealsOfWeek":
      return { books: dealsOfWeekBooks, ...customProps };
    case "NewReleases":
      return {
        history: newReleasesBooks.history,
        science: newReleasesBooks.science,
        romance: newReleasesBooks.romance,
        travel: newReleasesBooks.travel,
        ...customProps
      };
    case "FavoriteAuthors":
      return { authors: favoriteAuthors, ...customProps };
    default:
      return { ...customProps };
  }
};

interface AbstractLayoutRendererProps {
  sections: SectionConfig[];
}

export const AbstractLayoutRenderer: React.FC<AbstractLayoutRendererProps> = ({ sections }) => {
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

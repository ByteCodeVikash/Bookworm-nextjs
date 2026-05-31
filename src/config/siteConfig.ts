export type HeaderVersion = "header-v1" | "header-v2" | "header-v3" | "header-v4";
export type FooterVersion = "footer-v1" | "footer-v2" | "footer-v3" | "footer-v4";
export type HomepageVersion = "home-v1" | "home-v2" | "home-v3";
export type ThemeSet = "set-1" | "set-2" | "set-3" | "set-4";

export type SectionType =
  | "HeroSlider"
  | "CategorySection"
  | "ProductSection"
  | "FeaturedBooksTab"
  | "DealsOfWeek"
  | "NewReleases"
  | "FavoriteAuthors";

export interface SectionConfig {
  id: string;
  type: SectionType;
  visible: boolean;
  props?: Record<string, unknown>;
}

export interface SiteConfig {
  themeSet: ThemeSet;
  headerVersion: HeaderVersion;
  footerVersion: FooterVersion;
  homepageVersion: HomepageVersion;
  homepageStructure: SectionConfig[];
  businessDetails: {
    storeName: string;
    logoUrl?: string;
    phone: string;
    email: string;
    address: string;
    socials: {
      instagram?: string;
      facebook?: string;
      youtube?: string;
      twitter?: string;
    };
  };
  content: {
    heroTitle: string;
    heroSubtitle: string;
    buttonText: string;
    footerText: string;
  };
}

export const defaultSiteConfig: SiteConfig = {
  themeSet: "set-1",
  headerVersion: "header-v1",
  footerVersion: "footer-v1",
  homepageVersion: "home-v1",
  homepageStructure: [
    { id: "hero", type: "HeroSlider", visible: true },
    { id: "categories", type: "CategorySection", visible: true },
    { id: "bestsellers", type: "ProductSection", visible: true, props: { title: "Bestselling Books", layout: "grid" } },
    { id: "featured-tabs", type: "FeaturedBooksTab", visible: true },
    { id: "deals", type: "DealsOfWeek", visible: true },
    { id: "new-releases", type: "NewReleases", visible: true },
    { id: "biographies", type: "ProductSection", visible: true, props: { title: "Biography Books", layout: "card" } },
    { id: "authors", type: "FavoriteAuthors", visible: true }
  ],
  businessDetails: {
    storeName: "Bookworm",
    phone: "+1 246-345-0695",
    email: "support@bookworm.com",
    address: "1418 Riverwood Drive, Suite 3245 Cottonwood, CA 96022, United States",
    socials: {
      instagram: "#",
      facebook: "#",
      youtube: "#",
      twitter: "#"
    }
  },
  content: {
    heroTitle: "The Bookworm Edit",
    heroSubtitle: "Featured Books of the Week",
    buttonText: "See More",
    footerText: "All rights reserved."
  }
};

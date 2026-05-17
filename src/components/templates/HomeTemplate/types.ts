import { Book, Author, Category, PromoSlide } from "../../../types";

export interface HomeTemplateProps {
  promoSlides: PromoSlide[];
  featuredCategories: Category[];
  bestsellingBooks: Book[];
  featuredBooks: {
    featured: Book[];
    onsale: Book[];
    mostviewed: Book[];
  };
  dealsOfWeekBooks: Book[];
  newReleasesBooks: {
    history: Book[];
    science: Book[];
    romance: Book[];
    travel: Book[];
  };
  biographiesBooks: Book[];
  favoriteAuthors: Author[];
}

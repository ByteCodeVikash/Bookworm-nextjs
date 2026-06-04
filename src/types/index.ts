export interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  originalPrice?: number;
  rating?: number;
  category: string;
  format: string; // "Paperback" | "Hard Cover" | "Kindle Edition"
  imageUrl: string;
  priceRange?: string;
}

export interface Author {
  id: string;
  name: string;
  imageUrl: string;
  booksCount: number;
}

export interface Category {
  id: string;
  name: string;
  iconClass: string;
  imageUrl?: string;
  booksCount?: number;
}

export interface PromoSlide {
  id: string;
  titlePrefix: string;
  titleHighlighted: string;
  titleSuffix: string;
  subtitle: string;
  imageUrl: string;
  actionUrl: string;
}

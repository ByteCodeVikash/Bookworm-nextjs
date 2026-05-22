import { Book } from "@/types";

export interface FeaturedBooksTabProps {
  featured: Book[];
  onsale: Book[];
  mostviewed: Book[];
}

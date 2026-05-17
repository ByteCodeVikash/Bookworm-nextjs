import { Book } from "../../../types";

export interface ProductSectionProps {
  title: string;
  books: Book[];
  layout?: "grid" | "card";
  viewAllLink?: string;
  className?: string;
}

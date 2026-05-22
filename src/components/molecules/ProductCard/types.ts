import { Book } from "@/types";

export interface ProductCardProps {
  book: Book;
  layout?: "grid" | "list" | "card";
}

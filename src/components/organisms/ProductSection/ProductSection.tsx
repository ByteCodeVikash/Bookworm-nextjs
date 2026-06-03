import React from "react";
import { ProductSectionProps } from "./types";
import { ProductCard } from "@/components/molecules";
import { Icon } from "@/components/atoms";

export const ProductSection: React.FC<ProductSectionProps> = ({
  title,
  books,
  layout = "grid",
  viewAllLink = "#",
  className = ""
}) => {
  return (
    <section className={`space-bottom-3 ${className}`}>
      <div className="container">
        <header className="mb-5 d-md-flex justify-content-between align-items-center">
          <h2 className="font-size-7 mb-3 mb-md-0">{title}</h2>
          <a href={viewAllLink} className="h-primary d-block">
            View All <Icon name="glyph-icon flaticon-next" />
          </a>
        </header>
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-wd-5 no-gutters border products">
          {books.map((book) => (
            <div key={book.id} className="col product" style={{ listStyleType: "none" }}>
              <ProductCard book={book} layout={layout === "card" ? "card" : "grid"} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default ProductSection;

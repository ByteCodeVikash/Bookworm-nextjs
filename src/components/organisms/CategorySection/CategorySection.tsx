import React from "react";
import { CategorySectionProps } from "./types";
import { Icon } from "../../atoms";

const bgAndTextClasses: Record<string, { bg: string; text: string }> = {
  arts: { bg: "bg-indigo-light", text: "text-primary-indigo" },
  food: { bg: "bg-tangerine-light", text: "text-tangerine" },
  romance: { bg: "bg-chili-light", text: "text-chili" },
  health: { bg: "bg-carolina-light", text: "text-carolina" },
  biography: { bg: "bg-punch-light", text: "text-punch" },
};

export const CategorySection: React.FC<CategorySectionProps> = ({ categories }) => {
  return (
    <section className="space-bottom-3">
      <div className="container">
        <header className="mb-5 d-md-flex justify-content-between align-items-center">
          <h2 className="font-size-7 mb-3 mb-md-0">Featured Categories</h2>
          <a href="#" className="h-primary d-block">
            All Categories <Icon name="glyph-icon flaticon-next" />
          </a>
        </header>
        <ul className="list-unstyled my-0 row row-cols-md-2 row-cols-lg-3 row-cols-xl-4 row-cols-wd-5">
          {categories.map((cat) => {
            const styles = bgAndTextClasses[cat.id] || { bg: "bg-indigo-light", text: "text-primary-indigo" };
            return (
              <li key={cat.id} className="product-category col mb-4 mb-xl-0" style={{ listStyleType: "none" }}>
                <div className={`product-category__inner ${styles.bg} px-6 py-5`}>
                  <div className={`product-category__icon font-size-12 ${styles.text}`}>
                    <Icon name={`glyph-icon ${cat.iconClass}`} />
                  </div>
                  <div className="product-category__body">
                    <h3 className="text-truncate font-size-3">{cat.name}</h3>
                    <a href="#" className="stretched-link text-dark">
                      Shop Now
                    </a>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};
export default CategorySection;

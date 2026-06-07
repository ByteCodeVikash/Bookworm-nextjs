import React, { useEffect, useState } from "react";
import { FavoriteAuthorsProps } from "./types";
import { AuthorCard } from "@/components/molecules";
import { Icon } from "@/components/atoms";
import { fetchApi } from "@/utils/api";
import { Author } from "@/types";

export const FavoriteAuthors: React.FC<FavoriteAuthorsProps> = ({ authors }) => {
  const [localAuthors, setLocalAuthors] = useState<Author[]>(authors || []);

  useEffect(() => {
    let active = true;
    const loadData = async () => {
      try {
        const data = await fetchApi<Author[]>("/api/authors.php");
        if (active) {
          // homepage favorites typically have profile images
          const filtered = data.filter((a) => a.imageUrl);
          setLocalAuthors(filtered);
        }
      } catch (err) {
        console.error("Failed to load favorite authors:", err);
      }
    };
    loadData();
    return () => { active = false; };
  }, []);
  return (
    <section className="space-bottom-3">
      <div className="container">
        <header className="mb-5 d-md-flex justify-content-between align-items-center">
          <h2 className="font-size-7 mb-3 mb-md-0">Favorite Authors</h2>
          <a href="#" className="h-primary d-block">
            View All <Icon name="glyph-icon flaticon-next" />
          </a>
        </header>
        <ul className="list-unstyled my-0 row row-cols-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5">
          {localAuthors.slice(0, 5).map((author) => (
            <li key={author.id} className="col mb-5 mb-xl-0" style={{ listStyleType: "none" }}>
              <AuthorCard author={author} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
export default FavoriteAuthors;

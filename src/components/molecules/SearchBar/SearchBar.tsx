import React, { useState, useEffect, useRef } from "react";
import { SearchBarProps } from "./types";
import { Icon } from "@/components/atoms";
import { Book } from "@/types";
import { fetchApi } from "@/utils/api";

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Search by Keywords",
  className = "",
  onSearch,
  variant = "default"
}) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<string[]>([]);
  const [filteredAuthors, setFilteredAuthors] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.trim().length === 0) {
      setFilteredBooks([]);
      setFilteredCategories([]);
      setFilteredAuthors([]);
      setIsOpen(false);
      return;
    }

    let active = true;
    const searchData = async () => {
      try {
        const res = await fetchApi<{
          books: Book[];
          authors: Array<{ id: string; name: string }>;
          categories: Array<{ id: string; name: string }>;
        }>(`/api/search.php?q=${encodeURIComponent(query)}`);

        if (active) {
          setFilteredBooks(res.books || []);
          setFilteredCategories((res.categories || []).map((c) => c.name));
          setFilteredAuthors((res.authors || []).map((a) => a.name));
          setIsOpen(true);
        }
      } catch (err) {
        console.error("Search failed:", err);
      }
    };

    const delay = setTimeout(searchData, 200);
    return () => {
      active = false;
      clearTimeout(delay);
    };
  }, [query]);

  // Click outside detection
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query);
    }
  };

  const isV1 = variant === "v1";

  return (
    <div ref={searchRef} className="position-relative w-100">
      <form className={`w-100 ${className}`} onSubmit={handleSubmit}>
        <div className="input-group">
          {isV1 && (
            <div className="input-group-prepend">
              <i className="glph-icon flaticon-loupe input-group-text py-2d75 bg-white-100 border-white-100"></i>
            </div>
          )}
          <input
            type="text"
            className={
              isV1
                ? "form-control bg-white-100 min-width-380 py-2d75 height-4 border-white-100"
                : "form-control px-5 height-60 border-right-0 border-dark"
            }
            placeholder={placeholder}
            aria-label="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              if (query.trim().length > 0) {
                setIsOpen(true);
              }
            }}
          />
          {!isV1 && (
            <div className="input-group-append">
              <button className="btn btn-dark pr-5 py-3" type="submit">
                <Icon name="flaticon-search" className="font-size-5" />
              </button>
            </div>
          )}
        </div>
      </form>

      {/* Suggestion Dropdown */}
      {isOpen && (
        <div
          className="position-absolute bg-white border border-gray-300 w-100 mt-1 shadow-lg overflow-auto rounded-0"
          style={{ top: "100%", left: 0, zIndex: 1000, maxHeight: "350px" }}
        >
          {/* Category Results */}
          {filteredCategories.length > 0 && (
            <div>
              <div className="bg-gray-100 px-3 py-2 font-weight-bold font-size-1 text-uppercase text-gray-500 border-bottom">
                Categories
              </div>
              {filteredCategories.map((cat) => (
                <div
                  key={cat}
                  onClick={() => {
                    setQuery("");
                    setIsOpen(false);
                    window.location.href = `/shop?category=${encodeURIComponent(cat)}`;
                  }}
                  className="d-flex align-items-center p-3 border-bottom cursor-pointer"
                  style={{
                    transition: "background-color 0.2s",
                    cursor: "pointer",
                    backgroundColor: "#ffffff"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#f8f9fa";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#ffffff";
                  }}
                >
                  <Icon name="far fa-folder mr-3 text-gray-500 font-size-3" />
                  <span className="font-weight-medium font-size-2 text-dark">{cat}</span>
                </div>
              ))}
            </div>
          )}

          {/* Author Results */}
          {filteredAuthors.length > 0 && (
            <div>
              <div className="bg-gray-100 px-3 py-2 font-weight-bold font-size-1 text-uppercase text-gray-500 border-bottom">
                Authors
              </div>
              {filteredAuthors.map((author) => (
                <div
                  key={author}
                  onClick={() => {
                    setQuery("");
                    setIsOpen(false);
                    window.location.href = `/shop?author=${encodeURIComponent(author)}`;
                  }}
                  className="d-flex align-items-center p-3 border-bottom cursor-pointer"
                  style={{
                    transition: "background-color 0.2s",
                    cursor: "pointer",
                    backgroundColor: "#ffffff"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#f8f9fa";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#ffffff";
                  }}
                >
                  <Icon name="far fa-user mr-3 text-gray-500 font-size-3" />
                  <span className="font-weight-medium font-size-2 text-dark">{author}</span>
                </div>
              ))}
            </div>
          )}

          {/* Book Results */}
          {filteredBooks.length > 0 && (
            <div>
              <div className="bg-gray-100 px-3 py-2 font-weight-bold font-size-1 text-uppercase text-gray-500 border-bottom">
                Books
              </div>
              {filteredBooks.map((book) => (
                <div
                  key={book.id}
                  onClick={() => {
                    setQuery("");
                    setIsOpen(false);
                    window.location.href = `/product?id=${book.id}`;
                  }}
                  className="d-flex align-items-center justify-content-between p-3 border-bottom cursor-pointer"
                  style={{
                    transition: "background-color 0.2s",
                    cursor: "pointer",
                    backgroundColor: "#ffffff"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#f8f9fa";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#ffffff";
                  }}
                >
                  <div className="d-flex align-items-center" style={{ minWidth: 0 }}>
                    <img
                      src={book.imageUrl}
                      alt={book.title}
                      width="40"
                      height="60"
                      style={{ objectFit: "cover", marginRight: "12px", flexShrink: 0 }}
                    />
                    <div style={{ minWidth: 0 }}>
                      <div
                        className="font-weight-medium font-size-2 text-dark text-truncate"
                        style={{ maxWidth: "200px" }}
                      >
                        {book.title}
                      </div>
                      <div
                        className="font-size-1 text-gray-500 text-truncate"
                        style={{ maxWidth: "200px" }}
                      >
                        {book.author}
                      </div>
                    </div>
                  </div>
                  <div className="font-weight-medium text-dark ml-2 flex-shrink-0">
                    ${book.price.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          )}

          {filteredCategories.length === 0 && filteredAuthors.length === 0 && filteredBooks.length === 0 && (
            <div className="p-4 text-center text-gray-600 font-size-2">
              No results found matching &quot;{query}&quot;
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;

import React, { useState, useEffect, useRef } from "react";
import { SearchBarProps } from "./types";
import { Icon } from "@/components/atoms";
import { Book } from "@/types";
import {
  bestsellingBooks,
  featuredBooks,
  dealsOfWeekBooks,
  newReleasesBooks,
  biographiesBooks
} from "@/data/mockData";

// Consolidate all books from mock data
const allBooks: Book[] = [
  ...bestsellingBooks,
  ...featuredBooks.featured,
  ...featuredBooks.onsale,
  ...featuredBooks.mostviewed,
  ...dealsOfWeekBooks,
  ...newReleasesBooks.history,
  ...newReleasesBooks.science,
  ...newReleasesBooks.romance,
  ...newReleasesBooks.travel,
  ...biographiesBooks
];

// Deduplicate books by ID
const uniqueBooks = Array.from(new Map(allBooks.map((item) => [item.id, item])).values());

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Search by Keywords",
  className = "",
  onSearch,
  variant = "default"
}) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.trim().length === 0) {
      setFilteredBooks([]);
      setIsOpen(false);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const matches = uniqueBooks.filter(
      (book) =>
        book.title.toLowerCase().includes(lowerQuery) ||
        book.author.toLowerCase().includes(lowerQuery) ||
        book.category.toLowerCase().includes(lowerQuery)
    );
    setFilteredBooks(matches);
    setIsOpen(true);
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
          {filteredBooks.length > 0 ? (
            filteredBooks.map((book) => (
              <div
                key={book.id}
                onClick={() => {
                  setQuery("");
                  setIsOpen(false);
                  window.location.href = `/product`;
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
            ))
          ) : (
            <div className="p-4 text-center text-gray-600 font-size-2">
              No books found matching &quot;{query}&quot;
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;

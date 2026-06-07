import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { MainLayout } from "@/components";
import { ProductCard } from "@/components/molecules/ProductCard/ProductCard";
import { fetchApi } from "@/utils/api";
import { fetchCategories, fetchAuthors, fetchBooks } from "@/utils/storeApi";
import { Book, Category, Author } from "@/types";

export default function ShopPage() {
  const router = useRouter();
  const queryCategory = router.query.category as string | undefined;
  const queryAuthor = router.query.author as string | undefined;

  // ─── DB-fetched data ────────────────────────────────────────────────────────
  const [books, setBooks] = useState<Book[]>([]);
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const [authorsList, setAuthorsList] = useState<Author[]>([]);
  const [featuredSidebarBooks, setFeaturedSidebarBooks] = useState<Book[]>([]);

  useEffect(() => {
    let active = true;
    const loadData = async () => {
      try {
        const [booksData, cats, auths, featuredBooks] = await Promise.all([
          fetchApi<Book[]>("/api/books.php"),
          fetchCategories(),
          fetchAuthors(),
          fetchBooks("featured"),
        ]);
        if (active) {
          setBooks(Array.isArray(booksData) ? booksData : []);
          setCategoriesList(cats);
          setAuthorsList(auths);
          setFeaturedSidebarBooks(featuredBooks.slice(0, 3));
        }
      } catch (err) {
        console.error("Failed to load shop data:", err);
      }
    };
    loadData();
    return () => { active = false; };
  }, []);

  // Derive unique formats dynamically from loaded books
  const formatsList = useMemo(() => {
    const counts: Record<string, number> = {};
    books.forEach((b) => {
      const fmt = b.format?.trim();
      if (fmt) counts[fmt] = (counts[fmt] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [books]);

  // ─── Filter & view state ────────────────────────────────────────────────────
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);
  const [selectedFormats, setSelectedFormats] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(100);
  const [tempMinPrice, setTempMinPrice] = useState<number>(0);
  const [tempMaxPrice, setTempMaxPrice] = useState<number>(100);
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [sortOption, setSortOption] = useState<string>("default");
  const [pageSize, setPageSize] = useState<number>(20);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Sync URL query params with local state
  useEffect(() => {
    setSelectedCategory(queryCategory || null);
  }, [queryCategory]);

  useEffect(() => {
    setSelectedAuthors(queryAuthor ? [queryAuthor] : []);
  }, [queryAuthor]);

  // Ratings sidebar (derived from data but static display)
  const ratingsList = [
    { rating: 5, count: books.filter((b) => b.rating === 5).length },
    { rating: 4, count: books.filter((b) => b.rating === 4).length },
    { rating: 3, count: books.filter((b) => b.rating === 3).length },
    { rating: 2, count: books.filter((b) => b.rating === 2).length },
    { rating: 1, count: books.filter((b) => b.rating === 1).length },
  ].filter((r) => r.count > 0);

  // ─── Filter handlers ────────────────────────────────────────────────────────
  const handleAuthorToggle = (author: string) => {
    setSelectedAuthors((prev) =>
      prev.includes(author) ? prev.filter((a) => a !== author) : [...prev, author]
    );
    setCurrentPage(1);
  };

  const handleFormatToggle = (format: string) => {
    setSelectedFormats((prev) =>
      prev.includes(format) ? prev.filter((f) => f !== format) : [...prev, format]
    );
    setCurrentPage(1);
  };

  const handleRatingToggle = (rating: number) => {
    setSelectedRatings((prev) =>
      prev.includes(rating) ? prev.filter((r) => r !== rating) : [...prev, rating]
    );
    setCurrentPage(1);
  };

  const applyPriceFilter = () => {
    setMinPrice(tempMinPrice);
    setMaxPrice(tempMaxPrice);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSelectedCategory(null);
    setSelectedAuthors([]);
    setSelectedFormats([]);
    setMinPrice(0);
    setMaxPrice(100);
    setTempMinPrice(0);
    setTempMaxPrice(100);
    setSelectedRatings([]);
    setSortOption("default");
    setCurrentPage(1);
  };

  // ─── Filtering & sorting ────────────────────────────────────────────────────
  const filteredBooks = useMemo(() => {
    let result = [...books];

    if (selectedCategory) {
      result = result.filter((b) => {
        const catA = b.category.toLowerCase();
        const catB = selectedCategory.toLowerCase();
        return (
          catA.includes(catB) ||
          catB.includes(catA) ||
          catA.split("&")[0].trim().includes(catB.split("&")[0].trim()) ||
          catB.split("&")[0].trim().includes(catA.split("&")[0].trim())
        );
      });
    }

    if (selectedAuthors.length > 0) {
      result = result.filter((b) =>
        selectedAuthors.some((auth) => b.author.toLowerCase().includes(auth.toLowerCase().replace("...", "")))
      );
    }

    if (selectedFormats.length > 0) {
      result = result.filter((b) => {
        const bookFmts = b.format.toLowerCase();
        return selectedFormats.some((fmt) => bookFmts.includes(fmt.toLowerCase()));
      });
    }

    result = result.filter((b) => b.price >= minPrice && b.price <= maxPrice);

    if (selectedRatings.length > 0) {
      result = result.filter((b) => b.rating !== undefined && selectedRatings.includes(b.rating));
    }

    if (sortOption === "price-asc") result.sort((a, b) => a.price - b.price);
    else if (sortOption === "price-desc") result.sort((a, b) => b.price - a.price);
    else if (sortOption === "rating") result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    else if (sortOption === "title") result.sort((a, b) => a.title.localeCompare(b.title));

    return result;
  }, [books, selectedCategory, selectedAuthors, selectedFormats, minPrice, maxPrice, selectedRatings, sortOption]);

  const paginatedBooks = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredBooks.slice(startIndex, startIndex + pageSize);
  }, [filteredBooks, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredBooks.length / pageSize) || 1;

  return (
    <MainLayout>
      <div className="container-fluid px-3 px-md-5 py-4 bg-white">

        {/* Breadcrumbs */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb bg-transparent p-0 m-0 font-size-2">
            <li className="breadcrumb-item">
              <Link href="/" className="text-gray-600 hover-text-primary text-decoration-none">Home</Link>
            </li>
            <li className="breadcrumb-item active text-dark font-weight-medium" aria-current="page">
              Shop
            </li>
          </ol>
        </nav>

        <div className="row">

          {/* Left Sidebar Filter Section */}
          <aside className="col-lg-3 pr-lg-4 mb-5 mb-lg-0">
            <div className="border-bottom pb-3 mb-4 d-flex justify-content-between align-items-center">
              <h5 className="font-weight-bold mb-0" style={{ fontSize: "20px" }}>Filters</h5>
              <button
                onClick={resetFilters}
                className="btn btn-link text-primary font-size-1 p-0 border-0 text-decoration-none"
                style={{ color: "#f75454" }}
              >
                Clear All
              </button>
            </div>

            {/* Categories filter — DB-driven */}
            <div className="widget mb-4 border-bottom pb-4">
              <h6 className="widget-title font-weight-bold mb-3 d-flex justify-content-between align-items-center" style={{ fontSize: "16px" }}>
                Categories
                <span className="text-gray-500 font-weight-normal font-size-3">-</span>
              </h6>
              <div>
                <ul className="list-unstyled mb-0 font-size-2 text-gray-700">
                  <li className="mb-2">
                    <button
                      onClick={() => { setSelectedCategory(null); setCurrentPage(1); }}
                      className={`btn btn-link p-0 text-left border-0 text-decoration-none ${!selectedCategory ? "text-primary font-weight-bold" : "text-gray-700"}`}
                      style={{ color: !selectedCategory ? "#f75454" : undefined }}
                    >
                      All Categories
                    </button>
                  </li>
                  {categoriesList.map((cat) => (
                    <li key={cat.id} className="mb-2">
                      <button
                        onClick={() => { setSelectedCategory(cat.name); setCurrentPage(1); }}
                        className={`btn btn-link p-0 text-left border-0 text-decoration-none ${selectedCategory === cat.name ? "text-primary font-weight-bold" : "text-gray-700"}`}
                        style={{ color: selectedCategory === cat.name ? "#f75454" : undefined }}
                      >
                        {cat.name}
                        {cat.booksCount !== undefined && (
                          <span className="text-gray-500 font-size-1 ml-1">({cat.booksCount})</span>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Author filter — DB-driven */}
            <div className="widget mb-4 border-bottom pb-4">
              <h6 className="widget-title font-weight-bold mb-3 d-flex justify-content-between align-items-center" style={{ fontSize: "16px" }}>
                Author
                <span className="text-gray-500 font-weight-normal font-size-3">-</span>
              </h6>
              <div style={{ maxHeight: "380px", overflowY: "auto", paddingRight: "5px" }}>
                {authorsList.map((author) => (
                  <div key={author.id} className="custom-control custom-checkbox mb-2 font-size-2">
                    <input
                      type="checkbox"
                      className="custom-control-input"
                      id={`author-${String(author.id)}`}
                      checked={selectedAuthors.includes(author.name)}
                      onChange={() => handleAuthorToggle(author.name)}
                    />
                    <label
                      className="custom-control-label d-flex justify-content-between align-items-center text-gray-700 pointer"
                      htmlFor={`author-${String(author.id)}`}
                      style={{ cursor: "pointer", width: "100%" }}
                    >
                      <span>{author.name}</span>
                      {author.booksCount !== undefined && (
                        <span className="text-gray-500 font-size-1 ml-2">({author.booksCount})</span>
                      )}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Format filter — derived from actual loaded books */}
            <div className="widget mb-4 border-bottom pb-4">
              <h6 className="widget-title font-weight-bold mb-3 d-flex justify-content-between align-items-center" style={{ fontSize: "16px" }}>
                Format
                <span className="text-gray-500 font-weight-normal font-size-3">-</span>
              </h6>
              {formatsList.map((format) => (
                <div key={format.name} className="custom-control custom-checkbox mb-2 font-size-2">
                  <input
                    type="checkbox"
                    className="custom-control-input"
                    id={`format-${format.name.replace(/\s+/g, "-")}`}
                    checked={selectedFormats.includes(format.name)}
                    onChange={() => handleFormatToggle(format.name)}
                  />
                  <label
                    className="custom-control-label d-flex justify-content-between align-items-center text-gray-700 pointer"
                    htmlFor={`format-${format.name.replace(/\s+/g, "-")}`}
                    style={{ cursor: "pointer", width: "100%" }}
                  >
                    <span>{format.name}</span>
                    <span className="text-gray-500 font-size-1 ml-2">({format.count})</span>
                  </label>
                </div>
              ))}
            </div>

            {/* Filter by Price */}
            <div className="widget mb-4 border-bottom pb-4">
              <h6 className="widget-title font-weight-bold mb-3 d-flex justify-content-between align-items-center" style={{ fontSize: "16px" }}>
                Filter by price
                <span className="text-gray-500 font-weight-normal font-size-3">-</span>
              </h6>
              <div className="price-slider-wrapper">
                <div className="d-flex justify-content-between gap-2 mb-2 font-size-2">
                  <div className="flex-grow-1">
                    <span className="text-gray-600">Min:</span>
                    <input
                      type="number"
                      className="form-control form-control-sm rounded-0"
                      min="0"
                      max="100"
                      value={tempMinPrice}
                      onChange={(e) => setTempMinPrice(Number(e.target.value))}
                    />
                  </div>
                  <div className="flex-grow-1">
                    <span className="text-gray-600">Max:</span>
                    <input
                      type="number"
                      className="form-control form-control-sm rounded-0"
                      min="0"
                      max="100"
                      value={tempMaxPrice}
                      onChange={(e) => setTempMaxPrice(Number(e.target.value))}
                    />
                  </div>
                </div>
                <div className="d-flex align-items-center justify-content-between mt-3">
                  <button
                    onClick={applyPriceFilter}
                    className="btn btn-sm rounded-0 px-3 py-1 font-size-2 text-uppercase font-weight-bold"
                    style={{ backgroundColor: "#f75454", color: "#ffffff", border: "none" }}
                  >
                    Filter
                  </button>
                  <span className="font-size-2 text-gray-700 font-weight-medium">
                    Price: ${minPrice} — ${maxPrice}
                  </span>
                </div>
              </div>
            </div>

            {/* Filter by Review — derived from actual book data */}
            <div className="widget mb-4 border-bottom pb-4">
              <h6 className="widget-title font-weight-bold mb-3 d-flex justify-content-between align-items-center" style={{ fontSize: "16px" }}>
                By Review
                <span className="text-gray-500 font-weight-normal font-size-3">-</span>
              </h6>
              {ratingsList.map((item) => (
                <div key={item.rating} className="custom-control custom-checkbox mb-2 font-size-2 d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    <input
                      type="checkbox"
                      className="custom-control-input"
                      id={`review-${item.rating}`}
                      checked={selectedRatings.includes(item.rating)}
                      onChange={() => handleRatingToggle(item.rating)}
                    />
                    <label
                      className="custom-control-label d-flex align-items-center text-gray-700 pointer mb-0 pl-1"
                      htmlFor={`review-${item.rating}`}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="rating-stars ml-2 d-inline-flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <i
                            key={i}
                            className="fa fa-star"
                            style={{ color: i < item.rating ? "#f8c114" : "#e5e5e5", marginRight: "2px", fontSize: "12px" }}
                          ></i>
                        ))}
                      </div>
                    </label>
                  </div>
                  <span className="text-gray-500 font-size-1 ml-2">({item.count})</span>
                </div>
              ))}
            </div>

            {/* Featured Books Widget — DB-driven */}
            <div className="widget d-none d-lg-block">
              <h6 className="widget-title font-weight-bold mb-3 d-flex justify-content-between align-items-center" style={{ fontSize: "16px" }}>
                Featured Books
                <span className="text-gray-500 font-weight-normal font-size-3">-</span>
              </h6>
              <div className="featured-books-list">
                {featuredSidebarBooks.map((book) => (
                  <div key={book.id} className="d-flex align-items-center mb-3">
                    <Link href={`/product?id=${book.id}`} className="d-block flex-shrink-0 mr-3" style={{ width: "50px", height: "70px" }}>
                      <img
                        src={book.imageUrl}
                        alt={book.title}
                        className="img-fluid h-100 w-100"
                        style={{ objectFit: "contain" }}
                      />
                    </Link>
                    <div>
                      <h6 className="font-size-2 font-weight-medium text-lh-md mb-1 crop-text-2">
                        <Link href={`/product?id=${book.id}`} className="text-dark h-dark text-decoration-none">{book.title}</Link>
                      </h6>
                      <div className="font-weight-bold text-dark font-size-2">
                        ${book.price.toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </aside>

          {/* Right Product Grid Column */}
          <main className="col-lg-9 pl-lg-4">

            {/* Catalog Top Filter Controls Bar */}
            <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between border-bottom pb-3 mb-4 gap-3">
              <div className="font-size-2 text-gray-700">
                Showing <span className="font-weight-medium">{(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, filteredBooks.length)}</span> of <span className="font-weight-medium">{filteredBooks.length}</span> results
              </div>

              <div className="d-flex align-items-center gap-3 flex-wrap">
                <div className="d-flex align-items-center">
                  <span className="font-size-2 text-gray-600 mr-2 whitespace-nowrap">Sort:</span>
                  <select
                    className="form-control form-control-sm rounded-0 border-gray-300 font-size-2"
                    style={{ width: "160px" }}
                    value={sortOption}
                    onChange={(e) => { setSortOption(e.target.value); setCurrentPage(1); }}
                  >
                    <option value="default">Default sorting</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating">Average Rating</option>
                    <option value="title">Alphabetical (A-Z)</option>
                  </select>
                </div>

                <div className="d-flex align-items-center">
                  <span className="font-size-2 text-gray-600 mr-2">Show:</span>
                  <select
                    className="form-control form-control-sm rounded-0 border-gray-300 font-size-2"
                    style={{ width: "90px" }}
                    value={pageSize}
                    onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
                  >
                    <option value={12}>Show 12</option>
                    <option value={20}>Show 20</option>
                    <option value={32}>Show 32</option>
                  </select>
                </div>

                <div className="d-flex align-items-center gap-2 border-left pl-3 ml-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`btn p-1 border-0 ${viewMode === "grid" ? "text-primary" : "text-gray-500"}`}
                    style={{ color: viewMode === "grid" ? "#f75454" : undefined }}
                    aria-label="Grid View"
                  >
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
                      <rect x="0" y="0" width="7" height="7" />
                      <rect x="11" y="0" width="7" height="7" />
                      <rect x="0" y="11" width="7" height="7" />
                      <rect x="11" y="11" width="7" height="7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`btn p-1 border-0 ${viewMode === "list" ? "text-primary" : "text-gray-500"}`}
                    style={{ color: viewMode === "list" ? "#f75454" : undefined }}
                    aria-label="List View"
                  >
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
                      <rect x="0" y="0" width="18" height="4" />
                      <rect x="0" y="7" width="18" height="4" />
                      <rect x="0" y="14" width="18" height="4" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Main Products Grid */}
            {paginatedBooks.length === 0 ? (
              <div className="text-center py-5 border rounded bg-light">
                <i className="fa fa-info-circle text-gray-500 font-size-8 mb-3"></i>
                <h5 className="font-weight-bold text-dark">No Books Found</h5>
                <p className="text-gray-600 mb-0 font-size-2">Try adjusting your filters or clearing them to find books.</p>
              </div>
            ) : viewMode === "grid" ? (
              <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 no-gutters border-left border-top product-grid-border">
                {paginatedBooks.map((book) => (
                  <div key={book.id} className="col border-right border-bottom p-0">
                    <ProductCard book={book} layout="grid" showBorder={false} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="list-view-container border rounded overflow-hidden">
                {paginatedBooks.map((book) => (
                  <div key={book.id} className="border-bottom p-0">
                    <ProductCard book={book} layout="card" showBorder={false} />
                  </div>
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <nav aria-label="Page navigation" className="mt-5">
                <ul className="pagination justify-content-center pagination-clean">
                  <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      className="page-link border-0 text-dark font-weight-medium"
                      disabled={currentPage === 1}
                    >
                      Prev
                    </button>
                  </li>
                  {Array.from({ length: totalPages }).map((_, i) => {
                    const pageNum = i + 1;
                    return (
                      <li key={pageNum} className={`page-item ${currentPage === pageNum ? "active" : ""}`}>
                        <button
                          onClick={() => setCurrentPage(pageNum)}
                          className={`page-link border-0 ${currentPage === pageNum ? "bg-dark text-white font-weight-bold" : "text-dark"}`}
                        >
                          {pageNum}
                        </button>
                      </li>
                    );
                  })}
                  <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      className="page-link border-0 text-dark font-weight-medium"
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            )}

          </main>

        </div>
      </div>
    </MainLayout>
  );
}

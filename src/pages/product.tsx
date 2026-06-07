import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";
import { MainLayout } from "@/components";
import { useCart } from "@/contexts/CartContext";
import { ProductCard } from "@/components/molecules/ProductCard/ProductCard";
import { fetchApi } from "@/utils/api";
import { fetchBooks } from "@/utils/storeApi";
import { sanitizeHtml } from "@/utils/sanitize";
import { Book } from "@/types";

export default function ProductPage() {
  const router = useRouter();
  const { id } = router.query;
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<"Description" | "ProductDetails" | "ProductVideos">("Description");

  const [book, setBook] = useState<Book | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Book[]>([]);
  const [sidebarFeaturedBooks, setSidebarFeaturedBooks] = useState<Book[]>([]);

  useEffect(() => {
    let active = true;
    fetchBooks("featured").then((books) => {
      if (active) setSidebarFeaturedBooks(books.slice(0, 3));
    });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!router.isReady) return;
    let active = true;
    const loadBook = async () => {
      try {
        const bookId = id || "shop1";
        const data = await fetchApi<Book>(`/api/books.php?id=${bookId}`);
        if (active) {
          setBook(data);
        }
      } catch (err) {
        console.error("Failed to load book:", err);
      }
    };
    loadBook();
    return () => { active = false; };
  }, [id, router.isReady]);

  useEffect(() => {
    if (!book) return;
    let active = true;
    const loadRelated = async () => {
      try {
        const data = await fetchApi<Book[]>("/api/books.php");
        if (active) {
          const filtered = data
            .filter((b) => b.id !== book.id && b.category === book.category)
            .slice(0, 4);
          setRelatedProducts(filtered);
        }
      } catch (err) {
        console.error("Failed to load related products:", err);
      }
    };
    loadRelated();
    return () => { active = false; };
  }, [book]);

  const handleQtyChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  const handleAddToCart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!book) return;
    addToCart({
      id: book.id,
      name: book.title,
      author: book.author,
      price: book.price,
      image: book.imageUrl,
      quantity
    });
    alert(`Added ${quantity} of "${book.title}" to your cart.`);
  };

  // sidebarFeaturedBooks is now fetched from the DB above

  if (!book) {
    return (
      <MainLayout>
        <div className="container py-5 text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container-fluid px-3 px-md-5 py-4 bg-white">
        
        {/* Breadcrumbs matching the screenshot format */}
        <nav aria-label="breadcrumb" className="mb-5">
          <ol className="breadcrumb bg-transparent p-0 m-0 font-size-2">
            <li className="breadcrumb-item">
              <Link href="/" className="text-gray-600 hover-text-primary text-decoration-none">Home</Link>
            </li>
            <li className="breadcrumb-item">
              <Link href="/shop" className="text-gray-600 hover-text-primary text-decoration-none">{book.category}</Link>
            </li>
            <li className="breadcrumb-item active text-dark font-weight-medium" aria-current="page">
              {book.title}
            </li>
          </ol>
        </nav>

        {/* Main Product Columns */}
        <div className="row mb-8">
          
          {/* Left Column: Product Cover */}
          <div className="col-md-4 mb-4 mb-md-0 d-flex flex-column align-items-center">
            <div className="border p-4 bg-white d-flex align-items-center justify-content-center" style={{ minHeight: "450px", width: "100%" }}>
              <img 
                src={book.imageUrl} 
                alt={book.title} 
                className="img-fluid"
                style={{ maxHeight: "400px", objectFit: "contain" }}
              />
            </div>
            {/* Zoom Gallery Indicator Dot */}
            <div className="mt-3 text-center text-gray-500 font-size-2 cursor-pointer">
              <i className="fa fa-expand mr-2"></i>
              <span>Zoom</span>
            </div>
          </div>

          {/* Middle Column: Details Info */}
          <div className="col-md-5 px-md-4 mb-4 mb-md-0">
            <h1 className="font-weight-bold text-dark mb-2" style={{ fontSize: "28px", lineHeight: "1.2" }}>
              {book.title}
            </h1>
            
            <div className="font-size-2 mb-3 text-gray-600">
              By (author): <span className="text-primary font-weight-medium">{book.author}</span>
            </div>

            <div className="font-size-5 font-weight-bold text-dark mb-4">
              {book.priceRange ? book.priceRange : `$${book.price.toFixed(2)}`}
            </div>

            <div className="font-size-2 text-gray-700 mb-5" style={{ lineHeight: "1.6" }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Excepteur sint occaecat.
            </div>

            {/* Cart Form */}
            <form onSubmit={handleAddToCart} className="d-flex align-items-center mb-4 flex-wrap gap-3">
              {/* Quantity Box */}
              <div className="border d-inline-flex align-items-center bg-white" style={{ height: "48px" }}>
                <button
                  type="button"
                  className="btn btn-link text-dark font-weight-bold p-3 text-decoration-none border-0"
                  onClick={() => handleQtyChange(-1)}
                >
                  -
                </button>
                <span className="font-weight-medium font-size-2 px-3">{quantity}</span>
                <button
                  type="button"
                  className="btn btn-link text-dark font-weight-bold p-3 text-decoration-none border-0"
                  onClick={() => handleQtyChange(1)}
                >
                  +
                </button>
              </div>

              {/* Add to Cart button */}
              <button
                type="submit"
                className="btn btn-dark rounded-0 px-5 text-uppercase font-weight-bold font-size-2"
                style={{ height: "48px", backgroundColor: "#1e1e1e", border: "none" }}
              >
                Add to cart
              </button>
            </form>

            {/* Wishlist Link */}
            <div className="mb-4">
              <a 
                href="#" 
                className="text-gray-600 font-size-2 hover-text-primary text-decoration-none"
                onClick={(e) => { e.preventDefault(); alert("Added to wishlist!"); }}
              >
                <i className="fa fa-heart-o mr-2"></i> Add to wishlist
              </a>
            </div>
          </div>

          {/* Right Column: Sidebar Widget */}
          <div className="col-md-3">
            <div className="border p-4 bg-white">
              <div className="featured-books-list">
                {sidebarFeaturedBooks.map((sbBook) => (
                  <div key={sbBook.id} className="d-flex align-items-center mb-4">
                    <Link href={`/product?id=${sbBook.id}`} className="d-block flex-shrink-0 mr-3" style={{ width: "50px", height: "70px" }}>
                      <img 
                        src={sbBook.imageUrl} 
                        alt={sbBook.title} 
                        className="img-fluid h-100 w-100" 
                        style={{ objectFit: "contain" }}
                      />
                    </Link>
                    <div>
                      <h6 className="font-size-2 font-weight-medium text-lh-md mb-1 crop-text-2">
                        <Link href={`/product?id=${sbBook.id}`} className="text-dark h-dark text-decoration-none">{sbBook.title}</Link>
                      </h6>
                      <div className="font-weight-bold text-dark font-size-2">
                        ${sbBook.price.toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Horizontal Divider Line */}
        <hr className="my-5" />

        {/* Tab Selection Stacked Vertically */}
        <div className="row justify-content-center mb-6">
          <div className="col-md-8 text-center">
            <div className="d-flex flex-column align-items-center gap-3 mb-5">
              <button
                onClick={() => setActiveTab("Description")}
                className={`btn btn-link p-0 text-decoration-none ${activeTab === "Description" ? "text-dark font-weight-bold" : "text-gray-500 font-weight-normal"}`}
                style={{ fontSize: "16px", outline: "none", boxShadow: "none" }}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab("ProductDetails")}
                className={`btn btn-link p-0 text-decoration-none ${activeTab === "ProductDetails" ? "text-dark font-weight-bold" : "text-gray-500 font-weight-normal"}`}
                style={{ fontSize: "16px", outline: "none", boxShadow: "none" }}
              >
                Product Details
              </button>
              <button
                onClick={() => setActiveTab("ProductVideos")}
                className={`btn btn-link p-0 text-decoration-none ${activeTab === "ProductVideos" ? "text-dark font-weight-bold" : "text-gray-500 font-weight-normal"}`}
                style={{ fontSize: "16px", outline: "none", boxShadow: "none" }}
              >
                Videos
              </button>
            </div>

            {/* Tab Panel Content */}
            <div className="text-left font-size-2 text-gray-700" style={{ lineHeight: "1.8" }}>
                            {activeTab === "Description" && (
                <div>
                  {book.description ? (
                    <div
                      className="book-description"
                      dangerouslySetInnerHTML={{
                        __html: sanitizeHtml(book.description),
                      }}
                    />
                  ) : (
                    <p className="mb-0 text-gray-500 italic">No description available for this book.</p>
                  )}
                </div>
              )}

              {activeTab === "ProductDetails" && (
                <div className="table-responsive">
                  <table className="table table-hover table-borderless">
                    <tbody>
                      <tr>
                        <th className="pl-0" style={{ width: "200px" }}>Format:</th>
                        <td>{book.format}</td>
                      </tr>
                      <tr>
                        <th className="pl-0">Publication Date:</th>
                        <td>20 Dec 2020</td>
                      </tr>
                      <tr>
                        <th className="pl-0">Publisher:</th>
                        <td>Little, Brown Book Group</td>
                      </tr>
                      <tr>
                        <th className="pl-0">Language:</th>
                        <td>English</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === "ProductVideos" && (
                <div className="py-3">
                  <p className="mb-0">No videos available for this product.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Horizontal Divider Line */}
        <hr className="my-5" />

        {/* Related Products Section */}
        <section className="mb-5">
          <h3 className="font-weight-bold text-dark mb-4" style={{ fontSize: "22px" }}>Related products</h3>
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-4 g-4">
            {relatedProducts.map((relBook) => (
              <div key={relBook.id} className="col">
                <ProductCard book={relBook} layout="grid" showBorder={true} />
              </div>
            ))}
          </div>
        </section>

      </div>
    </MainLayout>
  );
}

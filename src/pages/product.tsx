import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { MainLayout } from "@/components";
import { useCart } from "@/contexts/CartContext";
import { shopBooks } from "@/data/mockData";
import { ProductCard } from "@/components/molecules/ProductCard/ProductCard";

export default function ProductPage() {
  const router = useRouter();
  const { id } = router.query;
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<"Description" | "ProductDetails" | "ProductVideos">("Description");

  // Dynamic book fetch based on query parameter 'id'
  const book = useMemo(() => {
    if (!id) return shopBooks[0]; // Fallback to first book ("All You Can Ever Know: A Memoir")
    return shopBooks.find((b) => b.id === id) || shopBooks[0];
  }, [id]);

  const handleQtyChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  const handleAddToCart = (e: React.FormEvent) => {
    e.preventDefault();
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

  // Sidebar books shown in the screenshot
  const sidebarFeaturedBooks = [
    {
      id: "featured-1",
      title: "Blindside (Michael Bennett Book 12)",
      price: 15.99,
      imageUrl: "https://bookworm.madrasthemes.com/wp-content/uploads/2020/08/img1-17.png"
    },
    {
      id: "featured-2",
      title: "Until the End of Time: Mind, Matter, and Our...",
      price: 12.99,
      imageUrl: "https://bookworm.madrasthemes.com/wp-content/uploads/2020/08/img1-12.png"
    },
    {
      id: "featured-3",
      title: "Open Book: A Memoir",
      price: 10.35,
      imageUrl: "https://bookworm.madrasthemes.com/wp-content/uploads/2020/08/img1-19.png"
    }
  ];

  // Related products based on category matching
  const relatedProducts = useMemo(() => {
    return shopBooks
      .filter((b) => b.id !== book.id && b.category === book.category)
      .slice(0, 4); // Display up to 4 related products
  }, [book]);

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
                  <p className="mb-3">We aim to show you accurate product information. Manufacturers, suppliers and others provide what you see here, and we have not verified it. See our disclaimer</p>
                  <p className="mb-1 font-weight-medium">#1 New York Times Bestseller</p>
                  <p className="mb-3 font-weight-medium">A Reese Witherspoon x Hello Sunshine Book Club Pick</p>
                  
                  <p className="mb-3 italic font-weight-medium">“I can’t even express how much I love this book! I didn’t want this story to end!”--Reese Witherspoon</p>
                  <p className="mb-3 italic font-weight-medium">“Painfully beautiful.”--The New York Times Book Review</p>
                  <p className="mb-4 italic font-weight-medium">“Perfect for fans of Barbara Kingsolver.”--Bustle</p>

                  <p className="mb-3">For years, rumors of the &quot;Marsh Girl&quot; have haunted Barkley Cove, a quiet town on the North Carolina coast. So in late 1969, when handsome Chase Andrews is found dead, the locals immediately suspect Kya Clark, the so-called Marsh Girl. But Kya is not what they say. Sensitive and intelligent, she has survived for years alone in the marsh that she calls home, finding friends in the gulls and lessons in the sand. Then the time comes when she yearns to be touched and loved. When two young men from town become intrigued by her wild beauty, Kya opens herself to a new life--until the unthinkable happens.</p>
                  <p className="mb-3">Perfect for fans of Barbara Kingsolver and Karen Russell, Where the Crawdads Sing is at once an exquisite ode to the natural world, a heartbreaking coming-of-age story, and a surprising tale of possible murder. Owens reminds us that we are forever shaped by the children we once were, and that we are all subject to the beautiful and violent secrets that nature keeps</p>
                  <p className="font-weight-medium">WHERE THE CRAWDADS LP</p>
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
            {relatedProducts.length > 0 ? (
              relatedProducts.map((relBook) => (
                <div key={relBook.id} className="col">
                  <ProductCard book={relBook} layout="grid" showBorder={true} />
                </div>
              ))
            ) : (
              shopBooks.slice(5, 9).map((relBook) => (
                <div key={relBook.id} className="col">
                  <ProductCard book={relBook} layout="grid" showBorder={true} />
                </div>
              ))
            )}
          </div>
        </section>

      </div>
    </MainLayout>
  );
}

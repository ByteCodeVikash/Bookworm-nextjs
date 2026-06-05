import React, { useState, useEffect } from "react";
import { ProductCardProps } from "./types";
import { Badge, Icon } from "@/components/atoms";
import { useCart } from "@/contexts/CartContext";

export const ProductCard: React.FC<ProductCardProps> = ({ book, layout = "grid", showBorder = true }) => {
  const { addToCart } = useCart();
  const [imgSrc, setImgSrc] = useState(book.imageUrl);

  useEffect(() => {
    setImgSrc(book.imageUrl);
  }, [book.imageUrl]);

  const handleImgError = () => {
    setImgSrc(`https://placehold.co/120x180/f8f9fa/161619?text=${encodeURIComponent(book.title)}`);
  };

  if (layout === "card") {
    return (
      <div className={`product product__card h-100 ${showBorder ? "border-right" : "border-0"}`}>
        <div className="media p-3 p-md-4d875 h-100 d-flex align-items-center">
          <a href={`/product?id=${book.id}`} className="d-block mr-4 flex-shrink-0" style={{ width: "120px", height: "183px" }}>
            <img
              src={imgSrc}
              onError={handleImgError}
              alt={book.title}
              width="120"
              height="183"
              className="img-fluid h-100 w-100"
              style={{ objectFit: "contain" }}
            />
          </a>
          <div className="media-body">
            <Badge text={book.format} />
            <h2 className="woocommerce-loop-product__title h6 text-lh-md mb-1 text-height-2 crop-text-2 h-dark">
              <a href={`/product?id=${book.id}`}>{book.title}</a>
            </h2>
            <div className="font-size-2 mb-1 text-truncate">
              <a href="#" className="text-gray-700">{book.author}</a>
            </div>
            {book.rating !== undefined && (
              <div className="rating-stars mb-2" style={{ fontSize: "11px" }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <i
                    key={i}
                    className="fa fa-star"
                    style={{ color: i < book.rating! ? "#f8c114" : "#e5e5e5", marginRight: "2px" }}
                  ></i>
                ))}
              </div>
            )}
            <div className="price d-flex align-items-center font-weight-medium font-size-3">
              {book.priceRange ? (
                <span className="woocommerce-Price-amount amount">
                  {book.priceRange}
                </span>
              ) : (
                <>
                  <span className="woocommerce-Price-amount amount">
                    <span className="woocommerce-Price-currencySymbol">$</span>
                    {book.price.toFixed(2)}
                  </span>
                  {book.originalPrice && (
                    <del className="ml-2 font-size-1 text-gray-500 font-weight-normal">
                      ${book.originalPrice.toFixed(2)}
                    </del>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`product h-100 ${showBorder ? "border" : ""}`}>
      <div className="product__inner p-3 p-md-4d875 h-100">
        <div className="woocommerce-LoopProduct-link woocommerce-loop-product__link d-flex flex-column h-100 justify-content-between">
          <div>
            <div
              className="woocommerce-loop-product__thumbnail d-flex align-items-center justify-content-center mb-3 bg-white"
              style={{ height: "180px", width: "100%", overflow: "hidden" }}
            >
              <a href={`/product?id=${book.id}`} className="d-block">
                <img
                  src={imgSrc}
                  onError={handleImgError}
                  className="img-fluid d-block mx-auto attachment-shop_catalog size-shop_catalog wp-post-image"
                  alt={book.title}
                  style={{ maxHeight: "180px", maxWidth: "120px", objectFit: "contain" }}
                />
              </a>
            </div>
            <div className="woocommerce-loop-product__body product__body pt-1 bg-white">
              <Badge text={book.format} />
              <h2
                className="woocommerce-loop-product__title product__title h6 text-lh-md mb-1 text-height-2 crop-text-2 h-dark"
                style={{ minHeight: "44px" }}
              >
                <a href={`/product?id=${book.id}`}>{book.title}</a>
              </h2>
              <div className="font-size-2 mb-1 text-truncate">
                <a href="#" className="text-gray-700">{book.author}</a>
              </div>
              {book.rating !== undefined && (
                <div className="rating-stars mb-2" style={{ fontSize: "11px" }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <i
                      key={i}
                      className="fa fa-star"
                      style={{ color: i < book.rating! ? "#f8c114" : "#e5e5e5", marginRight: "2px" }}
                    ></i>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mt-2">
            <div className="price d-flex align-items-center font-weight-medium font-size-3 mb-3">
              {book.priceRange ? (
                <span className="woocommerce-Price-amount amount">
                  {book.priceRange}
                </span>
              ) : (
                <>
                  <span className="woocommerce-Price-amount amount">
                    <span className="woocommerce-Price-currencySymbol">$</span>
                    {book.price.toFixed(2)}
                  </span>
                  {book.originalPrice && (
                    <del className="ml-2 font-size-1 text-gray-500 font-weight-normal">
                      ${book.originalPrice.toFixed(2)}
                    </del>
                  )}
                </>
              )}
            </div>

            <div className="product__hover d-flex align-items-center">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  addToCart({
                    id: book.id,
                    name: book.title,
                    author: book.author,
                    price: book.price,
                    image: book.imageUrl
                  });
                  alert(`"${book.title}" has been added to your cart.`);
                }}
                className="text-uppercase text-dark h-dark font-weight-medium mr-auto d-flex align-items-center"
              >
                <span className="product__add-to-cart mr-2">ADD TO CART</span>
                <span className="product__add-to-cart-icon font-size-4">
                  <Icon name="flaticon-icon-126515" />
                </span>
              </a>
              <a href="#" className="mr-1 h-p-bg btn btn-outline-primary border-0 p-2">
                <Icon name="flaticon-switch" />
              </a>
              <a href="#" className="h-p-bg btn btn-outline-primary border-0 p-2">
                <Icon name="flaticon-heart" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

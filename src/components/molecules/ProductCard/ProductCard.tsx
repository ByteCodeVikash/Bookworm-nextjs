import React from "react";
import { ProductCardProps } from "./types";
import { Badge, Icon } from "@/components/atoms";
import { useCart } from "@/contexts/CartContext";

export const ProductCard: React.FC<ProductCardProps> = ({ book, layout = "grid" }) => {
  const { addToCart } = useCart();

  if (layout === "card") {
    return (
      <div className="product product__card border-right h-100">
        <div className="media p-3 p-md-4d875 h-100 d-flex align-items-center">
          <a href="/product" className="d-block mr-4">
            <img
              src={book.imageUrl}
              alt={book.title}
              width="120"
              height="183"
              className="img-fluid"
            />
          </a>
          <div className="media-body">
            <Badge text={book.format} />
            <h2 className="woocommerce-loop-product__title h6 text-lh-md mb-1 text-height-2 crop-text-2 h-dark">
              <a href="/product">{book.title}</a>
            </h2>
            <div className="font-size-2 mb-1 text-truncate">
              <a href="#" className="text-gray-700">{book.author}</a>
            </div>
            <div className="price d-flex align-items-center font-weight-medium font-size-3">
              <span className="woocommerce-Price-amount amount">
                <span className="woocommerce-Price-currencySymbol">$</span>
                {book.price}
              </span>
              {book.originalPrice && (
                <del className="ml-2 font-size-1 text-gray-500 font-weight-normal">
                  ${book.originalPrice}
                </del>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="product h-100 border">
      <div className="product__inner overflow-hidden p-3 p-md-4d875 h-100 d-flex flex-col justify-content-between">
        <div className="woocommerce-LoopProduct-link woocommerce-loop-product__link d-block position-relative">
          <div className="woocommerce-loop-product__thumbnail">
            <a href="/product" className="d-block">
              <img
                src={book.imageUrl}
                className="img-fluid d-block mx-auto attachment-shop_catalog size-shop_catalog wp-post-image"
                alt={book.title}
                width="120"
                height="180"
              />
            </a>
          </div>
          <div className="woocommerce-loop-product__body product__body pt-3 bg-white">
            <Badge text={book.format} />
            <h2 className="woocommerce-loop-product__title product__title h6 text-lh-md mb-1 text-height-2 crop-text-2 h-dark">
              <a href="/product">{book.title}</a>
            </h2>
            <div className="font-size-2 mb-1 text-truncate">
              <a href="#" className="text-gray-700">{book.author}</a>
            </div>
            <div className="price d-flex align-items-center font-weight-medium font-size-3">
              <span className="woocommerce-Price-amount amount">
                <span className="woocommerce-Price-currencySymbol">$</span>
                {book.price}
              </span>
              {book.originalPrice && (
                <del className="ml-2 font-size-1 text-gray-500 font-weight-normal">
                  ${book.originalPrice}
                </del>
              )}
            </div>
          </div>
          <div className="product__hover d-flex align-items-center mt-3">
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
  );
};
export default ProductCard;

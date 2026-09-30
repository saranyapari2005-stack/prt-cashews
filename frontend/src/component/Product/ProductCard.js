import React from "react";
import "./ProductCard.css";
import { Link } from "react-router-dom";

const Rating = ({ ratings }) => {
  const stars = [1, 2, 3, 4, 5];
  return (
    <div className="rating-stars">
      {stars.map((s) => (
        <i key={s} className={s <= Math.round(ratings) ? "fa fa-star filled" : "fa fa-star"}></i>
      ))}
    </div>
  );
};

const ProductCard = ({ product }) => {
  const hasVariants = product.variants && product.variants.length > 0;
  return (
    <Link to={`/product/${product._id}`} className="product-card">
      <img
        src={product.images?.[0]?.url || "https://res.cloudinary.com/demo/image/upload/v1/sample.jpg"}
        alt={product.name}
      />
      <p className="product-card-name">{product.name}</p>
      <div className="product-card-rating">
        <Rating ratings={product.ratings} />
        <span>({product.numOfReviews} Reviews)</span>
      </div>
      <span className="product-card-price">{hasVariants ? "From " : ""}₹{product.price}</span>
    </Link>
  );
};

export default ProductCard;
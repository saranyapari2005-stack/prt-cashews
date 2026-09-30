import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getProductDetails, newReview, clearErrors } from "../../actions/productAction";
import { addItemsToCart } from "../../actions/cartAction";
import { toast } from "react-toastify";
import Loader from "../layout/Loader/Loader";
import "./ProductDetails.css";
import { NEW_REVIEW_RESET } from "../../constants/actionTypes";

const Rating = ({ ratings, size = "normal" }) => {
  const stars = [1, 2, 3, 4, 5];
  return (
    <div className={`rating-stars ${size}`}>
      {stars.map((s) => (
        <i key={s} className={s <= Math.round(ratings) ? "fa fa-star filled" : "fa fa-star"}></i>
      ))}
    </div>
  );
};

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { product, loading, error } = useSelector((state) => state.productDetails);
  const { success, error: reviewError } = useSelector((state) => state.newReview);
  const { isAuthenticated } = useSelector((state) => state.user);

  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [selectedVariant, setSelectedVariant] = useState(null);

  const hasVariants = product.variants && product.variants.length > 0;
  const activeVariant = hasVariants ? selectedVariant || product.variants[0] : null;
  const activePrice = hasVariants ? activeVariant.price : product.price;
  const activeStock = hasVariants ? activeVariant.stock : product.stock;

  const increaseQty = () => {
    if (quantity >= activeStock) return;
    setQuantity(quantity + 1);
  };

  const decreaseQty = () => {
    if (quantity <= 1) return;
    setQuantity(quantity - 1);
  };

  const selectVariant = (variant) => {
    setSelectedVariant(variant);
    setQuantity(1);
  };

  const addToCartHandler = () => {
    dispatch(addItemsToCart(id, quantity, activeVariant));
    toast.success("Added to cart");
  };

  const reviewSubmitHandler = () => {
    if (!isAuthenticated) {
      toast.error("Please login to submit a review");
      return;
    }
    if (rating === 0 || !comment.trim()) {
      toast.error("Please provide a rating and comment");
      return;
    }
    dispatch(newReview({ rating, comment, productId: id }));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    if (reviewError) {
      toast.error(reviewError);
      dispatch(clearErrors());
    }
    if (success) {
      toast.success("Review submitted successfully");
      dispatch({ type: NEW_REVIEW_RESET });
      setRating(0);
      setComment("");
    }
    dispatch(getProductDetails(id));
  }, [dispatch, id, error, reviewError, success]);

  if (loading || !product || !product._id) return <Loader />;

  return (
    <>
      <div className="product-details">
        <div className="product-details-images">
          <img
            src={product.images?.[0]?.url || "https://res.cloudinary.com/demo/image/upload/v1/sample.jpg"}
            alt={product.name}
          />
        </div>

        <div className="product-details-info">
          <h2>{product.name}</h2>
          <p className="product-details-id">Product # {product._id}</p>

          <div className="product-details-rating">
            <Rating ratings={product.ratings} />
            <span>({product.numOfReviews} Reviews)</span>
          </div>

          <div className="product-details-price">₹{activePrice}</div>

          {hasVariants && (
            <div className="variant-selector">
              <span className="variant-label">Select weight:</span>
              <div className="variant-options">
                {product.variants.map((v) => (
                  <button
                    key={v.label}
                    type="button"
                    className={`variant-btn ${activeVariant.label === v.label ? "active" : ""}`}
                    disabled={v.stock < 1}
                    onClick={() => selectVariant(v)}
                  >
                    {v.label} {v.stock < 1 ? "(out of stock)" : `- ₹${v.price}`}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="product-details-cart">
            <div className="qty-control">
              <button onClick={decreaseQty}>-</button>
              <span>{quantity}</span>
              <button onClick={increaseQty}>+</button>
            </div>
            <button className="add-to-cart-btn" disabled={activeStock < 1} onClick={addToCartHandler}>
              Add to Cart
            </button>
          </div>

          <p className="product-details-stock">
            Status:{" "}
            <span className={activeStock < 1 ? "out-of-stock" : "in-stock"}>
              {activeStock < 1 ? "Out of Stock" : "In Stock"}
            </span>
          </p>

          <p className="product-details-description">{product.description}</p>
        </div>
      </div>

      <div className="review-section">
        <h3>Write a Review</h3>
        <div className="review-form">
          <div className="review-rating-input">
            {[1, 2, 3, 4, 5].map((s) => (
              <i key={s} className={s <= rating ? "fa fa-star filled" : "fa fa-star"} onClick={() => setRating(s)}></i>
            ))}
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your thoughts about this product..."
          ></textarea>
          <button onClick={reviewSubmitHandler}>Submit Review</button>
        </div>

        <h3>All Reviews</h3>
        <div className="reviews-list">
          {product.reviews && product.reviews.length > 0 ? (
            product.reviews.map((review) => (
              <div className="review-card" key={review._id}>
                <Rating ratings={review.rating} size="small" />
                <p className="review-name">{review.name}</p>
                <p className="review-comment">{review.comment}</p>
              </div>
            ))
          ) : (
            <p>No Reviews Yet</p>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductDetails;
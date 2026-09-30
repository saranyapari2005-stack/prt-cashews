import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllReviews, deleteReview, clearErrors } from "../../actions/productAction";
import { toast } from "react-toastify";
import Loader from "../layout/Loader/Loader";
import Sidebar from "./Sidebar";
import "./Admin.css";
import { DELETE_REVIEW_RESET } from "../../constants/actionTypes";

const ProductReviews = () => {
  const dispatch = useDispatch();
  const [productId, setProductId] = useState("");

  const { reviews, loading, error } = useSelector((state) => state.productReviews);
  const { isDeleted, error: deleteError } = useSelector((state) => state.productReviews);

  const submitHandler = (e) => {
    e.preventDefault();
    if (productId.trim()) {
      dispatch(getAllReviews(productId));
    }
  };

  const deleteHandler = (reviewId) => {
    if (window.confirm("Delete this review?")) {
      dispatch(deleteReview(reviewId, productId));
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    if (isDeleted) {
      toast.success("Review deleted successfully");
      dispatch({ type: DELETE_REVIEW_RESET });
      if (productId) dispatch(getAllReviews(productId));
    }
  }, [dispatch, error, isDeleted, productId]);

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-content">
        <h2>Product Reviews</h2>

        <form className="admin-form" onSubmit={submitHandler} style={{ marginBottom: "1.5rem" }}>
          <input
            type="text"
            placeholder="Paste Product ID here"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
          />
          <button type="submit">Fetch Reviews</button>
        </form>

        {loading ? (
          <Loader />
        ) : reviews && reviews.length > 0 ? (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Reviewer</th>
                  <th>Rating</th>
                  <th>Comment</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((review) => (
                  <tr key={review._id}>
                    <td>{review.name}</td>
                    <td>{review.rating} / 5</td>
                    <td>{review.comment}</td>
                    <td>
                      <button className="delete-icon" onClick={() => deleteHandler(review._id)}>
                        <i className="fa fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>Enter a product ID above to view its reviews.</p>
        )}
      </div>
    </div>
  );
};

export default ProductReviews;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";
import { getProduct, clearErrors } from "../../actions/productAction";
import { toast } from "react-toastify";
import Loader from "../layout/Loader/Loader";
import ProductCard from "./ProductCard";
import "./Products.css";
import { categories } from "../../constants/categories";

// Filtering by price is disabled; this wide fixed range is passed to the
// backend so the price filter never excludes anything.
const FULL_PRICE_RANGE = [0, 10000000];

const Products = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const keyword = params.keyword;

  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "";

  const [category, setCategory] = useState(initialCategory);
  const [ratings, setRatings] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const { loading, error, products, productCount, resultsPerPage, totpages } = useSelector(
    (state) => state.products
  );

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    dispatch(getProduct(keyword, currentPage, FULL_PRICE_RANGE, category, ratings));
  }, [dispatch, keyword, currentPage, category, ratings, error]);

  const pageNumbers = [];
  for (let i = 1; i <= (totpages || 1); i++) pageNumbers.push(i);

  return (
    <div className="products-page">
      <aside className="products-filters">
        <h3>Filters</h3>

        <div className="filter-block">
          <label>Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="filter-block">
          <label>Minimum Rating: {ratings}</label>
          <input type="range" min={0} max={5} step={1} value={ratings} onChange={(e) => setRatings(Number(e.target.value))} />
        </div>
      </aside>

      <main className="products-main">
        {loading ? (
          <Loader />
        ) : (
          <>
            <h2>
              {keyword ? `Results for "${keyword}"` : category ? category : "All Products"}{" "}
              <span className="products-count">({productCount || 0})</span>
            </h2>

            <div className="products-grid">
              {products && products.map((product) => <ProductCard key={product._id} product={product} />)}
              {products && products.length === 0 && <p>No products matched your filters.</p>}
            </div>

            {resultsPerPage < productCount && (
              <div className="pagination">
                {pageNumbers.map((num) => (
                  <button key={num} className={num === currentPage ? "active" : ""} onClick={() => setCurrentPage(num)}>
                    {num}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Products;
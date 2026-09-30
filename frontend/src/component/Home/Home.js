import React, { useEffect } from "react";
import "./Home.css";
import { useDispatch, useSelector } from "react-redux";
import { getProduct, clearErrors } from "../../actions/productAction";
import { toast } from "react-toastify";
import Loader from "../layout/Loader/Loader";
import ProductCard from "../Product/ProductCard";
import { Link, useNavigate } from "react-router-dom";
import { categories } from "../../constants/categories";

// One emoji per category, just for a bit of visual variety on the tiles.
const categoryIcons = {
  "Nuts": "🥜",
  "Dry Fruits": "🍇",
  "Dates": "🌴",
  "Seeds": "🌱",
  "Spices": "🌶️",
  "Oils & Ghee": "🫙",
  "Grains & Salts": "🌾",
  "Candy & Mittai": "🍬",
  "Trail Mix": "🥣",
  "Gift Packs": "🎁",
};

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, products } = useSelector((state) => state.products);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    dispatch(getProduct());
  }, [dispatch, error]);

  const goToCategory = (cat) => {
    navigate(`/products?category=${encodeURIComponent(cat)}`);
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="home-banner">
            <h1>Premium Dry Fruits & Nuts</h1>
            <p>Handpicked. Naturally fresh. Delivered to your door.</p>
            <Link to="/products" className="home-banner-btn">Shop Now</Link>
          </div>

          <h2 className="home-heading">Our Categories</h2>
          <div className="category-grid">
            {categories.map((cat) => (
              <button key={cat} className="category-tile" onClick={() => goToCategory(cat)}>
                <span className="category-tile-icon">{categoryIcons[cat] || "🛒"}</span>
                <span className="category-tile-label">{cat}</span>
              </button>
            ))}
          </div>

          <h2 className="home-heading">Our Bestsellers</h2>

          <div className="home-products">
            {products && products.map((product) => <ProductCard key={product._id} product={product} />)}
            {products && products.length === 0 && <p>No products found.</p>}
          </div>
        </>
      )}
    </>
  );
};

export default Home;
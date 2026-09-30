import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getAdminProducts, deleteProduct, clearErrors } from "../../actions/productAction";
import { toast } from "react-toastify";
import Loader from "../layout/Loader/Loader";
import Sidebar from "./Sidebar";
import "./Admin.css";
import { DELETE_PRODUCT_RESET } from "../../constants/actionTypes";

const ProductList = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const { isDeleted, error: deleteError } = useSelector((state) => state.product);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    if (deleteError) {
      toast.error(deleteError);
      dispatch(clearErrors());
    }
    if (isDeleted) {
      toast.success("Product deleted successfully");
      dispatch({ type: DELETE_PRODUCT_RESET });
    }
    dispatch(getAdminProducts());
  }, [dispatch, error, deleteError, isDeleted]);

  const deleteHandler = (id) => {
    if (window.confirm("Delete this product?")) {
      dispatch(deleteProduct(id));
    }
  };

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-content">
        <div className="admin-page-header">
          <h2>Products ({products?.length || 0})</h2>
          <Link to="/admin/product/new" className="admin-btn">+ New Product</Link>
        </div>

        {loading ? (
          <Loader />
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Category</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products &&
                  products.map((product) => (
                    <tr key={product._id}>
                      <td><img src={product.images?.[0]?.url} alt={product.name} /></td>
                      <td>{product.name}</td>
                      <td>₹{product.price}</td>
                      <td style={{ color: product.stock === 0 ? "#c0392b" : "inherit" }}>{product.stock}</td>
                      <td>{product.category}</td>
                      <td>
                        <div className="admin-actions">
                          <Link to={`/admin/product/${product._id}`} className="edit-icon">
                            <i className="fa fa-pen"></i>
                          </Link>
                          <button className="delete-icon" onClick={() => deleteHandler(product._id)}>
                            <i className="fa fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;

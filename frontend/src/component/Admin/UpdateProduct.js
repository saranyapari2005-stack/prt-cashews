import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getProductDetails, updateProduct, clearErrors } from "../../actions/productAction";
import { toast } from "react-toastify";
import Sidebar from "./Sidebar";
import "./Admin.css";
import { UPDATE_PRODUCT_RESET } from "../../constants/actionTypes";
import { categories } from "../../constants/categories";


const UpdateProduct = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { product } = useSelector((state) => state.productDetails);
  const { loading, error, isUpdated } = useSelector((state) => state.product);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [images, setImages] = useState([]);
  const [oldImages, setOldImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);

  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");

  const [hasVariants, setHasVariants] = useState(false);
  const [variants, setVariants] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!product || product._id !== id) {
      dispatch(getProductDetails(id));
      return;
    }

    if (!loaded) {
      setName(product.name);
      setDescription(product.description);
      setCategory(product.category);
      setOldImages(product.images || []);

      if (product.variants && product.variants.length > 0) {
        setHasVariants(true);
        setVariants(product.variants.map((v) => ({ label: v.label, price: v.price, stock: v.stock })));
      } else {
        setHasVariants(false);
        setPrice(product.price);
        setStock(product.stock);
      }
      setLoaded(true);
    }
  }, [dispatch, id, product, loaded]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    if (isUpdated) {
      toast.success("Product updated successfully - changes are live now");
      dispatch({ type: UPDATE_PRODUCT_RESET });
      navigate("/admin/products");
    }
  }, [dispatch, error, isUpdated, navigate]);

  const onImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setImages([]);
    setImagesPreview([]);
    setOldImages([]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagesPreview((old) => [...old, reader.result]);
          setImages((old) => [...old, reader.result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const updateVariant = (index, field, value) => {
    setVariants((old) => old.map((v, i) => (i === index ? { ...v, [field]: value } : v)));
  };

  const addVariantRow = () => {
    setVariants((old) => [...old, { label: "", price: "", stock: "" }]);
  };

  const removeVariantRow = (index) => {
    setVariants((old) => old.filter((_, i) => i !== index));
  };

  const submitHandler = (e) => {
    e.preventDefault();

    let payload;

    if (hasVariants) {
      const cleanVariants = variants.filter((v) => v.label && v.price !== "" && v.stock !== "");

      if (cleanVariants.length === 0) {
        toast.error("Add at least one variant with a label, price and stock");
        return;
      }

      const prices = cleanVariants.map((v) => Number(v.price));
      const totalStock = cleanVariants.reduce((sum, v) => sum + Number(v.stock), 0);

      payload = {
        name,
        description,
        category,
        variants: cleanVariants,
        price: Math.min(...prices),
        stock: totalStock,
      };
    } else {
      payload = { name, description, category, price, stock, variants: [] };
    }

    if (images.length > 0) payload.images = images;
    dispatch(updateProduct(id, payload));
  };

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-content">
        <h2>Update Product</h2>
        <p style={{ color: "#888", fontSize: "0.85rem", marginTop: "-0.5rem" }}>
          Change prices below and click Save — updates go live instantly, no redeploy needed.
        </p>
        <form className="admin-form" onSubmit={submitHandler}>
          <input type="text" placeholder="Product Name" required value={name} onChange={(e) => setName(e.target.value)} />
          <textarea placeholder="Description" required value={description} onChange={(e) => setDescription(e.target.value)} />
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.9rem" }}>
            <input
              type="checkbox"
              checked={hasVariants}
              onChange={(e) => setHasVariants(e.target.checked)}
              style={{ width: "auto" }}
            />
            This product is sold in multiple weights (e.g. 250g / 500g / 1kg)
          </label>

          {!hasVariants ? (
            <>
              <input type="number" placeholder="Price (₹)" required value={price} onChange={(e) => setPrice(e.target.value)} />
              <input type="number" placeholder="Stock" required value={stock} onChange={(e) => setStock(e.target.value)} />
            </>
          ) : (
            <div>
              {variants.map((v, i) => (
                <div key={i} style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
                  <input
                    type="text"
                    placeholder="Weight (e.g. 250g)"
                    value={v.label}
                    onChange={(e) => updateVariant(i, "label", e.target.value)}
                    style={{ flex: 1 }}
                  />
                  <input
                    type="number"
                    placeholder="Price ₹"
                    value={v.price}
                    onChange={(e) => updateVariant(i, "price", e.target.value)}
                    style={{ flex: 1 }}
                  />
                  <input
                    type="number"
                    placeholder="Stock"
                    value={v.stock}
                    onChange={(e) => updateVariant(i, "stock", e.target.value)}
                    style={{ flex: 1 }}
                  />
                  <button type="button" onClick={() => removeVariantRow(i)} style={{ background: "none", border: "none", color: "#c0392b", cursor: "pointer" }}>
                    <i className="fa fa-trash"></i>
                  </button>
                </div>
              ))}
              <button type="button" className="admin-btn" onClick={addVariantRow} style={{ marginBottom: "0.5rem" }}>
                + Add another weight
              </button>
            </div>
          )}

          <div className="admin-image-preview">
            {oldImages.map((img, i) => <img key={i} src={img.url} alt="current" />)}
          </div>

          <label style={{ fontSize: "0.85rem", color: "#666" }}>
            Only choose new images if you want to replace the current photos:
          </label>
          <input type="file" multiple accept="image/*" onChange={onImagesChange} />
          <div className="admin-image-preview">
            {imagesPreview.map((img, i) => <img key={i} src={img} alt="preview" />)}
          </div>

          <button type="submit" disabled={loading}>Save Changes</button>
        </form>
      </div>
    </div>
  );
};

export default UpdateProduct;
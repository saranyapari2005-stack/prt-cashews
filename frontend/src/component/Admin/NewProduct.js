import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createProduct, clearErrors } from "../../actions/productAction";
import { toast } from "react-toastify";
import Sidebar from "./Sidebar";
import "./Admin.css";
import { NEW_PRODUCT_RESET } from "../../constants/actionTypes";
import { categories } from "../../constants/categories";



const NewProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, success } = useSelector((state) => state.newProduct);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);

  // Simple mode: one price + one stock (e.g. a single-size item)
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");

  // Variant mode: multiple weights, each with its own price + stock
  const [hasVariants, setHasVariants] = useState(false);
  const [variants, setVariants] = useState([
    { label: "250g", price: "", stock: "" },
    { label: "500g", price: "", stock: "" },
    { label: "1kg", price: "", stock: "" },
  ]);

  const onImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setImages([]);
    setImagesPreview([]);

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
        images,
        variants: cleanVariants,
        price: Math.min(...prices), // shown on product cards as the "from" price
        stock: totalStock,
      };
    } else {
      payload = { name, description, category, images, price, stock, variants: [] };
    }

    dispatch(createProduct(payload));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    if (success) {
      toast.success("Product created successfully");
      dispatch({ type: NEW_PRODUCT_RESET });
      navigate("/admin/products");
    }
  }, [dispatch, error, success, navigate]);

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-content">
        <h2>New Product</h2>
        <form className="admin-form" onSubmit={submitHandler}>
          <input type="text" placeholder="Product Name (e.g. Badam / Almonds)" required value={name} onChange={(e) => setName(e.target.value)} />
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

          <input type="file" multiple accept="image/*" onChange={onImagesChange} />
          <div className="admin-image-preview">
            {imagesPreview.map((img, i) => <img key={i} src={img} alt="preview" />)}
          </div>
          <button type="submit" disabled={loading}>Create Product</button>
        </form>
      </div>
    </div>
  );
};

export default NewProduct; 
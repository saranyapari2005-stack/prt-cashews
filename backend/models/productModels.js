import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please enter product name"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "please enter product description"],
  },
  price: {
    type: Number,
    required: [true, "please enter product price"],
    max: [9999999, "price cannot exceed 7 digit"],
  },
  ratings: {
    type: Number,
    default: 0,
  },
  images: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  category: {
    type: String,
    required: [true, "please enter product category"],
  },
  stock: {
    type: Number,
    required: [true, "Please enter product stock"],
    default: 1,
    max: [9999, "stock cannot exceed 4 digits"],
  },
  // Optional weight-based pricing, e.g. Badam sold as 250g / 500g / 1kg.
  // Leave this array empty for products that only ever sell as one unit.
  // When variants exist, the top-level price/stock above act as the
  // "starting from" price and total stock across all variants.
  variants: [
    {
      label: { type: String, required: true }, // e.g. "250g", "500g", "1kg"
      price: { type: Number, required: true },
      stock: { type: Number, required: true, default: 0 },
    },
  ],
  numOfReviews: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      name: { type: String, required: true },
      rating: { type: Number, required: true },
      comment: { type: String, required: true },
    },
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

productSchema.methods.updateStock = async function (quantity) {
  this.stock -= quantity;
  await this.save({ validateBeforeSave: false });
};

export default mongoose.model("Product", productSchema);
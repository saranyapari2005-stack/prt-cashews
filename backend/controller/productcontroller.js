import Product from "../models/productModels.js";
import errorHandler from "../helper/handleError.js";
import APIhelper from "../helper/APIhelper.js";
import { catchAsyncErrors } from "../middleware/catchAsyncError.js";
import cloudinary from "../config/cloudinary.js";

export const addProducts = catchAsyncErrors(async (req, res, next) => {
  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else if (Array.isArray(req.body.images)) {
    images = req.body.images;
  }

  const imagesLinks = [];

  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.uploader.upload(images[i], {
      folder: "products",
    });

    imagesLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }

  req.body.images = imagesLinks;
  req.body.user = req.user.id;

  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    product,
  });
});

export const updateProduct = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let product = await Product.findById(id);

  if (!product) {
    return next(new errorHandler("Product not found", 404));
  }

  if (req.body.images !== undefined) {
    let images = [];

    if (typeof req.body.images === "string") {
      images.push(req.body.images);
    } else {
      images = req.body.images;
    }

    for (let i = 0; i < product.images.length; i++) {
      await cloudinary.uploader.destroy(product.images[i].public_id);
    }

    const imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.uploader.upload(images[i], {
        folder: "products",
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    req.body.images = imagesLinks;
  }

  product = await Product.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    product,
  });
});

export const deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  const product = await Product.findById(id);

  if (!product) {
    return next(new errorHandler("Product not found", 404));
  }

  for (let i = 0; i < product.images.length; i++) {
    await cloudinary.uploader.destroy(product.images[i].public_id);
  }

  await product.deleteOne();

  res.status(200).json({
    success: true,
    message: "product deleted successfully",
  });
});

export const getAllProducts = catchAsyncErrors(async (req, res, next) => {
  const resultsPerPage = 8;
  const apiHelper = new APIhelper(Product.find(), req.query).search().filter();

  const filteredQuery = apiHelper.query.clone();
  const productCount = await filteredQuery.countDocuments();
  const totpages = Math.ceil(productCount / resultsPerPage);
  const page = Number(req.query.page) || 1;

  if (totpages > 0 && page > totpages) {
    return next(new errorHandler("This page doesn't exist", 404));
  }

  apiHelper.pagination(resultsPerPage);
  const products = await apiHelper.query;

  res.status(200).json({
    success: true,
    products,
    productCount,
    resultsPerPage,
    totpages,
    currentPage: page,
  });
});

export const getAdminProducts = catchAsyncErrors(async (req, res, next) => {
  const products = await Product.find();

  res.status(200).json({
    success: true,
    products,
  });
});

export const getSingleProduct = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  const product = await Product.findById(id);

  if (!product) {
    return next(new errorHandler("Product not found", 404));
  }

  return res.status(200).json({ success: true, product });
});

export const createProductReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId);

  if (!product) {
    return next(new errorHandler("Product not found", 404));
  }

  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString()) {
        rev.rating = rating;
        rev.comment = comment;
      }
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  product.ratings =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});

export const getProductReviews = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.id);

  if (!product) {
    return next(new errorHandler("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

export const deleteReview = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);

  if (!product) {
    return next(new errorHandler("Product not found", 404));
  }

  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );

  const numOfReviews = reviews.length;

  const ratings =
    numOfReviews === 0
      ? 0
      : reviews.reduce((acc, item) => item.rating + acc, 0) / numOfReviews;

  await Product.findByIdAndUpdate(
    req.query.productId,
    { reviews, ratings, numOfReviews },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
  });
});

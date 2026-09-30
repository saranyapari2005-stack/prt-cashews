import axiosInstance from "../utils/axiosInstance";
import {
  ALL_PRODUCT_REQUEST,
  ALL_PRODUCT_SUCCESS,
  ALL_PRODUCT_FAIL,
  ADMIN_PRODUCT_REQUEST,
  ADMIN_PRODUCT_SUCCESS,
  ADMIN_PRODUCT_FAIL,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_DETAILS_FAIL,
  NEW_PRODUCT_REQUEST,
  NEW_PRODUCT_SUCCESS,
  NEW_PRODUCT_FAIL,
  DELETE_PRODUCT_REQUEST,
  DELETE_PRODUCT_SUCCESS,
  DELETE_PRODUCT_FAIL,
  UPDATE_PRODUCT_REQUEST,
  UPDATE_PRODUCT_SUCCESS,
  UPDATE_PRODUCT_FAIL,
  NEW_REVIEW_REQUEST,
  NEW_REVIEW_SUCCESS,
  NEW_REVIEW_FAIL,
  ALL_REVIEWS_REQUEST,
  ALL_REVIEWS_SUCCESS,
  ALL_REVIEWS_FAIL,
  DELETE_REVIEW_REQUEST,
  DELETE_REVIEW_SUCCESS,
  DELETE_REVIEW_FAIL,
  CLEAR_ERRORS,
} from "../constants/actionTypes";

export const getProduct =
  (keyword = "", currentPage = 1, price = [0, 200000], category, ratings = 0) =>
  async (dispatch) => {
    try {
      dispatch({ type: ALL_PRODUCT_REQUEST });

      let link = `/products?page=${currentPage}&price[gte]=${price[0]}&price[lte]=${price[1]}`;
      if (keyword) link += `&keyword=${keyword}`;
      if (category) link += `&category=${category}`;
      if (ratings > 0) link += `&ratings[gte]=${ratings}`;

      const { data } = await axiosInstance.get(link);

      dispatch({
        type: ALL_PRODUCT_SUCCESS,
        payload: {
          products: data.products,
          productCount: data.productCount,
          resultsPerPage: data.resultsPerPage,
          totpages: data.totpages,
          currentPage: data.currentPage,
        },
      });
    } catch (error) {
      dispatch({ type: ALL_PRODUCT_FAIL, payload: error.response?.data?.message || "Could not fetch products" });
    }
  };

export const getAdminProducts = () => async (dispatch) => {
  try {
    dispatch({ type: ADMIN_PRODUCT_REQUEST });
    const { data } = await axiosInstance.get("/admin/products");
    dispatch({ type: ADMIN_PRODUCT_SUCCESS, payload: data.products });
  } catch (error) {
    dispatch({ type: ADMIN_PRODUCT_FAIL, payload: error.response?.data?.message || "Could not fetch products" });
  }
};

export const getProductDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_DETAILS_REQUEST });
    const { data } = await axiosInstance.get(`/product/${id}`);
    dispatch({ type: PRODUCT_DETAILS_SUCCESS, payload: data.product });
  } catch (error) {
    dispatch({ type: PRODUCT_DETAILS_FAIL, payload: error.response?.data?.message || "Could not fetch product" });
  }
};

export const createProduct = (productData) => async (dispatch) => {
  try {
    dispatch({ type: NEW_PRODUCT_REQUEST });
    const config = { headers: { "Content-Type": "application/json" } };
    const { data } = await axiosInstance.post("/admin/product/new", productData, config);
    dispatch({ type: NEW_PRODUCT_SUCCESS, payload: { success: data.success, product: data.product } });
  } catch (error) {
    dispatch({ type: NEW_PRODUCT_FAIL, payload: error.response?.data?.message || "Could not create product" });
  }
};

export const deleteProduct = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_PRODUCT_REQUEST });
    const { data } = await axiosInstance.delete(`/admin/product/${id}`);
    dispatch({ type: DELETE_PRODUCT_SUCCESS, payload: data.message });
  } catch (error) {
    dispatch({ type: DELETE_PRODUCT_FAIL, payload: error.response?.data?.message || "Could not delete product" });
  }
};

export const updateProduct = (id, productData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_PRODUCT_REQUEST });
    const config = { headers: { "Content-Type": "application/json" } };
    const { data } = await axiosInstance.put(`/admin/product/${id}`, productData, config);
    dispatch({ type: UPDATE_PRODUCT_SUCCESS, payload: data.success });
  } catch (error) {
    dispatch({ type: UPDATE_PRODUCT_FAIL, payload: error.response?.data?.message || "Could not update product" });
  }
};

export const newReview = (reviewData) => async (dispatch) => {
  try {
    dispatch({ type: NEW_REVIEW_REQUEST });
    const config = { headers: { "Content-Type": "application/json" } };
    const { data } = await axiosInstance.put("/review", reviewData, config);
    dispatch({ type: NEW_REVIEW_SUCCESS, payload: data.success });
  } catch (error) {
    dispatch({ type: NEW_REVIEW_FAIL, payload: error.response?.data?.message || "Could not submit review" });
  }
};

export const getAllReviews = (id) => async (dispatch) => {
  try {
    dispatch({ type: ALL_REVIEWS_REQUEST });
    const { data } = await axiosInstance.get(`/reviews?id=${id}`);
    dispatch({ type: ALL_REVIEWS_SUCCESS, payload: data.reviews });
  } catch (error) {
    dispatch({ type: ALL_REVIEWS_FAIL, payload: error.response?.data?.message || "Could not fetch reviews" });
  }
};

export const deleteReview = (reviewId, productId) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_REVIEW_REQUEST });
    const { data } = await axiosInstance.delete(`/reviews?id=${reviewId}&productId=${productId}`);
    dispatch({ type: DELETE_REVIEW_SUCCESS, payload: data.success });
  } catch (error) {
    dispatch({ type: DELETE_REVIEW_FAIL, payload: error.response?.data?.message || "Could not delete review" });
  }
};

export const clearErrors = () => (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};

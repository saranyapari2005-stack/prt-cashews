import { legacy_createStore as createStore, combineReducers, applyMiddleware, compose } from "redux";
import { thunk } from "redux-thunk";

import {
  userReducer,
  profileReducer,
  allUsersReducer,
  userDetailsReducer,
  userUpdateReducer,
} from "./reducers/userReducer";
import {
  productsReducer,
  productDetailsReducer,
  newProductReducer,
  productReducer,
  newReviewReducer,
  productReviewsReducer,
} from "./reducers/productReducer";
import { cartReducer } from "./reducers/cartReducer";
import {
  newOrderReducer,
  myOrdersReducer,
  orderDetailsReducer,
  allOrdersReducer,
  orderReducer,
} from "./reducers/orderReducer";

const reducer = combineReducers({
  products: productsReducer,
  productDetails: productDetailsReducer,
  newProduct: newProductReducer,
  product: productReducer,
  newReview: newReviewReducer,
  productReviews: productReviewsReducer,
  user: userReducer,
  profile: profileReducer,
  allUsers: allUsersReducer,
  userDetails: userDetailsReducer,
  userUpdate: userUpdateReducer,
  cart: cartReducer,
  newOrder: newOrderReducer,
  myOrders: myOrdersReducer,
  orderDetails: orderDetailsReducer,
  allOrders: allOrdersReducer,
  order: orderReducer,
});

let initialState = {
  cart: {
    cartItems: localStorage.getItem("cartItems") ? JSON.parse(localStorage.getItem("cartItems")) : [],
    shippingInfo: localStorage.getItem("shippingInfo") ? JSON.parse(localStorage.getItem("shippingInfo")) : {},
  },
};

const windowIfDefined = typeof window === "undefined" ? null : window;
const composeEnhancers = (windowIfDefined && windowIfDefined.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

const store = createStore(reducer, initialState, composeEnhancers(applyMiddleware(thunk)));

export default store;

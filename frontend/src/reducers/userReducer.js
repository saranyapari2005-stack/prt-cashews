import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  REGISTER_USER_REQUEST,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_FAIL,
  LOAD_USER_REQUEST,
  LOAD_USER_SUCCESS,
  LOAD_USER_FAIL,
  LOGOUT_SUCCESS,
  LOGOUT_FAIL,
  CLEAR_ERRORS,
} from "../constants/actionTypes";

export const userReducer = (state = { user: {}, isAuthenticated: false }, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
    case REGISTER_USER_REQUEST:
    case LOAD_USER_REQUEST:
      return { ...state, loading: true, isAuthenticated: false };
    case LOGIN_SUCCESS:
    case REGISTER_USER_SUCCESS:
    case LOAD_USER_SUCCESS:
      return { ...state, loading: false, isAuthenticated: true, user: action.payload };
    case LOGOUT_SUCCESS:
      return { loading: false, user: {}, isAuthenticated: false };
    case LOGIN_FAIL:
    case REGISTER_USER_FAIL:
      return { ...state, loading: false, user: null, isAuthenticated: false, error: action.payload };
    case LOAD_USER_FAIL:
      return { loading: false, isAuthenticated: false, user: null };
    case LOGOUT_FAIL:
      return { ...state, error: action.payload };
    case CLEAR_ERRORS:
      return { ...state, error: null };
    default:
      return state;
  }
};

export const profileReducer = (state = {}, action) => {
  switch (action.type) {
    case "UPDATE_PROFILE_REQUEST":
    case "UPDATE_PASSWORD_REQUEST":
    case "FORGOT_PASSWORD_REQUEST":
    case "RESET_PASSWORD_REQUEST":
      return { ...state, loading: true };
    case "UPDATE_PROFILE_SUCCESS":
    case "UPDATE_PASSWORD_SUCCESS":
    case "RESET_PASSWORD_SUCCESS":
      return { ...state, loading: false, isUpdated: true };
    case "FORGOT_PASSWORD_SUCCESS":
      return { ...state, loading: false, message: action.payload };
    case "UPDATE_PROFILE_FAIL":
    case "UPDATE_PASSWORD_FAIL":
    case "FORGOT_PASSWORD_FAIL":
    case "RESET_PASSWORD_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "UPDATE_PROFILE_RESET":
    case "UPDATE_PASSWORD_RESET":
      return { ...state, isUpdated: false };
    case CLEAR_ERRORS:
      return { ...state, error: null };
    default:
      return state;
  }
};

export const allUsersReducer = (state = { users: [] }, action) => {
  switch (action.type) {
    case "ALL_USERS_REQUEST":
      return { ...state, loading: true };
    case "ALL_USERS_SUCCESS":
      return { loading: false, users: action.payload };
    case "ALL_USERS_FAIL":
      return { ...state, loading: false, error: action.payload };
    case CLEAR_ERRORS:
      return { ...state, error: null };
    default:
      return state;
  }
};

export const userDetailsReducer = (state = { user: {} }, action) => {
  switch (action.type) {
    case "USER_DETAILS_REQUEST":
      return { ...state, loading: true };
    case "USER_DETAILS_SUCCESS":
      return { loading: false, user: action.payload };
    case "USER_DETAILS_FAIL":
      return { ...state, loading: false, error: action.payload };
    case CLEAR_ERRORS:
      return { ...state, error: null };
    default:
      return state;
  }
};

export const userUpdateReducer = (state = {}, action) => {
  switch (action.type) {
    case "UPDATE_USER_REQUEST":
    case "DELETE_USER_REQUEST":
      return { ...state, loading: true };
    case "UPDATE_USER_SUCCESS":
      return { ...state, loading: false, isUpdated: true };
    case "DELETE_USER_SUCCESS":
      return { ...state, loading: false, isDeleted: true, message: action.payload };
    case "UPDATE_USER_FAIL":
    case "DELETE_USER_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "UPDATE_USER_RESET":
      return { ...state, isUpdated: false };
    case "DELETE_USER_RESET":
      return { ...state, isDeleted: false };
    case CLEAR_ERRORS:
      return { ...state, error: null };
    default:
      return state;
  }
};

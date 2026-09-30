import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import errorHandler from "../helper/handleError.js";
import { catchAsyncErrors } from "./catchAsyncError.js";

export const isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new errorHandler("Please login to access this resource", 401));
  }

  const decodedData = jwt.verify(token, process.env.JWT_SECRET_KEY);

  req.user = await User.findById(decodedData.id);

  if (!req.user) {
    return next(new errorHandler("User not found, please login again", 401));
  }

  next();
});

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new errorHandler(
          `Role: ${req.user.role} is not allowed to access this resource`,
          403
        )
      );
    }
    next();
  };
};

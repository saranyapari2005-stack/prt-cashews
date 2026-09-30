export default (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "internal server error";

  if (err.name === "CastError") {
    err.message = `Resource not found. Invalid: ${err.path}`;
    err.statusCode = 400;
  }

  if (err.code === 11000) {
    err.message = `Duplicate ${Object.keys(err.keyValue)} entered`;
    err.statusCode = 400;
  }

  if (err.name === "JsonWebTokenError") {
    err.message = "Json Web Token is invalid, try again";
    err.statusCode = 400;
  }

  if (err.name === "TokenExpiredError") {
    err.message = "Json Web Token is expired, try again";
    err.statusCode = 400;
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};

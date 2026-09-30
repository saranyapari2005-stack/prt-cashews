import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import product from "./routes/productRoutes.js";
import user from "./routes/userRoutes.js";
import order from "./routes/orderRoutes.js";
import errorHandler from "./middleware/error.js";

const app = express();

app.use(
  cors({
    origin:"http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

app.use("/api/v1", product);
app.use("/api/v1", user);
app.use("/api/v1", order);

app.use(errorHandler);

export default app;

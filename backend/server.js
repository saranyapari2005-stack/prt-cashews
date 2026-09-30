import app from "./app.js";
import dotenv from "dotenv";
import { connect_db } from "./config/db.js";
import { connectCloudinary } from "./config/cloudinary.js";

dotenv.config({ path: "backend/config/config.env" });

process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("server is shutting down due to uncaught exception");
  process.exit(1);
});

const PORT = process.env.PORT || 3000;

connect_db();
connectCloudinary();

const server = app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});

process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("server is shutting down due to unhandled promise rejection");
  server.close(() => {
    process.exit(1);
  });
});

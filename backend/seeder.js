// Bulk product importer for the Dry Fruits & Nuts store.
//
// HOW TO USE:
// 1. Edit backend/data/products.csv with your catalog (columns below).
// 2. Make sure MongoDB is running and config.env is filled in.
// 3. Run:  npm run seed
//
// CSV columns required: name,description,price,category,stock,imageUrl
// - imageUrl can be any public image link (e.g. from Cloudinary, or a temporary
//   placeholder) - it will be re-uploaded to your Cloudinary account automatically.
// - This does NOT delete existing products; it only adds new ones.
// - IMPORTANT: this is a simple comma-split parser, so do NOT use commas inside
//   the name or description fields (use a dash or "and" instead). If you need
//   real commas in descriptions, open this file and swap in a proper CSV
//   library like "csv-parse" instead.

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Product from "./models/productModels.js";
import User from "./models/userModel.js";
import cloudinary from "./config/cloudinary.js";
import { connectCloudinary } from "./config/cloudinary.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: "backend/config/config.env" });

const csvPath = path.join(__dirname, "data", "products.csv");

function parseCSV(content) {
  const lines = content.trim().split("\n");
  const headers = lines[0].split(",").map((h) => h.trim());
  return lines.slice(1).map((line) => {
    const values = line.split(",").map((v) => v.trim());
    const row = {};
    headers.forEach((h, i) => {
      row[h] = values[i];
    });
    return row;
  });
}

async function run() {
  if (!fs.existsSync(csvPath)) {
    console.log(`No CSV found at ${csvPath}`);
    console.log("Create backend/data/products.csv with columns:");
    console.log("name,description,price,category,stock,imageUrl");
    process.exit(1);
  }

  await mongoose.connect(process.env.DB_URL);
  connectCloudinary();

  const adminUser = await User.findOne({ role: "admin" });
  if (!adminUser) {
    console.log(
      "No admin user found. Register a user first, then set role: 'admin' on it in MongoDB, and re-run this script."
    );
    process.exit(1);
  }

  const rows = parseCSV(fs.readFileSync(csvPath, "utf-8"));
  console.log(`Found ${rows.length} products in CSV. Importing...`);

  for (const row of rows) {
    let imageData = [
      {
        public_id: "placeholder",
        url: "https://res.cloudinary.com/demo/image/upload/v1/sample.jpg",
      },
    ];

    if (row.imageUrl) {
      try {
        const uploaded = await cloudinary.uploader.upload(row.imageUrl, {
          folder: "products",
        });
        imageData = [{ public_id: uploaded.public_id, url: uploaded.secure_url }];
      } catch (e) {
        console.log(`  Could not upload image for ${row.name}, using placeholder`);
      }
    }

    await Product.create({
      name: row.name,
      description: row.description,
      price: Number(row.price),
      category: row.category,
      stock: Number(row.stock) || 0,
      images: imageData,
      user: adminUser._id,
    });

    console.log(`  Added: ${row.name}`);
  }

  console.log("Import complete.");
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

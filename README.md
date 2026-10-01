# PRT-Cashews — Dry Fruits & Nuts E-commerce

Full MERN stack storefront: browse/search/filter products, cart, WhatsApp-based
checkout, product reviews, order history, and a full admin dashboard.

## Structure

```
backend/     Node + Express + MongoDB API
frontend/    React + Redux storefront and admin panel
```

## 1. Setup

### Backend
```
cd backend    # or run from repo root, see package.json scripts
npm install
```
Edit `backend/config/config.env`:
- `DB_URL` — your MongoDB connection string (local or MongoDB Atlas)
- `JWT_SECRET_KEY` — any random long string
- `CLOUDINARY_*` — free account at cloudinary.com, used for product/avatar images
- `SMTP_*` — only needed for "forgot password" emails (Gmail app password works)
- `FRONTEND_URL` — where your React app runs, e.g. http://localhost:3000

Run it:
```
npm run dev      # nodemon, auto-restarts on changes
# or
npm start        # plain node
```

### Frontend
```
cd frontend
npm install
cp .env.example .env
```
Edit `frontend/.env`:
- `REACT_APP_API_URL` — your backend URL + `/api/v1`
- `REACT_APP_WHATSAPP_NUMBER` — your WhatsApp Business number, digits only,
  country code first (e.g. `919876543210` for an Indian +91 number)

Run it:
```
npm start
```

## 2. How checkout works (WhatsApp, no payment gateway)

There's no Stripe/Razorpay integration. Instead:
1. Customer adds items to cart → fills in shipping details → reviews the order.
2. Clicking "Order via WhatsApp" opens WhatsApp with a pre-filled message
   containing the order items, total, and delivery address.
3. The order is also saved in your database (status: "Not Paid") so you have
   a record, but payment itself (UPI, bank transfer, or cash on delivery) is
   arranged manually with the customer over WhatsApp.
4. Once you're paid, mark the order status ("Processing" → "Shipped" →
   "Delivered") from Admin → Orders.

This is safe from a data-security standpoint (no card data ever touches your
site), but it does mean YOU are responsible for confirming payment before
shipping — there's no automated payment verification.

## 3. Updating product prices

Log in with an admin account → **Admin → Products** → click the pencil icon
next to any product → change the price field → **Save Changes**. It updates
in the database immediately; no code changes or redeployment required.

## 4. Making your first admin account

There's no built-in "make me admin" button (for security). Steps:
1. Register a normal account through the website.
2. Open your MongoDB database (MongoDB Compass, Atlas UI, or `mongosh`) and
   find that user in the `users` collection.
3. Change their `role` field from `"user"` to `"admin"`.
4. Log out and back in — the Admin Dashboard link will now appear.

## 5. Bulk-importing your product catalog

If you have a catalog as a spreadsheet:
1. Open `backend/data/products.csv` and replace the sample rows with your
   real products. Columns: `name,description,price,category,stock,imageUrl`
   (see the note in `backend/seeder.js` about avoiding commas inside a
   field, since this is a simple parser).
2. Make sure you already have at least one admin user (step 4 above).
3. Run: `npm run seed`

This uploads each product's image to Cloudinary and creates the product in
MongoDB automatically. A PDF catalog can't be imported directly — convert it
to a spreadsheet first, or add products one-by-one via Admin → New Product.

## 6. Deploying for free

| Piece | Free option |
|---|---|
| Database | MongoDB Atlas (free M0 cluster) |
| Backend hosting | Render or Railway free tier |
| Frontend hosting | Vercel or Netlify free tier |
| Images | Cloudinary free tier |

Notes:
- Free backend tiers usually "sleep" after inactivity — first request after
  a while can take a few seconds to wake up.
- You'll get a subdomain (e.g. `yourapp.vercel.app`) for free; a custom
  domain costs ~₹700–1000/year separately.
- Remember to update `FRONTEND_URL` (backend) and `REACT_APP_API_URL`
  (frontend) to your deployed URLs, not localhost, once you deploy.

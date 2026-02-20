# GVR Cashew - Premium E-commerce Website

A full-stack e-commerce web application for selling premium cashews. Built with a React (Vite) frontend and a Node.js (Express) backend.

## Features
- **Modern & Premium User Interface**: A fully responsive, aesthetically pleasing interface utilizing modern React features and Tailwind CSS for smooth cross-device compatibility. Incorporates visual feedback elements like Canvas-Confetti on successful actions.
- **Comprehensive Product Catalog**: Dynamic product listings on the homepage that are seamlessly fetched from the backend. Designed to display premium cashew varieties, sizes, and rich product details.
- **Seamless Shopping Cart & Checkout**: A robust cart allowing users to manage quantities effortlessly. The checkout flow includes advanced features like saving multiple shipping and billing addresses to the user's local profile and a unified order review before payment.
- **Secure Payment Gateway**: Complete Razorpay integration for safe and secure e-commerce transactions. Order IDs are generated securely in the Node.js backend.
- **Dynamic Discount Coupons**: Advanced built-in coupon application logic. Users can apply various types of discount codes, including Percentage off, Flat amount discounts, or constraints-based coupons (e.g., Minimum Order Value required) directly at checkout.
- **Plug-and-play File-based "Database"**: For an easy local development, testing, and demo experience, the backend relies on purely localized JSON file storage (`orders.json`, `products.json`, `coupons.json`), completely negating the need for complex external database setups like MongoDB or PostgreSQL while maintaining typical REST API patterns.

## Technologies Used
- **Frontend**: React, Vite, JavaScript (JSX), CSS, Canvas-Confetti
- **Backend**: Node.js, Express, Body-Parser, Cors, Razorpay Node SDK

---

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) installed
- (Optional) A [Razorpay](https://razorpay.com/) test account for payments

### 1. Setup the Backend
The backend runs on Express and uses local JSON files to store data for simplicity.

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install the backend dependencies:
   ```bash
   npm install
   ```
3. Start the backend server (it will run on `http://localhost:5000`):
   ```bash
   npm start
   ```

### 2. Setup the Frontend
The frontend is a React application powered by Vite.

1. Open a new terminal and navigate to the project root directory:
   ```bash
   cd GVR-Cashew-Website-main
   ```
2. Install the frontend dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Once the server starts, it will provide a localhost URL (usually `http://localhost:5173`). Open this URL in your browser.

---

## Razorpay Configuration (Optional)
The backend uses Razorpay test keys by default. To use your own test keys, update the initialization in `backend/server.js`:

```javascript
const razorpay = new Razorpay({
    key_id: 'YOUR_TEST_KEY_ID',
    key_secret: 'YOUR_TEST_KEY_SECRET'
});
```

## Folder Structure
```
GVR-Cashew-Website-main/
├── backend/
│   ├── server.js        # Express server, API routes, and Razorpay endpoints
│   ├── package.json     # Backend dependencies
│   ├── orders.json      # Local storage for placed orders
│   ├── products.json    # Local storage for products
│   └── coupons.json     # Local storage for discount coupons
├── components/          # React frontend components (Checkout, Payment, etc.)
├── index.html           # Main entry point for the frontend
├── App.jsx              # Main React App component
├── package.json         # Frontend dependencies
└── vite.config.ts       # Vite configuration
```

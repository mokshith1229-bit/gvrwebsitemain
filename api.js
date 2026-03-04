// ============================================================
// api.js — Central API Configuration for GVR Cashew Website
// ============================================================
// Change BASE_URL here and every fetch in the project updates.
// For local development: "http://localhost:5000"
// For production: replace with your deployed backend URL.

export const BASE_URL = "http://localhost:5000";

// ── API Endpoints ────────────────────────────────────────────
// All endpoints are built from BASE_URL so nothing is hardcoded
// elsewhere in the project.

/** GET /products — fetch all products */
export const PRODUCTS_URL = `${BASE_URL}/products`;

/** GET /users — fetch all users */
export const USERS_URL = `${BASE_URL}/users`;

/** POST /orders — create a new order */
export const ORDERS_URL = `${BASE_URL}/orders`;

/** POST /payment/create-payment — initiate Razorpay payment order */
export const CREATE_PAYMENT_URL = `${BASE_URL}/payment/create-payment`;

/** POST /coupons/validate — validate a coupon code */
export const COUPONS_VALIDATE_URL = `${BASE_URL}/coupons/validate`;

/** POST /calculate-shipping — calculate shipping costs */
export const SHIPPING_CALCULATE_URL = `${BASE_URL}/calculate-shipping`;

// ── Helper: build image URL ──────────────────────────────────
// Backend sometimes returns relative paths like "/uploads/img.jpg".
// This helper converts them to absolute URLs automatically.
export const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith("http")) return imagePath;  // already an absolute URL
    if (imagePath.startsWith("data:")) return imagePath; // base64 data URL — return as-is
    const cleanPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
    return `${BASE_URL}${cleanPath}`;
};


// ── Generic fetch wrapper ────────────────────────────────────
// A simple helper so you don't repeat headers / JSON.stringify
// everywhere. Returns { data, error }.
// Usage: const { data, error } = await apiPost(ORDERS_URL, orderData);

export const apiGet = async (url) => {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Server error: ${response.status}`);
        const data = await response.json();
        return { data, error: null };
    } catch (err) {
        console.error(`GET ${url} failed:`, err.message);
        return { data: null, error: err.message };
    }
};

export const apiPost = async (url, body) => {
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
        const data = await response.json();
        return { data, ok: response.ok, error: response.ok ? null : (data.message || "Request failed") };
    } catch (err) {
        console.error(`POST ${url} failed:`, err.message);
        return { data: null, ok: false, error: err.message };
    }
};

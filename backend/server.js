import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Razorpay from 'razorpay';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// Razorpay Initialization (Using test keys for demonstration)
const razorpay = new Razorpay({
    key_id: 'rzp_test_SCODRISGhZ2J6p', // Replace with your test/live key
    key_secret: 'j3q0OtALM9unTgDgZidxcI1L'     // Replace with your test/live secret
});

const ORDERS_FILE = path.join(__dirname, 'orders.json');
const PRODUCTS_FILE = path.join(__dirname, 'products.json');
const COUPONS_FILE = path.join(__dirname, 'coupons.json');

// Ensure data files exist
[ORDERS_FILE, PRODUCTS_FILE, COUPONS_FILE].forEach(file => {
    if (!fs.existsSync(file)) {
        fs.writeFileSync(file, JSON.stringify([], null, 2));
    }
});

// GET /products
app.get('/products', (req, res) => {
    const data = JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf8'));
    res.json(data);
});

// GET /orders
app.get('/orders', (req, res) => {
    const data = JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf8'));
    res.json(data);
});

// POST /orders
app.post('/orders', (req, res) => {
    const newOrder = {
        ...req.body,
        id: Date.now().toString(),
        orderDate: new Date().toISOString()
    };

    const orders = JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf8'));
    orders.push(newOrder);
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));

    console.log('Order saved successfully. ID:', newOrder.id);
    res.status(201).json(newOrder);
});

// POST /create-payment (Razorpay Order Creation)
app.post('/create-payment', async (req, res) => {
    const { totalAmount } = req.body;

    const options = {
        amount: Math.round(totalAmount * 100), // amount in the smallest currency unit (paise)
        currency: "INR",
        receipt: `receipt_${Date.now()}`
    };

    try {
        const order = await razorpay.orders.create(options);
        res.json({
            id: order.id,
            currency: order.currency,
            amount: order.amount
        });
    } catch (error) {
        console.error("Razorpay Error:", error);
        res.status(500).json({ message: "Failed to create Razorpay order" });
    }
});

// GET /coupons
app.get('/coupons', (req, res) => {
    const data = JSON.parse(fs.readFileSync(COUPONS_FILE, 'utf8'));
    res.json(data);
});

// POST /coupons/validate
app.post('/coupons/validate', (req, res) => {
    const { code, orderValue } = req.body;
    const coupons = JSON.parse(fs.readFileSync(COUPONS_FILE, 'utf8'));

    const coupon = coupons.find(c => c.code.toUpperCase() === code.toUpperCase());

    if (!coupon) {
        return res.status(404).json({ message: 'Coupon not found' });
    }

    if (orderValue < coupon.minOrder) {
        return res.status(400).json({
            message: `Order value must be at least ₹${coupon.minOrder} to use this coupon`
        });
    }

    let discountAmount = 0;
    if (coupon.type === 'percentage') {
        discountAmount = (orderValue * coupon.value) / 100;
    } else if (coupon.type === 'flat') {
        discountAmount = coupon.value;
    }

    res.json({
        couponCode: coupon.code,
        discountValue: coupon.value,
        couponType: coupon.type,
        maxDiscount: coupon.maxDiscount || 0,
        message: 'Coupon applied successfully!'
    });
});

app.listen(PORT, () => {
    console.log(`Backend Server running on http://localhost:${PORT}`);
});

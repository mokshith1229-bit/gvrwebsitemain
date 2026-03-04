// ============================================================
// store/slices/cartSlice.js — Shopping Cart State
// ============================================================
// Manages: cart items array
// Actions: addToCart, removeFromCart, updateQuantity, clearCart

import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: [], // each item: { id, name, price, image, quantity, ... }
    },
    reducers: {
        /**
         * addToCart — adds a product to the cart.
         * If already in cart, increments quantity.
         * payload: { product: {...}, quantity: number }
         */
        addToCart: (state, action) => {
            const { product, quantity = 1 } = action.payload;
            // Uniqueness check: Match both ID and Weight to support variants
            const existing = state.items.find(
                (item) => item.id === product.id && item.weight === product.weight
            );
            if (existing) {
                existing.quantity += quantity;
            } else {
                state.items.push({
                    ...product,
                    image: product.image || product.thumbnailUrl, // Normalize image field for CartSidebar
                    quantity
                });
            }
        },

        /**
         * removeFromCart — removes an item by its id.
         * payload: id (string or number)
         */
        removeFromCart: (state, action) => {
            const { id, weight } = action.payload;
            state.items = state.items.filter(
                (item) => !(item.id === id && item.weight === weight)
            );
        },

        /**
         * updateQuantity — changes quantity of an item by delta (+1 or -1).
         * Quantity will never drop below 1.
         * payload: { id, delta }
         */
        updateQuantity: (state, action) => {
            const { id, weight, delta } = action.payload;
            const item = state.items.find(
                (i) => i.id === id && i.weight === weight
            );
            if (item) {
                item.quantity = Math.max(1, item.quantity + delta);
            }
        },

        /**
         * clearCart — empties the entire cart.
         * Call this after a successful order is placed.
         */
        clearCart: (state) => {
            state.items = [];
        },
    },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } =
    cartSlice.actions;

export default cartSlice.reducer;

// ── Selectors ────────────────────────────────────────────────

/** All items currently in the cart */
export const selectCartItems = (state) => state.cart.items;

/** Total number of items (sum of all quantities) */
export const selectCartCount = (state) =>
    state.cart.items.reduce((sum, item) => sum + item.quantity, 0);

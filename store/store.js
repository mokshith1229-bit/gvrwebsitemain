// ============================================================
// store/store.js — Redux Store Configuration
// ============================================================
// This is the central Redux store. It combines all slices.
// Import this and pass it to <Provider store={store}> in index.jsx

import { configureStore } from '@reduxjs/toolkit';
import productReducer from './slices/productSlice';
import cartReducer from './slices/cartSlice';
import userReducer from './slices/userSlice';
import orderReducer from './slices/orderSlice';

const store = configureStore({
    reducer: {
        products: productReducer, // handles product listing & fetch
        cart: cartReducer,        // handles cart items
        user: userReducer,        // handles logged-in user
        orders: orderReducer,     // handles user orders & pending order
    },
});

export default store;

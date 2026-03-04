// ============================================================
// store/slices/orderSlice.js — Orders State
// ============================================================
// Manages: user's past orders, the current pending online order
// Async thunk: fetchUserOrders — fetches and filters orders from backend

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ORDERS_URL } from '../../api';

// ── Async Thunk ──────────────────────────────────────────────
// Fetches all orders and filters them by the logged-in user's name/email.
export const fetchUserOrders = createAsyncThunk(
    'orders/fetchUserOrders',
    async (currentUser, { rejectWithValue }) => {
        if (!currentUser) return [];
        try {
            const response = await fetch(ORDERS_URL);
            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }
            const allOrders = await response.json();

            // --- Debug: log what we received so we can verify the filter ---
            console.log('[fetchUserOrders] total orders from backend:', allOrders.length);
            console.log('[fetchUserOrders] current user:', {
                name: currentUser.name,
                email: currentUser.email,
                phone: currentUser.phone || currentUser.mobile,
                _id: currentUser._id || currentUser.id
            });

            const userPhone = (currentUser.phone || currentUser.mobile || '').replace(/\D/g, '');
            const userName = (currentUser.name || '').toLowerCase().trim();

            const filtered = allOrders.filter((order) => {
                // 1. Match by phone number (most reliable — strips non-digits)
                const orderPhone = (order.customerPhone || '').replace(/\D/g, '');
                if (userPhone && orderPhone && orderPhone === userPhone) return true;

                // Last 10 digits match (handles +91 prefix)
                if (userPhone.length >= 10 && orderPhone.length >= 10 &&
                    orderPhone.slice(-10) === userPhone.slice(-10)) return true;

                // 2. Match by full name (case-insensitive)
                const orderName = (order.customerName || '').toLowerCase().trim();
                if (userName && orderName && orderName === userName) return true;

                // 3. Partial name match (order name includes user name or vice versa)
                if (userName && orderName && (orderName.includes(userName) || userName.includes(orderName))) return true;

                // 4. Match by email if present in the order
                if (currentUser.email && order.customerEmail &&
                    order.customerEmail.toLowerCase() === currentUser.email.toLowerCase()) return true;

                return false;
            });

            console.log('[fetchUserOrders] matched orders:', filtered.length);

            // Return newest first
            return filtered.reverse();
        } catch (error) {
            console.error('[fetchUserOrders] error:', error);
            return rejectWithValue('Failed to fetch orders.');
        }
    }
);

// ── Slice ────────────────────────────────────────────────────
const orderSlice = createSlice({
    name: 'orders',
    initialState: {
        userOrders: [],    // array of the user's past orders
        pendingOrder: null, // order object waiting for online payment confirmation
        loading: false,
        error: null,
    },
    reducers: {
        setPendingOrder: (state, action) => {
            state.pendingOrder = action.payload;
        },
        clearPendingOrder: (state) => {
            state.pendingOrder = null;
        },
        prependOrder: (state, action) => {
            state.userOrders = [action.payload, ...state.userOrders];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.userOrders = action.payload;
            })
            .addCase(fetchUserOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { setPendingOrder, clearPendingOrder, prependOrder } = orderSlice.actions;

export default orderSlice.reducer;

// ── Selectors ────────────────────────────────────────────────

/** The logged-in user's past orders */
export const selectUserOrders = (state) => state.orders.userOrders;

/** If orders are currently being fetched */
export const selectOrdersLoading = (state) => state.orders.loading;

/** Any error from fetching orders */
export const selectOrdersError = (state) => state.orders.error;

/** The pending order awaiting online payment */
export const selectPendingOrder = (state) => state.orders.pendingOrder;

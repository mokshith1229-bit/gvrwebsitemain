// ============================================================
// store/slices/productSlice.js — Products State
// ============================================================
// Manages: products list, loading state, error state
// Fetches products from the backend via an async thunk.

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { PRODUCTS_URL, getImageUrl } from '../../api';

// ── Async Thunk ──────────────────────────────────────────────
// fetchProducts fetches all products from the backend API.
// Dispatch this once on app start: dispatch(fetchProducts())
export const fetchProducts = createAsyncThunk(
    'products/fetchProducts',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch(PRODUCTS_URL);
            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }
            const data = await response.json();

            if (!Array.isArray(data)) return [];

            // Map backend fields to what our UI components need:
            // - thumbnail  → the primary image (shown in ProductCard)
            // - media      → array of { type, url } objects (shown in ProductDetailPage gallery)
            // NOTE: backend does NOT have an `image` field — only thumbnail + media
            return data.map((product) => ({
                ...product,
                id: product._id || product.id,
                // Primary image used by ProductCard
                thumbnailUrl: getImageUrl(product.thumbnail) || null,
                // Full gallery images used by ProductDetailPage
                // Filter to only image type (exclude videos etc.) and resolve URLs
                mediaImages: Array.isArray(product.media)
                    ? product.media
                        .filter((m) => m.type === 'image' && m.url)
                        .map((m) => getImageUrl(m.url))
                    : [],
            }));

        } catch (error) {
            return rejectWithValue(
                'Could not load products. Please make sure the backend is running.'
            );
        }
    }
);

// ── Slice ────────────────────────────────────────────────────
const productSlice = createSlice({
    name: 'products',
    initialState: {
        items: [],       // array of product objects from backend
        loading: false,  // true while fetching
        error: null,     // error message string or null
    },
    reducers: {
        // No manual reducers needed — state is driven by the async thunk
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default productSlice.reducer;

// ── Selectors ────────────────────────────────────────────────
// Use these in components with useSelector()

/** All products from backend */
export const selectProducts = (state) => state.products.items;

/** True while products are being fetched */
export const selectProductsLoading = (state) => state.products.loading;

/** Error message, or null if no error */
export const selectProductsError = (state) => state.products.error;

/**
 * Returns products filtered by category and search query.
 * Usage: const filtered = useSelector(selectFilteredProducts('All', ''))
 */
export const selectFilteredProducts = (category, query) => (state) => {
    const products = state.products.items;
    return products.filter((p) => {
        const matchesCategory = category === 'All' || p.category === category;
        const matchesSearch =
            (p.name || '').toLowerCase().includes(query.toLowerCase()) ||
            (p.description || '').toLowerCase().includes(query.toLowerCase());
        return matchesCategory && matchesSearch;
    });
};

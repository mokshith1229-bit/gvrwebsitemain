import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { USERS_URL } from '../../api';

// ── Async Thunks ───────────────────────────────────────────

/** Update user profile in the database */
export const updateUserProfile = createAsyncThunk(
    'user/updateProfile',
    async ({ userId, updatedData }, { rejectWithValue }) => {
        try {
            const response = await fetch(`${USERS_URL}/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData),
            });
            if (!response.ok) throw new Error('Failed to update profile');
            return await response.json();
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

/** Add/Update user addresses in the database */
export const updateUserAddresses = createAsyncThunk(
    'user/updateAddresses',
    async ({ userId, addresses }, { rejectWithValue }) => {
        try {
            const response = await fetch(`${USERS_URL}/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ addresses }),
            });
            if (!response.ok) throw new Error('Failed to update addresses');
            return await response.json();
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Initialize state from localStorage if available
const savedUser = localStorage.getItem("user");

const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: savedUser ? JSON.parse(savedUser) : null, // { _id, name, firstName, lastName, email, phone, addresses: [], ... }
        loading: false,
        error: null,
    },
    reducers: {
        loginUser: (state, action) => {
            const userData = { addresses: [], ...action.payload };
            state.user = userData;
            // Save to localStorage for persistence
            localStorage.setItem("user", JSON.stringify(userData));
            if (action.payload.token) {
                localStorage.setItem("token", action.payload.token);
            }
        },
        logoutUser: (state) => {
            state.user = null;
            // Clear localStorage on logout
            localStorage.removeItem("user");
            localStorage.removeItem("token");
        },
        // Local-only backups (optional, usually thunks handle it)
        saveAddress: (state, action) => {
            if (state.user) {
                if (!state.user.addresses) state.user.addresses = [];
                state.user.addresses.push(action.payload);
                // Update localStorage with new address
                localStorage.setItem("user", JSON.stringify(state.user));
            }
        },
        updateProfile: (state, action) => {
            if (state.user) {
                state.user = { ...state.user, ...action.payload };
                // Update localStorage with new profile info
                localStorage.setItem("user", JSON.stringify(state.user));
            }
        },
    },
    extraReducers: (builder) => {
        builder
            // Profile Update
            .addCase(updateUserProfile.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                localStorage.setItem("user", JSON.stringify(action.payload));
            })
            .addCase(updateUserProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Address Update
            .addCase(updateUserAddresses.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateUserAddresses.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                localStorage.setItem("user", JSON.stringify(action.payload));
            })
            .addCase(updateUserAddresses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { loginUser, logoutUser, saveAddress, updateProfile } =
    userSlice.actions;

export default userSlice.reducer;

// ── Selectors ────────────────────────────────────────────────

/** The currently logged-in user object, or null */
export const selectUser = (state) => state.user.user;

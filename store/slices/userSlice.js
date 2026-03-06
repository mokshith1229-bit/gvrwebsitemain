import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ADDRESS_URL, USERS_URL } from '../../api';

// ── Async Thunks ───────────────────────────────────────────

/** Fetch all addresses for the logged-in user */
export const fetchUserAddresses = createAsyncThunk(
    'user/fetchAddresses',
    async (userId, { rejectWithValue }) => {
        try {
            const response = await fetch(ADDRESS_URL, {
                headers: { 'user-id': userId },
            });
            if (!response.ok) throw new Error('Failed to fetch addresses');
            return await response.json();
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

/** Add a new address to the backend */
export const addUserAddress = createAsyncThunk(
    'user/addAddress',
    async ({ userId, address }, { rejectWithValue }) => {
        try {
            const response = await fetch(ADDRESS_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'user-id': userId
                },
                body: JSON.stringify(address),
            });
            if (!response.ok) throw new Error('Failed to add address');
            return await response.json();
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

/** Update an existing address */
export const updateUserAddress = createAsyncThunk(
    'user/updateAddress',
    async ({ userId, addressId, address }, { rejectWithValue }) => {
        try {
            const response = await fetch(`${ADDRESS_URL}/${addressId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'user-id': userId
                },
                body: JSON.stringify(address),
            });
            if (!response.ok) throw new Error('Failed to update address');
            return await response.json();
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

/** Delete an address from the backend */
export const deleteUserAddress = createAsyncThunk(
    'user/deleteAddress',
    async ({ userId, addressId }, { rejectWithValue }) => {
        try {
            const response = await fetch(`${ADDRESS_URL}/${addressId}`, {
                method: 'DELETE',
                headers: { 'user-id': userId },
            });
            if (!response.ok) throw new Error('Failed to delete address');
            return { addressId };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

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
        deleteAddress: (state, action) => {
            if (state.user && state.user.addresses) {
                const index = action.payload;
                state.user.addresses.splice(index, 1);
                // Update localStorage after deletion
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
            // Fetch Addresses
            .addCase(fetchUserAddresses.fulfilled, (state, action) => {
                if (state.user) {
                    state.user.addresses = action.payload;
                    localStorage.setItem("user", JSON.stringify(state.user));
                }
            })
            // Add Address
            .addCase(addUserAddress.fulfilled, (state, action) => {
                if (state.user) {
                    if (!state.user.addresses) state.user.addresses = [];
                    state.user.addresses.unshift(action.payload);
                    localStorage.setItem("user", JSON.stringify(state.user));
                }
            })
            // Update Address
            .addCase(updateUserAddress.fulfilled, (state, action) => {
                if (state.user && state.user.addresses) {
                    const index = state.user.addresses.findIndex(a => (a._id || a.id) === (action.payload._id || action.payload.id));
                    if (index !== -1) {
                        state.user.addresses[index] = action.payload;
                        localStorage.setItem("user", JSON.stringify(state.user));
                    }
                }
            })
            // Delete Address
            .addCase(deleteUserAddress.fulfilled, (state, action) => {
                if (state.user && state.user.addresses) {
                    state.user.addresses = state.user.addresses.filter(a => (a._id || a.id) !== action.payload.addressId);
                    localStorage.setItem("user", JSON.stringify(state.user));
                }
            });
    },
});

export const { loginUser, logoutUser, saveAddress, updateProfile, deleteAddress } =
    userSlice.actions;

export default userSlice.reducer;

// ── Selectors ────────────────────────────────────────────────

/** The currently logged-in user object, or null */
export const selectUser = (state) => state.user.user;

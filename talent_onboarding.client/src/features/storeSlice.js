import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
// Async Thunks
export const fetchStores = createAsyncThunk("stores/fetchStores", async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get("/api/store");
        return response.data; // Array of stores
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const addStore = createAsyncThunk("stores/addStore", async (store, { rejectWithValue }) => {
    try {
        const response = await axios.post("/api/store", store);
        return response.data; // Newly added store
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const editStore = createAsyncThunk("stores/editStore", async (updatedStore, { rejectWithValue }) => {
    try {
        const response = await axios.put(`/api/store/${updatedStore.id}`, updatedStore);
        return response.data; // Updated store
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const deleteStore = createAsyncThunk("stores/deleteStore", async (id, { rejectWithValue }) => {
    try {
        await axios.delete(`/api/store/${id}`);
        return id; // Return the deleted store ID
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

// Slice
const storeSlice = createSlice({
    name: "stores",
    initialState: {
        stores: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch stores
            .addCase(fetchStores.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchStores.fulfilled, (state, action) => {
                state.loading = false;
                state.stores = action.payload;
            })
            .addCase(fetchStores.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Add store
            .addCase(addStore.fulfilled, (state, action) => {
                state.stores.push(action.payload);
            })
            .addCase(addStore.rejected, (state, action) => {
                state.error = action.error.message;
            })
            // Edit store
            .addCase(editStore.fulfilled, (state, action) => {
                const index = state.stores.findIndex((s) => s.id === action.payload.id);
                if (index !== -1) {
                    state.stores[index] = action.payload;
                }
            })
            .addCase(editStore.rejected, (state, action) => {
                state.error = action.error.message;
            })
            // Delete store
            .addCase(deleteStore.fulfilled, (state, action) => {
                state.stores = state.stores.filter((s) => s.id !== action.payload);
            })
            .addCase(deleteStore.rejected, (state, action) => {
                state.error = action.error.message;
            });
    },
});

export default storeSlice.reducer;

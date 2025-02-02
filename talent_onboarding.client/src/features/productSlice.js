import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async Thunks
// Fetch all products
export const fetchProducts = createAsyncThunk("products/fetchProducts", async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get("/api/product");
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

// Add a product
export const addProduct = createAsyncThunk("products/addProduct", async (product, { rejectWithValue }) => {
    try {
        const response = await axios.post("/api/product", product);
        return response.data; // The newly added product
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

// Edit a product
export const editProduct = createAsyncThunk(
    "products/editProduct",
    async (updatedProduct, { rejectWithValue }) => {
        try {
            const response = await axios.put(`/api/product/${updatedProduct.id}`, updatedProduct);
            return response.data; // The updated product
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Delete a product
export const deleteProduct = createAsyncThunk(
    "products/deleteProduct",
    async (id, { rejectWithValue }) => {
        try {
            await axios.delete(`/api/product/${id}`);
            return id; // Return the deleted product's ID
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Slice
const productSlice = createSlice({
    name: "products",
    initialState: {
        products: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        // Fetch products
        builder.addCase(fetchProducts.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(fetchProducts.fulfilled, (state, action) => {
            state.loading = false;
            state.products = action.payload;
        });
        builder.addCase(fetchProducts.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });

        // Add product
        builder.addCase(addProduct.fulfilled, (state, action) => {
            state.products.push(action.payload);
        });
        builder.addCase(addProduct.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });

        // Edit product
        builder.addCase(editProduct.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(editProduct.fulfilled, (state, action) => {
            state.loading = false;
            const index = state.products.findIndex((p) => p.id === action.payload.id);
            if (index !== -1) {
                state.products[index] = action.payload;
            }
        });
        builder.addCase(editProduct.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });

        // Delete product
        builder.addCase(deleteProduct.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(deleteProduct.fulfilled, (state, action) => {
            state.loading = false;
            state.products = state.products.filter((p) => p.id !== action.payload);
        });
        builder.addCase(deleteProduct.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });
    }
});

export default productSlice.reducer;

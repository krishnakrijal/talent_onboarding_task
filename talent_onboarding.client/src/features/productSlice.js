import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async Thunks
export const fetchProducts = createAsyncThunk("products/fetchProducts", async (_, thunkAPI) => {
    try {
        const response = await axios.get("/api/product");
        console.log("API Response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching products:", error.response?.status, error.response?.data || error.message);
        return thunkAPI.rejectWithValue("Failed to fetch products");
    }
});

// Add product thunk
export const addProduct = createAsyncThunk("products/addProduct", async (product) => {
    const response = await axios.post("/api/product", product);
    return response.data; // The newly added product
});

// Async thunk to edit a product via the API
export const editProduct = createAsyncThunk(
    "products/editProduct",
    async (updatedProduct) => {
        const response = await axios.put(`/api/Product/${updatedProduct.id}`, updatedProduct);
        return response.data; // Returns the updated product
    }
);

export const deleteProduct = createAsyncThunk("products/deleteProduct", async (id, { rejectWithValue }) => {
    try {
        const url = `/api/product/${id}`;
        console.log(`Attempting DELETE request to: ${url}`); // Debug log
        const response = await axios.delete(url);
        return id;
    } catch (error) {
        console.error("Error in DELETE request:", error.message); // Log the error
        return rejectWithValue(error.message);
    }

});

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
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

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

        // Delete customer
       
          builder.addCase(deleteProduct.fulfilled, (state, action) => {
                state.products = state.products.filter((product) => product.id !== action.payload);
            });
    },
});

export default productSlice.reducer;

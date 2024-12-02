import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async Thunks
export const fetchSales = createAsyncThunk("sales/fetchSales", async () => {
    const response = await axios.get("/api/sale");
    return response.data; // Array of sales
});

export const addSale = createAsyncThunk("sales/addSale", async (sale) => {
    const response = await axios.post("/api/sale", sale);
    return response.data; // Newly added sale
});

export const editSale = createAsyncThunk("sales/editSale", async (updatedSale) => {
    const response = await axios.put(`/api/sale/${updatedSale.id}`, updatedSale);
    return response.data; // Updated sale
});

export const deleteSale = createAsyncThunk("sales/deleteSale", async (id, { rejectWithValue }) => {
    try {
        await axios.delete(`/api/sale/${id}`);
        return id; // Return the deleted sale ID
    } catch (error) {
        console.error("Error in DELETE request:", error.message);
        return rejectWithValue(error.message);
    }
});

// Slice
const saleSlice = createSlice({
    name: "sales",
    initialState: {
        sales: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch sales
            .addCase(fetchSales.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchSales.fulfilled, (state, action) => {
                state.loading = false;
                state.sales = action.payload;
            })
            .addCase(fetchSales.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Add sale
            .addCase(addSale.fulfilled, (state, action) => {
                state.sales.push(action.payload);
            })
            .addCase(addSale.rejected, (state, action) => {
                state.error = action.error.message;
            })
            // Edit sale
            .addCase(editSale.fulfilled, (state, action) => {
                const index = state.sales.findIndex((s) => s.id === action.payload.id);
                if (index !== -1) {
                    state.sales[index] = action.payload;
                }
            })
            .addCase(editSale.rejected, (state, action) => {
                state.error = action.error.message;
            })
            // Delete sale
            .addCase(deleteSale.fulfilled, (state, action) => {
                state.sales = state.sales.filter((s) => s.id !== action.payload);
            })
            .addCase(deleteSale.rejected, (state, action) => {
                state.error = action.error.message;
            });
    },
});

export default saleSlice.reducer;

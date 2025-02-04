import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


// Async Thunks
export const fetchCustomers = createAsyncThunk("customers/fetchCustomers", async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get("/api/customer");
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

// Add customer thunk
export const addCustomer = createAsyncThunk("customers/addCustomer", async (customer, { rejectWithValue }) => {
    try {
        const response = await axios.post("/api/customer", customer);
        return response.data; // The newly added customer
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

// Async thunk to edit a customer via the API
export const editCustomer = createAsyncThunk(
    "customers/editCustomer",
    async (updatedCustomer, { rejectWithValue }) => {
        try {
            const response = await axios.put(`/api/customer/${updatedCustomer.id}`, updatedCustomer);

            return response.data; // Returns the updated customer
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);


export const deleteCustomer = createAsyncThunk(
    "customers/deleteCustomer",
    async (id, { rejectWithValue }) => {

        try {
            await axios.delete(`/api/customer/${id}`);
            return id;
        } catch (error) {

            return rejectWithValue(error.message);
        }
    }
);

// Slice
const customerSlice = createSlice({
    name: "customers",
    initialState: {
        customers: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        // Fetch customers
        builder.addCase(fetchCustomers.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(fetchCustomers.fulfilled, (state, action) => {
            state.loading = false;
            state.customers = action.payload;
        });
        builder.addCase(fetchCustomers.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });

        //addCustomer
        builder.addCase(addCustomer.fulfilled, (state, action) => {
            state.customers.push(action.payload);
        });
        builder.addCase(addCustomer.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });

        // Edit customer
        builder.addCase(editCustomer.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(editCustomer.fulfilled, (state, action) => {
            state.loading = false;
            const index = state.customers.findIndex((c) => c.id === action.payload.id);
            if (index !== -1) {
                state.customers[index] = action.payload;
            }
        });
        builder.addCase(editCustomer.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });

        // Delete customer
        builder.addCase(deleteCustomer.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(deleteCustomer.fulfilled, (state, action) => {
            state.loading = false;
            state.customers = state.customers.filter((c) => c.id !== action.payload);
        });
        builder.addCase(deleteCustomer.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });
    }
});

export default customerSlice.reducer;
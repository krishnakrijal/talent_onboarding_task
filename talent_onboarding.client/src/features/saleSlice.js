import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { fetchCustomers } from "../features/customerSlice";
import { fetchProducts } from "../features/productSlice";
import { fetchStores } from "../features/storeSlice";




// Async Thunks
export const fetchSales = createAsyncThunk("sales/fetchSales", async (_, { dispatch, getState }) => {
    try {
        await Promise.all([
            dispatch(fetchCustomers()), // Fetch customers
            dispatch(fetchProducts()),   // Fetch products
            dispatch(fetchStores()),     // Fetch stores
        ]);

        // Fetch sales data
        const salesResponse = await axios.get("/api/sale");
        //console.log("Sales Data: ", salesResponse.data); // Check raw sales data

        if (salesResponse.status < 200 || salesResponse.status >= 300) {
            throw new Error(`Failed to fetch sales: ${salesResponse.status} ${salesResponse.statusText}`);
        }

        const state = getState();
        const customers = state.customers.customers;
        const products = state.products.products;
        const stores = state.stores.stores;

       // console.log("Customers from state: ", customers);
       // console.log("Products from state: ", products);
       // console.log("Stores from state: ", stores);

        const mappedSales = salesResponse.data.map((sale) => {
            // Log customer, product, and store lookup
            const customer = customers.find((c) => c.id === sale.customerId);
            const product = products.find((p) => p.id === sale.productId);
            const store = stores.find((s) => s.id === sale.storeId);

           // console.log(`Sale ID: ${sale.id} - customerId: ${sale.customerId} - productId: ${sale.productId} - storeId: ${sale.storeId}`);
           // console.log(`Mapped customer: ${customer ? customer.name : "N/A"}`);
           // console.log(`Mapped product: ${product ? product.name : "N/A"}`);
           // console.log(`Mapped store: ${store ? store.name : "N/A"}`);

            return {
                ...sale,
                customerName: customer ? customer.name : "N/A",
                productName: product ? product.name : "N/A",
                storeName: store ? store.name : "N/A",
            };
        });

        return mappedSales;
    } catch (error) {
        console.error("Error fetching sales:", error);
        throw error; // Let Redux handle the error
    }
});


export const addSale = createAsyncThunk("sales/addSale", async (sale, { rejectWithValue }) => {
    try {
        const response = await axios.post("/api/sale", sale);
        return response.data; // Newly added sale
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const editSale = createAsyncThunk("sales/editSale", async (updatedSale, { rejectWithValue }) => {
    try {
        const response = await axios.put(`/api/sale/${updatedSale.id}`, updatedSale);
        return response.data; // Updated sale
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const deleteSale = createAsyncThunk("sales/deleteSale", async (id, { rejectWithValue }) => {
    try {
        await axios.delete(`/api/sale/${id}`);
        return id; // Return the deleted sale ID
    } catch (error) {
       
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

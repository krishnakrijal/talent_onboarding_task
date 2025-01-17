import { configureStore } from '@reduxjs/toolkit';
import customerReducer from './customerSlice';
import productReducer from './productSlice';
import salesReducer from './saleSlice';
import storeReducer from './storeSlice';

const store = configureStore({
    reducer: {
        customers: customerReducer,
        products: productReducer,
        sales: salesReducer,
        stores: storeReducer,
    },
});

export default store;

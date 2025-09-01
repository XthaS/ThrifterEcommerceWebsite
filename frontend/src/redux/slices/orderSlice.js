import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";

//async thunk to fetch orders
export const fetchOrders = createAsyncThunk("orders/fetchOrders", async (_, {rejectWithValue}) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/orders/my-orders`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("userToken")}`
            }
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

//async thunk to fetch order details by id
export const fetchOrderDetails = createAsyncThunk("orders/fetchOrderDetails", async (orderId, {rejectWithValue}) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/orders/${orderId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("userToken")}`,
            },
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

const orderSlice = createSlice({
    name: "order",
    initialState: {
        orders: [],
        totalOrders: 0,
        orderDetails: null,
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
        //fetch orders
        .addCase(fetchOrders.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchOrders.fulfilled, (state, action) => {
            state.loading = false;
            state.orders = action.payload;
        })  
        .addCase(fetchOrders.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload.message;
        })
        //fetch order details
        .addCase(fetchOrderDetails.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchOrderDetails.fulfilled, (state, action) => {
            state.loading = false;
            state.orderDetails = action.payload;
        })
        .addCase(fetchOrderDetails.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload.message;
        });
        //cancel order
    },
});
export default orderSlice.reducer;
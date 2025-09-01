import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";

//fetch all orders (admin only)
export const fetchAllOrders = createAsyncThunk("adminOrders/fetchAllOrders", async (_, {rejectWithValue}) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/orders`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("userToken")}`,
            }
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

//update order delivery status
export const updateOrderStatus = createAsyncThunk("adminOrders/updateOrderStatus", async ({id, status}, {rejectWithValue}) => {
    try {
        const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/admin/orders/${id}`,
            { status }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("userToken")}`,
                }
            });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

//delete an order
export const deleteOrder = createAsyncThunk("adminOrders/deleteOrder", async (id, {rejectWithValue}) => {
    try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/admin/orders/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("userToken")}`,
            },
        });
        return id;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

const adminOrderSlice = createSlice({
    name: "adminOrders",
    initialState: {
        orders: [],
        totalOrders: 0,
        totalSales: 0,
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(fetchAllOrders.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchAllOrders.fulfilled, (state, action) => {
            state.loading = false;
            state.orders = action.payload.orders;
            state.totalOrders = action.payload.totalOrders;
            //calculate total sales
            const ordersArr = Array.isArray(action.payload.orders) ? action.payload.orders : [];
            const totalSales = ordersArr.reduce((acc, order) =>{
                return acc + order.totalPrice;
            }, 0);
            state.totalSales = totalSales;
        })
        .addCase(fetchAllOrders.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || action.error.message;
        })

        //update order status
        .addCase(updateOrderStatus.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(updateOrderStatus.fulfilled, (state, action) => {
            state.loading = false;
            const updatedOrder = action.payload;
            const orderIndex = state.orders.findIndex(order => order._id === updatedOrder._id);
            if (orderIndex !== -1) {
                state.orders[orderIndex] = updatedOrder;
            }
        })
        .addCase(updateOrderStatus.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || action.error.message;
        })

        //delete order
        .addCase(deleteOrder.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(deleteOrder.fulfilled, (state, action) => {
            state.loading = false;
            state.orders = state.orders.filter(order => order._id !== action.payload);
        })
        .addCase(deleteOrder.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || action.error.message;
        })
    },
});

export default adminOrderSlice.reducer;
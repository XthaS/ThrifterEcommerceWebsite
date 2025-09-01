import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";

//async thunk to fetch all users(admin)
export const fetchUsers = createAsyncThunk("admin/fetchUsers", async (_, {rejectWithValue}) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/users`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("userToken")}`
            }
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

//add the create user action
export const addUser = createAsyncThunk("admin/addUser", async (userData, {rejectWithValue}) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/admin/users`, userData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("userToken")}`
            }
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

//update user info
export const updateUser = createAsyncThunk("admin/updateUser", async ({id, name, email, role}, {rejectWithValue}) => {
    try {
        const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/admin/users/${id}`,
            {name, email, role}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("userToken")}`
                }
            });
        return response.data.user;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

//delete a user
export const deleteUser = createAsyncThunk("admin/deleteUser", async (id, {rejectWithValue}) => {
    try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/admin/users/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("userToken")}`
            }
        });
        return id;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

const adminSlice = createSlice({
    name: "admin",
    initialState: {
        users: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
        //fetch all users
        .addCase(fetchUsers.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchUsers.fulfilled, (state, action) => {
            state.loading = false;
            state.users = action.payload;
        })
        .addCase(fetchUsers.rejected, (state, action) => {
            state.loading = false;
            state.error = typeof action.payload === 'object' ? (action.payload?.message || JSON.stringify(action.payload)) : (action.payload || action.error.message);
        })
        //update user info
        .addCase(updateUser.fulfilled, (state, action) => {
            const updatedUser = action.payload;
            const userIndex = state.users.findIndex(user => user._id === updatedUser._id);
            if (userIndex !== -1) {
                state.users[userIndex] = updatedUser;
            }
        })
        .addCase(updateUser.rejected, (state, action) => {
            state.error = typeof action.payload === 'object' ? (action.payload?.message || JSON.stringify(action.payload)) : (action.payload || action.error.message);
        })
        .addCase(deleteUser.fulfilled, (state, action) => {
            state.users = state.users.filter(user => user._id !== action.payload);
        })
        .addCase(deleteUser.rejected, (state, action) => {
            state.error = typeof action.payload === 'object' ? (action.payload?.message || JSON.stringify(action.payload)) : (action.payload || action.error.message);
        })
        .addCase(addUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(addUser.fulfilled, (state, action) => {
            state.loading = false;
            // Accept either { user: ... } or just the user object
            const newUser = action.payload.user || action.payload;
            state.users.push(newUser);
        })
        .addCase(addUser.rejected, (state, action) => {
            state.loading = false;
            state.error = typeof action.payload === 'object' ? (action.payload?.message || JSON.stringify(action.payload)) : (action.payload || action.error.message);
        })
    }
});

export default adminSlice.reducer;


import {createSlice,createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";

//retrieve user info and token from local storage if available
const userFromStorage = localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")) : null;

//check for an existing guest ID in local storage or generate a new one
const initialGuestId = localStorage.getItem("guestId") || `guest_${new Date().getTime()}`;
localStorage.setItem("guestId",initialGuestId);

//initial state for auth slice
const initialState = {
    user:userFromStorage,
    guestId:initialGuestId,
    loading:false,
    error:null,
};

//create async thunk for login user
export const loginUser = createAsyncThunk("auth/loginUser",async(userData,{rejectWithValue})=>{
    try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/users/login`,userData);
        localStorage.setItem("userInfo",JSON.stringify(response.data.user));
        localStorage.setItem("userToken",response.data.token);

        return response.data.user;//return user object from the response
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

//create async thunk for user registration
export const registerUser = createAsyncThunk("auth/registerUser",async(userData,{rejectWithValue})=>{
    try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/users/register`,userData);
        localStorage.setItem("userInfo",JSON.stringify(response.data.user));
        localStorage.setItem("userToken",response.data.token);

        return response.data.user;//return user object from the response
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

//slice for auth state
const authSlice = createSlice({
    name:"auth",
    initialState,
    reducers:{
    logoutUser:(state)=>{
        state.user = null;
        state.guestId = 'guest_${new Date().getTime()}';//Reset guest ID on logout
        localStorage.removeItem("userInfo");
        localStorage.removeItem("userToken");
        localStorage.setItem("guestId", state.guestId);//set new guest ID in local storage
    },
    generateNewGuestId:(state)=>{
        state.guestId = `guest_${new Date().getTime()}`;
        localStorage.setItem("guestId",state.guestId);
    },
},
    extraReducers:(builder)=>{
        builder
        .addCase(loginUser.pending,(state)=>{
            state.loading = true;
            state.error = null;  
        })
        .addCase(loginUser.fulfilled,(state,action)=>{
            state.loading = false;
            state.user = action.payload;
        })
        .addCase(loginUser.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(registerUser.pending,(state)=>{
            state.loading = true;
            state.error = null;
        })
        .addCase(registerUser.fulfilled,(state,action)=>{
            state.loading = false;
            state.user = action.payload;
        })
        .addCase(registerUser.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.payload;
        })
    },

});
export const {logoutUser,generateNewGuestId} = authSlice.actions;
export default authSlice.reducer;


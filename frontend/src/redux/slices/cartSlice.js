import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";

//helper function to load cart from local storage
const loadCartFromLocalStorage = () => {
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : {products: []};
};

//helper function to save cart to local storage
const saveCartToLocalStorage = (cart) => {
    localStorage.setItem("cart", JSON.stringify(cart));
};

//Fetch cart for a user or guest
export const fetchCart = createAsyncThunk("cart/fetchCart", async ({userId, guestId},{rejectWithValue}) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/cart`, {
            params: {
                userId,
                guestId
            }
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);            
    }
});

//add an item to the cart for a user or guest
export const addToCart = createAsyncThunk("cart/addToCart", async ({userId, guestId, productId, quantity = 1, size, color},{rejectWithValue}) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/cart`, {
            userId,
            guestId,
            productId,
            quantity: quantity || 1,
            size,
            color
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

//update an item in the cart for a user or guest
export const updateCartItem = createAsyncThunk("cart/updateCartItem", async ({userId, guestId, productId, quantity = 1, size, color},{rejectWithValue}) => {
    try {
        const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/cart`, {
            userId,
            guestId,
            productId,
            quantity: quantity || 1,
            size,
            color
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);    
    }
});

//add a product to the cart for a user or guest
export const addProductToCart = createAsyncThunk("cart/addProductToCart", async ({userId, guestId, productId, quantity, size, color},{rejectWithValue}) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/cart`, {
            userId,
            guestId,
            productId,
            quantity,
            size,
            color
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

//update quantity of an item in the cart for a user or guest not used
// Update product availability after adding to cart
export const updateProductAvailability = createAsyncThunk(
    "cart/updateProductAvailability",
    async ({ productId, isAvailable }, { rejectWithValue }) => {
      try {
        const response = await axios.put(
          `${import.meta.env.VITE_API_URL}/api/products/${productId}/availability`,
          { isAvailable }
        );
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  ); 

//remove an item from the cart 
export const removeItemFromCart = createAsyncThunk("cart/removeItemFromCart", async ({userId, guestId, productId, size, color},{rejectWithValue}) => {
    try {
        const response = await axios.delete(`${import.meta.env.VITE_API_URL}/api/cart`, {
            data: {
                userId,
                guestId,
                productId,
                size,
                color
            }
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

//merge guest cart with user cart
export const mergeGuestCartWithUserCart = createAsyncThunk("cart/mergeGuestCartWithUserCart", async ({userId, guestId},{rejectWithValue}) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/cart/merge`, {
            userId,
            guestId
        },
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("userToken")}`
            },
        }
    );
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        cart: loadCartFromLocalStorage(),
        loading: false, //loading state
        error: null
    },
    reducers: {
        clearCart: (state) => {
            state.cart = {products: []};
            localStorage.removeItem("cart");
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchCart.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchCart.fulfilled, (state, action) => {
            state.cart = action.payload;
            state.loading = false;
            // Check for unavailable products in the cart
            const unavailableProducts = state.cart.products.filter(p => p.isAvailable === false);
            if (unavailableProducts.length > 0) {
                state.error = "Some products in your cart are no longer available.";
            } else {
                state.error = null;
            }
            saveCartToLocalStorage(action.payload);
        })
        .addCase(fetchCart.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || "Failed to fetch cart";
        })
        //add to cart
        .addCase(addToCart.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(addToCart.fulfilled, (state, action) => {
            state.cart = action.payload;
            state.loading = false;
            saveCartToLocalStorage(action.payload);
        })
        .addCase(addToCart.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || "Failed to add to cart";
        })

        //update cart item quantity
      /*  .addCase(updateCartItemQuantity.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
            state.cart = action.payload;
            state.loading = false;
            saveCartToLocalStorage(action.payload);
        })
        .addCase(updateCartItemQuantity.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || "Failed to update cart item quantity";
        })*/
        //remove from cart
            .addCase(removeItemFromCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeItemFromCart.fulfilled, (state, action) => {
                state.cart = action.payload;
                state.loading = false;
                saveCartToLocalStorage(action.payload);
            })
            .addCase(removeItemFromCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to remove from cart";
            })

            //merge guest cart with user cart
            .addCase(mergeGuestCartWithUserCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(mergeGuestCartWithUserCart.fulfilled, (state, action) => {
                state.cart = action.payload;
                state.loading = false;
                saveCartToLocalStorage(action.payload);
            })  
            .addCase(mergeGuestCartWithUserCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Failed to merge cart";
            });
    },
}); 

export const {clearCart} = cartSlice.actions;
export default cartSlice.reducer;


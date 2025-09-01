import {createSlice,createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";

//async thunk to fetch all products by collection and optional filters
export const fetchProducts = createAsyncThunk(
    "products/fetchByFilters",
    async({
        collection,
        size,
        gender,
        minPrice,
        maxPrice,
        sortBy,
        search,
        category,
        material,
        brand,
        limit,
    })=>{
        const query = new URLSearchParams();
        if(collection){
            query.append("collection",collection);
        }
        if(size){
            query.append("size",size);
        }
        if(gender){
            query.append("gender",gender);
        }
        if(minPrice){
            query.append("minPrice",minPrice);
        }
        if(maxPrice){
            query.append("maxPrice",maxPrice);
        }
        if(sortBy){
            query.append("sortBy",sortBy);
        }
        if(search){
            query.append("search",search);
        }
        if(category){
            query.append("category",category);
        }
        if(material){
            query.append("material",material);
        }
        if(brand){
            query.append("brand",brand);
        }
        if(limit){
            query.append("limit",limit);
        }
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/products?${query.toString()}`);
        return response.data;
    
});

//async thunk to fetch a single product by id
export const fetchProductById = createAsyncThunk(
    "products/fetchProductDetails",
    async(id)=>{
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/products/${id}`);
        return response.data;
    }
);

//async thunk to fetch similar products by category and id
export const updateProduct = createAsyncThunk(
    "products/updateProduct",
    async(productData)=>{
        const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/products/${id}`,productData,
            {
                headers:{
                    Authorization: `Bearer ${localStorage.getItem("userToken")}`,
                },
            }
        );
        return response.data;
    }
);

//async thunk to fetch similar products
export const fetchSimilarProducts = createAsyncThunk(
    "products/fetchSimilarProducts",
    async({category,id,limit})=>{
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/products/${id}/recommendations`);
        return response.data;
    }
);

const productSlices = createSlice({
    name:"products",
    initialState:{
        products:[],
        selectedProduct:null, //store details of singleproduct
        similarProducts:[],
        loading:false,
        error:null,
        filters:{
            category:"",
            size:"",
            gender:"",
            brand:"",
            minPrice:"",
            maxPrice:"",
            sortBy:"",
            search:"",
            material:"",
            collection:"",

        },
    },
    reducers:{
        setFilters:(state,action)=>{
            state.filters = {...state.filters,...action.payload};
        },
        clearFilters:(state)=>{
            state.filters = {
                category:"",
                size:"",
                gender:"",
                brand:"",
                minPrice:"",
                maxPrice:"",
                sortBy:"",
                search:"",
                material:"",
                collection:"",
            }
        },
    },
    extraReducers:(builder)=>{
        builder// handle fetching products with filters
        .addCase(fetchProducts.pending,(state)=>{
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchProducts.fulfilled,(state,action)=>{
            state.loading = false;
            state.products = Array.isArray(action.payload) ? action.payload : [];
        })
        .addCase(fetchProducts.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.error.message;
        })
        //handle fetching single product
        .addCase(fetchProductById.pending,(state)=>{
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchProductById.fulfilled,(state,action)=>{
            state.loading = false;
            state.selectedProduct = action.payload;
        })
        .addCase(fetchProductById.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.error.message;
        })
        //handle updating product   
        .addCase(updateProduct.pending,(state)=>{
            state.loading = true;
            state.error = null;
        })
        .addCase(updateProduct.fulfilled,(state,action)=>{
            state.loading = false;
            state.updatedProduct = action.payload;
            const index = state.products.findIndex(product=>product._id === action.payload._id);
            if(index !== -1){
                state.products[index] = updateProduct;
            }
        })  
        .addCase(updateProduct.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.error.message;
        })
        //handle fetching similar products
        .addCase(fetchSimilarProducts.pending,(state)=>{
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchSimilarProducts.fulfilled,(state,action)=>{
            state.loading = false;
            state.similarProducts = action.payload;
        })
        .addCase(fetchSimilarProducts.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.error.message;
        });
    },
  
});
export const {setFilters,clearFilters} = productSlices.actions;
export default productSlices.reducer;

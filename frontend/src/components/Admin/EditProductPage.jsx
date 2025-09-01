import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { fetchProductById } from '../../redux/slices/productsSlice';
import { updateProduct } from '../../redux/slices/adminProductSlice';
import { toast } from 'sonner';

const EditProductPage = () => {
const dispatch = useDispatch();
const navigate = useNavigate();
const{id} = useParams();
const{selectedProduct, loading, error} = useSelector((state) => state.products);

  const [productData ,setProductData]=useState({
    name:"",
    description:"",
    price:"",
    countInStock:"",
    category:"",
    brand:"",
    size: "",
    material:"",
    gender:"",
    images:[
    ],
  });

  const [uploading, setUploading] = useState(false);//image upload state

  useEffect(()=>{
    if(id){
      dispatch(fetchProductById(id));
    }
  },[id,dispatch]);

  useEffect(()=>{
    if(selectedProduct){
      setProductData(selectedProduct);
    }
  },[selectedProduct]);

  const handleChange = (e) => {
    const{name,value}=e.target;
    setProductData((prevData)=>({...prevData, [name]:value}));
  };

  const handleImageUpload = async (e) => {
    const file =e.target.files[0];
    const formData = new FormData();
    formData.append("image",file);
    try{
      setUploading(true);
      const {data} = await axios.post(`${import.meta.env.VITE_API_URL}/api/upload`,formData,{
        headers:{
          "Content-Type":"multipart/form-data",
        },
      });
      setProductData((prevData) => ({
        ...prevData,
        images: [...prevData.images, { url: data.imageUrl, altText: "" }],
      }));
      setUploading(false);
    }catch(error){
      console.error(error);
      setUploading(false);
  }
  };

  const handleSubmit = (e)=>{
    e.preventDefault();
    dispatch(updateProduct({id, productData}))
      .unwrap()
      .then(() => {
        toast.success('Product updated successfully!');
        setTimeout(() => navigate("/admin/products"), 1500);
      })
      .catch(() => {
        toast.error('Failed to update product.');
      });
  };

  if(loading){
    return <p>Loading...</p>;
  }
  if(error){
    return <p>Error: {error}</p>;
  }

  // Dropdown options (copied from CreateProduct)
  const CATEGORY_OPTIONS = ["Top Wear", "Bottom Wear"];
  const BRAND_OPTIONS = [
    "Urban Threads", "Modern Fit", "Street Style", "Beach Breeze", "Fashionista", "ChicStyle"
  ];
  const MATERIAL_OPTIONS = ["Cotton", "Wool", "Denim", "Polyster", "Silk", "Linen", "Viscose", "Fleece"];
  const GENDER_OPTIONS = ["Men", "Women"];


  return (
    <div className="max-w-5xl mx-auto p-6 shadow-md rounded-md">
      <h2 className="text-3xl font-bold mb-6">Edit Product</h2>
      <form onSubmit={handleSubmit}>
        {/*name */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Product Name</label>
          <input 
          type="text" 
          name="name" 
          value={productData.name} 
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md p-2"
          required
          />
        </div>

        {/*desc */}
          <div className="mb-6">
          <label className="block font-semibold mb-2">Description</label>
          <textarea 
          name="description"
          value={productData.description}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md p-2"
          rows={4}
          required
          />
        </div>
        {/*Price */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Price</label>
          <input 
          type="number" 
          name="price" 
          value={productData.price}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        {/*Availability */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Availability</label>
          <select 
          name="isAvailable" 
          value={productData.isAvailable}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md p-2"
          >
            <option value={true}>Available</option>
            <option value={false}>Not Available</option>
          </select>
        </div>

        {/* Category Dropdown */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Category</label>
          <select
            name="category"
            value={productData.category}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          >
            <option value="">Select Category</option>
            {CATEGORY_OPTIONS.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
        {/* Brand Dropdown */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Brand</label>
          <select
            name="brand"
            value={productData.brand}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          >
            <option value="">Select Brand</option>
            {BRAND_OPTIONS.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
        {/* Material Dropdown */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Material</label>
          <select
            name="material"
            value={productData.material}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          >
            <option value="">Select Material</option>
            {MATERIAL_OPTIONS.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
        {/* Gender Dropdown */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Gender</label>
          <select
            name="gender"
            value={productData.gender}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          >
            <option value="">Select Gender</option>
            {GENDER_OPTIONS.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        {/* Size Dropdown (already present, just ensure options match) */}
        <div className="mb-4">
          <label className="block font-semibold mb-2">Size</label>
          <select
            name="size"
            value={productData.size}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          >
            <option value="">Select Size</option>
            <option value="XS">XS</option>
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>
            <option value="XL">XL</option>
            <option value="XXL">XXL</option>
          </select>
        </div>

        {/*Image Upload */}
        <div className="mb-6">
          <label className="block font-semibold mb-2"> Upload Image</label>
          <input type="file" onChange={handleImageUpload} />
          {uploading && <p>Uploading...</p>}
          <div className="flex gap-4 mt-4">
            {productData.images.map((image,index)=>(
              <div key={index}>
                <img src={image.url} alt={image.altText || "Product Image"}
                className="w-20 h-20 object-cover rounded-md shadow-md" />
              </div>
            ))}
          </div>
        </div>
        <button type="submit" className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition-colors">
        Update Products
        </button>
      </form>
    </div>
  )
}

export default EditProductPage

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../redux/slices/cartSlice";
import { toast } from "sonner";

const BestSellerCard = ({ product }) => {
  // Always use the first image for the main image, update when product changes
  const [mainImage, setMainImage] = useState(product.images[0]?.url || "");
  useEffect(() => {
    setMainImage(product.images[0]?.url || "");
  }, [product]);

  const dispatch = useDispatch();
  const { user, guestId } = useSelector((state) => state.auth);

  if (!product) return null;

  // Determine availability
  const isAvailable = product.isAvailable !== undefined
    ? product.isAvailable
    : (product.countInStock !== undefined ? product.countInStock > 0 : true);

  // Add to Cart handler
  const handleAddToCart = () => {
    if (!isAvailable) return;
    dispatch(
      addToCart({
        productId: product._id,
        quantity: 1,
        guestId,
        userId: user?._id,
      })
    )
      .then(() => {
        toast.success("Product Added To Cart!", { duration: 1000 });
      })
      .catch(() => {
        toast.error("Failed to add to cart.", { duration: 1000 });
      });
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg mt-2">
      <div className="flex flex-col md:flex-row">
        {/* Left Thumbnails (single image for best seller) */}
        <div className="hidden md:flex flex-col space-y-4 mr-6">
          <img
            src={product.images[0]?.url}
            alt=""
            onError={e => e.target.style.display = 'none'}
            className="w-20 h-20 object-cover rounded-lg border border-gray-200"
          />
        </div>
        {/* Main Image */}
        <div className="md:w-1/2">
          <div className="mb-4">
            <img
              src={mainImage}
              alt={product.name}
              onError={e => e.target.style.display = 'none'}
              className="w-full h-[400px] object-cover rounded-lg"
            />
          </div>
        </div>
        {/* Right Side */}
        <div className="md:w-1/2 md:ml-10">
          <h1 className="text-2xl md:text-2xl font-semibold mb-1">
            {product.name}
          </h1>
          <div className="flex items-center space-x-4 mb-1">
            <span className="text-lg font-bold text-gray-900">
              ${product.price}
            </span>
          </div>
          <p className="text-gray-600 mb-2 text-xs">
            {product.description}
          </p>
          {/* Characteristics Section - Redesigned */}
          <div className="mt-6">
            <h3 className="text-gray-800 text-lg font-bold mb-3">Characteristics</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4 border border-gray-100">
              <div>
                <span className="block text-xs text-gray-500 font-semibold mb-1">Brand</span>
                <span className="block text-base font-medium text-gray-800">{product.brand}</span>
              </div>
              <div>
                <span className="block text-xs text-gray-500 font-semibold mb-1">Material</span>
                <span className="block text-base font-medium text-gray-800">{product.material}</span>
              </div>
              <div>
                <span className="block text-xs text-gray-500 font-semibold mb-1">Size</span>
                <span className="block text-base font-medium text-gray-800">{product.size}</span>
              </div>
              <div>
                <span className="block text-xs text-gray-500 font-semibold mb-1">Availability</span>
                <span className={`block text-base font-semibold ${isAvailable ? "text-green-600" : "text-red-500"}`}>
                  {isAvailable ? "In Stock" : "Out of Stock"}
                </span>
              </div>
            </div>
          </div>
          {/* Add to Cart Button */}
          <button
            type="button"
            onClick={handleAddToCart}
            className="bg-black text-white w-full py-2 px-4 rounded font-bold transition-all disabled:bg-opacity-50 mt-6"
            disabled={!isAvailable}
          >
            Add To Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default BestSellerCard; 
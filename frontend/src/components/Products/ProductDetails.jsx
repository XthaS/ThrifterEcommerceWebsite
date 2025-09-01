import { useEffect, useState } from "react";
import { toast } from "sonner";
import ProductGrid from "./ProductGrid";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  fetchProductById as fetchProductDetails,
  fetchSimilarProducts,
} from "../../redux/slices/productsSlice";
import { addToCart } from "../../redux/slices/cartSlice";

const ProductDetails = ({ productId }) => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { selectedProduct, loading, error, similarProducts } = useSelector(
    (state) => state.products
  );

  const { user, guestId } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart); // <-- Add this line to get cart from Redux

  const productFetchId = productId || id;

  const [mainImage, setMainImage] = useState(null);
  const [isInCart, setIsInCart] = useState(false);

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        productId: productFetchId,
        quantity: 1,
        guestId,
        userId: user?._id,
        size: selectedProduct.size || "M",
      })
    )
      .then((action) => {
        if (action.type.endsWith('fulfilled')) {
          toast.success("Product Added To Cart!", { duration: 1000 });
          setIsInCart(true);
        } else if (action.payload && action.payload.message === "Product is not available") {
          toast.error("Sorry, this product is no longer available.", { duration: 2000 });
        } else {
          toast.error("Error adding to cart: " + (action.payload?.message || 'Unknown error'), { duration: 2000 });
        }
      })
      .catch((err) => {
        toast.error("Error adding to cart: " + err.message, { duration: 2000 });
      });
  };

  useEffect(() => {
    if (productFetchId) {
      dispatch(fetchProductDetails(productFetchId));
      dispatch(fetchSimilarProducts({ id: productFetchId }));
    }
  }, [dispatch, productFetchId]);

  useEffect(() => {
    if (selectedProduct) {
      setMainImage(selectedProduct.images[0].url);
    }
  }, [selectedProduct]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Add a useEffect to recalculate isInCart whenever selectedProduct or cart changes
  useEffect(() => {
    if (selectedProduct && cart && Array.isArray(cart.products)) {
      setIsInCart(
        cart.products.some(
          (item) =>
            item.productId === selectedProduct._id ||
            item._id === selectedProduct._id // fallback for different cart structure
        )
      );
    } else {
      setIsInCart(false);
    }
  }, [selectedProduct, cart]);

  if (loading) return <p className="text-center animate-pulse">Loading...</p>;
  if (error) return <p className="text-center text-red-500 font-semibold">{error.includes('404') ? 'Product not found.' : `Error: ${error}`}</p>;

  return (
    <div className="p-4">
      {selectedProduct && (
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg mt-14">
        <div className="flex flex-col md:flex-row">
            {/* Left Thumbnails */}
            <div className="hidden md:flex flex-col space-y-4 mr-6">
              {selectedProduct.images.map((image, index) => (
                <img
                  key={index}
                  src={image.url}
                  alt={image.altText || `Thumbnail ${index + 1}`}
                  onError={e => e.target.style.display = 'none'}
                  className={`w-16 h-16 object-cover rounded-lg cursor-pointer border ${
                    (!mainImage && index === 0) || mainImage === image.url
                      ? "border-black"
                      : ""
                  }`}
                  onClick={() => setMainImage(image.url)}
                />
              ))}
            </div>

            {/* Main Image */}
            <div className="md:w-1/2">
              <div className="mb-4">
                  <img
                  src={mainImage || selectedProduct.images[0].url}
                  alt=""
                  onError={e => e.target.style.display = 'none'}
                  className="w-full h-auto object-cover rounded-lg"
                />
              </div>
            </div>
            {/* For Mobile Thumbnail */}
            <div className="flex md:hidden space-x-4 mb-4 overflow-x-scroll">
            {selectedProduct.images.map((image, index) => (
              <img
                key={index}
                src={image.url}
                  alt={image.altText || `Thumbnail ${index + 1}`}
                  onError={e => e.target.style.display = 'none'}
                  className={`w-16 h-16 object-cover rounded-lg cursor-pointer border ${
                    (!mainImage && index === 0) || mainImage === image.url
                      ? "border-black"
                      : ""
                  }`}
                onClick={() => setMainImage(image.url)}
              />
            ))}
          </div>

            {/* Right Side */}
          <div className="md:w-1/2 md:ml-10">
              <h1 className="text-2xl md:text-3xl font-bold mb-3">
                {selectedProduct.name}
              </h1>
              <div className="flex items-end space-x-4 mb-3">
                <span className="text-2xl font-bold text-gray-900">${selectedProduct.price}</span>
              </div>
              <p className="text-gray-700 mb-4 text-base leading-relaxed font-medium">
                {selectedProduct.description}
              </p>

              {/* Characteristics Section - Redesigned */}
              <div className="mt-6">
                <h3 className="text-gray-800 text-lg font-bold mb-3">Characteristics</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <div>
                    <span className="block text-xs text-gray-500 font-semibold mb-1">Brand</span>
                    <span className="block text-base font-medium text-gray-800">{selectedProduct.brand}</span>
                  </div>
                  <div>
                    <span className="block text-xs text-gray-500 font-semibold mb-1">Material</span>
                    <span className="block text-base font-medium text-gray-800">{selectedProduct.material}</span>
                  </div>
                  <div>
                    <span className="block text-xs text-gray-500 font-semibold mb-1">Size</span>
                    <span className="block text-base font-medium text-gray-800">{selectedProduct.size || "-"}</span>
                  </div>
                  <div>
                    <span className="block text-xs text-gray-500 font-semibold mb-1">Availability</span>
                    <span className={`block text-base font-semibold ${selectedProduct.isAvailable ? "text-green-600" : "text-red-500"}`}>
                      {selectedProduct.isAvailable ? "In Stock" : "Out of Stock"}
                    </span>
            </div>
              </div>
            </div>

              {/* Add to Cart Button */}
              {user && user.role === 'admin' ? (
                <div className="text-red-600 font-bold mt-4">Admins are not allowed to purchase products.</div>
              ) : (
            <button
              onClick={handleAddToCart}
                  className="w-full bg-black text-white py-3 rounded mt-4 hover:bg-emerald-700 transition"
                  disabled={isInCart}
            >
                  {isInCart ? "In Cart" : "Add to Cart"}
            </button>
              )}
            </div>
          </div>
          <div className="mt-20">
            <h2 className="text-2xl font-medium text-center mb-4">
              You May Also Like
            </h2>
            <ProductGrid
              products={similarProducts}
              loading={loading}
              error={error}
            />
        </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;

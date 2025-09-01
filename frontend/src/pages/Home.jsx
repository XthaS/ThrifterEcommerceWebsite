import GenderCollectionSection from "../components/Products/GenderCollectionSection";
import Hero from "../components/Layout/Hero";
import NewArrivals from "../components/Products/NewArrivals";
import ProductGrid from "../components/Products/ProductGrid";
import ProductDetails from "../components/Products/ProductDetails";
import BestSellerCard from "../components/Products/BestSellerCard";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchProducts } from "../redux/slices/productsSlice";
import { fetchCart } from "../redux/slices/cartSlice";
import axios from "axios";

const Home = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const { cart } = useSelector((state) => state.cart);
  const cartProducts = cart?.products || [];
  const [bestSellerIndex, setBestSellerIndex] = useState(0);
  const [filteredBestSellers, setFilteredBestSellers] = useState([]);
  const [suggested, setSuggested] = useState([]);
  const [cartRecommendations, setCartRecommendations] = useState([]);

  useEffect(() => {
    dispatch(fetchProducts({}));
    // Fetch cart for recommendations
    const userId = localStorage.getItem('userId');
    const guestId = localStorage.getItem('guestId');
    if (userId || guestId) {
      dispatch(fetchCart({ userId, guestId }));
    }
  }, [dispatch]);

  useEffect(() => {
    // Use 5 random products as best deals
    if (products && products.length > 0) {
      const shuffled = [...products].sort(() => 0.5 - Math.random());
      setFilteredBestSellers(shuffled.slice(0, 5));
      setBestSellerIndex(0); // reset index on new data
      // Also update suggested
      setSuggested(shuffled.slice(5, 13)); // next 8 for suggestions
    }
  }, [products]);

  // Fetch cart-based recommendations
  useEffect(() => {
    const fetchCartRecommendations = async () => {
      try {
        if (cartProducts && cartProducts.length > 0) {
          const cartProductIds = cartProducts.map(item => item.productId);
          const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/products/cart-recommendations`, {
            params: { cartItems: JSON.stringify(cartProductIds) }
          });
          setCartRecommendations(response.data);
        } else {
          // If no cart items, use random suggestions
          setCartRecommendations(suggested);
        }
      } catch (error) {
        console.error('Error fetching cart recommendations:', error);
        // Fallback to random suggestions
        setCartRecommendations(suggested);
      }
    };

    if (cartProducts && products) {
      fetchCartRecommendations();
    }
  }, [cartProducts, products, suggested]);

  useEffect(() => {
    if (filteredBestSellers.length > 1) {
      const interval = setInterval(() => {
        setBestSellerIndex((prev) => (prev + 1) % filteredBestSellers.length);
      }, 10000); // 10 seconds
      return () => clearInterval(interval);
    }
  }, [filteredBestSellers]);

  const currentBestSeller =
    filteredBestSellers.length > 0 ? filteredBestSellers[bestSellerIndex] : null;

  return (
    <main>
      <Hero />
      <GenderCollectionSection />
      <NewArrivals />
      {/* Best Seller */}
      <h2 className="text-3xl text-center font-bold mb-4 mt-12">Best Deals</h2>
      <div className="flex justify-center">
        {currentBestSeller ? (
          <BestSellerCard product={currentBestSeller} />
        ) : (
          <p className="text-center animate-pulse">
            Loading best deals product...
          </p>
        )}
      </div>
      {/* You May Also Like */}
      <div className="container mx-auto p-2">
        <h2 className="text-3xl text-center font-bold mb-4">You May Also Like</h2>
        <ProductGrid 
          products={cartRecommendations.length > 0 ? cartRecommendations : suggested} 
          loading={loading} 
          error={error} 
        />
      </div>
      <div
        className="container mx-auto p-2 flex justify-center items-center"
        onClick={() => {
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        }}
      >
        <button className="flex items-center gap-2 px-6 py-3 bg-black text-white font-semibold rounded-full shadow-lg hover:bg-gray-900 hover:scale-105 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-gray-900">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
          </svg>
          Back To Top
        </button>
      </div>
    </main>
  );
};

export default Home;

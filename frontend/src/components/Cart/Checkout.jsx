import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PayPalButton from './PayPalButton';
import { useSelector, useDispatch } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { createCheckout } from "../../redux/slices/checkoutSlice"; // Adjust path if needed

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {cart, loading, error} = useSelector((state) => state.cart);
  const {user} = useSelector((state) => state.auth);
  const [checkoutID, setCheckoutID] = useState(null);
  const [shippingAddress, setShippingAddress] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    phone: "",
  });

  // Place conditional returns here, before any other return
  if(loading) return <p>Loading Cart...</p>;
  if(error) return <p>Error: {error}</p>;
  if(!cart ||!cart.products || cart.products.length === 0) 
    return <p>Cart is empty. Please add items to your cart before proceeding to checkout.</p>;

  const hasUnavailable = cart.products.some((item) => item.isAvailable === false);

  if(user && user.role === 'admin') {
    return <div className="max-w-2xl mx-auto p-8 text-center text-red-600 font-bold text-xl">Admins are not allowed to purchase products.</div>;
  }

  const handleCreateCheckout = async(e) => {
    e.preventDefault();
    if (cart && cart.products.length > 0){
      const res = await dispatch(
        createCheckout({
          checkoutItems: cart.products.map(item => ({
            ...item,
            quantity: 1 // Always 1 for thrift store logic
          })),
          shippingAddress,
          paymentMethod: "Paypal",
          totalPrice: cart.totalPrice,
        }));
        if(res.payload && res.payload._id){
          setCheckoutID(res.payload._id);//set checkout id if checkout was successful
        }
      }
    }

  const handlePaymentSuccess = async(details) => {
    try{
      const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/checkout/${checkoutID}/pay`,{
        paymentStatus: "paid", paymentDetails: details},
        {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      await handleFinalizeCheckout(checkoutID);//finalize checkouut if payment is successful
    }catch(error){
      console.error("Payment failed", error);
    }
  };

  const handleFinalizeCheckout = async(checkoutID) => {
    try{
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/checkout/${checkoutID}/finalize`,{},
        {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
    navigate("/order-confirmation");
    }catch(error){
      console.error(error);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto py-10 px-6 tracking-tighter">
      {/*Left Section */}
      <div className="bg-white rounded-lg p-6">
        <h2 className="text-2xl uppercase mb-6">Checkout</h2>
        <form onSubmit={handleCreateCheckout}>
          <h3 className="text-lg mb-4">Contact Details</h3>
          <div className=" mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              value={user?user.email:""}
              className="w-full p-2 border rounded"
              disabled
            />
          </div>
          <h3 className="text-lg mb-4">Delivery</h3>
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700">First Name</label>
              <input
                type="text"
                value={shippingAddress.firstName}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    firstName: e.target.value,
                  })
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Last Name</label>
              <input
                type="text"
                value={shippingAddress.lastName}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    lastName: e.target.value,
                  })
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Address</label>
            <input
              type="text"
              value={shippingAddress.address}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  address: e.target.value,
                })
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700">City</label>
              <input
                type="text"
                value={shippingAddress.city}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    city: e.target.value,
                  })
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Postal Code</label>
              <input
                type="text"
                value={shippingAddress.postalCode}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    postalCode: e.target.value,
                  })
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="mb-4 col-span-2">
              <label className="block text-gray-700">Phone</label>
              <input
                type="tel"
                value={shippingAddress.phone}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    phone: e.target.value,
                  })
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>
          <div className="mt-6">
            {!checkoutID ? (
              <button
                type="submit"
                className={`w-full bg-black text-white py-3 rounded ${hasUnavailable ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={hasUnavailable}
              >
                Continue to payment
              </button>
            ) : (
              <div>
                <h3 className="text-lg mb-4">Pay with PayPal</h3>
                <PayPalButton
                  amount={cart.totalPrice}
                  onSuccess={handlePaymentSuccess}
                  onError={() => toast.error("Payment failed. Try again.")}
                />
              </div>
            )}
            {hasUnavailable && (
              <p className="text-red-600 text-sm mt-2">
                Please remove unavailable items before proceeding to checkout.
              </p>
            )}
          </div>
        </form>
      </div>

      {/*Right Section */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg mb-4">Order Summary</h3>
        <div className="border-t py-4 mb-4">
          {cart.products.map((item, index) => (
            <div
              key={index}
              className="flex items-start justify-between py-2 border-b"
            >
              <div className="flex items-start">
                <img
                  src={item.image || '/placeholder.png'}
                  alt={item.name}
                  className="w-12 h-12 object-cover rounded mr-2"
                />
                <div>
                  <h3 className="text-md">{item.name}</h3>
                </div>
              </div>
              <p className="text-gray-500">${item.price.toLocaleString()}</p>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center text-lg mb-4">
          <p>Subtotal</p>
          <p>${cart.totalPrice.toLocaleString()}</p>
        </div>
        <div className="flex justify-between items-center text-lg">
          <p>Delivery</p>
          <p>Free</p>
        </div>
        <div className="flex justify-between items-center text-lg mt-4 border-t pt-4">
          <p>Total</p>
          <p>${cart.totalPrice.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

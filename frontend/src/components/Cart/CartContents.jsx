import { RiDeleteBin3Line } from "react-icons/ri";
import { useDispatch } from "react-redux";
import { removeItemFromCart } from "../../redux/slices/cartSlice";

const CartContents = ({ cart, userId, guestId }) => {
  const dispatch = useDispatch();

  const handleAddToCart = (productId, delta, quantity, size, color) => {
    const newQuantity = quantity + delta;

    if (newQuantity >= 1) {
      dispatch(
        updateCartItem({
          productId,
          quantity: newQuantity,
          size,
          color,
          guestId,
          userId,
        })
      );
    }
  };

  const handleRemoveFromCart = (productId, size, color) => {
    dispatch(
      removeItemFromCart({
        guestId,
        userId,
        productId,
        size,
        color,
      })
    );
  };

  return (
    <div>
      {cart.products.map((item) => (
        <div key={item.productId || item._id} className="flex items-center mb-4 p-2 rounded-lg bg-gray-50 shadow-sm">
          <img src={item.image || '/placeholder.png'} alt={item.name} className="w-16 h-16 min-w-16 min-h-16 max-w-16 max-h-16 object-cover rounded-md mr-4 border border-gray-200" />
          <div className="flex-1 min-w-0">
            <h4 className="text-base font-semibold truncate">{item.name}</h4>
            {item.isAvailable === false && (
              <span className="text-xs text-red-600 font-bold ml-2">Not Available</span>
            )}
          </div>
          <div className="ml-2 text-right min-w-[60px]">
            <p className="text-base font-semibold">${item.price}</p>
          </div>
          <button
            className="ml-2 text-gray-500 hover:text-red-600 transition"
            onClick={() => handleRemoveFromCart(item.productId, item.size, item.color)}
            aria-label="Remove from cart"
          >
            <RiDeleteBin3Line className="w-6 h-6" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default CartContents;

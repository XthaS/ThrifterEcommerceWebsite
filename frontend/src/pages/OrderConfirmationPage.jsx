import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { clearCart } from '../redux/slices/cartSlice.js'

const OrderConfirmationPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {checkout} = useSelector((state) => state.checkout);

    //clear the cart when order is confirmend
    useEffect(()=>{
        if (checkout && checkout._id) {
            dispatch(clearCart());
            localStorage.removeItem("cart");
        }else{
            navigate("/my-orders");
        }
    },[checkout,dispatch,navigate]);


    const calculateEstimatedDelivery=(createdAt)=> {
        const orderDate = new Date(createdAt);
        orderDate.setDate(orderDate.getDate()+10);//10 days of time
        return orderDate.toLocaleDateString();
    }
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
        <h1 className="text-4xl font-bold text-center text-emerald-700 mb-8">Thank you for ordering!</h1>

        {checkout && (
            <div className="p-6 rounded-lg border">
            <div className="flex justify-between mb-20">
                {/*order id and date */}
                <div>
                    <h2 className="text-xl font-semibold">
                        Order ID:{checkout._id}
                    </h2>
                    <p className="text-gray-500">
                        Order date:
                        {new Date(checkout.createdAt).toLocaleDateString()}
                    </p>

                </div>
                {/*Estimated delivery */}
                <div>
                    <p className="text-emerald-700 text-s">
                        Estimated Delivery: {calculateEstimatedDelivery(checkout.createdAt)}
                    </p>
                </div>
            </div>
            {/*Ordered Items */}
            <div className="mb-20">{checkout.checkoutItems.map((item)=>(
                <div key={item.productId} className="flex items-center mb-4">
                    <img src={item.image || '/placeholder.png'} alt={item.name} className="w-12 h-12 object-cover rounded mr-2" />
                    <div>
                        <h4 className="text-md font-semibold">
                            {item.name}
                        </h4>
                    </div> 
                    <div className="ml-auto text-right">
                        <p className="text-md">${item.price}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                </div>    
            ))}
            </div>
            {/*PAYMENT AND DELIVERY Info */}
            <div className="grid grid-cols-2 gap-8">{/*payment info */}
            <div>
                <h4 className="text-lg font-semibold mb-2">Payment</h4>
                <p className="text-gray-600">Paypal</p>
            </div>
            {/*Delivery info */}
            <div>
                <h4 className="text-lg font-semibold mb-2">Delivery</h4>
                <p className="text-gray-600">{checkout.shippingAddress.address}</p>
                <p className="text-gray-600">{checkout.shippingAddress.city}</p>
            </div>
            </div>
            </div>
        )}
      
    </div>
  )
}

export default OrderConfirmationPage

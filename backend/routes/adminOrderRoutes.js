const express = require("express");
const Order = require("../models/Order");
const {protect,admin} = require("../middleware/authMiddleware");
const Product = require("../models/Product");

const router = express.Router();

//@route GET /api/admin/orders
//@desc get all orders (admin only)
//@access Private/Admin
router.get("/",protect,admin,async(req,res)=>{
    try {
        const orders = await Order.find({}).populate("user","name email");
        res.json({ orders, totalOrders: orders.length });
    } catch (error) {
        console.error(error);
        res.status(500).json({message: error.message || "Server Error", error});
    }
});

//@route PUT /api/admin/orders/:id
//@desc update order status (admin only)
//@access Private/Admin
router.put("/:id",protect,admin,async(req,res)=>{
try {
    const order = await Order.findById(req.params.id).populate("user","name");
    if(order){
        order.status = req.body.status || order.status;
        order.isDelivered = 
        req.body.status === "Delivered" ? true : order.isDelivered;
        order.deliveredAt = 
        req.body.status === "Delivered" ? Date.now() : order.deliveredAt;

        // If just delivered, delete all products in the order
        if(req.body.status === "Delivered"){
            for(const item of order.orderItems){
                await Product.findByIdAndDelete(item.productId);
            }
        }

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    }else{
        res.status(404).json({message:"Order not found"});
    }
} catch (error) {
    console.error(error);
    res.status(500).json({message:"Server Error"});
}
});

//@ route Delete /api/admin/orders/:id
//@desc delete order (admin only)
//@access Private/Admin
router.delete("/:id",protect,admin,async(req,res)=>{
    try {
        const order = await Order.findById(req.params.id);
        if(order){
            await order.remove();
            res.json({message:"Order removed"});
        }else{
            res.status(404).json({message:"Order not found"});
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({message:"Server Error"});
    }
});

//@route GET /api/admin/orders/:id
//@desc get order details by id (admin only)
//@access Private/Admin
router.get('/:id', protect, admin, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name email');
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        // If user is missing (null), just return order with user as null
        res.json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message || 'Server Error', error });
    }
});

module.exports = router;
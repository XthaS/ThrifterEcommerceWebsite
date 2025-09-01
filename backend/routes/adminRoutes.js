const express = require("express");
const User = require("../models/User");
const{protect,admin} = require("../middleware/authMiddleware");

const router = express.Router();

//@route GET /api/admin/users
//@desc Get all users
//@access Private/Admin
router.get("/users",protect,admin,async(req,res)=>{
    try {
        const users = await User.find({});
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({message:"Server Error"});
    }
});

//@route GET /api/admin/users
//@desc add a new user , admin only
//@access Private/Admin
router.post("/users",protect,admin,async(req,res)=>{
    const {name,email,password,role} = req.body;
    try {
        let user = await User.findOne({email});
        if(user){
            return res.status(400).json({message:"User already exists"});
        }
        //create new user
        user = new User({
            name,
            email,
            password,
            role:role || "customer",
        });
        await user.save();
        res.status(201).json({message:"User created successfully",user});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: error.message || "Server Error", error});
    }
});
//@route PUT /api/admin/users/:id
//@desc update user info (admin only)-name, email, role
//@access Private/Admin
router.put("/users/:id",protect,admin,async(req,res)=>{
    try {
        const user = await User.findById(req.params.id);
        if(user){
            if(user.isPermanent && req.body.role && req.body.role !== user.role){
                return res.status(403).json({message: "Cannot change role of the permanent admin user."});
            }
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.role = req.body.role || user.role;
            await user.save();
        }
        const updatedUser = await user.save();
        res.json({message:"User info updated successfully",user:updatedUser});
    } catch (error) {
        console.error(error);
        res.status(500).json({message:"Server Error"});
    }
});

//@route DELETE /api/admin/users/:id
//@desc delete a user (admin only)
//@access Private/Admin
router.delete("/users/:id",protect,admin,async(req,res)=>{
    try {
       const user = await User.findById(req.params.id);
       if(user){
        if(user.isPermanent){
            return res.status(403).json({message: "Cannot delete the permanent admin user."});
        }
        // Delete related orders, carts, and checkouts
        const Order = require("../models/Order");
        const Cart = require("../models/Cart");
        const Checkout = require("../models/Checkout");
        await Order.deleteMany({ user: user._id });
        await Cart.deleteMany({ user: user._id });
        await Checkout.deleteMany({ user: user._id });
        await user.deleteOne();
        res.json({message:"User and related data deleted successfully"});
       }else{
        return res.status(404).json({message:"User not found"});
       }
    } catch (error) {
        console.error(error);
        res.status(500).json({message: error.message || "Server Error", error});
    }
}); 
module.exports = router;
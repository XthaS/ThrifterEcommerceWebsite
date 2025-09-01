const express = require("express");
const Cart= require("../models/Cart");
const Product=require("../models/Product");
const { protect } =require("../middleware/authMiddleware");
const User = require("../models/User");

const router = express.Router();

//helper function to get cart by user ID or guest ID
const getCart=async (userId, guestId)=>{
    if (userId){
        return await Cart.findOne({user: userId});
    } else if (guestId){
        return await Cart.findOne({ guestId });
    }
    return null;
};

//@route POST/api/cart
//@desc Add a product to the cart for a guest or logged in user
//@access Public
router.post("/",async (req,res)=>{
    const{productId, quantity, guestId, userId, size}=req.body;
    try{
        // Block admin users from adding to cart
        if (userId) {
            const user = await User.findById(userId);
            if (user && user.role === "admin") {
                return res.status(403).json({ message: "Admins are not allowed to add products to the cart." });
            }
        }
        // Default quantity to 1 if not provided or invalid
        const safeQuantity = (!quantity || isNaN(quantity) || quantity < 1) ? 1 : quantity;
        const product = await Product.findById(productId);
        
        if (!product) {
            return res.status(404).json({message: "Product not found"});
        }
        
        if (!product.isAvailable) {
            return res.status(400).json({message: "Product is not available"});
        }
        
        // Determine if user is logged in or guest
        let cart = await getCart(userId, guestId); // ✅ Fixed: was GeolocationCoordinates

        //if cart exists, update it
        if (cart){
            const productIndex=cart.products.findIndex(
                (p)=>
                p.productId.toString()===productId && p.size === size
            );

            if(productIndex > -1){ // ✅ Fixed: was productIndex >-1
                //If product already exists, update the quantity
                cart.products[productIndex].quantity += safeQuantity;
            } else{
                //add new product
                cart.products.push({
                    productId,
                    name: product.name,
                    image: product.images && product.images[0] && product.images[0].url ? product.images[0].url : "",
                    price: product.price,
                    quantity: safeQuantity,
                    size: size,
                });
            }
            //Recalculate the total price
            cart.totalPrice=cart.products.reduce(
                (acc,item)=> acc + item.price * item.quantity , 0);
            await cart.save();
            return res.status(200).json(cart);
        }else{
            //Create a new cart for the guest or user
            const newCart = await Cart.create({
                user: userId ? userId : undefined,
                guestId: guestId ? guestId: "guest_" + new Date().getTime(),
                products:[
                    {
                        productId,
                        name: product.name,
                        image: product.images && product.images[0] && product.images[0].url ? product.images[0].url : "",
                        price: product.price,
                        quantity: safeQuantity,
                        size: size,
                    },
                ],
                totalPrice: product.price * safeQuantity,
            });
            return res.status(201).json(newCart);
        }
    } catch(error){
        console.error(error);
        res.status(500).json({message:"Server Error"});
    }
});

//no quantity but if needede 9:43:00 in vid
//@route DELETE /api/cart
//@desc Remove a product from the cart
//@access Public
router.delete("/", async(req,res)=>{
    const{productId, guestId, userId}=req.body; // ✅ Fixed: was questId, now guestId
    try {
        let cart= await getCart(userId, guestId); // ✅ Fixed: was using undefined guestId variable

        if(!cart) return res.status(404).json({message:"cart not found"});

        const productIndex = cart.products.findIndex(
            (p)=>p.productId.toString() === productId && p.size === req.body.size
        );

        if(productIndex > -1){ // ✅ Fixed: added space between > and -1
            cart.products.splice(productIndex,1);

            cart.totalPrice=cart.products.reduce((acc,item)=>acc + item.price * item.quantity, 0); // ✅ Fixed: was item_quantity, now item.quantity
            await cart.save();
            return res.status(200).json(cart);
        } else{
            return res.status(404).json({message:"Product not found in cart"});
        }
    } catch (error) {
        console.error("Delete error:", error); // ✅ Added more descriptive error log
        return res.status(500).json({message:"Server Error", error: error.message}); // ✅ Added error details for debugging
    }
});

//@route GET/api/cart
//@desc Get logged-in user's or guest user's cart
//@access Public
router.get("/",async(req,res)=>{
    const {userId, guestId} =req.query;

    try{
       const cart = await getCart(userId, guestId);
       if(cart){
        res.json(cart);
       } else{
        res.status(404).json({message:"Cart not found"});
       }
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Server error"});
    }
});

// @route POST /api/cart/merge
//@desc Merge guest cart into user cart on login
//@access Private
router.post("/merge", protect, async(req, res) => {
    const { guestId } = req.body;
    
    // Debug logs
    console.log("Merge route called");
    console.log("guestId:", guestId);
    console.log("req.user:", req.user);
    console.log("req.user._id:", req.user._id);
    
    try {
        // Find guest cart and user cart
        const guestCart = await Cart.findOne({ guestId });
        const userCart = await Cart.findOne({ user: req.user._id });

        console.log("guestCart found:", !!guestCart);
        console.log("userCart found:", !!userCart);

        if (guestCart) {
            if (guestCart.products.length === 0) {
                return res.status(400).json({ message: "Guest Cart is empty" });
            }

            if (userCart) {
                // Merge guest cart into existing user cart
                guestCart.products.forEach((guestItem) => {
                    const productIndex = userCart.products.findIndex((item) => 
                        item.productId.toString() === guestItem.productId.toString() && item.size === guestItem.size
                    );

                    if (productIndex > -1) {
                        // If item exists in user cart, update the quantity
                        userCart.products[productIndex].quantity += guestItem.quantity;
                    } else {
                        // Otherwise, add guest item to user cart
                        userCart.products.push(guestItem);
                    }
                });

                // Recalculate total price
                userCart.totalPrice = userCart.products.reduce(
                    (acc, item) => acc + item.price * item.quantity,
                    0
                );
                await userCart.save();

                // Remove the guest cart after merging
                try {
                    await Cart.findOneAndDelete({ guestId });
                    console.log("Guest cart deleted successfully");
                } catch (error) {
                    console.error("Error deleting guest cart:", error);
                }

                res.status(200).json(userCart); // ✅ Fixed: was usercart, now userCart
            } else {
                // If user has no existing cart, assign the guest cart to the user
                guestCart.user = req.user._id;
                guestCart.guestId = undefined;
                await guestCart.save();

                res.status(200).json(guestCart);
            }
        } else {
            // Guest cart not found
            if (userCart) {
                // Guest cart has already been merged or doesn't exist, return user cart
                return res.status(200).json(userCart);
            }
            // Neither guest cart nor user cart exists
            res.status(404).json({ message: "No cart found to merge" }); // ✅ Updated message
        }
    } catch (error) {
        console.error("Merge error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});
module.exports = router;
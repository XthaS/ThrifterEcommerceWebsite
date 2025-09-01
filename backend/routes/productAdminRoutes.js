const express = require("express");
const Product = require("../models/Product");
const {protect,admin} = require("../middleware/authMiddleware");

const router = express.Router();

//@route GET /api/admin/products
//@desc get all products (admin only)
//@access Private/Admin
router.get("/",protect,admin,async(req,res)=>{
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({message:"Server Error"});
    }
});

// @route PUT /api/admin/products/:id
// @desc Update a product (admin only)
// @access Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        // Update fields
        Object.keys(req.body).forEach(key => {
            product[key] = req.body[key];
        });
        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route POST /api/admin/products
// @desc Create a product (admin only)
// @access Private/Admin
router.post('/', protect, admin, async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            countInStock,
            category,
            brand,
            size,
            material,
            gender,
            images
        } = req.body;

        if (!name || !description || !price || !category || !brand || !size || !material || !gender || !images || images.length === 0) {
            return res.status(400).json({ message: 'All required fields must be provided.' });
        }

        const product = new Product({
            name,
            description,
            price,
            countInStock: countInStock || 0,
            category,
            brand,
            size,
            material,
            gender,
            images,
            user: req.user._id
        });
        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
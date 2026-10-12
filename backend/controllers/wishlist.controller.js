const mongoose = require("mongoose");
const Customer = require("../models/customer.model");
const Product = require("../models/product.model");


// ADD PRODUCT TO WISHLIST
const addToWishlist = async (req, res) => {
    try {

        const { productId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID"
            });
        }

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        const alreadyExists = req.user.wishlist.some(
            id => id.toString() === productId
        );

        if (alreadyExists) {
            return res.status(409).json({
                success: false,
                message: "Product already in wishlist"
            });
        }

        req.user.wishlist.push(productId);

        await req.user.save();

        return res.status(201).json({
            success: true,
            message: "Product added to wishlist"
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Failed to add product to wishlist"
        });
    }
};


// GET MY WISHLIST
const getWishlist = async (req, res) => {
    try {

        const customer = await Customer.findById(req.user._id)
            .populate("wishlist");

        return res.status(200).json({
            success: true,
            count: customer.wishlist.length,
            wishlist: customer.wishlist
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch wishlist"
        });
    }
};


// REMOVE PRODUCT FROM WISHLIST
const removeFromWishlist = async (req, res) => {
    try {

        const { productId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID"
            });
        }

        const productIndex = req.user.wishlist.findIndex(
            id => id.toString() === productId
        );

        if (productIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "Product not found in wishlist"
            });
        }

        req.user.wishlist.splice(productIndex, 1);

        await req.user.save();

        return res.status(200).json({
            success: true,
            message: "Product removed from wishlist"
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Failed to remove product from wishlist"
        });
    }
};


module.exports = {
    addToWishlist,
    getWishlist,
    removeFromWishlist
};
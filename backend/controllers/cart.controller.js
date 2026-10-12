const mongoose = require("mongoose");
const Product = require("../models/product.model");

// ADD PRODUCT TO CART
const addToCart = async (req, res) => {
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

        const cartItem = req.user.cart.find(
            item => item.product.toString() === productId
        );

        if (cartItem) {
            if (cartItem.quantity + 1 > product.stock) {
                return res.status(400).json({
                    success: false,
                    message: "Requested quantity exceeds available stock"
                });
            }

            cartItem.quantity += 1;
        } else {
            if (product.stock < 1) {
                return res.status(400).json({
                    success: false,
                    message: "Product is out of stock"
                });
            }

            req.user.cart.push({
                product: productId,
                quantity: 1
            });
        }

        await req.user.save();

        return res.status(200).json({
            success: true,
            message: "Cart updated",
            cart: req.user.cart
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Failed to add product to cart"
        });
    }
};


// GET CART
const getCart = async (req, res) => {
    try {
        const customer = await req.user.populate({
            path: "cart.product"
        });

        return res.status(200).json({
            success: true,
            count: customer.cart.length,
            cart: customer.cart
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch cart"
        });
    }
};


// UPDATE CART QUANTITY
const updateCartQuantity = async (req, res) => {
    try {
        const { productId } = req.params;
        const { quantity } = req.body;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID"
            });
        }

        if (
            typeof quantity !== "number" ||
            !Number.isInteger(quantity) ||
            quantity < 1
        ) {
            return res.status(400).json({
                success: false,
                message: "Quantity must be a positive integer"
            });
        }

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        const cartItem = req.user.cart.find(
            item => item.product.toString() === productId
        );

        if (!cartItem) {
            return res.status(404).json({
                success: false,
                message: "Product not found in cart"
            });
        }

        if (quantity > product.stock) {
            return res.status(400).json({
                success: false,
                message: "Requested quantity exceeds available stock"
            });
        }

        cartItem.quantity = quantity;

        await req.user.save();

        return res.status(200).json({
            success: true,
            message: "Cart quantity updated",
            cart: req.user.cart
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Failed to update cart quantity"
        });
    }
};


// REMOVE FROM CART
const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID"
            });
        }

        const cartItemIndex = req.user.cart.findIndex(
            item => item.product.toString() === productId
        );

        if (cartItemIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "Product not found in cart"
            });
        }

        req.user.cart.splice(cartItemIndex, 1);

        await req.user.save();

        return res.status(200).json({
            success: true,
            message: "Product removed from cart",
            cart: req.user.cart
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Failed to remove product from cart"
        });
    }
};


module.exports = {
    addToCart,
    getCart,
    updateCartQuantity,
    removeFromCart
};


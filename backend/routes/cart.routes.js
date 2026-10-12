const express = require("express");

const {
    addToCart,
    getCart,
    updateCartQuantity,
    removeFromCart
} = require("../controllers/cart.controller");

const protect = require("../middlewares/auth.middleware");

const router = express.Router();


// ADD PRODUCT TO CART
router.post(
    "/:productId",
    protect,
    addToCart
);


// GET CART
router.get(
    "/",
    protect,
    getCart
);


// UPDATE CART QUANTITY
router.patch(
    "/:productId",
    protect,
    updateCartQuantity
);


// REMOVE PRODUCT FROM CART
router.delete(
    "/:productId",
    protect,
    removeFromCart
);


module.exports = router;


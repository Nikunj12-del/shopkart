
const express = require("express");

const {
    createPaymentOrder,
    retryPayment,
    verifyPayment,
    getOrders,
    getOrderById,
    deletePendingOrder
} = require("../controllers/order.controller");

const protect = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/create-payment-order", protect, createPaymentOrder);
router.post("/verify-payment", protect, verifyPayment);

router.get("/", protect, getOrders);

// Keep this route before the dynamic GET /:id route.
router.post("/:id/retry-payment", protect, retryPayment);
router.delete("/:id", protect, deletePendingOrder);

router.get("/:id", protect, getOrderById);

module.exports = router;

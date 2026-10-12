
const mongoose = require("mongoose");
const crypto = require("crypto");

const Order = require("../models/order.model");
const Customer = require("../models/customer.model");
const Product = require("../models/product.model");
const razorpay = require("../config/razorpay");

const createPaymentOrder = async (req, res) => {
    let order;

    try {
        const { shippingAddress } = req.body;

        if (!shippingAddress) {
            return res.status(400).json({
                success: false,
                message: "Shipping address is required"
            });
        }

        const {
            fullName, phone, addressLine1,
            city, state, pincode
        } = shippingAddress;

        if (
            !fullName?.trim() ||
            !phone?.trim() ||
            !addressLine1?.trim() ||
            !city?.trim() ||
            !state?.trim() ||
            !pincode?.trim()
        ) {
            return res.status(400).json({
                success: false,
                message: "All shipping address fields are required"
            });
        }

        if (!/^\d{10}$/.test(phone.trim())) {
            return res.status(400).json({
                success: false,
                message: "Phone number must contain 10 digits"
            });
        }

        if (!/^\d{6}$/.test(pincode.trim())) {
            return res.status(400).json({
                success: false,
                message: "Pincode must contain 6 digits"
            });
        }

        const customer = await Customer.findById(req.user._id);

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Customer not found"
            });
        }

        if (!customer.cart?.length) {
            return res.status(400).json({
                success: false,
                message: "Cart is empty"
            });
        }

        const orderItems = [];
        let totalAmount = 0;

        for (const cartItem of customer.cart) {
            if (!mongoose.Types.ObjectId.isValid(cartItem.product)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid product in cart"
                });
            }

            const product = await Product.findById(cartItem.product);

            if (!product) {
                return res.status(400).json({
                    success: false,
                    message: "A product in your cart is no longer available"
                });
            }

            if (
                !Number.isInteger(cartItem.quantity) ||
                cartItem.quantity < 1 ||
                cartItem.quantity > product.stock
            ) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for ${product.name}`
                });
            }

            totalAmount += product.price * cartItem.quantity;

            orderItems.push({
                product: product._id,
                name: product.name,
                price: product.price,
                quantity: cartItem.quantity,
                image: product.image
            });
        }

        order = await Order.create({
            user: customer._id,
            items: orderItems,
            shippingAddress: {
                fullName: fullName.trim(),
                phone: phone.trim(),
                addressLine1: addressLine1.trim(),
                city: city.trim(),
                state: state.trim(),
                pincode: pincode.trim()
            },
            totalAmount,
            paymentStatus: "PENDING",
            status: "PENDING_PAYMENT"
        });

        const razorpayOrder = await razorpay.orders.create({
            amount: Math.round(totalAmount * 100),
            currency: "INR",
            receipt: order._id.toString()
        });

        order.razorpayOrderId = razorpayOrder.id;
        await order.save();

        return res.status(201).json({
            success: true,
            message: "Payment order created successfully",
            orderId: order._id,
            razorpayOrderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            keyId: process.env.RAZORPAY_KEY_ID
        });
    } catch (error) {
        console.log("Create payment order error:", error);

        // Keep the database order if Razorpay creation failed.
        // It can be recovered later using Retry Payment.
        return res.status(500).json({
            success: false,
            message: "Failed to create payment order. You can retry payment."
        });
    }
};

const retryPayment = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order ID"
            });
        }

        const order = await Order.findOne({
            _id: id,
            user: req.user._id
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        if (
            order.paymentStatus !== "PENDING" ||
            order.status !== "PENDING_PAYMENT"
        ) {
            return res.status(400).json({
                success: false,
                message: "Only pending payment orders can be retried"
            });
        }

        if (order.razorpayOrderId) {
            // Check whether the old Razorpay order has a payment
            // that must not be charged again.
            const result = await razorpay.orders.fetchPayments(
                order.razorpayOrderId
            );

            const payments = result.items || [];

            const activePayment = payments.find((payment) =>
                ["authorized", "captured"].includes(payment.status)
            );

            if (activePayment) {
                return res.status(409).json({
                    success: false,
                    message:
                        "A payment is already authorized or captured. Contact support before retrying."
                });
            }

            const existing = await razorpay.orders.fetch(
                order.razorpayOrderId
            );

            if (
                existing.status === "created" ||
                existing.status === "attempted"
            ) {
                return res.status(200).json({
                    success: true,
                    orderId: order._id,
                    razorpayOrderId: existing.id,
                    amount: existing.amount,
                    currency: existing.currency,
                    keyId: process.env.RAZORPAY_KEY_ID
                });
            }

            // Do not silently replace an existing, unusable reference.
            return res.status(409).json({
                success: false,
                message:
                    "The existing Razorpay order cannot be reused. Contact support to resolve this payment."
            });
        }

        // Missing reference: recover the existing pending order.
        const razorpayOrder = await razorpay.orders.create({
            amount: Math.round(order.totalAmount * 100),
            currency: "INR",
            receipt: order._id.toString()
        });

        order.razorpayOrderId = razorpayOrder.id;
        await order.save();

        return res.status(200).json({
            success: true,
            message: "Payment retry initialized",
            orderId: order._id,
            razorpayOrderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            keyId: process.env.RAZORPAY_KEY_ID
        });
    } catch (error) {
        console.log("Retry payment error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to retry payment"
        });
    }
};

const verifyPayment = async (req, res) => {
    try {
        const {
            orderId,
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body;

        if (
            !orderId ||
            !razorpay_order_id ||
            !razorpay_payment_id ||
            !razorpay_signature
        ) {
            return res.status(400).json({
                success: false,
                message: "Payment details are required"
            });
        }

        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order ID"
            });
        }

        const order = await Order.findOne({
            _id: orderId,
            user: req.user._id
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        if (
            order.paymentStatus === "PAID" &&
            order.status === "PLACED"
        ) {
            return res.status(200).json({
                success: true,
                message: "Payment already verified",
                order
            });
        }

        if (
            order.paymentStatus !== "PENDING" ||
            order.status !== "PENDING_PAYMENT"
        ) {
            return res.status(400).json({
                success: false,
                message: "This order cannot be paid"
            });
        }

        if (order.razorpayOrderId !== razorpay_order_id) {
            return res.status(400).json({
                success: false,
                message: "Razorpay order does not match"
            });
        }

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");

        const receivedBuffer = Buffer.from(razorpay_signature);
        const expectedBuffer = Buffer.from(expectedSignature);

        if (
            receivedBuffer.length !== expectedBuffer.length ||
            !crypto.timingSafeEqual(receivedBuffer, expectedBuffer)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid payment signature"
            });
        }

        const payment = await razorpay.payments.fetch(
            razorpay_payment_id
        );

        if (
            payment.order_id !== razorpay_order_id ||
            payment.status !== "captured" ||
            payment.amount !== Math.round(order.totalAmount * 100) ||
            payment.currency !== "INR"
        ) {
            return res.status(400).json({
                success: false,
                message: "Payment has not been captured successfully"
            });
        }

        const customer = await Customer.findById(req.user._id);

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Customer not found"
            });
        }

        // Atomically reserve stock for each item.
        // If any item fails, restore earlier decrements.
        const decrementedProducts = [];

        for (const item of order.items) {
            const updatedProduct = await Product.findOneAndUpdate(
                {
                    _id: item.product,
                    stock: { $gte: item.quantity }
                },
                {
                    $inc: { stock: -item.quantity }
                },
                { new: true }
            );

            if (!updatedProduct) {
                for (const previous of decrementedProducts) {
                    await Product.updateOne(
                        { _id: previous.productId },
                        { $inc: { stock: previous.quantity } }
                    );
                }

                return res.status(409).json({
                    success: false,
                    message:
                        `Payment captured, but stock is unavailable for ${item.name}. Contact support for a refund or resolution.`
                });
            }

            decrementedProducts.push({
                productId: item.product,
                quantity: item.quantity
            });
        }

        order.paymentStatus = "PAID";
        order.status = "PLACED";
        order.razorpayPaymentId = razorpay_payment_id;

        await order.save();

        customer.cart = [];
        await customer.save();

        return res.status(200).json({
            success: true,
            message: "Payment verified and order placed successfully",
            order
        });
    } catch (error) {
        console.log("Verify payment error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to verify payment. Check order status before retrying."
        });
    }
};

const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            user: req.user._id
        }).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            orders
        });
    } catch (error) {
        console.log("Get orders error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch orders"
        });
    }
};

const getOrderById = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order ID"
            });
        }

        const order = await Order.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        return res.status(200).json({
            success: true,
            order
        });
    } catch (error) {
        console.log("Get order error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch order"
        });
    }
};

const deletePendingOrder = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order ID"
            });
        }

        const order = await Order.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        if (
            order.paymentStatus !== "PENDING" ||
            order.status !== "PENDING_PAYMENT"
        ) {
            return res.status(400).json({
                success: false,
                message: "Only pending payment orders can be deleted"
            });
        }

        if (order.razorpayOrderId) {
            const result = await razorpay.orders.fetchPayments(
                order.razorpayOrderId
            );

            const payments = result.items || [];

            if (
                payments.some((payment) =>
                    ["authorized", "captured"].includes(payment.status)
                )
            ) {
                return res.status(409).json({
                    success: false,
                    message:
                        "Payment is authorized or captured. Refresh the order status before deleting."
                });
            }
        }

        await Order.deleteOne({ _id: order._id });

        return res.status(200).json({
            success: true,
            message: "Pending order deleted successfully"
        });
    } catch (error) {
        console.log("Delete pending order error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to delete order"
        });
    }
};

module.exports = {
    createPaymentOrder,
    retryPayment,
    verifyPayment,
    getOrders,
    getOrderById,
    deletePendingOrder
};

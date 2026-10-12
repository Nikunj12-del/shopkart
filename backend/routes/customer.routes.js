const express = require("express");

const router = express.Router();

const {
    registerCustomer,
    loginCustomer,
    getMyProfile,
    logoutCustomer
} = require("../controllers/customer.controller");

const protect = require("../middlewares/auth.middleware");


// Register
router.post(
    "/register",
    registerCustomer
);


// Login
router.post(
    "/login",
    loginCustomer
);


// My Profile
router.get(
    "/me",
    protect,
    getMyProfile
);


// Logout
router.post(
    "/logout",
    logoutCustomer
);


module.exports = router;
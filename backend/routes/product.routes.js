const express = require("express");

const {
    createProduct,
    getAllProducts,
    getSingleProduct
} = require("../controllers/product.controller");

const router = express.Router();

router.post("/", createProduct);

router.get("/", getAllProducts);

router.get("/:id", getSingleProduct);

module.exports = router;
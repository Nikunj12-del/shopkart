const mongoose = require("mongoose");
const Product = require("../models/product.model");

// CREATE PRODUCT
const createProduct = async (req, res) => {
    try {

        const {
            name,
            description,
            price,
            category,
            image,
            stock
        } = req.body;

        if (
            !name ||
            !description ||
            !category ||
            !image ||
            price === undefined ||
            stock === undefined
        ) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        if (typeof price !== "number" || price <= 0) {
            return res.status(400).json({
                success: false,
                message: "Price must be a number greater than 0"
            });
        }

        if (typeof stock !== "number" || stock < 0) {
            return res.status(400).json({
                success: false,
                message: "Stock must be a number greater than or equal to 0"
            });
        }

        const product = await Product.create({
            name,
            description,
            price,
            category,
            image,
            stock
        });

        return res.status(201).json({
            success: true,
            message: "Product created successfully",
            product
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Failed to create product",
            error: error.message
        });

    }
};


// GET ALL PRODUCTS + SEARCH + CATEGORY
const getAllProducts = async (req, res) => {
    try {

        const {
            search,
            category
        } = req.query;

        let query = {};

        // SEARCH
        if (search) {

            query.name = {
                $regex: search,
                $options: "i"
            };

        }

        // CATEGORY
        if (category) {

            if (category === "Other") {

                query.category = {
                    $nin: [
                        "Electronics",
                        "Clothing",
                        "Books",
                        "Home"
                    ]
                };

            } else {

                query.category = category;

            }

        }

        const products = await Product.find(query)
            .select("name price category image stock");

        return res.status(200).json({
            success: true,
            count: products.length,
            products
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Failed to fetch products",
            error: error.message
        });

    }
};


// GET SINGLE PRODUCT
const getSingleProduct = async (req, res) => {
    try {

        const {
            id
        } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {

            return res.status(400).json({
                success: false,
                message: "Invalid product ID"
            });

        }

        const product = await Product.findById(id);

        if (!product) {

            return res.status(404).json({
                success: false,
                message: "Product not found"
            });

        }

        return res.status(200).json({
            success: true,
            product
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Failed to fetch product",
            error: error.message
        });

    }
};


module.exports = {
    createProduct,
    getAllProducts,
    getSingleProduct
};
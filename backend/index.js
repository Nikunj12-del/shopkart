
require("dotenv").config();

const dns = require("dns");

dns.setServers([
    "8.8.8.8",
    "8.8.4.4"
]);

const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const customerRoutes = require("./routes/customer.routes");
const productRoutes = require("./routes/product.routes");
const wishlistRoutes = require("./routes/wishlist.routes");
const cartRoutes = require("./routes/cart.routes");
const orderRoutes = require("./routes/order.routes");

const app = express();

const PORT = process.env.PORT || 8085;
const frontendOrigin = (process.env.FRONTEND_URL || "http://localhost:5173")
    .replace(/\/+$/, "");
const allowedOrigins = new Set([
    frontendOrigin,
    "http://localhost:5173",
    "http://127.0.0.1:5173"
]);

// MIDDLEWARE
app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.has(origin)) {
                callback(null, true);
                return;
            }

            callback(new Error("Not allowed by CORS"));
        },
        credentials: true
    })
);

app.use(express.json());
app.use(cookieParser());

// ROUTES
app.use("/customers", customerRoutes);
app.use("/products", productRoutes);
app.use("/wishlist", wishlistRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", orderRoutes);

app.get("/health", (req, res) => {
    res.json({
        status: "ok",
        message: "ShopKart server is running"
    });
});

// HOME ROUTE
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "ShopKart Authentication Server Running"
    });
});

// DATABASE CONNECTION
mongoose
    .connect(process.env.dbUrl)
    .then(() => {
        console.log("DB Connected");

        app.listen(PORT, () => {
            console.log(`Server started on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.log("Database connection failed");
        console.log(error);
    });

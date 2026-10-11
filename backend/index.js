require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 8085;

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "ShopKart backend is running" });
});

app.get("/", (req, res) => {
  res.json({ success: true, message: "ShopKart backend is ready" });
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});

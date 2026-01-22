const express = require("express");
const router = express.Router();
const { getProducts } = require("../controllers/productController");

// Jalur GET /api/products
router.get("/", getProducts);

module.exports = router;

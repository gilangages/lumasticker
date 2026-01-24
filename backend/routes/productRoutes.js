const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const verifyToken = require("../middleware/authMiddleware");

/// Public Route
router.get("/", productController.getAllProducts);

// Protected Routes (Hanya Admin yang punya Token yang bisa akses)
// Catatan: Pastikan kamu sudah buat fungsi createProduct & deleteProduct di controller
router.post("/", verifyToken, productController.createProduct);
router.delete("/:id", verifyToken, productController.deleteProduct);

module.exports = router;

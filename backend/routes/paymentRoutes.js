const express = require("express");
const router = express.Router();
const { createTransaction, handleNotification } = require("../controllers/paymentController");

// Jalur: POST /api/payment/purchase
router.post("/purchase", createTransaction);
router.post("/notification", handleNotification);

module.exports = router;

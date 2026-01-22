const db = require("../config/database");

// Fungsi mengambil semua produk
const getProducts = async (req, res) => {
  try {
    // Query ke Database
    const [rows] = await db.query("SELECT * FROM products");

    // Kirim jawaban (Response) ke Frontend
    res.status(200).json({
      success: true,
      message: "List Data Produk",
      data: rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

module.exports = { getProducts };

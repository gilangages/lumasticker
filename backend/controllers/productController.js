const db = require("../config/database");

// 1. Ganti nama jadi getAllProducts (biar cocok sama routes)
const getAllProducts = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM products ORDER BY id DESC");

    // Parsing JSON images jika ada
    const products = rows.map((product) => ({
      ...product,
      images: typeof product.images === "string" ? JSON.parse(product.images) : product.images || [product.image_url],
    }));

    res.status(200).json({
      success: true,
      message: "List Data Produk",
      data: products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const createProduct = async (req, res) => {
  // Tambahkan file_url jika ini produk digital (sesuai API spec)
  const { name, price, description, images, file_url } = req.body;

  // Validasi sederhana
  if (!name || !price) {
    return res.status(400).json({ success: false, message: "Nama dan Harga wajib diisi!" });
  }

  // Logic gambar (Thumbail & Gallery)
  const mainImage = images && images.length > 0 ? images[0] : "https://placehold.co/600x400";
  const imagesJson = JSON.stringify(images || []);

  try {
    // Pastikan kolom file_url ada di database kamu. Jika belum, hapus bagian file_url.
    const query =
      "INSERT INTO products (name, price, description, image_url, images, file_url) VALUES (?, ?, ?, ?, ?, ?)";

    const [result] = await db.query(query, [name, price, description, mainImage, imagesJson, file_url || null]);

    res.status(201).json({
      success: true,
      message: "Produk berhasil ditambahkan!",
      data: {
        id: result.insertId,
        name,
        price,
        description,
        image_url: mainImage,
        file_url,
      },
    });
  } catch (error) {
    console.error("Error create product:", error);
    res.status(500).json({ success: false, message: "Gagal menyimpan produk", error: error.message });
  }
};

// 3. Tambahkan fungsi Delete (karena dipanggil di routes)
const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    // Cek dulu apakah produk ada (Opsional, tapi best practice)
    const [check] = await db.query("SELECT * FROM products WHERE id = ?", [id]);
    if (check.length === 0) {
      return res.status(404).json({ success: false, message: "Produk tidak ditemukan" });
    }

    // Lakukan penghapusan
    await db.query("DELETE FROM products WHERE id = ?", [id]);

    res.status(200).json({
      success: true,
      message: "Produk berhasil dihapus",
    });
  } catch (error) {
    console.error("Error delete product:", error);
    res.status(500).json({ success: false, message: "Gagal menghapus produk", error: error.message });
  }
};

// Pastikan export namanya SAMA dengan yang di atas
module.exports = { getAllProducts, createProduct, deleteProduct };

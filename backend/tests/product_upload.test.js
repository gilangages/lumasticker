// 1. Setup Environment Variables PALING ATAS
const path = require("path");
const dotenv = require("dotenv");

// Paksa load .env dari folder backend (satu level di atas folder tests)
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// Fallback: Jika DB_USER tidak terbaca dari .env, gunakan default umum (root)
// Ini mengatasi error "Access denied for user ''@'localhost'"
if (!process.env.DB_USER) {
  console.warn("⚠️ Peringatan: DB_USER tidak ditemukan di .env, menggunakan default 'root'");
  process.env.DB_USER = "root";
}
if (process.env.DB_PASS === undefined) {
  process.env.DB_PASS = "";
}

if (!process.env.DB_NAME) {
  // GANTI 'nama_database_kamu' dengan nama database asli di phpMyAdmin/MySQL kamu
  const defaultDB = "lumastore_db";
  console.warn(`⚠️ Peringatan: DB_NAME tidak ditemukan di .env, menggunakan default '${defaultDB}'`);
  process.env.DB_NAME = defaultDB;
}

const request = require("supertest");
const express = require("express");
const db = require("../config/database");
const productController = require("../controllers/productController");
const upload = require("../middleware/uploadMiddleware");

// Setup App Khusus Testing
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- FAKE AUTH MIDDLEWARE (Bypass Login) ---
// Kita paksa req.user ada isinya agar controller menganggap kita admin
const mockAuth = (req, res, next) => {
  req.user = { id: 999, role: "admin", email: "test@admin.com" };
  next();
};

// --- RAKIT ROUTE MANUAL ---
// Route ini dirakit di dalam test agar terisolasi dan mudah didebug
app.post("/api/products", mockAuth, upload.array("images"), productController.createProduct);

describe("POST /api/products (Upload Feature)", () => {
  const testProductName = "Produk Test Upload " + Date.now();

  it("should upload multiple images and save product to database", async () => {
    // Debugging: Pastikan koneksi DB config benar
    // console.log("Testing DB Connection with User:", process.env.DB_USER);

    const res = await request(app)
      .post("/api/products")
      .field("name", testProductName)
      .field("price", 50000)
      .field("description", "Ini deskripsi test dengan gambar")
      // Simulasi upload file (membuat file palsu di memori)
      .attach("images", Buffer.from("fake image data 1"), "foto1.jpg")
      .attach("images", Buffer.from("fake image data 2"), "foto2.png");

    // Jika masih error, log response body untuk melihat pesan error detail
    if (res.statusCode !== 201) {
      console.error("❌ Test Failed Response:", res.body);
    }

    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe(testProductName);

    // Validasi apakah gambar tersimpan sebagai array URL
    expect(Array.isArray(res.body.data.images)).toBe(true);
    expect(res.body.data.images.length).toBe(2);
    expect(res.body.data.images[0]).toMatch(/\/uploads\//);
  });

  it("should fail if name or price is missing", async () => {
    const res = await request(app).post("/api/products").field("description", "Lupa nama dan harga");

    expect(res.statusCode).toEqual(400);
  });
  it("should fail if description is missing", async () => {
    // Kita kirim nama & harga & gambar, TAPI deskripsi kosong
    const res = await request(app)
      .post("/api/products")
      .field("name", "Produk Tanpa Deskripsi")
      .field("price", 50000)
      // .field("description", "...") // HAPUS INI
      .attach("images", Buffer.from("fake"), "foto.jpg");

    expect(res.statusCode).toEqual(400);

    // [FIX] Sesuaikan pesan dengan Controller (huruf kecil 'd' dan kalimat lengkap)
    expect(res.body.message).toContain("deskripsi wajib diisi");
    // ATAU bisa juga cek pesan lengkapnya:
    // expect(res.body.message).toBe("Nama, harga, dan deskripsi wajib diisi!");
  });

  it("should fail if image is missing", async () => {
    // Kita kirim semua data text, TAPI lupa attach gambar
    const res = await request(app)
      .post("/api/products")
      .field("name", "Produk Tanpa Gambar")
      .field("price", 50000)
      .field("description", "Ini deskripsi ada");
    // .attach("images", ...) // HAPUS INI

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toContain("Minimal upload 1 gambar");
  });
});

afterAll(async () => {
  // Bersihkan data sampah hasil test dari database
  try {
    await db.query("DELETE FROM products WHERE name LIKE 'Produk Test Upload%'");
  } catch (err) {
    console.error("Gagal membersihkan data test:", err);
  }

  // Tutup koneksi agar Jest bisa selesai
  await db.end();
});

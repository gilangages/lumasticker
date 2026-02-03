// backend/tests/product_upload.test.js

const request = require("supertest");
const express = require("express");
const path = require("path");
const dotenv = require("dotenv");

// Load Env
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// ==========================================
// 1. MOCK LIBRARY "mysql2" (CRITICAL FIX)
// ==========================================
// Kita mematikan 'mysql2' dari akarnya.
// Saat config/database.js memanggil mysql.createPool, dia dapat objek palsu ini.
// Tidak ada koneksi asli yang dibuat -> Tidak ada timeout.
jest.mock("mysql2", () => {
  return {
    createPool: jest.fn(() => ({
      // Ini method .promise() yang dipanggil di config/database.js
      promise: jest.fn(() => ({
        // Ini fungsi db.query yang dipakai controller
        query: jest.fn().mockResolvedValue([{ insertId: 100, affectedRows: 1 }]),
        end: jest.fn().mockResolvedValue(),
      })),
      // Ini menangani pool.getConnection() yang ada di config/database.js
      // Kita langsung callback sukses agar tidak error/hanging
      getConnection: jest.fn((cb) => cb(null, { release: jest.fn() })),
    })),
  };
});

// ==========================================
// 2. MOCK CLOUDINARY & MULTER
// ==========================================
// Mencegah upload file beneran ke internet
jest.mock("cloudinary", () => ({
  v2: {
    config: jest.fn(),
    uploader: { upload: jest.fn() },
  },
}));

jest.mock("multer-storage-cloudinary", () => ({
  CloudinaryStorage: jest.fn().mockImplementation(() => ({
    _handleFile: (req, file, cb) => {
      // Langsung sukses pura-pura
      cb(null, {
        path: `https://fake-cloudinary.com/${file.originalname}`,
        filename: file.originalname,
        size: 5000,
        mimetype: file.mimetype,
      });
    },
    _removeFile: (req, file, cb) => cb(null),
  })),
}));

// Import Controller & Middleware (Setelah Mock terpasang)
const productController = require("../controllers/productController");
const upload = require("../middleware/uploadMiddleware");

// Setup App Express
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mock Auth Middleware
app.use((req, res, next) => {
  req.user = { id: 1, role: "admin" };
  next();
});

// Route
app.post("/api/products", upload.array("images"), productController.createProduct);

describe("POST /api/products (Mocked mysql2)", () => {
  // Timeout besar hanya untuk jaga-jaga, tapi aslinya ini bakal < 1 detik
  jest.setTimeout(30000);

  it("should upload successfully (201 Created)", async () => {
    const res = await request(app)
      .post("/api/products")
      .field("name", "Produk Anti Timeout")
      .field("price", 150000)
      .field("description", "Deskripsi mantap")
      .attach("images", Buffer.from("dummy-file"), "test.jpg");

    // Jika masih gagal, log errornya
    if (res.statusCode !== 201) {
      console.log("Response Body:", res.body);
    }

    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);

    // Cek URL palsu
    const images = res.body.data.images;
    const url = Array.isArray(images) ? images[0].url || images[0] : images;
    expect(url).toContain("fake-cloudinary.com");
  });

  it("should return 400 if validation fails", async () => {
    const res = await request(app)
      .post("/api/products")
      .field("price", 50000) // Name hilang
      .attach("images", Buffer.from("dummy"), "test.jpg");

    expect(res.statusCode).toEqual(400);
  });
});

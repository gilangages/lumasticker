// backend/tests/product_upload.test.js
const request = require("supertest");
const express = require("express");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(__dirname, "../.env") });

// === 1. MOCK MYSQL2 ===
jest.mock("mysql2", () => ({
  createPool: jest.fn(() => ({
    promise: jest.fn(() => ({
      query: jest.fn().mockResolvedValue([{ insertId: 100, affectedRows: 1 }]),
      end: jest.fn().mockResolvedValue(),
    })),
    getConnection: jest.fn((cb) => cb(null, { release: jest.fn() })),
  })),
}));

// === 2. MOCK CLOUDINARY & MULTER ===
// Kita mock 'multer' agar tidak perlu menulis file fisik saat test
// Kita simulasikan perilaku mode PRODUCTION (Cloudinary) untuk test ini
jest.mock("../middleware/uploadMiddleware", () => {
  const multer = require("multer");
  // Mock Storage Engine
  const storage = multer.memoryStorage();

  return {
    upload: multer({ storage }), // Pakai memory storage biar gak nyampah file
    cloudinary: {
      uploader: { destroy: jest.fn() }, // Mock fungsi destroy
    },
  };
});

// Karena kita mock middleware, kita harus manual inject file.path
// agar Controller bisa membacanya seperti behaviour aslinya
const productController = require("../controllers/productController");

// Setup App
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mock Auth
app.use((req, res, next) => {
  req.user = { id: 1, role: "admin" };
  next();
});

// === MIDDLEWARE INTERCEPTOR KHUSUS TEST ===
// Ini meniru apa yang dilakukan multer-storage-cloudinary / diskStorage
// yaitu mengisi req.files[i].path
const mockFileProcessor = (req, res, next) => {
  if (req.files) {
    req.files = req.files.map((f) => ({
      ...f,
      // Pura-pura ini URL dari Cloudinary atau Local path
      path: "https://fake-cloudinary.com/lumastore_products/test-image.jpg",
      filename: "test-image.jpg",
      originalname: "test-image.jpg",
    }));
  }
  next();
};

const { upload } = require("../middleware/uploadMiddleware"); // Mocked version

app.post(
  "/api/products",
  upload.array("images"),
  mockFileProcessor, // Tambahkan interceptor ini
  productController.createProduct,
);

describe("POST /api/products", () => {
  // Set Environment ke Production untuk test path ini
  const OLD_ENV = process.env;
  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV, NODE_ENV: "production" };
  });
  afterAll(() => {
    process.env = OLD_ENV;
  });

  it("should upload successfully and return correct URL structure", async () => {
    const res = await request(app)
      .post("/api/products")
      .field("name", "Produk Test")
      .field("price", 150000)
      .field("description", "Deskripsi")
      // Kirim file dummy
      .attach("images", Buffer.from("dummy"), "test.jpg");

    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);

    // Pastikan URL yang disimpan adalah URL dari "Cloudinary" (mocked path)
    const images = res.body.data.images;
    expect(images[0]).toContain("fake-cloudinary.com");
  });

  it("should return 400 if validation fails", async () => {
    const res = await request(app)
      .post("/api/products")
      .field("price", 50000) // Name hilang
      .attach("images", Buffer.from("dummy"), "test.jpg");

    expect(res.statusCode).toEqual(400);
  });
});

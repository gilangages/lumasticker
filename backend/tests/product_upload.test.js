// backend/tests/product_upload.test.js
const request = require("supertest");
const express = require("express");
const path = require("path");
const productController = require("../controllers/productController");

// === 1. MOCK DATABASE ===
// Kita mock db.query agar tidak perlu koneksi MySQL asli
jest.mock("../config/database", () => ({
  query: jest.fn(),
}));
const db = require("../config/database");

// === 2. MOCK CLOUDINARY ===
jest.mock("../middleware/uploadMiddleware", () => ({
  cloudinary: {
    uploader: { destroy: jest.fn() },
  },
}));

// === 3. SETUP EXPRESS APP UNTUK TEST ===
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mock Middleware Multer (Simulasi req.files)
// Kita buat middleware dinamis agar bisa test beda scenario (Local vs Prod)
const mockUploadMiddleware = (req, res, next) => {
  // Simulasi data file yang dihasilkan Multer
  req.files = [
    {
      fieldname: "images",
      originalname: "test-sticker.jpg",
      encoding: "7bit",
      mimetype: "image/jpeg",
      destination: "public/uploads",
      filename: "test-sticker-123.jpg",
      path: req.isProductionMock
        ? "https://res.cloudinary.com/demo/image/upload/sample.jpg" // Cloudinary Path
        : "public/uploads/test-sticker-123.jpg", // Local Disk Path
      size: 1024,
    },
  ];
  next();
};

app.post("/api/products", mockUploadMiddleware, productController.createProduct);

describe("POST /api/products - Upload Logic", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    process.env = { ...OLD_ENV }; // Reset env
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  test("Should create product with CLOUDINARY URL in PRODUCTION", async () => {
    // 1. Set ENV ke Production
    process.env.NODE_ENV = "production";

    // 2. Mock DB Success
    db.query.mockResolvedValue([{ insertId: 100 }]);

    // 3. Inject flag ke request agar mock middleware tau kita mau simulasi path Cloudinary
    const res = await request(app)
      .post("/api/products")
      .send({
        name: "Stiker Production",
        price: 50000,
        description: "Deskripsi Pro",
        image_labels: JSON.stringify(["Tampak Depan"]),
      })
      .set("Content-Type", "multipart/form-data") // Pura-pura upload
      .use((req) => {
        req.isProductionMock = true;
      }); // Custom hook untuk mock middleware

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);

    const savedImage = res.body.data.images[0];
    // Pastikan URL yang disimpan langsung dari Cloudinary
    expect(savedImage.url).toContain("https://res.cloudinary.com");
    expect(savedImage.label).toBe("Tampak Depan");
  });

  test("Should create product with LOCALHOST URL in DEVELOPMENT", async () => {
    // 1. Set ENV ke Development
    process.env.NODE_ENV = "development";
    process.env.PORT = "5000";

    // 2. Mock DB Success
    db.query.mockResolvedValue([{ insertId: 101 }]);

    // 3. Request (Tanpa flag isProductionMock, jadi akan simulasi path local)
    const res = await request(app)
      .post("/api/products")
      .field("name", "Stiker Local")
      .field("price", 15000)
      .field("description", "Deskripsi Loc")
      .field("image_labels", JSON.stringify(["Label A"]));

    expect(res.statusCode).toBe(201);

    const savedImage = res.body.data.images[0];

    // === POIN PENTING UNTUK LOCAL ===
    // Controller harus mengubah 'public/uploads/file.jpg'
    // menjadi 'http://127.0.0.1:xxxxx/uploads/file.jpg'
    expect(savedImage.url).toMatch(/http:\/\/127\.0\.0\.1:\d+\/uploads\/test-sticker-123\.jpg/);
    // ATAU jika pakai localhost
    // expect(savedImage.url).toContain("/uploads/test-sticker-123.jpg");
  });

  test("Should fail if required fields are missing", async () => {
    const res = await request(app).post("/api/products").field("price", 15000); // Nama hilang

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toContain("wajib diisi");
  });
});

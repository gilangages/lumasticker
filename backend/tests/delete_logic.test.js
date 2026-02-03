// backend/tests/delete_logic.test.js

// 1. MOCK DATABASE (Paling Atas)
// Gunakan factory function () => ({...}) agar file asli 'config/database.js' TIDAK PERNAH dieksekusi.
// Ini akan mencegah error "Menggunakan koneksi Cloud (TiDB)" dan error "cesu8".
jest.mock("../config/database", () => {
  return {
    query: jest.fn(),
    end: jest.fn(), // Mock fungsi end() jaga-jaga
    // Tambahkan method lain jika controller memakainya
  };
});

// 2. MOCK CLOUDINARY & MIDDLEWARE
jest.mock("../middleware/uploadMiddleware", () => ({
  cloudinary: {
    uploader: {
      destroy: jest.fn().mockResolvedValue({ result: "ok" }),
    },
  },
  upload: {},
}));

// 3. Baru import file yang mau dites
const { deleteProduct } = require("../controllers/productController");
const db = require("../config/database"); // Ini sekarang akan memanggil mock di atas
const { cloudinary } = require("../middleware/uploadMiddleware");

// Mock Response Express
const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("Product Deletion Logic", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Harus menghapus SEMUA gambar (cloudinary) yang ada di produk", async () => {
    // 1. Setup Mock Data
    const mockImages = JSON.stringify([
      { url: "https://res.cloudinary.com/demo/image/upload/v1/folder/img2.jpg" },
      { url: "https://res.cloudinary.com/demo/image/upload/v1/folder/img3.jpg" },
    ]);
    const mockProduct = {
      id: 1,
      image_url: "https://res.cloudinary.com/demo/image/upload/v1/folder/img1.jpg",
      images: mockImages,
    };

    // Mock return values untuk query database
    // Query ke-1: SELECT -> return array produk
    db.query.mockResolvedValueOnce([[mockProduct]]);
    // Query ke-2: DELETE -> return sukses
    db.query.mockResolvedValueOnce([{ affectedRows: 1 }]);

    const req = { params: { id: 1 } };
    const res = mockRes();

    // 2. Jalankan Fungsi
    await deleteProduct(req, res);

    // 3. Assertions (Pembuktian)
    // Pastikan destroy dipanggil 3 kali (sesuai jumlah gambar)
    expect(cloudinary.uploader.destroy).toHaveBeenCalledTimes(3);

    // Cek detail pemanggilan
    expect(cloudinary.uploader.destroy).toHaveBeenCalledWith("folder/img1");
    expect(cloudinary.uploader.destroy).toHaveBeenCalledWith("folder/img2");
    expect(cloudinary.uploader.destroy).toHaveBeenCalledWith("folder/img3");

    // Pastikan response sukses
    expect(res.status).toHaveBeenCalledWith(200);
  });
});

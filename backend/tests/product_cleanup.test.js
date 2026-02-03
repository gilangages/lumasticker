const { deleteProduct } = require("../controllers/productController");
const db = require("../config/database");
const { cloudinary } = require("../middleware/uploadMiddleware");

// --- MOCKING ---
jest.mock("../config/database");
jest.mock("../middleware/uploadMiddleware", () => ({
  cloudinary: {
    uploader: {
      destroy: jest.fn(), // Kita pantau fungsi ini dipanggil berapa kali
    },
  },
  upload: {},
}));

describe("Product Cleanup Logic", () => {
  let req, res;

  beforeEach(() => {
    req = { params: { id: 1 } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks(); // Reset hitungan mock sebelum tiap test
  });

  test("Harus menghapus SEMUA gambar (Array + Legacy URL) tanpa sisa", async () => {
    // Skenario: Produk punya 3 gambar di array, dan image_url menunjuk ke salah satunya
    // Total unik URL = 3.
    const mockProduct = {
      id: 1,
      name: "Stiker Keren",
      // image_url menunjuk ke gambar pertama
      image_url: "https://res.cloudinary.com/demo/image/upload/v1/folder/img1.jpg",
      // images array berisi 3 gambar (termasuk img1)
      images: JSON.stringify([
        { url: "https://res.cloudinary.com/demo/image/upload/v1/folder/img1.jpg" },
        { url: "https://res.cloudinary.com/demo/image/upload/v1/folder/img2.jpg" },
        { url: "https://res.cloudinary.com/demo/image/upload/v1/folder/img3.png" },
      ]),
    };

    // Mock DB Select
    db.query.mockResolvedValueOnce([[mockProduct]]);
    // Mock DB Delete (Success)
    db.query.mockResolvedValueOnce([{ affectedRows: 1 }]);
    // Mock Cloudinary Destroy (Success)
    cloudinary.uploader.destroy.mockResolvedValue({ result: "ok" });

    await deleteProduct(req, res);

    // 1. Pastikan status 200
    expect(res.status).toHaveBeenCalledWith(200);

    // 2. CHECK CLOUDINARY CALLS
    // Logikanya: img1 (duplicate di image_url & images) + img2 + img3 = 3 file unik
    // Fungsi destroy harus dipanggil TEPAT 3 kali.
    expect(cloudinary.uploader.destroy).toHaveBeenCalledTimes(3);

    // 3. Cek apakah Public ID yang diekstrak benar (tanpa ekstensi)
    expect(cloudinary.uploader.destroy).toHaveBeenCalledWith("folder/img1");
    expect(cloudinary.uploader.destroy).toHaveBeenCalledWith("folder/img2");
    expect(cloudinary.uploader.destroy).toHaveBeenCalledWith("folder/img3");
  });

  test("Harus menangani URL dengan Query Params agar tidak gagal hapus", async () => {
    const mockProduct = {
      id: 2,
      // URL dengan query params ?v=123 (sering bikin regex error)
      image_url: "https://res.cloudinary.com/demo/image/upload/v1/folder/imgA.jpg?width=500",
      images: "[]",
    };

    db.query.mockResolvedValueOnce([[mockProduct]]);
    db.query.mockResolvedValueOnce([{ affectedRows: 1 }]);
    cloudinary.uploader.destroy.mockResolvedValue({ result: "ok" });

    await deleteProduct(req, res);

    // Harus berhasil ekstrak "folder/imgA" tanpa "?width=500"
    expect(cloudinary.uploader.destroy).toHaveBeenCalledWith("folder/imgA");
  });
});

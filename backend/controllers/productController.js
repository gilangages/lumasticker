const db = require("../config/database");
const { cloudinary } = require("../middleware/uploadMiddleware"); // Import cloudinary
const fs = require("fs");
const path = require("path");

// Helper Parse JSON
const safeParseJSON = (jsonString, fallback = []) => {
  try {
    return JSON.parse(jsonString);
  } catch (e) {
    return fallback;
  }
};

// === HELPER BARU: Hapus File (Cerdas mendeteksi Cloudinary vs Local) ===
const deleteFile = async (fileUrl) => {
  if (!fileUrl) return;

  try {
    // A. Jika file dari Cloudinary
    if (fileUrl.includes("cloudinary.com")) {
      // URL contoh: https://res.cloudinary.com/.../lumastore_products/namafile.jpg
      // Kita butuh public_id: "lumastore_products/namafile"
      const splitUrl = fileUrl.split("/");
      const filenameWithExt = splitUrl.pop();
      const folder = splitUrl.pop(); // lumastore_products (atau folder lain jika ada)

      // Ambil nama file tanpa ekstensi (.jpg)
      const publicId = `${folder}/${filenameWithExt.split(".")[0]}`;

      await cloudinary.uploader.destroy(publicId);
      console.log(`[Cloudinary] Deleted: ${publicId}`);
    }
    // B. Jika file Local
    else {
      // URL contoh: http://localhost:5000/uploads/file-123.jpg
      const filename = fileUrl.split("/").pop();
      const filePath = path.join(__dirname, "../public/uploads", filename);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`[Local] Deleted: ${filePath}`);
      }
    }
  } catch (error) {
    // Kita log saja, jangan throw error agar proses utama tidak gagal
    console.error("Gagal menghapus file lama:", error.message);
  }
};

// 1. Get All Products
const getAllProducts = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM products WHERE is_deleted = 0 ORDER BY id DESC");

    const products = rows.map((product) => {
      let images = [];
      if (typeof product.images === "string") {
        images = safeParseJSON(product.images, []);
      } else if (Array.isArray(product.images)) {
        images = product.images;
      } else if (product.image_url) {
        images = [product.image_url];
      }

      const normalizedImages = images.map((img) => {
        if (typeof img === "string") {
          const filename = img.split("/").pop();
          return { url: img, label: filename };
        }
        return {
          ...img,
          label: img.label || img.url.split("/").pop(),
        };
      });

      return { ...product, images: normalizedImages };
    });

    res.status(200).json({ success: true, message: "List Data Produk", data: products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Create Product
const createProduct = async (req, res) => {
  try {
    const { name, price, description, file_url, image_labels } = req.body;

    if (!name || !price || !description) {
      return res.status(400).json({ success: false, message: "Nama, harga, dan deskripsi wajib diisi!" });
    }
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: "Minimal upload 1 gambar produk!" });
    }

    const labels = safeParseJSON(image_labels);
    const protocol = req.protocol;
    const host = req.get("host");
    const isProduction = process.env.NODE_ENV === "production";

    // === LOGIC PENENTUAN URL ===
    const imageObjects = req.files.map((file, index) => {
      let finalUrl;

      if (isProduction) {
        // Cloudinary: URL sudah disediakan oleh library di file.path
        finalUrl = file.path;
      } else {
        // Local: file.path adalah path disk komputer, kita butuh URL Browser
        // Pastikan di index.js sudah ada: app.use('/uploads', express.static('public/uploads'));
        finalUrl = `${protocol}://${host}/uploads/${file.filename}`;
      }

      return {
        url: finalUrl,
        label: labels[index] || file.originalname.split(".")[0],
        order: index,
      };
    });

    const mainImage = imageObjects[0].url;
    const imagesJson = JSON.stringify(imageObjects);

    const query =
      "INSERT INTO products (name, price, description, image_url, images, file_url) VALUES (?, ?, ?, ?, ?, ?)";
    const [result] = await db.query(query, [name, price, description, mainImage, imagesJson, file_url || null]);

    res.status(201).json({
      success: true,
      message: "Produk berhasil ditambahkan",
      data: {
        id: result.insertId,
        name,
        price,
        description,
        images: imageObjects.map((img) => img.url),
      },
    });
  } catch (error) {
    console.error("Error createProduct:", error);
    res.status(500).json({ success: false, message: "Gagal menambahkan produk" });
  }
};

// 3. Delete Product (Hard Delete -> Hapus Gambar)
const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    // Ambil data dulu untuk tahu gambar mana yang harus dihapus
    const [existing] = await db.query("SELECT images, image_url FROM products WHERE id = ?", [id]);

    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: "Produk tidak ditemukan" });
    }

    // Coba Hard Delete di DB
    await db.query("DELETE FROM products WHERE id = ?", [id]);

    // === CLEANUP GAMBAR SETELAH BERHASIL DELETE DB ===
    // Kita lakukan di background (tidak perlu await strict) agar response cepat
    const product = existing[0];
    let imagesToDelete = [];

    // Kumpulkan semua URL gambar dari produk ini
    if (product.images) {
      const parsed = safeParseJSON(product.images);
      parsed.forEach((img) => imagesToDelete.push(img.url || img));
    }
    // Cek juga kolom legacy image_url
    if (product.image_url && !imagesToDelete.includes(product.image_url)) {
      imagesToDelete.push(product.image_url);
    }

    // Eksekusi hapus fisik
    imagesToDelete.forEach((url) => deleteFile(url));

    res.status(200).json({ success: true, message: "Produk berhasil dihapus!" });
  } catch (error) {
    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      try {
        await db.query("UPDATE products SET is_deleted = 1 WHERE id = ?", [id]);
        return res.status(200).json({ success: true, message: "Produk diarsipkan karena memiliki riwayat transaksi." });
      } catch (updateError) {
        return res
          .status(500)
          .json({ success: false, message: "Gagal mengarsipkan produk", error: updateError.message });
      }
    }
    console.error("Delete Error:", error);
    res.status(500).json({ success: false, message: "Gagal menghapus produk", error: error.message });
  }
};

// 4. Update Product (Hapus gambar yang dibuang user saat edit)
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price, description, images_metadata } = req.body;

  try {
    // 1. Ambil Data Lama
    const [existing] = await db.query("SELECT * FROM products WHERE id = ?", [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: "Produk tidak ditemukan" });
    }

    const oldProduct = existing[0];
    let oldImagesList =
      typeof oldProduct.images === "string" ? safeParseJSON(oldProduct.images) : oldProduct.images || [];
    // Standarisasi jadi array of URL string
    let oldUrls = oldImagesList.map((img) => (img.url ? img.url : img));

    let finalImages = [];

    // 2. Proses Metadata Baru
    if (images_metadata) {
      const metadata = safeParseJSON(images_metadata);
      const protocol = req.protocol;
      const host = req.get("host");
      const isProduction = process.env.NODE_ENV === "production";
      let newFileIndex = 0;

      finalImages = metadata
        .map((item) => {
          if (item.type === "existing") {
            return { url: item.url, label: item.label, order: item.order };
          } else if (item.type === "new") {
            if (req.files && req.files[newFileIndex]) {
              const file = req.files[newFileIndex];
              newFileIndex++;

              // Logic URL Local vs Prod
              let url;
              if (isProduction) {
                url = file.path; // Cloudinary URL
              } else {
                url = `${protocol}://${host}/uploads/${file.filename}`; // Local URL
              }

              return {
                url: url,
                label: item.label || file.originalname.split(".")[0],
                order: item.order,
              };
            }
          }
          return null;
        })
        .filter(Boolean);

      // === LOGIC HAPUS GAMBAR LAMA YANG HILANG ===
      // Cari URL yang ada di database LAMA, tapi TIDAK ADA di metadata BARU
      const newUrls = finalImages.map((img) => img.url);
      const urlsToDelete = oldUrls.filter((oldUrl) => !newUrls.includes(oldUrl));

      // Hapus file fisik yang dibuang
      urlsToDelete.forEach((url) => deleteFile(url));
    } else {
      // Fallback Logic (Jika frontend tidak kirim metadata)
      // ... Kode fallback sama seperti sebelumnya, dipersingkat ...
      finalImages = oldImagesList;
      if (req.files && req.files.length > 0) {
        // ... Logic append ...
      }
    }

    const finalMainImage = finalImages.length > 0 ? finalImages[0].url : null;
    const finalImagesJson = JSON.stringify(finalImages);

    await db.query("UPDATE products SET name = ?, price = ?, description = ?, image_url = ?, images = ? WHERE id = ?", [
      name,
      price,
      description,
      finalMainImage,
      finalImagesJson,
      id,
    ]);

    res.status(200).json({ success: true, message: "Produk berhasil diupdate!", data: { images: finalImages } });
  } catch (error) {
    console.error("Error update product:", error);
    res.status(500).json({ success: false, message: "Gagal update produk", error: error.message });
  }
};

// 5. Bulk Delete
const bulkDeleteProducts = async (req, res) => {
  const { ids } = req.body;
  if (!ids || ids.length === 0) return res.status(400).json({ success: false, message: "Tidak ada ID" });

  let deletedCount = 0;
  let archivedCount = 0;
  let errorCount = 0;

  try {
    for (const id of ids) {
      try {
        // Ambil info gambar dulu
        const [rows] = await db.query("SELECT images FROM products WHERE id = ?", [id]);

        // Hard Delete
        await db.query("DELETE FROM products WHERE id = ?", [id]);

        // Jika sukses delete DB, hapus gambar
        if (rows.length > 0) {
          const imgs = safeParseJSON(rows[0].images, []);
          imgs.forEach((img) => deleteFile(img.url || img));
        }

        deletedCount++;
      } catch (error) {
        if (error.code === "ER_ROW_IS_REFERENCED_2") {
          // Soft Delete
          await db.query("UPDATE products SET is_deleted = 1 WHERE id = ?", [id]);
          archivedCount++;
        } else {
          errorCount++;
        }
      }
    }

    // ... Susun pesan response ...
    let messageParts = [];
    if (deletedCount > 0) messageParts.push(`${deletedCount} dihapus permanen`);
    if (archivedCount > 0) messageParts.push(`${archivedCount} diarsipkan`);

    res
      .status(200)
      .json({ success: true, message: `Sukses: ${messageParts.join(", ")}`, data: { deletedCount, archivedCount } });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = { getAllProducts, createProduct, deleteProduct, updateProduct, bulkDeleteProducts };

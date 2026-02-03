const mysql = require("mysql2");
require("dotenv").config();

let pool;

// Konfigurasi umum agar tidak error 'cesu8'
const commonConfig = {
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: "utf8mb4", // [FIX 1] Paksa utf8mb4 agar driver tidak bingung dengan cesu8
};

// Cek apakah ada DATABASE_URL di .env (Prioritas untuk TiDB/Production)
if (process.env.DATABASE_URL) {
  if (process.env.NODE_ENV !== "test") {
    console.log("🌐 Menggunakan koneksi Cloud (TiDB)...");
  }

  pool = mysql.createPool({
    uri: process.env.DATABASE_URL,
    ...commonConfig,
    ssl: {
      rejectUnauthorized: true,
      minVersion: "TLSv1.2",
    },
  });
} else {
  if (process.env.NODE_ENV !== "test") {
    console.log("🏠 Menggunakan koneksi Localhost...");
  }

  pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "",
    database: process.env.DB_NAME || "lumastore_db",
    ...commonConfig,
  });
}

// Menggunakan Promise Wrapper
const db = pool.promise();

// [FIX 2] Jangan jalankan "Cek Koneksi" saat sedang Test (Jest)
// Ini mencegah error "Jest has been torn down" karena koneksi async yang telat.
if (process.env.NODE_ENV !== "test") {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("❌ Gagal Terhubung ke Database:", err.message);
    } else {
      console.log("✅ Berhasil Terhubung ke Database!");
      connection.release();
    }
  });
}

module.exports = db;

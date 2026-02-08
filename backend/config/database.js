// backend/config/database.js
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

// Cek Environment: Apakah sedang di Production?
const isProduction = process.env.NODE_ENV === "production";

// [LOGIC BARU] Hanya gunakan TiDB (DATABASE_URL) jika BENAR-BENAR di Production
// Atau jika kita sengaja memaksa lewat variabel khusus (opsional, tapi aman)
if (isProduction && process.env.DATABASE_URL) {
  console.log("🌐 [Production] Menggunakan koneksi Cloud (TiDB)...");

  pool = mysql.createPool({
    uri: process.env.DATABASE_URL,
    ...commonConfig,
    ssl: {
      rejectUnauthorized: true,
      minVersion: "TLSv1.2",
    },
  });
} else {
  // Jika di Local / Development / Test, gunakan settingan Localhost
  if (process.env.NODE_ENV !== "test") {
    console.log("🏠 [Development] Menggunakan koneksi Localhost...");
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
if (process.env.NODE_ENV !== "test") {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("❌ Gagal Terhubung ke Database:", err.message);
      console.error("   Pastikan XAMPP/MySQL Local sudah nyala jika di Development!");
    } else {
      console.log("✅ Berhasil Terhubung ke Database!");
      connection.release();
    }
  });
}

module.exports = db;

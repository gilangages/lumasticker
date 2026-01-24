const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  // Ambil header Authorization: "Bearer <token>"
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ success: false, message: "Akses ditolak. Token tidak ada." });
  }

  try {
    // Gunakan secret key yang sama dengan saat login
    // 'LUMA_SECRET_KEY' sebaiknya ditaruh di .env
    const verified = jwt.verify(token, process.env.JWT_SECRET || "rahasia_negara_luma");
    req.user = verified;
    next();
  } catch (error) {
    res.status(403).json({ success: false, message: "Token tidak valid." });
  }
};

module.exports = verifyToken;

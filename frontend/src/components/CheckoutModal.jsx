import { X, Lock, CheckCircle, Star } from "lucide-react";
import { useState } from "react";

export const CheckoutModal = ({ isOpen, onClose, product, onSubmit }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  if (!isOpen || !product) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(product, name, email);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-teal-900/60 backdrop-blur-sm p-4 transition-all">
      {/* Modal Container: Lebar dan Responsif */}
      <div className="bg-[#fffbf0] w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-bounce-in relative max-h-[90vh] overflow-y-auto md:overflow-hidden">
        {/* Tombol Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white/50 hover:bg-white p-2 rounded-full text-teal-800 transition backdrop-blur-sm">
          <X size={20} />
        </button>

        {/* KOLOM KIRI: Detail Produk (Visual) */}
        <div className="w-full md:w-1/2 bg-teal-50 p-8 flex flex-col justify-center relative overflow-hidden">
          {/* Background Decor */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-emerald-100/50 to-teal-200/30 z-0"></div>

          <div className="relative z-10">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-64 object-cover rounded-2xl shadow-lg mb-6 transform rotate-1 hover:rotate-0 transition-all duration-500"
              onError={(e) => {
                e.target.src = "https://placehold.co/600x400?text=No+Image";
              }}
            />
            <h2 className="text-3xl font-extrabold text-teal-900 mb-2">{product.name}</h2>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex text-yellow-500">
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
              </div>
              <span className="text-sm text-teal-600 font-bold">(Best Seller)</span>
            </div>
            <p className="text-teal-700 leading-relaxed mb-6 bg-white/50 p-4 rounded-xl border border-teal-100">
              {product.description ||
                "Deskripsi lengkap produk akan muncul di sini. Aset ini sangat cocok untuk kebutuhan kreatifmu."}
            </p>
            <div className="flex items-center gap-2 text-emerald-700 text-sm font-bold">
              <CheckCircle size={16} /> <span>File siap download instan</span>
              <CheckCircle size={16} /> <span>Lisensi komersial</span>
            </div>
          </div>
        </div>

        {/* KOLOM KANAN: Form Pembayaran */}
        <div className="w-full md:w-1/2 p-8 bg-white flex flex-col justify-center">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-800">Lengkapi Pesanan</h3>
            <p className="text-gray-500 text-sm">File akan dikirim ke emailmu.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Nama Kamu</label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none"
                placeholder="cth: Ghibli Fan"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Email Penerima</label>
              <input
                type="email"
                required
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none"
                placeholder="email@aktif.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Total Harga Box */}
            <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex justify-between items-center">
              <span className="text-emerald-800 font-bold">Total Bayar</span>
              <span className="text-2xl font-extrabold text-emerald-600">
                Rp {parseInt(product.price).toLocaleString("id-ID")}
              </span>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-200 transform active:scale-95 transition-all mt-2 flex justify-center items-center gap-2">
              <Lock size={18} />
              Bayar Sekarang
            </button>

            <p className="text-center text-xs text-gray-400 mt-4">Pembayaran aman didukung oleh Midtrans.</p>
          </form>
        </div>
      </div>
    </div>
  );
};

import { useEffect, useState } from "react";
import { getAllProducts } from "../../../lib/api/ProductApi";
import { ShoppingBag, DollarSign, Image as ImageIcon } from "lucide-react";

export default function DashboardOverview() {
  const [stats, setStats] = useState({ total: 0, totalPrice: 0 });

  useEffect(() => {
    // Kita pakai API get products untuk hitung statistik sederhana
    getAllProducts().then(async (res) => {
      if (res.success) {
        const products = res.data;
        const total = products.length;
        // Hitung estimasi nilai aset (hanya contoh logic)
        const totalPrice = products.reduce((acc, curr) => acc + parseInt(curr.price), 0);
        setStats({ total, totalPrice });
      }
    });
  }, []);

  return (
    <div className="max-w-6xl mx-auto animate-slide-up">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-[#3e362e]">Ringkasan Toko</h1>
        <p className="text-[#8c8478]">Selamat datang kembali di LumaStore Admin.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border-2 border-[#e5e0d8] shadow-sm flex items-center gap-4">
          <div className="p-4 bg-[#f3f0e9] rounded-full text-[#3e362e]">
            <ShoppingBag size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Produk</p>
            <h3 className="text-2xl font-bold text-[#3e362e]">{stats.total} Item</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border-2 border-[#e5e0d8] shadow-sm flex items-center gap-4">
          <div className="p-4 bg-[#e8f5e9] rounded-full text-[#2e7d32]">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Nilai Aset (Est)</p>
            <h3 className="text-2xl font-bold text-[#3e362e]">Rp {stats.totalPrice.toLocaleString("id-ID")}</h3>
          </div>
        </div>

        {/* Card info tambahan */}
        <div className="bg-[#3e362e] p-6 rounded-xl shadow-md text-white">
          <h3 className="font-bold text-lg mb-2">Status Server</h3>
          <p className="text-sm text-gray-300">
            Backend: <span className="text-green-400 font-bold">Online</span>
          </p>
          <p className="text-sm text-gray-300">Mode: Production</p>
        </div>
      </div>

      <div className="bg-[#fffde7] border border-yellow-200 p-4 rounded-lg text-yellow-800 text-sm">
        💡 <strong>Tips:</strong> Gunakan menu "Upload Produk" untuk menambahkan koleksi stiker baru, dan "Daftar
        Produk" untuk mengelola harga atau menghapus item.
      </div>
    </div>
  );
}

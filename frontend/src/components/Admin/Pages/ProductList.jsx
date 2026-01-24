import { useState, useEffect } from "react";
import { getAllProducts } from "../../../lib/api/ProductApi";
import { Image as ImageIcon, Edit, Trash2, Search, RefreshCw } from "lucide-react";
import { alertError } from "../../../lib/alert";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true); // Tambahkan state loading

  // Gunakan useEffect standar React (Best Practice)
  useEffect(() => {
    fetchProducts();
  }, []); // [] artinya jalan sekali pas komponen muncul

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      // Tambahkan timestamp agar browser tidak mengambil data cache
      const res = await getAllProducts();
      if (res.success) {
        setProducts(res.data);
      } else {
        // Jika gagal tapi bukan error (misal data kosong dari server)
        setProducts([]);
      }
    } catch (error) {
      console.error("Gagal ambil produk", error);
      alertError("Gagal mengambil data produk");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProducts = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="max-w-6xl mx-auto animate-slide-up">
      <header className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#3e362e]">Daftar Produk</h1>
          <p className="text-[#8c8478]">Kelola semua stiker yang sudah diupload.</p>
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          {/* Search Bar */}
          <div className="relative flex-grow md:flex-grow-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Cari produk..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border-2 border-[#e5e0d8] rounded-lg focus:border-[#8da399] outline-none w-full md:w-64"
            />
          </div>
          {/* Tombol Refresh Manual */}
          <button
            onClick={fetchProducts}
            className="p-2 bg-[#f3f0e9] rounded-lg hover:bg-[#e5e0d8] text-[#3e362e] transition"
            title="Refresh Data">
            <RefreshCw size={20} className={isLoading ? "animate-spin" : ""} />
          </button>
        </div>
      </header>

      {/* TAMPILAN LOADING */}
      {isLoading ? (
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#3e362e]"></div>
          <p className="text-gray-400 mt-2">Memuat produk...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        /* TAMPILAN KOSONG */
        <div className="text-center py-20 bg-white border-2 border-dashed border-[#e5e0d8] rounded-xl">
          <p className="text-gray-400 italic">
            {products.length === 0 ? "Belum ada produk." : "Produk tidak ditemukan."}
          </p>
        </div>
      ) : (
        /* LIST PRODUK */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white border border-[#e5e0d8] rounded-xl overflow-hidden hover:shadow-lg transition-all group relative">
              {/* Image Section */}
              <div className="h-48 bg-gray-100 relative overflow-hidden">
                <img
                  src={product.image_url || "https://placehold.co/400"}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => (e.target.src = "https://placehold.co/400?text=Error")}
                />
                {product.images && product.images.length > 1 && (
                  <span className="absolute bottom-2 right-2 text-xs bg-black/60 text-white px-2 py-1 rounded flex items-center gap-1 backdrop-blur-sm">
                    <ImageIcon size={12} /> +{product.images.length - 1}
                  </span>
                )}
              </div>

              {/* Content Section */}
              <div className="p-4">
                <h3 className="font-bold text-[#3e362e] text-lg line-clamp-1" title={product.name}>
                  {product.name}
                </h3>
                <p className="text-[#8da399] font-bold text-lg mb-2">
                  Rp {parseInt(product.price).toLocaleString("id-ID")}
                </p>
                <p className="text-xs text-gray-400 line-clamp-2 mb-4 h-8">{product.description}</p>

                {/* Buttons */}
                <div className="flex gap-2 pt-3 border-t border-[#f3f0e9]">
                  <button
                    onClick={() => alert("Segera!")}
                    className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-bold text-[#3e362e] bg-[#f3f0e9] rounded hover:bg-[#e5e0d8]">
                    <Edit size={16} /> Edit
                  </button>
                  <button
                    onClick={() => alert("Segera!")}
                    className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-bold text-red-500 bg-red-50 rounded hover:bg-red-100">
                    <Trash2 size={16} /> Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

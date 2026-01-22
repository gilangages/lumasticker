import { ProductCard } from "./ProductCard";
import { Sparkles } from "lucide-react";

export const ProductShowcase = ({ products, loading, onBuy }) => {
  return (
    <main id="products" className="max-w-6xl mx-auto px-6 py-16">
      {/* HEADER: RATA TENGAH (Paling Aman & Rapi) */}
      <div className="text-center mb-12">
        <span className="bg-[#EAE7DF] text-[#3E362E] px-4 py-1.5 rounded-full text-xs font-bold border border-[#E5E0D8] inline-block mb-3">
          Update Terbaru
        </span>
        <h2 className="text-3xl md:text-4xl font-black text-[#3E362E] mb-3 flex items-center justify-center gap-2">
          Koleksi Stiker ✂️
        </h2>
        <p className="text-[#6B5E51] font-medium max-w-lg mx-auto">
          Pilih paket stiker favoritmu, selesaikan pembayaran, dan file siap didownload instan.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-32 text-[#8DA399] font-medium animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-[#E5E0D8] border-t-[#8DA399] rounded-full animate-spin mb-4"></div>
          Sedang menyiapkan stiker...
        </div>
      ) : (
        <div className="flex flex-col items-center">
          {/* GRID PRODUK (Flex Center) */}
          <div className="flex flex-wrap justify-center gap-8 w-full mb-16">
            {products.length > 0 ? (
              products.map((product) => (
                <div key={product.id} className="w-full sm:w-[320px]">
                  <ProductCard product={product} onBuy={onBuy} />
                </div>
              ))
            ) : (
              <p className="w-full text-center text-[#6B5E51]">Belum ada produk yang ditampilkan.</p>
            )}
          </div>

          {/* INFO COMING SOON (Animasi Muncul saat Scroll/View) */}
          {/* Kita buat simpel saja: Kotak pesan kecil di bawah grid */}
          <div className="bg-[#FDFCF8] border-2 border-dashed border-[#E5E0D8] px-8 py-6 rounded-2xl flex flex-col md:flex-row items-center gap-4 text-center md:text-left max-w-2xl animate-fade-in-up">
            <div className="bg-[#EAE7DF] p-3 rounded-full text-[#3E362E]">
              <Sparkles size={24} />
            </div>
            <div>
              <h4 className="font-bold text-[#3E362E]">Nungguin Tema Baru?</h4>
              <p className="text-sm text-[#6B5E51]">Aku lagi gambar stiker baru nih. Cek lagi minggu depan ya!</p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

import { ProductCard } from "./ProductCard";

export const ProductShowcase = ({ products, loading, onBuy }) => {
  return (
    <main id="products" className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex flex-col md:flex-row items-end justify-between mb-12 border-b border-teal-100 pb-6 gap-4">
        <div>
          <h2 className="text-4xl font-extrabold text-teal-900 mb-2">Koleksi Terbaru</h2>
          <p className="text-teal-600">Pilih aset yang cocok dengan style projectmu.</p>
        </div>
        <span className="bg-teal-100 text-teal-800 px-4 py-1 rounded-full text-sm font-bold">
          {products.length} Items
        </span>
      </div>

      {loading ? (
        <div className="text-center py-32 text-teal-500 font-medium animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mb-4"></div>
          Sedang memuat keajaiban...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.length > 0 ? (
            products.map((product) => <ProductCard key={product.id} product={product} onBuy={onBuy} />)
          ) : (
            <p className="col-span-3 text-center text-teal-500">Belum ada produk yang ditampilkan.</p>
          )}
        </div>
      )}
    </main>
  );
};

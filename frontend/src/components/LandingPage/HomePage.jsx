import { useEffect, useState } from "react";
import { getProducts } from "../../lib/api/ProductApi";
import { purchaseProduct } from "../../lib/api/PaymentApi";

// Import Components (Named Exports)
import { Navbar } from "./Section/Navbar";
import { Hero } from "./Section/Hero";
import { Benefits } from "./Section/Benefits";
import { ProductShowcase } from "./Section/ProductShowcase";
import { FAQ } from "./Section/FAQ";
import { Footer } from "./Section/Footer";
import { CheckoutModal } from "../CheckoutModal";

export const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    // 1. Setup Snap Midtrans
    const clientKey = "SB-Mid-client-XXXXXXXXXXXXXXXX"; // GANTI KEY KAMU
    const script = document.createElement("script");
    script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
    script.setAttribute("data-client-key", clientKey);
    script.async = true;
    document.body.appendChild(script);

    // 2. Fetch Data
    getProducts()
      .then((res) => res.json())
      .then((json) => setProducts(json.data || []))
      .catch((err) => console.error("Gagal load produk:", err))
      .finally(() => setLoading(false));

    return () => {
      if (document.body.contains(script)) document.body.removeChild(script);
    };
  }, []);

  const handleOpenModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleProcessPayment = async (product, customerName, customerEmail) => {
    setIsModalOpen(false);
    try {
      const res = await purchaseProduct({
        product_id: product.id,
        customer_name: customerName,
        customer_email: customerEmail,
      });
      const data = await res.json();
      if (data.token && window.snap) {
        window.snap.pay(data.token, {
          onSuccess: () => alert("✅ Makasih ya udah beli! Cek email kamu."),
          onPending: () => alert("⏳ Menunggu pembayaran..."),
          onError: () => alert("❌ Pembayaran gagal."),
        });
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  return (
    // FIX FOOTER: min-h-screen + flex-col
    <div className="min-h-screen flex flex-col font-sans text-[#3E362E]">
      <Navbar />

      {/* Konten Utama (flex-grow mendorong footer ke bawah) */}
      <div className="flex-grow">
        <Hero />
        <Benefits />
        <ProductShowcase products={products} loading={loading} onBuy={handleOpenModal} />
        <FAQ />
      </div>

      <Footer />

      <CheckoutModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={selectedProduct}
        onSubmit={handleProcessPayment}
      />
    </div>
  );
};

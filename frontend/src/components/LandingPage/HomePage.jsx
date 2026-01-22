import { useEffect, useState } from "react";

// Import API
import { getProducts } from "../../lib/api/ProductApi";
import { purchaseProduct } from "../../lib/api/PaymentApi";

// Import Components (Clean Architecture)
import { Navbar } from "./Section/Navbar"; // Pastikan export default di Navbar
import { Hero } from "./Section/Hero";
import { Benefits } from "./Section/Benefits";
import { ProductShowcase } from "./Section/ProductShowcase";
import { FAQ } from "./Section/FAQ";
import { Footer } from "./Section/Footer";
import { CheckoutModal } from "../CheckoutModal";

export function HomePage() {
  // --- STATE MANAGEMENT ---
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // --- 1. INITIAL LOAD (Data & Snap) ---
  useEffect(() => {
    // Setup Midtrans Snap
    const clientKey = "SB-Mid-client-XXXXXXXXXXXXXXXX"; // GANTI CLIENT KEY MU
    const script = document.createElement("script");
    script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
    script.setAttribute("data-client-key", clientKey);
    script.async = true;
    document.body.appendChild(script);

    // Fetch Produk
    getProducts()
      .then((res) => res.json())
      .then((json) => setProducts(json.data || []))
      .catch((err) => console.error("Gagal load produk:", err))
      .finally(() => setLoading(false));

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // --- 2. EVENT HANDLERS ---
  const handleOpenModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleProcessPayment = async (product, customerName, customerEmail) => {
    setIsModalOpen(false); // Tutup modal biar UX halus

    try {
      const res = await purchaseProduct({
        product_id: product.id,
        customer_name: customerName,
        customer_email: customerEmail,
      });

      const data = await res.json();

      if (data.token && window.snap) {
        window.snap.pay(data.token, {
          onSuccess: (result) => {
            console.log(result);
            alert("✅ Pembayaran Berhasil! Cek emailmu untuk link download.");
          },
          onPending: (result) => {
            console.log(result);
            alert("⏳ Menunggu pembayaran...");
          },
          onError: (result) => {
            console.error(result);
            alert("❌ Pembayaran gagal.");
          },
          onClose: () => {
            alert("Kamu menutup popup pembayaran.");
          },
        });
      } else {
        alert("Gagal mendapatkan token: " + (data.message || "Unknown Error"));
      }
    } catch (error) {
      console.error(error);
      alert("Error Sistem: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F7F4] font-sans text-teal-900 pb-20 selection:bg-emerald-200 selection:text-teal-900">
      {/* Navigation */}
      <Navbar />

      {/* Content Sections */}
      <Hero />
      <Benefits />

      {/* Kirim data products & loading ke component showcase */}
      <ProductShowcase products={products} loading={loading} onBuy={handleOpenModal} />

      <FAQ />
      <Footer />

      {/* Global Modal */}
      <CheckoutModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={selectedProduct}
        onSubmit={handleProcessPayment}
      />
    </div>
  );
}

export default HomePage;

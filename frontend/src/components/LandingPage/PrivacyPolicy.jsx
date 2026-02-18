// frontend/src/components/LandingPage/PrivacyPolicy.jsx
import React, { useEffect } from "react";
import { Navbar } from "./Section/Navbar";
import { Footer } from "./Section/Footer";
import { FloatingWhatsAppButton } from "./FloatingWhatsAppButton";

export default function PrivacyPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-[#121214] min-h-screen font-sans text-[#E0D7D7]">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 pt-40 pb-20 relative">
        {/* Dekorasi halus di background */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#8287ac]/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-black mb-3 tracking-tighter uppercase">
            Kebijakan <span className="text-[#8287ac] italic opacity-80">Privasi</span>
          </h1>
          <p className="text-[#B8B3B6] mb-16 text-xs font-mono tracking-widest opacity-60 uppercase">
            Terakhir diperbarui: {new Date().toLocaleDateString("id-ID")}
          </p>

          <div className="space-y-12 text-sm md:text-base leading-relaxed text-[#B8B3B6] font-light">
            {/* BAGIAN 1: DATA YANG DIKUMPULKAN */}
            <section className="border-l border-[#8287ac]/20 pl-6 md:pl-8">
              <h2 className="text-xl font-bold text-[#E0D7D7] mb-4 tracking-tight">1. Data yang Kami Kumpulkan</h2>
              <p>
                Untuk menjaga privasi dan keamanan Anda, LumaSticker hanya mengumpulkan data yang esensial untuk
                keperluan akses produk, yaitu:
              </p>
              <ul className="list-disc pl-5 mt-4 space-y-2 opacity-90">
                <li>
                  <strong className="text-[#8287ac]">Alamat Email (Gmail):</strong> Wajib diisi saat checkout untuk
                  memberikan izin akses (permission) ke file produk di Google Drive.
                </li>
              </ul>
            </section>

            {/* BAGIAN 2: PENGGUNAAN INFORMASI */}
            <section className="border-l border-[#8287ac]/20 pl-6 md:pl-8">
              <h2 className="text-xl font-bold text-[#E0D7D7] mb-4 tracking-tight">2. Penggunaan Informasi</h2>
              <p>Alamat Email yang Anda berikan semata-mata digunakan untuk:</p>
              <ul className="list-disc pl-5 mt-4 space-y-2 opacity-90">
                <li>
                  Menambahkan akun Anda ke daftar <em className="text-[#8287ac]">"Allowed Viewers"</em> di folder Google
                  Drive produk yang Anda beli.
                </li>
                <li>Mengirimkan notifikasi terkait akses file (jika diperlukan).</li>
              </ul>
              <p className="mt-6 text-[#8287ac] font-medium italic opacity-90">
                Kami menjamin tidak akan menjual atau membagikan email Anda kepada pihak ketiga manapun.
              </p>
            </section>

            {/* BAGIAN 3: TRANSAKSI */}
            <section className="border-l border-[#8287ac]/20 pl-6 md:pl-8">
              <h2 className="text-xl font-bold text-[#E0D7D7] mb-4 tracking-tight">3. Transaksi & Pembayaran</h2>
              <p>
                Seluruh proses konfirmasi pembayaran dilakukan secara langsung melalui{" "}
                <strong className="text-[#8287ac]">WhatsApp</strong>. Hal ini dilakukan untuk memastikan keamanan
                transaksi dan memudahkan komunikasi Anda dengan Admin.
              </p>
            </section>

            {/* BAGIAN 4: KONTAK */}
            <section className="border-l border-[#8287ac]/20 pl-6 md:pl-8">
              <h2 className="text-xl font-bold text-[#E0D7D7] mb-4 tracking-tight">4. Hubungi Kami</h2>
              <p>
                Pertanyaan seputar privasi dapat dikirim ke:
                <a
                  href="mailto:stickerluma@gmail.com"
                  className="block mt-2 font-mono text-[#8287ac] hover:underline cursor-pointer">
                  {" "}
                  stickerluma@gmail.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
      <FloatingWhatsAppButton />
    </div>
  );
}

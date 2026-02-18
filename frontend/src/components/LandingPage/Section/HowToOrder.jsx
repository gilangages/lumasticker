// gilangages/lumasticker/lumasticker-main/frontend/src/components/LandingPage/Section/HowToOrder.jsx

import { ShoppingBag, CreditCard, MessageCircle, Download } from "lucide-react";

export const HowToOrder = () => {
  const steps = [
    {
      title: "Pilih Koleksi Digital",
      description:
        "Telusuri koleksi lengkap kami. Seluruh paket stiker tersedia dengan harga tetap Rp10.000, mencakup format siap cetak (A4) dan digital (PNG).",
      icon: <ShoppingBag size={20} className="text-[#8287ac]" />,
    },
    {
      title: "Selesaikan Pembayaran",
      description: (
        <div className="space-y-4">
          <p>Silakan lakukan transfer sesuai nominal produk (Rp10.000) ke rekening resmi berikut:</p>
          <div className="bg-[#121214] p-5 border border-[#8287ac]/20 relative group transition-all duration-300">
            <div className="flex justify-between items-start mb-2">
              <p className="font-bold text-[#8287ac] text-[10px] uppercase tracking-widest">Bank Jago</p>
              <div className="h-1.5 w-1.5 rounded-full bg-[#8287ac]/40"></div>
            </div>
            <p className="text-xl md:text-2xl font-black tracking-wider text-[#E0D7D7] font-mono mb-1 selection:bg-[#8287ac] selection:text-[#121214]">
              5098 4594 4294
            </p>
            <p className="text-xs text-[#B8B3B6] font-medium uppercase tracking-tight">a.n Gilang Abdian Anggara</p>
          </div>
        </div>
      ),
      icon: <CreditCard size={20} className="text-[#8287ac]" />,
    },
    {
      title: "Konfirmasi Pesanan",
      description: (
        <div className="space-y-3">
          <p>
            Setelah pembayaran berhasil, kembali ke tampilan detail produk dan klik tombol{" "}
            <b>'Konfirmasi via WhatsApp'</b> untuk mengirim bukti transfer ke Admin.
          </p>
          <div className="inline-flex items-center gap-2 border border-[#8287ac]/20 px-3 py-2 text-[11px] font-mono text-[#B8B3B6]">
            <span>🕒</span>
            <span>Jam Operasional: 07:00 - 22:00 WIB</span>
          </div>
          <p className="text-xs text-[#B8B3B6]/50 italic leading-relaxed">
            *Pesan yang masuk di luar jam operasional akan diproses pada hari berikutnya.
          </p>
        </div>
      ),
      icon: <MessageCircle size={20} className="text-[#8287ac]" />,
    },
    {
      title: "Terima & Unduh",
      description:
        "Tautan unduhan pribadi (Google Drive) akan dikirimkan setelah verifikasi selesai. File stiker siap dicetak ulang (Printable) atau digunakan secara digital.",
      icon: <Download size={20} className="text-[#8287ac]" />,
    },
  ];

  return (
    <section id="howto" className="py-24 px-6 max-w-5xl mx-auto border-t border-[#1F1F23] my-10">
      {/* Header Section: InkVoid style */}
      <div className="text-center mb-20 relative z-10">
        <span className="text-[#8287ac]/60 font-mono text-[10px] tracking-[0.3em] uppercase mb-4 block">
          Panduan Pembelian
        </span>
        <h2 className="text-3xl md:text-4xl font-black text-[#E0D7D7] mb-6 tracking-tighter uppercase">
          Cara Pemesanan
        </h2>
        <p className="text-[#B8B3B6] max-w-lg mx-auto text-sm leading-relaxed opacity-80 font-light">
          Ikuti empat langkah sederhana berikut untuk mendapatkan koleksi stiker digital premium kami.
        </p>
      </div>

      <div className="relative">
        {/* Timeline Line: Minimalist dark line */}
        <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-[#1F1F23] transform md:-translate-x-1/2 md:block hidden"></div>
        <div className="absolute left-6 top-0 bottom-0 w-px bg-[#1F1F23] md:hidden"></div>

        <div className="space-y-16 md:space-y-28">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className={`relative flex flex-col md:flex-row gap-8 md:gap-16 items-start ${
                idx % 2 === 0 ? "md:flex-row-reverse" : ""
              }`}>
              {/* ICON CONTAINER: Square & Raw */}
              <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-10 h-10 bg-[#121214] border border-[#8287ac]/30 flex items-center justify-center z-10">
                {step.icon}
              </div>

              {/* KONTEN */}
              <div className="w-full md:w-1/2 pl-16 md:pl-0">
                <div
                  className={`
                    relative
                    ${idx % 2 === 0 ? "md:text-left" : "md:text-right"}
                  `}>
                  <h3 className="text-xl font-bold text-[#E0D7D7] mb-3 tracking-tight">{step.title}</h3>
                  <div className="text-[#B8B3B6] text-sm md:text-base leading-relaxed font-light opacity-90">
                    {step.description}
                  </div>
                </div>
              </div>

              {/* Spacer Kosong untuk Layout Zig-Zag */}
              <div className="hidden md:block w-1/2" />
            </div>
          ))}
        </div>

        {/* Ending Point: Subtle mark */}
        <div className="absolute left-6 md:left-1/2 bottom-0 w-2 h-2 bg-[#8287ac]/20 transform -translate-x-1/2" />
      </div>
    </section>
  );
};

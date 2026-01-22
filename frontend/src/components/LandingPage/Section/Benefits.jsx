import { Zap, ShieldCheck, Heart } from "lucide-react";

export const Benefits = () => {
  const items = [
    {
      icon: <Zap size={32} />,
      title: "Download Instan",
      desc: "Setelah pembayaran, aset langsung dikirim ke emailmu detik itu juga.",
    },
    {
      icon: <ShieldCheck size={32} />,
      title: "Transaksi Aman",
      desc: "Didukung payment gateway terpercaya. Tidak perlu register akun.",
    },
    {
      icon: <Heart size={32} />,
      title: "High Quality",
      desc: "Setiap aset dikurasi ketat untuk memastikan kualitas terbaik.",
    },
  ];

  return (
    <section id="benefits" className="py-20 px-6 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="bg-white p-8 rounded-3xl shadow-lg shadow-teal-900/5 hover:-translate-y-2 transition-all duration-300 border border-teal-50 group">
            <div className="bg-emerald-100 w-14 h-14 rounded-2xl flex items-center justify-center text-emerald-700 mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              {item.icon}
            </div>
            <h3 className="text-xl font-bold mb-3 text-teal-900">{item.title}</h3>
            <p className="text-teal-600/80 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

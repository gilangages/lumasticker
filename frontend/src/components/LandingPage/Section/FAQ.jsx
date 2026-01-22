import { ChevronDown } from "lucide-react";

export const FAQ = () => {
  const faqs = [
    {
      q: "Apakah saya perlu login?",
      a: "Tidak perlu! Kamu bisa belanja sebagai tamu (Guest). Cukup masukkan email aktif saat checkout.",
    },
    {
      q: "Bagaimana cara menerima file?",
      a: "Link download akan dikirim otomatis ke email kamu setelah pembayaran berhasil.",
    },
    {
      q: "Metode pembayaran apa yang tersedia?",
      a: "Kami mendukung QRIS (GoPay, Dana, dll) dan Virtual Account bank utama.",
    },
  ];

  return (
    <section id="faq" className="py-20 px-6 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-12 text-teal-900">Pertanyaan Populer</h2>
      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div key={idx} className="bg-white rounded-2xl shadow-sm border border-teal-50 overflow-hidden">
            <details className="group">
              <summary className="flex justify-between items-center font-bold cursor-pointer list-none p-6 text-teal-900 select-none">
                <span>{faq.q}</span>
                <span className="transition-transform duration-300 group-open:rotate-180 text-emerald-500">
                  <ChevronDown />
                </span>
              </summary>
              <div className="text-teal-600 px-6 pb-6 leading-relaxed bg-teal-50/50">{faq.a}</div>
            </details>
          </div>
        ))}
      </div>
    </section>
  );
};

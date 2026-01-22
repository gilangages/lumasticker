import { ChevronDown, MessageCircle } from "lucide-react";

export const FAQ = () => {
  const faqs = [
    {
      q: "Ini dikirim fisik atau digital?",
      a: "Ini PRODUK DIGITAL (File) ya. Kamu akan dapat link download file ZIP berisi gambar stiker kualitas tinggi. Jadi tidak ada paket yang dikirim kurir ke rumahmu.",
    },
    {
      q: "Gimana cara pakainya?",
      a: "Gampang! 1. Checkout & Bayar. 2. Cek Email & Download. 3. Print filenya di kertas stiker (HVS Sticker/Vinyl). 4. Gunting sesuai pola.",
    },
    {
      q: "Rekomendasi Kertas & Printer?",
      a: "Agar hasil maksimal, gunakan kertas 'Vinyl Sticker Paper' (A4 Glossy). Pastikan settingan printer di mode 'High Quality' atau 'Photo Paper' supaya warnanya tajam dan tidak pudar.",
    },
    {
      q: "Boleh untuk dijual lagi (Komersial)?",
      a: "Maaf, HANYA UNTUK PEMAKAIAN PRIBADI (Personal Use) ya. Boleh buat jurnal sendiri atau kado teman, tapi tidak boleh jual file atau hasil cetaknya.",
    },
    {
      q: "Kalau file hilang gimana?",
      a: "Tenang, link download di email kamu berlaku selamanya. Simpan emailnya baik-baik ya!",
    },
  ];

  return (
    <section id="faq" className="py-20 px-6 max-w-3xl mx-auto">
      <h2 className="text-3xl font-black text-center mb-12 text-[#3E362E]">Sering Ditanyakan 🤔</h2>

      <div className="space-y-4 mb-16">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl border-2 border-[#E5E0D8] overflow-hidden hover:border-[#8DA399] transition-colors">
            <details className="group">
              <summary className="flex justify-between items-center font-bold cursor-pointer list-none p-6 text-[#3E362E] select-none bg-[#FDFCF8]">
                <span>{faq.q}</span>
                <span className="transition-transform duration-300 group-open:rotate-180 text-[#8DA399]">
                  <ChevronDown />
                </span>
              </summary>
              <div className="text-[#6B5E51] px-6 pb-6 leading-relaxed bg-[#FDFCF8] border-t border-dashed border-[#E5E0D8] text-sm">
                {faq.a}
              </div>
            </details>
          </div>
        ))}
      </div>
    </section>
  );
};

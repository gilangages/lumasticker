export const Hero = () => {
  return (
    <section className="pt-40 pb-20 px-6 text-center max-w-4xl mx-auto relative">
      {/* Dekorasi: Kertas/Washi Tape vibe */}
      <div className="absolute top-24 left-10 w-24 h-24 bg-[#E8D5C4] rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute top-24 right-10 w-24 h-24 bg-[#C8D6CA] rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>

      <span className="bg-white border-2 border-[#3E362E] text-[#3E362E] px-4 py-1 rounded-lg text-sm font-bold shadow-[4px_4px_0px_0px_rgba(62,54,46,1)] mb-6 inline-block rotate-[-2deg]">
        ✂️ Printable Stickers
      </span>

      <h1 className="text-4xl md:text-6xl font-black text-[#3E362E] mb-6 leading-tight">
        Stiker Lucu Buatan <br />
        <span className="text-[#8DA399] underline decoration-wavy decoration-2 underline-offset-4">Sendiri.</span>
      </h1>

      <p className="text-lg text-[#6B5E51] mb-8 max-w-xl mx-auto leading-relaxed">
        Hai! Aku hobi gambar stiker. Di sini kamu bisa beli file digitalnya (ZIP), isi stiker transparan & lembaran A4
        siap print. Tinggal print, gunting, tempel deh!
      </p>

      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <a
          href="#products"
          className="bg-[#3E362E] text-[#FDFCF8] px-8 py-3 rounded-xl font-bold hover:-translate-y-1 hover:shadow-lg transition-all">
          Lihat Karyaku 👇
        </a>
      </div>
    </section>
  );
};

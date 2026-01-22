export const Hero = () => {
  return (
    <section className="pt-44 pb-24 px-6 text-center max-w-5xl mx-auto relative overflow-hidden">
      {/* Dekorasi Background (Ghibli Clouds) */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-teal-300/20 rounded-full blur-[80px] -z-10 animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-64 h-64 bg-emerald-300/20 rounded-full blur-[80px] -z-10 animate-pulse delay-700"></div>

      <span className="bg-white/50 backdrop-blur border border-teal-100 text-teal-700 px-4 py-1.5 rounded-full text-sm font-bold tracking-wide shadow-sm mb-6 inline-block">
        ✨ Marketplace Aset Digital Kreatif
      </span>

      <h1 className="text-5xl md:text-7xl font-extrabold text-teal-900 mb-8 tracking-tight leading-tight">
        Karya Digital <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
          Penuh Inspirasi.
        </span>
      </h1>

      <p className="text-xl text-teal-700/80 mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
        Temukan aset desain, template, dan karya seni terbaik. Tanpa ribet, sekali bayar, akses selamanya.
      </p>

      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <a
          href="#products"
          className="bg-teal-800 text-white px-8 py-4 rounded-full font-bold shadow-xl shadow-teal-900/20 hover:bg-teal-900 hover:-translate-y-1 transition-all">
          Jelajahi Koleksi 🌿
        </a>
        <a
          href="#faq"
          className="bg-white text-teal-800 border border-teal-100 px-8 py-4 rounded-full font-bold shadow-sm hover:bg-teal-50 transition-all">
          Cara Kerja?
        </a>
      </div>
    </section>
  );
};

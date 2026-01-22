import { useState, useEffect } from "react";
import { ShoppingBag, Menu, X, Heart, HelpCircle, Grid } from "lucide-react";

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fungsi Scroll Halus
  const scrollToSection = (id) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled ? "bg-[#F0F7F4]/90 backdrop-blur-md shadow-sm py-3" : "bg-transparent py-6"
      }`}>
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <div className="bg-emerald-600 text-white p-2.5 rounded-xl group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-emerald-200">
            <ShoppingBag size={22} />
          </div>
          <span className="font-extrabold text-2xl text-teal-900 tracking-tight">
            Luma<span className="text-emerald-600">Store</span>.
          </span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <button
            onClick={() => scrollToSection("benefits")}
            className="text-teal-800 font-bold hover:text-emerald-600 transition flex items-center gap-1">
            Keunggulan
          </button>
          <button
            onClick={() => scrollToSection("products")}
            className="text-teal-800 font-bold hover:text-emerald-600 transition flex items-center gap-1">
            Koleksi
          </button>
          <button
            onClick={() => scrollToSection("faq")}
            className="text-teal-800 font-bold hover:text-emerald-600 transition flex items-center gap-1">
            Bantuan
          </button>

          <button
            onClick={() => scrollToSection("products")}
            className="bg-teal-800 text-white px-6 py-2.5 rounded-full font-bold shadow-lg shadow-teal-900/20 hover:bg-teal-900 hover:-translate-y-0.5 transition-all">
            Mulai Belanja
          </button>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-teal-900 p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-lg border-b border-gray-100 p-6 flex flex-col gap-4 shadow-xl animate-fade-in-down">
          <button
            onClick={() => scrollToSection("benefits")}
            className="text-left text-teal-800 font-bold py-3 border-b border-gray-100">
            Keunggulan
          </button>
          <button
            onClick={() => scrollToSection("products")}
            className="text-left text-teal-800 font-bold py-3 border-b border-gray-100">
            Koleksi Aset
          </button>
          <button
            onClick={() => scrollToSection("faq")}
            className="text-left text-teal-800 font-bold py-3 border-b border-gray-100">
            Pusat Bantuan
          </button>
        </div>
      )}
    </nav>
  );
};

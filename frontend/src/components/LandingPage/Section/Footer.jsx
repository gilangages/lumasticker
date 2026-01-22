export const Footer = () => {
  return (
    <footer className="bg-teal-900 text-teal-100 py-12 mt-20">
      <div className="max-w-6xl mx-auto px-6 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-8">
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">LumaStore.</h3>
          <p className="text-teal-300/80 text-sm">Platform aset digital untuk kreator masa depan.</p>
        </div>
        <div className="flex gap-6 text-sm font-bold">
          <a href="#" className="hover:text-white transition">
            Instagram
          </a>
          <a href="#" className="hover:text-white transition">
            Twitter
          </a>
          <a href="#" className="hover:text-white transition">
            Support
          </a>
        </div>
      </div>
      <div className="text-center text-xs text-teal-500 mt-10 border-t border-teal-800 pt-8">
        &copy; {new Date().getFullYear()} Luma Store. All rights reserved.
      </div>
    </footer>
  );
};

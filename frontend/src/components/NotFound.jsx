import { Link } from "react-router";
import { Scissors } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#fdfcf8] flex flex-col items-center justify-center p-4 text-center">
      <div className="bg-[#8da399] p-4 rounded-2xl mb-6 rotate-12 shadow-lg">
        <Scissors size={48} className="text-white" />
      </div>
      <h1 className="text-6xl font-black text-[#3e362e] mb-2">404</h1>
      <p className="text-xl text-gray-600 mb-8">Wah, halaman yang kamu cari tidak ada di sini!</p>
      <Link
        to="/"
        className="px-6 py-3 bg-[#3e362e] text-[#fdfcf8] rounded-lg font-bold hover:bg-[#5a4e44] transition-all shadow-md">
        Kembali ke Beranda
      </Link>
    </div>
  );
}

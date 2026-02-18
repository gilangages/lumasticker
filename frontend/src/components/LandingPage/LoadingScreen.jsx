// frontend/src/components/LandingPage/LoadingScreen.jsx
import React from "react";
import { Loader2, AlertCircle, RefreshCw, ArrowRight } from "lucide-react";

export const LoadingScreen = ({ isLoading, isError, onContinue, onRetry }) => {
  if (!isLoading && !isError) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#121214] px-6 text-center font-sans text-[#E0D7D7]">
      {/* BACKGROUND PATTERN: Dark Dot Grid */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#8287ac 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}></div>

      <div className="relative z-10 max-w-md w-full">
        {isLoading ? (
          // --- TAMPILAN LOADING ---
          <div className="flex flex-col items-center">
            <div className="mb-8">
              <Loader2 size={48} className="text-[#8287ac] animate-spin opacity-50" />
            </div>
            <h2 className="text-xl font-bold tracking-widest uppercase mb-4">Menghubungkan...</h2>
            <p className="text-xs text-[#B8B3B6] font-mono leading-relaxed opacity-60">
              Menunggu respon dari server. Proses ini mungkin memakan waktu lebih lama karena keterbatasan layanan
              gratis.
            </p>
          </div>
        ) : (
          // --- TAMPILAN ERROR / LIMIT ---
          <div className="bg-[#1F1F23]/50 border border-[#8287ac]/20 p-8 md:p-12 rounded-none shadow-2xl animate-fade-in">
            <div className="w-16 h-16 border border-[#8287ac]/20 rounded-none flex items-center justify-center mx-auto mb-8 bg-[#121214]">
              <AlertCircle size={32} className="text-[#8287ac]/60" />
            </div>

            <h2 className="text-xl font-black text-[#E0D7D7] mb-6 tracking-tighter uppercase">Koneksi Terputus</h2>

            <div className="text-left text-sm text-[#B8B3B6] space-y-4 mb-10 leading-relaxed font-light italic">
              <p>Layanan backend sedang tidak menanggapi. Hal ini biasanya terjadi karena:</p>
              <ul className="space-y-2 border-l border-[#8287ac]/20 pl-4 not-italic">
                <li className="text-xs opacity-80">// Batas penggunaan data bulanan tercapai.</li>
                <li className="text-xs opacity-80">// Masalah pada koneksi server.</li>
              </ul>

              {/* PENYUSUNAN ULANG DIKSI: Menggunakan "Arsip Karya" */}
              <div className="bg-[#8287ac]/5 border-l-2 border-[#8287ac] p-3 not-italic">
                <p className="text-[11px] text-[#8287ac] font-medium leading-tight tracking-tight">
                  Catatan: Jika dipaksakan lanjut, arsip karya tidak akan muncul di dalam halaman.
                </p>
              </div>

              <p className="text-[10px] opacity-40 not-italic border-t border-[#8287ac]/10 pt-4">
                *Data akan kembali normal saat periode reset layanan dimulai kembali.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <button
                onClick={onRetry}
                className="w-full py-4 border border-[#8287ac]/30 text-[#E0D7D7] font-bold text-xs tracking-[0.2em] hover:bg-[#8287ac] hover:text-[#121214] transition-all flex items-center justify-center gap-2 uppercase">
                <RefreshCw size={14} /> Muat Ulang
              </button>

              <button
                onClick={onContinue}
                className="w-full py-4 text-[#B8B3B6] text-[10px] font-mono tracking-widest hover:text-[#E0D7D7] transition-colors flex items-center justify-center gap-2 uppercase opacity-60">
                Lanjut Tanpa Data <ArrowRight size={12} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

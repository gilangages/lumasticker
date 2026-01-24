import { useState } from "react";
import { Plus, Save, X } from "lucide-react";
import { createProduct } from "../../../lib/api/ProductApi";
import { useLocalStorage } from "react-use";
import { alertError, alertSuccess } from "../../../lib/alert";
import { useNavigate } from "react-router";
import { X as Xicon } from "lucide-react";

export default function ProductForm() {
  const [token] = useLocalStorage("token", "");
  const navigate = useNavigate(); // Untuk redirect setelah sukses

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      // Gabungkan file lama dengan file baru (Konversi FileList ke Array)
      const newFiles = Array.from(e.target.files);
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }
    // Reset value input agar bisa pilih file yang sama lagi kalau mau
    e.target.value = "";
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("description", description);

      for (let i = 0; i < files.length; i++) {
        formData.append("images", files[i]);
      }

      const response = await createProduct(token, formData);
      const responseBody = await response.json();

      if (response.status === 201) {
        await alertSuccess("Produk berhasil dibuat!");
        // Reset Form
        setName("");
        setPrice("");
        setDescription("");
        setFiles([]);
        document.getElementById("fileInput").value = "";

        // Redirect ke list produk
        navigate("/admin/products");
      } else {
        await alertError(responseBody.message || "Gagal upload");
      }
    } catch (error) {
      console.error(error);
      await alertError("Terjadi kesalahan sistem");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto animate-slide-up">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-[#3e362e]">Upload Produk Baru</h1>
        <p className="text-[#8c8478]">Tambahkan aset stiker digital ke database.</p>
      </header>

      <div className="bg-white border-2 border-[#e5e0d8] rounded-xl p-6 md:p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nama */}
          <div>
            <label className="text-sm font-bold text-[#3e362e]">Nama Produk</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border-2 border-[#e5e0d8] rounded-lg p-3 mt-1 focus:border-[#8da399] outline-none transition-colors"
              placeholder="Contoh: Stiker Kucing Lucu Pack 1"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Harga */}
            <div>
              <label className="text-sm font-bold text-[#3e362e]">Harga (Rp)</label>
              <input
                required
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full border-2 border-[#e5e0d8] rounded-lg p-3 mt-1 focus:border-[#8da399] outline-none"
                placeholder="15000"
              />
            </div>
            {/* Kategori / Info lain bisa ditambah disini */}
          </div>

          {/* Deskripsi */}
          <div>
            <label className="text-sm font-bold text-[#3e362e]">Deskripsi</label>
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border-2 border-[#e5e0d8] rounded-lg p-3 mt-1 focus:border-[#8da399] outline-none h-32 resize-none"
              placeholder="Jelaskan detail stiker..."
            />
          </div>

          {/* Upload Area */}
          <div>
            <label className="text-sm font-bold text-[#3e362e] mb-2 block">Foto Produk</label>

            {/* Area Input */}
            <div className="border-2 border-dashed border-[#e5e0d8] rounded-xl p-6 text-center hover:border-[#8da399] hover:bg-[#fcfbf9] transition-all cursor-pointer relative mb-4">
              <input
                id="fileInput"
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center gap-2">
                <Plus className="text-[#8da399]" size={32} />
                <p className="text-sm font-bold text-[#3e362e]">Klik untuk tambah gambar</p>
                <p className="text-xs text-gray-400">Bisa klik berkali-kali untuk menambah banyak</p>
              </div>
            </div>

            {/* Preview List Gambar yang Dipilih */}
            {files.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {files.map((file, idx) => (
                  <div
                    key={idx}
                    className="relative group bg-gray-100 rounded-lg overflow-hidden h-24 border border-gray-200">
                    {/* Preview Image (Object URL) */}
                    <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover" />
                    {/* Tombol Hapus Kecil di Pojok */}
                    <button
                      type="button"
                      onClick={() => removeFile(idx)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition shadow-sm">
                      <Xicon size={12} />
                    </button>
                    <p className="text-[10px] text-gray-500 truncate absolute bottom-0 w-full bg-white/90 px-1">
                      {file.name}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tombol Simpan */}
          <div className="flex justify-end pt-4">
            <button
              disabled={isLoading}
              type="submit"
              className="bg-[#3e362e] text-white font-bold py-3 px-8 rounded-lg hover:bg-[#5a4e44] transition-all flex items-center gap-2 disabled:opacity-50">
              {isLoading ? (
                "Menyimpan..."
              ) : (
                <>
                  <Save size={18} /> Publish Produk
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

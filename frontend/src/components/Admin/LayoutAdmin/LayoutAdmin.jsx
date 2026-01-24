import { Outlet, Link } from "react-router";

export default function LayoutAdmin() {
  return (
    <div className="flex min-h-screen bg-[#fdfcf8]">
      {/* Sidebar Sederhana */}
      <aside className="w-64 bg-[#3e362e] text-[#fdfcf8] p-6 hidden md:block fixed h-full">
        <h2 className="text-2xl font-bold mb-8">LumaAdmin</h2>
        <nav className="space-y-4">
          <Link to="/admin/dashboard" className="block py-2 px-4 bg-[#8da399] rounded hover:bg-[#7b9187] transition">
            Dashboard
          </Link>
          <div className="block py-2 px-4 hover:bg-[#50463b] rounded cursor-not-allowed opacity-50">Pesanan (Soon)</div>
          <Link
            to="/admin/logout"
            className="w-full text-left py-2 px-4 text-[#d68c76] hover:bg-[#50463b] rounded mt-8">
            Logout
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4">
        <Outlet />
      </main>
    </div>
  );
}

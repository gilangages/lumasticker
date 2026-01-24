import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { HomePage } from "./components/LandingPage/HomePage.jsx";
import { BrowserRouter, Route, Routes } from "react-router";
import AdminLogin from "./components/Admin/AdminLogin.jsx";
import LayoutAdmin from "./components/Admin/LayoutAdmin/LayoutAdmin.jsx";
import AdminLogout from "./components/Admin/AdminLogout.jsx";
import ProductList from "./components/Admin/Pages/ProductList.jsx";
import ProductForm from "./components/Admin/Pages/ProductForm.jsx";
import DashboardOverview from "./components/Admin/Pages/DashboardOverview.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route path="admin/login" element={<AdminLogin />} />

        <Route path="/admin" element={<LayoutAdmin />}>
          {/* Index route otomatis ke dashboard */}
          <Route index element={<DashboardOverview />} />

          <Route path="dashboard" element={<DashboardOverview />} />
          <Route path="products" element={<ProductList />} />
          <Route path="upload" element={<ProductForm />} />

          <Route path="logout" element={<AdminLogout />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);

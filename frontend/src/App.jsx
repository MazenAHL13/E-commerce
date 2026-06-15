import { Routes, Route, Navigate } from "react-router-dom";
import { AdminRoute, ClientRoute } from "./routes/ProtectedRoute.jsx";

// Páginas públicas
import Login from "./pages/Login.jsx";

// Páginas Admin
import AdminDashboard from "./pages/admin/Dashboard.jsx";
import AdminClientes  from "./pages/admin/Clientes.jsx";
import AdminProductos from "./pages/admin/Productos.jsx";
import AdminOrdenes   from "./pages/admin/Ordenes.jsx";
import AdminReportes  from "./pages/admin/Reportes.jsx";

// Páginas Cliente
import ClienteDashboard from "./pages/cliente/Dashboard.jsx";
import ClienteCatalogo  from "./pages/cliente/Catalogo.jsx";
import MisOrdenes       from "./pages/cliente/MisOrdenes.jsx";

export default function App() {
  return (
    <Routes>
      {/* Raíz → login */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />

      {/* Rutas Admin */}
      <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      <Route path="/admin/clientes"  element={<AdminRoute><AdminClientes /></AdminRoute>} />
      <Route path="/admin/productos" element={<AdminRoute><AdminProductos /></AdminRoute>} />
      <Route path="/admin/ordenes"   element={<AdminRoute><AdminOrdenes /></AdminRoute>} />
      <Route path="/admin/reportes"  element={<AdminRoute><AdminReportes /></AdminRoute>} />

      {/* Rutas Cliente */}
      <Route path="/cliente"             element={<ClientRoute><ClienteDashboard /></ClientRoute>} />
      <Route path="/cliente/catalogo"    element={<ClientRoute><ClienteCatalogo /></ClientRoute>} />
      <Route path="/cliente/mis-ordenes" element={<ClientRoute><MisOrdenes /></ClientRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

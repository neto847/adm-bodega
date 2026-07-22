//rutas d dónde se encuentran las vistas en las carpetas del proyecto
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../../assets/Context/AuthContext';
import ProtectedRoute from '../../components/ProtectedRoute';
import Login from '../../pages/Login';
import DashboardDueno from '../../pages/DashboardDueno';
import DashboardEncargado from '../../pages/DashboardEncargado';
import PanelDueno from '../../pages/PanelDueno';
import PanelEncargado from '../../pages/PanelEncargado';
import NuevaVenta from '../../pages/NuevaVenta';
import GestionProductos from '../../pages/GestionProductos';
import AlertasCaducidad from '../../pages/AlertasCaducidad';
import ReabastecimientoInventario from '../../pages/ReabastecimientoInventario';
import GestionCatalogo from '../../pages/GestionCatalogo';
import HistorialVentasDueno from '../../pages/HistorialVentasDueno';
import AgregarProducto from '../../pages/AgregarProducto';
import Historico from '../../pages/Historico';
import Inventario from '../../pages/Inventario';
import RolesPermisos from '../../pages/RolesPermisos';
//import '../../Styles/variables.css';
import '../../Styles/reset.css';

//route path = cómo aparece en el buscador --- {nombre del archivo}
function AppRoutes() {
  return (
    <BrowserRouter>
      <AuthProvider>
         <Routes>
           <Route path="/" element={<Login />} />
           <Route path="/login" element={<Login />} />

           <Route path="/dashboard" element={
             <ProtectedRoute rolesPermitidos={['Dueño']}><DashboardDueno /></ProtectedRoute>
           } />
           <Route path="/dashboard-encargado" element={
             <ProtectedRoute rolesPermitidos={['Encargado']}><DashboardEncargado /></ProtectedRoute>
           } />
           <Route path="/panel" element={
             <ProtectedRoute rolesPermitidos={['Dueño']}><PanelDueno /></ProtectedRoute>
           } />
           <Route path="/panel-encargado" element={
             <ProtectedRoute rolesPermitidos={['Encargado']}><PanelEncargado /></ProtectedRoute>
           } />
           <Route path="/nueva-venta" element={
             <ProtectedRoute><NuevaVenta /></ProtectedRoute>
           } />
           <Route path="/productos" element={
             <ProtectedRoute><GestionProductos /></ProtectedRoute>
           } />
           <Route path="/alertas" element={
             <ProtectedRoute><AlertasCaducidad /></ProtectedRoute>
           } />
           <Route path="/reabastecimiento" element={
             <ProtectedRoute><ReabastecimientoInventario /></ProtectedRoute>
           } />
           <Route path="/catalogo" element={
             <ProtectedRoute rolesPermitidos={['Dueño']}><GestionCatalogo /></ProtectedRoute> } />
           <Route path="/historial-ventas" element={
             <ProtectedRoute><HistorialVentasDueno /></ProtectedRoute>
           } />
           <Route path="/historico" element={
             <ProtectedRoute><Historico /></ProtectedRoute>
           } />
           <Route path="/productos/agregar" element={
             <ProtectedRoute><AgregarProducto /></ProtectedRoute>
           } />
           <Route path="/inventario" element={
             <ProtectedRoute><Inventario /></ProtectedRoute>
           } />
           <Route path="/roles-permisos" element={
             <ProtectedRoute rolesPermitidos={['Dueño']}><RolesPermisos /></ProtectedRoute>
           } />
         </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default AppRoutes;
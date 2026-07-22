import { Navigate } from 'react-router-dom';
import { useAuth } from "../assets/Context/AuthContext";

function ProtectedRoute({ children, rolesPermitidos }) {
  const { usuario } = useAuth();

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  if (rolesPermitidos && !rolesPermitidos.includes(usuario.rol)) {
    // El usuario está logueado pero su rol no tiene acceso a esta vista
    const destino = usuario.rol === 'Dueño' ? '/dashboard' : '/dashboard-encargado';
    return <Navigate to={destino} replace />;
  }

  return children;
}

export default ProtectedRoute;
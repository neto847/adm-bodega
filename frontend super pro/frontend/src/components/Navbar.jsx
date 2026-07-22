import { useNavigate, useLocation } from 'react-router-dom';
import '../Styles/componentes/NavBar.css';

const NAV_LINKS = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Gestión de productos', path: '/productos' },
  { label: 'Nueva venta', path: '/nueva-venta' },
  { label: 'Historial de ventas', path: '/historial-ventas' },
  { label: 'Reabastecimiento de inventario', path: '/reabastecimiento' },
  { label: 'Gestión de catálogo', path: '/catalogo' },
  { label: 'Alertas de caducidad', path: '/alertas', badge: 5 },
];

function NavBar({ role = 'Encargado' }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleSalir = () => {
    // Aquí se llamará a authService.js
    // Ejemplo: authService.logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-links">
        {NAV_LINKS.map((link) => (
          <button
            key={link.label}
            className={`navbar-link ${location.pathname === link.path ? 'navbar-link-active' : ''}`}
            onClick={() => navigate(link.path)}
          >
            {link.label}
            {link.badge && <span className="navbar-badge">{link.badge}</span>}
          </button>
        ))}
      </div>
      <div className="navbar-user">
        <span className="navbar-role-pill">{role}</span>
        <button className="navbar-logout-button" onClick={handleSalir}>
          Salir
        </button>
      </div>
    </nav>
  );
}

export default NavBar;
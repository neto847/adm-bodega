import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../assets/Context/AuthContext';
import logoAdmBodega from './logo.jpg';
import '../Styles/componentes/sidebar.css';

function getNavLinks(rol) {
  const links = [
    { label: 'Dashboard', path: rol === 'Dueño' ? '/dashboard' : '/dashboard-encargado', icon: 'grid' },
    { label: 'Resúmenes', path: rol === 'Dueño' ? '/panel' : '/panel-encargado', icon: 'bar-chart' },
    { label: 'Gestión de productos', path: '/productos', icon: 'box' },
    { label: 'Nueva venta', path: '/nueva-venta', icon: 'cart' },
    { label: 'Historial de ventas', path: '/historial-ventas', icon: 'clock' },
    { label: 'Reabastecimiento de inventario', path: '/reabastecimiento', icon: 'truck' },
    { label: 'Alertas de caducidad', path: '/alertas', icon: 'alert', badge: 5 },
  ];

  if (rol === 'Dueño') {
    links.splice(6, 0, { label: 'Gestión de catálogo', path: '/catalogo', icon: 'tag' });
  }

  return links;
}

function Icon({ type }) {
  const paths = {
    grid: 'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z',
    'bar-chart': 'M12 20V10M18 20V4M6 20v-4',
    box: 'M21 8V21H3V8M1 3H23V8H1V3ZM10 12H14',
    cart: 'M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6',
    clock: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2',
    truck: 'M1 3h15v13H1zM16 8h4l3 3v5h-7V8zM5.5 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM18.5 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
    tag: 'M20.59 13.41L11 3.83A2 2 0 0 0 9.59 3.24H4a2 2 0 0 0-2 2v5.59a2 2 0 0 0 .59 1.41l9.58 9.58a2 2 0 0 0 2.82 0l6.6-6.6a2 2 0 0 0 0-2.82zM7 7h.01',
    alert: 'M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01',
  };
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={paths[type]} />
    </svg>
  );
}

const ETIQUETA_ROL = {
  Dueño: 'Dueño',
  Encargado: 'Encargado/Cajero',
};

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { usuario, logout: cerrarSesion } = useAuth();
  const rol = usuario?.rol || 'Encargado';
  const navLinks = getNavLinks(rol);

  const handleSalir = () => {
    cerrarSesion();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <img src={logoAdmBodega} alt="Logo ADM Bodega" className="sidebar-brand-logo" />
        <span className="sidebar-brand-text">ADM Bodega</span>
      </div>

      <nav className="sidebar-nav">
        {navLinks.map((link) => (
          <button
            key={link.label}
            className={`sidebar-link ${location.pathname === link.path ? 'sidebar-link-active' : ''}`}
            onClick={() => navigate(link.path)}
          >
            <Icon type={link.icon} />
            <span className="sidebar-link-label">{link.label}</span>
            {link.badge && <span className="sidebar-badge">{link.badge}</span>}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <span className="sidebar-role-pill">{ETIQUETA_ROL[rol]}</span>
        <button className="sidebar-logout-button" onClick={handleSalir}>
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
          </svg>
          Salir
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
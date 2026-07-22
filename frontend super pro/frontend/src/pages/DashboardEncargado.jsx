import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import '../Styles/Pages/DashboardEncargado.css';

// Aquí se llamará a dashboardService.js para traer datos reales
const STAT_CARDS = [
  { icon: 'box', value: '120', label: 'Productos totales' },
  { icon: 'alert', value: '8', label: 'Stock Bajo' },
  { icon: 'dollar', value: '$1,200', label: 'Ventas hoy' },
  { icon: 'tag', value: '6', label: 'Categorías' },
];

// Alertas de inventario (productos con stock bajo o crítico)
const INVENTORY_ALERTS = [
  { id: 2, producto: 'Mouse Inalámbrico', categoria: 'Electrónica', stock: 3 },
  { id: 5, producto: 'Café Orgánico 500g', categoria: 'Alimentos', stock: 5 },
  { id: 8, producto: 'Salchicha Food', categoria: 'Alimentos', stock: 0 },
  { id: 9, producto: 'Cepillo Dental', categoria: 'Higiene personal', stock: 2 },
  { id: 12, producto: 'Coca Cola', categoria: 'Bebidas', stock: 0 },
];

function StatIcon({ type }) {
  const paths = {
    box: <path d="M21 8V21H3V8M1 3H23V8H1V3ZM10 12H14" />,
    alert: <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01" />,
    dollar: <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />,
    tag: <path d="M20.59 13.41L11 3.83A2 2 0 0 0 9.59 3.24H4a2 2 0 0 0-2 2v5.59a2 2 0 0 0 .59 1.41l9.58 9.58a2 2 0 0 0 2.82 0l6.6-6.6a2 2 0 0 0 0-2.82zM7 7h.01" />,
  };

  return (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {paths[type]}
    </svg>
  );
}

function DashboardEncargado() {
  const navigate = useNavigate();

  useEffect(() => {
    // Aquí se llamará a dashboardService.js
    // Ejemplo: dashboardService.getResumenEncargado().then(...)
  }, []);

  return (
    <Layout role="Encargado" title="Dashboard" subtitle="Resumen general de inventario">
      <div className="encargado-content">
        <section className="encargado-stats-grid">
          {STAT_CARDS.map((card) => (
            <div className="encargado-stat-card" key={card.label}>
              <div className="encargado-stat-icon">
                <StatIcon type={card.icon} />
              </div>
              <div>
                <p className="encargado-stat-value">{card.value}</p>
                <p className="encargado-stat-label">{card.label}</p>
              </div>
            </div>
          ))}
        </section>

        <section className="encargado-alerts-section">
          <h2 className="encargado-alerts-title">Alerta de inventario</h2>

          <div className="encargado-table-wrapper">
            <table className="encargado-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Producto</th>
                  <th>Categoría</th>
                  <th>Stock Actual</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {INVENTORY_ALERTS.map((item) => (
                  <tr key={item.id} className="encargado-row-alert">
                    <td>{item.id}</td>
                    <td>{item.producto}</td>
                    <td>{item.categoria}</td>
                    <td className="encargado-stock-value">{item.stock}</td>
                    <td>
                      <span className="encargado-badge">Bajo</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="encargado-alerts-footer"> 
            <button className="encargado-link-button" onClick={() => navigate('/inventario')}>
              Ver todos los productos →
            </button> 
          </div>
        </section> 
      </div>
    </Layout>
  );
}

export default DashboardEncargado;
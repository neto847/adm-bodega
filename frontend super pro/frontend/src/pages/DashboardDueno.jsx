import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { obtenerDashboard } from '../services/dashboardService';
import '../Styles/Pages/DashboardDueno.css';

const STAT_CARDS = [
  { icon: 'box', iconBg: '#f1f5f9', label: 'Productos totales', trend: 'En tiempo real', trendType: 'positive' },
  { icon: 'alert', iconBg: '#fff1f2', label: 'Stock Bajo', trend: 'Desde la base de datos', trendType: 'negative' },
  { icon: 'dollar', iconBg: '#f0fdf4', label: 'Ventas hoy', trend: 'Actualizado al momento', trendType: 'positive' },
  { icon: 'tag', iconBg: '#f8fafc', label: 'Categorías', trend: 'Sin cambios', trendType: 'neutral' },
];

const WEEKLY_SALES = [
  { day: 'Lun', value: 320 },
  { day: 'Mar', value: 480 },
  { day: 'Mié', value: 290 },
  { day: 'Jue', value: 610 },
  { day: 'Vie', value: 720 },
  { day: 'Sáb', value: 890 },
  { day: 'Dom', value: 410 },
];

const CATEGORY_DISTRIBUTION = [
  { name: 'Alimentos', percent: 38 },
  { name: 'Lácteos', percent: 22 },
  { name: 'Bebidas', percent: 17 },
  { name: 'Electrónica', percent: 12 },
  { name: 'Hogar', percent: 7 },
  { name: 'Higiene', percent: 4 },
];

// Valores aproximados pq ns que tenga Neto en el back 
const WEEKLY_REVENUE = [
  { day: 'Lun', value: 900 },
  { day: 'Mar', value: 1500 },
  { day: 'Mié', value: 700 },
  { day: 'Jue', value: 2200 },
  { day: 'Vie', value: 2800 },
  { day: 'Sáb', value: 3500 },
  { day: 'Dom', value: 1400 },
];

const INVENTORY_ALERTS = [
  { id: 2, producto: 'Mouse Inalámbrico', categoria: 'Electrónica', stock: 3, estado: 'critico' },
  { id: 5, producto: 'Café Orgánico 500g', categoria: 'Alimentos', stock: 5, estado: 'bajo' },
  { id: 8, producto: 'Salchicha Food', categoria: 'Alimentos', stock: 0, estado: 'sin_stock' },
  { id: 9, producto: 'Cepillo Dental', categoria: 'Higiene personal', stock: 2, estado: 'critico' },
  { id: 12, producto: 'Coca Cola', categoria: 'Bebidas', stock: 0, estado: 'sin_stock' },
];

const ESTADO_LABEL = {
  critico: 'Crítico',
  bajo: 'Stock bajo',
  sin_stock: 'Sin stock',
};

function StatIcon({ type }) {
  const paths = {
    box: <path d="M21 8V21H3V8M1 3H23V8H1V3ZM10 12H14" />,
    alert: <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01" />,
    dollar: <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />,
    tag: <path d="M20.59 13.41L11 3.83A2 2 0 0 0 9.59 3.24H4a2 2 0 0 0-2 2v5.59a2 2 0 0 0 .59 1.41l9.58 9.58a2 2 0 0 0 2.82 0l6.6-6.6a2 2 0 0 0 0-2.82zM7 7h.01" />,
  };

  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {paths[type]}
    </svg>
  );
}

function DashboardDueno() {
  const navigate = useNavigate();
  const [datosDashboard, setDatosDashboard] = useState(null);

  useEffect(() => {
    const cargarDashboard = async () => {
      try {
        const datos = await obtenerDashboard();
        setDatosDashboard(datos);
      } catch (error) {
        console.error('Error al cargar dashboard:', error);
      }
    };

    cargarDashboard();
  }, []);

  const maxVentas = Math.max(...WEEKLY_SALES.map((d) => d.value));
  const maxIngreso = Math.max(...WEEKLY_REVENUE.map((d) => d.value));
  const productosBajoStock = datosDashboard?.productosBajoStock || [];
  const ventasHoy = datosDashboard?.ventasDeHoy || 0;
  const totalProductos = productosBajoStock.length + 1;

  // Genera los puntos del gráfico de línea (SVG 1000x100 aprox.)
  const chartWidth = 1000;
  const chartHeight = 100;
  const stepX = chartWidth / (WEEKLY_REVENUE.length - 1);
  const points = WEEKLY_REVENUE.map((d, i) => {
    const x = i * stepX;
    const y = chartHeight - (d.value / maxIngreso) * chartHeight;
    return `${x},${y}`;
  }).join(' ');

  // si, ya sé que es
  return (
    <Layout title="Dashboard" subtitle="Resumen general de inventario">
     <div className="dueno-content">

        <section className="dueno-stats-grid">
          {STAT_CARDS.map((card) => {
            const value = card.label === 'Productos totales'
              ? totalProductos
              : card.label === 'Stock Bajo'
                ? productosBajoStock.length
                : card.label === 'Ventas hoy'
                  ? `$${ventasHoy.toFixed(2)}`
                  : '6';

            return (
              <div className="dueno-stat-card" key={card.label}>
                <div className="dueno-stat-top">
                  <div className="dueno-stat-icon" style={{ backgroundColor: card.iconBg }}>
                    <StatIcon type={card.icon} />
                  </div>
                  <span className={`dueno-stat-trend dueno-trend-${card.trendType}`}>{card.trend}</span>
                </div>
                <p className="dueno-stat-value">{value}</p>
                <p className="dueno-stat-label">{card.label}</p>
              </div>
            );
          })}
        </section>

        <section className="dueno-charts-row">
          <div className="dueno-chart-card">
            <div className="dueno-chart-header">
              <div>
                <h3 className="dueno-chart-title">Ventas de la Semana</h3>
                <p className="dueno-chart-subtitle">Unidades vendidas por día</p>
              </div>
              <span className="dueno-chart-badge">+18% vs semana anterior</span>
            </div>
            <div className="dueno-bar-chart">
              {WEEKLY_SALES.map((d) => (
                <div className="dueno-bar-column" key={d.day}>
                  <span className="dueno-bar-value">{d.value}</span>
                  <div
                    className="dueno-bar"
                    style={{ height: `${(d.value / maxVentas) * 100}%` }}
                  />
                  <span className="dueno-bar-label">{d.day}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="dueno-chart-card dueno-category-card">
            <h3 className="dueno-chart-title">Distribución por Categoría</h3>
            <div className="dueno-category-list">
              {CATEGORY_DISTRIBUTION.map((cat) => (
                <div className="dueno-category-row" key={cat.name}>
                  <div className="dueno-category-labels">
                    <span>{cat.name}</span>
                    <span className="dueno-category-percent">{cat.percent}%</span>
                  </div>
                  <div className="dueno-category-track">
                    <div className="dueno-category-fill" style={{ width: `${cat.percent}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="dueno-revenue-card">
          <div className="dueno-chart-header">
            <h3 className="dueno-chart-title">Ingresos Semanales</h3>
            <span className="dueno-chart-week-label">Esta semana</span>
          </div>
          <svg
            className="dueno-line-chart"
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            preserveAspectRatio="none"
          >
            <polyline points={points} fill="none" stroke="#4d44f8" strokeWidth="2" />
            {WEEKLY_REVENUE.map((d, i) => {
              const x = i * stepX;
              const y = chartHeight - (d.value / maxIngreso) * chartHeight;
              return <circle key={d.day} cx={x} cy={y} r="3" fill="#4d44f8" />;
            })}
          </svg>
          <div className="dueno-line-chart-labels">
            {WEEKLY_REVENUE.map((d) => (
              <span key={d.day}>{d.day}</span>
            ))}
          </div>
        </section>

        <section className="dueno-alerts-section">
          <div className="dueno-alerts-header">
            <h2 className="dueno-alerts-title">Alerta de inventario</h2>
            <span className="dueno-alerts-count">{productosBajoStock.length} productos</span>
          </div>

          <div className="dueno-table-wrapper">
            <table className="dueno-table">
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
                {productosBajoStock.map((item) => {
                  const estado = item.stockActual <= 3 ? 'critico' : 'bajo';
                  return (
                    <tr key={item.idProducto} className="dueno-row-alert">
                      <td>{item.idProducto}</td>
                      <td className="dueno-cell-strong">{item.nombre}</td>
                      <td>Sin categoría</td>
                      <td>
                        <div className="dueno-stock-cell">
                          <span className={`dueno-stock-number dueno-stock-${estado}`}>{item.stockActual}</span>
                          <div className="dueno-stock-track">
                            <div
                              className={`dueno-stock-fill dueno-stock-fill-${estado}`}
                              style={{ width: `${Math.min((item.stockActual / 10) * 100, 100)}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`dueno-badge dueno-badge-${estado}`}>
                          {ESTADO_LABEL[estado]}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="dueno-alerts-footer">
            <span>Mostrando {productosBajoStock.length} productos con alerta</span>
            <button className="dueno-link-button" onClick={() => navigate('/alertas')}>
               Ver todos los productos →
             </button>
          </div>
        </section>
      </div>
    </Layout>
  );
}

export default DashboardDueno;

import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { obtenerAlertasCaducidad } from '../services/alertaService';
import { obtenerDashboardDueno } from '../services/dashboardService';
import '../Styles/Pages/PanelDueno.css';

// Aquí se llamará a panelService.js para traer datos reales
const METRICAS = [
  { icon: 'dollar', value: '$1,216.48', label: 'Ingresos totales', trend: '+12% vs mes anterior', detail: '7 ventas completadas' },
  { icon: 'calendar', value: '$8,450', label: 'Ingresos esta semana', trend: '+8% vs semana anterior', detail: 'Lun 23 — Dom 29 Jun' },
  { icon: 'percent', value: '34%', label: 'Margen estimado', trend: '+2% vs mes anterior', detail: 'Sobre ventas completadas' },
  { icon: 'clock', value: '15', label: 'Lotes venciendo', trend: '5 lotes venciendo', trendType: 'warning', detail: '5 pendientes · 5 stock bajo' },
];

const TOP_PRODUCTOS = [
  { nombre: 'Leche Lala', categoria: 'Lácteos', unidades: 124, total: 3596, percent: 100 },
  { nombre: 'Refresco Sprite', categoria: 'Bebidas', unidades: 98, total: 3920, percent: 79 },
  { nombre: 'Queso Chédar', categoria: 'Lácteos', unidades: 76, total: 3495, percent: 61 },
  { nombre: 'Café Orgánico 500g', categoria: 'Alimentos', unidades: 64, total: 3391, percent: 52 },
  { nombre: 'Pasta Dental Crest', categoria: 'Higiene', unidades: 55, total: 1925, percent: 44 },
];

const INGRESOS_CATEGORIA = [
  { nombre: 'Lácteos', percent: 28, total: 7091 },
  { nombre: 'Bebidas', percent: 23, total: 5840 },
  { nombre: 'Alimentos', percent: 19, total: 4820 },
  { nombre: 'Higiene', percent: 13, total: 3200 },
  { nombre: 'Electrónica', percent: 11, total: 2700 },
  { nombre: 'Hogar', percent: 6, total: 1560 },
];

const TOTAL_INGRESOS = 25211;

const VENTAS_RECIENTES = [
  { id: 1, producto: 'Leche Lala', categoria: 'Lácteos', total: 899.99, fecha: '16/03/2026', estado: 'completado' },
  { id: 12, producto: 'Coca Cola', categoria: 'Bebidas', total: 189.99, fecha: '14/01/2026', estado: 'pendiente' },
  { id: 11, producto: 'Refresco Sprite', categoria: 'Bebidas', total: 120.0, fecha: '16/01/2026', estado: 'completado' },
  { id: 10, producto: 'Nissi', categoria: 'Alimentos', total: 85.0, fecha: '20/01/2026', estado: 'completado' },
  { id: 4, producto: 'Queso Chédar', categoria: 'Lácteos', total: 45.99, fecha: '15/02/2026', estado: 'completado' },
];

//accesos directos lol
 const ACCIONES_EXCLUSIVAS = [
   { icon: 'grid', titulo: 'Gestionar catálogo', detalle: 'Categorías y proveedores', path: '/catalogo' },
   { icon: 'box', titulo: 'Gestión de productos', detalle: 'Inventario completo', path: '/productos' },
   { icon: 'truck', titulo: 'Reabastecimiento', detalle: 'Nuevas entradas', path: '/reabastecimiento' },
   { icon: 'shield', titulo: 'Roles y permisos', detalle: 'Gestionar accesos', path: '/roles-permisos' },
 ];
//íconos de adentro de los cuadritos
function Icon({ type, size = 18 }) {
  const paths = {
    dollar: 'M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6',
    calendar: 'M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z',
    percent: 'M19 5L5 19M6.5 9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM17.5 20a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
    clock: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2',
    download: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3',
    bell: 'M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9zM13.73 21a2 2 0 0 1-3.46 0',
    grid: 'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z',
    box: 'M21 8V21H3V8M1 3H23V8H1V3ZM10 12H14',
    truck: 'M1 3h15v13H1zM16 8h4l3 3v5h-7V8zM5.5 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM18.5 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
    shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
    alert: 'M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01',
  };

  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={paths[type]} />
    </svg>
  );
}
//la alerta de arriba, la de los lotes vencidos o por vencer
function PanelDueno() {
  const navigate = useNavigate();
  const [alertasVencimiento, setAlertasVencimiento] = useState({ cantidad: 5, valorEnRiesgo: 4040.41 });
  const [metricasUI, setMetricasUI] = useState(METRICAS);

  const fechaHoy = useMemo(() => {
     const hoy = new Date();
     const texto = hoy.toLocaleDateString('es-MX', {
       weekday: 'long',
       day: 'numeric',
       month: 'long',
       year: 'numeric',
     });
     return texto.charAt(0).toUpperCase() + texto.slice(1);
   }, []);

  useEffect(() => {
    const cargarPanel = async () => {
      try {
        const [dashboardDueno, alertas] = await Promise.all([
          obtenerDashboardDueno(),
          obtenerAlertasCaducidad(),
        ]);

        const lotes = Array.isArray(alertas?.lotes) ? alertas.lotes : [];
        setAlertasVencimiento({
          cantidad: lotes.length,
          valorEnRiesgo: 0,
        });

        setMetricasUI((prev) =>
          prev.map((m) => {
            if (m.label === 'Ingresos totales') {
              return {
                ...m,
                value: `$${Number(dashboardDueno?.ingresosTotales || 0).toFixed(2)}`,
                detail: `${(dashboardDueno?.topProductos || []).length} productos con ventas`,
              };
            }

            if (m.label === 'Ingresos esta semana') {
              return {
                ...m,
                value: `$${Number(dashboardDueno?.ventasDeHoy || 0).toFixed(2)}`,
                detail: 'Ventas del dia actual',
              };
            }

            if (m.label === 'Margen estimado') {
              return {
                ...m,
                value: `$${Number(dashboardDueno?.ticketPromedio || 0).toFixed(2)}`,
                label: 'Ticket promedio',
                detail: 'Promedio historico por venta',
              };
            }

            if (m.label === 'Lotes venciendo') {
              return {
                ...m,
                value: String(lotes.length),
                trend: `${lotes.length} lotes caducados`,
                detail: 'Tomado de alertas de caducidad',
              };
            }

            return m;
          })
        );
      } catch (error) {
        console.error('Error al cargar el panel del dueño:', error);
      }
    };

    cargarPanel();
  }, []);

  //ahora si, el html pro
  return (
    <Layout role="Dueño" title="Panel del Dueño" subtitle="Vista financiera y gestión completa del sistema">
     <div className="dueno-panel-content">
       <div className="dueno-panel-actions-row">
         <span className="dueno-panel-date">{fechaHoy}</span>
       </div>
        <section className="dueno-panel-alert-banner">
          <div className="dueno-panel-alert-left">
            <div className="dueno-panel-alert-icon">
              <Icon type="alert" size={16} />
            </div>
            <div>
              <p className="dueno-panel-alert-title">{alertasVencimiento.cantidad} lotes vencidos o por vencer</p>
              <p className="dueno-panel-alert-subtitle">Requiere tu atención inmediata</p>
            </div>
          </div>
          <div className="dueno-panel-alert-right">
            <div>
              <p className="dueno-panel-alert-value">${alertasVencimiento.valorEnRiesgo.toFixed(2)}</p>
              <p className="dueno-panel-alert-value-label">valor en riesgo</p>
            </div>
            <button className="dueno-panel-alert-button" onClick={() => navigate('/alertas')}>
              <Icon type="alert" size={12} /> Revisar alertas
            </button>
          </div>
        </section>

        <section className="dueno-panel-metrics-grid">
          {metricasUI.map((m) => (
            <div className="dueno-panel-metric-card" key={m.label}>
              <div className="dueno-panel-metric-top">
                <div className="dueno-panel-metric-icon">
                  <Icon type={m.icon} />
                </div>
                <span className={`dueno-panel-metric-trend dueno-panel-trend-${m.trendType || 'positive'}`}>
                  {m.trend}
                </span>
              </div>
              <p className="dueno-panel-metric-value">{m.value}</p>
              <p className="dueno-panel-metric-label">{m.label}</p>
              <p className="dueno-panel-metric-detail">{m.detail}</p>
            </div>
          ))}
        </section>

        <section className="dueno-panel-two-col">
          <div className="dueno-panel-card">
            <div className="dueno-panel-card-header">
              <div>
                <h3 className="dueno-panel-card-title">Top Productos por Ventas</h3>
                <p className="dueno-panel-card-subtitle">Unidades vendidas este mes</p>
              </div>
              <button className="dueno-panel-link-button">Ver todos →</button>
            </div>
            <div className="dueno-panel-list">
              {TOP_PRODUCTOS.map((p) => (
                <div className="dueno-panel-product-row" key={p.nombre}>
                  <div className="dueno-panel-product-info">
                    <span className="dueno-panel-product-name">{p.nombre}</span>
                    <span className="dueno-panel-product-category">{p.categoria}</span>
                    <span className="dueno-panel-product-stats">
                      {p.unidades} uds · ${p.total.toLocaleString()}
                    </span>
                  </div>
                  <div className="dueno-panel-progress-track">
                    <div className="dueno-panel-progress-fill" style={{ width: `${p.percent}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="dueno-panel-card">
            <div className="dueno-panel-card-header">
              <div>
                <h3 className="dueno-panel-card-title">Ingresos por Categoría</h3>
                <p className="dueno-panel-card-subtitle">Distribución del mes actual</p>
              </div>
              <button className="dueno-panel-link-button" onClick={() => navigate('/historico')}>
                 Ver histórico →
               </button>
            </div>
            <div className="dueno-panel-list">
              {INGRESOS_CATEGORIA.map((c) => (
                <div className="dueno-panel-category-row" key={c.nombre}>
                  <span className="dueno-panel-category-name">{c.nombre}</span>
                  <div className="dueno-panel-category-bar-wrapper">
                    <div className="dueno-panel-category-track">
                      <div className="dueno-panel-category-fill" style={{ width: `${c.percent}%` }} />
                    </div>
                    <span className="dueno-panel-category-percent">{c.percent}%</span>
                  </div>
                  <span className="dueno-panel-category-total">${c.total.toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="dueno-panel-total-row">
              <span>Total ingresos</span>
              <span className="dueno-panel-total-value">${TOTAL_INGRESOS.toLocaleString()}</span>
            </div>
          </div>
        </section>

        <section className="dueno-panel-card dueno-panel-sales-table-section">
          <div className="dueno-panel-card-header">
            <h3 className="dueno-panel-card-title">Ventas Recientes de Mayor Valor</h3>
            <button className="dueno-panel-link-button" onClick={() => navigate('/historial-ventas')}>
               Ver historial completo →
             </button>
          </div>
          <table className="dueno-panel-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Producto</th>
                <th>Categoría</th>
                <th>Total</th>
                <th>Fecha</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {VENTAS_RECIENTES.map((v) => (
                <tr key={v.id}>
                  <td>{v.id}</td>
                  <td className="dueno-panel-cell-strong">{v.producto}</td>
                  <td>{v.categoria}</td>
                  <td>${v.total.toFixed(2)}</td>
                  <td>{v.fecha}</td>
                  <td>
                    <span className={`dueno-panel-status dueno-panel-status-${v.estado}`}>
                      {v.estado === 'completado' ? 'Completado' : 'Pendiente'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="dueno-panel-exclusive-section">
          <h3 className="dueno-panel-exclusive-title">Acciones Exclusivas</h3>
          <div className="dueno-panel-exclusive-grid">
            {ACCIONES_EXCLUSIVAS.map((a) => (
              <button
                 className="dueno-panel-exclusive-button"
                 key={a.titulo}
                 onClick={() => navigate(a.path)}>
                <div className="dueno-panel-exclusive-icon">
                  <Icon type={a.icon} size={18} />
                </div>
                <div className="dueno-panel-exclusive-text">
                  <p className="dueno-panel-exclusive-name">{a.titulo}</p>
                  <p className="dueno-panel-exclusive-detail">{a.detalle}</p>
                </div>
                <Icon type="alert" size={14} />
              </button>
            ))}
          </div>
        </section>
        </div>
      </Layout>
  );
}

export default PanelDueno;
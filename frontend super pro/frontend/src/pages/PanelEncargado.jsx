import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import '../Styles/Pages/PanelEncargado.css';

// Aquí se llamará a panelService.js para traer datos reales
const METRICAS = [
  { icon: 'alert', value: '7', label: 'Alertas sin revisar', detail: '5 urgentes' },
  { icon: 'cart', value: '4', label: 'Ventas hoy', detail: '5 pendientes' },
  { icon: 'box', value: '5', label: 'Stock bajo', detail: 'productos a reponer' },
  { icon: 'check', value: '0/5', label: 'Tareas del turno', detail: '0% completado' },
];

const TAREAS_TURNO = [
  { id: 1, texto: 'Revisar alertas de caducidad del día', prioridad: 'alta', hecha: false },
  { id: 2, texto: 'Verificar stock de productos con alerta', prioridad: 'alta', hecha: false },
  { id: 3, texto: 'Procesar ventas pendientes de ayer', prioridad: 'media', hecha: false },
  { id: 4, texto: 'Registrar nueva entrada de inventario', prioridad: 'media', hecha: false },
  { id: 5, texto: 'Consultar historial de ventas del turno', prioridad: 'baja', hecha: false },
];

const ALERTAS_CADUCIDAD = [
  { producto: 'Leche Lala', lote: 'LOT-2026-A01', unidades: 24, tiempoRelativo: 'Hace 5d', fecha: '19-jun' },
  { producto: 'Queso Chédar', lote: 'LOT-2026-A02', unidades: 8, tiempoRelativo: 'Hace 2d', fecha: '22-jun' },
  { producto: 'Salchicha Food', lote: 'LOT-2026-A03', unidades: 15, tiempoRelativo: '1d', fecha: '25-jun' },
  { producto: 'Coca Cola', lote: 'LOT-2026-A04', unidades: 36, tiempoRelativo: '4d', fecha: '28-jun' },
  { producto: 'Leche Lala', lote: 'LOT-2026-A05', unidades: 20, tiempoRelativo: '7d', fecha: '01-jul' },
];

const ACCIONES_RAPIDAS = [
  { icon: 'cart', titulo: 'Nueva Venta', detalle: 'Registrar una venta', path: '/nueva-venta' },
  { icon: 'alert', titulo: 'Alertas de Caducidad', detalle: '5 urgentes', path: '/alertas' },
  { icon: 'search', titulo: 'Consultar Inventario', detalle: 'Ver productos y stock', path: '/inventario' },
  { icon: 'clock', titulo: 'Historial de Ventas', detalle: '5 pendientes', path: '/historial-ventas' },
];

const STOCK_BAJO = [
  { nombre: 'Mouse Inalámbrico', categoria: 'Electrónica', unidades: 3 },
  { nombre: 'Café Orgánico 500g', categoria: 'Alimentos', unidades: 5 },
  { nombre: 'Salchicha Food', categoria: 'Alimentos', unidades: 0 },
  { nombre: 'Cepillo Dental', categoria: 'Higiene personal', unidades: 2 },
  { nombre: 'Coca Cola', categoria: 'Bebidas', unidades: 0 },
];

function Icon({ type, size = 16 }) {
  const paths = {
    alert: 'M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01',
    cart: 'M9 22a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM20 22a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6',
    box: 'M21 8V21H3V8M1 3H23V8H1V3ZM10 12H14',
    check: 'M20 6L9 17l-5-5',
    search: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.35-4.35',
    clock: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2',
    shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  };

  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={paths[type]} />
    </svg>
  );
}

const PRIORIDAD_LABEL = { alta: 'Alta', media: 'Media', baja: 'Baja' };

function PanelEncargado() {
  const navigate = useNavigate();
  const [tareas, setTareas] = useState(TAREAS_TURNO);

  useEffect(() => {
    // Aquí se llamará a panelService.js
  }, []);

  const toggleTarea = (id) => {
    setTareas((prev) =>
      prev.map((t) => (t.id === id ? { ...t, hecha: !t.hecha } : t))
    );
  };

  const completadas = tareas.filter((t) => t.hecha).length;

  return (
    <Layout role="Encargado" title="Panel del Encargado" subtitle="Turno activo · Jueves, 25 de Junio 2026">
      <div className="encargado-panel-content">
        <section className="encargado-panel-alert-banner">
          <div className="encargado-panel-alert-left">
            <div className="encargado-panel-alert-icon">
              <Icon type="alert" size={16} />
            </div>
            <div>
              <p className="encargado-panel-alert-title">5 alertas urgentes sin revisar</p>
              <p className="encargado-panel-alert-subtitle">
                Productos vencidos o que vencen en menos de 7 días
              </p>
            </div>
          </div>
          <button className="encargado-panel-alert-button" onClick={() => navigate('/alertas')}>
            <Icon type="alert" size={12} /> Revisar ahora
          </button>
        </section>

        <section className="encargado-panel-metrics-grid">
          {METRICAS.map((m) => (
            <div className="encargado-panel-metric-card" key={m.label}>
              <div className="encargado-panel-metric-top">
                <div className="encargado-panel-metric-icon">
                  <Icon type={m.icon} size={17} />
                </div>
                <span className="encargado-panel-metric-value">{m.value}</span>
              </div>
              <p className="encargado-panel-metric-label">{m.label}</p>
              <p className="encargado-panel-metric-detail">{m.detail}</p>
            </div>
          ))}
        </section>

        <section className="encargado-panel-two-col">
          <div className="encargado-panel-main-col">
            <div className="encargado-panel-card">
              <div className="encargado-panel-card-header">
                <div>
                  <h3 className="encargado-panel-card-title">Tareas del Turno</h3>
                  <p className="encargado-panel-card-subtitle">
                    {completadas} de {tareas.length} completadas
                  </p>
                </div>
              </div>
              <div className="encargado-panel-task-list">
                {tareas.map((t) => (
                  <div className="encargado-panel-task-row" key={t.id}>
                    <input
                      type="checkbox"
                      checked={t.hecha}
                      onChange={() => toggleTarea(t.id)}
                      className="encargado-panel-checkbox"
                    />
                    <span className={`encargado-panel-task-text ${t.hecha ? 'encargado-panel-task-done' : ''}`}>
                      {t.texto}
                    </span>
                    <span className={`encargado-panel-priority encargado-panel-priority-${t.prioridad}`}>
                      {PRIORIDAD_LABEL[t.prioridad]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="encargado-panel-card">
              <div className="encargado-panel-card-header">
                <h3 className="encargado-panel-card-title">Alertas de Caducidad Pendientes</h3>
                <button className="encargado-panel-link-button" onClick={() => navigate('/alertas')}>
                  Ver todas →
                </button>
              </div>
              <div className="encargado-panel-list">
                {ALERTAS_CADUCIDAD.map((a, i) => (
                  <div className="encargado-panel-expiry-row" key={i}>
                    <div className="encargado-panel-expiry-icon">
                      <Icon type="alert" size={14} />
                    </div>
                    <div className="encargado-panel-expiry-info">
                      <p className="encargado-panel-expiry-name">{a.producto}</p>
                      <p className="encargado-panel-expiry-detail">
                        {a.lote} · {a.unidades} uds
                      </p>
                    </div>
                    <div className="encargado-panel-expiry-time">
                      <p className="encargado-panel-expiry-relative">{a.tiempoRelativo}</p>
                      <p className="encargado-panel-expiry-date">{a.fecha}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="encargado-panel-side-col">
            <div className="encargado-panel-card">
              <h3 className="encargado-panel-card-title">Acciones Rápidas</h3>
              <div className="encargado-panel-quick-grid">
                {ACCIONES_RAPIDAS.map((a) => (
                  <button
                    className="encargado-panel-quick-button"
                    key={a.titulo}
                    onClick={() => navigate(a.path)}
                  >
                    <div className="encargado-panel-quick-icon">
                      <Icon type={a.icon} size={16} />
                    </div>
                    <p className="encargado-panel-quick-title">{a.titulo}</p>
                    <p className="encargado-panel-quick-detail">{a.detalle}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="encargado-panel-card">
              <div className="encargado-panel-card-header">
                <h3 className="encargado-panel-card-title">Productos con Stock Bajo</h3>
                <button className="encargado-panel-link-button" onClick={() => navigate('/productos')}>
                  Ver todos →
                </button>
              </div>
              <div className="encargado-panel-list">
                {STOCK_BAJO.map((p) => (
                  <div className="encargado-panel-stock-row" key={p.nombre}>
                    <div className="encargado-panel-stock-icon">
                      <Icon type="box" size={14} />
                    </div>
                    <div className="encargado-panel-stock-info">
                      <p className="encargado-panel-stock-name">{p.nombre}</p>
                      <p className="encargado-panel-stock-category">{p.categoria}</p>
                    </div>
                    <div className="encargado-panel-stock-count">
                      <p className="encargado-panel-stock-number">{p.unidades}</p>
                      <p className="encargado-panel-stock-unit">unidades</p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                className="encargado-panel-link-button-centered"
                onClick={() => navigate('/reabastecimiento')}
              >
                Registrar reabastecimiento
              </button>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}

export default PanelEncargado;
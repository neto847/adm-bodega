import { useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';
import Layout from '../components/Layout';
import '../Styles/Pages/historialVentasDueno.css';

// Aquí se llamará a ventaService.js (o como se llame) para traer los datos guardados en la base de datos
const VENTAS_INICIALES = [
  { id: 1, producto: 'Leche Lala', total: 899.99, fecha: '16/03/2026', estado: 'completado' },
  { id: 2, producto: 'Mouse Inalámbrico', total: 25.5, fecha: '20/02/2026', estado: 'pendiente' },
  { id: 3, producto: 'Pasta Dental Crest', total: 35.0, fecha: '18/02/2026', estado: 'completado' },
  { id: 4, producto: 'Queso Chédar', total: 45.99, fecha: '15/02/2026', estado: 'completado' },
  { id: 5, producto: 'Café Orgánico 500g', total: 12.99, fecha: '13/02/2026', estado: 'pendiente' },
  { id: 6, producto: 'Té Verde', total: 8.5, fecha: '10/02/2026', estado: 'completado' },
  { id: 7, producto: 'Lámpara LED', total: 22.0, fecha: '10/02/2026', estado: 'completado' },
  { id: 8, producto: 'Salchicha Food', total: 15.99, fecha: '05/02/2026', estado: 'pendiente' },
  { id: 9, producto: 'Cepillo Dental', total: 29.99, fecha: '03/02/2026', estado: 'pendiente' },
  { id: 10, producto: 'Nissi', total: 85.0, fecha: '20/01/2026', estado: 'completado' },
  { id: 11, producto: 'Refresco Sprite', total: 120.0, fecha: '16/01/2026', estado: 'completado' },
  { id: 12, producto: 'Coca Cola', total: 189.99, fecha: '14/01/2026', estado: 'pendiente' },
];
//los filtrooss
const TABS = [
  { key: 'todos', label: 'Todos' },
  { key: 'completado', label: 'Completado' },
  { key: 'pendiente', label: 'Pendiente' },
];
//lo de arriba de la tabla de ventas
function HistorialVentasDueno() {
  const navigate = useNavigate();
  const [ventas] = useState(VENTAS_INICIALES);
  const [busqueda, setBusqueda] = useState('');
  const [tabActiva, setTabActiva] = useState('todos');

  const ventasCompletadas = ventas.filter((v) => v.estado === 'completado');
  const ventasPendientes = ventas.filter((v) => v.estado === 'pendiente');
  const ingresosCompletados = ventasCompletadas.reduce((acc, v) => acc + v.total, 0);

  const ventasFiltradas = useMemo(() => {
    return ventas.filter((v) => {
      const coincideBusqueda =
        !busqueda.trim() ||
        v.producto.toLowerCase().includes(busqueda.toLowerCase()) ||
        String(v.id).includes(busqueda);
      const coincideTab = tabActiva === 'todos' || v.estado === tabActiva;
      return coincideBusqueda && coincideTab;
    });
  }, [ventas, busqueda, tabActiva]);

  //html pro
  return (
    <Layout role="Dueño" title="Historial de Venta" subtitle="Registro de todas las transacciones">
     <div className="historial-content">
       <div className="historial-actions-row">
         <button className="historial-history-button" onClick={() => navigate('/historico')}>
           <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
             <path d="M12 8v4l3 3M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z" />
           </svg>
           Ver Histórico
         </button>
       </div>
        <section className="historial-summary-grid">
          <div className="historial-summary-card">
            <div className="historial-summary-icon historial-summary-icon-green">
              <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <div>
              <p className="historial-summary-value">${ingresosCompletados.toFixed(2)}</p>
              <p className="historial-summary-label">Ingresos completados</p>
            </div>
          </div>

          <div className="historial-summary-card">
            <div className="historial-summary-icon historial-summary-icon-green">
              <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <div>
              <p className="historial-summary-value">{ventasCompletadas.length}</p>
              <p className="historial-summary-label">Ventas completadas</p>
            </div>
          </div>

          <div className="historial-summary-card">
            <div className="historial-summary-icon historial-summary-icon-orange">
              <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2" />
              </svg>
            </div>
            <div>
              <p className="historial-summary-value">{ventasPendientes.length}</p>
              <p className="historial-summary-label">Ventas pendientes</p>
            </div>
          </div>
        </section>

        <section className="historial-filters-bar">
          <div className="historial-search-wrapper">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" className="historial-search-icon">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              className="historial-search-input"
              placeholder="Buscar venta por nombre o ID..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          <div className="historial-tabs">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                className={`historial-tab ${tabActiva === tab.key ? 'historial-tab-active' : ''}`}
                onClick={() => setTabActiva(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </section>

        <section className="historial-table-wrapper">
          <table className="historial-table">
            <thead>
              <tr>
                <th className="historial-th-center">ID</th>
                <th>Producto</th>
                <th className="historial-th-center">Total</th>
                <th className="historial-th-center">Fecha</th>
                <th className="historial-th-center">Estado</th>
              </tr>
            </thead>
            <tbody>
              {ventasFiltradas.map((v) => (
                <tr key={v.id} className={v.estado === 'pendiente' ? 'historial-row-pendiente' : ''}>
                  <td className="historial-th-center historial-cell-id">{v.id}</td>
                  <td className="historial-cell-producto">{v.producto}</td>
                  <td className="historial-th-center historial-cell-total">${v.total.toFixed(2)}</td>
                  <td className="historial-th-center historial-cell-fecha">{v.fecha}</td>
                  <td className="historial-th-center">
                    <span className={`historial-badge historial-badge-${v.estado}`}>
                      {v.estado === 'completado' ? 'Completado' : 'Pendiente'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="historial-table-footer">
            Mostrando {ventasFiltradas.length} de {ventas.length} ventas
          </div>
        </section>
        </div>
        </Layout>
  );
}

export default HistorialVentasDueno;
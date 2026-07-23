import { useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import Layout from '../components/Layout';
import { obtenerHistorialVentas } from '../services/ventaService';
import '../Styles/Pages/historialVentasDueno.css';

//los filtrooss
const TABS = [
  { key: 'todos', label: 'Todos' },
  { key: 'completado', label: 'Completado' },
];
//lo de arriba de la tabla de ventas
function HistorialVentasDueno() {
  const navigate = useNavigate();
  const [ventas, setVentas] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [tabActiva, setTabActiva] = useState('todos');

  useEffect(() => {
    const cargarHistorial = async () => {
      try {
        const historial = await obtenerHistorialVentas();
        const normalizadas = (historial || []).map((v) => {
          const id = v.idVenta ?? v.id_venta ?? v.id ?? 0;
          const fechaBase = v.fechaVenta ?? v.fecha_venta ?? null;
          const fecha = fechaBase
            ? new Date(fechaBase).toLocaleDateString('es-MX')
            : 'N/A';

          return {
            id,
            producto: `Venta #${id}`,
            total: Number(v.total || 0),
            fecha,
            estado: 'completado',
          };
        });

        setVentas(normalizadas);
      } catch (error) {
        console.error('Error al cargar historial de ventas:', error);
      }
    };

    cargarHistorial();
  }, []);

  const ventasCompletadas = ventas.filter((v) => v.estado === 'completado');
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
              <p className="historial-summary-value">{ventas.length}</p>
              <p className="historial-summary-label">Ventas registradas</p>
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
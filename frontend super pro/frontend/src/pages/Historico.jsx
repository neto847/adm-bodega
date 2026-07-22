import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import '../Styles/Pages/Historico.css';

// Aquí se llamará a ventaService.js (o como se llame) para traer el histórico real
const VENTAS_HISTORICAS = [
  { id: 1, producto: 'Leche Lala', total: 899.99, fecha: '16/03/2026', categoria: 'Lácteos', estado: 'completado' },
  { id: 3, producto: 'Pasta Dental Crest', total: 35.0, fecha: '18/02/2026', categoria: 'Higiene personal', estado: 'completado' },
  { id: 4, producto: 'Queso Chédar', total: 45.99, fecha: '15/02/2026', categoria: 'Lácteos', estado: 'completado' },
  { id: 5, producto: 'Café Orgánico 500g', total: 12.99, fecha: '13/02/2026', categoria: 'Alimentos', estado: 'pendiente' },
  { id: 6, producto: 'Té Verde', total: 8.5, fecha: '10/02/2026', categoria: 'Alimentos', estado: 'completado' },
  { id: 8, producto: 'Salchicha Food', total: 15.99, fecha: '05/02/2026', categoria: 'Alimentos', estado: 'pendiente' },
  { id: 9, producto: 'Cepillo Dental', total: 29.99, fecha: '03/02/2026', categoria: 'Higiene personal', estado: 'pendiente' },
  { id: 10, producto: 'Nissi', total: 85.0, fecha: '20/01/2026', categoria: 'Alimentos', estado: 'completado' },
];
//togas las categorias (en realidad son 5)
const CATEGORIAS = ['Todas', 'Lácteos', 'Electrónica', 'Higiene personal', 'Alimentos', 'Hogar', 'Bebidas', 'Deportes'];
//filtros por fecha y categorias
function Historico() {
  const navigate = useNavigate();

  const [ventas] = useState(VENTAS_HISTORICAS);
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');
  const [categoria, setCategoria] = useState('Todas');
  const [ventasFiltradas, setVentasFiltradas] = useState(VENTAS_HISTORICAS);

  const handleFiltrar = () => {
    const resultado = ventas.filter((v) => {
      const coincideCategoria = categoria === 'Todas' || v.categoria === categoria;

      let coincideFecha = true;
      if (desde || hasta) {
        const [dia, mes, anio] = v.fecha.split('/');
        const fechaVenta = new Date(`${anio}-${mes}-${dia}`);
        if (desde) coincideFecha = coincideFecha && fechaVenta >= new Date(desde);
        if (hasta) coincideFecha = coincideFecha && fechaVenta <= new Date(hasta);
      }

      return coincideCategoria && coincideFecha;
    });

    setVentasFiltradas(resultado);
  };

  //html pro
  return (
    <Layout role="Encargado" title="Histórico" subtitle="Consulta el rendimiento de meses anteriores y tendencias de productos">
     <div className="historico-content"></div>
        <section className="historico-filters">
          <div className="historico-filter-field">
            <label className="historico-label">Desde:</label>
            <input
              type="date"
              className="historico-date-input"
              value={desde}
              onChange={(e) => setDesde(e.target.value)}
            />
          </div>

          <div className="historico-filter-field">
            <label className="historico-label">Hasta:</label>
            <input
              type="date"
              className="historico-date-input"
              value={hasta}
              onChange={(e) => setHasta(e.target.value)}
            />
          </div>

          <div className="historico-filter-field">
            <label className="historico-label">Categoria</label>
            <select
              className="historico-select"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
            >
              {CATEGORIAS.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <button className="historico-filtrar-button" onClick={handleFiltrar}>
            Filtrar
          </button>

          <button className="historico-back-button" onClick={() => navigate(-1)}>
            ← Volver
          </button>
        </section>

        <section className="historico-table-wrapper">
          <table className="historico-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th className="historico-th-center">ID</th>
                <th className="historico-th-center">Total</th>
                <th className="historico-th-center">Fecha</th>
                <th className="historico-th-center">Categoría</th>
                <th className="historico-th-center">Estado</th>
              </tr>
            </thead>
            <tbody>
              {ventasFiltradas.map((v) => (
                <tr key={v.id}>
                  <td className="historico-cell-producto">{v.producto}</td>
                  <td className="historico-th-center historico-cell-muted">{v.id}</td>
                  <td className="historico-th-center historico-cell-strong">${v.total.toFixed(2)}</td>
                  <td className="historico-th-center historico-cell-muted">{v.fecha}</td>
                  <td className="historico-th-center">
                    <span className="historico-categoria-badge">{v.categoria}</span>
                  </td>
                  <td className="historico-th-center">
                    <span className={`historico-badge historico-badge-${v.estado}`}>
                      {v.estado === 'completado' ? 'Completado' : 'Pendiente'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {ventasFiltradas.length === 0 && (
            <p className="historico-empty">No se encontraron ventas con estos filtros.</p>
          )}
        </section>
        </Layout>
  );
}

export default Historico;
import { useState, useMemo } from 'react';
import Layout from '../components/Layout';
import '../Styles/Pages/AlertasCaducidad.css';

// Aquí se llamará a alertaService.js para traer los lotes reales
const LOTES_INICIALES = [
  { id: 1, producto: 'Leche Lala', lote: 'LOT-2026-A01', categoria: 'Lácteos', cantidad: 24, valor: 696.0, vencimiento: '19 jun 2026', diasTexto: 'Vencido hace 5 días', estado: 'vencido', proveedor: 'Mayoreo Central', revisado: false },
  { id: 2, producto: 'Queso Chédar', lote: 'LOT-2026-A02', categoria: 'Lácteos', cantidad: 8, valor: 368.0, vencimiento: '21 jun 2026', diasTexto: 'Vencido hace 3 días', estado: 'vencido', proveedor: 'Mayoreo Central', revisado: false },
  { id: 3, producto: 'Leche Lala', lote: 'LOT-2026-A05', categoria: 'Lácteos', cantidad: 20, valor: 580.0, vencimiento: '01 jul 2026', diasTexto: '7 días', estado: 'critico', proveedor: 'Mayoreo Central', revisado: false },
  { id: 4, producto: 'Café Orgánico 500g', lote: 'LOT-2026-A06', categoria: 'Alimentos', cantidad: 18, valor: 953.82, vencimiento: '29 jun 2026', diasTexto: '5 días', estado: 'critico', proveedor: 'Distribuidora Norte', revisado: false },
  { id: 5, producto: 'Salchicha Food', lote: 'LOT-2026-A07', categoria: 'Alimentos', cantidad: 15, valor: 524.85, vencimiento: '25 jun 2026', diasTexto: '1 día', estado: 'critico', proveedor: 'Distribuidora Norte', revisado: false },
  { id: 6, producto: 'Té Verde', lote: 'LOT-2026-A08', categoria: 'Alimentos', cantidad: 30, valor: 255.0, vencimiento: '15 jul 2026', diasTexto: '21 días', estado: 'proximo', proveedor: 'Mayoreo Central', revisado: false },
  { id: 7, producto: 'Coca Cola', lote: 'LOT-2026-A09', categoria: 'Bebidas', cantidad: 36, valor: 1871.64, vencimiento: '18 jul 2026', diasTexto: '24 días', estado: 'proximo', proveedor: 'Bebidas del Sureste', revisado: false },
  { id: 8, producto: 'Refresco Sprite', lote: 'LOT-2026-A10', categoria: 'Bebidas', cantidad: 20, valor: 800.0, vencimiento: '20 jul 2026', diasTexto: '26 días', estado: 'proximo', proveedor: 'Bebidas del Sureste', revisado: false },
  { id: 9, producto: 'Cepillo Dental', lote: 'LOT-2026-A11', categoria: 'Higiene personal', cantidad: 25, valor: 749.75, vencimiento: '23 jul 2026', diasTexto: '29 días', estado: 'proximo', proveedor: 'Distribuidora Norte', revisado: false },
  { id: 10, producto: 'Pasta Dental Crest', lote: 'LOT-2026-A12', categoria: 'Higiene personal', cantidad: 25, valor: 875.0, vencimiento: '10 ago 2026', diasTexto: '47 días', estado: 'vigente', proveedor: 'Distribuidora Norte', revisado: true },
  { id: 11, producto: 'Nissi', lote: 'LOT-2026-A13', categoria: 'Alimentos', cantidad: 8, valor: 120.0, vencimiento: '15 ago 2026', diasTexto: '52 días', estado: 'vigente', proveedor: 'Mayoreo Central', revisado: true },
  { id: 12, producto: 'Lámpara LED', lote: 'LOT-2026-A14', categoria: 'Hogar', cantidad: 12, valor: 864.0, vencimiento: '01 sep 2026', diasTexto: '69 días', estado: 'vigente', proveedor: 'Distribuidora Norte', revisado: true },
];

//Filtros para las alertas de caducidad
const TABS = [
  { key: 'todos', label: 'Todos' },
  { key: 'vencido', label: 'Vencidos' },
  { key: 'critico', label: 'Críticos' },
  { key: 'proximo', label: 'Próximos' },
  { key: 'vigente', label: 'Vigentes' },
];

const ESTADO_LABEL = { vencido: 'Vencido', critico: 'Crítico', proximo: 'Próximo', vigente: 'Vigente' };

//para las alertas 
function AlertasCaducidad() {
  const [lotes, setLotes] = useState(LOTES_INICIALES);
  const [tabActiva, setTabActiva] = useState('todos');
  const [categoriaFiltro, setCategoriaFiltro] = useState('');
  const [orden, setOrden] = useState('vencimiento');

  const categorias = useMemo(
    () => [...new Set(lotes.map((l) => l.categoria))].sort(),
    [lotes]
  );

  const conteos = useMemo(() => {
    const base = { vencido: 0, critico: 0, proximo: 0, vigente: 0 };
    lotes.forEach((l) => (base[l.estado] += 1));
    return base;
  }, [lotes]);

  const unidadesPorEstado = useMemo(() => {
    const base = { vencido: 0, critico: 0, proximo: 0, vigente: 0 };
    lotes.forEach((l) => (base[l.estado] += l.cantidad));
    return base;
  }, [lotes]);

  const valorEnRiesgo = useMemo(
    () =>
      lotes
        .filter((l) => l.estado === 'vencido' || l.estado === 'critico')
        .reduce((acc, l) => acc + l.valor, 0),
    [lotes]
  );

  const lotesFiltrados = useMemo(() => {
    let resultado = lotes.filter((l) => {
      const coincideTab = tabActiva === 'todos' || l.estado === tabActiva;
      const coincideCategoria = !categoriaFiltro || l.categoria === categoriaFiltro;
      return coincideTab && coincideCategoria;
    });

    if (orden === 'valor') {
      resultado = [...resultado].sort((a, b) => b.valor - a.valor);
    } else if (orden === 'cantidad') {
      resultado = [...resultado].sort((a, b) => b.cantidad - a.cantidad);
    }
    // "vencimiento" respeta el orden original, osea, por fecha de vencimiento

    return resultado;
  }, [lotes, tabActiva, categoriaFiltro, orden]);

  const totalUnidadesFiltradas = lotesFiltrados.reduce((acc, l) => acc + l.cantidad, 0);
  const valorTotalFiltrado = lotesFiltrados.reduce((acc, l) => acc + l.valor, 0);

  const handleToggleRevisado = (id) => {
    setLotes((prev) =>
      prev.map((l) => (l.id === id ? { ...l, revisado: !l.revisado } : l))
    );
    // Aquí se llamará al back de Neto alertaService.js o como se llame xd
    // Algo así: alertaService.marcarRevisado(id, !revisado);
  };
// esta es la estructura así bn pro como en tópicos con html
  return (
    <Layout role="Dueño" title="Alertas de Caducidad" subtitle="Monitoreo de fechas de vencimiento por lote">
     <div className="alertas-content">
       <div className="alertas-actions-row">
         <span className="alertas-urgent-badge">{conteos.vencido + conteos.critico} urgentes</span>
       </div>
        <section className="alertas-risk-banner">
          <div className="alertas-risk-left">
            <div className="alertas-risk-icon">⚠</div>
            <div>
              <p className="alertas-risk-title">Valor en riesgo detectado</p>
              <p className="alertas-risk-subtitle">
                {conteos.vencido + conteos.critico} lotes vencidos o por vencer en los próximos 7 días
              </p>
            </div>
          </div>
          <div className="alertas-risk-right">
            <p className="alertas-risk-value">${valorEnRiesgo.toFixed(2)}</p>
            <p className="alertas-risk-value-label">en inventario comprometido</p>
          </div>
        </section>

        <section className="alertas-summary-grid">
          <div className="alertas-summary-card alertas-summary-vencido">
            <div className="alertas-summary-top">
              <div className="alertas-summary-icon alertas-summary-icon-vencido">⏱</div>
              <span className="alertas-summary-value alertas-summary-value-vencido">{conteos.vencido}</span>
            </div>
            <p className="alertas-summary-label">Vencidos</p>
            <p className="alertas-summary-detail">{unidadesPorEstado.vencido} unidades totales</p>
          </div>

          <div className="alertas-summary-card alertas-summary-critico">
            <div className="alertas-summary-top">
              <div className="alertas-summary-icon alertas-summary-icon-critico">⏱</div>
              <span className="alertas-summary-value alertas-summary-value-critico">{conteos.critico}</span>
            </div>
            <p className="alertas-summary-label">Críticos (≤7d)</p>
            <p className="alertas-summary-detail">{unidadesPorEstado.critico} unidades totales</p>
          </div>

          <div className="alertas-summary-card alertas-summary-proximo">
            <div className="alertas-summary-top">
              <div className="alertas-summary-icon alertas-summary-icon-proximo">⏱</div>
              <span className="alertas-summary-value alertas-summary-value-proximo">{conteos.proximo}</span>
            </div>
            <p className="alertas-summary-label">Próximos (≤30d)</p>
            <p className="alertas-summary-detail">{unidadesPorEstado.proximo} unidades totales</p>
          </div>

          <div className="alertas-summary-card alertas-summary-vigente">
            <div className="alertas-summary-top">
              <div className="alertas-summary-icon alertas-summary-icon-vigente">✓</div>
              <span className="alertas-summary-value alertas-summary-value-vigente">{conteos.vigente}</span>
            </div>
            <p className="alertas-summary-label">Vigentes</p>
            <p className="alertas-summary-detail">{unidadesPorEstado.vigente} unidades totales</p>
          </div>
        </section>

        <section className="alertas-filters-bar">
          <div className="alertas-tabs">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                className={`alertas-tab ${tabActiva === tab.key ? 'alertas-tab-active' : ''}`}
                onClick={() => setTabActiva(tab.key)}
              >
                {tab.label}
                <span className="alertas-tab-count">
                  {tab.key === 'todos' ? lotes.length : conteos[tab.key]}
                </span>
              </button>
            ))}
          </div>

          <div className="alertas-filters-right">
            <select
              className="alertas-filter-select"
              value={categoriaFiltro}
              onChange={(e) => setCategoriaFiltro(e.target.value)}
            >
              <option value="">Todas las categorías</option>
              {categorias.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <select
              className="alertas-filter-select"
              value={orden}
              onChange={(e) => setOrden(e.target.value)}
            >
              <option value="vencimiento">Ordenar: Vencimiento</option>
              <option value="valor">Ordenar: Valor</option>
              <option value="cantidad">Ordenar: Cantidad</option>
            </select>

            <span className="alertas-filters-count">{lotesFiltrados.length} lotes</span>
          </div>
        </section>

        <section className="alertas-table-wrapper">
          <table className="alertas-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Lote</th>
                <th>Categoría</th>
                <th className="alertas-th-center">Qty</th>
                <th className="alertas-th-right">Valor</th>
                <th className="alertas-th-center">Vencimiento</th>
                <th className="alertas-th-center">Días rest.</th>
                <th>Proveedor</th>
                <th className="alertas-th-center">Estado</th>
                <th className="alertas-th-center">Revisado</th>
              </tr>
            </thead>
            <tbody>
              {lotesFiltrados.map((l) => (
                <tr key={l.id} className={`alertas-row-${l.estado}`}>
                  <td className="alertas-cell-producto">{l.producto}</td>
                  <td>
                    <span className="alertas-lote-tag">{l.lote}</span>
                  </td>
                  <td>
                    <span className="alertas-categoria-badge">{l.categoria}</span>
                  </td>
                  <td className="alertas-th-center">{l.cantidad}</td>
                  <td className="alertas-th-right alertas-cell-valor">${l.valor.toFixed(2)}</td>
                  <td className="alertas-th-center alertas-cell-fecha">{l.vencimiento}</td>
                  <td className={`alertas-th-center alertas-dias-${l.estado}`}>{l.diasTexto}</td>
                  <td className="alertas-cell-proveedor">{l.proveedor}</td>
                  <td className="alertas-th-center">
                    <span className={`alertas-estado-badge alertas-estado-${l.estado}`}>
                      {ESTADO_LABEL[l.estado]}
                    </span>
                  </td>
                  <td className="alertas-th-center">
                    <button
                      className={`alertas-revisado-check ${l.revisado ? 'alertas-revisado-check-on' : ''}`}
                      onClick={() => handleToggleRevisado(l.id)}
                      aria-label="Marcar como revisado"
                    >
                      {l.revisado && '✓'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="alertas-table-footer">
            <span>
              {lotesFiltrados.length} lotes · {totalUnidadesFiltradas} unidades totales
            </span>
            <span className="alertas-table-footer-total">Valor total: ${valorTotalFiltrado.toFixed(2)}</span>
          </div>
        </section>

        <div className="alertas-legend">
          <span className="alertas-legend-label">Estado:</span>
          <span className="alertas-legend-item">
            <span className="alertas-legend-dot alertas-legend-dot-vencido" /> Vencido
          </span>
          <span className="alertas-legend-item">
            <span className="alertas-legend-dot alertas-legend-dot-critico" /> Crítico ≤7d
          </span>
          <span className="alertas-legend-item">
            <span className="alertas-legend-dot alertas-legend-dot-proximo" /> Próximo ≤30d
          </span>
          <span className="alertas-legend-item">
            <span className="alertas-legend-dot alertas-legend-dot-vigente" /> Vigente
          </span>
        </div>
      </div>
    </Layout>
  );
}

export default AlertasCaducidad;
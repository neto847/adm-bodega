import { useEffect, useMemo, useState } from 'react';
import Layout from '../components/Layout';
import { listarProductos } from '../services/productoService';
import "../Styles/Pages/Inventario.css";

// Aquí se llamará a productoService.js para traer el listado completo real
const PRODUCTOS_REGISTRADOS = [
  { id: 1, nombre: 'Leche Lala', categoria: 'Lácteos', precio: 29.0, stock: 15, estado: 'Activo' },
  { id: 2, nombre: 'Mouse Inalámbrico', categoria: 'Electrónica', precio: 225.5, stock: 3, estado: 'Activo' },
  { id: 3, nombre: 'Pasta Dental Crest', categoria: 'Higiene personal', precio: 35.0, stock: 25, estado: 'Activo' },
  { id: 4, nombre: 'Queso Chédar', categoria: 'Lácteos', precio: 45.99, stock: 18, estado: 'Activo' },
  { id: 5, nombre: 'Café Orgánico 500g', categoria: 'Alimentos', precio: 52.99, stock: 5, estado: 'Activo' },
  { id: 6, nombre: 'Té Verde', categoria: 'Alimentos', precio: 8.5, stock: 30, estado: 'Activo' },
  { id: 7, nombre: 'Lámpara LED', categoria: 'Hogar', precio: 72.0, stock: 12, estado: 'Activo' },
  { id: 8, nombre: 'Salchicha Food', categoria: 'Alimentos', precio: 34.99, stock: 0, estado: 'Inactivo' },
  { id: 9, nombre: 'Cepillo Dental', categoria: 'Higiene personal', precio: 29.99, stock: 2, estado: 'Activo' },
  { id: 10, nombre: 'Nissi', categoria: 'Alimentos', precio: 15.0, stock: 8, estado: 'Activo' },
  { id: 11, nombre: 'Refresco Sprite', categoria: 'Bebidas', precio: 40.0, stock: 20, estado: 'Activo' },
  { id: 12, nombre: 'Coca Cola', categoria: 'Bebidas', precio: 51.99, stock: 0, estado: 'Descontinuado' },
];

const ESTADOS = ['Activo', 'Inactivo', 'Deshabilitado', 'Descontinuado'];
const UMBRAL_STOCK_BAJO = 5;

function Inventario() {
  const [productos, setProductos] = useState(PRODUCTOS_REGISTRADOS);
  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const datos = await listarProductos();
        const normalizados = (datos || []).map((p) => ({
          id: p.idProducto,
          nombre: p.nombre,
          categoria: p.idCategoria === 1 ? 'Lácteos y embutidos' : 'Limpieza/Hogar',
          precio: Number(p.precioVenta || 0),
          stock: Number(p.stockActual || 0),
          estado: p.idEstado === 1 ? 'Activo' : 'Descontinuado',
        }));
        setProductos(normalizados);
      } catch (error) {
        console.error('Error al cargar inventario:', error);
      }
    };

    cargarProductos();
  }, []);

  const [busqueda, setBusqueda] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState('');

  const categorias = useMemo(
    () => [...new Set(productos.map((p) => p.categoria))].sort(),
    [productos]
  );

  const productosFiltrados = useMemo(() => {
    return productos.filter((p) => {
      const coincideBusqueda =
        !busqueda.trim() ||
        p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        String(p.id).includes(busqueda);
      const coincideCategoria = !categoriaFiltro || p.categoria === categoriaFiltro;
      const coincideEstado = !estadoFiltro || p.estado === estadoFiltro;
      return coincideBusqueda && coincideCategoria && coincideEstado;
    });
  }, [productos, busqueda, categoriaFiltro, estadoFiltro]);

  return (
    <Layout role="Dueño" title="Inventario" subtitle="Todos los productos registrados en el sistema">
      <div className="inv-content">
        <section className="inv-toolbar">
          <div className="inv-search-wrapper">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" className="inv-search-icon">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              className="inv-search-input"
              placeholder="Buscar por nombre o ID..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          <select
            className="inv-filter-select"
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
            className="inv-filter-select"
            value={estadoFiltro}
            onChange={(e) => setEstadoFiltro(e.target.value)}
          >
            <option value="">Todos los estados</option>
            {ESTADOS.map((estado) => (
              <option key={estado} value={estado}>
                {estado}
              </option>
            ))}
          </select>
        </section>

        <section className="inv-table-wrapper">
          <table className="inv-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock Actual</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {productosFiltrados.map((p) => {
                const stockBajo = p.stock <= UMBRAL_STOCK_BAJO;
                return (
                  <tr key={p.id} className={stockBajo ? 'inv-row-bajo-stock' : ''}>
                    <td>{p.id}</td>
                    <td className="inv-cell-nombre">{p.nombre}</td>
                    <td>{p.categoria}</td>
                    <td>${p.precio.toFixed(2)}</td>
                    <td className={stockBajo ? 'inv-stock-bajo' : 'inv-stock-normal'}>
                      {p.stock}
                    </td>
                    <td>
                      <span className={`inv-badge inv-badge-${p.estado.toLowerCase()}`}>
                        {p.estado}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="inv-table-footer">
            Mostrando {productosFiltrados.length} de {productos.length} productos registrados
          </div>
        </section>
      </div>
    </Layout>
  );
}

export default Inventario;
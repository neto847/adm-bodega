import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import '../Styles/Pages/AgregarProducto.css';

// Aquí se llamará a productoService.js (o como le haya puesto Neto) para tener los datos chidos
const CATEGORIAS = ['Todas', 'Lácteos', 'Electrónica', 'Higiene personal', 'Alimentos', 'Hogar', 'Bebidas', 'Deportes'];

const PRODUCTOS_INICIALES = [
  { id: 1, nombre: 'Leche Lala', categoria: 'Lácteos', precio: 29.0 },
  { id: 2, nombre: 'Mouse Inalámbrico', categoria: 'Electrónica', precio: 225.5 },
  { id: 3, nombre: 'Pasta Dental Crest', categoria: 'Higiene personal', precio: 35.0 },
  { id: 4, nombre: 'Queso Chédar', categoria: 'Lácteos', precio: 45.99 },
  { id: 5, nombre: 'Café Orgánico 500g', categoria: 'Alimentos', precio: 52.99 },
  { id: 6, nombre: 'Té Verde', categoria: 'Alimentos', precio: 8.5 },
  { id: 7, nombre: 'Lámpara LED', categoria: 'Hogar', precio: 72.0 },
  { id: 8, nombre: 'Salchicha Food', categoria: 'Alimentos', precio: 34.99 },
  { id: 9, nombre: 'Cepillo Dental', categoria: 'Higiene personal', precio: 29.99 },
  { id: 10, nombre: 'Nissi', categoria: 'Alimentos', precio: 15.0 },
  { id: 11, nombre: 'Refresco Sprite', categoria: 'Bebidas', precio: 40.0 },
  { id: 12, nombre: 'Coca Cola', categoria: 'Bebidas', precio: 51.99 },
];

function AgregarProducto() {
  const navigate = useNavigate();

  const [productos] = useState(PRODUCTOS_INICIALES);
  const [busqueda, setBusqueda] = useState('');
  const [categoriaActiva, setCategoriaActiva] = useState('Todas');
  const [seleccionados, setSeleccionados] = useState([]);

  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: '',
    categoria: '',
    precio: '',
    stockInicial: '',
  });

  const productosFiltrados = useMemo(() => {
    return productos.filter((p) => {
      const coincideCategoria = categoriaActiva === 'Todas' || p.categoria === categoriaActiva;
      const coincideBusqueda =
        !busqueda.trim() || p.nombre.toLowerCase().includes(busqueda.toLowerCase());
      return coincideCategoria && coincideBusqueda;
    });
  }, [productos, categoriaActiva, busqueda]);

  const handleToggleSeleccion = (id) => {
    setSeleccionados((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleAgregar = (producto) => {
    // Aquí se llamará al archivo de Neto (ej. inventarioService.js)
    // queda algo así: await inventarioService.agregarProducto(producto.id);
    console.log('Producto agregado:', producto);
  };

  const handleAbrirModal = () => {
    setNuevoProducto({ nombre: '', categoria: '', precio: '', stockInicial: '' });
    setMostrarModal(true);
  };

  const handleCrearProducto = async () => {
    if (!nuevoProducto.nombre.trim() || !nuevoProducto.categoria.trim()) return;
    try {
      // Aquí se llamará al back productoService.js
      // algo así: await productoService.crear(nuevoProducto);
      setMostrarModal(false);
    } catch (err) {
      console.error('Error al crear el producto:', err);
    }
  };
// el html así bn perro
  return (
    <div className="agregarprod-container">
      <Layout role="Encargado" />

      <main className="agregarprod-content">
        <header className="agregarprod-header">
          <div>
            <h1 className="agregarprod-title">Agregar Producto</h1>
            <p className="agregarprod-subtitle">Gestiona tu inventario de productos</p>
          </div>
          <div className="agregarprod-header-actions">
            <button className="agregarprod-new-button" onClick={handleAbrirModal}>
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Crear Nuevo
            </button>
            <button className="agregarprod-back-button" onClick={() => navigate(-1)}>
              ← Volver
            </button>
          </div>
        </header>

        <div className="agregarprod-search-wrapper">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" className="agregarprod-search-icon">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            className="agregarprod-search-input"
            placeholder="Buscar Producto..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <section className="agregarprod-table-card">
          <div className="agregarprod-tabs">
            {CATEGORIAS.map((cat) => (
              <button
                key={cat}
                className={`agregarprod-tab ${categoriaActiva === cat ? 'agregarprod-tab-active' : ''}`}
                onClick={() => setCategoriaActiva(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="agregarprod-table-header">
            <span className="agregarprod-col-producto">Producto</span>
            <span className="agregarprod-col-categoria">Categoría</span>
            <span className="agregarprod-col-precio">Precio</span>
            <span className="agregarprod-col-seleccionar">Seleccionar</span>
            <span className="agregarprod-col-agregar">Agregar</span>
          </div>

          <div className="agregarprod-table-body">
            {productosFiltrados.map((p) => (
              <div className="agregarprod-row" key={p.id}>
                <span className="agregarprod-col-producto agregarprod-cell-nombre">{p.nombre}</span>
                <span className="agregarprod-col-categoria">
                  <span className="agregarprod-categoria-badge">{p.categoria}</span>
                </span>
                <span className="agregarprod-col-precio">${p.precio.toFixed(2)}</span>
                <span className="agregarprod-col-seleccionar">
                  <input
                    type="checkbox"
                    checked={seleccionados.includes(p.id)}
                    onChange={() => handleToggleSeleccion(p.id)}
                    className="agregarprod-checkbox"
                  />
                </span>
                <span className="agregarprod-col-agregar">
                  <button className="agregarprod-add-button" onClick={() => handleAgregar(p)}>
                    + Agregar
                  </button>
                </span>
              </div>
            ))}
          </div>
        </section>
      </main>

      {mostrarModal && (
        <div className="agregarprod-modal-overlay" onClick={() => setMostrarModal(false)}>
          <div className="agregarprod-modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="agregarprod-modal-title">Nuevo Producto</h2>

            <div className="agregarprod-form-field">
              <label className="agregarprod-label">Nombre</label>
              <input
                type="text"
                className="agregarprod-input"
                placeholder="Nombre del producto"
                value={nuevoProducto.nombre}
                onChange={(e) => setNuevoProducto((prev) => ({ ...prev, nombre: e.target.value }))}
              />
            </div>

            <div className="agregarprod-form-field">
              <label className="agregarprod-label">Categoría</label>
              <select
                className="agregarprod-input"
                value={nuevoProducto.categoria}
                onChange={(e) => setNuevoProducto((prev) => ({ ...prev, categoria: e.target.value }))}
              >
                <option value="">Seleccionar categoría</option>
                {CATEGORIAS.filter((c) => c !== 'Todas').map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="agregarprod-form-row">
              <div className="agregarprod-form-field">
                <label className="agregarprod-label">Precio</label>
                <input
                  type="number"
                  step="0.01"
                  className="agregarprod-input"
                  placeholder="0.00"
                  value={nuevoProducto.precio}
                  onChange={(e) => setNuevoProducto((prev) => ({ ...prev, precio: e.target.value }))}
                />
              </div>
              <div className="agregarprod-form-field">
                <label className="agregarprod-label">Stock inicial</label>
                <input
                  type="number"
                  className="agregarprod-input"
                  placeholder="0"
                  value={nuevoProducto.stockInicial}
                  onChange={(e) =>
                    setNuevoProducto((prev) => ({ ...prev, stockInicial: e.target.value }))
                  }
                />
              </div>
            </div>

            <div className="agregarprod-modal-actions">
              <button className="agregarprod-cancel-button" onClick={() => setMostrarModal(false)}>
                Cancelar
              </button>
              <button className="agregarprod-create-button" onClick={handleCrearProducto}>
                Crear Producto
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AgregarProducto;
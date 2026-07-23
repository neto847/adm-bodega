import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { crearProveedor, listarProveedores } from '../services/catalogoService';
import { registrarCompra } from '../services/compraService';
import { listarProductos } from '../services/productoService';
import '../Styles/Pages/ReabastecimientoInventario.css';

//para seleccionar proveedor, asignar nomero de lote y agregar productos para el detalle de la compra
function ReabastecimientoInventario() {
  const navigate = useNavigate();

  const [proveedores, setProveedores] = useState([]);
  const [catalogoProductos, setCatalogoProductos] = useState([]);
  const [proveedor, setProveedor] = useState('');
  const [numeroLote, setNumeroLote] = useState('');

  const [busquedaProducto, setBusquedaProducto] = useState('');
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
  const [cantidad, setCantidad] = useState(1);
  const [costoUnitario, setCostoUnitario] = useState('');

  const [productosAgregados, setProductosAgregados] = useState([]);
  const [entradaProcesada, setEntradaProcesada] = useState(false);

  const [mostrarModalProveedor, setMostrarModalProveedor] = useState(false);
  const [nuevoProveedor, setNuevoProveedor] = useState({ nombre: '', contacto: '', telefono: '' });

  const sugerenciasProducto = useMemo(() => {
    if (!busquedaProducto.trim()) return [];
    return catalogoProductos.filter((p) =>
      p.nombre.toLowerCase().includes(busquedaProducto.toLowerCase())
    ).slice(0, 6);
  }, [busquedaProducto, catalogoProductos]);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [proveedoresApi, productosApi] = await Promise.all([
          listarProveedores(),
          listarProductos(),
        ]);

        setProveedores(
          (proveedoresApi || []).map((p) => ({
            id: p.idProveedor,
            nombre: p.nombre,
          }))
        );

        setCatalogoProductos(
          (productosApi || []).map((p) => ({
            id: p.idProducto,
            nombre: p.nombre,
          }))
        );
      } catch (err) {
        console.error('Error al cargar catálogo de reabastecimiento:', err);
      }
    };

    cargarDatos();
  }, []);

  const totalUnidades = productosAgregados.reduce((acc, p) => acc + p.cantidad, 0);
  const totalCompra = productosAgregados.reduce((acc, p) => acc + p.cantidad * p.costoUnitario, 0);

  const puedeAgregarProducto =
    productoSeleccionado && Number(cantidad) > 0 && Number(costoUnitario) > 0;

  const progreso = {
    proveedor: Boolean(proveedor),
    lote: Boolean(numeroLote.trim()),
    productos: productosAgregados.length > 0,
  };

  const handleSeleccionarProducto = (producto) => {
    setProductoSeleccionado(producto);
    setBusquedaProducto(producto.nombre);
    setMostrarSugerencias(false);
  };

  const handleAgregarProducto = () => {
    if (!puedeAgregarProducto) return;

    setProductosAgregados((prev) => [
      ...prev,
      {
        id: productoSeleccionado.id,
        nombre: productoSeleccionado.nombre,
        cantidad: Number(cantidad),
        costoUnitario: Number(costoUnitario),
      },
    ]);

    setProductoSeleccionado(null);
    setBusquedaProducto('');
    setCantidad(1);
    setCostoUnitario('');
  };

  const handleEliminarProducto = (index) => {
    setProductosAgregados((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAbrirModalProveedor = () => {
    setNuevoProveedor({ nombre: '', contacto: '', telefono: '' });
    setMostrarModalProveedor(true);
  };

  const handleGuardarProveedor = async () => {
    if (!nuevoProveedor.nombre.trim()) return;

    try {
      await crearProveedor({
        nombre: nuevoProveedor.nombre.trim(),
        telefono: nuevoProveedor.telefono?.trim() || '',
        email: '',
        direccion: nuevoProveedor.contacto?.trim() || '',
        activo: true,
      });

      const proveedoresApi = await listarProveedores();
      const normalizados = (proveedoresApi || []).map((p) => ({
        id: p.idProveedor,
        nombre: p.nombre,
      }));
      setProveedores(normalizados);

      const creado = normalizados.find((p) => p.nombre === nuevoProveedor.nombre.trim());
      if (creado) {
        setProveedor(String(creado.id));
      }

      setMostrarModalProveedor(false);
    } catch (err) {
      console.error('Error al crear el proveedor:', err);
    }
  };

  const handleCancelar = () => {
    setProveedor('');
    setNumeroLote('');
    setProductosAgregados([]);
    navigate('/dashboard');
  };

  const handleProcesarEntrada = async () => {
    if (!progreso.proveedor || !progreso.lote || !progreso.productos) return;

    try {
      await registrarCompra({
        idUsuario: 1,
        idProveedor: Number(proveedor),
        total: totalCompra,
        detalles: productosAgregados.map((p) => ({
          idProducto: p.id,
          cantidad: p.cantidad,
          precioUnitario: p.costoUnitario,
        })),
      });

      setEntradaProcesada(true);
      setProveedor('');
      setNumeroLote('');
      setProductosAgregados([]);

      setTimeout(() => setEntradaProcesada(false), 4000);
    } catch (err) {
      console.error('Error al procesar la entrada:', err);
    }
  };

  //html pro ya sabemos, no somos ciegos
return (
  <Layout role="Encargado" title="Reabastecimiento de Inventario" subtitle="Registrar entrada de nuevos lotes de productos">
    <div className="reabasto-content"></div>

    {entradaProcesada && (
      <div className="reabasto-success-banner">
        ✓ Entrada procesada exitosamente. Inventario actualizado.
      </div>
    )}

    <section className="reabasto-body">
      <div className="reabasto-main-col">
        <div className="reabasto-card">
          <h2 className="reabasto-card-title">Información de Compra</h2>
          <p className="reabasto-card-subtitle">
            Seleccione el proveedor e ingrese el número de lote
          </p>

          <div className="reabasto-form-row">
            <div className="reabasto-form-field">
              <label className="reabasto-label">
                Proveedor <span className="reabasto-required">*</span>
              </label>
              <select
                className="reabasto-select"
                value={proveedor}
                onChange={(e) => setProveedor(e.target.value)}
              >
                <option value="">Seleccionar proveedor</option>
                {proveedores.map((prov) => (
                  <option key={prov.id} value={prov.id}>
                    {prov.nombre}
                  </option>
                ))}
              </select>
              <button className="reabasto-new-provider-link" onClick={handleAbrirModalProveedor}>
                + Crear nuevo proveedor
              </button>
            </div>

            <div className="reabasto-form-field">
              <label className="reabasto-label">
                Número de Lote <span className="reabasto-required">*</span>
              </label>
              <input
                type="text"
                className="reabasto-input"
                placeholder="Ej: LOT-2026-001"
                value={numeroLote}
                onChange={(e) => setNumeroLote(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="reabasto-card">
          <h2 className="reabasto-card-title">Agregar Productos</h2>
          <p className="reabasto-card-subtitle">Busque y agregue productos a la compra</p>

          <div className="reabasto-form-row reabasto-form-row-3">
            <div className="reabasto-form-field reabasto-autocomplete-wrapper">
              <label className="reabasto-label">
                Producto <span className="reabasto-required">*</span>
              </label>
              <div className="reabasto-search-input-wrapper">
                <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" className="reabasto-search-icon">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
                <input
                  type="text"
                  className="reabasto-input reabasto-input-with-icon"
                  placeholder="Buscar producto..."
                  value={busquedaProducto}
                  onChange={(e) => {
                    setBusquedaProducto(e.target.value);
                    setProductoSeleccionado(null);
                    setMostrarSugerencias(true);
                  }}
                  onFocus={() => setMostrarSugerencias(true)}
                  onBlur={() => setTimeout(() => setMostrarSugerencias(false), 150)}
                  autoComplete="off"
                />
              </div>
              {mostrarSugerencias && sugerenciasProducto.length > 0 && (
                <ul className="reabasto-autocomplete-list">
                  {sugerenciasProducto.map((p) => (
                    <li
                      key={p.id}
                      className="reabasto-autocomplete-item"
                      onMouseDown={() => handleSeleccionarProducto(p)}
                    >
                      {p.nombre}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="reabasto-form-field">
              <label className="reabasto-label">
                Cantidad <span className="reabasto-required">*</span>
              </label>
              <input
                type="number"
                min="1"
                className="reabasto-input"
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
              />
            </div>

            <div className="reabasto-form-field">
              <label className="reabasto-label">
                Costo Unitario <span className="reabasto-required">*</span>
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                className="reabasto-input"
                placeholder="0.00"
                value={costoUnitario}
                onChange={(e) => setCostoUnitario(e.target.value)}
              />
            </div>
          </div>

          <button
            className="reabasto-add-product-button"
            onClick={handleAgregarProducto}
            disabled={!puedeAgregarProducto}
          >
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Agregar producto
          </button>

          {productosAgregados.length === 0 ? (
            <p className="reabasto-empty-hint">
              Seleccione un producto e ingrese cantidad y costo
            </p>
          ) : (
            <div className="reabasto-table-wrapper">
              <table className="reabasto-table">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th className="reabasto-th-center">Qty</th>
                    <th className="reabasto-th-center">Costo Unit.</th>
                    <th className="reabasto-th-center">Subtotal</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {productosAgregados.map((p, index) => (
                    <tr key={`${p.id}-${index}`}>
                      <td className="reabasto-cell-strong">{p.nombre}</td>
                      <td className="reabasto-th-center">{p.cantidad}</td>
                      <td className="reabasto-th-center">${p.costoUnitario.toFixed(2)}</td>
                      <td className="reabasto-th-center reabasto-cell-strong">
                        ${(p.cantidad * p.costoUnitario).toFixed(2)}
                      </td>
                      <td className="reabasto-th-center">
                        <button
                          className="reabasto-remove-button"
                          onClick={() => handleEliminarProducto(index)}
                          aria-label="Eliminar producto"
                        >
                          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14z" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div className="reabasto-side-col">
        <div className="reabasto-card">
          <h2 className="reabasto-card-title">Resumen de Compra</h2>

          <div className="reabasto-summary-row">
            <span className="reabasto-summary-label">Proveedor</span>
            <span className="reabasto-summary-value">
              {proveedores.find((p) => String(p.id) === String(proveedor))?.nombre || 'No seleccionado'}
            </span>
          </div>
          <div className="reabasto-summary-row">
            <span className="reabasto-summary-label">Lote</span>
            <span className="reabasto-summary-value">{numeroLote || '—'}</span>
          </div>
          <div className="reabasto-summary-row">
            <span className="reabasto-summary-label">Productos</span>
            <span className="reabasto-summary-value">{productosAgregados.length}</span>
          </div>
          <div className="reabasto-summary-row reabasto-summary-row-plain">
            <span className="reabasto-summary-label">Unidades totales</span>
            <span className="reabasto-summary-value">{totalUnidades}</span>
          </div>

          <div className="reabasto-total-row">
            <span className="reabasto-total-label">Total</span>
            <span className="reabasto-total-value">${totalCompra.toFixed(2)}</span>
          </div>

          <button
            className="reabasto-process-button"
            onClick={handleProcesarEntrada}
            disabled={!progreso.proveedor || !progreso.lote || !progreso.productos}
          >
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 6L9 17l-5-5" />
            </svg>
            Procesar Entrada
          </button>
          <button className="reabasto-cancel-button" onClick={handleCancelar}>
            Cancelar
          </button>
        </div>

        <div className="reabasto-card">
          <p className="reabasto-progress-title">Progreso</p>
          <div className="reabasto-progress-list">
            <div className="reabasto-progress-item">
              <span className={`reabasto-progress-check ${progreso.proveedor ? 'reabasto-progress-check-on' : ''}`}>
                {progreso.proveedor && '✓'}
              </span>
              <span>Proveedor</span>
            </div>
            <div className="reabasto-progress-item">
              <span className={`reabasto-progress-check ${progreso.lote ? 'reabasto-progress-check-on' : ''}`}>
                {progreso.lote && '✓'}
              </span>
              <span>Número de lote</span>
            </div>
            <div className="reabasto-progress-item">
              <span className={`reabasto-progress-check ${progreso.productos ? 'reabasto-progress-check-on' : ''}`}>
                {progreso.productos && '✓'}
              </span>
              <span>Productos agregados</span>
            </div>
          </div>
        </div>
      </div>
    </section>
    {/* Se eliminó el </main> que estaba aquí */}

    {mostrarModalProveedor && (
      <div className="reabasto-modal-overlay" onClick={() => setMostrarModalProveedor(false)}>
        <div className="reabasto-modal" onClick={(e) => e.stopPropagation()}>
          <h2 className="reabasto-modal-title">Crear Nuevo Proveedor</h2>

          <div className="reabasto-form-field">
            <label className="reabasto-label">Nombre</label>
            <input
              type="text"
              className="reabasto-input"
              value={nuevoProveedor.nombre}
              onChange={(e) => setNuevoProveedor((prev) => ({ ...prev, nombre: e.target.value }))}
            />
          </div>
          <div className="reabasto-form-field">
            <label className="reabasto-label">Contacto</label>
            <input
              type="text"
              className="reabasto-input"
              value={nuevoProveedor.contacto}
              onChange={(e) => setNuevoProveedor((prev) => ({ ...prev, contacto: e.target.value }))}
            />
          </div>
          <div className="reabasto-form-field">
            <label className="reabasto-label">Teléfono</label>
            <input
              type="text"
              className="reabasto-input"
              value={nuevoProveedor.telefono}
              onChange={(e) => setNuevoProveedor((prev) => ({ ...prev, telefono: e.target.value }))}
            />
          </div>

          <div className="reabasto-modal-actions">
            <button
              className="reabasto-cancel-button"
              onClick={() => setMostrarModalProveedor(false)}
            >
              Cancelar
            </button>
            <button className="reabasto-process-button" onClick={handleGuardarProveedor}>
              Guardar
            </button>
          </div>
        </div>
      </div>
    )}
  </Layout>
);
}


export default ReabastecimientoInventario;
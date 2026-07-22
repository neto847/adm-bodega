import { useState } from 'react';
import Layout from '../components/Layout';
import '../Styles/Pages/GestionCatalogo.css';

// Aquí se llamará a catalogoService.js para traer datos reales
const COLORES_AVATAR = [
  { bg: '#ede8ff', text: '#5f48c8' },
  { bg: '#e6f5ee', text: '#1f7a4e' },
  { bg: '#fff3e0', text: '#b06000' },
  { bg: '#e3f0ff', text: '#1a5fb4' },
];
//categorías y proveedores iniciales, para mostrar algo en la página
const CATEGORIAS_INICIALES = [
  { id: 1, nombre: 'Lácteos y embutidos' },
  { id: 2, nombre: 'Alimentos y bebidas/Líquidos' },
  { id: 3, nombre: 'Limpieza/Hogar' },
  { id: 4, nombre: 'Cuidado personal' },
];

const PROVEEDORES_INICIALES = [
  { id: 1, nombre: 'Abastecimientos', iniciales: 'AB' },
  { id: 2, nombre: 'Distribuidora Global', iniciales: 'DG' },
  { id: 3, nombre: 'Mayoreo Central', iniciales: 'MC' },
  { id: 4, nombre: 'Suministros', iniciales: 'SP' },
];

const PRODUCTOS_ACTIVOS = 348;

function iniciales(nombre) {
  return nombre
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((palabra) => palabra[0].toUpperCase())
    .join('');
}

function GestionCatalogo() {
  const [categorias, setCategorias] = useState(CATEGORIAS_INICIALES);
  const [proveedores, setProveedores] = useState(PROVEEDORES_INICIALES);

  const [mostrarFormCategoria, setMostrarFormCategoria] = useState(false);
  const [nuevaCategoria, setNuevaCategoria] = useState('');

  const [mostrarFormProveedor, setMostrarFormProveedor] = useState(false);
  const [nuevoProveedor, setNuevoProveedor] = useState({ nombre: '', iniciales: '', color: 0 });

  const [mostrarFormEliminarCategoria, setMostrarFormEliminarCategoria] = useState(false);
   const [categoriaAEliminar, setCategoriaAEliminar] = useState('');

   const [mostrarFormEliminarProveedor, setMostrarFormEliminarProveedor] = useState(false);
   const [proveedorAEliminar, setProveedorAEliminar] = useState('');

  const handleGuardarCategoria = async () => {
    if (!nuevaCategoria.trim()) return;
    try {
      // Aquí se llamará a catalogoService.js
      // Ejemplo: await catalogoService.crearCategoria({ nombre: nuevaCategoria });
      const nuevoId = Math.max(...categorias.map((c) => c.id), 0) + 1;
      setCategorias((prev) => [...prev, { id: nuevoId, nombre: nuevaCategoria.trim() }]);
      setNuevaCategoria('');
      setMostrarFormCategoria(false);
    } catch (err) {
      console.error('Error al crear la categoría:', err);
    }
  };

  const handleGuardarProveedor = async () => {
    if (!nuevoProveedor.nombre.trim()) return;
    try {
      // Aquí se llamará a catalogoService.js
      // Ejemplo: await catalogoService.crearProveedor(nuevoProveedor);
      const nuevoId = Math.max(...proveedores.map((p) => p.id), 0) + 1;
      setProveedores((prev) => [
        ...prev,
        {
          id: nuevoId,
          nombre: nuevoProveedor.nombre.trim(),
          iniciales: nuevoProveedor.iniciales.trim() || iniciales(nuevoProveedor.nombre),
        },
      ]);
      setNuevoProveedor({ nombre: '', iniciales: '', color: 0 });
      setMostrarFormProveedor(false);
    } catch (err) {
      console.error('Error al crear el proveedor:', err);
    }
  };

  const handleEliminarCategoria = async () => {
     if (!categoriaAEliminar) return;
     try {
       // Aquí se llamará a catalogoService.js
       // Ejemplo: await catalogoService.eliminarCategoria(categoriaAEliminar);
       setCategorias((prev) => prev.filter((c) => String(c.id) !== categoriaAEliminar));
       setCategoriaAEliminar('');
       setMostrarFormEliminarCategoria(false);
     } catch (err) {
       console.error('Error al eliminar la categoría:', err);
     }
   };

   const handleEliminarProveedor = async () => {
     if (!proveedorAEliminar) return;
     try {
       // Aquí se llamará a catalogoService.js
       // Ejemplo: await catalogoService.eliminarProveedor(proveedorAEliminar);
       setProveedores((prev) => prev.filter((p) => String(p.id) !== proveedorAEliminar));
       setProveedorAEliminar('');
       setMostrarFormEliminarProveedor(false);
     } catch (err) {
       console.error('Error al eliminar el proveedor:', err);
     }
   };

  return (
    <Layout role="Encargado" title="Gestión de Catálogo" subtitle="Administra categorías y proveedores desde un solo lugar">
     <div className="catalogo-content"></div>
        <section className="catalogo-stats-grid">
          <div className="catalogo-stat-card">
            <p className="catalogo-stat-label">CATEGORÍAS</p>
            <p className="catalogo-stat-value">{categorias.length}</p>
            <span className="catalogo-stat-bar catalogo-stat-bar-purple" />
          </div>
          <div className="catalogo-stat-card">
            <p className="catalogo-stat-label">PROVEEDORES</p>
            <p className="catalogo-stat-value">{proveedores.length}</p>
            <span className="catalogo-stat-bar catalogo-stat-bar-blue" />
          </div>
          <div className="catalogo-stat-card">
            <p className="catalogo-stat-label">PRODUCTOS ACTIVOS</p>
            <p className="catalogo-stat-value">{PRODUCTOS_ACTIVOS}</p>
            <span className="catalogo-stat-bar catalogo-stat-bar-green" />
          </div>
        </section>

        <section className="catalogo-columns">
          {/* Categorías */}
          <div className="catalogo-list-card">
            <div className="catalogo-list-header">
              <h2 className="catalogo-list-title">Categorías</h2>
              <span className="catalogo-count-badge">{categorias.length}</span>
            </div>

            <div className="catalogo-list-body">
              {categorias.map((cat, i) => {
                const color = COLORES_AVATAR[i % COLORES_AVATAR.length];
                return (
                  <div className="catalogo-item-row" key={cat.id}>
                    <div
                      className="catalogo-avatar"
                      style={{ backgroundColor: color.bg, color: color.text }}
                    >
                      {iniciales(cat.nombre)}
                    </div>
                    <span className="catalogo-item-name">{cat.nombre}</span>
                  </div>
                );
              })}
            </div>

            <div className="catalogo-add-section">
              {!mostrarFormCategoria ? (
                <button
                  className="catalogo-add-toggle"
                  onClick={() => setMostrarFormCategoria(true)}
                >
                  <span className="catalogo-add-icon">+</span>
                  Agregar categoría
                </button>
              ) : (
                <div className="catalogo-add-form">
                  <input
                    type="text"
                    className="catalogo-input"
                    placeholder="Nombre de la categoría"
                    value={nuevaCategoria}
                    onChange={(e) => setNuevaCategoria(e.target.value)}
                    autoFocus
                  />
                  <div className="catalogo-form-actions">
                    <button
                      className="catalogo-cancel-button"
                      onClick={() => {
                        setMostrarFormCategoria(false);
                        setNuevaCategoria('');
                      }}
                    >
                      Cancelar
                    </button>
                    <button className="catalogo-save-button" onClick={handleGuardarCategoria}>
                      Guardar
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="catalogo-delete-section">
               {!mostrarFormEliminarCategoria ? (
                 <button
                   className="catalogo-delete-toggle"
                   onClick={() => setMostrarFormEliminarCategoria(true)}
                 >
                   <span className="catalogo-delete-icon">−</span>
                   Eliminar categoría
                 </button>
               ) : (
                 <div className="catalogo-add-form">
                   <select
                     className="catalogo-input"
                     value={categoriaAEliminar}
                     onChange={(e) => setCategoriaAEliminar(e.target.value)}
                   >
                     <option value="">Selecciona una categoría</option>
                     {categorias.map((cat) => (
                       <option key={cat.id} value={cat.id}>
                         {cat.nombre}
                       </option>
                     ))}
                   </select>
                   <div className="catalogo-form-actions">
                     <button
                       className="catalogo-cancel-button"
                       onClick={() => {
                         setMostrarFormEliminarCategoria(false);
                         setCategoriaAEliminar('');
                       }}
                     >
                       Cancelar
                     </button>
                     <button
                       className="catalogo-delete-confirm-button"
                       onClick={handleEliminarCategoria}
                       disabled={!categoriaAEliminar}
                     >
                       Eliminar
                     </button>
                   </div>
                 </div>
               )}
             </div>
          </div>

          {/* Proveedores */}
          <div className="catalogo-list-card">
            <div className="catalogo-list-header">
              <h2 className="catalogo-list-title">Proveedores</h2>
              <span className="catalogo-count-badge">{proveedores.length}</span>
            </div>

            <div className="catalogo-list-body">
              {proveedores.map((prov, i) => {
                const color = COLORES_AVATAR[i % COLORES_AVATAR.length];
                return (
                  <div className="catalogo-item-row" key={prov.id}>
                    <div
                      className="catalogo-avatar"
                      style={{ backgroundColor: color.bg, color: color.text }}
                    >
                      {prov.iniciales}
                    </div>
                    <span className="catalogo-item-name">{prov.nombre}</span>
                  </div>
                );
              })}
            </div>

            <div className="catalogo-add-section">
              {!mostrarFormProveedor ? (
                <button
                  className="catalogo-add-toggle"
                  onClick={() => setMostrarFormProveedor(true)}
                >
                  <span className="catalogo-add-icon">+</span>
                  Agregar proveedor
                </button>
              ) : (
                <div className="catalogo-add-form catalogo-add-form-shaded">
                  <input
                    type="text"
                    className="catalogo-input"
                    placeholder="Nombre del proveedor"
                    value={nuevoProveedor.nombre}
                    onChange={(e) =>
                      setNuevoProveedor((prev) => ({ ...prev, nombre: e.target.value }))
                    }
                    autoFocus
                  />
                  <div className="catalogo-form-row">
                    <input
                      type="text"
                      className="catalogo-input"
                      placeholder="Iniciales (ej: AB)"
                      maxLength={2}
                      value={nuevoProveedor.iniciales}
                      onChange={(e) =>
                        setNuevoProveedor((prev) => ({
                          ...prev,
                          iniciales: e.target.value.toUpperCase(),
                        }))
                      }
                    />
                    <select
                      className="catalogo-input"
                      value={nuevoProveedor.color}
                      onChange={(e) =>
                        setNuevoProveedor((prev) => ({ ...prev, color: Number(e.target.value) }))
                      }
                    >
                      {COLORES_AVATAR.map((c, i) => (
                        <option key={i} value={i}>
                          Color {i + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="catalogo-form-actions">
                    <button
                      className="catalogo-cancel-button"
                      onClick={() => {
                        setMostrarFormProveedor(false);
                        setNuevoProveedor({ nombre: '', iniciales: '', color: 0 });
                      }}
                    >
                      Cancelar
                    </button>
                    <button className="catalogo-save-button" onClick={handleGuardarProveedor}>
                      Guardar
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="catalogo-delete-section">
               {!mostrarFormEliminarProveedor ? (
                 <button
                   className="catalogo-delete-toggle"
                   onClick={() => setMostrarFormEliminarProveedor(true)}
                 >
                   <span className="catalogo-delete-icon">−</span>
                   Eliminar proveedor
                 </button>
               ) : (
                 <div className="catalogo-add-form">
                   <select
                     className="catalogo-input"
                     value={proveedorAEliminar}
                     onChange={(e) => setProveedorAEliminar(e.target.value)}
                   >
                     <option value="">Selecciona un proveedor</option>
                     {proveedores.map((prov) => (
                       <option key={prov.id} value={prov.id}>
                         {prov.nombre}
                       </option>
                     ))}
                   </select>
                   <div className="catalogo-form-actions">
                     <button
                       className="catalogo-cancel-button"
                       onClick={() => {
                         setMostrarFormEliminarProveedor(false);
                         setProveedorAEliminar('');
                       }}
                     >
                       Cancelar
                     </button>
                     <button
                       className="catalogo-delete-confirm-button"
                       onClick={handleEliminarProveedor}
                       disabled={!proveedorAEliminar}
                     >
                       Eliminar
                     </button>
                   </div>
                 </div>
               )}
             </div>
          </div>
        </section>
        </Layout>
  );
}

export default GestionCatalogo;
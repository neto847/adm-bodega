import { useState } from 'react';
import Layout from '../components/Layout';
import '../Styles/Pages/RolesPermisos.css';

// Aquí se llamará a usuarioService.js para traer los usuarios reales
const USUARIOS_INICIALES = [
  { id: 1, nombre: 'Roberto Salas', correo: 'roberto.salas@admbodega.com', rol: 'Dueño' },
  { id: 2, nombre: 'Marta Jiménez', correo: 'marta.jimenez@admbodega.com', rol: 'Dueño' },
  { id: 3, nombre: 'Diego Herrera', correo: 'diego.herrera@admbodega.com', rol: 'Encargado' },
  { id: 4, nombre: 'Ana Torres', correo: 'ana.torres@admbodega.com', rol: 'Encargado' },
  { id: 5, nombre: 'Luis Peña', correo: 'luis.pena@admbodega.com', rol: 'Encargado' },
];

function iniciales(nombre) {
  return nombre
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((palabra) => palabra[0].toUpperCase())
    .join('');
}

function RolesPermisos() {
  const [usuarios, setUsuarios] = useState(USUARIOS_INICIALES);

  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: '',
    correo: '',
    password: '',
    rol: 'Encargado',
  });

  const duenos = usuarios.filter((u) => u.rol === 'Dueño');
  const encargados = usuarios.filter((u) => u.rol === 'Encargado');

  const handleAbrirModal = () => {
    setNuevoUsuario({ nombre: '', correo: '', password: '', rol: 'Encargado' });
    setMostrarModal(true);
  };

  const handleChangeFormulario = (e) => {
    const { name, value } = e.target;
    setNuevoUsuario((prev) => ({ ...prev, [name]: value }));
  };

  const handleCrearUsuario = async () => {
    if (!nuevoUsuario.nombre.trim() || !nuevoUsuario.correo.trim() || !nuevoUsuario.password.trim()) {
      return;
    }

    try {
      // Aquí se llamará a usuarioService.js
      // Ejemplo: await usuarioService.crear(nuevoUsuario);
      const nuevoId = Math.max(...usuarios.map((u) => u.id), 0) + 1;
      setUsuarios((prev) => [
        ...prev,
        {
          id: nuevoId,
          nombre: nuevoUsuario.nombre.trim(),
          correo: nuevoUsuario.correo.trim(),
          rol: nuevoUsuario.rol,
        },
      ]);
      setMostrarModal(false);
    } catch (err) {
      console.error('Error al crear el usuario:', err);
    }
  };

  const handleEliminarUsuario = async (id) => {
    // Aquí se llamará a usuarioService.js
    // Ejemplo: await usuarioService.eliminar(id);
    setUsuarios((prev) => prev.filter((u) => u.id !== id));
  };

  return (
    <Layout role="Dueño" title="Roles y Permisos" subtitle="Administra los usuarios con acceso al sistema">
      <div className="roles-content">
        <div className="roles-actions-row">
          <button className="roles-new-button" onClick={handleAbrirModal}>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Nuevo Usuario
          </button>
        </div>

        <section className="roles-columns">
          {/* Dueños */}
          <div className="roles-list-card">
            <div className="roles-list-header">
              <h2 className="roles-list-title">Dueños</h2>
              <span className="roles-count-badge">{duenos.length}</span>
            </div>

            <div className="roles-list-body">
              {duenos.map((u) => (
                <div className="roles-item-row" key={u.id}>
                  <div className="roles-avatar roles-avatar-dueno">{iniciales(u.nombre)}</div>
                  <div className="roles-item-info">
                    <p className="roles-item-name">{u.nombre}</p>
                    <p className="roles-item-email">{u.correo}</p>
                  </div>
                  <button
                    className="roles-delete-button"
                    onClick={() => handleEliminarUsuario(u.id)}
                    aria-label="Eliminar usuario"
                  >
                    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14z" />
                    </svg>
                  </button>
                </div>
              ))}
              {duenos.length === 0 && (
                <p className="roles-empty">No hay dueños registrados</p>
              )}
            </div>
          </div>

          {/* Encargados */}
          <div className="roles-list-card">
            <div className="roles-list-header">
              <h2 className="roles-list-title">Encargados</h2>
              <span className="roles-count-badge">{encargados.length}</span>
            </div>

            <div className="roles-list-body">
              {encargados.map((u) => (
                <div className="roles-item-row" key={u.id}>
                  <div className="roles-avatar roles-avatar-encargado">{iniciales(u.nombre)}</div>
                  <div className="roles-item-info">
                    <p className="roles-item-name">{u.nombre}</p>
                    <p className="roles-item-email">{u.correo}</p>
                  </div>
                  <button
                    className="roles-delete-button"
                    onClick={() => handleEliminarUsuario(u.id)}
                    aria-label="Eliminar usuario"
                  >
                    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14z" />
                    </svg>
                  </button>
                </div>
              ))}
              {encargados.length === 0 && (
                <p className="roles-empty">No hay encargados registrados</p>
              )}
            </div>
          </div>
        </section>
      </div>

      {mostrarModal && (
        <div className="roles-modal-overlay" onClick={() => setMostrarModal(false)}>
          <div className="roles-modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="roles-modal-title">Nuevo Usuario</h2>

            <div className="roles-form-field">
              <label className="roles-label">Nombre</label>
              <input
                type="text"
                name="nombre"
                className="roles-input"
                placeholder="Nombre completo"
                value={nuevoUsuario.nombre}
                onChange={handleChangeFormulario}
              />
            </div>

            <div className="roles-form-field">
              <label className="roles-label">Correo</label>
              <input
                type="email"
                name="correo"
                className="roles-input"
                placeholder="correo@admbodega.com"
                value={nuevoUsuario.correo}
                onChange={handleChangeFormulario}
              />
            </div>

            <div className="roles-form-field">
              <label className="roles-label">Contraseña</label>
              <input
                type="password"
                name="password"
                className="roles-input"
                placeholder="Contraseña temporal"
                value={nuevoUsuario.password}
                onChange={handleChangeFormulario}
              />
            </div>

            <div className="roles-form-field">
              <label className="roles-label">Rol</label>
              <select
                name="rol"
                className="roles-input"
                value={nuevoUsuario.rol}
                onChange={handleChangeFormulario}
              >
                <option value="Dueño">Dueño</option>
                <option value="Encargado">Encargado</option>
              </select>
            </div>

            <div className="roles-modal-actions">
              <button className="roles-cancel-button" onClick={() => setMostrarModal(false)}>
                Cancelar
              </button>
              <button className="roles-save-button" onClick={handleCrearUsuario}>
                Crear Usuario
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default RolesPermisos;
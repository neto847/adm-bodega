const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
const DEMO_MODE = !API_BASE_URL;
const STORAGE_KEY = 'admbodega_demo_db';

function createInitialDemoDb() {
  return {
    categorias: [
      { idCategoria: 1, nombre: 'Lácteos y embutidos' },
      { idCategoria: 2, nombre: 'Limpieza/Hogar' },
      { idCategoria: 3, nombre: 'Bebidas' },
      { idCategoria: 4, nombre: 'Cuidado personal' },
    ],
    proveedores: [
      { idProveedor: 1, nombre: 'Mayoreo Central', telefono: '', email: '', direccion: '', activo: true },
      { idProveedor: 2, nombre: 'Distribuidora Norte', telefono: '', email: '', direccion: '', activo: true },
      { idProveedor: 3, nombre: 'Bebidas del Sureste', telefono: '', email: '', direccion: '', activo: true },
    ],
    usuarios: [
      { idUsuario: 1, nombre: 'Ernesto Diaz', email: 'diazdiazluisernesto10@gmail.com', password: '123456', idRol: 1, activo: true },
      { idUsuario: 2, nombre: 'Caja Principal', email: 'caja@admbodega.com', password: '123456', idRol: 2, activo: true },
    ],
    productos: [
      { idProducto: 1, idCategoria: 3, idEstado: 1, codigoBarras: '750100000001', nombre: 'Coca Cola 600ml', descripcion: 'Refresco', precioCompra: 12.5, precioVenta: 18, stockActual: 24 },
      { idProducto: 2, idCategoria: 1, idEstado: 1, codigoBarras: '750100000002', nombre: 'Leche Lala 1L', descripcion: 'Lácteo', precioCompra: 21, precioVenta: 29, stockActual: 15 },
      { idProducto: 3, idCategoria: 4, idEstado: 1, codigoBarras: '750100000003', nombre: 'Pasta Dental Crest', descripcion: 'Higiene', precioCompra: 24, precioVenta: 35, stockActual: 9 },
      { idProducto: 4, idCategoria: 2, idEstado: 1, codigoBarras: '750100000004', nombre: 'Detergente 1kg', descripcion: 'Limpieza', precioCompra: 30, precioVenta: 42, stockActual: 6 },
      { idProducto: 5, idCategoria: 3, idEstado: 1, codigoBarras: '750100000005', nombre: 'Refresco Sprite 600ml', descripcion: 'Bebida', precioCompra: 12, precioVenta: 18, stockActual: 11 },
    ],
    ventas: [
      { idVenta: 1, idUsuario: 1, total: 54, fechaVenta: '2026-07-20 19:07:39', detalles: [{ idProducto: 1, cantidad: 3, precioUnitario: 18 }] },
      { idVenta: 2, idUsuario: 1, total: 58, fechaVenta: '2026-07-21 12:10:00', detalles: [{ idProducto: 2, cantidad: 2, precioUnitario: 29 }] },
      { idVenta: 3, idUsuario: 2, total: 35, fechaVenta: '2026-07-22 09:45:00', detalles: [{ idProducto: 3, cantidad: 1, precioUnitario: 35 }] },
    ],
    compras: [
      { idCompra: 1, idUsuario: 1, idProveedor: 1, total: 250, fechaCompra: '2026-07-21 18:00:00', detalles: [{ idProducto: 1, cantidad: 20, precioUnitario: 12.5 }] },
    ],
    alertasCaducidad: {
      lotes: [
        { id: 1, producto: 'Leche Lala 1L', categoria: 'Lácteos y embutidos', cantidad: 10, fechaReferencia: '2026-07-25', estado: 'critico' },
        { id: 2, producto: 'Pasta Dental Crest', categoria: 'Cuidado personal', cantidad: 6, fechaReferencia: '2026-08-05', estado: 'proximo' },
      ],
    },
  };
}

function loadDemoDb() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    const initial = createInitialDemoDb();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }

  try {
    return JSON.parse(stored);
  } catch {
    const initial = createInitialDemoDb();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }
}

function saveDemoDb(db) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

function nextId(items, field) {
  return items.reduce((max, item) => Math.max(max, Number(item[field] || 0)), 0) + 1;
}

function todayTimestamp() {
  const now = new Date();
  const pad = (value) => String(value).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
}

function getCategoriaNombre(db, idCategoria) {
  return db.categorias.find((categoria) => categoria.idCategoria === idCategoria)?.nombre || 'Sin categoría';
}

function buildDashboard(db) {
  const productosBajoStock = db.productos.filter((producto) => Number(producto.stockActual || 0) <= 5);
  const hoy = new Date().toISOString().slice(0, 10);
  const ventasDeHoy = db.ventas
    .filter((venta) => String(venta.fechaVenta || '').slice(0, 10) === hoy)
    .reduce((acc, venta) => acc + Number(venta.total || 0), 0);

  return {
    productosBajoStock,
    ventasDeHoy,
  };
}

function buildDashboardDueno(db) {
  const ingresosTotales = db.ventas.reduce((acc, venta) => acc + Number(venta.total || 0), 0);
  const hoy = new Date().toISOString().slice(0, 10);
  const ventasHoyLista = db.ventas.filter((venta) => String(venta.fechaVenta || '').slice(0, 10) === hoy);
  const ventasDeHoy = ventasHoyLista.reduce((acc, venta) => acc + Number(venta.total || 0), 0);
  const ticketPromedio = db.ventas.length ? ingresosTotales / db.ventas.length : 0;

  const topMap = new Map();
  db.ventas.forEach((venta) => {
    (venta.detalles || []).forEach((detalle) => {
      const producto = db.productos.find((item) => item.idProducto === detalle.idProducto);
      const key = detalle.idProducto;
      const actual = topMap.get(key) || {
        idProducto: key,
        nombre: producto?.nombre || `Producto ${key}`,
        categoria: getCategoriaNombre(db, producto?.idCategoria),
        unidadesVendidas: 0,
        totalVendido: 0,
      };
      actual.unidadesVendidas += Number(detalle.cantidad || 0);
      actual.totalVendido += Number(detalle.cantidad || 0) * Number(detalle.precioUnitario || 0);
      topMap.set(key, actual);
    });
  });

  const topProductos = [...topMap.values()].sort((a, b) => b.totalVendido - a.totalVendido).slice(0, 5);

  const ingresosPorCategoriaMap = new Map();
  db.ventas.forEach((venta) => {
    (venta.detalles || []).forEach((detalle) => {
      const producto = db.productos.find((item) => item.idProducto === detalle.idProducto);
      const nombreCategoria = getCategoriaNombre(db, producto?.idCategoria);
      ingresosPorCategoriaMap.set(
        nombreCategoria,
        (ingresosPorCategoriaMap.get(nombreCategoria) || 0) + Number(detalle.cantidad || 0) * Number(detalle.precioUnitario || 0)
      );
    });
  });

  const ingresosPorCategoria = [...ingresosPorCategoriaMap.entries()].map(([categoria, total]) => ({ categoria, total }));

  return {
    ingresosTotales,
    ventasDeHoy,
    ticketPromedio,
    topProductos,
    ingresosPorCategoria,
  };
}

function parseBody(options) {
  if (!options.body) {
    return {};
  }

  if (typeof options.body === 'string') {
    try {
      return JSON.parse(options.body);
    } catch {
      return {};
    }
  }

  return options.body;
}

function throwDemoError(message) {
  throw new Error(message);
}

async function apiRequestDemo(path, options = {}) {
  const method = (options.method || 'GET').toUpperCase();
  const body = parseBody(options);
  const db = loadDemoDb();
  const pathname = path.split('?')[0];

  if (pathname === '/api/login' && method === 'POST') {
    const usuario = db.usuarios.find((item) =>
      item.activo !== false &&
      (item.email?.toLowerCase() === String(body.email || body.usuario || '').toLowerCase()) &&
      item.password === body.password
    );

    if (!usuario) {
      throwDemoError('Usuario o contraseña incorrectos.');
    }

    return {
      idUsuario: usuario.idUsuario,
      nombre: usuario.nombre,
      email: usuario.email,
      idRol: usuario.idRol,
    };
  }

  if (pathname === '/api/productos' && method === 'GET') {
    return db.productos;
  }

  if (pathname === '/api/productos' && method === 'POST') {
    const nuevoProducto = {
      idProducto: nextId(db.productos, 'idProducto'),
      ...body,
    };
    db.productos.push(nuevoProducto);
    saveDemoDb(db);
    return nuevoProducto;
  }

  if (pathname.startsWith('/api/productos/') && method === 'PUT') {
    const id = Number(decodeURIComponent(pathname.split('/').pop()));
    const index = db.productos.findIndex((item) => item.idProducto === id);
    if (index === -1) {
      throwDemoError('Producto no encontrado.');
    }

    db.productos[index] = { ...db.productos[index], ...body, idProducto: id };
    saveDemoDb(db);
    return db.productos[index];
  }

  if (pathname.startsWith('/api/productos/') && method === 'DELETE') {
    const id = Number(decodeURIComponent(pathname.split('/').pop()));
    db.productos = db.productos.filter((item) => item.idProducto !== id);
    saveDemoDb(db);
    return { success: true };
  }

  if (pathname.startsWith('/api/productos/') && method === 'GET') {
    const token = decodeURIComponent(pathname.split('/').pop());
    const producto = db.productos.find((item) => String(item.idProducto) === token || item.codigoBarras === token);
    if (!producto) {
      throwDemoError('Producto no encontrado.');
    }
    return producto;
  }

  if (pathname === '/api/ventas' && method === 'GET') {
    return [...db.ventas].sort((a, b) => String(b.fechaVenta).localeCompare(String(a.fechaVenta)));
  }

  if (pathname === '/api/ventas' && method === 'POST') {
    const nuevaVenta = {
      idVenta: nextId(db.ventas, 'idVenta'),
      idUsuario: body.idUsuario || 1,
      total: Number(body.total || 0),
      fechaVenta: todayTimestamp(),
      detalles: body.detalles || [],
    };

    nuevaVenta.detalles.forEach((detalle) => {
      const producto = db.productos.find((item) => item.idProducto === detalle.idProducto);
      if (producto) {
        producto.stockActual = Math.max(0, Number(producto.stockActual || 0) - Number(detalle.cantidad || 0));
      }
    });

    db.ventas.push(nuevaVenta);
    saveDemoDb(db);
    return nuevaVenta;
  }

  if (pathname === '/api/compras' && method === 'POST') {
    const nuevaCompra = {
      idCompra: nextId(db.compras, 'idCompra'),
      idUsuario: body.idUsuario || 1,
      idProveedor: Number(body.idProveedor || 0),
      total: Number(body.total || 0),
      fechaCompra: todayTimestamp(),
      detalles: body.detalles || [],
    };

    nuevaCompra.detalles.forEach((detalle) => {
      const producto = db.productos.find((item) => item.idProducto === detalle.idProducto);
      if (producto) {
        producto.stockActual = Number(producto.stockActual || 0) + Number(detalle.cantidad || 0);
      }
    });

    db.compras.push(nuevaCompra);
    saveDemoDb(db);
    return nuevaCompra;
  }

  if (pathname === '/api/categorias' && method === 'GET') {
    return db.categorias;
  }

  if (pathname === '/api/categorias' && method === 'POST') {
    const categoria = {
      idCategoria: nextId(db.categorias, 'idCategoria'),
      nombre: body.nombre,
      descripcion: body.descripcion || '',
    };
    db.categorias.push(categoria);
    saveDemoDb(db);
    return categoria;
  }

  if (pathname.startsWith('/api/categorias/') && method === 'DELETE') {
    const id = Number(decodeURIComponent(pathname.split('/').pop()));
    db.categorias = db.categorias.filter((item) => item.idCategoria !== id);
    saveDemoDb(db);
    return { success: true };
  }

  if (pathname === '/api/proveedores' && method === 'GET') {
    return db.proveedores;
  }

  if (pathname === '/api/proveedores' && method === 'POST') {
    const proveedor = {
      idProveedor: nextId(db.proveedores, 'idProveedor'),
      nombre: body.nombre,
      telefono: body.telefono || '',
      email: body.email || '',
      direccion: body.direccion || '',
      activo: body.activo !== false,
    };
    db.proveedores.push(proveedor);
    saveDemoDb(db);
    return proveedor;
  }

  if (pathname.startsWith('/api/proveedores/') && method === 'DELETE') {
    const id = Number(decodeURIComponent(pathname.split('/').pop()));
    db.proveedores = db.proveedores.filter((item) => item.idProveedor !== id);
    saveDemoDb(db);
    return { success: true };
  }

  if (pathname === '/api/usuarios' && method === 'GET') {
    return db.usuarios.filter((item) => item.activo !== false).map(({ password, ...rest }) => rest);
  }

  if (pathname === '/api/usuarios' && method === 'POST') {
    const usuario = {
      idUsuario: nextId(db.usuarios, 'idUsuario'),
      nombre: body.nombre,
      email: body.correo || body.email,
      password: body.password,
      idRol: body.rol === 'Dueño' ? 1 : 2,
      activo: true,
    };
    db.usuarios.push(usuario);
    saveDemoDb(db);
    const { password, ...sinPassword } = usuario;
    return sinPassword;
  }

  if (pathname.startsWith('/api/usuarios/') && method === 'DELETE') {
    const id = Number(decodeURIComponent(pathname.split('/').pop()));
    db.usuarios = db.usuarios.map((item) => (
      item.idUsuario === id ? { ...item, activo: false } : item
    ));
    saveDemoDb(db);
    return { success: true };
  }

  if (pathname === '/api/dashboard' && method === 'GET') {
    return buildDashboard(db);
  }

  if (pathname === '/api/dashboard/dueno' && method === 'GET') {
    return buildDashboardDueno(db);
  }

  if (pathname === '/api/alertas/caducidad' && method === 'GET') {
    return db.alertasCaducidad;
  }

  throwDemoError(`Ruta demo no implementada: ${method} ${pathname}`);
}

export async function apiRequest(path, options = {}) {
  if (DEMO_MODE) {
    return apiRequestDemo(path, options);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const data = isJson ? await response.json().catch(() => null) : await response.text();

  if (!response.ok) {
    const message = typeof data === 'string' ? data : data?.message || 'Error en la solicitud';
    throw new Error(message);
  }

  return data;
}

import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    const guardado = localStorage.getItem('admbodega_usuario');
    return guardado ? JSON.parse(guardado) : null;
  });

  const login = (datosUsuario) => {
    setUsuario(datosUsuario);
    localStorage.setItem('admbodega_usuario', JSON.stringify(datosUsuario));
  };

  const logout = () => {
    // Aquí se llamará a authService.js
    // Ejemplo: authService.logout();
    setUsuario(null);
    localStorage.removeItem('admbodega_usuario');
  };

  return (
    <AuthContext.Provider value={{ usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
}
import { useState, createContext, useContext } from "react";

export const SucursalContext = createContext();

const SucursalProvider = ({ children }) => {
  const [sucursalActual, setSucursalActual] = useState(() => {
    const savedSucursal = window.localStorage.getItem("sucursal_actual");
    return savedSucursal ? JSON.parse(savedSucursal) : null;
  });

  const seleccionarSucursal = (sucursal) => {
    setSucursalActual(sucursal);
    window.localStorage.setItem("sucursal_actual", JSON.stringify(sucursal));
  };

  const limpiarSucursal = () => {
    setSucursalActual(null);
    window.localStorage.removeItem("sucursal_actual");
  };

  const obtenerSucursalId = () => {
    return sucursalActual?.idSucursal || null;
  };

  const obtenerNombreSucursal = () => {
    return sucursalActual
      ? `${sucursalActual.departamento} - ${sucursalActual.direccion}`
      : "Sin sucursal";
  };

  return (
    <SucursalContext.Provider
      value={{
        sucursalActual,
        seleccionarSucursal,
        limpiarSucursal,
        obtenerSucursalId,
        obtenerNombreSucursal,
      }}
    >
      {children}
    </SucursalContext.Provider>
  );
};

// Custom hook to use sucursal context
export const useSucursal = () => {
  const context = useContext(SucursalContext);
  if (context === undefined) {
    throw new Error("useSucursal must be used within a SucursalProvider");
  }
  return context;
};

export default SucursalProvider;
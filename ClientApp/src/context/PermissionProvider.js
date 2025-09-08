import { useState, createContext, useContext, useCallback } from "react";

export const PermissionContext = createContext();

const PermissionProvider = ({ children }) => {
  const [userPermissions, setUserPermissions] = useState({
    modulosPermitidos: [],
    esAdministrador: false,
  });
  const [isLoadingPermissions, setIsLoadingPermissions] = useState(false);

  const cargarPermisos = useCallback(async (idUsuario) => {
    // Prevent concurrent requests for the same user
    if (isLoadingPermissions) {
      return userPermissions;
    }

    setIsLoadingPermissions(true);
    try {
      const response = await fetch(`api/permisos/Usuario/${idUsuario}`);
      if (response.ok) {
        const permisos = await response.json();
        setUserPermissions(permisos);
        return permisos;
      }
    } catch (error) {
      console.error("Error cargando permisos:", error);
    } finally {
      setIsLoadingPermissions(false);
    }
    return { modulosPermitidos: [], esAdministrador: false };
  }, [isLoadingPermissions, userPermissions]);

  const tienePermiso = (modulo) => {
    if (userPermissions.esAdministrador) {
      return true;
    }
    return userPermissions.modulosPermitidos.includes(modulo);
  };

  const limpiarPermisos = () => {
    setUserPermissions({
      modulosPermitidos: [],
      esAdministrador: false,
    });
  };

  return (
    <PermissionContext.Provider
      value={{
        userPermissions,
        cargarPermisos,
        tienePermiso,
        limpiarPermisos,
        isLoadingPermissions,
      }}
    >
      {children}
    </PermissionContext.Provider>
  );
};

export const usePermissions = () => {
  const context = useContext(PermissionContext);
  if (context === undefined) {
    throw new Error("usePermissions must be used within a PermissionProvider");
  }
  return context;
};

export default PermissionProvider;
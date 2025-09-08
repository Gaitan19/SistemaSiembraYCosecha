import { useContext, useEffect, useState } from "react"
import { UserContext } from "../context/UserProvider"
import { usePermissions } from "../context/PermissionProvider"
import { Navigate } from "react-router-dom"

const ProtectedRoute = ({ children, requiredPermission }) => {
    const { user } = useContext(UserContext)
    const { cargarPermisos, tienePermiso, userPermissions, isLoadingPermissions } = usePermissions()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (user) {
            const userData = JSON.parse(user);
            if (userData.idUsuario) {
                // Only load permissions if they're not already loaded and not currently loading
                if (userPermissions.modulosPermitidos.length === 0 && !userPermissions.esAdministrador && !isLoadingPermissions) {
                    cargarPermisos(userData.idUsuario).finally(() => {
                        setIsLoading(false)
                    });
                } else {
                    setIsLoading(false)
                }
            }
        } else {
            setIsLoading(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]) // Removed cargarPermisos and userPermissions from dependency array to prevent endless loop

    // If user is not logged in, redirect to login
    if (user == null) {
        return <Navigate to="/Login"/>
    }

    // Show loading while permissions are being loaded
    if (isLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "200px" }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="sr-only">Cargando permisos...</span>
                </div>
            </div>
        )
    }

    // Check if user has permission for this route
    if (requiredPermission && !tienePermiso(requiredPermission)) {
        return <Navigate to="/access-denied" replace />
    }

    return children
}

export default ProtectedRoute
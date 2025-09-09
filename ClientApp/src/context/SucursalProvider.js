import { useState, createContext, useContext } from "react"

export const SucursalContext = createContext()

const SucursalProvider = ({children}) => {
    const [sucursalSeleccionada, setSucursalSeleccionada] = useState(
        JSON.parse(window.localStorage.getItem("sucursal_seleccionada") || "null")
    )
    const [sucursales, setSucursales] = useState([])

    const seleccionarSucursal = (sucursal) => {
        window.localStorage.setItem("sucursal_seleccionada", JSON.stringify(sucursal))
        setSucursalSeleccionada(sucursal)
    }

    const limpiarSucursal = () => {
        window.localStorage.removeItem("sucursal_seleccionada")
        setSucursalSeleccionada(null)
    }

    const cargarSucursales = async () => {
        try {
            const response = await fetch('api/sucursal/Activas', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                }
            })
            
            if (response.ok) {
                const data = await response.json()
                setSucursales(data)
                return data
            } else {
                throw new Error('Failed to load sucursales')
            }
        } catch (error) {
            console.error('Error loading sucursales:', error)
            setSucursales([])
            throw error
        }
    }

    return (
        <SucursalContext.Provider value={{ 
            sucursalSeleccionada, 
            sucursales,
            seleccionarSucursal, 
            limpiarSucursal,
            cargarSucursales
        }}>
            {children}
        </SucursalContext.Provider>
    )
}

// Custom hook to use sucursal context
export const useSucursal = () => {
    const context = useContext(SucursalContext)
    if (context === undefined) {
        throw new Error('useSucursal must be used within a SucursalProvider')
    }
    return context
}

export default SucursalProvider
import { useState, createContext } from "react"


export const UserContext = createContext()

const UserProvider = ({children}) => {
    const [user, setUser] = useState(window.localStorage.getItem("sesion_usuario"))


    const iniciarSession = (data) => {
        window.localStorage.setItem("sesion_usuario",JSON.stringify(data))
        setUser(JSON.stringify(data))
    }

    const cerrarSession = () => {
        window.localStorage.removeItem("sesion_usuario")
        setUser(null)
        // También limpiar permisos cuando se cierra sesión
        // Esto se manejará desde el login component
    }

    return (
        <UserContext.Provider value={{ user, iniciarSession, cerrarSession}}>
            {children}
        </UserContext.Provider>
        )
}

export default UserProvider
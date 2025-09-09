import { useContext, useState } from "react"
import { UserContext } from "../context/UserProvider"
import { useSucursal } from "../context/SucursalProvider"
import SucursalSelectionModal from "../componentes/SucursalSelectionModal"
import Swal from 'sweetalert2'
import { Navigate } from "react-router-dom"
import { FaEyeSlash, FaEye } from 'react-icons/fa';

const Login = () => {

    const [_correo, set_Correo] = useState("")
    const [_clave, set_Clave] = useState("")
    const { user, iniciarSession } = useContext(UserContext)
    const { seleccionarSucursal, limpiarSucursal } = useSucursal()
    const [visiblePassword, setVisiblePassword] = useState(false)
    const [showSucursalModal, setShowSucursalModal] = useState(false)
    const [pendingUserData, setPendingUserData] = useState(null)

   

    if (user != null) {
        return <Navigate to="/" />
    }



    const handleVisiblePassword = () => {
        setVisiblePassword((preVisible) => !preVisible);
    };

    const handleSucursalSelected = (sucursal) => {
        // Set the selected sucursal
        seleccionarSucursal(sucursal)
        
        // Close modal and complete login
        setShowSucursalModal(false)
        iniciarSession(pendingUserData)
        
        // Clear pending data
        setPendingUserData(null)
    }

    const handleSucursalModalClose = () => {
        // If user closes modal without selecting, still proceed with login
        // but without sucursal context (admin will need to select later)
        setShowSucursalModal(false)
        limpiarSucursal() // Clear any previous sucursal selection
        iniciarSession(pendingUserData)
        setPendingUserData(null)
    }


    const handleSubmit = (event) => {
        event.preventDefault();

        const request = {
            correo: _correo,
            clave:_clave
        }

        fetch("api/session/Login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(request)
        })
        .then((response) => {
            return response.ok ? response.json() : Promise.reject(response);
        })
        .then((dataJson) => {
            if (dataJson.idUsuario === 0) {
                Swal.fire(
                    'Opps!',
                    'No se encontro el usuario',
                    'error'
                )
            } else {
                // Check if user is admin and needs to select sucursal
                if (dataJson.esAdministrador) {
                    // For admin users, show sucursal selection modal
                    setPendingUserData(dataJson)
                    setShowSucursalModal(true)
                } else {
                    // For employee users, automatically set their assigned sucursal and proceed
                    if (dataJson.idSucursal && dataJson.nombreSucursal) {
                        seleccionarSucursal({
                            idSucursal: dataJson.idSucursal,
                            departamento: dataJson.nombreSucursal,
                            direccion: dataJson.nombreSucursal
                        })
                    }
                    iniciarSession(dataJson)
                }
            }

        }).catch((error) => {
            Swal.fire(
                'Opps!',
                'No se pudo iniciar sessión',
                'error'
            )
        })
    }

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-xl-10 col-lg-12 col-md-9">
                    <div className="card o-hidden border-0 shadow-lg my-5">
                        <div className="card-body p-0">
                            <div className="row Login-container-image">
                                <div className="col-lg-6 d-none d-lg-block bg-login-image"></div>
                                <div className="col-lg-6">
                                    <div className="p-5">
                                        <div className="text-center">
                                            <h1 className="h4 text-gray-900 mb-4">Bienvenido</h1>
                                        </div>
                                        <form className="user" onSubmit={handleSubmit}>
                                            <div className="form-group">
                                                <input type="email" className="form-control form-control-user" aria-describedby="emailHelp" placeholder="Correo"
                                                    value={_correo}
                                                    onChange={(e) => set_Correo(e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div className="form-group Input-password">
                                                <input type={`${visiblePassword ? 'text' : 'password'}`} className="form-control form-control-user Input-login" placeholder="Contraseña"
                                                    value={_clave}
                                                    onChange={(e) => set_Clave(e.target.value)}
                                                    required
                                                />
                                                <button className="Button-visible" type="button" onClick={handleVisiblePassword}>
                                                    {visiblePassword ? (
                                                        <FaEyeSlash className="Button-icon" />
                                                    ) : (
                                                        <FaEye className="Button-icon" />
                                                    )}
                                                </button>
                                            </div>
                                            <button type="submit" className="btn btn-primary btn-user btn-block"> Ingresar </button>

                                        </form>
                                        <hr></hr>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Sucursal Selection Modal */}
            <SucursalSelectionModal 
                show={showSucursalModal}
                onClose={handleSucursalModalClose}
                onSucursalSelected={handleSucursalSelected}
            />
        </div>
    )
}

export default Login
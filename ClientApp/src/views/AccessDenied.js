import React from 'react';
import { Link } from 'react-router-dom';

const AccessDenied = () => {
    return (
        <div className="container-fluid">
            <div className="text-center">
                <div className="error mx-auto" data-text="403" style={{ fontSize: "6rem" }}>
                    <p className="m-0 text-danger">403</p>
                </div>
                <p className="text-gray-500 mb-0">Acceso Denegado</p>
                <p className="lead text-gray-800 mb-5">No tienes permisos para acceder a esta página</p>
                <p className="text-gray-500 mb-0">Contacta al administrador si necesitas acceso a esta funcionalidad</p>
                <Link to="/">&larr; Volver al inicio</Link>
            </div>
        </div>
    );
};

export default AccessDenied;
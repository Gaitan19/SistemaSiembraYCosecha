import React from "react";
import { Link, NavLink } from "react-router-dom";
import { usePermissions } from "../context/PermissionProvider";
import { FaTools } from "react-icons/fa";
const NavBar = () => {
  const { tienePermiso } = usePermissions();
  return (
    <ul
      className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion"
      id="accordionSidebar"
    >
      <Link
        className="sidebar-brand d-flex align-items-center justify-content-center"
        to="/"
      >
        <div className="sidebar-brand-icon">
          {/* <i className="fas fa-desktop"></i> */}
          <img src='/Batidos-logo.png' alt="Logo"  width={80} height={80}/>
        </div>
        <div className="sidebar-brand-text mx-3 d-none">SIEMBRAS & COSECHAS</div>
      </Link>

      <hr className="sidebar-divider my-0" />

      {tienePermiso("dashboard") && (
        <li className="nav-item">
          <NavLink to="/dashboard" className="nav-link">
            <i className="fas fa-fw fa-tachometer-alt"></i>
            <span>Dashboard</span>
          </NavLink>
        </li>
      )}

      <hr className="sidebar-divider" />
      {tienePermiso("usuarios") && (
        <li className="nav-item">
          <a
            className="nav-link collapsed"
            href="#!"
            data-toggle="collapse"
            data-target="#collapseUsuario"
            aria-expanded="true"
            aria-controls="collapseUsuario"
          >
            <i className="fas fa-fw fa-cog"></i>
            <span>Administracion</span>
          </a>
          <div
            id="collapseUsuario"
            className="collapse"
            aria-labelledby="headingTwo"
            data-parent="#accordionSidebar"
          >
            <div className="bg-white py-2 collapse-inner rounded">
              <NavLink to="/usuario" className="collapse-item">
                Usuarios
              </NavLink>
              {tienePermiso("sucursales") && (
                <NavLink to="/sucursal" className="collapse-item">
                  Sucursales
                </NavLink>
              )}
            </div>
          </div>
        </li>
      )}

      {(tienePermiso("productos") || tienePermiso("categorias") || tienePermiso("proveedores")) && (
        <li className="nav-item">
          <a
            className="nav-link collapsed"
            href="#!"
            data-toggle="collapse"
            data-target="#collapseInventario"
            aria-expanded="true"
            aria-controls="collapseInventario"
          >
            <i className="fas fa-fw fa-box"></i>
            <span>Inventario</span>
          </a>
          <div
            id="collapseInventario"
            className="collapse"
            aria-labelledby="headingUtilities"
            data-parent="#accordionSidebar"
          >
            <div className="bg-white py-2 collapse-inner rounded">
              {tienePermiso("productos") && (
                <NavLink to="/producto" className="collapse-item">
                  Productos
                </NavLink>
              )}
              {tienePermiso("categorias") && (
                <NavLink to="/categoria" className="collapse-item">
                  Categorias
                </NavLink>
              )}
              {tienePermiso("proveedores") && (
                <NavLink to="/proveedor" className="collapse-item">
                  Proveedores
                </NavLink>
              )}
            </div>
          </div>
        </li>
      )}

      {(tienePermiso("ventas") || tienePermiso("historialventas")) && (
        <li className="nav-item">
          <a
            className="nav-link collapsed"
            href="#!"
            data-toggle="collapse"
            data-target="#collapseVenta"
            aria-expanded="true"
            aria-controls="collapseVenta"
          >
            <i className="fas fa-fw fa-tag"></i>
            <span>Ventas</span>
          </a>
          <div
            id="collapseVenta"
            className="collapse"
            aria-labelledby="headingUtilities"
            data-parent="#accordionSidebar"
          >
            <div className="bg-white py-2 collapse-inner rounded">
              {tienePermiso("ventas") && (
                <NavLink to="/venta" className="collapse-item">
                  Nueva Venta
                </NavLink>
              )}
              {tienePermiso("historialventas") && (
                <NavLink to="/historialventa" className="collapse-item">
                  Historial Venta
                </NavLink>
              )}
            </div>
          </div>
        </li>
      )}

      {(tienePermiso("ingresos") || tienePermiso("egresos")) && (
        <li className="nav-item">
          <a
            className="nav-link collapsed"
            href="#!"
            data-toggle="collapse"
            data-target="#collapseFinanzas"
            aria-expanded="true"
            aria-controls="collapseFinanzas"
          >
            <i className="fas fa-fw fa-dollar-sign"></i>
            <span>Finanzas</span>
          </a>
          <div
            id="collapseFinanzas"
            className="collapse"
            aria-labelledby="headingUtilities"
            data-parent="#accordionSidebar"
          >
            <div className="bg-white py-2 collapse-inner rounded">
              {tienePermiso("ingresos") && (
                <NavLink to="/ingreso" className="collapse-item">
                  Ingresos
                </NavLink>
              )}
              {tienePermiso("egresos") && (
                <NavLink to="/egreso" className="collapse-item">
                  Egresos
                </NavLink>
              )}
            </div>
          </div>
        </li>
      )}

      {(tienePermiso("reportes") || tienePermiso("cierre")) && (
        <li className="nav-item">
          <a
            className="nav-link collapsed"
            href="#!"
            data-toggle="collapse"
            data-target="#collapseReporte"
            aria-expanded="true"
            aria-controls="collapseReporte"
          >
            <i className="fas fa-fw fa-chart-area"></i>
            <span>Reportes</span>
          </a>
          <div
            id="collapseReporte"
            className="collapse"
            aria-labelledby="headingUtilities"
            data-parent="#accordionSidebar"
          >
            <div className="bg-white py-2 collapse-inner rounded">
              {tienePermiso("reportes") && (
                <NavLink to="/reporteventa" className="collapse-item">
                  Reporte Venta
                </NavLink>
              )}
              {tienePermiso("cierre") && (
                <NavLink to="/cierre" className="collapse-item">
                  Cierre Contable
                </NavLink>
              )}
            </div>
          </div>
        </li>
      )}

      <hr className="sidebar-divider d-none d-md-block" />

      <div className="text-center d-none d-md-inline">
        <button className="rounded-circle border-0" id="sidebarToggle"></button>
      </div>
    </ul>
  );
};

export default NavBar;

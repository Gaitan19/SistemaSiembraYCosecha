import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import App from './App';
import Categoria from './views/Categoria';
import DashBoard from './views/DashBoard';
import HistorialVenta from './views/HistorialVenta';
import Inicio from './views/Inicio';
import NotFound from './views/NotFound';
import Producto from './views/Producto';
import ReporteVenta from './views/ReporteVenta';
import Cierre from './views/Cierre';
import Usuario from './views/Usuario';
import Venta from './views/Venta';
import Login from './views/Login';
import Ingreso from './views/Ingreso';
import Egreso from './views/Egreso';

import UserProvider from './context/UserProvider';
import PermissionProvider from './context/PermissionProvider';
import ProtectedRoute from './componentes/ProtectedRoute';
import AccessDenied from './views/AccessDenied';
import Proveedor from './views/Proveedor';

const root = ReactDOM.createRoot(document.getElementById('wrapper'));

root.render(
  <BrowserRouter>
    <UserProvider>
      <PermissionProvider>
        <Routes>
        {/*ACONTINUACION ESTABLECEMOS LAS RUTAS DE NUESTRO SISTEMA*/}

        {/*ruta individual sin usar una como base*/}
        <Route index path="/Login" element={<Login />} />

        {/*Permite anidar rutas en base a una*/}
        <Route path="/" element={<App />}>
          <Route index element={<Inicio />} />
          <Route
            path="dashboard"
            element={
              <ProtectedRoute requiredPermission="dashboard">
                <DashBoard />
              </ProtectedRoute>
            }
          />
          <Route
            path="usuario"
            element={
              <ProtectedRoute requiredPermission="usuarios">
                <Usuario />
              </ProtectedRoute>
            }
          />
          <Route
            path="proveedor"
            element={
              <ProtectedRoute requiredPermission="proveedores">
                <Proveedor />
              </ProtectedRoute>
            }
          />
          <Route
            path="producto"
            element={
              <ProtectedRoute requiredPermission="productos">
                <Producto />
              </ProtectedRoute>
            }
          />
          <Route
            path="categoria"
            element={
              <ProtectedRoute requiredPermission="categorias">
                <Categoria />
              </ProtectedRoute>
            }
          />
          <Route
            path="venta"
            element={
              <ProtectedRoute requiredPermission="ventas">
                <Venta />
              </ProtectedRoute>
            }
          />
          <Route
            path="historialventa"
            element={
              <ProtectedRoute requiredPermission="historialventas">
                <HistorialVenta />
              </ProtectedRoute>
            }
          />
          <Route
            path="reporteventa"
            element={
              <ProtectedRoute requiredPermission="reportes">
                <ReporteVenta />
              </ProtectedRoute>
            }
          />
          <Route
            path="cierre"
            element={
              <ProtectedRoute requiredPermission="cierre">
                <Cierre />
              </ProtectedRoute>
            }
          />
          <Route
            path="ingreso"
            element={
              <ProtectedRoute requiredPermission="ingresos">
                <Ingreso />
              </ProtectedRoute>
            }
          />
          <Route
            path="egreso"
            element={
              <ProtectedRoute requiredPermission="egresos">
                <Egreso />
              </ProtectedRoute>
            }
          />
          <Route path="access-denied" element={<AccessDenied />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      </PermissionProvider>
    </UserProvider>
  </BrowserRouter>
);

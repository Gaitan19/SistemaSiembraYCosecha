# Sistema de Permisos de Usuario - Documentación

## Resumen

Se implementó un sistema completo de permisos para usuarios que permite a los Administradores habilitar o deshabilitar el acceso a módulos específicos para usuarios de tipo "Empleado".

## Características Implementadas

### 1. Base de Datos
- **Tabla `Modulo`**: Define los módulos del sistema
- **Tabla `UsuarioPermiso`**: Gestiona permisos específicos por usuario y módulo
- **Script `consultas/permisos.sql`**: Crea las tablas y datos iniciales

### 2. Backend (ASP.NET Core)
- **Modelos**: `Modulo.cs`, `UsuarioPermiso.cs`
- **DTOs**: `DtoPermisos.cs` con estructuras para gestión de permisos
- **Repositorios**: `ModuloRepository`, `UsuarioPermisoRepository`
- **Controller**: `PermisosController` con endpoints para gestión de permisos
- **Actualización de contexto**: Incluye nuevas entidades en `DBREACT_VENTAContext`

### 3. Frontend (React)
- **Contexto de Permisos**: `PermissionProvider.js` para gestión de estado de permisos
- **Componente de Gestión**: `ModalPermisos.js` para administrar permisos de empleados
- **NavBar Dinámico**: Muestra módulos basado en permisos del usuario
- **Verificación de Usuario**: Carga permisos al iniciar sesión

## Módulos del Sistema

Los siguientes módulos pueden ser habilitados/deshabilitados para empleados:

1. **dashboard** - Panel de Control
2. **usuarios** - Gestión de Usuarios 
3. **productos** - Gestión de Productos
4. **categorias** - Gestión de Categorías
5. **proveedores** - Gestión de Proveedores
6. **ventas** - Módulo de Ventas
7. **historialventas** - Historial de Ventas
8. **ingresos** - Gestión de Ingresos
9. **egresos** - Gestión de Egresos
10. **reportes** - Reportes y Análisis
11. **cierre** - Cierre Contable

## Comportamiento por Tipo de Usuario

### Administradores
- Tienen acceso completo a todos los módulos
- Pueden gestionar permisos de empleados
- Ven botón de "Gestionar Permisos" (icono de llave) para empleados

### Empleados
- Solo acceden a módulos con permisos habilitados
- Por defecto: acceso a "ventas" e "historialventas"
- Los administradores pueden modificar sus permisos

## Endpoints de API

- `GET /api/permisos/Usuario/{idUsuario}` - Obtener permisos de un usuario
- `GET /api/permisos/Empleados` - Obtener permisos de todos los empleados
- `GET /api/permisos/Modulos` - Obtener lista de módulos
- `PUT /api/permisos/ActualizarPermisos` - Actualizar permisos de usuario

## Instalación y Configuración

1. **Ejecutar script de base de datos**:
   ```sql
   -- Ejecutar consultas/permisos.sql en la base de datos
   ```

2. **Backend se actualiza automáticamente** con los nuevos servicios registrados

3. **Frontend incluye los nuevos componentes** en la navegación

## Seguridad

- Solo usuarios autenticados pueden acceder
- Verificación de permisos tanto en frontend como backend
- Los administradores mantienen acceso completo
- Empleados sin permisos no ven los módulos en el menú

## Funcionalidad No Modificada

El sistema mantiene toda la funcionalidad existente:
- Sistema de autenticación
- Gestión de usuarios, productos, ventas, etc.
- SignalR para actualizaciones en tiempo real
- Exportación de datos
- Todos los módulos existentes funcionan igual
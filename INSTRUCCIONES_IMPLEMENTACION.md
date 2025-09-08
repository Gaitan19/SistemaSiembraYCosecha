# Instrucciones de Implementación del Sistema de Permisos

## Para el Desarrollador/Administrador

### 1. Ejecutar Script de Base de Datos

Ejecute el siguiente script en su base de datos SQL Server:

```sql
-- Ejecutar en DBREACT_VENTA
USE DBREACT_VENTA
GO

-- Crear tabla de módulos del sistema
CREATE TABLE Modulo(
    idModulo int primary key identity(1,1),
    nombre varchar(100) not null,
    descripcion varchar(200),
    esActivo bit default 1,
    fechaRegistro datetime default getdate()
)
GO

-- Crear tabla de permisos de usuario por módulo
CREATE TABLE UsuarioPermiso(
    idUsuarioPermiso int primary key identity(1,1),
    idUsuario int references Usuario(idUsuario),
    idModulo int references Modulo(idModulo),
    tienePermiso bit default 0,
    fechaRegistro datetime default getdate(),
    unique(idUsuario, idModulo)
)
GO

-- Insertar módulos del sistema
INSERT INTO Modulo(nombre, descripcion, esActivo) VALUES
('dashboard', 'Panel de Control', 1),
('usuarios', 'Gestión de Usuarios', 1),
('productos', 'Gestión de Productos', 1),
('categorias', 'Gestión de Categorías', 1),
('proveedores', 'Gestión de Proveedores', 1),
('ventas', 'Módulo de Ventas', 1),
('historialventas', 'Historial de Ventas', 1),
('ingresos', 'Gestión de Ingresos', 1),
('egresos', 'Gestión de Egresos', 1),
('reportes', 'Reportes y Análisis', 1),
('cierre', 'Cierre Contable', 1)
GO

-- Crear permisos iniciales para empleados existentes
INSERT INTO UsuarioPermiso(idUsuario, idModulo, tienePermiso)
SELECT u.idUsuario, m.idModulo, 
    CASE 
        WHEN m.nombre IN ('ventas', 'historialventas') THEN 1
        ELSE 0
    END as tienePermiso
FROM Usuario u
CROSS JOIN Modulo m
WHERE u.idRol = 2 -- Solo empleados
GO
```

### 2. Verificar Funcionamiento

Después de ejecutar el script:

1. **Compile y ejecute la aplicación**
2. **Inicie sesión como Administrador**
3. **Vaya a la sección "Usuarios"**
4. **Para usuarios tipo "Empleado"** verá un botón amarillo con icono de llave (🔑)
5. **Haga clic en el botón** para gestionar permisos
6. **Habilite/deshabilite módulos** según necesite
7. **Inicie sesión como Empleado** para verificar que solo ve los módulos permitidos

### 3. Uso del Sistema

#### Como Administrador:
- Ve todos los módulos en el menú lateral
- Puede gestionar permisos de empleados
- Botón "Gestionar Permisos" visible solo para empleados

#### Como Empleado:
- Solo ve módulos con permisos habilitados
- Por defecto: acceso a Ventas e Historial de Ventas
- Menú lateral se actualiza dinámicamente

### 4. Características Técnicas

- **Sistema basado en permisos granulares** por módulo
- **Interfaz de usuario reactiva** que se actualiza según permisos
- **Verificación tanto en frontend como backend**
- **Mantenimiento completo de funcionalidad existente**
- **Sistema de notificaciones con SweetAlert2**
- **Actualizaciones en tiempo real con SignalR**

### 5. Seguridad

- Los permisos se verifican en cada solicitud
- Usuarios sin permisos no pueden acceder a módulos restringidos
- Los administradores siempre mantienen acceso completo
- Sistema robusto contra manipulación del frontend

## Notas Importantes

- Los cambios no afectan la funcionalidad existente
- Todos los usuarios Administrador mantienen acceso completo
- El sistema es escalable para agregar nuevos módulos en el futuro
- Los permisos se persisten en base de datos
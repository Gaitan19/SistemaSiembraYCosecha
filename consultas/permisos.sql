-- Script para crear el sistema de permisos de usuarios
-- Tabla para gestionar permisos específicos por usuario

use DBREACT_VENTA
go

-- Crear tabla de módulos del sistema
create table Modulo(
    idModulo int primary key identity(1,1),
    nombre varchar(100) not null,
    descripcion varchar(200),
    esActivo bit default 1,
    fechaRegistro datetime default getdate()
)
go

-- Crear tabla de permisos de usuario por módulo
create table UsuarioPermiso(
    idUsuarioPermiso int primary key identity(1,1),
    idUsuario int references Usuario(idUsuario),
    idModulo int references Modulo(idModulo),
    tienePermiso bit default 0,
    fechaRegistro datetime default getdate(),
    unique(idUsuario, idModulo)
)
go

-- Insertar módulos del sistema
insert into Modulo(nombre, descripcion, esActivo) values
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
go

-- Obtener todos los usuarios de tipo Empleado y crear permisos por defecto
-- (solo acceso a ventas e historial de ventas por defecto)
insert into UsuarioPermiso(idUsuario, idModulo, tienePermiso)
select u.idUsuario, m.idModulo, 
    case 
        when m.nombre in ('ventas', 'historialventas') then 1
        else 0
    end as tienePermiso
from Usuario u
cross join Modulo m
where u.idRol = 2 -- Solo empleados
go
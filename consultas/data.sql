
use DBSiembra_VENTA
GO

--INSERTAR ROLES
insert into Rol(descripcion,esActivo) values ('Administrador',1)
insert into Rol(descripcion,esActivo) values ('Empleado',1)

go

--INSERTAR USUARIO
INSERT INTO Usuario(nombre,correo,telefono,idRol,clave,esActivo) values
('kenley','kenleyjos619@gmail.com','58083149',1,'$2a$11$dJAQ2kE2B2j8iaZcCKUyruRKZVJlTWICIwuV6Q0esdgaHhmlFbCGO',1),
('victor','victorR@gmail.com','87549961',2,'$2a$11$dJAQ2kE2B2j8iaZcCKUyruRKZVJlTWICIwuV6Q0esdgaHhmlFbCGO',1)


go
-- INSERTAR CATEGORÍAS
insert into Categoria(descripcion, esActivo) values 
('Herramientas Manuales', 1),
('Herramientas Eléctricas', 1),
('Materiales de Construcción', 1),
('Pinturas y Adhesivos', 1),
('Iluminación', 1),
('Accesorios de Plomería', 1);
go

-- INSERTAR NUEVAS CATEGORÍAS
insert into Categoria(descripcion, esActivo) values 
('Ferretería', 1),
('Equipos de Jardinería', 1),
('Material Eléctrico', 1),
('Seguridad Industrial', 1),
('Accesorios para Hogar', 1);
go


-- INSERTAR PRODUCTOS (corregido)
insert into Producto(nombre, descripcion, idCategoria, precio, esActivo) values
('Martillo', 'Martillo de acero 16oz', 1, 150.00, 1),
('Desarmador', 'Desarmador estrella', 1, 85.00, 1),
('Taladro', 'Taladro eléctrico 500W', 2, 1200.00, 1),
('Sierra Circular', 'Sierra circular 7 pulgadas', 2, 2200.00, 1),
('Cemento', 'Bolsa de cemento 50kg', 3, 250.00, 1),
('Lámina de Acero', 'Lámina de acero galvanizado', 3, 450.00, 1),
('Pintura Blanca', 'Pintura blanca 19L', 4, 900.00, 1),
('Adhesivo', 'Adhesivo industrial 1L', 4, 75.00, 1),
('Foco LED', 'Foco LED 9W', 5, 40.00, 1),
('Reflector LED', 'Reflector LED 20W', 5, 250.00, 1),
('Llave Mezcladora', 'Llave mezcladora de bronce', 6, 350.00, 1),
('Tubo de Cobre', 'Tubo de cobre 3/4 pulgada', 6, 180.00, 1);
go


insert into NumeroDocumento(id) values(0)



SELECT TOP 4 
    p.descripcion AS Producto,
    COUNT(*) AS Total
FROM 
    Producto p
JOIN 
    DetalleVenta dv ON p.idProducto = dv.idProducto
JOIN 
    Venta v ON dv.idVenta = v.idVenta
WHERE 
    v.fechaRegistro >= DATEADD(DAY, -30, GETDATE()) -- Filtra por ventas en los �ltimos 30 d�as
GROUP BY 
    p.descripcion
ORDER BY 
    COUNT(*) DESC;


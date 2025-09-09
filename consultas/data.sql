
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
insert into Producto(codigo, nombre, marca, descripcion, idCategoria, unidades, precio, esActivo) values
('H101A', 'Martillo', 'Truper', 'Martillo de acero 16oz', 1, 50, 150.00, 1),
('H102B', 'Desarmador', 'Stanley', 'Desarmador estrella', 1, 40, 85.00, 1),
('E201C', 'Taladro', 'DeWalt', 'Taladro eléctrico 500W', 2, 25, 1200.00, 1),
('E202D', 'Sierra Circular', 'Bosch', 'Sierra circular 7 pulgadas', 2, 15, 2200.00, 1),
('C301E', 'Cemento', 'Cemex', 'Bolsa de cemento 50kg', 3, 100, 250.00, 1),
('C302F', 'Lámina de Acero', 'Ternium', 'Lámina de acero galvanizado', 3, 30, 450.00, 1),
('P401G', 'Pintura Blanca', 'Comex', 'Pintura blanca 19L', 4, 20, 900.00, 1),
('P402H', 'Adhesivo', 'Resistol', 'Adhesivo industrial 1L', 4, 50, 75.00, 1),
('I501I', 'Foco LED', 'Philips', 'Foco LED 9W', 5, 100, 40.00, 1),
('I502J', 'Reflector LED', 'Osram', 'Reflector LED 20W', 5, 30, 250.00, 1),
('A601K', 'Llave Mezcladora', 'Rotoplas', 'Llave mezcladora de bronce', 6, 20, 350.00, 1),
('A602L', 'Tubo de Cobre', 'Nacobre', 'Tubo de cobre 3/4 pulgada', 6, 50, 180.00, 1);
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


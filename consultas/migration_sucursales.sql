-- Migration script to add Sucursal functionality to existing database
-- This script can be run on existing databases to add multi-branch support

USE DBSiembra_VENTA
GO

-- Step 1: Create Sucursal table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Sucursal' AND xtype='U')
BEGIN
    CREATE TABLE Sucursal(
        idSucursal int primary key identity(1,1),
        departamento varchar(100),
        direccion varchar(200),
        esActivo bit,
        fechaRegistro datetime default getdate()
    )
    
    -- Insert default sucursal
    INSERT INTO Sucursal(departamento, direccion, esActivo) 
    VALUES ('Principal', 'Dirección Principal', 1)
END
GO

-- Step 2: Add idSucursal column to Usuario table (nullable for compatibility)
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Usuario') AND name = 'idSucursal')
BEGIN
    ALTER TABLE Usuario ADD idSucursal int NULL
    
    -- Add foreign key constraint
    ALTER TABLE Usuario ADD CONSTRAINT FK_Usuario_Sucursal 
    FOREIGN KEY (idSucursal) REFERENCES Sucursal(idSucursal)
    
    -- Update existing users to default sucursal
    UPDATE Usuario SET idSucursal = 1 WHERE idSucursal IS NULL
END
GO

-- Step 3: Add idSucursal column to Producto table (nullable for compatibility)
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Producto') AND name = 'idSucursal')
BEGIN
    ALTER TABLE Producto ADD idSucursal int NULL
    
    -- Add foreign key constraint
    ALTER TABLE Producto ADD CONSTRAINT FK_Producto_Sucursal 
    FOREIGN KEY (idSucursal) REFERENCES Sucursal(idSucursal)
    
    -- Update existing products to default sucursal
    UPDATE Producto SET idSucursal = 1 WHERE idSucursal IS NULL
END
GO

-- Step 4: Add idSucursal column to Venta table (nullable for compatibility)
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Venta') AND name = 'idSucursal')
BEGIN
    ALTER TABLE Venta ADD idSucursal int NULL
    
    -- Add foreign key constraint
    ALTER TABLE Venta ADD CONSTRAINT FK_Venta_Sucursal 
    FOREIGN KEY (idSucursal) REFERENCES Sucursal(idSucursal)
    
    -- Update existing sales to default sucursal
    UPDATE Venta SET idSucursal = 1 WHERE idSucursal IS NULL
END
GO

-- Step 5: Add idSucursal column to Ingreso table (nullable for compatibility)
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Ingreso') AND name = 'idSucursal')
BEGIN
    ALTER TABLE Ingreso ADD idSucursal int NULL
    
    -- Add foreign key constraint
    ALTER TABLE Ingreso ADD CONSTRAINT FK_Ingreso_Sucursal 
    FOREIGN KEY (idSucursal) REFERENCES Sucursal(idSucursal)
    
    -- Update existing income records to default sucursal
    UPDATE Ingreso SET idSucursal = 1 WHERE idSucursal IS NULL
END
GO

-- Step 6: Add idSucursal column to Egreso table (nullable for compatibility)
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Egreso') AND name = 'idSucursal')
BEGIN
    ALTER TABLE Egreso ADD idSucursal int NULL
    
    -- Add foreign key constraint
    ALTER TABLE Egreso ADD CONSTRAINT FK_Egreso_Sucursal 
    FOREIGN KEY (idSucursal) REFERENCES Sucursal(idSucursal)
    
    -- Update existing expense records to default sucursal
    UPDATE Egreso SET idSucursal = 1 WHERE idSucursal IS NULL
END
GO

-- Step 7: Add idSucursal column to Proveedor table (nullable for compatibility)
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Proveedor') AND name = 'idSucursal')
BEGIN
    ALTER TABLE Proveedor ADD idSucursal int NULL
    
    -- Add foreign key constraint
    ALTER TABLE Proveedor ADD CONSTRAINT FK_Proveedor_Sucursal 
    FOREIGN KEY (idSucursal) REFERENCES Sucursal(idSucursal)
    
    -- Update existing providers to default sucursal
    UPDATE Proveedor SET idSucursal = 1 WHERE idSucursal IS NULL
END
GO

-- Step 8: Add idSucursal column to Categoria table (nullable for compatibility)
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Categoria') AND name = 'idSucursal')
BEGIN
    ALTER TABLE Categoria ADD idSucursal int NULL
    
    -- Add foreign key constraint
    ALTER TABLE Categoria ADD CONSTRAINT FK_Categoria_Sucursal 
    FOREIGN KEY (idSucursal) REFERENCES Sucursal(idSucursal)
    
    -- Update existing categories to default sucursal
    UPDATE Categoria SET idSucursal = 1 WHERE idSucursal IS NULL
END
GO

PRINT 'Migration completed successfully - Sucursal functionality added'
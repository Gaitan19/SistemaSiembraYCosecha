-- Add new columns to Ingreso table
ALTER TABLE Ingreso 
ADD actualizadoPor INT,
    esActivo BIT DEFAULT 1;

-- Add foreign key constraint for actualizadoPor in Ingreso table
ALTER TABLE Ingreso
ADD CONSTRAINT FK__Ingreso__actualizadoPor__72C60C4A 
FOREIGN KEY (actualizadoPor) REFERENCES Usuario(idUsuario);

-- Add new columns to Egreso table
ALTER TABLE Egreso 
ADD actualizadoPor INT,
    esActivo BIT DEFAULT 1;

-- Add foreign key constraint for actualizadoPor in Egreso table
ALTER TABLE Egreso
ADD CONSTRAINT FK__Egreso__actualizadoPor__75A278F5 
FOREIGN KEY (actualizadoPor) REFERENCES Usuario(idUsuario);

-- Update existing records to set esActivo = 1 (true)
UPDATE Ingreso SET esActivo = 1 WHERE esActivo IS NULL;
UPDATE Egreso SET esActivo = 1 WHERE esActivo IS NULL;

-- Ensure idProveedor column in Producto table allows NULL values
-- This modification may be needed if the column was created as NOT NULL
ALTER TABLE Producto ALTER COLUMN idProveedor INT NULL;

-- Add tipoCambio column to Venta table
ALTER TABLE Venta 
ADD tipoCambio DECIMAL(10,2);
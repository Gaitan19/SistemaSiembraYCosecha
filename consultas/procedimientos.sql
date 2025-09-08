use DBSiembra_VENTA
GO


create procedure sp_RegistrarVenta(
@documentoCliente varchar(40),
@nombreCliente varchar(40),
@tipoDocumento varchar(50),
@idUsuario int,
@subTotal decimal(10,2),
@impuestoTotal decimal(10,2),
@total decimal(10,2),
@productos xml,
@tipoPago varchar(50),
@tipoDinero varchar(50),
@numeroRuc varchar(50),
@montoPago decimal(10,2),
@vuelto decimal(10,2),
@nroDocumento varchar(6) output
)
as
begin
	declare @nrodocgenerado varchar(6)
	declare @nro int
	declare @idventa int

	declare @tbproductos table (
	IdProducto int,
	Cantidad int,
	Precio decimal(10,2),
	Total decimal(10,2)
	)

	BEGIN TRY
		BEGIN TRANSACTION

			insert into @tbproductos(IdProducto,Cantidad,Precio,Total)
			select 
				nodo.elemento.value('IdProducto[1]','int') as IdProducto,
				nodo.elemento.value('Cantidad[1]','int') as Cantidad,
				nodo.elemento.value('Precio[1]','decimal(10,2)') as Precio,
				nodo.elemento.value('Total[1]','decimal(10,2)') as Total
			from @productos.nodes('Productos/Item') nodo(elemento)

			update NumeroDocumento set
			@nro = id= id+1
			
			set @nrodocgenerado =  RIGHT('000000' + convert(varchar(max),@nro),6)

			insert into Venta(numeroDocumento,tipoDocumento,idUsuario,documentoCliente,nombreCliente,subTotal,impuestoTotal,total,tipoPago,tipoDinero,numeroRuc,montoPago,vuelto) 
			values (@nrodocgenerado,@tipoDocumento,@idUsuario,@documentoCliente,@nombreCliente,@subTotal,@impuestoTotal,@total,@tipoPago,@tipoDinero,@numeroRuc,@montoPago,@vuelto)


			set @idventa = SCOPE_IDENTITY()

			insert into DetalleVenta(idVenta,idProducto,cantidad,precio,total) 
			select @idventa,IdProducto,Cantidad,Precio,Total from @tbproductos

			update p set p.Stock = p.Stock - dv.Cantidad from PRODUCTO p
			inner join @tbproductos dv on dv.IdProducto = p.IdProducto

			-- Registrar ingreso con el monto que paga el cliente
			insert into Ingreso(descripcion,monto,tipoPago,tipoDinero,idUsuario,esActivo)
			values ('Pago de venta #' + @nrodocgenerado,@montoPago,@tipoPago,@tipoDinero,@idUsuario,1)

			-- Registrar egreso con el vuelto (solo si hay vuelto y no es transferencia)
			if @vuelto > 0 and @tipoPago != 'Transferencia'
			begin
				insert into Egreso(descripcion,monto,tipoPago,tipoDinero,idUsuario,esActivo)
				values ('Vuelto de venta #' + @nrodocgenerado,@vuelto,'Efectivo','Cordobas',@idUsuario,1)
			end

		COMMIT
		set @nroDocumento = @nrodocgenerado

	END TRY
	BEGIN CATCH
		ROLLBACK
		set @nroDocumento = ''
	END CATCH

end
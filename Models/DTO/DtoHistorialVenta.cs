namespace ReactVentas.Models.DTO
{
    public class DtoHistorialVenta
    {
        public string? FechaRegistro { get; set; }
        public string? NumeroDocumento { get; set; }
        public string? DocumentoCliente { get; set; }
        public string? NumeroRuc { get; set; }
        public string? NombreCliente { get; set; }
        public string? UsuarioRegistro { get; set; }
        public string? Total { get; set; }

        public List<DtoDetalleVenta> Detalle { get; set; }


    }
}

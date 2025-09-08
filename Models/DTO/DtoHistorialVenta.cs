namespace ReactVentas.Models.DTO
{
    public class DtoHistorialVenta
    {
        public string? FechaRegistro { get; set; }
        public string? HoraRegistro { get; set; }
        public string? NumeroDocumento { get; set; }
        public string? DocumentoCliente { get; set; }
        public string? NumeroRuc { get; set; }
        public string? NombreCliente { get; set; }
        public string? UsuarioRegistro { get; set; }
        public string? Total { get; set; }

        public string? TipoDinero { get; set; }

         public string? TipoPago { get; set; }

         public decimal? Vuelto { get; set; }

         public decimal? MontoPago { get; set; }

         public decimal? TipoCambio { get; set; }

        public List<DtoDetalleVenta> Detalle { get; set; }


    }
}

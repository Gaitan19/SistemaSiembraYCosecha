namespace ReactVentas.Models.DTO
{
    public class DtoCierre
    {
        public decimal TotalIngresos { get; set; }
        public decimal TotalEgresos { get; set; }
        public decimal SaldoCierre { get; set; }
        public string MonedaSimbolo { get; set; }
        public List<DtoIngresoFiltrado> Ingresos { get; set; }
        public List<DtoEgresoFiltrado> Egresos { get; set; }
    }

    public class DtoIngresoFiltrado
    {
        public int IdIngreso { get; set; }
        public string Descripcion { get; set; }
        public string FechaRegistro { get; set; }
        public string Monto { get; set; }
        public string TipoPago { get; set; }
        public string TipoDinero { get; set; }
        public string? NombreUsuario { get; set; }
    }

    public class DtoEgresoFiltrado
    {
        public int IdEgreso { get; set; }
        public string Descripcion { get; set; }
        public string FechaRegistro { get; set; }
        public string Monto { get; set; }
        public string TipoPago { get; set; }
        public string TipoDinero { get; set; }
        public string? NombreUsuario { get; set; }
    }
}
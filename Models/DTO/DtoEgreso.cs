namespace ReactVentas.Models.DTO
{
    public class DtoEgreso
    {
        public int IdEgreso { get; set; }
        public string Descripcion { get; set; }
        public string FechaRegistro { get; set; }
        public string Monto { get; set; }
        public string TipoPago { get; set; }
        public string TipoDinero { get; set; }
        public int IdUsuario { get; set; }
        public string? NombreUsuario { get; set; }
        public bool? EsActivo { get; set; }
    }
}
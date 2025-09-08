namespace ReactVentas.Models.DTO
{
    public class DtoUsuarioUpdate
    {
        public int IdUsuario { get; set; }
        public string? Nombre { get; set; }
        public string? Correo { get; set; }
        public string? Telefono { get; set; }
        public int? IdRol { get; set; }
        public bool? EsActivo { get; set; }
        public string? ClaveActual { get; set; }
        public string? ClaveNueva { get; set; }
    }
}
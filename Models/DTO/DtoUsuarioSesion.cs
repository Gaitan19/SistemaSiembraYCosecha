namespace ReactVentas.Models.DTO
{
    /// <summary>
    /// DTO for user session information returned after login
    /// </summary>
    public class DtoUsuarioSesion
    {
        public int IdUsuario { get; set; }
        public string? Nombre { get; set; }
        public string? Correo { get; set; }
        public string? Telefono { get; set; }
        public int? IdRol { get; set; }
        public string? DescripcionRol { get; set; }
        public int? IdSucursal { get; set; }
        public string? NombreSucursal { get; set; }
        public bool? EsActivo { get; set; }
        public bool EsAdministrador { get; set; }
    }
}
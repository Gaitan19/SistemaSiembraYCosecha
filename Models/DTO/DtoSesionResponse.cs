namespace ReactVentas.Models.DTO
{
    public class DtoSesionResponse
    {
        public int IdUsuario { get; set; }
        public string? Nombre { get; set; }
        public string? Correo { get; set; }
        public string? Telefono { get; set; }
        public int? IdRol { get; set; }
        public string? RolDescripcion { get; set; }
        public int? IdSucursal { get; set; }
        public string? SucursalDepartamento { get; set; }
        public string? SucursalDireccion { get; set; }
        public bool? EsActivo { get; set; }
        public bool EsAdministrador { get; set; }
    }
}
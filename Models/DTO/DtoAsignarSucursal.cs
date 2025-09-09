namespace ReactVentas.Models.DTO
{
    /// <summary>
    /// DTO for assigning or removing sucursal from a user
    /// </summary>
    public class DtoAsignarSucursal
    {
        public int IdUsuario { get; set; }
        public int? IdSucursal { get; set; }
    }
}
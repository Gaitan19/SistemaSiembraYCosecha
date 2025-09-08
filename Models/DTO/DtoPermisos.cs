namespace ReactVentas.Models.DTO
{
    public class DtoUsuarioPermiso
    {
        public int IdUsuario { get; set; }
        public string NombreUsuario { get; set; } = string.Empty;
        public List<DtoModuloPermiso> Permisos { get; set; } = new List<DtoModuloPermiso>();
    }

    public class DtoModuloPermiso
    {
        public int IdModulo { get; set; }
        public string NombreModulo { get; set; } = string.Empty;
        public string DescripcionModulo { get; set; } = string.Empty;
        public bool TienePermiso { get; set; }
    }

    public class DtoActualizarPermisos
    {
        public int IdUsuario { get; set; }
        public List<DtoPermisoActualizar> Permisos { get; set; } = new List<DtoPermisoActualizar>();
    }

    public class DtoPermisoActualizar
    {
        public int IdModulo { get; set; }
        public bool TienePermiso { get; set; }
    }

    public class DtoPermisoUsuario
    {
        public List<string> ModulosPermitidos { get; set; } = new List<string>();
        public bool EsAdministrador { get; set; }
    }
}
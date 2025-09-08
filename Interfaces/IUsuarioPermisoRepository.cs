using ReactVentas.Models;
using ReactVentas.Models.DTO;

namespace ReactVentas.Interfaces
{
    public interface IUsuarioPermisoRepository : IBaseRepository<UsuarioPermiso>
    {
        Task<List<UsuarioPermiso>> GetPermisosByUsuarioAsync(int idUsuario);
        Task<List<DtoUsuarioPermiso>> GetPermisosAllUsuariosEmpleadosAsync();
        Task<bool> ActualizarPermisosUsuarioAsync(DtoActualizarPermisos permisos);
        Task<DtoPermisoUsuario> GetPermisosUsuarioAsync(int idUsuario);
        Task CrearPermisosIniciales(int idUsuario);
    }
}
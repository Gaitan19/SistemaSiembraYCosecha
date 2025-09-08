using ReactVentas.Models;

namespace ReactVentas.Interfaces
{
    /// <summary>
    /// Interfaz del repositorio para operaciones de la entidad Rol
    /// </summary>
    public interface IRolRepository : IBaseRepository<Rol>
    {
        /// <summary>
        /// Obtiene roles con sus usuarios
        /// </summary>
        /// <returns>Lista de roles con usuarios</returns>
        Task<List<Rol>> GetRolesWithUsersAsync();
    }
}
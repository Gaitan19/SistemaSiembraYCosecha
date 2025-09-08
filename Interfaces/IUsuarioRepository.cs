using ReactVentas.Models;

namespace ReactVentas.Interfaces
{
    /// <summary>
    /// Interfaz del repositorio para operaciones de la entidad Usuario
    /// </summary>
    public interface IUsuarioRepository : IBaseRepository<Usuario>
    {
        /// <summary>
        /// Obtiene usuarios con su información de rol
        /// </summary>
        /// <returns>Lista de usuarios con datos de rol</returns>
        Task<List<Usuario>> GetUsersWithRoleAsync();

        /// <summary>
        /// Obtiene usuario por email
        /// </summary>
        /// <param name="email">Email del usuario</param>
        /// <returns>Usuario si se encuentra, null en caso contrario</returns>
        Task<Usuario?> GetByEmailAsync(string email);

        /// <summary>
        /// Obtiene usuarios por rol
        /// </summary>
        /// <param name="rolId">Identificador del rol</param>
        /// <returns>Lista de usuarios con el rol especificado</returns>
        Task<List<Usuario>> GetUsersByRoleAsync(int rolId);

        /// <summary>
        /// 

        Task<Usuario> GetUserWithRelatedDataByIdAsync(int id);

    }
}
using ReactVentas.Models;

namespace ReactVentas.Interfaces
{
    /// <summary>
    /// Interface for the Sucursal repository operations
    /// </summary>
    public interface ISucursalRepository : IBaseRepository<Sucursal>
    {
        /// <summary>
        /// Gets all active branches
        /// </summary>
        /// <returns>List of active branches</returns>
        Task<List<Sucursal>> GetActiveSucursalesAsync();
    }
}
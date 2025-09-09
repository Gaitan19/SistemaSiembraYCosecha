using ReactVentas.Models;

namespace ReactVentas.Interfaces
{
    /// <summary>
    /// Interface for Sucursal repository operations
    /// </summary>
    public interface ISucursalRepository : IBaseRepository<Sucursal>
    {
        /// <summary>
        /// Gets branches with their related entities (users, products, etc.)
        /// </summary>
        /// <returns>List of branches with related data</returns>
        Task<List<Sucursal>> GetSucursalesWithRelatedDataAsync();

        /// <summary>
        /// Gets active branches only
        /// </summary>
        /// <returns>List of active branches</returns>
        Task<List<Sucursal>> GetActiveSucursalesAsync();
    }
}